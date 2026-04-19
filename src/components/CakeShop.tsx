import React, { useState } from "react";
import Header from "./Header";
import CakeCalculator from "./CakeCalculator";
import CategoryGallery from "./CategoryGallery";
import FlipWords from "./FlipWords";
import GlowButton from "./GlowButton";
import { Button } from "./ui/button";
import {
  Cake,
  Coffee,
  Cookie,
  IceCream,
  Sparkles,
  MessageCircle,
  Phone,
  ChevronRight,
  CupSoda,
} from "lucide-react";

// ==========================================
// Helper: generate image array
// ==========================================
const imgs = (folder: string, count: number, alt: string) =>
  Array.from({ length: count }, (_, i) => ({ src: `/cakes/${folder}/${i + 1}.jpg`, alt: `${alt} ${i + 1}` }));

// ==========================================
// Image data per category
// ==========================================

// Торты на заказ — подкатегории
const simpleDecorImages = imgs("simple-decor", 8, "Торт с простым декором");
const mediumDecorImages = imgs("medium-decor", 9, "Торт со средним декором");
const squareImages = imgs("square", 10, "Квадратный торт");
const tieredSimpleImages = imgs("tiered-simple", 8, "Ярусный торт");
const tieredComplexImages = imgs("tiered-complex", 3, "Сложный ярусный торт");
const vaseCakeImages = imgs("vase-cakes", 2, "Торт-ваза");
const threeDImages = imgs("3d", 8, "3D торт");
const longCakeImages = imgs("long-cakes", 3, "Длинный торт");

const cakeOrderImages = [
  ...simpleDecorImages.slice(0, 2),
  ...mediumDecorImages.slice(0, 2),
  ...squareImages.slice(0, 2),
  ...threeDImages.slice(0, 2),
];

// Остальные категории
const teaCakeImages = imgs("tea-cakes", 4, "Торт к чаю");
const tartImages = imgs("tarts", 8, "Тарт");
const bombImages = imgs("bombs", 5, "Шоколадная бомба");

const cupcakeImages = imgs("cupcakes", 3, "Капкейк");
const cakepopImages = imgs("cakepops", 4, "Кейкпопс");
const truffleImages = imgs("truffles", 12, "Трюфель");
const trifleImages = imgs("trifles", 3, "Трайфл");
const mousseImages = imgs("mousse", 6, "Муссовое пирожное");
const ptichyeImages = imgs("ptichye-moloko", 2, "Птичье молоко");
const slicedImages = imgs("sliced", 1, "Нарезное пирожное");
const miniCheesecakeImages = imgs("minicheesecake", 3, "Мини чизкейк");
const profiterolesImages = imgs("profiteroles", 1, "Профитроли");
const kartoshkaImages = imgs("kartoshka", 7, "Картошка");
const chocoTeacupImages = imgs("choco-teacups", 21, "Чайная пара из шоколада");
const caviarJarImages = imgs("caviar-jars", 2, "Баночка с икрой");

const allDessertImages = [
  ...cupcakeImages, ...cakepopImages, ...truffleImages, ...trifleImages,
  ...mousseImages, ...ptichyeImages, ...slicedImages, ...miniCheesecakeImages,
  ...profiterolesImages, ...kartoshkaImages, ...caviarJarImages,
];

// ==========================================
// Types
// ==========================================
interface ProductItem {
  name: string;
  price?: string;
  details?: string[];
  image?: string;
}

interface Category {
  id: string;
  title: string;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
  borderColor: string;
  coverImage: string;
  description: string;
  gallery: { src: string; alt: string }[];
  products: ProductItem[];
}

// ==========================================
// Subcategories for "Торты на заказ"
// ==========================================
interface CakeSubCategory {
  title: string;
  pricePerKg: string;
  gallery: { src: string; alt: string }[];
  note?: string;
}

