import datetime
from pydantic import BaseModel, EmailStr, Field


# --- Auth ---

class RegisterRequest(BaseModel):
    email: EmailStr
    password: str = Field(min_length=6, max_length=128)
    name: str = Field(min_length=1, max_length=255)


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"


class GoogleAuthRequest(BaseModel):
    credential: str


class TelegramAuthRequest(BaseModel):
    id: int
    first_name: str
    last_name: str | None = None
    username: str | None = None
    photo_url: str | None = None
    auth_date: int
    hash: str


# --- Profile ---

class ProfileResponse(BaseModel):
    id: int
    email: str
    name: str
    is_admin: bool
    auth_provider: str | None
    created_at: datetime.datetime


# --- Payments ---

class CreatePaymentRequest(BaseModel):
    course_id: str


class CreatePaymentResponse(BaseModel):
    order_id: int
    confirmation_url: str


class OrderStatusResponse(BaseModel):
    order_id: int
    status: str
    course_id: str


# --- Courses ---

class CourseAccessResponse(BaseModel):
    has_access: bool


class UserCoursesResponse(BaseModel):
    course_ids: list[str]
