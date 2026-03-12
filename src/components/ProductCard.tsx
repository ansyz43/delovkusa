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
import { Badge } from "./ui/badge";

interface ProductCardProps {
  image?: string;
  title: string;
  subtitle?: string;
  description?: string;
  price?: string;
  priceRange?: string;
  badge?: string;
  buttons?: {
    label: string;
    onClick: () => void;
    variant?: "default" | "outline" | "secondary";
  }[];
  details?: string[];
}

const ProductCard = ({
  image,
  title,
  subtitle,
  description,
  price,
  priceRange,
  badge,
  buttons,
  details,
}: ProductCardProps) => {
  return (
    <Card className="card-elegant w-full max-w-[380px] overflow-hidden flex flex-col bg-white/90 backdrop-blur-sm border border-gray-100 hover:border-pink-200/60 rounded-2xl">
      {image && (
        <div className="relative h-[240px] overflow-hidden">
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-700 ease-out hover:scale-105"
            loading="lazy"
          />
          {badge && (
            <Badge className="absolute top-3 right-3 bg-pink-500 text-white px-3 py-1 text-sm font-semibold">
              {badge}
            </Badge>
          )}
        </div>
      )}

      <CardHeader className="pb-3">
        <CardTitle className="text-xl font-display font-bold text-gray-800">
          {title}
        </CardTitle>
        {subtitle && (
          <CardDescription className="text-sm text-gray-600 font-medium">
            {subtitle}
          </CardDescription>
        )}
      </CardHeader>

      <CardContent className="flex-grow pb-4">
        {description && (
          <p className="text-sm text-gray-600 mb-3">{description}</p>
        )}

        {details && details.length > 0 && (
          <ul className="space-y-1 mb-3">
            {details.map((detail, index) => (
              <li key={index} className="text-sm text-gray-700 flex items-start">
                <span className="mr-2 text-pink-500">•</span>
                {detail}
              </li>
            ))}
          </ul>
        )}

        {(price || priceRange) && (
          <div className="mt-3 pt-3 border-t border-gray-100">
            {price && (
              <p className="text-2xl font-bold text-pink-600">{price}</p>
            )}
            {priceRange && (
              <p className="text-lg font-semibold text-gray-700">{priceRange}</p>
            )}
          </div>
        )}
      </CardContent>

      {buttons && buttons.length > 0 && (
        <CardFooter className="flex flex-col gap-2 pt-0">
          {buttons.map((button, index) => (
            <Button
              key={index}
              onClick={button.onClick}
              variant={button.variant || "default"}
              className="w-full transition-all duration-300 hover:shadow-md active:scale-[0.97]"
            >
              {button.label}
            </Button>
          ))}
        </CardFooter>
      )}
    </Card>
  );
};

export default ProductCard;
