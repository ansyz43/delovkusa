import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Clock,
  Users,
  BookOpen,
  CheckCircle,
  Cake,
  Zap,
  ArrowRight,
} from "lucide-react";
import { Button } from "./ui/button";
import BuyCourseButton from "./BuyCourseButton";
import CategoryGallery from "./CategoryGallery";

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

interface CoursePageLayoutProps {
  courseId: string;
  title: string;
  description: string;
  fullDescription: string[];
  price: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  image: string;
  features: string[];
  includes: string[];
  learnHref: string;
  gallery?: React.ReactNode;
  galleryImages?: { src: string; alt: string }[];
  testimonialImages?: string[];
}

const CoursePageLayout = ({
  courseId,
  title,
  description,
  fullDescription,
  price,
  level,
  image,
  features,
  includes,
  learnHref,
  gallery,
  galleryImages,
  testimonialImages,
}: CoursePageLayoutProps) => {
  const levelLabel =
    level === "Beginner"
      ? "Для начинающих"
      : level === "Intermediate"
        ? "Средний уровень"
        : "Продвинутый";

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-background via-background to-muted/20">
      {/* ═══════════════ HEADER ═══════════════ */}
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
        className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
      >
        <div className="container flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center space-x-3">
            <div className="h-10 w-10 rounded-2xl bg-pink-600 flex items-center justify-center">
              <Cake className="h-5 w-5 text-white" />
            </div>
            <span className="font-display font-bold text-xl">Дело Вкуса</span>
          </Link>
          <nav className="hidden md:flex gap-6">
            <Link to="/" className="text-sm font-medium transition-colors hover:text-pink-600 cursor-pointer">
              Каталог тортов
            </Link>
            <Link to="/courses" className="text-sm font-medium transition-colors hover:text-pink-600 cursor-pointer">
              Все курсы
            </Link>
          </nav>
          <Button size="sm" className="rounded-full cursor-pointer" variant="outline" asChild>
            <Link to="/courses">
              <ArrowLeft className="mr-1.5 h-4 w-4" />
              К курсам
            </Link>
          </Button>
        </div>
      </motion.header>

      <main className="flex-1">
        {/* ═══════════════ HERO ═══════════════ */}
        <section className="w-full py-12 md:py-20">
          <div className="container px-4 md:px-6 border border-muted rounded-3xl bg-gradient-to-br from-background to-muted/30 overflow-hidden">
            <div className="grid gap-8 lg:grid-cols-2 py-10 px-4 md:px-8">
              <motion.div
                initial={{ opacity: 0, x: -40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                className="space-y-6 flex flex-col justify-center"
              >
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center rounded-full bg-pink-50 px-3 py-1 text-sm font-medium text-pink-700 border border-pink-200">
                    <Zap className="mr-1.5 h-3.5 w-3.5" />
                    {levelLabel}
                  </span>
                  <span className="inline-flex items-center rounded-full bg-muted px-3 py-1 text-sm text-muted-foreground">
                    <Clock className="mr-1.5 h-3.5 w-3.5" />
                    Постоянный доступ
                  </span>
                </div>
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold tracking-tight">
                  {title}
                </h1>
                <p className="text-lg text-muted-foreground">{description}</p>
                {fullDescription.map((p, i) => (
                  <p key={i} className="text-muted-foreground leading-relaxed">
                    {p}
                  </p>
                ))}
                <div className="pt-2">
                  <BuyCourseButton
                    courseId={courseId}
                    price={price}
                    learnHref={learnHref}
                  />
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="flex items-center justify-center"
              >
                {galleryImages ? (
                  <div className="w-full">
                    <CategoryGallery images={galleryImages} columns={galleryImages.length <= 4 ? 2 : 3} />
                  </div>
                ) : gallery ? (
                  <div className="w-full rounded-3xl overflow-hidden shadow-lg">
                    {gallery}
                  </div>
                ) : (
                  <div className="w-full h-[350px] md:h-[450px] rounded-3xl overflow-hidden shadow-lg">
                    <img
                      src={image}
                      alt={title}
                      className="w-full h-full object-cover"
                      loading="eager"
                    />
                  </div>
                )}
              </motion.div>
            </div>
          </div>
        </section>

        {/* ═══════════════ FEATURES ═══════════════ */}
        <section className="w-full py-12 md:py-24">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            className="container px-4 md:px-6 border border-muted rounded-3xl"
          >
            <div className="flex flex-col items-center justify-center space-y-4 text-center py-10">
              <div className="inline-block rounded-full bg-muted px-4 py-1 text-sm">
                Особенности
              </div>
              <h2 className="text-3xl font-display font-bold tracking-tight sm:text-4xl">
                Особенности курса
              </h2>
            </div>
            <div className="mx-auto grid max-w-4xl gap-4 py-8 md:grid-cols-3">
              <motion.div
                variants={itemFadeIn}
                className="rounded-3xl border p-6 bg-background/80 space-y-3"
              >
                <div className="rounded-2xl bg-pink-50 p-3 w-fit">
                  <Clock className="h-8 w-8 text-pink-500" />
                </div>
                <h3 className="text-lg font-bold">Доступ к материалам</h3>
                <p className="text-sm text-muted-foreground">
                  Постоянный доступ — учитесь в своём темпе
                </p>
              </motion.div>
              <motion.div
                variants={itemFadeIn}
                className="rounded-3xl border p-6 bg-background/80 space-y-3"
              >
                <div className="rounded-2xl bg-pink-50 p-3 w-fit">
                  <Users className="h-8 w-8 text-pink-500" />
                </div>
                <h3 className="text-lg font-bold">Уровень подготовки</h3>
                <p className="text-sm text-muted-foreground">{levelLabel}</p>
              </motion.div>
              <motion.div
                variants={itemFadeIn}
                className="rounded-3xl border p-6 bg-background/80 space-y-3"
              >
                <div className="rounded-2xl bg-pink-50 p-3 w-fit">
                  <BookOpen className="h-8 w-8 text-pink-500" />
                </div>
                <h3 className="text-lg font-bold">Формат обучения</h3>
                <p className="text-sm text-muted-foreground">
                  Видео-уроки в личном кабинете
                </p>
              </motion.div>
            </div>
          </motion.div>
        </section>

        {/* ═══════════════ WHAT'S INCLUDED ═══════════════ */}
        <section className="w-full py-12 md:py-24">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            className="container px-4 md:px-6 border border-muted rounded-3xl bg-muted/10"
          >
            <div className="grid gap-8 lg:grid-cols-2 py-10 px-4 md:px-8">
              <div className="space-y-6">
                <div className="inline-block rounded-full bg-background px-4 py-1 text-sm">
                  Содержание
                </div>
                <h2 className="text-3xl font-display font-bold tracking-tight">
                  Что входит в курс
                </h2>
                <motion.ul
                  variants={staggerContainer}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  className="space-y-3"
                >
                  {includes.map((item, i) => (
                    <motion.li
                      key={i}
                      variants={itemFadeIn}
                      className="flex items-start gap-3"
                    >
                      <CheckCircle className="h-5 w-5 text-pink-500 mt-0.5 flex-shrink-0" />
                      <span className="text-muted-foreground">{item}</span>
                    </motion.li>
                  ))}
                </motion.ul>
              </div>
              <div className="space-y-6">
                <div className="inline-block rounded-full bg-background px-4 py-1 text-sm">
                  Ключевое
                </div>
                <h2 className="text-3xl font-display font-bold tracking-tight">
                  Ключевые особенности
                </h2>
                <motion.ul
                  variants={staggerContainer}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  className="space-y-3"
                >
                  {features.map((feature, i) => (
                    <motion.li
                      key={i}
                      variants={itemFadeIn}
                      className="flex items-start gap-3"
                    >
                      <CheckCircle className="h-5 w-5 text-pink-500 mt-0.5 flex-shrink-0" />
                      <span className="text-muted-foreground">{feature}</span>
                    </motion.li>
                  ))}
                </motion.ul>
              </div>
            </div>
          </motion.div>
        </section>

        {/* ═══════════════ TESTIMONIALS ═══════════════ */}
        {testimonialImages && testimonialImages.length > 0 && (
          <section className="w-full py-12 md:py-24">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeIn}
              className="container px-4 md:px-6 border border-muted rounded-3xl"
            >
              <div className="flex flex-col items-center justify-center space-y-4 text-center py-10">
                <div className="inline-block rounded-full bg-muted px-4 py-1 text-sm">
                  Отзывы
                </div>
                <h2 className="text-3xl font-display font-bold tracking-tight sm:text-4xl">
                  Отзывы учеников
                </h2>
              </div>
              <div className="pb-8 px-2 md:px-4">
                <CategoryGallery
                  images={testimonialImages.map((src, i) => ({
                    src,
                    alt: `Отзыв ученика ${i + 1}`,
                  }))}
                  columns={testimonialImages.length <= 4 ? 2 : 3}
                />
              </div>
            </motion.div>
          </section>
        )}

        {/* ═══════════════ CTA ═══════════════ */}
        <section className="w-full py-12 md:py-24">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            className="container px-4 md:px-6 border border-muted rounded-3xl bg-gradient-to-br from-pink-50/50 to-muted/20"
          >
            <div className="flex flex-col items-center text-center space-y-6 py-16">
              <h2 className="text-3xl font-display font-bold tracking-tight sm:text-4xl">
                Начните обучение прямо сейчас
              </h2>
              <p className="max-w-2xl text-muted-foreground md:text-lg">
                Получите доступ к курсу и начните создавать кондитерские шедевры!
              </p>
              <BuyCourseButton
                courseId={courseId}
                price={price}
                learnHref={learnHref}
                variant="cta"
              />
            </div>
          </motion.div>
        </section>
      </main>

      {/* ═══════════════ FOOTER ═══════════════ */}
      <footer className="w-full border-t">
        <div className="container flex flex-col items-center justify-between gap-4 py-6 md:h-16 md:flex-row md:py-0">
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} Дело Вкуса. Все права защищены.
          </p>
          <div className="flex gap-4 text-xs flex-wrap justify-center">
            <Link to="/offer" className="text-muted-foreground hover:text-foreground cursor-pointer">
              Публичная оферта
            </Link>
            <Link to="/terms" className="text-muted-foreground hover:text-foreground cursor-pointer">
              Пользовательское соглашение
            </Link>
            <Link to="/privacy" className="text-muted-foreground hover:text-foreground cursor-pointer">
              Политика конфиденциальности
            </Link>
          </div>
          <p className="text-xs text-muted-foreground">ИНН 253615143415</p>
        </div>
      </footer>
    </div>
  );
};

export default CoursePageLayout;
