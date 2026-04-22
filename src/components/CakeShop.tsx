import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Cake,
  Coffee,
  Cookie,
  IceCream,
  Sparkles,
  Phone,
  ChevronRight,
  CupSoda,
  ArrowRight,
  MapPin,
  Instagram,
  Zap,
  Menu,
  X,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { HeroCarousel } from "./ui/feature-carousel";
import { GradientText } from "./ui/gradient-text";
import CakeCalculator from "./CakeCalculator";
import CategoryGallery from "./CategoryGallery";
import FlipWords from "./FlipWords";
import { useAuth } from "../lib/AuthContext";
import SEO from "./SEO";

// ==========================================
// Animation variants
// ==========================================
const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};
const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};
const itemFadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

// ==========================================
// Helper: generate image array
// ==========================================
const imgs = (folder: string, count: number, alt: string) =>
  Array.from({ length: count }, (_, i) => ({
    src: `/cakes/${folder}/${i + 1}.jpg`,
    alt: `${alt} ${i + 1}`,
  }));

// ==========================================
// Image data per category
// ==========================================
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

// Carousel hero images — best showcase photos
const heroCarouselImages = [
  { src: "/cakes/medium-decor/1.jpg", alt: "Авторский торт со средним декором" },
  { src: "/cakes/choco-teacups/1.jpg", alt: "Чайная пара из шоколада" },
  { src: "/cakes/3d/1.jpg", alt: "3D торт" },
  { src: "/cakes/tarts/1.jpg", alt: "Тарт с ягодами" },
  { src: "/cakes/bombs/1.jpg", alt: "Шоколадная бомба" },
  { src: "/cakes/square/1.jpg", alt: "Квадратный торт" },
  { src: "/cakes/tea-cakes/1.jpg", alt: "Торт к чаю" },
  { src: "/cakes/tiered-simple/1.jpg", alt: "Ярусный торт" },
  { src: "/cakes/truffles/1.jpg", alt: "Трюфели ручной работы" },
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
        details: ["Вес 1,8 кг", "Ванильный бисквит, сырный крем с маскарпоне, крем на белом шоколаде, свежая клубника, лаймовая прослойка, эклерные коржи с заварным кремом на тёмном шоколаде"],
        image: "/cakes/tea-cakes/1.jpg",
      },
      {
        name: "«Дорогое удовольствие» (малина-фисташка)",
        price: "7 200 ₽",
        details: ["Вес 1,8 кг", "Фисташковый бисквит, фисташковый крем, свежая малина, дробленая фисташка, сырный крем на молочном шоколаде, эклерные коржи"],
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
      { name: "Кейкпопсы", price: "350–450 ₽/шт", details: ["Ванильные и шоколадные, с орехами или наполнителем"], image: cakepopImages[0]?.src },
      { name: "Трюфели ручной работы", price: "от 1 250 ₽ (6 шт)", details: ["24 вкуса на бельгийском шоколаде Калебаут", "6 шт — 1 250, 9 — 1 950, 12 — 2 550, 25 — 5 300, 33 — 6 950"], image: truffleImages[0]?.src },
      { name: "Трайфлы", price: "700–950 ₽", image: trifleImages[0]?.src },
      { name: "Муссовые пирожные", price: "от 2 000 ₽", details: ["Детский набор (4 шт) — 2 000 ₽", "Сердечки/эскимо (6 шт) — 3 600 ₽", "Зайки — 700 ₽/шт (от 4 шт)"], image: mousseImages[0]?.src },
      { name: "Птичье молоко (5 шт)", price: "2 000 ₽", image: ptichyeImages[0]?.src },
      { name: "Нарезные пирожные", price: "500 ₽/шт", image: slicedImages[0]?.src },
      { name: "Мини-тортики чизкейки", price: "4 800 ₽", details: ["Вес от 1,5 кг", "Бисквит, сырный крем на шоколаде, ягодная прослойка, чизкейк"], image: miniCheesecakeImages[0]?.src },
      { name: "Профитроли", price: "3 000 ₽/кг", image: profiterolesImages[0]?.src },
      { name: "Картошка (без начинки / с орехом)", price: "250 ₽/шт", details: ["С вишней или малиной — 300 ₽/шт", "От 6 шт"], image: kartoshkaImages[0]?.src },
      { name: "Картошка в шоколаде", price: "450 ₽/шт", details: ["Апельсин, малина/бейлис, вишня/шоколад, карамель-фундук"], image: kartoshkaImages[2]?.src },
      { name: "Баночки с икрой", price: "1 400–1 500 ₽/шт", details: ["Муссовое пирожное внутри, мармеладная «икра»"], image: caviarJarImages[0]?.src },
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
// Service cards for "What we do" section
// ==========================================
const services = [
  {
    icon: <Cake className="h-10 w-10 text-pink-500" />,
    title: "Торты на заказ",
    description: "Авторские торты любой сложности: от минималистичных до многоярусных конструкций и 3D-шедевров.",
  },
  {
    icon: <Sparkles className="h-10 w-10 text-pink-500" />,
    title: "Шоколадные бомбы",
    description: "Эффектная шоколадная сфера с профитролями или тортом внутри. Идеальный подарок.",
  },
  {
    icon: <Cookie className="h-10 w-10 text-pink-500" />,
    title: "Тарты и десерты",
    description: "Тарты, капкейки, трюфели, муссовые пирожные — порционные десерты для любого события.",
  },
  {
    icon: <CupSoda className="h-10 w-10 text-pink-500" />,
    title: "Чайные пары",
    description: "Чашка с блюдцем из бельгийского шоколада, украшенная цветами ручной работы.",
  },
  {
    icon: <Coffee className="h-10 w-10 text-pink-500" />,
    title: "Торты к чаю",
    description: "Готовые торты со свежей ягодой. Срок годности 24 часа — всегда свежее.",
  },
  {
    icon: <IceCream className="h-10 w-10 text-pink-500" />,
    title: "Фуршетные наборы",
    description: "Комплекты десертов для candy-баров, корпоративов и праздничных фуршетов.",
  },
];

// ==========================================
// Main Component
// ==========================================
const CakeShop = () => {
  const [showCalculator, setShowCalculator] = useState(false);
  const [openCategory, setOpenCategory] = useState<string | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleCategory = (id: string) => {
    setOpenCategory(openCategory === id ? null : id);
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-background via-background to-muted/20">
      <SEO
        title="Торты на заказ во Владивостоке"
        description="Авторские торты на заказ во Владивостоке от 3 300 ₽/кг. 3D торты, ярусные конструкции, шоколадные бомбы, тарты, капкейки. Доставка. Кондитерская Дело Вкуса — звоните +7 (924) 233-79-06"
        keywords="торты на заказ владивосток, торт владивосток, кондитерская владивосток, заказать торт владивосток, торт на заказ, свадебный торт владивосток, детский торт владивосток, торты владивосток цены"
        ogImage="https://delovkusa.site/cakes/medium-decor/1.jpg"
        jsonLd={[
          {
            "@context": "https://schema.org",
            "@type": "LocalBusiness",
            "@id": "https://delovkusa.site/#business",
            "name": "Дело Вкуса",
            "description": "Кондитерская во Владивостоке. Торты на заказ, шоколадные десерты, кондитерские курсы",
            "image": "https://delovkusa.site/logo.png",
            "address": {
              "@type": "PostalAddress",
              "addressLocality": "Владивосток",
              "addressCountry": "RU"
            },
            "telephone": "+7-924-233-79-06",
            "priceRange": "3300-5000 ₽/кг",
            "url": "https://delovkusa.site",
            "sameAs": ["https://instagram.com/ira.gordeeva_"],
            "openingHours": "Mo-Su 09:00-20:00",
            "makesOffer": [
              {
                "@type": "Offer",
                "itemOffered": {
                  "@type": "Product",
                  "name": "Торты на заказ",
                  "description": "Авторские торты любой сложности"
                }
              }
            ]
          },
          {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
              {
                "@type": "Question",
                "name": "Сколько стоит торт на заказ во Владивостоке?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Стоимость начинается от 3 300 ₽/кг. Итоговая цена зависит от сложности декора, начинки и веса. Точную стоимость рассчитаем после обсуждения деталей."
                }
              },
              {
                "@type": "Question",
                "name": "За сколько дней нужно заказывать торт?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Простые торты — за 3-5 дней, сложные 3D и свадебные — за 7-14 дней. Чем раньше вы обратитесь, тем больше шансов получить нужную дату."
                }
              },
              {
                "@type": "Question",
                "name": "Есть ли доставка тортов по Владивостоку?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Да, доставляем по всему Владивостоку. Стоимость доставки рассчитывается индивидуально в зависимости от района."
                }
              },
              {
                "@type": "Question",
                "name": "Какие начинки можно выбрать?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Классические и авторские: ванильно-клубничная, шоколадно-ореховая, фисташка-малина, сырный крем с ягодами, карамель с солёным арахисом и другие."
                }
              },
              {
                "@type": "Question",
                "name": "Можно ли заказать торт на свадьбу или детский праздник?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Да, изготавливаем свадебные ярусные торты, детские 3D торты с фигурками, торты-бомбы, тарты, капкейки и другие десерты под любой повод."
                }
              }
            ]
          },
          {
            "@context": "https://schema.org",
            "@type": "WebSite",
            "url": "https://delovkusa.site",
            "name": "Дело Вкуса",
            "inLanguage": "ru-RU"
          }
        ]}
      />
      {/* ═══════════════════════════ HEADER ═══════════════════════════ */}
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
        className={`sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 ${scrollY > 50 ? "shadow-md" : ""}`}
      >
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/" className="flex items-center space-x-3">
              <motion.div
                whileHover={{ rotate: 5, scale: 1.1 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
                className="h-10 w-10 rounded-2xl bg-pink-600 flex items-center justify-center"
              >
                <Cake className="h-5 w-5 text-white" />
              </motion.div>
              <span className="font-display font-bold text-xl">Дело Вкуса</span>
            </Link>
          </div>

          <nav className="hidden md:flex gap-6">
            <a href="#catalog" className="text-sm font-medium transition-colors hover:text-pink-600 cursor-pointer">Каталог</a>
            <a href="#services" className="text-sm font-medium transition-colors hover:text-pink-600 cursor-pointer">Услуги</a>
            <Link to="/courses" className="text-sm font-medium transition-colors hover:text-pink-600 cursor-pointer">Для кондитеров</Link>
            <a href="#contacts" className="text-sm font-medium transition-colors hover:text-pink-600 cursor-pointer">Контакты</a>
          </nav>

          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <>
                <Button variant="outline" size="sm" className="rounded-full cursor-pointer" onClick={() => navigate("/dashboard")}>
                  Кабинет
                </Button>
                <Button variant="ghost" size="sm" className="rounded-full cursor-pointer" onClick={handleSignOut}>
                  Выйти
                </Button>
              </>
            ) : (
              <Button size="sm" className="rounded-full bg-pink-600 hover:bg-pink-700 cursor-pointer" onClick={() => navigate("/auth")}>
                Войти
              </Button>
            )}
          </div>

          <button className="flex md:hidden cursor-pointer" onClick={() => setIsMenuOpen(!isMenuOpen)} aria-label="Меню">
            <Menu className="h-6 w-6" />
          </button>
        </div>
      </motion.header>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-background md:hidden"
        >
          <div className="container flex h-16 items-center justify-between">
            <Link to="/" className="flex items-center space-x-3">
              <div className="h-10 w-10 rounded-2xl bg-pink-600 flex items-center justify-center">
                <Cake className="h-5 w-5 text-white" />
              </div>
              <span className="font-display font-bold text-xl">Дело Вкуса</span>
            </Link>
            <button onClick={() => setIsMenuOpen(false)} className="cursor-pointer" aria-label="Закрыть меню">
              <X className="h-6 w-6" />
            </button>
          </div>
          <motion.nav
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="container grid gap-2 pb-8 pt-6"
          >
            {[
              { label: "Каталог", href: "#catalog" },
              { label: "Услуги", href: "#services" },
              { label: "Для кондитеров", href: "/courses", isRoute: true },
              { label: "Контакты", href: "#contacts" },
            ].map((item, index) => (
              <motion.div key={index} variants={itemFadeIn}>
                {item.isRoute ? (
                  <Link
                    to={item.href}
                    className="flex items-center justify-between rounded-2xl px-4 py-3 text-lg font-medium hover:bg-accent cursor-pointer"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.label}
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                ) : (
                  <a
                    href={item.href}
                    className="flex items-center justify-between rounded-2xl px-4 py-3 text-lg font-medium hover:bg-accent cursor-pointer"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.label}
                    <ChevronRight className="h-4 w-4" />
                  </a>
                )}
              </motion.div>
            ))}
            <motion.div variants={itemFadeIn} className="flex flex-col gap-3 pt-4">
              {user ? (
                <>
                  <Button className="w-full rounded-full cursor-pointer" onClick={() => { setIsMenuOpen(false); navigate("/dashboard"); }}>
                    Кабинет
                  </Button>
                  <Button variant="outline" className="w-full rounded-full cursor-pointer" onClick={() => { setIsMenuOpen(false); handleSignOut(); }}>
                    Выйти
                  </Button>
                </>
              ) : (
                <Button className="w-full rounded-full bg-pink-600 hover:bg-pink-700 cursor-pointer" onClick={() => { setIsMenuOpen(false); navigate("/auth"); }}>
                  Войти
                </Button>
              )}
            </motion.div>
          </motion.nav>
        </motion.div>
      )}

      <main className="flex-1">
        {/* ═══════════════════════════ HERO ═══════════════════════════ */}
        <section className="w-full py-12 md:py-20 lg:py-28 overflow-hidden">
          <div className="container px-4 md:px-6 border border-muted rounded-3xl bg-gradient-to-br from-background to-muted/30">
            <div className="flex flex-col items-center text-center space-y-8 py-10">
              {/* Badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="inline-flex items-center rounded-full bg-pink-50 px-4 py-1.5 text-sm text-pink-700 border border-pink-200"
              >
                <Zap className="mr-1.5 h-3.5 w-3.5" />
                Авторская кондитерская
              </motion.div>

              {/* Title */}
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.2 }}
                className="text-4xl sm:text-5xl md:text-6xl font-display font-bold tracking-tight max-w-4xl"
              >
                Создаём{" "}
                <GradientText className="bg-white">
                  <FlipWords
                    words={["вкусные", "незабываемые", "сладкие", "особенные"]}
                    duration={2500}
                  />
                </GradientText>{" "}
                моменты
              </motion.h1>

              {/* Subtitle */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.4 }}
                className="max-w-2xl mx-auto text-muted-foreground md:text-xl"
              >
                Авторские торты, десерты и шоколадные изделия ручной работы на бельгийском шоколаде.
                Каждое творение — уникально.
              </motion.p>

              {/* CTA Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.6 }}
                className="flex flex-col gap-3 sm:flex-row"
              >
                <Button
                  size="lg"
                  className="rounded-full bg-pink-600 hover:bg-pink-700 group cursor-pointer"
                  onClick={() => setShowCalculator(true)}
                >
                  <Cake className="mr-2 h-5 w-5" />
                  Рассчитать стоимость
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
                <Button variant="outline" size="lg" className="rounded-full cursor-pointer" asChild>
                  <a href="#catalog">Смотреть каталог</a>
                </Button>
              </motion.div>

              {/* 3D Carousel */}
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="w-full h-[520px] md:h-[700px]"
              >
                <HeroCarousel images={heroCarouselImages} className="h-full" />
              </motion.div>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════ SERVICES ═══════════════════════════ */}
        <section id="services" className="w-full py-12 md:py-24">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            className="container px-4 md:px-6 border border-muted rounded-3xl"
          >
            <div className="flex flex-col items-center justify-center space-y-4 text-center py-10">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="inline-block rounded-full bg-muted px-4 py-1 text-sm"
              >
                Услуги
              </motion.div>
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-3xl font-display font-bold tracking-tight sm:text-4xl md:text-5xl"
              >
                Что я создаю
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="mx-auto max-w-[700px] text-muted-foreground md:text-lg"
              >
                Торты на заказ, десерты, шоколадные бомбы и чайные пары — всё вручную, на бельгийском шоколаде Callebaut
              </motion.p>
            </div>
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="mx-auto grid max-w-5xl gap-4 py-12 md:grid-cols-2 lg:grid-cols-3"
            >
              {services.map((service, index) => (
                <motion.div
                  key={index}
                  variants={itemFadeIn}
                  whileHover={{ y: -8, transition: { duration: 0.3 } }}
                  className="group relative overflow-hidden rounded-3xl border p-6 shadow-sm transition-all hover:shadow-md bg-background/80 cursor-pointer"
                  onClick={() => {
                    const el = document.getElementById("catalog");
                    if (el) el.scrollIntoView({ behavior: "smooth" });
                  }}
                >
                  <div className="absolute -right-20 -top-20 h-40 w-40 rounded-full bg-pink-500/5 group-hover:bg-pink-500/10 transition-all duration-300" />
                  <div className="relative space-y-3">
                    <div className="mb-4">{service.icon}</div>
                    <h3 className="text-xl font-bold">{service.title}</h3>
                    <p className="text-muted-foreground text-sm">{service.description}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </section>

        {/* ═══════════════════════════ CALCULATOR ═══════════════════════════ */}
        {showCalculator && (
          <motion.section
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="w-full"
          >
            <div className="container px-4 md:px-6 py-12">
              <div className="border border-muted rounded-3xl p-6 md:p-10 bg-background">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-display font-bold">Калькулятор стоимости</h2>
                  <Button variant="ghost" size="sm" className="rounded-full cursor-pointer" onClick={() => setShowCalculator(false)}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <CakeCalculator />
              </div>
            </div>
          </motion.section>
        )}

        {/* ═══════════════════════════ CATALOG ═══════════════════════════ */}
        <section id="catalog" className="w-full py-12 md:py-24">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            className="container px-4 md:px-6 border border-muted rounded-3xl bg-muted/10"
          >
            <div className="flex flex-col items-center justify-center space-y-4 text-center py-10">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="inline-block rounded-full bg-muted px-4 py-1 text-sm"
              >
                Каталог
              </motion.div>
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-3xl font-display font-bold tracking-tight sm:text-4xl md:text-5xl"
              >
                Наши изделия
              </motion.h2>
            </div>

            <div className="max-w-4xl mx-auto space-y-3 py-8">
              {categories.map((cat) => {
                const isOpen = openCategory === cat.id;
                return (
                  <motion.div
                    key={cat.id}
                    variants={itemFadeIn}
                    className={`rounded-3xl border transition-all duration-300 overflow-hidden ${
                      isOpen
                        ? `${cat.borderColor} shadow-lg`
                        : "border-muted hover:border-muted-foreground/20 hover:shadow-sm"
                    }`}
                  >
                    <button
                      onClick={() => toggleCategory(cat.id)}
                      className={`w-full flex items-center gap-4 p-4 md:p-5 text-left transition-colors duration-200 cursor-pointer ${
                        isOpen ? cat.bgColor : "bg-background hover:bg-muted/40"
                      }`}
                    >
                      <div className="w-14 h-14 md:w-16 md:h-16 rounded-2xl overflow-hidden flex-shrink-0 shadow-sm">
                        <img
                          src={cat.coverImage}
                          alt={cat.title}
                          className="w-full h-full object-cover"
                          width={64}
                          height={64}
                          loading="lazy"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className={`text-lg md:text-xl font-semibold ${isOpen ? cat.color : "text-foreground"}`}>
                          {cat.title}
                        </h3>
                        <p className="text-sm text-muted-foreground truncate">{cat.description}</p>
                      </div>
                      <ChevronRight
                        className={`w-5 h-5 flex-shrink-0 text-muted-foreground transition-transform duration-300 ${
                          isOpen ? "rotate-90" : ""
                        }`}
                      />
                    </button>

                    {isOpen && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                        className="px-4 md:px-6 pb-6 pt-2 bg-background"
                      >
                        {cat.id === "cakes" ? (
                          <div className="space-y-6">
                            <p className="text-sm text-muted-foreground mb-2">
                              Сахарная печать оплачивается отдельно — 400 ₽/лист. Фигурки ручной лепки рассчитываются индивидуально.
                            </p>
                            {cakeSubCategories.map((sub, si) => (
                              <div key={si} className="border border-muted rounded-2xl overflow-hidden">
                                <div className="p-3 bg-pink-50/60 flex items-baseline justify-between gap-2">
                                  <h4 className="font-semibold text-foreground">{sub.title}</h4>
                                  <span className="text-sm font-semibold text-pink-600 whitespace-nowrap">{sub.pricePerKg}</span>
                                </div>
                                {sub.note && <p className="px-3 pt-1 text-xs text-muted-foreground">{sub.note}</p>}
                                <div className="p-4">
                                  <CategoryGallery images={sub.gallery} columns={2} />
                                </div>
                              </div>
                            ))}
                            <div className="mt-4 text-center">
                              <Button
                                onClick={() => setShowCalculator(true)}
                                className="bg-pink-600 hover:bg-pink-700 text-white rounded-full px-6 cursor-pointer"
                              >
                                <Cake className="w-4 h-4 mr-2" />
                                Рассчитать стоимость
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <>
                            {cat.gallery.length > 0 && (
                              <div className="mb-6">
                                <CategoryGallery images={cat.gallery} columns={2} />
                              </div>
                            )}
                            <div className="space-y-2">
                              {cat.products.map((product, idx) => (
                                <div
                                  key={idx}
                                  className="flex items-start gap-3 p-3 rounded-2xl bg-muted/30 hover:bg-muted/50 transition-colors"
                                >
                                  {product.image && (
                                    <div className="w-12 h-12 rounded-xl overflow-hidden flex-shrink-0">
                                      <img
                                        src={product.image}
                                        alt={product.name}
                                        className="w-full h-full object-cover"
                                        width={48}
                                        height={48}
                                        loading="lazy"
                                      />
                                    </div>
                                  )}
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-baseline justify-between gap-2">
                                      <span className="font-medium text-foreground text-sm md:text-base">{product.name}</span>
                                      {product.price && (
                                        <span className="text-sm font-semibold text-pink-600 whitespace-nowrap">{product.price}</span>
                                      )}
                                    </div>
                                    {product.details && (
                                      <div className="flex flex-wrap gap-x-3 gap-y-0.5 mt-0.5">
                                        {product.details.map((d, i) => (
                                          <span key={i} className="text-xs text-muted-foreground">{d}</span>
                                        ))}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </>
                        )}
                      </motion.div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </section>

        {/* ═══════════════════════════ ABOUT ═══════════════════════════ */}
        <section className="w-full py-12 md:py-24">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            className="container px-4 md:px-6 border border-muted rounded-3xl bg-muted/20"
          >
            <div className="grid gap-8 lg:grid-cols-2 py-10 px-6">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                className="space-y-6"
              >
                <div className="inline-block rounded-full bg-background px-4 py-1 text-sm">О мастере</div>
                <h2 className="text-3xl font-display font-bold tracking-tight sm:text-4xl">Ирина Гордеева</h2>
                <p className="text-muted-foreground md:text-lg leading-relaxed">
                  Кондитер со стажем работы более 10 лет. Награждена серебряной медалью на английской
                  онлайн-выставке (Бирмингем) за торт с шоколадными цветами.
                </p>
                <p className="text-muted-foreground md:text-lg leading-relaxed">
                  Автор рецептов тортов и десертов. Преподающий мастер — веду курсы по пластичному
                  шоколаду и цветам, а также по 3D-тортам.
                </p>
                <div className="flex flex-col gap-3 sm:flex-row">
                  <Button variant="outline" size="lg" className="rounded-full cursor-pointer" asChild>
                    <Link to="/courses">Курсы для кондитеров</Link>
                  </Button>
                </div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                className="flex items-center justify-center"
              >
                <div className="relative w-full h-[350px] md:h-[450px] overflow-hidden rounded-3xl">
                  <img
                    src="/cakes/square/5.jpg"
                    alt="Авторский торт от Ирины Гордеевой"
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
              </motion.div>
            </div>
          </motion.div>
        </section>

        {/* ═══════════════════════════ CONTACTS ═══════════════════════════ */}
        <section id="contacts" className="w-full py-12 md:py-24">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            className="container px-4 md:px-6 border border-muted rounded-3xl"
          >
            <div className="grid gap-8 lg:grid-cols-2 py-10 px-6">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                className="space-y-6"
              >
                <div className="inline-block rounded-full bg-muted px-4 py-1 text-sm">Контакты</div>
                <h2 className="text-3xl font-display font-bold tracking-tight md:text-4xl">
                  Готовы сделать заказ?
                </h2>
                <p className="max-w-[600px] text-muted-foreground md:text-lg">
                  Свяжитесь для оформления заказа или консультации. Обсудим детали, сроки и декор.
                </p>

                <div className="space-y-4 pt-4">
                  <motion.div whileHover={{ x: 5 }} className="flex items-start gap-3">
                    <div className="rounded-2xl bg-muted p-2.5">
                      <MapPin className="h-5 w-5 text-pink-600" />
                    </div>
                    <div>
                      <h3 className="font-medium">Адрес</h3>
                      <p className="text-sm text-muted-foreground">г. Владивосток</p>
                    </div>
                  </motion.div>
                  <motion.div whileHover={{ x: 5 }} className="flex items-start gap-3">
                    <div className="rounded-2xl bg-muted p-2.5">
                      <Phone className="h-5 w-5 text-pink-600" />
                    </div>
                    <div>
                      <h3 className="font-medium">Телефон</h3>
                      <a href="tel:+79242337906" className="text-sm text-pink-600 hover:text-pink-700 transition-colors cursor-pointer font-medium">+7 (924) 233-79-06</a>
                    </div>
                  </motion.div>
                </div>

                <div className="flex space-x-3 pt-4">
                  <motion.div whileHover={{ y: -5, scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                    <a
                      href="https://instagram.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center rounded-2xl border p-2.5 text-muted-foreground hover:text-foreground hover:border-pink-300 transition-colors cursor-pointer"
                      aria-label="Instagram"
                    >
                      <Instagram className="h-5 w-5" />
                    </a>
                  </motion.div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                className="flex flex-col gap-4 justify-center"
              >
                <Button
                  size="lg"
                  className="bg-pink-600 hover:bg-pink-700 text-white rounded-full shadow-lg shadow-pink-200/50 hover:shadow-xl transition-all cursor-pointer text-lg py-6"
                  asChild
                >
                  <a href="tel:+79242337906">
                    <Phone className="mr-2 h-5 w-5" />
                    Позвонить +7 (924) 233-79-06
                  </a>
                </Button>
              </motion.div>
            </div>
          </motion.div>
        </section>
      </main>

      {/* ═══════════════════════════ FOOTER ═══════════════════════════ */}
      <footer className="w-full border-t">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeIn}
          className="container grid gap-8 px-4 py-10 md:px-6 lg:grid-cols-3"
        >
          <div className="space-y-4">
            <Link to="/" className="flex items-center space-x-3">
              <div className="h-10 w-10 rounded-2xl bg-pink-600 flex items-center justify-center">
                <Cake className="h-5 w-5 text-white" />
              </div>
              <span className="font-display font-bold text-xl">Дело Вкуса</span>
            </Link>
            <p className="text-sm text-muted-foreground">
              Авторские торты, десерты и шоколадные изделия ручной работы. г. Владивосток.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-medium mb-4">Навигация</h3>
            <nav className="flex flex-col space-y-2 text-sm">
              <a href="#catalog" className="text-muted-foreground hover:text-foreground cursor-pointer">Каталог</a>
              <a href="#services" className="text-muted-foreground hover:text-foreground cursor-pointer">Услуги</a>
              <Link to="/courses" className="text-muted-foreground hover:text-foreground cursor-pointer">Для кондитеров</Link>
              <a href="#contacts" className="text-muted-foreground hover:text-foreground cursor-pointer">Контакты</a>
            </nav>
          </div>
          <div>
            <h3 className="text-lg font-medium mb-4">Документы</h3>
            <nav className="flex flex-col space-y-2 text-sm">
              <Link to="/offer" className="text-muted-foreground hover:text-foreground cursor-pointer">Публичная оферта</Link>
              <Link to="/terms" className="text-muted-foreground hover:text-foreground cursor-pointer">Пользовательское соглашение</Link>
              <Link to="/privacy" className="text-muted-foreground hover:text-foreground cursor-pointer">Политика конфиденциальности</Link>
            </nav>
          </div>
        </motion.div>
        <div className="border-t">
          <div className="container flex flex-col items-center justify-between gap-4 py-6 md:h-16 md:flex-row md:py-0">
            <p className="text-xs text-muted-foreground">
              &copy; {new Date().getFullYear()} Дело Вкуса. Все права защищены.
            </p>
            <p className="text-xs text-muted-foreground">ИНН 253615143415</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default CakeShop;
