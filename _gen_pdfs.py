"""Generate 3 tech-card PDFs from _razdel3.txt"""
import os, re
from reportlab.lib.pagesizes import A4
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, PageBreak, KeepTogether
)
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.enums import TA_CENTER, TA_LEFT
from reportlab.lib.units import mm
from reportlab.lib.colors import HexColor

# Register Arial (Cyrillic-capable)
pdfmetrics.registerFont(TTFont("Arial", r"C:\Windows\Fonts\arial.ttf"))
pdfmetrics.registerFont(TTFont("Arial-Bold", r"C:\Windows\Fonts\arialbd.ttf"))
pdfmetrics.registerFont(TTFont("Arial-Italic", r"C:\Windows\Fonts\ariali.ttf"))
pdfmetrics.registerFontFamily("Arial", normal="Arial", bold="Arial-Bold", italic="Arial-Italic")

ROOT = r"c:\Users\Admin\Downloads\starter-1769648284"
OUT_DIR = os.path.join(ROOT, "техкарты")

PINK = HexColor("#c2185b")
GRAY = HexColor("#555555")
DARK = HexColor("#222222")

with open(os.path.join(ROOT, "_razdel3.txt"), encoding="utf-8") as f:
    full = f.read()

# Split by tech-card titles
anchors = [m.start() for m in re.finditer(r"^Торт «[^»]+»\s*$", full, flags=re.M)]
anchors.append(len(full))

# Card ranges
cards = [
    {
        "title": "Торт «Вишня в шоколаде»",
        "subtitle": "Полная техкарта — бисквит, кремы, компоте, сборка",
        "text": full[0:anchors[1]],        # includes shared chocolate sponge + vishnya
        "out": "tort-vishnya-v-shokolade.pdf",
    },
    {
        "title": "Торт «Таёжный роман»",
        "subtitle": "Кедровый бисквит, брусничный мусс, финишный крем, сборка",
        "text": full[anchors[1]:anchors[2]],
        "out": "Tort-Tayozhnyj-roman.pdf",
    },
    {
        "title": "Торт «Черничные ночи»",
        "subtitle": "Черничный бисквит, кремчиз, конфи, пралине, сборка",
        "text": full[anchors[2]:anchors[3]],
        "out": "Tort-chernichnye-nochi-Recept.pdf",
    },
]

# Styles
styles = {
    "title": ParagraphStyle(
        "title", fontName="Arial-Bold", fontSize=22, leading=28,
        textColor=PINK, alignment=TA_CENTER, spaceAfter=6),
    "subtitle": ParagraphStyle(
        "subtitle", fontName="Arial-Italic", fontSize=12, leading=16,
        textColor=GRAY, alignment=TA_CENTER, spaceAfter=20),
    "brand": ParagraphStyle(
        "brand", fontName="Arial", fontSize=10, leading=14,
        textColor=GRAY, alignment=TA_CENTER, spaceAfter=6),
    "h1": ParagraphStyle(
        "h1", fontName="Arial-Bold", fontSize=16, leading=22,
        textColor=PINK, spaceBefore=14, spaceAfter=6),
    "h2": ParagraphStyle(
        "h2", fontName="Arial-Bold", fontSize=13, leading=18,
        textColor=DARK, spaceBefore=10, spaceAfter=4),
    "label": ParagraphStyle(
        "label", fontName="Arial-Bold", fontSize=11, leading=15,
        textColor=PINK, spaceBefore=6, spaceAfter=2),
    "body": ParagraphStyle(
        "body", fontName="Arial", fontSize=11, leading=15,
        textColor=DARK, alignment=TA_LEFT, spaceAfter=2),
    "bullet": ParagraphStyle(
        "bullet", fontName="Arial", fontSize=11, leading=15,
        textColor=DARK, leftIndent=14, bulletIndent=2, spaceAfter=1),
}

# Known recipe section headers used in docx
SECTION_HEADERS = {
    "Шоколадный шифоновый бисквит", "Шоколадный кремчиз", "Пропитка",
    "Шоколадное кремю", "Крем-дамба", "Вишневое компоте",
    "Карамелизованный грецкий орех", "Кремю вишневое", "Сборка торта",
    "Крем на темном шоколаде для финишного покрытия", "Кедровый бисквит",
    "Творожный крем", "Кремю на белом шоколаде", "Брусничное компоте",
    "Ореховый слой", "Клюквенный (брусничный) мусс",
    "Финишный крем на белом шоколаде", "Сборка", "Бисквит", "Дамба",
    "Кремчиз с маскарпоне (черничный и шоколадный)", "Конфи", "Пралине",
    "Карамелизированный орех", "Хрустящий слой",
    "Крем для покрытия на белом шоколаде",
}
LABELS = {"Ингредиенты", "Ингредиенты:", "Метод", "Метод:"}


def build_flow(card_text: str):
    flow = []
    lines = [ln.strip() for ln in card_text.split("\n")]
    # Skip first empty + title line (title rendered as cover)
    # Title will be first "Торт «...»" OR for card 1 there's "Шоколадный шифоновый бисквит" first
    for raw in lines:
        if not raw:
            flow.append(Spacer(1, 4))
            continue
        # skip the header "Торт «...»" — already rendered as cover title
        if re.fullmatch(r"Торт «[^»]+»", raw):
            continue
        # Numbered/bullet steps "1/", "1.", "1)"
        esc = (raw.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;"))
        if raw in SECTION_HEADERS:
            flow.append(Paragraph(esc, styles["h2"]))
        elif raw in LABELS or raw.rstrip(":") in {"Ингредиенты", "Метод", "Инструменты и инвентарь"}:
            flow.append(Paragraph(esc, styles["label"]))
        else:
            flow.append(Paragraph(esc, styles["body"]))
    return flow


def make_pdf(card):
    path = os.path.join(OUT_DIR, card["out"])
    doc = SimpleDocTemplate(
        path, pagesize=A4,
        leftMargin=20 * mm, rightMargin=20 * mm,
        topMargin=18 * mm, bottomMargin=18 * mm,
        title=card["title"], author="Ирина Гордеева — Дело Вкуса",
    )
    story = []
    story.append(Spacer(1, 40 * mm))
    story.append(Paragraph("Дело Вкуса · Ирина Гордеева", styles["brand"]))
    story.append(Paragraph(card["title"], styles["title"]))
    story.append(Paragraph(card["subtitle"], styles["subtitle"]))
    story.append(Spacer(1, 6 * mm))
    story.append(Paragraph(
        "Авторская техкарта. Точные граммовки, пошаговая технология и схема сборки.",
        styles["body"]))
    story.append(PageBreak())
    story.extend(build_flow(card["text"]))
    doc.build(story)
    print("OK", path, os.path.getsize(path))

for c in cards:
    make_pdf(c)
