import React, { useState, useMemo } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "./ui/card";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Checkbox } from "./ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Calculator, Package, Cake, Sparkles } from "lucide-react";

// Конфигурация размеров
const SIZES = {
  XS: { guests: "6–8", weight: 2.2, label: "XS (6–8 гостей)" },
  S: { guests: "10–12", weight: 2.7, label: "S (10–12 гостей)" },
  M: { guests: "14–15", weight: 3.0, label: "M (14–15 гостей)" },
  L: { guests: "16–20", weight: 4.0, label: "L (16–20 гостей)" },
  XL: { guests: "20+", weight: 5.0, label: "XL (20+ гостей)" },
};

// Тарифы (руб/кг)
const RATES = {
  simple: { price: 3300, label: "Простой декор" },
  medium: { price: 3500, label: "Средний декор" },
  square: { price: 3700, label: "Квадрат / шоколадные цветы" },
  tiered_simple: { price: 3800, label: "Ярусный простой" },
  tiered_complex: { price: 4000, label: "Ярусный сложный (от)" },
  vase: { price: 3600, label: "Торт-ваза" },
  "3d_simple": { price: 3600, label: "3D простой (пенёк)" },
  "3d_medium": { price: 3700, label: "3D средний (коробка, бочка, бургер)" },
  "3d_complex": { price: 3800, label: "3D сложный (от)" },
  long: { price: 3800, label: "Длинный узкий" },
};

