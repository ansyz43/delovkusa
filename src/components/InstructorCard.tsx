import React, { useState } from "react";
import { Card, CardContent, CardFooter } from "./ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Badge } from "./ui/badge";

interface InstructorCardProps {
  id?: string;
  name?: string;
  specialty?: string;
  bio?: string;
  image?: string;
  courses?: number;
  experience?: string;
}

const InstructorCard = ({
  id = "1",
  name = "Ирина Гордеева",
  specialty = "Французская выпечка",
  bio = "Отмеченный наградами шеф-кондитер с более чем 15-летним опытом работы в ресторанах со звездами Мишлен. Специализируется на французских техниках выпечки и современной подаче десертов.",
  image = "/instructor.jpg",
  courses = 5,
  experience = "15+ years",
}: InstructorCardProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <Card className="w-[300px] h-[400px] overflow-hidden transition-all duration-300 hover:shadow-lg bg-white">
      <CardContent className="p-0 flex flex-col items-center">
        <div className="w-full h-40 bg-gradient-to-r from-pink-100 to-purple-100 flex items-center justify-center">
          <Avatar className="w-28 h-28 border-4 border-white">
            <AvatarImage src={image} alt={name} />
            <AvatarFallback className="bg-pink-200 text-pink-800 text-xl">
              {name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
        </div>

        <div className="p-6 text-center w-full">
          <h3 className="text-xl font-semibold mb-1">{name}</h3>
          <Badge
            variant="secondary"
            className="mb-3 bg-pink-100 text-pink-800 hover:bg-pink-200"
          >
            {specialty}
          </Badge>
          <p className="text-sm text-gray-600 line-clamp-3 mb-3">{bio}</p>

          <div className="flex justify-center gap-4 text-sm text-gray-500 mb-2">
            <div>
              <span className="font-medium">{courses}</span> Курсов
            </div>
            <div>
              <span className="font-medium">{experience}</span>
            </div>
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0 flex justify-center">
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              variant="outline"
              className="w-full border-pink-200 text-pink-800 hover:bg-pink-50 hover:text-pink-900"
            >
              Посмотреть профиль
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px] bg-white">
            <DialogHeader>
              <DialogTitle className="text-2xl font-semibold">
                {name}
              </DialogTitle>
              <DialogDescription>
                <Badge
                  variant="secondary"
                  className="mt-1 mb-4 bg-pink-100 text-pink-800"
                >
                  {specialty}
                </Badge>
              </DialogDescription>
            </DialogHeader>

            <div className="flex flex-col sm:flex-row gap-6">
              <Avatar className="w-32 h-32 border-4 border-white self-center">
                <AvatarImage src={image} alt={name} />
                <AvatarFallback className="bg-pink-200 text-pink-800 text-2xl">
                  {name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1">
                <h4 className="font-medium mb-2">О преподавателе</h4>
                <p className="text-gray-600 mb-4">{bio}</p>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <h4 className="font-medium mb-1">Опыт</h4>
                    <p className="text-gray-600">{experience}</p>
                  </div>
                  <div>
                    <h4 className="font-medium mb-1">Курсы</h4>
                    <p className="text-gray-600">{courses} активных курсов</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <Button className="bg-pink-600 hover:bg-pink-700 text-white">
                Все курсы преподавателя
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </CardFooter>
    </Card>
  );
};

export default InstructorCard;