const cakeSubCategories: CakeSubCategory[] = [
  { title: "Простой декор", pricePerKg: "3 300 ₽/кг", gallery: simpleDecorImages, note: "Ягодный декор, несложные надписи и ламбет" },
  { title: "Средний декор", pricePerKg: "3 500 ₽/кг", gallery: mediumDecorImages, note: "Топеры, леденцы, шоколадные детали, шары, фигурки отливные" },
  { title: "Квадратные/прямоугольные, с шоколадными цветами", pricePerKg: "3 700 ₽/кг", gallery: squareImages, note: "Декор входит (кроме фигурок ручной лепки и печати)" },
  { title: "Ярусный простой", pricePerKg: "3 800 ₽/кг", gallery: tieredSimpleImages, note: "Весь декор (кроме фигурок и печати) входит в стоимость" },
  { title: "Ярусные сложные конструкции", pricePerKg: "от 4 000 ₽/кг", gallery: tieredComplexImages, note: "Стоимость зависит от сложности проекта" },
  { title: "Торты-вазы", pricePerKg: "3 600 ₽/кг", gallery: vaseCakeImages, note: "Шоколадные цветы входят в стоимость" },
  { title: "3D торты", pricePerKg: "3 600–5 000 ₽/кг", gallery: threeDImages, note: "Простые 3D — 3 600, средние — 3 700, сложные — от 3 800 до 5 000" },
  { title: "Длинные узкие торты", pricePerKg: "3 800 ₽/кг", gallery: longCakeImages, note: "Отдельно: фигурки ручной работы и печать 400 ₽/лист" },
];

