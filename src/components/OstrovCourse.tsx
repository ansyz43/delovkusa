import React from "react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { ArrowLeft, Clock, Users, BookOpen, CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";
import ZoomableGallery from "./ZoomableGallery";
import BuyCourseButton from "./BuyCourseButton";

interface OstrovCourseProps {
  id?: string;
  title?: string;
  description?: string;
  fullDescription?: string[];
  price?: string;
  duration?: string;
  level?: "Beginner" | "Intermediate" | "Advanced";
  image?: string;
  features?: string[];
  includes?: string[];
  instructor?: {
    name: string;
    image: string;
    title: string;
  };
}

const OstrovCourse = ({
  id = "10",
  title = "Курс «Остров»💥",
  description = "Торт-остров - это настоящее произведение искусства, которое поразит всех своей красотой и вкусом!",
  fullDescription = [
    "Торт-остров — настоящий шоу-стоппер на любом празднике! 🏝️",
    "✨ 12 модулей: от шоколадного шифонового бисквита и начинки (кремю, вишня фламбе, карамелизированный орех) до реалистичного моря из ганаша и желе.",
    "✨ Вы научитесь лепить пальмы, черепаху из изомальта, зонтик, шезлонг, цветы — и собирать всё в единую композицию.",
    "✨ После курса в вашем портфолио появится торт, который гарантированно привлечёт новых клиентов!",
  ],
  price = "4500₽",
  duration = "Постоянный доступ",
  level = "Intermediate",
  image = "/ostrov.jpg",
  features = [
    "12 модулей — 15+ видео-уроков",
    "Работа с изомальтом, пластичным шоколадом и ганашем",
    "Реалистичное море из ганаша и желе",
    "Постоянный доступ к материалам",
  ],
  includes = [
    "Шоколадный шифоновый бисквит — 2 видео",
    "Начинка: шоколадное кремю, вишня фламбе, карамелизированный грецкий орех — 3 видео",
    "Подложка 30/30 см — видео",
    "Пластичный шоколад (белый и тёмный) — 2 видео + рецепт",
    "Кокос: заливка основы и мякоть — 2 видео",
    "Пальмы и инструменты — видео",
    "Декор: черепаха из изомальта, зонтик, шезлонг, цветы — 4 видео",
    "Сборка торта — видео (~15 мин)",
    "Море: ганаш + желе — видео + рецепт",
    "Финальный декор — видео (~15 мин)",
    "Бонус: рецепт пирожного «Картошка», кейкпопсы и эскимошки",
  ],
  instructor = {
    name: "Ирина Гордеева",
    image: "/instructor.jpg",
    title: "Шеф-кондитер, автор курсов",
  },
}: OstrovCourseProps) => {
  return (
    <div className="bg-white min-h-screen pt-24 pb-16">
      {/* Breadcrumb */}
      <div className="container mx-auto px-4 mb-8">
        <Link
          to="/courses"
          className="inline-flex items-center text-pink-600 hover:text-pink-800 transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Вернуться к курсам
        </Link>
      </div>

      {/* Hero Section */}
      <div className="container mx-auto px-4 mb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <Badge className="mb-4 bg-pink-100 text-pink-800 hover:bg-pink-200">
              {level === "Beginner"
                ? "Для начинающих"
                : level === "Intermediate"
                  ? "Средний уровень"
                  : "Продвинутый уровень"}
            </Badge>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-gray-800">
              {title}
            </h1>
            <p className="text-xl text-gray-600 mb-6">{description}</p>

            {fullDescription.map((paragraph, index) => (
              <p key={index} className="text-gray-600 mb-4">
                {paragraph}
              </p>
            ))}

            <BuyCourseButton
              courseId="ostrov"
              price={price}
              learnHref="/dashboard/courses/ostrov/learn"
            />
          </div>

          <div className="rounded-xl overflow-hidden shadow-lg">
            <div className="relative pb-[56.25%] h-0 overflow-hidden">
              <video
                className="absolute top-0 left-0 w-full h-full object-cover"
                controls
                poster={image}
              >
                <source src="/video ostrov.mp4" type="video/mp4" />
                Ваш браузер не поддерживает видео.
              </video>
            </div>
            <ZoomableGallery
              images={[
                { src: "/ostrov.jpg", alt: "Торт Остров 1" },
                { src: "/otzivostrov (1).jpg", alt: "Торт Остров 2" },
                { src: "/otzivostrov (2).jpg", alt: "Торт Остров 3" },
                { src: "/otzivostrov (3).jpg", alt: "Торт Остров 4" },
              ]}
              className="w-full"
            />
          </div>
        </div>
      </div>

      {/* Course Features */}
      <div className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold mb-12 text-center text-gray-800">
            Особенности курса
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <Clock className="h-10 w-10 text-pink-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">
                Доступ к материалам
              </h3>
              <p className="text-gray-600">{duration}</p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <Users className="h-10 w-10 text-pink-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Уровень подготовки</h3>
              <p className="text-gray-600">
                Подходит для кондитеров среднего уровня
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <BookOpen className="h-10 w-10 text-pink-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Формат обучения</h3>
              <p className="text-gray-600">Видео-уроки в личном кабинете</p>
            </div>
          </div>
        </div>
      </div>

      {/* What's Included */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold mb-8 text-gray-800">
              Что входит в курс?
            </h2>

            <ul className="space-y-4">
              {includes.map((item, index) => (
                <li key={index} className="flex items-start">
                  <CheckCircle className="h-6 w-6 text-pink-600 mr-3 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">{item}</span>
                </li>
              ))}
            </ul>

            <div className="mt-8 p-6 bg-pink-50 rounded-lg border border-pink-100">
              <h3 className="text-xl font-semibold mb-4 text-gray-800">
                Курс для кондитеров среднего уровня
              </h3>
              <p className="text-gray-600">
                Подробные уроки по созданию уникального торта-острова!
              </p>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-4 text-gray-800">
              Ключевые особенности
            </h3>
            <ul className="space-y-3">
              {features.map((feature, index) => (
                <li key={index} className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-pink-600 mr-3 flex-shrink-0" />
                  <span className="text-gray-700">{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-pink-100 to-purple-100 py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4 text-gray-800">
            Готовы создать свой уникальный торт-остров?
          </h2>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Присоединяйтесь к курсу «Остров» и научитесь создавать потрясающие
            торты, которые вызовут восторг у всех!
          </p>
          <BuyCourseButton
            courseId="ostrov"
            price={price}
            learnHref="/dashboard/courses/ostrov/learn"
            variant="cta"
          />
        </div>
      </div>
    </div>
  );
};

export default OstrovCourse;