const CakeCalculator = () => {
  const [selectedSize, setSelectedSize] = useState<keyof typeof SIZES>("S");
  const [selectedStyle, setSelectedStyle] = useState<keyof typeof RATES>("simple");
  const [isPistachioRaspberry, setIsPistachioRaspberry] = useState(false);
  const [hasPrint, setHasPrint] = useState(false);
  const [figureType, setFigureType] = useState<"none" | "regular" | "portrait">("none");
  const [deliveryType, setDeliveryType] = useState<"none" | "city" | "suburb">("none");

  // Расчет итоговой цены
  const calculation = useMemo(() => {
    const size = SIZES[selectedSize];
    let ratePerKg = RATES[selectedStyle].price;

    // Доплата за фисташку-малину
    if (isPistachioRaspberry) {
      ratePerKg += 400;
    }

    // Базовая цена торта
    let cakePrice = size.weight * ratePerKg;

    // Доплата за вес 5+ кг
    let weightSurcharge = 0;
    if (size.weight >= 5.0) {
      weightSurcharge = 700;
      cakePrice += weightSurcharge;
    }

    // Опции
    let optionsPrice = 0;
    if (hasPrint) optionsPrice += 400;
    if (figureType === "regular") optionsPrice += 1500;
    if (figureType === "portrait") optionsPrice += 3000;

    // Доставка
    let deliveryPrice = 0;
    if (deliveryType === "city") deliveryPrice = 550;
    if (deliveryType === "suburb") deliveryPrice = 900; // среднее между 800-1000

    const total = cakePrice + optionsPrice + deliveryPrice;

    return {
      size,
      ratePerKg,
      cakePrice,
      weightSurcharge,
      optionsPrice,
      deliveryPrice,
      total,
    };
  }, [selectedSize, selectedStyle, isPistachioRaspberry, hasPrint, figureType, deliveryType]);

  return (
    <Card className="w-full max-w-4xl mx-auto bg-gradient-to-br from-pink-50 to-white border-2 border-pink-200">
      <CardHeader className="text-center">
        <div className="flex justify-center mb-4">
          <div className="p-3 bg-pink-100 rounded-full">
            <Calculator className="w-8 h-8 text-pink-600" />
          </div>
        </div>
        <CardTitle className="text-3xl font-bold text-gray-800">
          Калькулятор торта
        </CardTitle>
        <CardDescription className="text-base">
          Рассчитайте стоимость вашего торта за несколько кликов
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Выбор размера */}
        <div className="space-y-3">
          <Label className="text-lg font-semibold flex items-center gap-2">
            <Package className="w-5 h-5" />
            Сколько гостей?
          </Label>
          <RadioGroup value={selectedSize} onValueChange={(value) => setSelectedSize(value as keyof typeof SIZES)}>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {Object.entries(SIZES).map(([key, size]) => (
                <div key={key} className="flex items-center space-x-2">
                  <RadioGroupItem value={key} id={key} />
                  <Label
                    htmlFor={key}
                    className="cursor-pointer font-medium flex-1 p-3 border rounded-lg hover:bg-pink-50 transition-colors"
                  >
                    {size.label}
                    {key === "S" && (
                      <span className="ml-2 text-xs bg-pink-500 text-white px-2 py-0.5 rounded-full">
                        популярный
                      </span>
                    )}
                  </Label>
                </div>
              ))}
            </div>
          </RadioGroup>
        </div>

        {/* Выбор стиля */}
        <div className="space-y-3">
          <Label className="text-lg font-semibold flex items-center gap-2">
            <Cake className="w-5 h-5" />
            Стиль торта
          </Label>
          <Select value={selectedStyle} onValueChange={(value) => setSelectedStyle(value as keyof typeof RATES)}>
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(RATES).map(([key, rate]) => (
                <SelectItem key={key} value={key}>
                  {rate.label} — {rate.price} ₽/кг
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Начинка */}
        <div className="space-y-3">
          <Label className="text-lg font-semibold flex items-center gap-2">
            <Sparkles className="w-5 h-5" />
            Начинка
          </Label>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="pistachio"
              checked={isPistachioRaspberry}
              onCheckedChange={(checked) => setIsPistachioRaspberry(checked as boolean)}
            />
            <Label htmlFor="pistachio" className="cursor-pointer">
              Фисташка–малина (+400 ₽/кг)
            </Label>
          </div>
        </div>

        {/* Дополнительно */}
        <div className="space-y-3">
          <Label className="text-lg font-semibold">Дополнительно</Label>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="print"
                checked={hasPrint}
                onCheckedChange={(checked) => setHasPrint(checked as boolean)}
              />
              <Label htmlFor="print" className="cursor-pointer">
                Печать (+400 ₽/лист)
              </Label>
            </div>

            <div className="ml-6 space-y-2">
              <Label>Фигурка</Label>
              <RadioGroup value={figureType} onValueChange={(value) => setFigureType(value as "none" | "regular" | "portrait")}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="none" id="no-figure" />
                  <Label htmlFor="no-figure">Без фигурки</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="regular" id="regular-figure" />
                  <Label htmlFor="regular-figure">Ручной работы (от 1500 ₽)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="portrait" id="portrait-figure" />
                  <Label htmlFor="portrait-figure">Портретная (от 3000 ₽)</Label>
                </div>
              </RadioGroup>
            </div>
          </div>
        </div>

        {/* Доставка */}
        <div className="space-y-3">
          <Label className="text-lg font-semibold">Доставка</Label>
          <RadioGroup value={deliveryType} onValueChange={(value) => setDeliveryType(value as "none" | "city" | "suburb")}>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="none" id="pickup" />
              <Label htmlFor="pickup">Самовывоз (0 ₽)</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="city" id="city-delivery" />
              <Label htmlFor="city-delivery">Город (550 ₽)</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="suburb" id="suburb-delivery" />
              <Label htmlFor="suburb-delivery">Пригород (800–1000 ₽)</Label>
            </div>
          </RadioGroup>
        </div>

        {/* Результат расчета */}
        <div className="mt-8 p-6 bg-gradient-to-r from-pink-100 to-purple-100 rounded-xl border-2 border-pink-300">
          <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Cake className="w-6 h-6" />
            Результат расчета
          </h3>

          <div className="space-y-3 text-gray-700">
            <div className="flex justify-between items-center pb-2 border-b border-gray-300">
              <span className="font-semibold">Рекомендуемый размер:</span>
              <span className="text-lg font-bold">{calculation.size.label}</span>
            </div>

            <div className="flex justify-between items-center">
              <span>Цена торта:</span>
              <span className="font-semibold">
                {calculation.size.weight} кг × {calculation.ratePerKg} ₽ = {calculation.cakePrice.toLocaleString()} ₽
              </span>
            </div>

            {calculation.weightSurcharge > 0 && (
              <div className="flex justify-between items-center text-sm text-gray-600">
                <span>Доплата за вес (5+ кг):</span>
                <span>+{calculation.weightSurcharge} ₽</span>
              </div>
            )}

            {calculation.optionsPrice > 0 && (
              <div className="flex justify-between items-center">
                <span>Дополнительные опции:</span>
                <span className="font-semibold">+{calculation.optionsPrice.toLocaleString()} ₽</span>
              </div>
            )}

            {calculation.deliveryPrice > 0 && (
              <div className="flex justify-between items-center">
                <span>Доставка:</span>
                <span className="font-semibold">+{calculation.deliveryPrice} ₽</span>
              </div>
            )}

            <div className="pt-3 border-t-2 border-gray-400">
              <div className="flex justify-between items-center">
                <span className="text-xl font-bold">Итого:</span>
                <span className="text-3xl font-bold text-pink-600">
                  {calculation.total.toLocaleString()} ₽
                </span>
              </div>
            </div>

            <div className="mt-4 p-3 bg-white rounded-lg text-sm">
              <p className="text-gray-600">
                ✨ Что входит: минимальный декор + свечи и топпер в подарок
              </p>
            </div>
          </div>

          <Button className="w-full mt-4 bg-pink-600 hover:bg-pink-700 text-white py-6 text-lg font-semibold">
            Оформить заказ
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default CakeCalculator;
