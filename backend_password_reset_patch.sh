#!/bin/bash
# Патч добавляет восстановление и смену пароля.
# Запускать на сервере: bash backend_password_reset_patch.sh

set -e
cd /var/www/delovkusa/backend

# 1) Расширяем schemas.py
cat >> app/schemas.py <<'EOF'


# --- Password reset / change ---

class PasswordResetRequest(BaseModel):
    email: EmailStr


class PasswordResetConfirm(BaseModel):
    token: str
    new_password: str = Field(min_length=8, max_length=128)


class PasswordChangeRequest(BaseModel):
    current_password: str
    new_password: str = Field(min_length=8, max_length=128)


class OkResponse(BaseModel):
    ok: bool = True
EOF

# 2) Расширяем auth.py — добавляем функции для password-reset токенов
cat >> app/auth.py <<'EOF'


def create_password_reset_token(user_id: int) -> str:
    """JWT для сброса пароля. TTL 1 час, type=password_reset."""
    expire = datetime.datetime.now(datetime.timezone.utc) + datetime.timedelta(hours=1)
    return jwt.encode(
        {"sub": str(user_id), "exp": expire, "type": "password_reset"},
        settings.SECRET_KEY,
        algorithm=ALGORITHM,
    )
EOF

# 3) Добавляем email-helper для письма со ссылкой сброса
cat >> app/email_utils.py <<'EOF'


def send_password_reset_email(to: str, name: str, reset_url: str) -> bool:
    safe_name = escape(name or "")
    safe_url = escape(reset_url, quote=True)
    return send_email(
        to,
        "Восстановление пароля — Дело Вкуса",
        f"""
        <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:20px;">
            <h2 style="color:#be185d;">Восстановление пароля</h2>
            <p>Здравствуйте{', ' + safe_name if safe_name else ''}!</p>
            <p>Мы получили запрос на восстановление пароля для вашей учётной записи на платформе
            <strong>Дело Вкуса</strong>.</p>
            <p style="margin:24px 0;">
                <a href="{safe_url}"
                   style="display:inline-block;background:#be185d;color:#fff;padding:12px 24px;
                          border-radius:8px;text-decoration:none;font-weight:600;">
                    Сбросить пароль
                </a>
            </p>
            <p style="color:#666;font-size:13px;">Ссылка действует 1 час. Если кнопка не работает,
            скопируйте адрес: <br/><a href="{safe_url}" style="color:#be185d;word-break:break-all;">{safe_url}</a></p>
            <p style="color:#666;font-size:13px;">Если вы не запрашивали восстановление пароля,
            просто проигнорируйте это письмо — ваш пароль останется прежним.</p>
            <hr style="border:none;border-top:1px solid #eee;margin:20px 0;" />
            <p style="color:#999;font-size:12px;">С любовью, Ирина Гордеева / Дело Вкуса</p>
        </div>
        """,
    )


async def send_password_reset_email_async(to: str, name: str, reset_url: str) -> bool:
    loop = asyncio.get_running_loop()
    return await loop.run_in_executor(None, partial(send_password_reset_email, to, name, reset_url))
EOF

# 4) Добавляем эндпоинты в auth.py роутер
cat >> app/routers/auth.py <<'EOF'


# ==========================================
# Password reset / change
# ==========================================

from app.schemas import PasswordResetRequest, PasswordResetConfirm, PasswordChangeRequest, OkResponse
from app.auth import create_password_reset_token
from app.email_utils import send_password_reset_email_async
from jose import jwt, JWTError
from app.auth import ALGORITHM


