import logging
import os
import time

from fastapi import FastAPI, Request, Response
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.base import BaseHTTPMiddleware
from slowapi import _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded

from app.config import settings
from app.database import engine, Base
from app.routers import auth, payments, courses
from app.logging_config import setup_logging

setup_logging()
logger = logging.getLogger(__name__)

# Fail fast if SECRET_KEY is the default placeholder
if settings.SECRET_KEY == "super-secret-key-change-in-production":
    logger.warning(
        "\n" + "!" * 60 + "\n"
        "  WARNING: Using default SECRET_KEY — change it in .env!\n"
        + "!" * 60
    )

app = FastAPI(
    title="Confectionery API",
    version="1.0.0",
    docs_url=None if settings.ENV == "production" else "/docs",
    redoc_url=None if settings.ENV == "production" else "/redoc",
)


# --- Security headers middleware ---
class SecurityHeadersMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        response: Response = await call_next(request)
        response.headers["X-Content-Type-Options"] = "nosniff"
        response.headers["X-Frame-Options"] = "DENY"
        response.headers["X-XSS-Protection"] = "1; mode=block"
        response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
        if settings.ENV == "production":
            response.headers["Strict-Transport-Security"] = "max-age=63072000; includeSubDomains"
            response.headers["Content-Security-Policy"] = (
                "default-src 'self'; "
                "script-src 'self' 'unsafe-inline' https://accounts.google.com https://telegram.org; "
                "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; "
                "font-src 'self' https://fonts.gstatic.com; "
                "img-src 'self' data: https://*.yandex.net https://*.yandex.ru blob:; "
                "media-src 'self' https://*.yandex.net blob:; "
                "frame-src https://accounts.google.com https://oauth.telegram.org; "
                "connect-src 'self' https://cloud-api.yandex.net https://accounts.google.com https://oauth2.googleapis.com;"
            )
        return response

app.add_middleware(SecurityHeadersMiddleware)


# --- Request logging middleware ---
class RequestLoggingMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        start = time.time()
        client = request.client.host if request.client else "unknown"
        try:
            response: Response = await call_next(request)
            elapsed = round((time.time() - start) * 1000)
            logger.info(
                "%s %s %s %dms %s",
                request.method,
                request.url.path,
                response.status_code,
                elapsed,
                client,
            )
            return response
        except Exception as exc:
            elapsed = round((time.time() - start) * 1000)
            logger.error(
                "%s %s ERROR %dms %s — %s",
                request.method,
                request.url.path,
                elapsed,
                client,
                str(exc),
            )
            raise

app.add_middleware(RequestLoggingMiddleware)

# Rate limiter
from app.routers.auth import limiter
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# CORS — explicitly list methods and headers
origins = [o.strip() for o in settings.CORS_ORIGINS.split(",") if o.strip()]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["Authorization", "Content-Type"],
)

# Routers
app.include_router(auth.router)
app.include_router(payments.router)
app.include_router(courses.router)


@app.on_event("startup")
async def startup():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)


@app.get("/api/health")
async def health_check():
    return {"status": "ok"}
