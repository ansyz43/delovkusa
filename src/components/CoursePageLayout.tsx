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
import SEO from "./SEO";

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

  // SEO metadata по courseId
  const courseSEO: Record<string, { title: string; description: string; keywords: string; ogImage: string }> = {
    roses: {
      title: "Курс «Лепестками роз» — шоколадные цветы онлайн",
      description: "Научитесь создавать 18 видов шоколадных цветов: Мондиаль, Остина, Катана, махровые и быстрые розы. 50+ видео, подходит новичкам. Постоянный доступ за 6 900 ₽",
      keywords: "курс шоколадные цветы, пластичный шоколад курс, розы из шоколада курс, цветы для торта курс, обучение шоколадным цветам",
      ogImage: "https://delovkusa.site/roza2.jpg"
    },
    cream: {
      title: "Курс «Финишный крем» — выравнивание тортов",
      description: "9 модулей по финишному крему: рецепты, велюр, выравнивание квадратных тортов, крем-дамба, сборка ярусов. Для начинающих кондитеров. 4 500 ₽",
      keywords: "курс финишный крем, выравнивание торта курс, велюр курс, крем для торта курс, сборка ярусных тортов",
      ogImage: "https://delovkusa.site/cre1.jpg"
    },
    vase: {
      title: "Курс «Ваза с цветами» — торт-ваза из шоколада",
      description: "21 модуль: от черничного бисквита до готовой вазы с 7 видами цветов. Рецепты, финишный крем, велюр. Полный цикл создания. 5 900 ₽",
      keywords: "курс торт ваза, ваза с цветами курс, шоколадная ваза курс, торт ваза из шоколада",
      ogImage: "https://delovkusa.site/vaza1.jpg"
    },
    ostrov: {
      title: "Курс «Остров» — 3D торт из пластичного шоколада",
      description: "Создайте эффектный 3D торт «Остров»: рецепты бисквита и начинки, финишный крем, пластичный шоколад, лепка пальм и декора. 6 500 ₽",
      keywords: "курс 3d торт, остров торт курс, 3д торт из шоколада, пластичный шоколад 3д",
      ogImage: "https://delovkusa.site/ostrov.jpg"
    },
    "plastic-chocolate": {
      title: "Курс «Пластичный шоколад» — основы и техники",
      description: "Полный курс по работе с пластичным шоколадом: рецепты (белый, темный, цветной), лепка фигурок, декор для тортов. От основ до сложных техник. 5 900 ₽",
      keywords: "курс пластичный шоколад, шоколадная пластика курс, лепка из шоколада курс, фигурки из шоколада",
      ogImage: "https://delovkusa.site/plastic-chocolate.jpg"
    }
  };

  const seo = courseSEO[courseId] || {
    title,
    description,
    keywords: "кондитерские курсы онлайн",
    ogImage: image
  };

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-background via-background to-muted/20">
      <SEO
        title={seo.title}
        description={seo.description}
        keywords={seo.keywords}
        ogImage={seo.ogImage}
        type="product"
        jsonLd={[
          {
            "@context": "https://schema.org",
            "@type": "Course",
            "name": title,
            "description": description,
            "provider": {
              "@type": "Person",
              "name": "Ирина Гордеева",
              "jobTitle": "Кондитер-преподаватель"
            },
            "offers": {
              "@type": "Offer",
              "price": price.replace(/[^\d]/g, ''),
              "priceCurrency": "RUB",
              "availability": "https://schema.org/InStock",
              "url": `https://delovkusa.site/courses/${courseId}`
            },
            "educationalLevel": levelLabel,
            "inLanguage": "ru-RU",
            "image": seo.ogImage,
            "url": `https://delovkusa.site/courses/${courseId}`,
            "hasCourseInstance": {
              "@type": "CourseInstance",
              "courseMode": "online",
              "courseWorkload": "PT10H"
            }
          },
          {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
              { "@type": "ListItem", "position": 1, "name": "Главная", "item": "https://delovkusa.site/" },
              { "@type": "ListItem", "position": 2, "name": "Кондитерские курсы", "item": "https://delovkusa.site/courses" },
              { "@type": "ListItem", "position": 3, "name": title, "item": `https://delovkusa.site/courses/${courseId}` }
            ]
          }
        ]}
      />
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
