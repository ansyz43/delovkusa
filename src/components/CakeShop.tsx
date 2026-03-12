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
// Image data per category
// ==========================================
const cakeOrderImages = [
  ...[1, 2, 3].map((i) => ({ src: `/cakes/complex-cakes/${i}.jpg`, alt: `Торт сложной формы ${i}` })),
  ...[1, 2, 3].map((i) => ({ src: `/cakes/3d/${i}.jpg`, alt: `3D торт ${i}` })),
  ...[1, 2].map((i) => ({ src: `/cakes/figurines/${i}.jpg`, alt: `Торт с фигурками ${i}` })),
];

const teaCakeImages = [1, 2, 3, 4, 5].map((i) => ({
  src: `/cakes/tea-cakes/${i}.jpg`,
  alt: `Торт к чаю ${i}`,
}));

const tartImages = [1, 2, 3].map((i) => ({
  src: `/cakes/tarts/${i}.jpg`,
  alt: `Тарт ${i}`,
}));

const bombImages = [1, 2, 3, 4, 5, 6].map((i) => ({
  src: `/cakes/bombs/${i}.jpg`,
  alt: `Шоколадная бомба ${i}`,
}));

const cupcakeImages = [1, 2].map((i) => ({ src: `/cakes/cupcakes/${i}.jpg`, alt: `Капкейк ${i}` }));
const cakepopImages = [1, 2, 3].map((i) => ({ src: `/cakes/cakepops/${i}.jpg`, alt: `Кейкпопс ${i}` }));
const truffleImages = [1, 2, 3].map((i) => ({ src: `/cakes/truffles/${i}.jpg`, alt: `Трюфель ${i}` }));
const trifleImages = [1, 2, 3].map((i) => ({ src: `/cakes/trifles/${i}.jpg`, alt: `Трайфл ${i}` }));
const mousseImages = [1, 2].map((i) => ({ src: `/cakes/mousse/${i}.jpg`, alt: `Желейно-муссовый десерт ${i}` }));
const ptichyeImages = [1, 2].map((i) => ({ src: `/cakes/ptichye-moloko/${i}.jpg`, alt: `Птичье молоко ${i}` }));
const slicedImages = [1].map((i) => ({ src: `/cakes/sliced/${i}.jpg`, alt: `Нарезное пирожное ${i}` }));
const miniCheesecakeImages = [1, 2].map((i) => ({ src: `/cakes/minicheesecake/${i}.jpg`, alt: `Мини чизкейк ${i}` }));
const profiterolesImages = [1].map((i) => ({ src: `/cakes/profiteroles/${i}.jpg`, alt: `Профитроли ${i}` }));
const kartoshkaImages = [1, 2, 3, 4, 5, 6, 7].map((i) => ({ src: `/cakes/kartoshka/${i}.jpg`, alt: `Картошка ${i}` }));
const chocoTeacupImages = [1, 2, 3].map((i) => ({ src: `/cakes/choco-teacups/${i}.jpg`, alt: `Чайная пара из шоколада ${i}` }));

