import React, { useState } from "react";
import { Dialog, DialogContent } from "./ui/dialog";
import ZoomableGallery from "./ZoomableGallery";

const studentImages = [
  "otziv roza  (1).jpg",
  "otziv roza  (2).jpg",
  "otziv roza  (3).jpg",
  "otziv roza  (4).jpg",
  "otziv roza  (6).jpg",
  "otziv roza  (8).jpg",
  "otziv crem (1).jpg",
  "otziv crem (3).jpg",
  "otziv crem (5).jpg",
  "otziv crem (6).jpg",
  "otziv crem (7).jpg",
  "otziv crem (8).jpg",
  "otziv crem (9).jpg",
  "otziv crem (10).jpg",
  "otziv crem (11).jpg",
  "otziv crem (12).jpg",
  "otziv crem (13).jpg",
  "otzivostrov (1).jpg",
  "otzivostrov (2).jpg",
  "otzivostrov (3).jpg",
  "otzivostrov (4).jpg",
  "otzivvaza (1).jpg",
  "otzivvaza (2).jpg",
  "otzivvaza (4).jpg",
  "otzivvaza (5).jpg",
  "otzivvaza (6).jpg",
  "otzivvaza (7).jpg",
];

const TestimonialCarousel = () => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  return (
    <div className="w-full bg-gradient-to-r from-pink-50 to-purple-50 py-16 px-4 md:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-gray-800 mb-3">
            Работы моих учеников
          </h2>
          <p className="text-gray-600 max-w-xl mx-auto">
            Посмотрите на результаты, которых достигли мои ученики после
            прохождения курсов
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-4">
          {studentImages.map((src, index) => (
            <div
              key={index}
              className="cursor-pointer aspect-[4/5] overflow-hidden rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 group"
              onClick={() => setSelectedIndex(index)}
            >
              <div className="relative h-full w-full">
                <img
                  src={src}
                  alt={`Работа ученика ${index + 1}`}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  loading={index < 8 ? "eager" : "lazy"}
                />
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-300">
                  <span className="text-white font-medium px-4 py-2 rounded-full bg-black/50 text-sm">
                    Увеличить
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Dialog
        open={selectedIndex !== null}
        onOpenChange={(open) => !open && setSelectedIndex(null)}
      >
        <DialogContent className="max-w-4xl p-0 bg-transparent border-none">
          {selectedIndex !== null && (
            <ZoomableGallery
              images={studentImages.map((src, i) => ({
                src,
                alt: `Работа ученика ${i + 1}`,
              }))}
              initialIndex={selectedIndex}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TestimonialCarousel;
