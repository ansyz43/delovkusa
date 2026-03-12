import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import CourseCard from "./CourseCard";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Slider } from "./ui/slider";
import { Label } from "./ui/label";
import { Badge } from "./ui/badge";
import { Search, Filter, ChevronDown, X } from "lucide-react";
import LinkWithPrefetch from "./LinkWithPrefetch";
import { Link } from "react-router-dom";

interface Course {
  id: string;
  image: string;
  title: string;
  description: string;
  price: string;
  duration: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  category: string;
}

interface CourseCatalogProps {
  courses?: Course[];
  title?: string;
  description?: string;
}

const CourseCatalog = ({
  courses = [
    {
      id: "7",
      image:
        "/roza2.jpg",
      title: "Курс «Лепестками роз»",
      description:
        "18 модулей — от классической розы до Мондиаль, Остина и тройной махровой. 50+ видео-уроков, 2 рецепта шоколада + бонус Руби. Есть быстрые цветы и раздел для новичков.",
      price: "5000₽",
      duration: "Постоянный доступ",
      level: "Beginner" as const,
      category: "Cakes",
    },
    {
      id: "8",
      image:
        "/cre1.jpg",
      title: "Курс «Финишный крем»",
      description:
        "Стабильность и вкус одновременно! 9 модулей: два рецепта крема, велюр, крем-дамба, выравнивание квадрата, сборка двухъярусного торта. 7+ лет работаю этим кремом.",
      price: "3500₽",
      duration: "Постоянный доступ",
      level: "Beginner" as const,
      category: "Cakes",
    },
    {
      id: "9",
      image:
        "/vaza1.jpg",
      title: "Курс «Ваза с цветами»",
      description:
        "21 модуль — полный путь от черничного бисквита до готовой вазы с букетом из 7 видов цветов. Рецепты конфи, кремчиза, пралине, финишный крем и велюр. Для начинающих с нуля.",
      price: "4000₽",
      duration: "Постоянный доступ",
      level: "Beginner" as const,
      category: "Cakes",
    },
    {
      id: "10",
      image: "/ostrov.jpg",
      title: "Курс «Остров»",
      description:
        "12 модулей: шоколадный шифоновый бисквит, вишня фламбе, реалистичное море из ганаша и желе, черепаха из изомальта, пальмы. Бонус: картошка, кейкпопсы и эскимошки.",
      price: "4500₽",
      duration: "Постоянный доступ",
      level: "Intermediate" as const,
      category: "Cakes",
    },
    {
      id: "11",
      image: "/plastic-chocolate.jpg",
      title: "Мини-курс «Пластичный шоколад»",
      description:
        "9 модулей: 4 рецепта (белый, тёмный, клубничный, Руби) + улучшенные пропорции, пищевой клей, полный список инструментов и галерея из 16 готовых работ.",
      price: "3000₽",
      duration: "Постоянный доступ",
      level: "Beginner" as const,
      category: "Cakes",
    },
  ],
  title = "Мои авторские курсы",
  description = "Каждый курс создан с любовью и вниманием к деталям. Видео-уроки доступны в личном кабинете с постоянным доступом.",
}: CourseCatalogProps) => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [activeLevel, setActiveLevel] = useState<string | null>(null);
  const [priceRange, setPriceRange] = useState([0, 200]);
  const [showFilters, setShowFilters] = useState(false);

  // Extract unique categories from courses
  const categories = [
    "All",
    ...new Set(courses.map((course) => course.category)),
  ];

  // Filter courses based on search, category, level, and price
  const filteredCourses = courses.filter((course) => {
    const matchesSearch =
      course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      activeCategory === "All" || course.category === activeCategory;
    const matchesLevel = !activeLevel || course.level === activeLevel;
    const coursePrice = parseInt(course.price.replace(/[^0-9]/g, ""));
    const matchesPrice =
      coursePrice >= priceRange[0] && coursePrice <= priceRange[1];

    return matchesSearch && matchesCategory && matchesLevel && matchesPrice;
  });

  const clearFilters = () => {
    setSearchTerm("");
    setActiveCategory("All");
    setActiveLevel(null);
    setPriceRange([0, 200]);
  };

  return (
    <section className="py-16 px-4 md:px-8 bg-gray-50">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-800">
            {title}
          </h2>
          <p className="text-gray-600 max-w-3xl mx-auto">{description}</p>
        </div>

        {/* Search and Filter Controls */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative w-full md:w-1/3">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={18}
              />
              <Input
                type="text"
                placeholder="Поиск курсов..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-white border-gray-200"
              />
            </div>

            <div className="flex gap-3 w-full md:w-auto">
              <Button
                variant="outline"
                className="flex items-center gap-2"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter size={16} />
                Фильтры
                <ChevronDown
                  size={16}
                  className={`transition-transform ${showFilters ? "rotate-180" : ""}`}
                />
              </Button>

              {(searchTerm ||
                activeCategory !== "All" ||
                activeLevel ||
                priceRange[0] > 0 ||
                priceRange[1] < 200) && (
                <Button
                  variant="ghost"
                  onClick={clearFilters}
                  className="flex items-center gap-1 text-gray-600"
                >
                  <X size={16} />
                  Очистить
                </Button>
              )}
            </div>
          </div>

          {/* Expandable Filters */}
          {showFilters && (
            <div className="mt-4 p-6 bg-white rounded-lg shadow-sm border border-gray-100 grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Category Filter */}
              <div>
                <Label className="text-sm font-medium mb-2 block">
                  Категория
                </Label>
                <Tabs
                  defaultValue={activeCategory}
                  onValueChange={setActiveCategory}
                  className="w-full"
                >
                  <TabsList className="grid grid-cols-3 mb-2">
                    {categories.slice(0, 3).map((category) => (
                      <TabsTrigger key={category} value={category}>
                        {category}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                  {categories.length > 3 && (
                    <TabsList className="grid grid-cols-3">
                      {categories.slice(3).map((category) => (
                        <TabsTrigger key={category} value={category}>
                          {category}
                        </TabsTrigger>
                      ))}
                    </TabsList>
                  )}
                </Tabs>
              </div>

              {/* Level Filter */}
              <div>
                <Label className="text-sm font-medium mb-2 block">
                  Уровень
                </Label>
                <div className="flex flex-wrap gap-2">
                  {["Beginner", "Intermediate", "Advanced"].map((level) => (
                    <Badge
                      key={level}
                      variant={activeLevel === level ? "default" : "outline"}
                      className={`cursor-pointer ${activeLevel === level ? "bg-primary" : "hover:bg-gray-100"}`}
                      onClick={() =>
                        setActiveLevel(activeLevel === level ? null : level)
                      }
                    >
                      {level}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Price Range Filter */}
              <div>
                <div className="flex justify-between mb-2">
                  <Label className="text-sm font-medium">Диапазон цен</Label>
                  <span className="text-sm text-gray-500">
                    {priceRange[0]}₽ - {priceRange[1] * 80}₽
                  </span>
                </div>
                <Slider
                  defaultValue={priceRange}
                  min={0}
                  max={200}
                  step={10}
                  value={priceRange}
                  onValueChange={setPriceRange}
                  className="my-4"
                />
              </div>
            </div>
          )}
        </div>

        {/* Course Grid */}
        {filteredCourses.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCourses.map((course) => (
              <div key={course.id} className="flex justify-center">
                <CourseCard
                  image={course.image}
                  title={course.title}
                  description={course.description}
                  price={course.price}
                  duration={course.duration}
                  level={course.level}
                  onClick={() => {
                    if (course.id === "7") {
                      navigate("/courses/roses");
                    } else if (course.id === "8") {
                      navigate("/courses/cream");
                    } else if (course.id === "9") {
                      navigate("/courses/vase");
                    } else if (course.id === "10") {
                      navigate("/courses/ostrov");
                    } else if (course.id === "11") {
                      navigate("/courses/plastic-chocolate");
                    } else {
                      console.log(`Course clicked: ${course.title}`);
                    }
                  }}
                  className="cursor-pointer"
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <h3 className="text-xl font-medium text-gray-700 mb-2">
              Курсы не найдены
            </h3>
            <p className="text-gray-500">
              Попробуйте изменить фильтры или поисковый запрос
            </p>
            <Button variant="outline" className="mt-4" onClick={clearFilters}>
              Сбросить фильтры
            </Button>
          </div>
        )}

        <div className="mt-12 text-center">
          <Link to="/dashboard/courses">
            <Button variant="outline" className="px-8">
              Перейти в личный кабинет
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CourseCatalog;