@router.post("/password-reset/request", response_model=OkResponse)
@limiter.limit("3/minute")
async def request_password_reset(
    request: Request,
    data: PasswordResetRequest,
    db: AsyncSession = Depends(get_db),
):
    """Отправить email со ссылкой на сброс пароля.
    Всегда возвращает ok=True (чтобы не выдавать существование email)."""
    result = await db.execute(select(User).where(User.email == data.email))
    user = result.scalar_one_or_none()

    # Шлём письмо только если пользователь существует и зарегистрирован через email
    if user and user.is_active and user.password_hash:
        token = create_password_reset_token(user.id)
        reset_url = f"https://delovkusa.site/reset-password?token={token}"
        try:
            await send_password_reset_email_async(user.email, user.name, reset_url)
            logger.info("Password reset email sent to user_id=%s", user.id)
        except Exception:
            logger.exception("Failed to send password reset email to %s", data.email)
    else:
        logger.info("Password reset requested for unknown/oauth/inactive email=%s", data.email)

    return OkResponse()


@router.post("/password-reset/confirm", response_model=OkResponse)
@limiter.limit("10/minute")
async def confirm_password_reset(
    request: Request,
    data: PasswordResetConfirm,
    db: AsyncSession = Depends(get_db),
):
    """Установить новый пароль по токену из письма."""
    # Валидация пароля (как при регистрации)
    if not re.search(r'[A-Za-zА-Яа-я]', data.new_password) or not re.search(r'\d', data.new_password):
        raise HTTPException(status_code=400, detail="Пароль должен содержать буквы и цифры")

    try:
        payload = jwt.decode(data.token, settings.SECRET_KEY, algorithms=[ALGORITHM])
    except JWTError:
        raise HTTPException(status_code=400, detail="Ссылка недействительна или просрочена")

    if payload.get("type") != "password_reset":
        raise HTTPException(status_code=400, detail="Недействительный токен")

    try:
        user_id = int(payload.get("sub", 0))
    except (TypeError, ValueError):
        raise HTTPException(status_code=400, detail="Недействительный токен")

    if not user_id:
        raise HTTPException(status_code=400, detail="Недействительный токен")

    result = await db.execute(select(User).where(User.id == user_id, User.is_active == True))
    user = result.scalar_one_or_none()
    if not user:
        raise HTTPException(status_code=400, detail="Пользователь не найден")

    user.password_hash = hash_password(data.new_password)
    await db.commit()
    logger.info("Password reset completed for user_id=%s", user.id)

    # Сбрасываем счётчик неудачных попыток входа
    for k in list(_login_attempts.keys()):
        if k.startswith(f"{user.email}:"):
            _login_attempts.pop(k, None)

    return OkResponse()


@router.post("/password-change", response_model=OkResponse)
@limiter.limit("5/minute")
async def change_password(
    request: Request,
    data: PasswordChangeRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Сменить пароль авторизованным пользователем."""
    if not current_user.password_hash:
        raise HTTPException(
            status_code=400,
            detail="Аккаунт зарегистрирован через соцсеть. Установите пароль через восстановление.",
        )

    if not verify_password(data.current_password, current_user.password_hash):
        raise HTTPException(status_code=400, detail="Текущий пароль неверный")

    if len(data.new_password) < 8:
        raise HTTPException(status_code=400, detail="Пароль должен содержать минимум 8 символов")
    if not re.search(r'[A-Za-zА-Яа-я]', data.new_password) or not re.search(r'\d', data.new_password):
        raise HTTPException(status_code=400, detail="Пароль должен содержать буквы и цифры")

    # Получаем свежий объект user в текущей сессии
    result = await db.execute(select(User).where(User.id == current_user.id))
    user_in_session = result.scalar_one()
    user_in_session.password_hash = hash_password(data.new_password)
    await db.commit()
    logger.info("Password changed for user_id=%s", current_user.id)

    return OkResponse()
EOF

echo "=== patch applied, restarting service ==="
systemctl restart delovkusa.service
sleep 2
systemctl is-active delovkusa.service
echo "=== checking endpoints ==="
curl -s -o /dev/null -w "request: %{http_code}\n" -X POST -H "Content-Type: application/json" \
    -d '{"email":"nonexistent@test.com"}' https://delovkusa.site/api/auth/password-reset/request
