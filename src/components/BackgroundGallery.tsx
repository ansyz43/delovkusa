import React, { useState, useEffect, useRef } from "react";

interface BackgroundGalleryProps {
  images: string[];
  interval?: number;
  className?: string;
}

const BackgroundGallery: React.FC<BackgroundGalleryProps> = ({
  images = [
    "roza1.jpg",
    "roza2.jpg",
    "roza3.jpg",
    "roza4.jpg",
    "cre1.jpg",
    "cre2.jpg",
    "cre3.jpg",
  ],
  interval = 5000,
  className = "",
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [nextImageIndex, setNextImageIndex] = useState(1);
  const [imagesLoaded, setImagesLoaded] = useState<boolean[]>(
    new Array(images.length).fill(true),
  );
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const timerRef = useRef<number | null>(null);

  // Предварительная загрузка изображений - оптимизированная версия
  useEffect(() => {
    // Создаем массив для хранения предзагруженных изображений
    const cachedImages = images.map((src) => {
      const img = new Image();
      img.src = src;
      img.decoding = "async"; // Используем асинхронное декодирование
      return img;
    });

    imagesRef.current = cachedImages;

    // Очистка при размонтировании
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [images]);

  // Настройка интервала для смены изображений
  useEffect(() => {
    // Предварительно загружаем следующее изображение
    const preloadNextImage = () => {
      const nextIndex = (currentImageIndex + 1) % images.length;
      setNextImageIndex(nextIndex);
    };

    preloadNextImage(); // Загружаем следующее изображение сразу

    // Устанавливаем интервал для смены изображений
    timerRef.current = window.setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
      preloadNextImage(); // Загружаем следующее изображение после смены
    }, interval);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [currentImageIndex, images.length, interval]);

  return (
    <div className={`relative w-full h-full overflow-hidden ${className}`}>
      {images.map((image, index) => (
        <div
          key={index}
          className={`absolute inset-0 bg-cover bg-center transition-opacity ${index === currentImageIndex ? "opacity-100" : "opacity-0"}`}
          style={{
            backgroundImage: `url(${image})`,
            backgroundPosition: "center 30%",
            transitionDuration: "1.5s",
            willChange: "opacity",
            transform: "translateZ(0)", // Включаем аппаратное ускорение
          }}
          aria-hidden={index !== currentImageIndex}
          data-preload={index === nextImageIndex ? "true" : "false"}
        />
      ))}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
    </div>
  );
};

export default BackgroundGallery;
