import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import {
  Cake,
  Award,
  BookOpen,
  Users,
  Gift,
  ArrowRight,
  ChevronRight,
  Zap,
  Clock,
  Menu,
  X,
} from "lucide-react";
import { Button } from "./ui/button";
import { GradientText } from "./ui/gradient-text";
import { useAuth } from "../lib/AuthContext";
import TechCardsCatalog from "./TechCardsCatalog";

// ==========================================
// Animation variants
// ==========================================
const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};
const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.12 } },
};
const itemFadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

// ==========================================
// Course data
// ==========================================
const courses = [
  {
    id: "roses",
    title: "Курс «Лепестками роз»",
    description:
      "18 видов цветов: Мондиаль, Остина, Катана, махровая и быстрые розы. 50+ видео, раздел для новичков.",
    price: "5 000 ₽",
    image: "/roza2.jpg",
    href: "/courses/roses",
    level: "Для начинающих",
    modules: "18 модулей",
  },
  {
    id: "cream",
    title: "Курс «Финишный крем»",
    description:
      "9 модулей: два рецепта крема, велюр, крем-дамба, выравнивание квадрата, сборка ярусных тортов.",
    price: "3 500 ₽",
    image: "/cre1.jpg",
    href: "/courses/cream",
    level: "Для начинающих",
    modules: "9 модулей",
  },
  {
    id: "vase",
    title: "Курс «Ваза с цветами»",
    description:
      "21 модуль — от черничного бисквита до готовой вазы с 7 видами цветов. Рецепты, финишный крем и велюр.",
    price: "4 000 ₽",
    image: "/vaza1.jpg",
    href: "/courses/vase",
    level: "Для начинающих",
    modules: "21 модуль",
  },
  {
    id: "ostrov",
    title: "Курс «Остров»",
    description:
      "12 модулей: шифоновый бисквит, вишня фламбе, море из ганаша, черепаха из изомальта. Бонус: картошка и кейкпопсы.",
    price: "4 500 ₽",
    image: "/ostrov.jpg",
    href: "/courses/ostrov",
    level: "Средний уровень",
    modules: "12 модулей",
  },
  {
    id: "plastic-chocolate",
    title: "Курс «Пластичный шоколад»",
    description:
      "4 рецепта (белый, тёмный, клубничный, Руби), пищевой клей, список инструментов и галерея 16 работ.",
    price: "3 000 ₽",
    image: "/courses/roses/rozaroza (1).jpg",
    href: "/courses/plastic-chocolate",
    level: "Для начинающих",
    modules: "9 модулей",
  },
];

const advantages = [
  {
    icon: <Award className="h-8 w-8 text-pink-500" />,
    title: "Профессиональный опыт",
    description:
      "Более 10 лет в кондитерском деле. Серебряная медаль на выставке в Бирмингеме.",
  },
  {
    icon: <BookOpen className="h-8 w-8 text-pink-500" />,
    title: "Подробные материалы",
    description:
      "Детальные видео-уроки и техкарты, которые помогут освоить все техники.",
  },
  {
    icon: <Users className="h-8 w-8 text-pink-500" />,
    title: "Постоянный доступ",
    description:
      "Все материалы в личном кабинете без ограничений по времени — учитесь в своём темпе.",
  },
  {
    icon: <Gift className="h-8 w-8 text-pink-500" />,
    title: "Бонусные материалы",
    description: "Дополнительные рецепты и техники в подарок к каждому курсу.",
  },
];

