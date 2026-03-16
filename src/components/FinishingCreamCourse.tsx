import React from "react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import {
  ArrowLeft,
  Clock,
  Users,
  BookOpen,
  CheckCircle,
  MessageSquare,
} from "lucide-react";
import { Link } from "react-router-dom";
import ZoomableGallery from "./ZoomableGallery";
import BuyCourseButton from "./BuyCourseButton";

interface FinishingCreamCourseProps {
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

const FinishingCreamCourse = ({
  id = "8",
  title = "Курс «Финишный крем»",
  description = "Что для Вас важнее в финишном покрытии - стабильность или вкус?",
  fullDescription = [
    "✨ Что важнее в финишном покрытии — стабильность или вкус? Я выбираю и то, и другое! 😉",
    "✨ Больше семи лет работаю этим сырно-шоколадным кремом — все торты, включая 3D, антигравитацию и ярусные, покрываю именно им! 💥",
    "✨ В курсе 9 модулей: два рецепта крема (на белом и тёмном шоколаде), велюр, крем-дамба, выравнивание квадрата, сборка двухъярусного торта и лайфхак по остаткам.",
    "✨ После курса вы будете уверенно выравнивать торты любой формы и собирать устойчивые ярусные конструкции.",
  ],
  price = "3500₽",
  duration = "Неограниченный доступ",
  level = "Beginner",
  image = "/cre1.jpg",
  features = [
    "Стабильность и вкус одновременно",
    "Подходит для 3D и ярусных тортов",
    "9 модулей — видео + текстовые рецепты",
    "Постоянный доступ к материалам",
  ],
  includes = [
    "Два рецепта крема — на белом и тёмном шоколаде (видео + техкарта)",
    "Велюр под финишный крем — рецепт",
    "Крем-дамба для тортов — текстовый урок",
    "Крем для шапочек капкейков и начинки",
    "Видео-урок по выравниванию квадрата/параллелепипеда (~20 мин)",
    "Видео-урок работы ручным миксером (~20 мин)",
    "Бонус: сборка двухъярусного торта — 2 видео + текст",
    "Лайфхак: что делать с остатками крема — видео + рецепт",
    "Расчёт пропорций крема в зависимости от диаметра бисквита",
  ],
  instructor = {
    name: "Ирина Гордеева",
    image: "/instructor.jpg",
    title: "Шеф-кондитер, автор курсов",
  },
}: FinishingCreamCourseProps) => {
  // Gallery images for the course
  const galleryImages = [
    { src: "/cre1.jpg", alt: "Финишный крем 1" },
    { src: "/cre2.jpg", alt: "Финишный крем 2" },
    { src: "/cre3.jpg", alt: "Финишный крем 3" },
    { src: "/cre4.jpg", alt: "Финишный крем 4" },
    { src: "/cre5.jpg", alt: "Финишный крем 5" },
    { src: "/cre6.jpg", alt: "Финишный крем 6" },
  ];

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

            <div className="bg-pink-50 p-6 rounded-lg border border-pink-100 my-6">
              {fullDescription.map((paragraph, index) => (
                <p key={index} className="text-gray-700 mb-4 leading-relaxed">
                  {paragraph}
                </p>
              ))}
            </div>

            <BuyCourseButton
              courseId="cream"
              price={price}
              learnHref="/dashboard/courses/cream/learn"
            />
          </div>

          <div className="rounded-xl overflow-hidden shadow-lg">
            <img
              src={image}
              alt={title}
              className="w-full aspect-[4/3] object-cover"
            />
          </div>
        </div>
      </div>

      {/* Gallery Section */}
      <div className="container mx-auto px-4 mb-16">
        <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center text-gray-800">
          Примеры работ
        </h2>
        <ZoomableGallery images={galleryImages} className="w-full" />
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
          </div>

          <div>
            <div className="mt-8">
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
      </div>

      {/* Testimonials Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold mb-4 text-gray-800">
            Отзывы наших учеников
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Посмотрите, что говорят ученики о нашем курсе «Финишный крем»
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
            <div className="relative w-full pb-[100%] overflow-hidden">
              <img
                src="/otziv crem (1).jpg"
                alt="Отзыв ученика"
                className="absolute inset-0 object-contain w-full h-full"
              />
            </div>
            <div className="p-4 bg-white">
              <div className="flex items-center mb-2">
                <CheckCircle className="h-4 w-4 text-pink-600 mr-2" />
                <span className="text-sm font-medium text-pink-800">
                  Отзыв ученика
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
            <div className="relative w-full pb-[100%] overflow-hidden">
              <img
                src="/otziv crem (2).jpg"
                alt="Отзыв ученика"
                className="absolute inset-0 object-contain w-full h-full"
              />
            </div>
            <div className="p-4 bg-white">
              <div className="flex items-center mb-2">
                <CheckCircle className="h-4 w-4 text-pink-600 mr-2" />
                <span className="text-sm font-medium text-pink-800">
                  Отзыв ученика
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
            <div className="relative w-full pb-[100%] overflow-hidden">
              <img
                src="/otziv crem (3).jpg"
                alt="Отзыв ученика"
                className="absolute inset-0 object-contain w-full h-full"
              />
            </div>
            <div className="p-4 bg-white">
              <div className="flex items-center mb-2">
                <CheckCircle className="h-4 w-4 text-pink-600 mr-2" />
                <span className="text-sm font-medium text-pink-800">
                  Отзыв ученика
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
            <div className="relative w-full pb-[100%] overflow-hidden">
              <img
                src="/otziv crem (4).jpg"
                alt="Отзыв ученика"
                className="absolute inset-0 object-contain w-full h-full"
              />
            </div>
            <div className="p-4 bg-white">
              <div className="flex items-center mb-2">
                <CheckCircle className="h-4 w-4 text-pink-600 mr-2" />
                <span className="text-sm font-medium text-pink-800">
                  Отзыв ученика
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
            <div className="relative w-full pb-[100%] overflow-hidden">
              <img
                src="/otziv crem (5).jpg"
                alt="Отзыв ученика"
                className="absolute inset-0 object-contain w-full h-full"
              />
            </div>
            <div className="p-4 bg-white">
              <div className="flex items-center mb-2">
                <CheckCircle className="h-4 w-4 text-pink-600 mr-2" />
                <span className="text-sm font-medium text-pink-800">
                  Отзыв ученика
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
            <div className="relative w-full pb-[100%] overflow-hidden">
              <img
                src="/otziv crem (6).jpg"
                alt="Отзыв ученика"
                className="absolute inset-0 object-contain w-full h-full"
              />
            </div>
            <div className="p-4 bg-white">
              <div className="flex items-center mb-2">
                <CheckCircle className="h-4 w-4 text-pink-600 mr-2" />
                <span className="text-sm font-medium text-pink-800">
                  Отзыв ученика
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
            <div className="relative w-full pb-[100%] overflow-hidden">
              <img
                src="/otziv crem (7).jpg"
                alt="Отзыв ученика"
                className="absolute inset-0 object-contain w-full h-full"
              />
            </div>
            <div className="p-4 bg-white">
              <div className="flex items-center mb-2">
                <CheckCircle className="h-4 w-4 text-pink-600 mr-2" />
                <span className="text-sm font-medium text-pink-800">
                  Отзыв ученика
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
            <div className="relative w-full pb-[100%] overflow-hidden">
              <img
                src="/otziv crem (8).jpg"
                alt="Отзыв ученика"
                className="absolute inset-0 object-contain w-full h-full"
              />
            </div>
            <div className="p-4 bg-white">
              <div className="flex items-center mb-2">
                <CheckCircle className="h-4 w-4 text-pink-600 mr-2" />
                <span className="text-sm font-medium text-pink-800">
                  Отзыв ученика
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
            <div className="relative w-full pb-[100%] overflow-hidden">
              <img
                src="/otziv crem (9).jpg"
                alt="Отзыв ученика"
                className="absolute inset-0 object-contain w-full h-full"
              />
            </div>
            <div className="p-4 bg-white">
              <div className="flex items-center mb-2">
                <CheckCircle className="h-4 w-4 text-pink-600 mr-2" />
                <span className="text-sm font-medium text-pink-800">
                  Отзыв ученика
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-pink-100 to-purple-100 py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4 text-gray-800">
            Готовы создавать идеальные торты с безупречным покрытием?
          </h2>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Присоединяйтесь к курсу «Финишный крем» и научитесь создавать
            стабильное и вкусное покрытие для любых тортов!
          </p>
          <BuyCourseButton
            courseId="cream"
            price={price}
            learnHref="/dashboard/courses/cream/learn"
            variant="cta"
          />
        </div>
      </div>
    </div>
  );
};

export default FinishingCreamCourse;
