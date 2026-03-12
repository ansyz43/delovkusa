import datetime

from sqlalchemy import Integer, String, BigInteger, Boolean, DateTime, ForeignKey, UniqueConstraint, func
from sqlalchemy.orm import Mapped, mapped_column

from app.database import Base


class User(Base):
    __tablename__ = "app_users"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    email: Mapped[str] = mapped_column(String(255), unique=True, nullable=False, index=True)
    password_hash: Mapped[str | None] = mapped_column(String(255), nullable=True)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    phone: Mapped[str | None] = mapped_column(String(20), unique=True, nullable=True)
    telegram_id: Mapped[int | None] = mapped_column(BigInteger, unique=True, nullable=True, index=True)
    google_id: Mapped[str | None] = mapped_column(String(255), unique=True, nullable=True, index=True)
    auth_provider: Mapped[str | None] = mapped_column(String(20))  # email, phone, google, telegram
    is_admin: Mapped[bool] = mapped_column(Boolean, default=False)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    created_at: Mapped[datetime.datetime] = mapped_column(DateTime, server_default=func.now())


class Course(Base):
    __tablename__ = "courses"

    id: Mapped[str] = mapped_column(String(50), primary_key=True)
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    price: Mapped[int] = mapped_column(Integer, nullable=False)  # цена в рублях
    product_type: Mapped[str] = mapped_column(String(20), default="course")  # course | techcard
    file_path: Mapped[str | None] = mapped_column(String(255), nullable=True)  # для техкарт — имя PDF
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    created_at: Mapped[datetime.datetime] = mapped_column(DateTime, server_default=func.now())


class Order(Base):
    __tablename__ = "orders"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    user_id: Mapped[int] = mapped_column(Integer, ForeignKey("app_users.id"), nullable=False, index=True)
    course_id: Mapped[str] = mapped_column(String(50), ForeignKey("courses.id"), nullable=False)
    yookassa_payment_id: Mapped[str | None] = mapped_column(String(255), unique=True, nullable=True)
    amount: Mapped[int] = mapped_column(Integer, nullable=False)  # рубли
    status: Mapped[str] = mapped_column(String(30), default="pending")  # pending, succeeded, canceled
    created_at: Mapped[datetime.datetime] = mapped_column(DateTime, server_default=func.now())
    updated_at: Mapped[datetime.datetime] = mapped_column(DateTime, server_default=func.now(), onupdate=func.now())


class UserCourseAccess(Base):
    __tablename__ = "user_course_access"
    __table_args__ = (UniqueConstraint("user_id", "course_id", name="uq_user_course"),)

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    user_id: Mapped[int] = mapped_column(Integer, ForeignKey("app_users.id"), nullable=False, index=True)
    course_id: Mapped[str] = mapped_column(String(50), ForeignKey("courses.id"), nullable=False)
    order_id: Mapped[int | None] = mapped_column(Integer, ForeignKey("orders.id"), nullable=True)
    granted_at: Mapped[datetime.datetime] = mapped_column(DateTime, server_default=func.now())
