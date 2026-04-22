"""Seed courses, bundles and techcards into database."""
import asyncio
from sqlalchemy import select
from app.database import engine, async_session, Base
from app.models import Course

COURSES = [
    {"id": "roses", "title": "Лепестками роз", "price": 6900, "product_type": "course"},
    {"id": "cream", "title": "Финишный крем", "price": 4500, "product_type": "course"},
    {"id": "vase", "title": "Ваза с цветами", "price": 5900, "product_type": "course"},
    {"id": "ostrov", "title": "Остров", "price": 5500, "product_type": "course"},
    {"id": "plastic-chocolate", "title": "Пластичный шоколад", "price": 3500, "product_type": "course"},
]

# Комплекты: bundle_id -> список course_id, к которым открывается доступ
BUNDLES_MAP = {
    "bundle-novice": ["plastic-chocolate", "cream"],
    "bundle-mid": ["plastic-chocolate", "cream", "vase"],
    "bundle-all": ["plastic-chocolate", "cream", "vase", "ostrov", "roses"],
}

BUNDLES = [
    {"id": "bundle-novice", "title": "Комплект «Новичок»: Пластичный шоколад + Финишный крем", "price": 6900, "product_type": "bundle"},
    {"id": "bundle-mid", "title": "Комплект «Средний»: Пластичный шоколад + Финишный крем + Ваза с цветами", "price": 10900, "product_type": "bundle"},
    {"id": "bundle-all", "title": "Полный комплект: все 5 курсов", "price": 19900, "product_type": "bundle"},
]

TECHCARDS = [
    {"id": "tc-chereshnevyj-tryufel", "title": "Черешневый трюфель", "price": 2000, "product_type": "techcard", "file_path": "Chereshnevyj-tryufel.pdf"},
    {"id": "tc-shifonovyj-biskvit", "title": "Шоколадный шифоновый бисквит", "price": 2000, "product_type": "techcard", "file_path": "Shokoladnyj-shifonovyj-biskvit.pdf"},
    {"id": "tc-tart-yagoda", "title": "Тарт и кольца со свежей ягодой", "price": 2000, "product_type": "techcard", "file_path": "Tart-i-kolca-so-svezhej-yagodoj.pdf"},
    {"id": "tc-chernichnye-nochi", "title": "Торт «Черничные ночи»", "price": 2000, "product_type": "techcard", "file_path": "Tort-chernichnye-nochi-Recept.pdf"},
    {"id": "tc-tayozhnyj-roman", "title": "Торт «Таёжный роман»", "price": 2000, "product_type": "techcard", "file_path": "Tort-Tayozhnyj-roman.pdf"},
    {"id": "tc-vishnya-v-shokolade", "title": "Торт «Вишня в шоколаде»", "price": 2000, "product_type": "techcard", "file_path": "tort-vishnya-v-shokolade.pdf"},
    {"id": "tc-tryufel-chernosliv", "title": "Трюфель «Чернослив-кедровый орех»", "price": 2000, "product_type": "techcard", "file_path": "Tryufel-Chernoslivkedrovyj-oreh.pdf"},
    {"id": "tc-tryufel-malinovyj", "title": "Трюфель «Малиновый шоколад»", "price": 2000, "product_type": "techcard", "file_path": "Tryufel-Malinovyj-shokolad.pdf"},
]


async def seed():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    async with async_session() as session:
        for c in COURSES + BUNDLES + TECHCARDS:
            result = await session.execute(select(Course).where(Course.id == c["id"]))
            existing = result.scalar_one_or_none()
            if not existing:
                session.add(Course(**c))
                print(f"  + {c['id']}: {c['title']} — {c['price']}₽")
            else:
                existing.title = c["title"]
                existing.price = c["price"]
                existing.product_type = c["product_type"]
                if "file_path" in c:
                    existing.file_path = c["file_path"]
                existing.is_active = True
                print(f"  ~ {c['id']}: обновлён ({c['price']}₽)")
        await session.commit()
    print("Seed done.")


if __name__ == "__main__":
    asyncio.run(seed())
