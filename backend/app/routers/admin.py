import datetime
import logging

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import select, func, case, extract
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.models import User, Course, Order, UserCourseAccess
from app.auth import get_current_user

router = APIRouter(prefix="/api/admin", tags=["admin"])
logger = logging.getLogger(__name__)


async def require_admin(user: User = Depends(get_current_user)) -> User:
    if not user.is_admin:
        raise HTTPException(status_code=403, detail="Доступ запрещён")
    return user


# ── Users ───────────────────────────────────────────────────────────────

@router.get("/users")
async def list_users(
    page: int = Query(1, ge=1),
    per_page: int = Query(20, ge=1, le=100),
    search: str = Query("", max_length=100),
    admin: User = Depends(require_admin),
    db: AsyncSession = Depends(get_db),
):
    q = select(User).order_by(User.created_at.desc())
    count_q = select(func.count(User.id))

    if search:
        like = f"%{search}%"
        q = q.where(User.email.ilike(like) | User.name.ilike(like))
        count_q = count_q.where(User.email.ilike(like) | User.name.ilike(like))

    total = (await db.execute(count_q)).scalar() or 0
    rows = (await db.execute(q.offset((page - 1) * per_page).limit(per_page))).scalars().all()

    return {
        "total": total,
        "page": page,
        "per_page": per_page,
        "users": [
            {
                "id": u.id,
                "email": u.email,
                "name": u.name,
                "phone": u.phone,
                "auth_provider": u.auth_provider,
                "is_admin": u.is_admin,
                "is_active": u.is_active,
                "created_at": u.created_at.isoformat() if u.created_at else None,
            }
            for u in rows
        ],
    }


# ── Orders ──────────────────────────────────────────────────────────────

@router.get("/orders")
async def list_orders(
    page: int = Query(1, ge=1),
    per_page: int = Query(20, ge=1, le=100),
    status: str = Query("", max_length=30),
    admin: User = Depends(require_admin),
    db: AsyncSession = Depends(get_db),
):
    q = (
        select(Order, User.email, User.name, Course.title)
        .join(User, User.id == Order.user_id)
        .join(Course, Course.id == Order.course_id)
        .order_by(Order.created_at.desc())
    )
    count_q = select(func.count(Order.id))

    if status:
        q = q.where(Order.status == status)
        count_q = count_q.where(Order.status == status)

    total = (await db.execute(count_q)).scalar() or 0
    rows = (await db.execute(q.offset((page - 1) * per_page).limit(per_page))).all()

    return {
        "total": total,
        "page": page,
        "per_page": per_page,
        "orders": [
            {
                "id": o.id,
                "user_email": email,
                "user_name": uname,
                "course_title": ctitle,
                "course_id": o.course_id,
                "amount": o.amount,
                "status": o.status,
                "yookassa_payment_id": o.yookassa_payment_id,
                "created_at": o.created_at.isoformat() if o.created_at else None,
            }
            for o, email, uname, ctitle in rows
        ],
    }


# ── Grant / Revoke access ──────────────────────────────────────────────

@router.post("/users/{user_id}/grant-course")
async def grant_course_access(
    user_id: int,
    course_id: str = Query(..., max_length=50),
    admin: User = Depends(require_admin),
    db: AsyncSession = Depends(get_db),
):
    # Verify user exists
    u = (await db.execute(select(User).where(User.id == user_id))).scalar_one_or_none()
    if not u:
        raise HTTPException(status_code=404, detail="Пользователь не найден")

    # Verify course exists
    c = (await db.execute(select(Course).where(Course.id == course_id))).scalar_one_or_none()
    if not c:
        raise HTTPException(status_code=404, detail="Курс не найден")

    # Check if already has access
    existing = (await db.execute(
        select(UserCourseAccess).where(
            UserCourseAccess.user_id == user_id,
            UserCourseAccess.course_id == course_id,
        )
    )).scalar_one_or_none()
    if existing:
        return {"status": "already_granted"}

    db.add(UserCourseAccess(user_id=user_id, course_id=course_id))
    await db.commit()
    logger.info("Admin %s granted course %s to user %s", admin.id, course_id, user_id)
    return {"status": "granted"}


