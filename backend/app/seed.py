"""Seed courses and techcards into database."""
import asyncio
from sqlalchemy import select
from app.database import engine, async_session, Base
from app.models import Course

COURSES = [
    {"id": "roses", "title": "Лепестками роз", "price": 5000, "product_type": "course"},
    {"id": "cream", "title": "Финишный крем", "price": 3500, "product_type": "course"},
    {"id": "vase", "title": "Ваза с цветами", "price": 4000, "product_type": "course"},
    {"id": "ostrov", "title": "Остров", "price": 4500, "product_type": "course"},
    {"id": "plastic-chocolate", "title": "Пластичный шоколад", "price": 3000, "product_type": "course"},
]

TECHCARDS = [
    {"id": "tc-chereshnevyj-tryufel", "title": "Черешневый трюфель", "price": 500, "product_type": "techcard", "file_path": "Chereshnevyj-tryufel.pdf"},
    {"id": "tc-chereshnevye-tryufeli-mk", "title": "Изысканные черешневые трюфели (мастер-класс)", "price": 700, "product_type": "techcard", "file_path": "Izyskannye-Chereshnevye-Tryufeli-Master-klass.pdf"},
    {"id": "tc-plastichnyj-shokolad", "title": "Рецепт пластичного шоколада", "price": 400, "product_type": "techcard", "file_path": "Recept-plastichnogo-shokolada.pdf"},
    {"id": "tc-shifonovyj-biskvit", "title": "Шоколадный шифоновый бисквит", "price": 400, "product_type": "techcard", "file_path": "Shokoladnyj-shifonovyj-biskvit.pdf"},
    {"id": "tc-tart-yagoda", "title": "Тарт и кольца со свежей ягодой", "price": 600, "product_type": "techcard", "file_path": "Tart-i-kolca-so-svezhej-yagodoj.pdf"},
    {"id": "tc-chernichnye-nochi", "title": "Торт «Черничные ночи»", "price": 500, "product_type": "techcard", "file_path": "Tort-chernichnye-nochi-Recept.pdf"},
    {"id": "tc-tayozhnyj-roman", "title": "Торт «Таёжный роман»", "price": 500, "product_type": "techcard", "file_path": "Tort-Tayozhnyj-roman.pdf"},
    {"id": "tc-vishnya-v-shokolade", "title": "Торт «Вишня в шоколаде»", "price": 500, "product_type": "techcard", "file_path": "tort-vishnya-v-shokolade.pdf"},
    {"id": "tc-tryufel-chernosliv", "title": "Трюфель «Чернослив-кедровый орех»", "price": 500, "product_type": "techcard", "file_path": "Tryufel-Chernoslivkedrovyj-oreh.pdf"},
    {"id": "tc-tryufel-malinovyj", "title": "Трюфель «Малиновый шоколад»", "price": 500, "product_type": "techcard", "file_path": "Tryufel-Malinovyj-shokolad.pdf"},
]


async def seed():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    async with async_session() as session:
        for c in COURSES + TECHCARDS:
            result = await session.execute(select(Course).where(Course.id == c["id"]))
            if not result.scalar_one_or_none():
                session.add(Course(**c))
                label = "курс" if c["product_type"] == "course" else "техкарта"
                print(f"  + [{label}] {c['id']}: {c['title']} — {c['price']}₽")
            else:
                print(f"  = {c['id']}: уже существует")
        await session.commit()
    print("Seed done.")


if __name__ == "__main__":
    asyncio.run(seed())
