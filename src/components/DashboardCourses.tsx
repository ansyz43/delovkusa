import React, { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useAuth } from "../lib/AuthContext";
import { useUserCourses } from "../lib/useUserCourses";
import { apiFetch } from "../lib/api";
import Header from "./Header";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import {
  BookOpen,
  ArrowLeft,
  Clock,
  CheckCircle,
  PlayCircle,
  Lock,
  ChevronRight,
  FileText,
  Download,
  Loader2,
} from "lucide-react";

// Список доступных курсов (в реальном проекте — из Supabase)
const allCourses = [
  {
    id: "roses",
    title: "Лепестками роз",
    description:
      "Научитесь создавать потрясающие торты с украшениями из лепестков роз. Техники работы с мастикой и кремом.",
    image: "/roza2.jpg",
    lessons: 17,
    duration: "~70 часов видео",
    href: "/courses/roses",
    learnHref: "/dashboard/courses/roses/learn",
  },
  {
    id: "cream",
    title: "Финишный крем",
    description:
      "Освойте технику работы с финишным кремом для идеальных тортов. Выравнивание, текстуры и декор.",
    image: "/cre1.jpg",
    lessons: 9,
    duration: "~4 часа",
    href: "/courses/cream",
    learnHref: "/dashboard/courses/cream/learn",
  },
  {
    id: "vase",
    title: "Ваза с цветами",
    description:
      "Создайте невероятный торт в виде вазы с цветами. Лепка, сборка и финальное оформление.",
    image: "/vaza1.jpg",
    lessons: 10,
    duration: "5 часов",
    href: "/courses/vase",
    learnHref: "/dashboard/courses/vase/learn",
  },
  {
    id: "ostrov",
    title: "Остров",
    description:
      "Уникальный курс по созданию торта «Остров». Сложные техники декорирования и сборки.",
    image: "/ostrov.jpg",
    lessons: 18,
    duration: "7 часов",
    href: "/courses/ostrov",
    learnHref: "/dashboard/courses/ostrov/learn",
  },
  {
    id: "plastic-chocolate",
    title: "Пластичный шоколад",
    description:
      "Мастер-класс по работе с пластичным шоколадом. Создание фигур, цветов и декоративных элементов.",
    image: "/plastic-chocolate.jpg",
    lessons: 9,
    duration: "4.5 часа",
    href: "/courses/plastic-chocolate",
    learnHref: "/dashboard/courses/plastic-chocolate/learn",
  },
];

const allTechCards = [
  { id: "tc-chereshnevyj-tryufel", title: "Черешневый трюфель" },
  { id: "tc-chereshnevye-tryufeli-mk", title: "Изысканные черешневые трюфели (МК)" },
  { id: "tc-plastichnyj-shokolad", title: "Рецепт пластичного шоколада" },
  { id: "tc-shifonovyj-biskvit", title: "Шоколадный шифоновый бисквит" },
  { id: "tc-tart-yagoda", title: "Тарт со свежей ягодой" },
  { id: "tc-chernichnye-nochi", title: "Торт «Черничные ночи»" },
  { id: "tc-tayozhnyj-roman", title: "Торт «Таёжный роман»" },
  { id: "tc-vishnya-v-shokolade", title: "Торт «Вишня в шоколаде»" },
  { id: "tc-tryufel-chernosliv", title: "Трюфель «Чернослив-кедровый орех»" },
  { id: "tc-tryufel-malinovyj", title: "Трюфель «Малиновый шоколад»" },
];