const allDessertImages = [
  ...cupcakeImages, ...cakepopImages, ...truffleImages, ...trifleImages,
  ...mousseImages, ...ptichyeImages, ...slicedImages, ...miniCheesecakeImages,
  ...profiterolesImages, ...kartoshkaImages,
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
    coverImage: "/cakes/complex-cakes/1.jpg",
    description: "Авторские торты любой сложности — от минимального декора до многоярусных конструкций",
    gallery: cakeOrderImages,
    products: [
      { name: "Торт XS (6–8 чел.)", details: ["Минимальный декор включён", "Свеча и топпер — бонус"] },
      { name: "Торт S (10–12 чел.)", details: ["Средний декор", "Подарочная упаковка", "Самый популярный"] },
      { name: "Торт M (14–15 чел.)", details: ["Расширенный декор", "Любые начинки"] },
      { name: "Большой торт (16+ чел.)", details: ["Любая сложность", "Ярусные конструкции", "3D элементы"] },
    ],
  },
  {
    id: "tea",
    title: "Торты к чаю",
    icon: <Coffee className="w-6 h-6" />,
    color: "text-orange-600",
    bgColor: "bg-orange-50",
    borderColor: "border-orange-200",
    coverImage: "/cakes/tea-cakes/1.jpg",
    description: "Готовые торты с фиксированной ценой",
    gallery: teaCakeImages,
    products: [
      { name: "Малина–фисташка", price: "6 000 ₽ / 7 200 ₽", details: ["1.5 кг / 1.8 кг", "Срок годности 24–30 часов"], image: "/cakes/tea-cakes/1.jpg" },
      { name: "Клубника–лайм", price: "4 500 ₽ / 5 400 ₽", details: ["1.5 кг / 1.8 кг"], image: "/cakes/tea-cakes/2.jpg" },
      { name: "Голубика–шоколад / Черешня–шоколад", price: "4 800 ₽ / 5 800 ₽", details: ["1.5 кг / 1.8 кг"], image: "/cakes/tea-cakes/3.jpg" },
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
    description: "Песочные тарты с разнообразными начинками",
    gallery: tartImages,
    products: [
      { name: "Эклерный тарт", price: "3 600 ₽" },
      { name: "Двойной эклерный", price: "7 200 ₽" },
      { name: "Эклерный с малиной", price: "5 000 ₽ / 8 500 ₽" },
      { name: "Вишня/карамель (песочно-творожный)", price: "2 800 ₽" },
      { name: "Яблочный (песочно-творожный)", price: "2 800 ₽" },
      { name: "Черника/шоколад/ванильный мусс", price: "3 000 ₽" },
      { name: "Со свежей малиной", price: "5 000 ₽" },
      { name: "Груша/карамель/кедровый/сырный мусс", price: "3 600 ₽" },
      { name: "Груша + дорблю + кедровый", price: "3 800 ₽" },
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
    description: "Шоколадная сфера тает от горячего соуса, раскрывая десерт внутри",
    gallery: bombImages,
    products: [
      { name: "Бомба S (18 см) с профитролями", price: "9 000 ₽" },
      { name: "Бомба M (20 см) с профитролями", price: "10 000 ₽" },
      { name: "Бомба S (18 см) с тортом внутри", price: "10 500 ₽" },
      { name: "Бомба M (20 см) с тортом внутри", price: "12 000 ₽" },
      { name: "Бомба-мяч", price: "6 000–7 000 ₽" },
      { name: "Бомба XS (14 см)", price: "от 6 000 ₽" },
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
      { name: "Капкейки (от 6 шт)", price: "2 400 ₽", details: ["Печать 400 ₽/лист"], image: cupcakeImages[0]?.src },
      { name: "Кейкпопсы", price: "350–450 ₽/шт", image: cakepopImages[0]?.src },
      { name: "Трюфели (наборы)", details: ["6 / 9 / 12 / 25 / 34 шт"], image: truffleImages[0]?.src },
      { name: "Трайфлы", price: "700–950 ₽", details: ["Стандартные: 700 ₽ / 850 ₽", "Фисташка-малина: 850 ₽ / 950 ₽"], image: trifleImages[0]?.src },
      { name: "Желейно-муссовые", price: "400–500 ₽", image: mousseImages[0]?.src },
      { name: "Птичье молоко (5 шт)", price: "2 000 ₽", image: ptichyeImages[0]?.src },
      { name: "Нарезные пирожные", price: "500 ₽/шт", image: slicedImages[0]?.src },
      { name: "Мини чизкейк-торт", price: "3 000 ₽ / 3 900 ₽", details: ["1 кг / 1.3 кг"], image: miniCheesecakeImages[0]?.src },
      { name: "Профитроли", price: "3 000 ₽/кг", image: profiterolesImages[0]?.src },
      { name: "Картошка", price: "250–500 ₽", image: kartoshkaImages[0]?.src },
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
    description: "Чашка с блюдцем из бельгийского шоколада — ручная работа",
    gallery: chocoTeacupImages,
    products: [
      { name: "Чайная пара из бельгийского шоколада", details: ["Ручная работа", "Натуральный шоколад", "Идеальный подарок"], image: chocoTeacupImages[0]?.src },
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
                "/cakes/complex-cakes/1.jpg",
                "/cakes/bombs/1.jpg",
                "/cakes/tarts/1.jpg",
                "/cakes/choco-teacups/1.jpg",
                "/cakes/tea-cakes/1.jpg",
                "/cakes/figurines/1.jpg",
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

                        {cat.id === "cakes" && (
                          <div className="mt-4 text-center">
                            <Button
                              onClick={() => setShowCalculator(true)}
                              className="bg-pink-600 hover:bg-pink-700 text-white rounded-full px-6"
                            >
                              <Cake className="w-4 h-4 mr-2" />
                              Рассчитать стоимость
                            </Button>
                          </div>
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
            © 2026 Дело Вкуса. Авторские торты. Все права защищены.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default CakeShop;
