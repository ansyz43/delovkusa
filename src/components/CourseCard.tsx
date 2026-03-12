import React from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "./ui/card";
import { Button } from "./ui/button";

interface CourseCardProps {
  image?: string;
  title?: string;
  description?: string;
  price?: string;
  duration?: string;
  level?: "Beginner" | "Intermediate" | "Advanced";
  onClick?: () => void;
}

const CourseCard = ({
  image = "https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?w=500&q=80",
  title = "Мастер-класс по французской выпечке",
  description = "Изучите искусство создания изысканной французской выпечки с нашим комплексным мастер-классом. Идеально подходит для начинающих кондитеров, желающих повысить свои навыки.",
  price = "9900₽",
  duration = "8 недель",
  level = "Intermediate",
  onClick = () => (window.location.href = "/courses/roses"),
}: CourseCardProps) => {
  return (
    <Card
      className="w-full max-w-[350px] h-[450px] overflow-hidden flex flex-col transition-all duration-300 hover:shadow-lg bg-white course-card"
      onClick={onClick}
    >
      <div className="relative h-[200px] overflow-hidden">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
          loading="eager"
          fetchPriority="high"
          onError={(e) => {
            console.error(`Failed to load image: ${image}`);
            e.currentTarget.src =
              "https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?w=500&q=80";
          }}
        />
        <div className="absolute top-3 right-3 bg-white/90 text-black px-3 py-1 rounded-full text-xs font-medium">
          {level}
        </div>
      </div>

      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-bold text-gray-800">
          {title}
        </CardTitle>
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <span>{duration}</span>
        </div>
      </CardHeader>

      <CardContent className="flex-grow">
        <CardDescription className="text-gray-600 line-clamp-3">
          {description}
        </CardDescription>
      </CardContent>

      <CardFooter className="flex justify-between items-center border-t pt-4">
        <span className="font-bold text-lg text-primary">{price}</span>
        <Button className="bg-primary hover:bg-primary/90 text-white transition-all duration-300 transform hover:-translate-y-1">
          Подробнее о курсе
        </Button>
      </CardFooter>
    </Card>
  );
};

export default CourseCard;
