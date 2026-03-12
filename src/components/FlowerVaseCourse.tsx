import React from "react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { ArrowLeft, Clock, Users, BookOpen, CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";
import ZoomableGallery from "./ZoomableGallery";
import BuyCourseButton from "./BuyCourseButton";

interface FlowerVaseCourseProps {
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

const FlowerVaseCourse = ({
  id = "9",
  title = "Курс «Ваза с цветами»💥",
  description = "Женщины любят цветы... и торты 😉 Вот почему торт-ваза всегда вызывает восторг!",
  fullDescription = [
    "Женщины любят цветы... и торты 😉 Вот почему торт-ваза всегда вызывает восторг!",
    "✨ 21 модуль — полный путь от выпечки черничного бисквита до готовой вазы с букетом из 7 видов цветов.",
    "✨ Курс для начинающих: каждый шаг показан на видео, включая рецепты конфи, кремчиза, пралине и хрустящего слоя.",
    "✨ После курса вы сможете самостоятельно создать торт-вазу от начала до конца — и удивить заказчиков уникальным дизайном!",
  ],
  price = "4000₽",

  duration = "Постоянный доступ",
  level = "Beginner",
  image = "/vaza1.jpg",
  features = [
    "21 модуль — от бисквита до готовой вазы",
    "7 видов цветов из пластичного шоколада",
    "Подходит для начинающих с нуля",
    "Постоянный доступ к материалам",
  ],
  includes = [
    "Черничный бисквит — видео + рецепт",
    "Черничное конфи — видео + рецепт",
    "Кремчиз с маскарпоне (2 рецепта) + крем-дамба — видео",
    "Пралине и хрустящий слой — видео + рецепт",
    "Два рецепта финишного крема (тёмный и белый шоколад) + велюр",
    "Формовка, выравнивание, текстура, грани и окрашивание вазы — 7 видео",
    "✅ 7 видов цветов: классическая роза, роза с двойным лепестком, японская роза, большой фантазийный цветок, быстрая роза, крокусы",
    "Рецепт пластичного шоколада — видео + техкарта",
    "Нюансы крема и лайфхак по остаткам",
    "Галерея готовых работ",
  ],

  instructor = {
    name: "Ирина Гордеева",
    image: "/instructor.jpg",
    title: "Шеф-кондитер, автор курсов",
  },
}: FlowerVaseCourseProps) => {
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
              courseId="vase"
              price={price}
              learnHref="/dashboard/courses/vase/learn"
            />
          </div>

          <div className="rounded-xl overflow-hidden shadow-lg">
            <ZoomableGallery
              images={[
                { src: "/vaza.jpg", alt: "Ваза с цветами 1" },
                { src: "/vaza1.jpg", alt: "Ваза с цветами 2" },
                { src: "/vazaphoto (1).jpg", alt: "Ваза с цветами 3" },
                { src: "/vazaphoto (3).jpg", alt: "Ваза с цветами 4" },
                { src: "/vazaphoto (5).jpg", alt: "Ваза с цветами 5" },
                { src: "/vazaphoto (6).jpg", alt: "Ваза с цветами 6" },
                { src: "/vazaphoto (7).jpg", alt: "Ваза с цветами 7" },
                { src: "/vazaphoto (8).jpg", alt: "Ваза с цветами 8" },
                { src: "/vaza1.jpg", alt: "Ваза с цветами 9" },
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
                Подходит для начинающих кондитеров
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
                Курс для девочек «с нуля»
              </h3>
              <p className="text-gray-600">
                Подробнейшие уроки - от выпечки бисквита до декора!
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

      {/* Student Works Gallery */}
      <div className="container mx-auto px-4 py-16 bg-gray-50">
        <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center text-gray-800">
          Работы учениц
        </h2>
        <p className="text-gray-600 mb-8 text-center max-w-2xl mx-auto">
          Посмотрите на прекрасные работы, созданные нашими ученицами после
          прохождения курса
        </p>

        <div className="rounded-xl overflow-hidden shadow-lg">
          <ZoomableGallery
            images={[
              { src: "/otzivvaza (1).jpg", alt: "Работа ученицы 1" },
              { src: "/otzivvaza (4).jpg", alt: "Работа ученицы 2" },
              { src: "/otzivvaza (5).jpg", alt: "Работа ученицы 3" },
              { src: "/otzivvaza (6).jpg", alt: "Работа ученицы 4" },
              { src: "/otzivvaza (7).jpg", alt: "Работа ученицы 5" },
            ]}
            className="w-full"
          />
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-pink-100 to-purple-100 py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4 text-gray-800">
            Готовы создать восхитительный торт-вазу с цветами?
          </h2>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Присоединяйтесь к курсу «Ваза с цветами» и научитесь создавать
            потрясающие торты, которые вызовут восторг у всех!
          </p>
          <BuyCourseButton
            courseId="vase"
            price={price}
            learnHref="/dashboard/courses/vase/learn"
            variant="cta"
          />
        </div>
      </div>
    </div>
  );
};

export default FlowerVaseCourse;
