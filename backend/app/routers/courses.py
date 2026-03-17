import os
from urllib.parse import urlparse

import httpx
from fastapi import APIRouter, Depends, HTTPException, Request
from fastapi.responses import FileResponse, StreamingResponse
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.models import Course, UserCourseAccess, User
from app.auth import get_current_user
from app.schemas import CourseAccessResponse, UserCoursesResponse
from app.course_videos import COURSE_VIDEO_URLS

router = APIRouter(prefix="/api/courses", tags=["courses"])

TECHCARDS_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "..", "techcards")

# All known techcard IDs (admin gets all)
ALL_TECHCARD_IDS = [
    "tc-chereshnevyj-tryufel", "tc-chereshnevye-tryufeli-mk",
    "tc-plastichnyj-shokolad", "tc-shifonovyj-biskvit",
    "tc-tart-yagoda", "tc-chernichnye-nochi",
    "tc-tayozhnyj-roman", "tc-vishnya-v-shokolade",
    "tc-tryufel-chernosliv", "tc-tryufel-malinovyj",
]


@router.get("/my", response_model=UserCoursesResponse)
async def get_my_courses(
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Return list of course IDs the user has access to."""
    if user.is_admin:
        return UserCoursesResponse(
            course_ids=["roses", "cream", "vase", "ostrov", "plastic-chocolate"] + ALL_TECHCARD_IDS
        )

    result = await db.execute(
        select(UserCourseAccess.course_id).where(UserCourseAccess.user_id == user.id)
    )
    course_ids = [row[0] for row in result.all()]
    return UserCoursesResponse(course_ids=course_ids)


@router.get("/{course_id}/access", response_model=CourseAccessResponse)
async def check_course_access(
    course_id: str,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Check if user has access to a specific course."""
    if user.is_admin:
        return CourseAccessResponse(has_access=True)

    result = await db.execute(
        select(UserCourseAccess).where(
            UserCourseAccess.user_id == user.id,
            UserCourseAccess.course_id == course_id,
        )
    )
    return CourseAccessResponse(has_access=result.scalar_one_or_none() is not None)


@router.get("/{course_id}/videos")
async def get_course_videos(
    course_id: str,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Return video URLs for a course — only if user has access."""
    if not user.is_admin:
        result = await db.execute(
            select(UserCourseAccess).where(
                UserCourseAccess.user_id == user.id,
                UserCourseAccess.course_id == course_id,
            )
        )
        if not result.scalar_one_or_none():
            raise HTTPException(status_code=403, detail="Нет доступа к этому курсу")

    urls = COURSE_VIDEO_URLS.get(course_id)
    if urls is None:
        raise HTTPException(status_code=404, detail="Курс не найден")

    return {"urls": urls}


@router.get("/{course_id}/download")
async def download_techcard(
    course_id: str,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Download techcard PDF — only if user has access."""
    # Check access
    if not user.is_admin:
        result = await db.execute(
            select(UserCourseAccess).where(
                UserCourseAccess.user_id == user.id,
                UserCourseAccess.course_id == course_id,
            )
        )
        if not result.scalar_one_or_none():
            raise HTTPException(status_code=403, detail="Нет доступа к этой техкарте")

    # Fetch course to get file_path
    result = await db.execute(
        select(Course).where(Course.id == course_id, Course.product_type == "techcard")
    )
    course = result.scalar_one_or_none()
    if not course or not course.file_path:
        raise HTTPException(status_code=404, detail="Техкарта не найдена")

    file_path = os.path.normpath(os.path.join(TECHCARDS_DIR, course.file_path))
    # Prevent path traversal
    if not file_path.startswith(os.path.normpath(TECHCARDS_DIR)):
        raise HTTPException(status_code=400, detail="Недопустимый путь")
    if not os.path.isfile(file_path):
        raise HTTPException(status_code=404, detail="Файл не найден")

    return FileResponse(
        file_path,
        media_type="application/pdf",
        filename=course.file_path,
    )


_ALLOWED_HOSTS = {"disk.yandex.ru", "yadi.sk"}


@router.get("/video-proxy")
async def video_proxy(url: str, request: Request):
    """Stream video from Yandex Disk with inline headers for mobile playback."""
    parsed = urlparse(url)
    if not parsed.hostname or parsed.hostname not in _ALLOWED_HOSTS:
        raise HTTPException(status_code=400, detail="Недопустимый URL")

    # Get download link from Yandex Disk API
    async with httpx.AsyncClient(timeout=15) as api_client:
        api_resp = await api_client.get(
            "https://cloud-api.yandex.net/v1/disk/public/resources/download",
            params={"public_key": url},
        )
        if api_resp.status_code != 200:
            raise HTTPException(status_code=502, detail="Не удалось получить ссылку")
        download_url = api_resp.json().get("href")
        if not download_url:
            raise HTTPException(status_code=502, detail="Скачивание запрещено")

    # Forward Range header for seeking
    fwd_headers = {}
    range_header = request.headers.get("range")
    if range_header:
        fwd_headers["Range"] = range_header

    client = httpx.AsyncClient(
        timeout=httpx.Timeout(connect=15, read=300, write=30, pool=15),
        follow_redirects=True,
    )
    req = client.build_request("GET", download_url, headers=fwd_headers)
    resp = await client.send(req, stream=True)

    async def _stream():
        try:
            async for chunk in resp.aiter_bytes(chunk_size=65536):
                yield chunk
        finally:
            await resp.aclose()
            await client.aclose()

    out_headers = {
        "Content-Type": resp.headers.get("Content-Type", "video/mp4"),
        "Accept-Ranges": "bytes",
        "Content-Disposition": "inline",
        "Cache-Control": "public, max-age=3600",
    }
    if "Content-Length" in resp.headers:
        out_headers["Content-Length"] = resp.headers["Content-Length"]
    if "Content-Range" in resp.headers:
        out_headers["Content-Range"] = resp.headers["Content-Range"]

    return StreamingResponse(
        _stream(),
        status_code=resp.status_code,
        headers=out_headers,
    )
