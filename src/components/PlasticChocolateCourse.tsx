import React from "react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { ArrowLeft, Clock, Users, BookOpen, CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";
import BuyCourseButton from "./BuyCourseButton";

interface PlasticChocolateCourseProps {
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

const PlasticChocolateCourse = ({
  id = "10",
  title = "Мини-курс по пластичному шоколаду",
  description = "Все четыре рецепта - на белом, цветном, молочном и темном шоколаде. Для цвета, топеров и прочего, на что способна ваша фантазия!",
  fullDescription = [
    "Мини-курс, после которого вы будете уверенно работать с пластичным шоколадом любого вида! 💥",
    "9 модулей: четыре рецепта (белый, тёмный, клубничный, Руби), улучшенные пропорции для максимальной эластичности, пищевой клей и полный список инструментов.",
    "Бонусом — галерея из 16 примеров готовых цветов для вдохновения: от классической розы до Катаны и фиалок 🎉",
  ],
  price = "3000₽",
  duration = "Постоянный доступ",
  level = "Beginner",
  image = "/courses/roses/rozaroza (1).jpg",
  features = [
    "4 рецепта пластичного шоколада",
    "9 модулей с видео и техкартами",
    "Список инструментов для старта",
    "Постоянный доступ к материалам",
  ],
  includes = [
    "Рецепт на белом шоколаде — видео + техкарта",
    "Рецепт на тёмном шоколаде — видео + техкарта",
    "Рецепт на клубничном шоколаде — техкарта + фото",
    "Рецепт на шоколаде Руби — техкарта + фото",
    "Улучшенные пропорции — шоколад ещё эластичнее",
    "Рецепт пищевого клея",
    "Полный список инструментов (19 позиций) + фото",
    "Галерея из 16 примеров готовых цветов",
  ],
  instructor = {
    name: "Ирина Гордеева",
    image: "/instructor.jpg",
    title: "Шеф-кондитер, автор курсов",
  },
}: PlasticChocolateCourseProps) => {
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
              courseId="plastic-chocolate"
              price={price}
              learnHref="/dashboard/courses/plastic-chocolate/learn"
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
              <p className="text-gray-600">Видео-уроки и техкарты</p>
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
                Пышная Роза и фиалки
              </h3>
              <p className="text-gray-600">
                Научитесь создавать красивые цветы из пластичного шоколада с
                помощью моих видео-уроков!
              </p>
            </div>
          </div>

          <div>
            <h2 className="text-2xl md:text-3xl font-bold mb-8 text-gray-800">
              Об авторе курса
            </h2>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex items-center">
              <img
                src={instructor.image}
                alt={instructor.name}
                className="w-24 h-24 rounded-full mr-6"
              />
              <div>
                <h3 className="text-xl font-semibold">{instructor.name}</h3>
                <p className="text-gray-600 mb-2">{instructor.title}</p>
                <p className="text-gray-600">
                  Отмеченный наградами шеф-кондитер с более чем 15-летним опытом
                  работы. Специализируется на французских техниках выпечки и
                  современной подаче десертов.
                </p>
              </div>
            </div>

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

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-pink-100 to-purple-100 py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4 text-gray-800">
            Готовы освоить работу с пластичным шоколадом?
          </h2>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Присоединяйтесь к мини-курсу по пластичному шоколаду и научитесь
            создавать красивые украшения для ваших десертов!
          </p>
          <BuyCourseButton
            courseId="plastic-chocolate"
            price={price}
            learnHref="/dashboard/courses/plastic-chocolate/learn"
            variant="cta"
          />
        </div>
      </div>
    </div>
  );
};

export default PlasticChocolateCourse;
