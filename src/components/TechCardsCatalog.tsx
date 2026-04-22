import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../lib/AuthContext";
import { useUserCourses } from "../lib/useUserCourses";
import { apiFetch } from "../lib/api";
import { Button } from "./ui/button";
import { FileText, Download, Loader2, CheckCircle } from "lucide-react";

interface TechCard {
  id: string;
  title: string;
  description: string;
  highlights: string[];
  price: number;
  priceLabel: string;
  image?: string;
}

const techCards: TechCard[] = [
  {
    id: "tc-chereshnevyj-tryufel",
    title: "Черешневый трюфель",
    description:
      "Авторский рецепт нежного трюфеля с черешней на сливках 33–35% и тёмном шоколаде 54%. Точные пропорции и технология ганаша с сохранением ягодных ноток.",
    highlights: ["Сливки 33–35%", "Тёмный шоколад 54%", "Пошаговая техкарта"],
    price: 2000,
    priceLabel: "2 000 ₽",
  },
  {
    id: "tc-shifonovyj-biskvit",
    title: "Шоколадный шифоновый бисквит",
    description:
      "Воздушный, влажный и устойчивый бисквит для ярусных и 3D-тортов. Базовая техкарта, на основе которой собирают «Остров», «Таёжный роман» и десятки авторских тортов.",
    highlights: ["Для 3D и ярусных тортов", "Форма 20 см", "База для начинок"],
    price: 2000,
    priceLabel: "2 000 ₽",
  },
  {
    id: "tc-tart-yagoda",
    title: "Тарт и кольца со свежей ягодой",
    description:
      "Песочное тесто, крем на маскарпоне 82,5% и молоке 3,2%, свежая ягода. Форматы — классический тарт и индивидуальные кольца для кафе и кондитерских.",
    highlights: ["Песочная основа", "Крем на маскарпоне", "Тарт + кольца"],
    price: 2000,
    priceLabel: "2 000 ₽",
  },
  {
    id: "tc-chernichnye-nochi",
    title: "Торт «Черничные ночи»",
    description:
      "Авторский торт на 18 см, рассчитан на 4 коржа. Черничный бисквит, кремчиз с маскарпоне, черничное конфи, пралине и хрустящий слой. Полная техкарта сборки и стабилизации.",
    highlights: ["Форма 18 см", "4 коржа", "Кремчиз + конфи + пралине"],
    price: 2000,
    priceLabel: "2 000 ₽",
    image: "/techcards/chernichnye-nochi.jpg",
  },
  {
    id: "tc-tayozhnyj-roman",
    title: "Торт «Таёжный роман»",
    description:
      "Эффектный торт 18 см: кедровый бисквит, творожный крем, кремю на белом шоколаде, брусничное компоте и клюквенный мусс. Финишный крем на белом шоколаде + велюр — хит для осенне-зимнего меню.",
    highlights: ["Форма 18 см", "Кедровый бисквит + брусника", "Мусс + кремю"],
    price: 2000,
    priceLabel: "2 000 ₽",
    image: "/techcards/tayozhnyj-roman.jpg",
  },
  {
    id: "tc-vishnya-v-shokolade",
    title: "Торт «Вишня в шоколаде»",
    description:
      "Шоколадный шифоновый бисквит, шоколадный кремчиз с маскарпоне, вишнёвое компоте, карамелизованный грецкий орех и вишнёвое кремю. Финишный крем на тёмном шоколаде Callebaut 54,5%.",
    highlights: ["Callebaut 54,5%", "Вишнёвое компоте + кремю", "Карамелизованный орех"],
    price: 2000,
    priceLabel: "2 000 ₽",
    image: "/techcards/vishnya-v-shokolade.jpg",
  },
  {
    id: "tc-tryufel-chernosliv",
    title: "Трюфель «Чернослив — кедровый орех»",
    description:
      "Необычный конфетный трюфель: чернослив, кедровый орех, сливки 35% и тёмный шоколад 54%. Чистые пропорции для стабильного ганаша и яркого послевкусия.",
    highlights: ["Чернослив + кедр", "Сливки 35%", "Шоколад 54%"],
    price: 2000,
    priceLabel: "2 000 ₽",
  },
  {
    id: "tc-tryufel-malinovyj",
    title: "Трюфель «Малиновый шоколад»",
    description:
      "Яркий малиновый трюфель на сливочной основе и малиновом пюре. Указаны все граммовки для корпуса, начинки и шоколадной глазури — техкарта под продажу.",
    highlights: ["Малиновое пюре", "Сливочный корпус", "Готов к продаже"],
    price: 2000,
    priceLabel: "2 000 ₽",
  },
];

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};
const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
};
const itemFadeIn = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