// ==========================================
// Category data
// ==========================================
const categories: Category[] = [
  {
    id: "cakes",
    title: "Торты на заказ",
    icon: <Cake className="w-6 h-6" />,
    color: "text-pink-600",
    bgColor: "bg-pink-50",
    borderColor: "border-pink-200",
    coverImage: "/cakes/medium-decor/1.jpg",
    description: "Авторские торты любой сложности — от 3 300 ₽/кг до 5 000 ₽/кг",
    gallery: cakeOrderImages,
    products: [],
  },
  {
    id: "tea",
    title: "Торты к чаю",
    icon: <Coffee className="w-6 h-6" />,
    color: "text-orange-600",
    bgColor: "bg-orange-50",
    borderColor: "border-orange-200",
    coverImage: "/cakes/tea-cakes/1.jpg",
    description: "Готовые торты со свежей ягодой. Срок годности 24 часа",
    gallery: teaCakeImages,
    products: [
      {
        name: "«Клубника/лайм/ваниль»",
        price: "5 500 ₽",
        details: [
          "Вес 1,8 кг",
          "Ванильный бисквит, сырный крем с маскарпоне, крем на белом шоколаде, свежая клубника, лаймовая прослойка, эклерные коржи с заварным кремом на тёмном шоколаде",
        ],
        image: "/cakes/tea-cakes/1.jpg",
      },
      {
        name: "«Дорогое удовольствие» (малина-фисташка)",
        price: "7 200 ₽",
        details: [
          "Вес 1,8 кг",
          "Фисташковый бисквит, фисташковый крем, свежая малина, дробленая фисташка, сырный крем на молочном шоколаде, эклерные коржи",
        ],
        image: "/cakes/tea-cakes/2.jpg",
      },
    ],
  },
  {
    id: "tarts",
    title: "Тарты",
    icon: <Cookie className="w-6 h-6" />,
    color: "text-amber-600",
    bgColor: "bg-amber-50",
    borderColor: "border-amber-200",
    coverImage: "/cakes/tarts/1.jpg",
    description: "Тарты на песочно-творожном тесте",
    gallery: tartImages,
    products: [
      { name: "Вишня/карамель", price: "2 800 ₽", details: ["Вес от 1,2 кг"] },
      { name: "Яблочный", price: "2 800 ₽", details: ["Вес от 1,2 кг"] },
      { name: "Черника/шоколад/ванильный мусс", price: "3 000 ₽", details: ["Вес от 1,3 кг", "С вишней или черешней — та же цена"] },
      { name: "Со свежей малиной", price: "5 000 ₽/шт" },
      { name: "Груша/карамель/кедровый орех/сырный мусс", price: "3 600 ₽", details: ["Вес от 1,2 кг"] },
      { name: "С прослойкой дорблю", price: "4 000 ₽", details: ["Вес от 1,2 кг"] },
    ],
  },
  {
    id: "bombs",
    title: "Шоколадные бомбы",
    icon: <Sparkles className="w-6 h-6" />,
    color: "text-amber-700",
    bgColor: "bg-amber-50",
    borderColor: "border-amber-200",
    coverImage: "/cakes/bombs/1.jpg",
    description: "Шоколадная сфера с профитролями или тортом внутри. Молоточек и топер входят в стоимость",
    gallery: bombImages,
    products: [
      { name: "Бомба S (18 см) с профитролями", price: "9 000 ₽", details: ["15–18 эклеров"] },
      { name: "Бомба M (20 см) с профитролями", price: "10 000 ₽", details: ["20–22 эклера"] },
      { name: "Бомба S (18 см) с тортом внутри", price: "10 500 ₽" },
      { name: "Бомба M (20 см) с тортом внутри", price: "12 000 ₽" },
      { name: "Бомба-мяч", price: "6 000–7 000 ₽" },
      { name: "Бомба XS (14 см, на торт)", price: "от 6 000 ₽" },
    ],
  },
  {
    id: "desserts",
    title: "Десерты",
    icon: <IceCream className="w-6 h-6" />,
    color: "text-pink-600",
    bgColor: "bg-pink-50",
    borderColor: "border-pink-200",
    coverImage: "/cakes/cupcakes/1.jpg",
    description: "Порционные десерты для фуршетов, candy-баров и подарков",
    gallery: allDessertImages,
    products: [
      { name: "Капкейки (от 6 шт)", price: "3 000 ₽ / 6 шт", details: ["Шоколадные, ванильные, красный бархат, морковные, кофейные", "Декор ягодный/шоколадный входит в стоимость"], image: cupcakeImages[0]?.src },
      { name: "Кейкпопсы", price: "350–450 ₽/шт", details: ["Ванильные и шоколадные, с орехами или наполнителем", "Форма и декор индивидуальные"], image: cakepopImages[0]?.src },
      { name: "Трюфели ручной работы", price: "от 1 250 ₽ (6 шт)", details: ["24 вкуса на бельгийском шоколаде Калебаут", "6 шт — 1 250, 9 — 1 950, 12 — 2 550, 25 — 5 300, 33 — 6 950"], image: truffleImages[0]?.src },
      { name: "Трайфлы", price: "700–950 ₽", image: trifleImages[0]?.src },
      { name: "Муссовые пирожные", price: "от 2 000 ₽", details: ["Детский набор (4 шт) — 2 000 ₽", "Сердечки/эскимо (6 шт) — 3 600 ₽", "Зайки — 700 ₽/шт (от 4 шт)"], image: mousseImages[0]?.src },
      { name: "Птичье молоко (5 шт)", price: "2 000 ₽", image: ptichyeImages[0]?.src },
      { name: "Нарезные пирожные", price: "500 ₽/шт", image: slicedImages[0]?.src },
      { name: "Мини-тортики чизкейки", price: "4 800 ₽", details: ["Вес от 1,5 кг", "Бисквит, сырный крем на шоколаде, ягодная прослойка, чизкейк", "Простой декор входит, печать — 400 ₽/лист"], image: miniCheesecakeImages[0]?.src },
      { name: "Профитроли", price: "3 000 ₽/кг", image: profiterolesImages[0]?.src },
      { name: "Картошка (без начинки / с орехом)", price: "250 ₽/шт", details: ["С вишней или малиной — 300 ₽/шт", "Обсыпка — сухой бельгийский шоколад, от 6 шт"], image: kartoshkaImages[0]?.src },
      { name: "Картошка в шоколаде", price: "450 ₽/шт", details: ["Апельсин, малина/бейлис, вишня/шоколад, карамель-фундук", "Заказ от 6 шт (в праздники от 3)"], image: kartoshkaImages[2]?.src },
      { name: "Баночки с икрой", price: "1 400–1 500 ₽/шт", details: ["Муссовое пирожное внутри, мармеладная «икра»", "Шоколадная отделка, упаковка и свечка входят"], image: caviarJarImages[0]?.src },
    ],
  },
  {
    id: "teacups",
    title: "Чайные пары из шоколада",
    icon: <CupSoda className="w-6 h-6" />,
    color: "text-amber-800",
    bgColor: "bg-yellow-50",
    borderColor: "border-yellow-200",
    coverImage: "/cakes/choco-teacups/1.jpg",
    description: "Чашка с блюдцем из бельгийского шоколада с цветами ручной работы",
    gallery: chocoTeacupImages,
    products: [
      { name: "Роза + бутоны", price: "2 400 ₽", details: ["Внутри пирожное из ассортимента"] },
      { name: "Пион + бутоны", price: "2 500 ₽" },
      { name: "Букет из 3 цветков + листва", price: "2 800 ₽" },
      { name: "Букет из 7–9 цветов", price: "3 000 ₽", details: ["Цветовая гамма по договорённости"] },
    ],
  },
];