const DashboardCourses = () => {
  const { user, isAdmin } = useAuth();
  const { courseIds: purchasedCourseIds, loading: coursesLoading } = useUserCourses();
  const [buyingTcId, setBuyingTcId] = useState<string | null>(null);

  const purchasedTechCards = allTechCards.filter((tc) => purchasedCourseIds.includes(tc.id));
  const purchasedCourses = allCourses.filter((c) => purchasedCourseIds.includes(c.id));

  const handleBuyTechCard = async (tcId: string) => {
    setBuyingTcId(tcId);
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
      alert("Ошибка сети");
    } finally {
      setBuyingTcId(null);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-background via-background to-muted/20">
      <Header />

      <main className="flex-1 py-8 md:py-12 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-5xl mx-auto"
        >
          {/* Навигация */}
          <Link
            to="/dashboard"
            className="inline-flex items-center text-muted-foreground hover:text-pink-600 mb-6 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Личный кабинет
          </Link>

          <div className="flex items-center gap-3 mb-8">
            <BookOpen className="w-8 h-8 text-pink-600" />
            <h1 className="text-3xl font-display font-bold">Мои курсы</h1>
          </div>

          {/* Купленные курсы */}
          {purchasedCourses.length > 0 ? (
            <div className="mb-12">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {allCourses
                  .filter((c) => purchasedCourseIds.includes(c.id))
                  .map((course) => (
                    <Card
                      key={course.id}
                      className="rounded-3xl border shadow-sm overflow-hidden hover:shadow-lg transition-all bg-background/80"
                    >
                      <div className="flex flex-col sm:flex-row">
                        <div className="sm:w-40 h-32 sm:h-auto bg-gray-200 flex-shrink-0">
                          <img
                            src={course.image}
                            alt={course.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 p-4">
                          <h3 className="font-semibold mb-1">
                            {course.title}
                          </h3>
                          <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
                            {course.description}
                          </p>
                          <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
                            <span className="flex items-center gap-1">
                              <PlayCircle className="w-3 h-3" />
                              {course.lessons} уроков
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {course.duration}
                            </span>
                          </div>
                          {course.learnHref ? (
                            <Link to={course.learnHref}>
                              <Button
                                size="sm"
                                className="bg-green-600 hover:bg-green-700 text-white"
                              >
                                <PlayCircle className="w-4 h-4 mr-1" />
                                Продолжить
                              </Button>
                            </Link>
                          ) : (
                            <Link to={course.href}>
                              <Button
                                size="sm"
                                className="bg-pink-600 hover:bg-pink-700 text-white"
                              >
                                <PlayCircle className="w-4 h-4 mr-1" />
                                Подробнее
                              </Button>
                            </Link>
                          )}
                        </div>
                      </div>
                    </Card>
                  ))}
              </div>
            </div>
          ) : (
            <div className="mb-12 rounded-3xl border border-muted bg-background/80 p-8 text-center">
              <div className="w-16 h-16 bg-muted rounded-2xl flex items-center justify-center mx-auto mb-4">
                <BookOpen className="w-8 h-8 text-gray-400" />
              </div>
              <h2 className="text-xl font-semibold mb-2">
                У вас пока нет курсов
              </h2>
              <p className="text-muted-foreground mb-6">
                Выберите курс из каталога и начните обучение уже сегодня!
              </p>
              <Link to="/courses">
                <Button className="bg-pink-600 hover:bg-pink-700 text-white rounded-full cursor-pointer">
                  Перейти в каталог
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>
            </div>
          )}

          {/* Купленные техкарты */}
          {purchasedTechCards.length > 0 && (
            <div className="mb-12">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-pink-600" />
                Мои техкарты
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {purchasedTechCards.map((tc) => (
                  <Card key={tc.id} className="rounded-3xl border shadow-sm hover:shadow-md transition-all bg-background/80">
                    <CardContent className="p-4 flex items-center gap-3">
                      <div className="bg-pink-100 p-2 rounded-lg flex-shrink-0">
                        <FileText className="w-5 h-5 text-pink-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-sm truncate">{tc.title}</h3>
                        <span className="text-xs text-green-600">PDF</span>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-pink-200 text-pink-600 hover:bg-pink-50 flex-shrink-0"
                        onClick={async () => {
                          try {
                            const resp = await apiFetch(`/api/courses/${tc.id}/download`);
                            if (!resp.ok) { alert("Ошибка при скачивании"); return; }
                            const blob = await resp.blob();
                            const url = URL.createObjectURL(blob);
                            const a = document.createElement("a");
                            a.href = url;
                            const disposition = resp.headers.get("content-disposition");
                            const match = disposition?.match(/filename="?(.+?)"?$/i);
                            a.download = match?.[1] || `${tc.id}.pdf`;
                            document.body.appendChild(a);
                            a.click();
                            a.remove();
                            URL.revokeObjectURL(url);
                          } catch { alert("Ошибка сети"); }
                        }}
                      >
                        <Download className="w-4 h-4" />
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Все доступные курсы */}
          <div>
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-blue-600" />
              Доступные курсы
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {allCourses.map((course) => {
                const isPurchased = purchasedCourseIds.includes(course.id);
                return (
                  <Card
                    key={course.id}
                    className="rounded-3xl border shadow-sm overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1 bg-background/80"
                  >
                    <div className="relative h-40 bg-gray-200">
                      <img
                        src={course.image}
                        alt={course.title}
                        className="w-full h-full object-cover"
                      />
                      {isPurchased && (
                        <div className="absolute top-2 right-2 bg-green-600 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                          <CheckCircle className="w-3 h-3" />
                          Куплен
                        </div>
                      )}
                    </div>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">
                        {course.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
                        {course.description}
                      </p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4">
                        <span className="flex items-center gap-1">
                          <PlayCircle className="w-3 h-3" />
                          {course.lessons} уроков
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {course.duration}
                        </span>
                      </div>
                      <div className="space-y-2">
                        <Link to={course.href}>
                          <Button
                            variant={isPurchased ? "outline" : "default"}
                            className={
                              isPurchased
                                ? "w-full border-green-200 text-green-600 hover:bg-green-50"
                                : "w-full bg-pink-600 hover:bg-pink-700 text-white"
                            }
                          >
                            {isPurchased ? (
                              <>
                                <PlayCircle className="w-4 h-4 mr-1" />
                                Открыть курс
                              </>
                            ) : (
                              <>
                                Подробнее
                                <ChevronRight className="w-4 h-4 ml-1" />
                              </>
                            )}
                          </Button>
                        </Link>
                        {(course as any).learnHref && (
                          <Link to={(course as any).learnHref}>
                            <Button
                              className="w-full bg-green-600 hover:bg-green-700 text-white mt-2"
                            >
                              <PlayCircle className="w-4 h-4 mr-1" />
                              Начать обучение
                            </Button>
                          </Link>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </motion.div>
      </main>

      <footer className="w-full border-t">
        <div className="container flex flex-col items-center justify-between gap-4 py-6 md:h-16 md:flex-row md:py-0">
          <p className="text-xs text-muted-foreground">&copy; {new Date().getFullYear()} Дело Вкуса. Все права защищены.</p>
          <div className="flex gap-4 text-xs flex-wrap justify-center">
            <Link to="/offer" className="text-muted-foreground hover:text-foreground cursor-pointer">Публичная оферта</Link>
            <Link to="/terms" className="text-muted-foreground hover:text-foreground cursor-pointer">Пользовательское соглашение</Link>
            <Link to="/privacy" className="text-muted-foreground hover:text-foreground cursor-pointer">Политика конфиденциальности</Link>
          </div>
          <p className="text-xs text-muted-foreground">ИНН 253615143415</p>
        </div>
      </footer>
    </div>
  );
};

export default DashboardCourses;
