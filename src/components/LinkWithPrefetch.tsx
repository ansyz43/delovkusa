import { ReactNode, useCallback } from "react";
import { Link, LinkProps } from "react-router-dom";

interface LinkWithPrefetchProps extends LinkProps {
  prefetchPath?: string;
  children: ReactNode;
}

/**
 * Компонент ссылки с предварительной загрузкой страницы при наведении
 */
const LinkWithPrefetch = ({
  prefetchPath,
  children,
  ...props
}: LinkWithPrefetchProps) => {
  const handleMouseEnter = useCallback(() => {
    if (prefetchPath) {
      // Динамически импортируем компонент при наведении
      import(/* @vite-ignore */ prefetchPath).catch(() => {
        // Игнорируем ошибки, так как это только предварительная загрузка
      });
    }
  }, [prefetchPath]);

  return (
    <Link {...props} onMouseEnter={handleMouseEnter}>
      {children}
    </Link>
  );
};

export default LinkWithPrefetch;
