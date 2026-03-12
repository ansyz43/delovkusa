import React, { useState, useRef } from "react";
import {
  ChevronLeft,
  ChevronRight,
  X,
  ZoomIn,
  ZoomOut,
  Maximize2,
} from "lucide-react";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogClose } from "./ui/dialog";

interface ZoomableGalleryProps {
  images?: {
    src: string;
    alt: string;
  }[];
  className?: string;
  initialIndex?: number;
}

const ZoomableGallery = ({
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
  className = "",
  initialIndex = 0,
}: ZoomableGalleryProps) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [dragPosition, setDragPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const imageRef = useRef<HTMLImageElement>(null);

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1,
    );
    resetZoom();
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    resetZoom();
  };

  const resetZoom = () => {
    setZoomLevel(1);
    setDragPosition({ x: 0, y: 0 });
  };

  const handleZoomIn = () => {
    setZoomLevel((prev) => Math.min(prev + 0.5, 4));
  };

  const handleZoomOut = () => {
    setZoomLevel((prev) => {
      const newZoom = Math.max(prev - 0.5, 1);
      if (newZoom === 1) {
        setDragPosition({ x: 0, y: 0 });
      }
      return newZoom;
    });
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (zoomLevel > 1) {
      setIsDragging(true);
      setDragStart({
        x: e.clientX - dragPosition.x,
        y: e.clientY - dragPosition.y,
      });
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isDragging && zoomLevel > 1) {
      setDragPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleImageClick = () => {
    setIsZoomed(true);
    // Reset zoom when opening to ensure we start at normal size
    resetZoom();
  };

  const handleDialogClose = () => {
    resetZoom();
    setIsZoomed(false);
  };

  return (
    <div
      className={`bg-white rounded-xl shadow-lg overflow-hidden ${className}`}
    >
      <div className="relative">
        {/* Main image */}
        <div
          className="relative overflow-hidden bg-gray-100 flex justify-center items-center p-4 cursor-pointer"
          onClick={handleImageClick}
        >
          <img
            src={images[currentIndex].src}
            alt={images[currentIndex].alt}
            className="max-w-full max-h-[400px] object-contain transition-transform duration-300 hover:scale-105"
          />
          <Button
            variant="outline"
            size="icon"
            className="absolute bottom-4 right-4 rounded-full bg-white/80 backdrop-blur-sm border-white/30 text-pink-600 hover:bg-white"
            onClick={(e) => {
              e.stopPropagation();
              setIsZoomed(true);
            }}
          >
            <ZoomIn className="h-5 w-5" />
            <span className="sr-only">Zoom</span>
          </Button>
        </div>

        {/* Controls */}
        <div className="absolute inset-y-0 left-0 flex items-center">
          <Button
            variant="outline"
            size="icon"
            className="ml-2 rounded-full bg-white/80 backdrop-blur-sm border-white/30 text-pink-600 hover:bg-white"
            onClick={(e) => {
              e.stopPropagation();
              goToPrevious();
            }}
          >
            <ChevronLeft className="h-5 w-5" />
            <span className="sr-only">Previous</span>
          </Button>
        </div>
        <div className="absolute inset-y-0 right-0 flex items-center">
          <Button
            variant="outline"
            size="icon"
            className="mr-2 rounded-full bg-white/80 backdrop-blur-sm border-white/30 text-pink-600 hover:bg-white"
            onClick={(e) => {
              e.stopPropagation();
              goToNext();
            }}
          >
            <ChevronRight className="h-5 w-5" />
            <span className="sr-only">Next</span>
          </Button>
        </div>
      </div>

      {/* Thumbnails */}
      <div className="flex p-2 gap-2 overflow-x-auto">
        {images.map((image, index) => (
          <button
            key={index}
            className={`flex-shrink-0 w-16 h-16 rounded-md overflow-hidden border-2 transition-all ${index === currentIndex ? "border-pink-500 scale-105" : "border-transparent hover:border-pink-200"}`}
            onClick={() => {
              setCurrentIndex(index);
              resetZoom();
            }}
          >
            <div className="w-full h-full flex items-center justify-center bg-gray-50">
              <img
                src={image.src}
                alt={`Thumbnail ${index + 1}`}
                className="max-w-full max-h-full object-contain"
              />
            </div>
          </button>
        ))}
      </div>

      {/* Zoom Dialog */}
      <Dialog open={isZoomed} onOpenChange={handleDialogClose}>
        <DialogContent className="max-w-[90vw] max-h-[90vh] p-0 bg-transparent shadow-2xl border-0">
          <div className="relative flex flex-col">
            <DialogClose asChild className="absolute top-4 right-4 z-10">
              <Button
                variant="outline"
                size="icon"
                className="rounded-full bg-white/80 backdrop-blur-sm text-pink-600 border-white/30 hover:bg-white"
                onClick={handleDialogClose}
              >
                <X className="h-5 w-5" />
              </Button>
            </DialogClose>

            <div
              className="flex items-center justify-center p-4 overflow-hidden bg-white/10 backdrop-blur-sm rounded-lg"
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              onClick={(e) => {
                // Only close if clicking outside the image (on the backdrop)
                if (zoomLevel === 1 && e.target === e.currentTarget) {
                  handleDialogClose();
                }
              }}
              style={{ cursor: zoomLevel > 1 ? "grab" : "default" }}
            >
              {/* Left navigation button */}
              <div className="absolute left-4 inset-y-0 flex items-center z-10">
                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-full bg-white/80 backdrop-blur-sm text-pink-600 border-white/30 hover:bg-white"
                  onClick={goToPrevious}
                >
                  <ChevronLeft className="h-6 w-6" />
                  <span className="sr-only">Previous</span>
                </Button>
              </div>

              <div className="relative overflow-hidden">
                <img
                  ref={imageRef}
                  src={images[currentIndex].src}
                  alt={images[currentIndex].alt}
                  className="max-w-[85vw] max-h-[75vh] object-contain transition-transform duration-200 rounded-md shadow-lg"
                  style={{
                    transform: `scale(${zoomLevel}) translate(${dragPosition.x / zoomLevel}px, ${dragPosition.y / zoomLevel}px)`,
                    transformOrigin: "center",
                    cursor: isDragging && zoomLevel > 1 ? "grabbing" : "auto",
                  }}
                />
              </div>

              {/* Right navigation button */}
              <div className="absolute right-4 inset-y-0 flex items-center z-10">
                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-full bg-white/80 backdrop-blur-sm text-pink-600 border-white/30 hover:bg-white"
                  onClick={goToNext}
                >
                  <ChevronRight className="h-6 w-6" />
                  <span className="sr-only">Next</span>
                </Button>
              </div>
            </div>

            <div className="p-4 bg-white/80 backdrop-blur-md rounded-b-lg flex justify-between items-center mt-2">
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-full bg-white/80 text-pink-600 border-white/30 hover:bg-white"
                  onClick={goToPrevious}
                >
                  <ChevronLeft className="h-5 w-5" />
                </Button>

                <div className="text-gray-800 text-sm flex items-center ml-2">
                  {currentIndex + 1} / {images.length}
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-full bg-white/80 text-pink-600 border-white/30 hover:bg-white"
                  onClick={handleZoomOut}
                  disabled={zoomLevel <= 1}
                >
                  <ZoomOut className="h-5 w-5" />
                </Button>

                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-full bg-white/80 text-pink-600 border-white/30 hover:bg-white"
                  onClick={resetZoom}
                  disabled={zoomLevel === 1}
                >
                  <Maximize2 className="h-5 w-5" />
                </Button>

                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-full bg-white/80 text-pink-600 border-white/30 hover:bg-white"
                  onClick={handleZoomIn}
                  disabled={zoomLevel >= 4}
                >
                  <ZoomIn className="h-5 w-5" />
                </Button>
              </div>

              <Button
                variant="outline"
                size="icon"
                className="rounded-full bg-white/80 text-pink-600 border-white/30 hover:bg-white"
                onClick={goToNext}
              >
                <ChevronRight className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ZoomableGallery;