// ==========================================
// Main Component
// ==========================================
const CakeShop = () => {
  const [showCalculator, setShowCalculator] = useState(false);
  const [openCategory, setOpenCategory] = useState<string | null>(null);

  const toggleCategory = (id: string) => {
    setOpenCategory(openCategory === id ? null : id);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50/40 via-white to-purple-50/30">
      <Header />

      <main className="pt-20">
        {/* Hero */}
        <section className="w-full py-16 px-4 bg-gradient-to-br from-rose-50 via-pink-50/60 to-purple-50">
          <div className="max-w-5xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-4 text-gray-800 tracking-tight">
              Авторские торты на заказ
            </h1>
            <p className="text-lg md:text-xl text-gray-500 mb-8 font-light max-w-2xl mx-auto">
              Создаём{" "}
              <FlipWords
                words={["вкусные", "незабываемые", "сладкие", "яркие", "особенные"]}
                className="font-medium text-pink-600"
                duration={2500}
              />{" "}
              моменты для ваших праздников
            </p>

            {/* Mini photo grid */}
            <div className="grid grid-cols-3 md:grid-cols-6 gap-2 max-w-3xl mx-auto mb-8">
              {[
                "/cakes/medium-decor/1.jpg",
                "/cakes/bombs/1.jpg",
                "/cakes/tarts/1.jpg",
                "/cakes/choco-teacups/1.jpg",
                "/cakes/tea-cakes/1.jpg",
                "/cakes/3d/1.jpg",
              ].map((src, i) => (
                <div key={i} className="aspect-square rounded-xl overflow-hidden shadow-md">
                  <img src={src} alt="" className="w-full h-full object-cover" />
                </div>
              ))}
            </div>

            <GlowButton onClick={() => setShowCalculator(!showCalculator)} size="lg">
              <Cake className="h-5 w-5" />
              {showCalculator ? "Скрыть калькулятор" : "Рассчитать стоимость торта"}
            </GlowButton>
          </div>
        </section>

        {showCalculator && (
          <section className="py-12 px-4 bg-white">
            <div className="max-w-7xl mx-auto">
              <CakeCalculator />
            </div>
          </section>
        )}

        {/* Catalog Accordion */}
        <section className="py-12 px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-display font-bold text-center mb-8 text-gray-800">
              Каталог
            </h2>

            <div className="space-y-3">
              {categories.map((cat) => {
                const isOpen = openCategory === cat.id;
                return (
                  <div
                    key={cat.id}
                    className={`rounded-2xl border transition-all duration-300 overflow-hidden ${
                      isOpen
                        ? `${cat.borderColor} shadow-lg`
                        : "border-gray-200 hover:border-gray-300 hover:shadow-sm"
                    }`}
                  >
                    {/* Category header */}
                    <button
                      onClick={() => toggleCategory(cat.id)}
                      className={`w-full flex items-center gap-4 p-4 md:p-5 text-left transition-colors duration-200 ${
                        isOpen ? cat.bgColor : "bg-white hover:bg-gray-50"
                      }`}
                    >
                      <div className="w-14 h-14 md:w-16 md:h-16 rounded-xl overflow-hidden flex-shrink-0 shadow-sm">
                        <img src={cat.coverImage} alt={cat.title} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className={`text-lg md:text-xl font-semibold ${isOpen ? cat.color : "text-gray-800"}`}>
                          {cat.title}
                        </h3>
                        <p className="text-sm text-gray-500 truncate">{cat.description}</p>
                      </div>
                      <ChevronRight
                        className={`w-5 h-5 flex-shrink-0 text-gray-400 transition-transform duration-300 ${
                          isOpen ? "rotate-90" : ""
                        }`}
                      />
                    </button>

                    {/* Expanded content */}
                    {isOpen && (
                      <div className="px-4 md:px-6 pb-6 pt-2 bg-white">
                        {/* Subcategories for custom cakes */}
                        {cat.id === "cakes" ? (
                          <div className="space-y-6">
                            <p className="text-sm text-gray-500 mb-2">
                              Сахарная печать оплачивается отдельно — 400 ₽/лист. Фигурки ручной лепки рассчитываются индивидуально.
                            </p>
                            {cakeSubCategories.map((sub, si) => (
                              <div key={si} className="border border-gray-100 rounded-xl overflow-hidden">
                                <div className="p-3 bg-pink-50/60 flex items-baseline justify-between gap-2">
                                  <h4 className="font-semibold text-gray-800">{sub.title}</h4>
                                  <span className="text-sm font-semibold text-pink-600 whitespace-nowrap">{sub.pricePerKg}</span>
                                </div>
                                {sub.note && (
                                  <p className="px-3 pt-1 text-xs text-gray-500">{sub.note}</p>
                                )}
                                <div className="p-3">
                                  <CategoryGallery images={sub.gallery} columns={sub.gallery.length <= 4 ? 2 : 3} />
                                </div>
                              </div>
                            ))}
                            <div className="mt-4 text-center">
                              <Button
                                onClick={() => setShowCalculator(true)}
                                className="bg-pink-600 hover:bg-pink-700 text-white rounded-full px-6"
                              >
                                <Cake className="w-4 h-4 mr-2" />
                                Рассчитать стоимость
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <>
                            {/* Gallery */}
                            {cat.gallery.length > 0 && (
                              <div className="mb-6">
                                <CategoryGallery images={cat.gallery} columns={cat.gallery.length <= 4 ? 2 : 3} />
                              </div>
                            )}

                            {/* Products */}
                            <div className="space-y-2">
                              {cat.products.map((product, idx) => (
                                <div
                                  key={idx}
                                  className="flex items-start gap-3 p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors"
                                >
                                  {product.image && (
                                    <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                                      <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                                    </div>
                                  )}
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-baseline justify-between gap-2">
                                      <span className="font-medium text-gray-800 text-sm md:text-base">
                                        {product.name}
                                      </span>
                                      {product.price && (
                                        <span className="text-sm font-semibold text-pink-600 whitespace-nowrap">
                                          {product.price}
                                        </span>
                                      )}
                                    </div>
                                    {product.details && (
                                      <div className="flex flex-wrap gap-x-3 gap-y-0.5 mt-0.5">
                                        {product.details.map((d, i) => (
                                          <span key={i} className="text-xs text-gray-500">{d}</span>
                                        ))}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Contacts */}
        <section id="contacts" className="py-16 px-4 bg-gradient-to-br from-rose-50 to-purple-50">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-display font-bold mb-4 text-gray-800">
              Готовы сделать заказ?
            </h2>
            <p className="text-lg text-gray-500 mb-8 font-light">
              Свяжитесь с нами для оформления заказа или консультации
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-green-600 hover:bg-green-700 text-white px-8 py-6 text-lg font-medium rounded-full shadow-lg shadow-green-200/50 hover:shadow-xl transition-all duration-400 active:scale-[0.97]"
              >
                <MessageCircle className="mr-2 h-5 w-5" />
                Написать в WhatsApp
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border border-pink-300 text-pink-600 hover:bg-pink-50 px-8 py-6 text-lg font-medium rounded-full transition-all duration-400 active:scale-[0.97]"
              >
                <Phone className="mr-2 h-5 w-5" />
                Позвонить
              </Button>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-gray-900 text-white py-10 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-gray-400 font-light">
            © {new Date().getFullYear()} Дело Вкуса. Авторские торты. Все права защищены.
          </p>
          <p className="text-gray-400 font-light mt-2">ИНН 253615143415</p>
          <p className="mt-2">
            <a href="/offer" className="text-gray-400 hover:text-white transition-colors underline font-light">Публичная оферта</a>
            {" | "}
            <a href="/privacy" className="text-gray-400 hover:text-white transition-colors underline font-light">Политика конфиденциальности</a>
          </p>
        </div>
      </footer>
    </div>
  );
};

export default CakeShop;
