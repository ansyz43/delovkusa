import React from "react";
import CoursePageLayout from "./CoursePageLayout";

const PlasticChocolateCourse = () => (
  <CoursePageLayout
    courseId="plastic-chocolate"
    title='Мини-курс Пластичный шоколад'
    description="Научитесь создавать красивые цветы и фигурки из пластичного шоколада!"
    fullDescription={[
      "Мини-курс Пластичный шоколад  идеальный старт для тех, кто хочет освоить работу с этим материалом.",
      "На курсе вы узнаете рецепт пластичного шоколада, научитесь создавать пышную розу и нежные фиалки.",
      "Все видео-уроки доступны в вашем личном кабинете с постоянным доступом.",
    ]}
    price="3500₽"
    level="Beginner"
    image="/courses/roses/rozaroza (1).jpg"
    learnHref="/dashboard/courses/plastic-chocolate/learn"
    features={[
      "Рецепт пластичного шоколада",
      "Пышная роза и фиалки  пошагово",
      "Видео-уроки + техкарты",
      "Постоянный доступ к материалам",
    ]}
    includes={[
      "Рецепт пластичного шоколада  видео + техкарта",
      "Пышная роза  пошаговый видео-урок",
      "Фиалки  пошаговый видео-урок",
      "Нюансы работы с пластичным шоколадом",
      "Доступ к материалам навсегда",
    ]}
  />
);

export default PlasticChocolateCourse;
