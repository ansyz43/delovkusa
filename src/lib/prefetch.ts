/**
 * Функция для предварительной загрузки компонентов страниц
 * @param path Путь к компоненту для предварительной загрузки
 */
export const prefetchComponent = (path: string) => {
  // Создаем динамический импорт, который будет загружать компонент в фоновом режиме
  import(/* @vite-ignore */ path).catch(() => {
    // Игнорируем ошибки, так как это только предварительная загрузка
  });
};

/**
 * Предварительно загружает все основные компоненты страниц
 */
export const prefetchMainRoutes = () => {
  // Предварительно загружаем основные страницы
  prefetchComponent("./components/home");
  prefetchComponent("./components/CourseDetail");
  prefetchComponent("./components/FinishingCreamCourse");
  prefetchComponent("./components/FlowerVaseCourse");
  prefetchComponent("./components/OstrovCourse");
};