const TechCardsCatalog: React.FC = () => {
  const { user } = useAuth();
  const { courseIds, loading: accessLoading } = useUserCourses();
  const [buyingId, setBuyingId] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleBuy = async (tcId: string) => {
    if (!user) {
      navigate("/auth");
      return;
    }
    setBuyingId(tcId);
    try {
      const resp = await apiFetch("/api/payments/create", {
        method: "POST",
        body: JSON.stringify({ course_id: tcId }),
      });
      if (!resp.ok) {
        const data = await resp.json();
        alert(data.detail || "Ошибка при создании платежа");
        return;
      }
      const data = await resp.json();
      window.location.href = data.confirmation_url;
    } catch {
      alert("Ошибка сети. Попробуйте ещё раз.");
    } finally {
      setBuyingId(null);
    }
  };

  const handleDownload = async (tcId: string) => {
    try {
      const resp = await apiFetch(`/api/courses/${tcId}/download`);
      if (!resp.ok) {
        alert("Ошибка при скачивании файла");
        return;
      }
      const blob = await resp.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      const disposition = resp.headers.get("content-disposition");
      const match = disposition?.match(/filename="?(.+?)"?$/i);
      a.download = match?.[1] || `${tcId}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch {
      alert("Ошибка сети при скачивании");
    }
  };

  return (
    <section id="tech-cards" className="w-full py-12 md:py-24">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeIn}
        className="container px-4 md:px-6 border border-muted rounded-3xl bg-muted/10"
      >
        <div className="flex flex-col items-center justify-center space-y-4 text-center py-10">
          <div className="inline-block rounded-full bg-muted px-4 py-1 text-sm">
            Для кондитеров
          </div>
          <h2 className="text-3xl font-display font-bold tracking-tight sm:text-4xl">
            Техкарты рецептов
          </h2>
          <p className="max-w-2xl text-muted-foreground md:text-lg">
            Готовые техкарты в PDF с точными пропорциями и пошаговой технологией.
            Скачайте сразу после оплаты и используйте прямо на кухне.
          </p>
        </div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 pb-10 px-2 md:px-4"
        >
          {techCards.map((tc) => {
            const hasAccess = courseIds.includes(tc.id);
            const isBuying = buyingId === tc.id;

            return (
              <motion.div
                key={tc.id}
                variants={itemFadeIn}
                className="flex flex-col rounded-3xl border border-muted bg-background shadow-sm hover:shadow-md hover:border-pink-200 transition-all duration-300 overflow-hidden"
              >
                {tc.image && (
                  <div className="aspect-[4/3] w-full overflow-hidden bg-muted/30">
                    <img
                      src={tc.image}
                      alt={tc.title}
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                    />
                  </div>
                )}
                <div className="flex flex-col flex-grow p-6">
                <div className="flex items-start gap-3 mb-3">
                  <div className="rounded-2xl bg-pink-50 p-2.5 flex-shrink-0">
                    <FileText className="w-5 h-5 text-pink-600" />
                  </div>
                  <h3 className="font-semibold text-foreground leading-tight pt-1">
                    {tc.title}
                  </h3>
                </div>

                <p className="text-sm text-muted-foreground mb-4 flex-grow">
                  {tc.description}
                </p>

                <div className="flex flex-wrap gap-1.5 mb-5">
                  {tc.highlights.map((h, i) => (
                    <span
                      key={i}
                      className="inline-block rounded-full bg-muted/60 px-2.5 py-0.5 text-xs text-muted-foreground"
                    >
                      {h}
                    </span>
                  ))}
                </div>

                {accessLoading ? (
                  <div className="h-10" />
                ) : hasAccess ? (
                  <div className="space-y-2">
                    <div className="flex items-center gap-1.5 text-green-600 text-sm font-medium">
                      <CheckCircle className="w-4 h-4" />
                      Куплено
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      className="w-full rounded-full text-pink-600 border-pink-200 hover:bg-pink-50 cursor-pointer"
                      onClick={() => handleDownload(tc.id)}
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Скачать PDF
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between pt-2 border-t border-muted">
                    <span className="text-lg font-bold text-foreground">
                      {tc.priceLabel}
                    </span>
                    <Button
                      size="sm"
                      className="rounded-full bg-pink-600 hover:bg-pink-700 text-white cursor-pointer"
                      disabled={isBuying}
                      onClick={() => handleBuy(tc.id)}
                    >
                      {isBuying ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        "Купить"
                      )}
                    </Button>
                  </div>
                )}
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </motion.div>
    </section>
  );
};

export default TechCardsCatalog;
