import hashlib
import hmac
import logging
import time

import httpx
from fastapi import APIRouter, Depends, HTTPException, Response, Request, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from slowapi import Limiter
from slowapi.util import get_remote_address

from app.database import get_db
from app.models import User
from app.config import settings
from app.schemas import (
    RegisterRequest, LoginRequest, TokenResponse,
    GoogleAuthRequest, TelegramAuthRequest, ProfileResponse,
)
from app.auth import (
    hash_password, verify_password,
    create_access_token, create_refresh_token, decode_token,
    get_current_user,
)

router = APIRouter(prefix="/api/auth", tags=["auth"])
limiter = Limiter(key_func=get_remote_address)
logger = logging.getLogger(__name__)


# ==========================================
# Register
# ==========================================

@router.post("/register", response_model=TokenResponse)
@limiter.limit("10/minute")
async def register(
    request: Request,
    data: RegisterRequest,
    response: Response,
    db: AsyncSession = Depends(get_db),
):
    # Check if email already exists
    result = await db.execute(select(User).where(User.email == data.email))
    if result.scalar_one_or_none():
        raise HTTPException(status_code=400, detail="Пользователь с таким email уже зарегистрирован")

    user = User(
        email=data.email,
        password_hash=hash_password(data.password),
        name=data.name,
        auth_provider="email",
    )
    db.add(user)
    await db.commit()
    await db.refresh(user)

    access_token = create_access_token(user.id)
    refresh_token = create_refresh_token(user.id)

    response.set_cookie(
        key="refresh_token",
        value=refresh_token,
        httponly=True,
        secure=settings.COOKIE_SECURE,
        samesite="lax",
        path="/api/auth",
        max_age=7 * 24 * 3600,
    )

    return TokenResponse(access_token=access_token)


# ==========================================
# Login
# ==========================================

