import asyncio
import logging
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from functools import partial
from html import escape

from app.config import settings

logger = logging.getLogger(__name__)


def _smtp_configured() -> bool:
    return bool(settings.SMTP_HOST and settings.SMTP_USER and settings.SMTP_PASS)


def send_email(to: str, subject: str, html_body: str) -> bool:
    """Send an email via SMTP. Returns True on success."""
    if not _smtp_configured():
        logger.debug("SMTP not configured, skipping email to %s", to)
        return False

    msg = MIMEMultipart("alternative")
    msg["From"] = settings.SMTP_FROM or settings.SMTP_USER
    msg["To"] = to
    msg["Subject"] = subject
    msg.attach(MIMEText(html_body, "html", "utf-8"))

    try:
        with smtplib.SMTP_SSL(settings.SMTP_HOST, settings.SMTP_PORT, timeout=15) as server:
            server.login(settings.SMTP_USER, settings.SMTP_PASS)
            server.send_message(msg)
        logger.info("Email sent to %s: %s", to, subject)
        return True
    except Exception:
        logger.exception("Failed to send email to %s", to)
        return False


async def send_email_async(to: str, subject: str, html_body: str) -> bool:
    """Non-blocking wrapper: runs SMTP in a thread executor."""
    loop = asyncio.get_running_loop()
    return await loop.run_in_executor(None, partial(send_email, to, subject, html_body))


def send_welcome_email(to: str, name: str) -> bool:
    safe_name = escape(name)
    return send_email(
        to,
        "Добро пожаловать в Дело Вкуса!",
        f"""
        <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:20px;">
            <h2 style="color:#be185d;">Добро пожаловать, {safe_name}!</h2>
            <p>Спасибо за регистрацию на платформе <strong>Дело Вкуса</strong>.</p>
            <p>Теперь вы можете приобрести наши курсы и техкарты
            в <a href="https://delovkusa.site/courses" style="color:#be185d;">каталоге</a>.</p>
            <hr style="border:none;border-top:1px solid #eee;margin:20px 0;" />
            <p style="color:#999;font-size:12px;">С любовью, Ирина Гордеева / Дело Вкуса</p>
        </div>
        """,
    )


async def send_welcome_email_async(to: str, name: str) -> bool:
    loop = asyncio.get_running_loop()
    return await loop.run_in_executor(None, partial(send_welcome_email, to, name))


def send_payment_success_email(to: str, name: str, course_title: str, amount: int) -> bool:
    safe_name = escape(name)
    safe_title = escape(course_title.replace('\n', '').replace('\r', '')[:100])
    return send_email(
        to,
        f"Оплата курса «{safe_title}» — подтверждение",
        f"""
        <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:20px;">
            <h2 style="color:#be185d;">Оплата подтверждена!</h2>
            <p>Здравствуйте, {safe_name}!</p>
            <p>Ваш заказ успешно оплачен:</p>
            <table style="width:100%;border-collapse:collapse;margin:15px 0;">
                <tr>
                    <td style="padding:8px;border-bottom:1px solid #eee;color:#666;">Курс</td>
                    <td style="padding:8px;border-bottom:1px solid #eee;font-weight:bold;">{safe_title}</td>
                </tr>
                <tr>
                    <td style="padding:8px;border-bottom:1px solid #eee;color:#666;">Сумма</td>
                    <td style="padding:8px;border-bottom:1px solid #eee;font-weight:bold;">{amount} ₽</td>
                </tr>
            </table>
            <p>Перейдите в <a href="https://delovkusa.site/dashboard/courses" style="color:#be185d;">личный кабинет</a>,
            чтобы начать обучение.</p>
            <hr style="border:none;border-top:1px solid #eee;margin:20px 0;" />
            <p style="color:#999;font-size:12px;">С любовью, Ирина Гордеева / Дело Вкуса</p>
        </div>
        """,
    )


async def send_payment_success_email_async(to: str, name: str, course_title: str, amount: int) -> bool:
    loop = asyncio.get_running_loop()
    return await loop.run_in_executor(None, partial(send_payment_success_email, to, name, course_title, amount))
