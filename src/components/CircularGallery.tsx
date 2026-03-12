import React, { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "./ui/button";

interface CircularGalleryProps {
  images?: {
    src: string;
    alt: string;
  }[];
  size?: number;
  showControls?: boolean;
}

const CircularGallery = ({
  images = [
    {
      src: "/vaza.jpg",
      alt: "Ваза с цветами 1",
    },
    {
      src: "/vaza1.jpg",
      alt: "Ваза с цветами 2",
    },
  ],
  size = 400,
  showControls = true,
}: CircularGalleryProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isRotating, setIsRotating] = useState(false);

  const goToPrevious = () => {
    setIsRotating(true);
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1,
    );
    setTimeout(() => setIsRotating(false), 500);
  };

  const goToNext = () => {
    setIsRotating(true);
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    setTimeout(() => setIsRotating(false), 500);
  };

  const getPositionStyles = (index: number) => {
    const totalImages = images.length;
    const angle = ((index - currentIndex) * (360 / totalImages)) % 360;
    const radius = size / 2 - 60; // Adjust radius to fit within container

    const radians = (angle * Math.PI) / 180;
    const x = radius * Math.sin(radians);
    const y = -radius * Math.cos(radians);

    const scale = index === currentIndex ? 1 : 0.7;
    const zIndex = index === currentIndex ? 10 : 1;
    const opacity = index === currentIndex ? 1 : 0.6;

    return {
      transform: `translate(${x}px, ${y}px) scale(${scale})`,
      zIndex,
      opacity,
    };
  };

  return (
    <div
      className="relative bg-gradient-to-r from-pink-50 to-purple-50 rounded-full flex items-center justify-center overflow-hidden"
      style={{ width: size, height: size }}
    >
      {/* Center point decoration */}
      <div className="absolute w-16 h-16 bg-white rounded-full shadow-md z-0 flex items-center justify-center">
        <div className="w-10 h-10 bg-gradient-to-r from-pink-200 to-purple-200 rounded-full" />
      </div>

      {/* Images */}
      <div className="relative w-full h-full">
        {images.map((image, index) => (
          <div
            key={index}
            className={`absolute top-1/2 left-1/2 w-28 h-28 rounded-full overflow-hidden shadow-lg border-2 border-white transition-all duration-500 ${isRotating ? "transition-all duration-500" : ""}`}
            style={getPositionStyles(index)}
            onClick={() => setCurrentIndex(index)}
          >
            <img
              src={image.src}
              alt={image.alt}
              className="w-full h-full object-cover"
            />
          </div>
        ))}
      </div>

      {/* Controls */}
      {showControls && (
        <div className="absolute inset-0 flex items-center justify-between px-4 pointer-events-none">
          <Button
            variant="outline"
            size="icon"
            className="rounded-full bg-white/80 backdrop-blur-sm border-white/30 text-pink-600 hover:bg-white pointer-events-auto"
            onClick={goToPrevious}
          >
            <ChevronLeft className="h-5 w-5" />
            <span className="sr-only">Previous</span>
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="rounded-full bg-white/80 backdrop-blur-sm border-white/30 text-pink-600 hover:bg-white pointer-events-auto"
            onClick={goToNext}
          >
            <ChevronRight className="h-5 w-5" />
            <span className="sr-only">Next</span>
          </Button>
        </div>
      )}
    </div>
  );
};

export default CircularGallery;