@router.post("/login", response_model=TokenResponse)
@limiter.limit("10/minute")
async def login(
    request: Request,
    data: LoginRequest,
    response: Response,
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(select(User).where(User.email == data.email))
    user = result.scalar_one_or_none()

    if not user or not user.password_hash or not verify_password(data.password, user.password_hash):
        logger.warning("Failed login attempt for email=%s ip=%s", data.email, request.client.host if request.client else "unknown")
        raise HTTPException(status_code=401, detail="Неверный email или пароль")

    if not user.is_active:
        logger.warning("Deactivated account login attempt: user_id=%s", user.id)
        raise HTTPException(status_code=403, detail="Аккаунт деактивирован")

    access_token = create_access_token(user.id)
    refresh_token = create_refresh_token(user.id)

    response.set_cookie(
        key="refresh_token",
        value=refresh_token,
        httponly=True,
        secure=settings.COOKIE_SECURE,
        samesite="lax",
        path="/api/auth",
        max_age=7 * 24 * 3600,
    )

    return TokenResponse(access_token=access_token)


# ==========================================
# Refresh Token
# ==========================================

@router.post("/refresh", response_model=TokenResponse)
async def refresh_token(request: Request, response: Response, db: AsyncSession = Depends(get_db)):
    token = request.cookies.get("refresh_token")
    if not token:
        raise HTTPException(status_code=401, detail="No refresh token")

    user_id = decode_token(token, expected_type="refresh")
    if user_id is None:
        raise HTTPException(status_code=401, detail="Invalid refresh token")

    result = await db.execute(select(User).where(User.id == user_id, User.is_active == True))
    user = result.scalar_one_or_none()
    if not user:
        raise HTTPException(status_code=401, detail="User not found")

    new_access = create_access_token(user.id)
    new_refresh = create_refresh_token(user.id)

    response.set_cookie(
        key="refresh_token",
        value=new_refresh,
        httponly=True,
        secure=settings.COOKIE_SECURE,
        samesite="lax",
        path="/api/auth",
        max_age=7 * 24 * 3600,
    )

    return TokenResponse(access_token=new_access)


# ==========================================
# Profile
# ==========================================

@router.get("/me", response_model=ProfileResponse)
async def get_profile(user: User = Depends(get_current_user)):
    return ProfileResponse(
        id=user.id,
        email=user.email,
        name=user.name,
        is_admin=user.is_admin,
        auth_provider=user.auth_provider,
        created_at=user.created_at,
    )


# ==========================================
# Logout
# ==========================================

@router.post("/logout")
async def logout(response: Response):
    response.delete_cookie(key="refresh_token", path="/api/auth")
    return {"ok": True}


# ==========================================
# Google OAuth
# ==========================================

async def _verify_google_token(credential: str) -> dict | None:
    async with httpx.AsyncClient(timeout=10) as client:
        resp = await client.get(
            f"https://oauth2.googleapis.com/tokeninfo?id_token={credential}"
        )
        if resp.status_code != 200:
            return None
        payload = resp.json()
        if payload.get("aud") != settings.GOOGLE_CLIENT_ID:
            return None
        if payload.get("email_verified") != "true":
            return None
        return payload


@router.post("/google", response_model=TokenResponse)
@limiter.limit("10/minute")
async def auth_google(
    request: Request,
    data: GoogleAuthRequest,
    response: Response,
    db: AsyncSession = Depends(get_db),
):
    if not settings.GOOGLE_CLIENT_ID:
        raise HTTPException(status_code=501, detail="Google вход не настроен")

    google_info = await _verify_google_token(data.credential)
    if not google_info:
        raise HTTPException(status_code=401, detail="Неверный Google токен")

    google_id = google_info["sub"]
    email = google_info["email"]
    name = google_info.get("name", email.split("@")[0])

    # Find by google_id
    result = await db.execute(select(User).where(User.google_id == google_id))
    user = result.scalar_one_or_none()

    if not user:
        # Try by email (link accounts)
        result = await db.execute(select(User).where(User.email == email))
        user = result.scalar_one_or_none()
        if user:
            user.google_id = google_id
            if not user.auth_provider:
                user.auth_provider = "email"
            await db.commit()
        else:
            # Create new user
            user = User(
                email=email,
                name=name,
                google_id=google_id,
                auth_provider="google",
            )
            db.add(user)
            await db.commit()
            await db.refresh(user)

    if not user.is_active:
        raise HTTPException(status_code=403, detail="Аккаунт деактивирован")

    access_token = create_access_token(user.id)
    refresh_token = create_refresh_token(user.id)

    response.set_cookie(
        key="refresh_token",
        value=refresh_token,
        httponly=True,
        secure=settings.COOKIE_SECURE,
        samesite="lax",
        path="/api/auth",
        max_age=7 * 24 * 3600,
    )

    return TokenResponse(access_token=access_token)


# ==========================================
# Telegram Login
# ==========================================

def _verify_telegram_auth(data: TelegramAuthRequest, bot_token: str) -> bool:
    check_data = {
        "id": data.id,
        "first_name": data.first_name,
    }
    if data.last_name:
        check_data["last_name"] = data.last_name
    if data.username:
        check_data["username"] = data.username
    if data.photo_url:
        check_data["photo_url"] = data.photo_url
    check_data["auth_date"] = data.auth_date

    data_check_string = "\n".join(
        f"{k}={v}" for k, v in sorted(check_data.items())
    )
    secret_key = hashlib.sha256(bot_token.encode()).digest()
    computed_hash = hmac.new(
        secret_key, data_check_string.encode(), hashlib.sha256
    ).hexdigest()
    return hmac.compare_digest(computed_hash, data.hash)


@router.post("/telegram", response_model=TokenResponse)
@limiter.limit("10/minute")
async def auth_telegram(
    request: Request,
    data: TelegramAuthRequest,
    response: Response,
    db: AsyncSession = Depends(get_db),
):
    if not settings.TELEGRAM_BOT_TOKEN_LOGIN:
        raise HTTPException(status_code=501, detail="Telegram вход не настроен")

    # Reject data older than 5 minutes (no future dates)
    age = time.time() - data.auth_date
    if age > 300 or age < 0:
        raise HTTPException(status_code=400, detail="Данные авторизации устарели")

    if not _verify_telegram_auth(data, settings.TELEGRAM_BOT_TOKEN_LOGIN):
        raise HTTPException(status_code=401, detail="Неверные данные Telegram авторизации")

    # Find existing user by telegram_id
    result = await db.execute(select(User).where(User.telegram_id == data.id))
    user = result.scalar_one_or_none()

    if not user:
        tg_email = f"tg_{data.id}@telegram.user"
        user = User(
            email=tg_email,
            name=data.first_name + (f" {data.last_name}" if data.last_name else ""),
            telegram_id=data.id,
            auth_provider="telegram",
        )
        db.add(user)
        await db.commit()
        await db.refresh(user)
    elif not user.is_active:
        raise HTTPException(status_code=403, detail="Аккаунт деактивирован")

    access_token = create_access_token(user.id)
    refresh_token_value = create_refresh_token(user.id)

    response.set_cookie(
        key="refresh_token",
        value=refresh_token_value,
        httponly=True,
        secure=settings.COOKIE_SECURE,
        samesite="lax",
        path="/api/auth",
        max_age=7 * 24 * 3600,
    )

    return TokenResponse(access_token=access_token)
