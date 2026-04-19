import React from "react";
import CoursePageLayout from "./CoursePageLayout";
import ZoomableGallery from "./ZoomableGallery";

const CourseDetail = () => (
  <CoursePageLayout
    courseId="roses"
    title='Курс Лепестками роз'
    description="Роза  Королева не только сада, но и женских, и свадебных тортов!"
    fullDescription={[
      "Курс Лепестками роз  это 18 модулей по созданию цветов из пластичного шоколада.",
      "После курса вы сможете украшать свадебные, юбилейные и праздничные торты цветами, которые выглядят как живые  и зарабатывать на этом!",
      "В курсе есть как сложные цветы (Остина, Мондиаль, тройная махровая), так и быстрые  для тех, кто ценит время.",
      "Раздел для новичков с инструментами и пошаговыми советами поможет начать с нуля.",
    ]}
    price="5000₽"
    level="Beginner"
    image="/roza2.jpg"
    learnHref="/dashboard/courses/roses/learn"
    features={[
      "18 видов цветов из пластичного шоколада",
      "50+ видео-уроков",
      "Подходит новичкам  есть быстрые и лёгкие цветы",
      "Постоянный доступ к материалам",
    ]}
    includes={[
      "18 видов цветов: классическая, японская, махровая, Мондиаль, Остина, Катана, быстрые розы, фиалки и другие",
      "Два рецепта пластичного шоколада  видео + техкарта",
      "Бонусом рецепты для цветного шоколада: Руби, клубничный",
      "50+ видео-уроков с пошаговой демонстрацией каждого лепестка",
      "Раздел для новичков: инструменты, материалы, 5 советов для старта",
      "Галерея готовых работ для вдохновения",
      "Постоянный доступ ко всем материалам",
    ]}
    gallery={
      <ZoomableGallery
        images={[
          { src: "/courses/roses/rozaroza (7).jpg", alt: "Роза 1" },
          { src: "/courses/roses/rozaroza (6).jpg", alt: "Роза 2" },
          { src: "/courses/roses/rozaroza (5).jpg", alt: "Роза 3" },
          { src: "/courses/roses/rozaroza (4).jpg", alt: "Роза 4" },
          { src: "/courses/roses/rozaroza (3).jpg", alt: "Роза 3" },
          { src: "/courses/roses/rozaroza (1).jpg", alt: "Роза 6" },
          { src: "/roza roza  (3).jpg", alt: "Розовая роза 7" },
          { src: "/roza roza  (2).jpg", alt: "Розовая роза 8" },
          { src: "/roza roza  (1).jpg", alt: "Розовая роза 9" },
        ]}
        className="w-full"
      />
    }
    testimonialImages={[
      "/courses/roses/otziv roza  (1).jpg",
      "/courses/roses/otziv roza  (2).jpg",
      "/courses/roses/otziv roza  (3).jpg",
      "/courses/roses/otziv roza  (4).jpg",
      "/courses/roses/otziv roza  (5).jpg",
      "/courses/roses/otziv roza  (6).jpg",
      "/courses/roses/otziv roza  (7).jpg",
      "/courses/roses/otziv roza  (8).jpg",
    ]}
  />
);

export default CourseDetail;
