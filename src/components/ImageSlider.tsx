import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "./ui/button";

interface ImageSliderProps {
  images?: {
    src: string;
    alt: string;
    title?: string;
    subtitle?: string;
  }[];
  autoPlay?: boolean;
  interval?: number;
  showControls?: boolean;
  showIndicators?: boolean;
}

const ImageSlider = ({
  images = [
    {
      src: "/roza2.jpg",
      alt: "Торт с цветами",
      title:
        "Научитесь делать реалистичные розы, пионы и фиалки из мастики и крема: покоряйте любые торжества!",
      subtitle:
        "Мои авторские курсы помогут вам создавать кондитерские шедевры, которые будут восхищать ваших близких и клиентов",
    },
    {
      src: "/roza3.jpg",
      alt: "Торт с розовыми цветами",
      title:
        "Научитесь делать реалистичные розы, пионы и фиалки из мастики и крема: покоряйте любые торжества!",
      subtitle:
        "Я поделюсь с вами всеми секретами создания идеальных цветочных украшений для тортов",
    },
    {
      src: "/roza4.jpg",
      alt: "Торт с цветочным декором",
      title:
        "Научитесь делать реалистичные розы, пионы и фиалки из мастики и крема: покоряйте любые торжества!",
      subtitle:
        "От новичка до профессионала за несколько недель с моими подробными видео-уроками",
    },
    // Fallback image in case others fail to load
    {
      src: "https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?w=800&q=80",
      alt: "Кондитерский мастер-класс",
      title:
        "Научитесь делать реалистичные розы, пионы и фиалки из мастики и крема: покоряйте любые торжества!",
      subtitle:
        "Мои авторские курсы помогут вам создавать кондитерские шедевры",
    },
  ],
  autoPlay = true,
  interval = 5000,
  showControls = true,
  showIndicators = true,
}: ImageSliderProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (autoPlay && !isHovering) {
      timer = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
      }, interval);
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [autoPlay, interval, images.length, isHovering]);

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1,
    );
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  return (
    <div
      className="relative w-full h-[600px] overflow-hidden bg-gray-100 image-slider"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {/* Image Slides */}
      <div className="relative w-full h-full">
        {images.map((image, index) => (
          <div
            key={index}
            className={`absolute top-0 left-0 w-full h-full transition-opacity duration-1000 ${index === currentIndex ? "opacity-100" : "opacity-0"}`}
          >
            <img
              src={image.src}
              alt={image.alt}
              className="w-full h-full object-cover"
              loading="eager"
              fetchPriority="high"
              onError={(e) => {
                console.error(`Failed to load image: ${image.src}`);
                e.currentTarget.src =
                  "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=800&q=80";
              }}
            />
            {/* Overlay with gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent">
              {/* Text content */}
              <div className="absolute bottom-0 left-0 right-0 p-8 md:p-16 text-white">
                {image.title && (
                  <h2 className="text-3xl md:text-5xl font-bold mb-2 font-['Montserrat']">
                    {image.title}
                  </h2>
                )}
                {image.subtitle && (
                  <p className="text-lg md:text-xl font-['Open_Sans'] max-w-2xl">
                    {image.subtitle}
                  </p>
                )}
                <Button className="mt-6 bg-white text-black hover:bg-white/90 transition-all duration-300 transform hover:-translate-y-1">
                  Изучить курсы
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Controls */}
      {showControls && (
        <div className="absolute inset-0 flex items-center justify-between px-4">
          <Button
            variant="outline"
            size="icon"
            className="rounded-full bg-white/20 backdrop-blur-sm border-white/30 text-white hover:bg-white/30"
            onClick={goToPrevious}
          >
            <ChevronLeft className="h-6 w-6" />
            <span className="sr-only">Previous</span>
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="rounded-full bg-white/20 backdrop-blur-sm border-white/30 text-white hover:bg-white/30"
            onClick={goToNext}
          >
            <ChevronRight className="h-6 w-6" />
            <span className="sr-only">Next</span>
          </Button>
        </div>
      )}

      {/* Indicators */}
      {showIndicators && (
        <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
          {images.map((_, index) => (
            <button
              key={index}
              className={`w-2.5 h-2.5 rounded-full transition-all ${index === currentIndex ? "bg-white scale-125" : "bg-white/50"}`}
              onClick={() => goToSlide(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageSlider;
