import React from "react";
import { motion } from "framer-motion";
import { CheckCircle, Sparkles } from "lucide-react";
import BuyCourseButton from "./BuyCourseButton";

interface Bundle {
  id: string;
  title: string;
  subtitle: string;
  courses: string[];
  price: string;
  priceValue: number;
  oldPrice: string;
  discount: string;
  highlight?: boolean;
  badge?: string;
}

const bundles: Bundle[] = [
  {
    id: "bundle-novice",
    title: "Комплект «Новичок»",
    subtitle: "Старт в домашней кондитерке",
    courses: ["Пластичный шоколад", "Финишный крем"],
    price: "6 900 ₽",
    priceValue: 6900,
    oldPrice: "8 000 ₽",
    discount: "−14%",
  },
  {
    id: "bundle-mid",
    title: "Комплект «Средний»",
    subtitle: "Готовый путь от бисквита до авторского торта",
    courses: ["Пластичный шоколад", "Финишный крем", "Ваза с цветами"],
    price: "10 900 ₽",
    priceValue: 10900,
    oldPrice: "13 900 ₽",
    discount: "−21%",
    highlight: true,
    badge: "Хит продаж",
  },
  {
    id: "bundle-all",
    title: "Полный комплект",
    subtitle: "Все 5 курсов — экономия 6 400 ₽",
    courses: [
      "Пластичный шоколад",
      "Финишный крем",
      "Ваза с цветами",
      "Остров",
      "Лепестками роз",
    ],
    price: "19 900 ₽",
    priceValue: 19900,
    oldPrice: "26 300 ₽",
    discount: "−24%",
  },
];

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

const BundleCatalog: React.FC = () => {
  return (
    <section id="bundles" className="w-full py-12 md:py-24 bg-gradient-to-b from-pink-50/40 via-white to-white">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeIn}
        className="container px-4 md:px-6"
      >
        <div className="flex flex-col items-center justify-center space-y-4 text-center mb-10">
          <div className="inline-flex items-center gap-2 rounded-full bg-pink-100 px-4 py-1 text-sm font-medium text-pink-700">
            <Sparkles className="h-4 w-4" />
            Выгодные комплекты
          </div>
          <h2 className="text-3xl font-display font-bold tracking-tight sm:text-4xl md:text-5xl">
            Берите сразу несколько курсов —
            <br className="hidden md:block" />
            <span className="text-pink-600">экономьте до 6 400 ₽</span>
          </h2>
          <p className="max-w-2xl text-muted-foreground md:text-lg">
            Доступ ко всем курсам из комплекта открывается сразу после оплаты.
            Никаких ограничений по времени.
          </p>
        </div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mx-auto grid max-w-6xl gap-5 md:grid-cols-3"
        >
          {bundles.map((bundle) => (
            <motion.div
              key={bundle.id}
              variants={itemFadeIn}
              whileHover={{ y: -6, transition: { duration: 0.3 } }}
              className={`relative flex flex-col rounded-3xl border bg-white p-6 shadow-sm transition-all hover:shadow-lg ${
                bundle.highlight
                  ? "border-pink-500 ring-2 ring-pink-500/30"
                  : "border-pink-100"
              }`}
            >
              {bundle.badge && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-pink-600 px-4 py-1 text-xs font-semibold text-white shadow-md">
                  {bundle.badge}
                </span>
              )}

              <span className="self-start rounded-full bg-green-100 px-3 py-0.5 text-xs font-bold text-green-700">
                {bundle.discount}
              </span>

              <h3 className="mt-3 text-xl font-bold text-gray-900">
                {bundle.title}
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">
                {bundle.subtitle}
              </p>

              <ul className="mt-5 space-y-2 flex-1">
                {bundle.courses.map((c) => (
                  <li
                    key={c}
                    className="flex items-start gap-2 text-sm text-gray-700"
                  >
                    <CheckCircle className="h-4 w-4 text-pink-500 mt-0.5 flex-shrink-0" />
                    <span>{c}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-6 flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-pink-600">
                  {bundle.price}
                </span>
                <span className="text-sm text-gray-400 line-through">
                  {bundle.oldPrice}
                </span>
              </div>

              <div className="mt-4">
                <BuyCourseButton
                  courseId={bundle.id}
                  price={bundle.price}
                  learnHref="/dashboard/courses"
                  variant="cta"
                  className="w-full"
                />
              </div>
            </motion.div>
          ))}
        </motion.div>

        <p className="mt-8 text-center text-xs text-muted-foreground">
          Доступ ко всем курсам в комплекте выдаётся автоматически после оплаты.
          Оплата защищена через ЮKassa.
        </p>
      </motion.div>
    </section>
  );
};

export default BundleCatalog;
