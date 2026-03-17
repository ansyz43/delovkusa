from pydantic_settings import BaseSettings
from pydantic import field_validator


class Settings(BaseSettings):
    DATABASE_URL: str = "sqlite+aiosqlite:///./app.db"
    SECRET_KEY: str = "super-secret-key-change-in-production"

    ACCESS_TOKEN_EXPIRE_MINUTES: int = 15
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7

    CORS_ORIGINS: str = "http://localhost:5173"
    COOKIE_SECURE: bool = False

    GOOGLE_CLIENT_ID: str = ""
    GOOGLE_CLIENT_SECRET: str = ""
    TELEGRAM_BOT_TOKEN_LOGIN: str = ""

    YOOKASSA_SHOP_ID: str = ""
    YOOKASSA_SECRET_KEY: str = ""
    YOOKASSA_RETURN_URL: str = "http://localhost:5173/payment/return"

    ENV: str = "development"  # "development" | "production"

    # Email (optional — if empty, emails won't be sent)
    SMTP_HOST: str = ""
    SMTP_PORT: int = 465
    SMTP_USER: str = ""
    SMTP_PASS: str = ""
    SMTP_FROM: str = ""

    @field_validator("COOKIE_SECURE", mode="before")
    @classmethod
    def auto_cookie_secure(cls, v, info):
        """Auto-enable secure cookies when CORS origins use https."""
        if v:
            return v
        origins = info.data.get("CORS_ORIGINS", "")
        if origins and all(o.strip().startswith("https://") for o in origins.split(",") if o.strip()):
            return True
        return v

    class Config:
        env_file = ".env"


settings = Settings()
