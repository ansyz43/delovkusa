import ipaddress
import logging
import uuid

from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.config import settings
from app.database import get_db
from app.models import Course, Order, UserCourseAccess, User
from app.auth import get_current_user
from app.schemas import CreatePaymentRequest, CreatePaymentResponse, OrderStatusResponse
from app.email_utils import send_payment_success_email_async
from app.seed import BUNDLES_MAP

router = APIRouter(prefix="/api/payments", tags=["payments"])
logger = logging.getLogger(__name__)

# YooKassa webhook source IP ranges
_YOOKASSA_NETS = [
    ipaddress.ip_network("185.71.76.0/27"),
    ipaddress.ip_network("185.71.77.0/27"),
    ipaddress.ip_network("77.75.153.0/25"),
    ipaddress.ip_network("77.75.154.128/25"),
]


@router.post("/create", response_model=CreatePaymentResponse)
async def create_payment(
    data: CreatePaymentRequest,
    user=Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    # Check course exists
    result = await db.execute(select(Course).where(Course.id == data.course_id, Course.is_active == True))
    course = result.scalar_one_or_none()
    if not course:
        raise HTTPException(status_code=404, detail="Курс не найден")

    # Check if user already has access
    result = await db.execute(
        select(UserCourseAccess).where(
            UserCourseAccess.user_id == user.id,
            UserCourseAccess.course_id == data.course_id,
        )
    )
    if result.scalar_one_or_none():
        raise HTTPException(status_code=400, detail="У вас уже есть доступ к этому курсу")

    # Create order
    order = Order(
        user_id=user.id,
        course_id=course.id,
        amount=course.price,
        status="pending",
    )
    db.add(order)
    await db.commit()
    await db.refresh(order)

    # Create YooKassa payment
    if not settings.YOOKASSA_SHOP_ID or not settings.YOOKASSA_SECRET_KEY:
        raise HTTPException(status_code=503, detail="Платёжная система не настроена")

    from yookassa import Configuration, Payment
    Configuration.account_id = settings.YOOKASSA_SHOP_ID
    Configuration.secret_key = settings.YOOKASSA_SECRET_KEY

    payment = Payment.create({
        "amount": {"value": f"{course.price}.00", "currency": "RUB"},
        "confirmation": {
            "type": "redirect",
            "return_url": f"{settings.YOOKASSA_RETURN_URL}?order_id={order.id}",
        },
        "capture": True,
        "description": f"Курс: {course.title}",
        "metadata": {"order_id": str(order.id), "user_id": str(user.id)},
    }, idempotency_key=str(uuid.uuid4()))

    order.yookassa_payment_id = payment.id
    await db.commit()

    logger.info("Payment created: order_id=%s payment_id=%s user=%s course=%s",
                order.id, payment.id, user.id, course.id)

    return CreatePaymentResponse(
        order_id=order.id,
        confirmation_url=payment.confirmation.confirmation_url,
    )


@router.post("/webhook")
async def yookassa_webhook(request: Request, db: AsyncSession = Depends(get_db)):
    """YooKassa webhook — called when payment status changes."""
    # Verify source IP is from YooKassa
    client_ip_str = request.headers.get("x-real-ip") or (
        request.client.host if request.client else None
    )
    if client_ip_str:
        try:
            client_ip = ipaddress.ip_address(client_ip_str)
            if not any(client_ip in net for net in _YOOKASSA_NETS):
                logger.warning("Webhook rejected: untrusted IP %s", client_ip_str)
                raise HTTPException(status_code=403, detail="Forbidden")
        except ValueError:
            raise HTTPException(status_code=403, detail="Forbidden")
    else:
        raise HTTPException(status_code=403, detail="Forbidden")

    body = await request.json()
    event_type = body.get("event")
    payment_data = body.get("object", {})
    payment_id = payment_data.get("id")

    if not payment_id:
        return {"status": "ignored"}

    # Verify payment status via YooKassa API
    if not settings.YOOKASSA_SHOP_ID or not settings.YOOKASSA_SECRET_KEY:
        logger.error("Webhook received but YooKassa not configured")
        return {"status": "error"}

    from yookassa import Configuration, Payment as YKPayment
    Configuration.account_id = settings.YOOKASSA_SHOP_ID
    Configuration.secret_key = settings.YOOKASSA_SECRET_KEY

    try:
        yk_payment = YKPayment.find_one(payment_id)
    except Exception:
        logger.exception("Failed to verify payment %s", payment_id)
        return {"status": "error"}

    # Find order
    result = await db.execute(
        select(Order).where(Order.yookassa_payment_id == payment_id)
    )
    order = result.scalar_one_or_none()
    if not order:
        logger.warning("Webhook: order not found for payment_id=%s", payment_id)
        return {"status": "ignored"}

    # Update order status
    if yk_payment.status == "succeeded" and order.status != "succeeded":
        order.status = "succeeded"
        # Grant access (idempotent via unique constraint)
        existing = await db.execute(
            select(UserCourseAccess).where(
                UserCourseAccess.user_id == order.user_id,
                UserCourseAccess.course_id == order.course_id,
            )
        )
        if not existing.scalar_one_or_none():
            db.add(UserCourseAccess(
                user_id=order.user_id,
                course_id=order.course_id,
                order_id=order.id,
            ))

        # Если это комплект — раздать доступ ко всем входящим курсам (идемпотентно)
        if order.course_id in BUNDLES_MAP:
            for sub_course_id in BUNDLES_MAP[order.course_id]:
                sub_existing = await db.execute(
                    select(UserCourseAccess).where(
                        UserCourseAccess.user_id == order.user_id,
                        UserCourseAccess.course_id == sub_course_id,
                    )
                )
                if not sub_existing.scalar_one_or_none():
                    db.add(UserCourseAccess(
                        user_id=order.user_id,
                        course_id=sub_course_id,
                        order_id=order.id,
                    ))
        await db.commit()
        logger.info("Access granted: user=%s course=%s order=%s", order.user_id, order.course_id, order.id)

        # Send payment confirmation email (non-blocking)
        try:
            buyer = (await db.execute(select(User).where(User.id == order.user_id))).scalar_one_or_none()
            course = (await db.execute(select(Course).where(Course.id == order.course_id))).scalar_one_or_none()
            if buyer and course:
                await send_payment_success_email_async(buyer.email, buyer.name, course.title, order.amount)
        except Exception:
            logger.exception("Failed to send payment email for order %s", order.id)

    elif yk_payment.status == "canceled" and order.status == "pending":
        order.status = "canceled"
        await db.commit()
        logger.info("Payment canceled: order=%s", order.id)

    return {"status": "ok"}


@router.get("/status/{order_id}", response_model=OrderStatusResponse)
async def get_order_status(
    order_id: int,
    user=Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(Order).where(Order.id == order_id, Order.user_id == user.id)
    )
    order = result.scalar_one_or_none()
    if not order:
        raise HTTPException(status_code=404, detail="Заказ не найден")

    # If still pending, check with YooKassa
    if order.status == "pending" and order.yookassa_payment_id:
        if settings.YOOKASSA_SHOP_ID and settings.YOOKASSA_SECRET_KEY:
            from yookassa import Configuration, Payment as YKPayment
            Configuration.account_id = settings.YOOKASSA_SHOP_ID
            Configuration.secret_key = settings.YOOKASSA_SECRET_KEY

            try:
                yk_payment = YKPayment.find_one(order.yookassa_payment_id)
                if yk_payment.status == "succeeded":
                    order.status = "succeeded"
                    existing = await db.execute(
                        select(UserCourseAccess).where(
                            UserCourseAccess.user_id == order.user_id,
                            UserCourseAccess.course_id == order.course_id,
                        )
                    )
                    if not existing.scalar_one_or_none():
                        db.add(UserCourseAccess(
                            user_id=order.user_id,
                            course_id=order.course_id,
                            order_id=order.id,
                        ))
                    # Комплект — раздать вложенные курсы
                    if order.course_id in BUNDLES_MAP:
                        for sub_course_id in BUNDLES_MAP[order.course_id]:
                            sub_existing = await db.execute(
                                select(UserCourseAccess).where(
                                    UserCourseAccess.user_id == order.user_id,
                                    UserCourseAccess.course_id == sub_course_id,
                                )
                            )
                            if not sub_existing.scalar_one_or_none():
                                db.add(UserCourseAccess(
                                    user_id=order.user_id,
                                    course_id=sub_course_id,
                                    order_id=order.id,
                                ))
                    await db.commit()
                elif yk_payment.status == "canceled":
                    order.status = "canceled"
                    await db.commit()
            except Exception:
                logger.exception("Failed to check payment status")

    return OrderStatusResponse(
        order_id=order.id,
        status=order.status,
        course_id=order.course_id,
    )
