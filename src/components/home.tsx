import React, { useEffect, useState } from "react";
import Header from "./Header";
import CourseCatalog from "./CourseCatalog";
import TechCardsCatalog from "./TechCardsCatalog";
import TestimonialCarousel from "./TestimonialCarousel";
import InstructorSection from "./InstructorSection";
import BackgroundGallery from "./BackgroundGallery";
import LinkWithPrefetch from "./LinkWithPrefetch";
import { Link } from "react-router-dom";
import { prefetchComponent } from "../lib/prefetch";

import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import {
  Cake,
  Book,
  Award,
  Users,
  ArrowRight,
  MessageCircle,
  Gift,
} from "lucide-react";

const Home = () => {
  const [imagesPreloaded, setImagesPreloaded] = useState(false);

  // Предварительно загружаем изображения и страницы курсов при монтировании компонента
  useEffect(() => {
    // Принудительно загружаем ключевые изображения с обработкой ошибок
    const criticalImages = [
      "/roza2.jpg",
      "/cre1.jpg",
      "/vaza1.jpg",
      "/roza3.jpg",
      "/roza4.jpg",
    ];

    const preloadImage = (src) => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => {
          console.log(`Successfully loaded: ${src}`);
          resolve(src);
        };
        img.onerror = () => {
          console.error(`Failed to load: ${src}`);
          reject(src);
        };
        img.src = src.startsWith("/") ? src : `/${src}`;
      });
    };

    // Загружаем критические изображения параллельно
    Promise.allSettled(criticalImages.map(preloadImage)).then((results) => {
      const loaded = results.filter((r) => r.status === "fulfilled").length;
      console.log(
        `Preloaded ${loaded}/${criticalImages.length} critical images`,
      );
      setImagesPreloaded(true);
    });

    // Предзагрузка страниц
    prefetchComponent("./components/CourseDetail");
    prefetchComponent("./components/FinishingCreamCourse");
    prefetchComponent("./components/FlowerVaseCourse");
    prefetchComponent("./components/OstrovCourse");

    // Дополнительная проверка загрузки изображений
    const imagesToPreload = [
      "/roza1.jpg",
      "/roza2.jpg",
      "/roza3.jpg",
      "/roza4.jpg",
      "/cre1.jpg",
      "/cre2.jpg",
      "/cre3.jpg",
      "/vaza.jpg",
      "/vaza1.jpg",
      "/ostrov.jpg",
      "/otziv roza  (1).jpg",
      "/otziv roza  (2).jpg",
      "/otziv roza  (4).jpg",
      "/otziv roza  (6).jpg",
      "/otziv crem (1).jpg",
      "/otziv crem (3).jpg",
      "/otziv crem (5).jpg",
      "/otzivvaza (1).jpg",
      "/otzivvaza (2).jpg",
      "/otzivvaza (4).jpg",
    ];

    // Загружаем остальные изображения с задержкой, чтобы не блокировать критические
    setTimeout(() => {
      imagesToPreload.forEach((src) => {
        preloadImage(src).catch(() => {
          console.warn(`Non-critical image failed to load: ${src}`);
        });
      });
    }, 1000);
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <main className="pt-20">
        {/* Невидимый контейнер для предзагрузки изображений с приоритетом загрузки */}
        <div className="preload-images" aria-hidden="true">
          {[
            "/roza1.jpg",
            "/roza2.jpg",
            "/roza3.jpg",
            "/roza4.jpg",
            "/cre1.jpg",
            "/cre2.jpg",
            "/cre3.jpg",
            "/vaza.jpg",
            "/vaza1.jpg",
            "/ostrov.jpg",
            "/otziv roza  (1).jpg",
            "/otziv roza  (2).jpg",
            "/otziv roza  (4).jpg",
            "/otziv roza  (6).jpg",
            "/otziv crem (1).jpg",
            "/otziv crem (3).jpg",
            "/otziv crem (5).jpg",
            "/otzivvaza (1).jpg",
            "/otzivvaza (2).jpg",
            "/otzivvaza (4).jpg",
          ].map((src, index) => (
            <img
              key={index}
              src={src}
              alt=""
              fetchPriority="high"
              loading="eager"
              decoding="sync"
              onError={(e) => {
                console.error(`Failed to preload image: ${src}`);
                e.currentTarget.style.display = "none";
              }}
            />
          ))}
        </div>

        {/* Course Highlights Section */}
        <section className="py-16 px-4 bg-gray-50">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-800">
                Мои авторские курсы
              </h2>
              <p className="text-gray-600 max-w-3xl mx-auto">
                Каждый курс создан с любовью и вниманием к деталям, чтобы вы
                могли достичь профессиональных результатов
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Course 1 */}
              <div className="bg-white rounded-lg overflow-hidden shadow-md border border-gray-100 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                <div className="h-64 overflow-hidden">
                  <img
                    src="/roza2.jpg"
                    alt="Курс Лепестками роз"
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                    loading="eager"
                    fetchPriority="high"
                    onError={(e) => {
                      console.error("Failed to load roza2.jpg");
                      e.currentTarget.style.display = "none";
                    }}
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-3 text-gray-800">
                    Курс «Лепестками роз»
                  </h3>
                  <p className="text-gray-600 mb-4">
                    18 видов цветов: Мондиаль, Остина, Катана, махровая и
                    быстрые розы. 50+ видео, раздел для новичков.
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-pink-600">5000₽</span>
                    <a
                      href="/courses/roses"
                      className="inline-flex items-center text-pink-600 font-medium hover:text-pink-800 transition-colors cursor-pointer"
                      onClick={() => (window.location.href = "/courses/roses")}
                    >
                      Подробнее
                      <ArrowRight className="ml-1 h-4 w-4" />
                    </a>
                  </div>
                </div>
              </div>

              {/* Course 2 */}
              <div className="bg-white rounded-lg overflow-hidden shadow-md border border-gray-100 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                <div className="h-64 overflow-hidden">
                  <img
                    src="/cre1.jpg"
                    alt="Курс Финишный крем"
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                    loading="eager"
                    fetchPriority="high"
                    onError={(e) => {
                      console.error("Failed to load cre1.jpg");
                      e.currentTarget.style.display = "none";
                    }}
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-3 text-gray-800">
                    Курс «Финишный крем»
                  </h3>
                  <p className="text-gray-600 mb-4">
                    9 модулей: два рецепта крема, велюр, крем-дамба,
                    выравнивание квадрата, сборка ярусных тортов. 7+ лет опыта.
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-pink-600">3500₽</span>
                    <a
                      href="/courses/cream"
                      className="inline-flex items-center text-pink-600 font-medium hover:text-pink-800 transition-colors cursor-pointer"
                      onClick={() => (window.location.href = "/courses/cream")}
                    >
                      Подробнее
                      <ArrowRight className="ml-1 h-4 w-4" />
                    </a>
                  </div>
                </div>
              </div>

              {/* Course 3 */}
              <div className="bg-white rounded-lg overflow-hidden shadow-md border border-gray-100 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                <div className="h-64 overflow-hidden">
                  <img
                    src="/vaza1.jpg"
                    alt="Курс Ваза с цветами"
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                    loading="eager"
                    fetchPriority="high"
                    onError={(e) => {
                      console.error("Failed to load vaza1.jpg");
                      e.currentTarget.style.display = "none";
                    }}
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-3 text-gray-800">
                    Курс «Ваза с цветами»
                  </h3>
                  <p className="text-gray-600 mb-4">
                    21 модуль — от черничного бисквита до готовой вазы с
                    7 видами цветов. Рецепты, финишный крем и велюр.
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-pink-600">4000₽</span>
                    <a
                      href="/courses/vase"
                      className="inline-flex items-center text-pink-600 font-medium hover:text-pink-800 transition-colors cursor-pointer"
                      onClick={() => (window.location.href = "/courses/vase")}
                    >
                      Подробнее
                      <ArrowRight className="ml-1 h-4 w-4" />
                    </a>
                  </div>
                </div>
              </div>

              {/* Course 4 */}
              <div className="bg-white rounded-lg overflow-hidden shadow-md border border-gray-100 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                <div className="h-64 overflow-hidden">
                  <img
                    src="/ostrov.jpg"
                    alt="Курс Остров"
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                    loading="eager"
                    fetchPriority="high"
                    onError={(e) => {
                      console.error("Failed to load ostrov.jpg");
                      e.currentTarget.style.display = "none";
                    }}
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-3 text-gray-800">
                    Курс «Остров»
                  </h3>
                  <p className="text-gray-600 mb-4">
                    12 модулей: шифоновый бисквит, вишня фламбе, море из
                    ганаша, черепаха из изомальта. Бонус: картошка и кейкпопсы.
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-pink-600">4500₽</span>
                    <a
                      href="/courses/ostrov"
                      className="inline-flex items-center text-pink-600 font-medium hover:text-pink-800 transition-colors cursor-pointer"
                      onClick={() => (window.location.href = "/courses/ostrov")}
                    >
                      Подробнее
                      <ArrowRight className="ml-1 h-4 w-4" />
                    </a>
                  </div>
                </div>
              </div>

              {/* Course 5 */}
              <div className="bg-white rounded-lg overflow-hidden shadow-md border border-gray-100 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                <div className="h-64 overflow-hidden">
                  <img
                    src="/plastic-chocolate.jpg"
                    alt="Курс Пластичный шоколад"
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                    loading="lazy"
                    onError={(e) => {
                      console.error("Failed to load plastic-chocolate.jpg");
                      e.currentTarget.style.display = "none";
                    }}
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-3 text-gray-800">
                    Курс «Пластичный шоколад»
                  </h3>
                  <p className="text-gray-600 mb-4">
                    4 рецепта (белый, тёмный, клубничный, Руби), пищевой клей,
                    список инструментов и галерея 16 работ.
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-pink-600">3000₽</span>
                    <a
                      href="/courses/plastic-chocolate"
                      className="inline-flex items-center text-pink-600 font-medium hover:text-pink-800 transition-colors cursor-pointer"
                      onClick={() => (window.location.href = "/courses/plastic-chocolate")}
                    >
                      Подробнее
                      <ArrowRight className="ml-1 h-4 w-4" />
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-10 text-center">
              <Button className="bg-pink-600 hover:bg-pink-700 text-white">
                Посмотреть все курсы
              </Button>
            </div>
          </div>
        </section>

        {/* Why Choose Us Section */}
        <section className="py-16 px-4 bg-gradient-to-b from-white to-pink-50">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-800">
                Почему стоит выбрать мои курсы
              </h2>
              <p className="text-gray-600 max-w-3xl mx-auto">
                Моя миссия — сделать кондитерское искусство доступным для
                каждого, кто мечтает создавать вкусные шедевры
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex flex-col items-center text-center">
                <div className="bg-pink-100 p-3 rounded-full mb-4">
                  <Award className="h-8 w-8 text-pink-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">
                  Профессиональный опыт
                </h3>
                <p className="text-gray-600">
                  Более 15 лет опыта в кондитерском искусстве и создании
                  уникальных десертов
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex flex-col items-center text-center">
                <div className="bg-pink-100 p-3 rounded-full mb-4">
                  <Book className="h-8 w-8 text-pink-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">
                  Подробные материалы
                </h3>
                <p className="text-gray-600">
                  Детальные видео-уроки и техкарты, которые помогут освоить все
                  техники
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex flex-col items-center text-center">
                <div className="bg-pink-100 p-3 rounded-full mb-4">
                  <Users className="h-8 w-8 text-pink-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Постоянный доступ</h3>
                <p className="text-gray-600">
                  Все материалы доступны в личном кабинете без ограничений
                  по времени — учитесь в своём темпе
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex flex-col items-center text-center">
                <div className="bg-pink-100 p-3 rounded-full mb-4">
                  <Gift className="h-8 w-8 text-pink-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">
                  Бонусные материалы
                </h3>
                <p className="text-gray-600">
                  Дополнительные рецепты и техники в подарок к каждому курсу
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Tech Cards Section */}
        <TechCardsCatalog />

        {/* Testimonials Section */}
        <section id="testimonials">
          <TestimonialCarousel
            testimonials={[
              {
                id: "1",
                name: "Анна Петрова",
                role: "Домашний кондитер",
                image: "otziv roza  (1).jpg",
                content:
                  "Курс «Лепестками роз» превзошел все мои ожидания! Теперь я могу создавать потрясающие цветы из шоколада, которые выглядят как настоящие. Мои клиенты в восторге, а заказы увеличились вдвое!",
                rating: 5,
                course: "Курс «Лепестками роз»",
              },
              {
                id: "2",
                name: "Елена Смирнова",
                role: "Владелица кондитерской",
                image: "otziv crem (1).jpg",
                content:
                  "Финишный крем по рецепту Ирины - это находка! Стабильный, вкусный и прекрасно держит форму даже в жару. Теперь все мои торты покрыты только им, клиенты в восторге от вкуса и внешнего вида.",
                rating: 5,
                course: "Курс «Финишный крем»",
              },
              {
                id: "3",
                name: "Мария Иванова",
                role: "Начинающий кондитер",
                image: "otzivvaza (1).jpg",
                content:
                  "Я новичок в кондитерском деле, но благодаря курсу «Ваза с цветами» смогла создать потрясающий торт на юбилей мамы. Подробные инструкции и поддержка автора сделали процесс обучения легким и приятным.",
                rating: 5,
                course: "Курс «Ваза с цветами»",
              },
              {
                id: "4",
                name: "Ольга Кузнецова",
                role: "Кондитер-любитель",
                image: "otziv crem (3).jpg",
                content:
                  "Благодаря курсу по финишному крему мои торты теперь выглядят профессионально! Рецепт простой, но результат потрясающий. Особенно ценны советы по работе с кремом и исправлению возможных ошибок.",
                rating: 5,
                course: "Курс «Финишный крем»",
              },
              {
                id: "5",
                name: "Наталья Соколова",
                role: "Профессиональный кондитер",
                image: "otziv roza  (2).jpg",
                content:
                  "Даже имея опыт в кондитерском деле, я нашла для себя много нового в курсе «Лепестками роз». Техники работы с шоколадом, которые показывает Ирина, позволяют создавать настоящие произведения искусства!",
                rating: 5,
                course: "Курс «Лепестками роз»",
              },
              {
                id: "6",
                name: "Екатерина Морозова",
                role: "Домашний пекарь",
                image: "otzivvaza (2).jpg",
                content:
                  "Торт-ваза с цветами стал хитом на дне рождения дочери! Все гости были в восторге и не верили, что я сделала его сама. Спасибо за такой подробный и понятный курс даже для новичков.",
                rating: 5,
                course: "Курс «Ваза с цветами»",
              },
              {
                id: "7",
                name: "Ирина Волкова",
                role: "Кондитер на заказ",
                image: "otziv crem (5).jpg",
                content:
                  "Финишный крем по рецепту Ирины теперь мой основной инструмент в работе. Он идеально подходит для сложных конструкций и фигурных тортов, при этом остается вкусным и нежным. Рекомендую всем профессионалам!",
                rating: 5,
                course: "Курс «Финишный крем»",
              },
              {
                id: "8",
                name: "Светлана Попова",
                role: "Кондитер-самоучка",
                image: "otziv roza  (4).jpg",
                content:
                  "Розы из шоколада казались мне недостижимой мечтой, но благодаря курсу я освоила эту технику! Теперь мои торты украшают нежные цветы, которые выглядят как настоящие. Очень благодарна за такие подробные уроки!",
                rating: 5,
                course: "Курс «Лепестками роз»",
              },
              {
                id: "9",
                name: "Татьяна Лебедева",
                role: "Владелица домашней кондитерской",
                image: "otzivvaza (4).jpg",
                content:
                  "Курс «Ваза с цветами» помог мне расширить ассортимент и привлечь новых клиентов. Такие эффектные торты всегда вызывают восторг и приводят новых заказчиков. Инвестиция в обучение окупилась в первый же месяц!",
                rating: 5,
                course: "Курс «Ваза с цветами»",
              },
              {
                id: "10",
                name: "Алина Новикова",
                role: "Кондитер-декоратор",
                image: "otziv roza  (6).jpg",
                content:
                  "Как декоратор, я всегда в поиске новых техник. Курс по шоколадным розам открыл для меня целый мир возможностей! Теперь я создаю уникальные композиции, которые делают мои торты узнаваемыми и востребованными.",
                rating: 5,
                course: "Курс «Лепестками роз»",
              },
            ]}
          />
        </section>

        {/* Call to Action Section */}
        <section className="py-20 px-4 bg-gradient-to-r from-pink-100 to-purple-100 text-center">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-800">
              Готовы начать свой кондитерский путь?
            </h2>
            <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
              Переходите в личный кабинет и начните
              создавать кондитерские шедевры уже сегодня!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/dashboard/courses" className="inline-flex items-center justify-center bg-pink-600 hover:bg-pink-700 text-white px-8 py-6 text-lg rounded-md font-medium transition-colors">
                Перейти к курсам
              </Link>
              <Link to="/courses" className="inline-flex items-center justify-center border border-pink-600 text-pink-600 hover:bg-pink-50 px-8 py-6 text-lg rounded-md font-medium transition-colors">
                Каталог курсов
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4">
        <div className="container mx-auto max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">Дело Вкуса</h3>
              <p className="text-gray-400 mb-4">
                Я поднимаю кондитерское образование на новый уровень с
                авторскими курсами для всех уровней подготовки.
              </p>
              <div className="flex space-x-4">
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors"
                  aria-label="Facebook"
                >
                  <svg
                    className="h-6 w-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                      clipRule="evenodd"
                    />
                  </svg>
                </a>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors"
                  aria-label="Telegram"
                >
                  <svg
                    className="h-6 w-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.96 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
                  </svg>
                </a>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors"
                  aria-label="Instagram"
                >
                  <svg
                    className="h-6 w-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </a>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Мои курсы</h3>
              <ul className="space-y-2">
                <li>
                  <a
                    href="/courses/roses"
                    className="text-gray-400 hover:text-white transition-colors cursor-pointer"
                    onClick={() => (window.location.href = "/courses/roses")}
                  >
                    Курс «Лепестками роз»
                  </a>
                </li>
                <li>
                  <a
                    href="/courses/cream"
                    className="text-gray-400 hover:text-white transition-colors cursor-pointer"
                    onClick={() => (window.location.href = "/courses/cream")}
                  >
                    Курс «Финишный крем»
                  </a>
                </li>
                <li>
                  <a
                    href="/courses/vase"
                    className="text-gray-400 hover:text-white transition-colors cursor-pointer"
                    onClick={() => (window.location.href = "/courses/vase")}
                  >
                    Курс «Ваза с цветами»
                  </a>
                </li>
                <li>
                  <a
                    href="/courses/ostrov"
                    className="text-gray-400 hover:text-white transition-colors cursor-pointer"
                    onClick={() => (window.location.href = "/courses/ostrov")}
                  >
                    Курс «Остров»
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Информация</h3>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#instructors"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Об авторе
                  </a>
                </li>
                <li>
                  <a
                    href="#testimonials"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Отзывы учеников
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Блог
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Связаться со мной
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">
                Подписка на новости
              </h3>
              <p className="text-gray-400 mb-4">
                Получайте информацию о новых курсах и специальных предложениях
              </p>
              <div className="flex">
                <input
                  type="email"
                  placeholder="Ваш email"
                  className="px-4 py-2 w-full rounded-l-md focus:outline-none text-gray-900"
                />
                <button className="bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded-r-md transition-colors">
                  Подписаться
                </button>
              </div>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-gray-800 text-center text-gray-400">
            <p>
              &copy; {new Date().getFullYear()} Дело Вкуса. Все права защищены.
            </p>
            <p className="mt-2">ИНН 253615143415</p>
            <p className="mt-2">
              <a href="/offer" className="text-gray-400 hover:text-white transition-colors underline">Публичная оферта</a>
              {" | "}
              <a href="/privacy" className="text-gray-400 hover:text-white transition-colors underline">Политика конфиденциальности</a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
