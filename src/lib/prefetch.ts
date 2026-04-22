/**
 * Prefetch основных роутов.
 *
 * ВАЖНО: раньше здесь был `import(/* @vite-ignore *\/ path)` с путями
 * вроде "./components/home". В prod-сборке это вызывало 404 и
 * unhandledrejection → автоматический reload страницы → сайт висел
 * в бесконечной загрузке на мобильных.
 *
 * Сейчас prefetch отключён — Vite сам делает code-splitting и
 * подгружает чанки при переходах по роутам. Ручной prefetch не нужен.
 */
export const prefetchComponent = (_path: string) => {
  // no-op
};

export const prefetchMainRoutes = () => {
  // no-op
};

