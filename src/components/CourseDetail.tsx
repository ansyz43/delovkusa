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
import CircularGallery from "./CircularGallery";
import BuyCourseButton from "./BuyCourseButton";

interface CourseDetailProps {
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
}

const CourseDetail = ({
  id = "7",
  title = "Курс «Лепестками роз»",
  description = "Роза - Королева не только сада, но и женских, и свадебных тортов!",
  fullDescription = [
    "Курс «Лепестками роз» — это 18 модулей по созданию цветов из пластичного шоколада.",
    "После курса вы сможете украшать свадебные, юбилейные и праздничные торты цветами, которые выглядят как живые — и зарабатывать на этом! 😉",
    "В курсе есть как сложные цветы (Остина, Мондиаль, тройная махровая), так и быстрые — для тех, кто ценит время.",
    "Раздел для новичков с инструментами и пошаговыми советами поможет начать с нуля.",
  ],
  price = "5000₽",
  duration = "Постоянный доступ",
  level = "Beginner",
  image = "/roza2.jpg",
  includes = [
    "18 видов цветов: классическая, японская, махровая, Мондиаль, Остина, Катана, быстрые розы, фиалки и другие",
    "Два рецепта пластичного шоколада — видео + техкарта",
    "Бонусом рецепты для цветного шоколада: Руби, клубничный",
    "50+ видео-уроков с пошаговой демонстрацией каждого лепестка",
    "Раздел для новичков: инструменты, материалы, 5 советов для старта",
    "Галерея готовых работ для вдохновения",
    "Постоянный доступ ко всем материалам",
  ],
  features = [
    "18 видов цветов из пластичного шоколада",
    "50+ видео-уроков",
    "Подходит новичкам — есть быстрые и лёгкие цветы",
    "Постоянный доступ к материалам",
  ],
}: CourseDetailProps) => {
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
              courseId="roses"
              price={price}
              learnHref="/dashboard/courses/roses/learn"
            />
          </div>

          <div className="rounded-xl overflow-hidden shadow-lg">
            <ZoomableGallery
              images={[
                { src: "/rozaroza (7).jpg", alt: "Роза 1" },
                { src: "/rozaroza (6).jpg", alt: "Роза 2" },
                { src: "/rozaroza (5).jpg", alt: "Роза 3" },
                { src: "/rozaroza (4).jpg", alt: "Роза 4" },
                { src: "/rozaroza (3).jpg", alt: "Роза 5" },
                { src: "/rozaroza (1).jpg", alt: "Роза 6" },
                {
                  src: "/roza roza  (3).jpg",
                  alt: "Розовая роза 7",
                },
                {
                  src: "/roza roza  (2).jpg",
                  alt: "Розовая роза 8",
                },
                {
                  src: "/roza roza  (1).jpg",
                  alt: "Розовая роза 9",
                },
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

      {/* Testimonials Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold mb-4 text-gray-800">
            Отзывы наших учеников
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Посмотрите, что говорят ученики о нашем курсе «Лепестками роз»
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
            <div className="relative w-full pb-[100%] overflow-hidden">
              <img
                src="/otziv roza  (1).jpg"
                alt="Отзыв ученика"
                className="absolute inset-0 object-contain w-full h-full"
              />
            </div>
            <div className="p-4 bg-white">
              <div className="flex items-center mb-2">
                <MessageSquare className="h-4 w-4 text-pink-600 mr-2" />
                <span className="text-sm font-medium text-pink-800">
                  Отзыв ученика
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
            <div className="relative w-full pb-[100%] overflow-hidden">
              <img
                src="/otziv roza  (2).jpg"
                alt="Отзыв ученика"
                className="absolute inset-0 object-contain w-full h-full"
              />
            </div>
            <div className="p-4 bg-white">
              <div className="flex items-center mb-2">
                <MessageSquare className="h-4 w-4 text-pink-600 mr-2" />
                <span className="text-sm font-medium text-pink-800">
                  Отзыв ученика
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
            <div className="relative w-full pb-[100%] overflow-hidden">
              <img
                src="/otziv roza  (3).jpg"
                alt="Отзыв ученика"
                className="absolute inset-0 object-contain w-full h-full"
              />
            </div>
            <div className="p-4 bg-white">
              <div className="flex items-center mb-2">
                <MessageSquare className="h-4 w-4 text-pink-600 mr-2" />
                <span className="text-sm font-medium text-pink-800">
                  Отзыв ученика
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
            <div className="relative w-full pb-[100%] overflow-hidden">
              <img
                src="/otziv roza  (4).jpg"
                alt="Отзыв ученика"
                className="absolute inset-0 object-contain w-full h-full"
              />
            </div>
            <div className="p-4 bg-white">
              <div className="flex items-center mb-2">
                <MessageSquare className="h-4 w-4 text-pink-600 mr-2" />
                <span className="text-sm font-medium text-pink-800">
                  Отзыв ученика
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
            <div className="relative w-full pb-[100%] overflow-hidden">
              <img
                src="/home/peter/tempo-api/projects/cb1827ef-b44b-4a33-998b-b63e0dcedca0/otziv roza  (5).jpg"
                alt="Отзыв ученика"
                className="absolute inset-0 object-contain w-full h-full"
              />
            </div>
            <div className="p-4 bg-white">
              <div className="flex items-center mb-2">
                <MessageSquare className="h-4 w-4 text-pink-600 mr-2" />
                <span className="text-sm font-medium text-pink-800">
                  Отзыв ученика
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
            <div className="relative w-full pb-[100%] overflow-hidden">
              <img
                src="/otziv roza  (6).jpg"
                alt="Отзыв ученика"
                className="absolute inset-0 object-contain w-full h-full"
              />
            </div>
            <div className="p-4 bg-white">
              <div className="flex items-center mb-2">
                <MessageSquare className="h-4 w-4 text-pink-600 mr-2" />
                <span className="text-sm font-medium text-pink-800">
                  Отзыв ученика
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
            <div className="relative w-full pb-[100%] overflow-hidden">
              <img
                src="/otziv roza  (8).jpg"
                alt="Отзыв ученика"
                className="absolute inset-0 object-contain w-full h-full"
              />
            </div>
            <div className="p-4 bg-white">
              <div className="flex items-center mb-2">
                <MessageSquare className="h-4 w-4 text-pink-600 mr-2" />
                <span className="text-sm font-medium text-pink-800">
                  Отзыв ученика
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
            <div className="relative w-full pb-[100%] overflow-hidden">
              <img
                src="/home/peter/tempo-api/projects/cb1827ef-b44b-4a33-998b-b63e0dcedca0/otziv roza  (7).jpg"
                alt="Отзыв ученика"
                className="absolute inset-0 object-contain w-full h-full"
              />
            </div>
            <div className="p-4 bg-white">
              <div className="flex items-center mb-2">
                <MessageSquare className="h-4 w-4 text-pink-600 mr-2" />
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
            Готовы начать создавать прекрасные розы?
          </h2>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Присоединяйтесь к курсу «Лепестками роз» и научитесь создавать
            потрясающие цветочные украшения для тортов!
          </p>
          <BuyCourseButton
            courseId="roses"
            price={price}
            learnHref="/dashboard/courses/roses/learn"
            variant="cta"
          />
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;