// ==========================================
// Main Component
// ==========================================
const Home = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSignOut = async () => {
    await signOut();
    navigate("/courses");
  };

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-background via-background to-muted/20">
      {/* ═══════════════════════════ HEADER ═══════════════════════════ */}
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
        className={`sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 ${scrollY > 50 ? "shadow-md" : ""}`}
      >
        <div className="container flex h-16 items-center justify-between">
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

          <nav className="hidden md:flex gap-6">
            <Link to="/" className="text-sm font-medium transition-colors hover:text-pink-600 cursor-pointer">
              Каталог тортов
            </Link>
            <a href="#courses" className="text-sm font-medium transition-colors hover:text-pink-600 cursor-pointer">
              Курсы
            </a>
            <a href="#advantages" className="text-sm font-medium transition-colors hover:text-pink-600 cursor-pointer">
              Преимущества
            </a>
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
            <button onClick={() => setIsMenuOpen(false)} className="cursor-pointer" aria-label="Закрыть">
              <X className="h-6 w-6" />
            </button>
          </div>
          <motion.nav variants={staggerContainer} initial="hidden" animate="visible" className="container grid gap-2 pb-8 pt-6">
            {[
              { label: "Каталог тортов", href: "/", isRoute: true },
              { label: "Курсы", href: "#courses" },
              { label: "Преимущества", href: "#advantages" },
            ].map((item, index) => (
              <motion.div key={index} variants={itemFadeIn}>
                {item.isRoute ? (
                  <Link to={item.href} className="flex items-center justify-between rounded-2xl px-4 py-3 text-lg font-medium hover:bg-accent cursor-pointer" onClick={() => setIsMenuOpen(false)}>
                    {item.label}
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                ) : (
                  <a href={item.href} className="flex items-center justify-between rounded-2xl px-4 py-3 text-lg font-medium hover:bg-accent cursor-pointer" onClick={() => setIsMenuOpen(false)}>
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
        <section className="w-full py-12 md:py-20 lg:py-28">
          <div className="container px-4 md:px-6 border border-muted rounded-3xl bg-gradient-to-br from-background to-muted/30">
            <div className="flex flex-col items-center text-center space-y-8 py-10">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="inline-flex items-center rounded-full bg-pink-50 px-4 py-1.5 text-sm text-pink-700 border border-pink-200"
              >
                <Zap className="mr-1.5 h-3.5 w-3.5" />
                Онлайн-курсы для кондитеров
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.2 }}
                className="text-4xl sm:text-5xl md:text-6xl font-display font-bold tracking-tight max-w-4xl"
              >
                Авторские{" "}
                <GradientText className="bg-white">курсы</GradientText>{" "}
                от Ирины Гордеевой
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.4 }}
                className="max-w-2xl mx-auto text-muted-foreground md:text-xl"
              >
                Пластичный шоколад, шоколадные цветы, 3D-торты, финишный крем —
                все техники в подробных видео-уроках с постоянным доступом.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.6 }}
                className="flex flex-col gap-3 sm:flex-row"
              >
                <Button size="lg" className="rounded-full bg-pink-600 hover:bg-pink-700 group cursor-pointer" asChild>
                  <a href="#courses">
                    <BookOpen className="mr-2 h-5 w-5" />
                    Смотреть курсы
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </a>
                </Button>
                <Button variant="outline" size="lg" className="rounded-full cursor-pointer" asChild>
                  <Link to="/">Каталог тортов</Link>
                </Button>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════ COURSES ═══════════════════════════ */}
        <section id="courses" className="w-full py-12 md:py-24">
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
                Курсы
              </motion.div>
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-3xl font-display font-bold tracking-tight sm:text-4xl md:text-5xl"
              >
                Мои авторские курсы
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="mx-auto max-w-[700px] text-muted-foreground md:text-lg"
              >
                Каждый курс создан с любовью и вниманием к деталям
              </motion.p>
            </div>

            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="mx-auto grid max-w-6xl gap-4 py-12 md:grid-cols-2 lg:grid-cols-3"
            >
              {courses.map((course) => (
                <motion.div
                  key={course.id}
                  variants={itemFadeIn}
                  whileHover={{ y: -8, transition: { duration: 0.3 } }}
                  className="group relative overflow-hidden rounded-3xl border shadow-sm transition-all hover:shadow-lg bg-background"
                >
                  <div className="h-52 overflow-hidden">
                    <img
                      src={course.image}
                      alt={course.title}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                  </div>
                  <div className="p-5 space-y-3">
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center rounded-full bg-pink-50 px-2.5 py-0.5 text-xs font-medium text-pink-700 border border-pink-200">
                        {course.level}
                      </span>
                      <span className="inline-flex items-center rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
                        <Clock className="mr-1 h-3 w-3" />
                        {course.modules}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold">{course.title}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2">{course.description}</p>
                    <div className="flex items-center justify-between pt-2">
                      <span className="text-lg font-bold text-pink-600">{course.price}</span>
                      <Button variant="ghost" size="sm" className="rounded-full text-pink-600 hover:text-pink-700 hover:bg-pink-50 group/btn cursor-pointer" asChild>
                        <Link to={course.href}>
                          Подробнее
                          <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </section>

        {/* ═══════════════════════════ TECH CARDS ═══════════════════════════ */}
        <TechCardsCatalog />

        {/* ═══════════════════════════ ADVANTAGES ═══════════════════════════ */}
        <section id="advantages" className="w-full py-12 md:py-24">
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
                Преимущества
              </motion.div>
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-3xl font-display font-bold tracking-tight sm:text-4xl md:text-5xl"
              >
                Почему мои курсы
              </motion.h2>
            </div>

            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="mx-auto grid max-w-5xl gap-4 py-12 md:grid-cols-2 lg:grid-cols-4"
            >
              {advantages.map((item, index) => (
                <motion.div
                  key={index}
                  variants={itemFadeIn}
                  whileHover={{ y: -8, transition: { duration: 0.3 } }}
                  className="group relative overflow-hidden rounded-3xl border p-6 shadow-sm transition-all hover:shadow-md bg-background/80"
                >
                  <div className="absolute -right-20 -top-20 h-40 w-40 rounded-full bg-pink-500/5 group-hover:bg-pink-500/10 transition-all duration-300" />
                  <div className="relative space-y-3">
                    <div className="mb-4 rounded-2xl bg-pink-50 p-3 w-fit">{item.icon}</div>
                    <h3 className="text-lg font-bold">{item.title}</h3>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </section>

        {/* ═══════════════════════════ CTA ═══════════════════════════ */}
        <section className="w-full py-12 md:py-24">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            className="container px-4 md:px-6 border border-muted rounded-3xl bg-gradient-to-br from-pink-50/50 to-muted/20"
          >
            <div className="flex flex-col items-center text-center space-y-6 py-16">
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-3xl font-display font-bold tracking-tight sm:text-4xl"
              >
                Готовы начать свой кондитерский путь?
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="max-w-2xl text-muted-foreground md:text-lg"
              >
                Переходите в личный кабинет и начните создавать кондитерские шедевры уже сегодня!
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="flex flex-col gap-3 sm:flex-row"
              >
                <Button size="lg" className="rounded-full bg-pink-600 hover:bg-pink-700 group cursor-pointer" asChild>
                  <Link to="/dashboard/courses">
                    Перейти к курсам
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </Button>
                <Button variant="outline" size="lg" className="rounded-full cursor-pointer" asChild>
                  <Link to="/">Каталог тортов</Link>
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
              Авторские онлайн-курсы для кондитеров. Пластичный шоколад, цветы, 3D-торты.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-medium mb-4">Курсы</h3>
            <nav className="flex flex-col space-y-2 text-sm">
              <Link to="/courses/roses" className="text-muted-foreground hover:text-foreground cursor-pointer">Лепестками роз</Link>
              <Link to="/courses/cream" className="text-muted-foreground hover:text-foreground cursor-pointer">Финишный крем</Link>
              <Link to="/courses/vase" className="text-muted-foreground hover:text-foreground cursor-pointer">Ваза с цветами</Link>
              <Link to="/courses/ostrov" className="text-muted-foreground hover:text-foreground cursor-pointer">Остров</Link>
              <Link to="/courses/plastic-chocolate" className="text-muted-foreground hover:text-foreground cursor-pointer">Пластичный шоколад</Link>
            </nav>
          </div>
          <div>
            <h3 className="text-lg font-medium mb-4">Документы</h3>
            <nav className="flex flex-col space-y-2 text-sm">
              <Link to="/offer" className="text-muted-foreground hover:text-foreground cursor-pointer">Публичная оферта</Link>
              <Link to="/privacy" className="text-muted-foreground hover:text-foreground cursor-pointer">Политика конфиденциальности</Link>
            </nav>
          </div>
        </motion.div>
        <div className="border-t">
          <div className="container flex flex-col items-center justify-between gap-4 py-6 md:h-16 md:flex-row md:py-0">
            <p className="text-xs text-muted-foreground">&copy; {new Date().getFullYear()} Дело Вкуса. Все права защищены.</p>
            <p className="text-xs text-muted-foreground">ИНН 253615143415</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