@router.delete("/users/{user_id}/revoke-course")
async def revoke_course_access(
    user_id: int,
    course_id: str = Query(..., max_length=50),
    admin: User = Depends(require_admin),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(UserCourseAccess).where(
            UserCourseAccess.user_id == user_id,
            UserCourseAccess.course_id == course_id,
        )
    )
    access = result.scalar_one_or_none()
    if not access:
        raise HTTPException(status_code=404, detail="Доступ не найден")

    await db.delete(access)
    await db.commit()
    logger.info("Admin %s revoked course %s from user %s", admin.id, course_id, user_id)
    return {"status": "revoked"}


# ── User's courses ─────────────────────────────────────────────────────

@router.get("/users/{user_id}/courses")
async def get_user_courses(
    user_id: int,
    admin: User = Depends(require_admin),
    db: AsyncSession = Depends(get_db),
):
    rows = (await db.execute(
        select(UserCourseAccess.course_id, Course.title, UserCourseAccess.granted_at)
        .join(Course, Course.id == UserCourseAccess.course_id)
        .where(UserCourseAccess.user_id == user_id)
    )).all()

    return {
        "courses": [
            {"course_id": cid, "title": t, "granted_at": g.isoformat() if g else None}
            for cid, t, g in rows
        ]
    }


# ── Stats / Analytics ──────────────────────────────────────────────────

@router.get("/stats")
async def get_stats(
    admin: User = Depends(require_admin),
    db: AsyncSession = Depends(get_db),
):
    total_users = (await db.execute(select(func.count(User.id)))).scalar() or 0
    total_orders = (await db.execute(
        select(func.count(Order.id)).where(Order.status == "succeeded")
    )).scalar() or 0
    total_revenue = (await db.execute(
        select(func.coalesce(func.sum(Order.amount), 0)).where(Order.status == "succeeded")
    )).scalar() or 0

    # Revenue by course
    course_stats = (await db.execute(
        select(
            Course.title,
            Order.course_id,
            func.count(Order.id),
            func.coalesce(func.sum(Order.amount), 0),
        )
        .join(Course, Course.id == Order.course_id)
        .where(Order.status == "succeeded")
        .group_by(Course.title, Order.course_id)
    )).all()

    # Revenue last 30 days by day
    thirty_days_ago = datetime.datetime.now(datetime.timezone.utc) - datetime.timedelta(days=30)
    daily_revenue = (await db.execute(
        select(
            func.date(Order.created_at).label("day"),
            func.count(Order.id),
            func.coalesce(func.sum(Order.amount), 0),
        )
        .where(Order.status == "succeeded", Order.created_at >= thirty_days_ago)
        .group_by(func.date(Order.created_at))
        .order_by(func.date(Order.created_at))
    )).all()

    # New users last 30 days by day
    daily_registrations = (await db.execute(
        select(
            func.date(User.created_at).label("day"),
            func.count(User.id),
        )
        .where(User.created_at >= thirty_days_ago)
        .group_by(func.date(User.created_at))
        .order_by(func.date(User.created_at))
    )).all()

    return {
        "total_users": total_users,
        "total_orders": total_orders,
        "total_revenue": total_revenue,
        "course_stats": [
            {"title": t, "course_id": cid, "orders": cnt, "revenue": rev}
            for t, cid, cnt, rev in course_stats
        ],
        "daily_revenue": [
            {"date": str(d), "orders": cnt, "revenue": rev}
            for d, cnt, rev in daily_revenue
        ],
        "daily_registrations": [
            {"date": str(d), "count": cnt}
            for d, cnt in daily_registrations
        ],
    }


# ── All courses list ───────────────────────────────────────────────────

@router.get("/courses")
async def list_courses(
    admin: User = Depends(require_admin),
    db: AsyncSession = Depends(get_db),
):
    rows = (await db.execute(select(Course).order_by(Course.created_at.desc()))).scalars().all()
    return {
        "courses": [
            {
                "id": c.id,
                "title": c.title,
                "price": c.price,
                "product_type": c.product_type,
                "is_active": c.is_active,
            }
            for c in rows
        ]
    }
