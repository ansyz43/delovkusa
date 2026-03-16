import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../lib/AuthContext";
import { useUserCourses } from "../lib/useUserCourses";
import { apiFetch } from "../lib/api";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { FileText, Download, Loader2, CheckCircle } from "lucide-react";

interface TechCard {
  id: string;
  title: string;
  description: string;
  price: number;
  priceLabel: string;
}

const techCards: TechCard[] = [
  {
    id: "tc-chereshnevyj-tryufel",
    title: "Черешневый трюфель",
    description: "Рецепт изысканного черешневого трюфеля с пошаговой техкартой",
    price: 1500,
    priceLabel: "1500₽",
  },
  {
    id: "tc-chereshnevye-tryufeli-mk",
    title: "Изысканные черешневые трюфели",
    description: "Подробный мастер-класс по приготовлению черешневых трюфелей",
    price: 1500,
    priceLabel: "1500₽",
  },
  {
    id: "tc-plastichnyj-shokolad",
    title: "Пластичный шоколад",
    description: "Рецепт пластичного шоколада для лепки цветов и декора",
    price: 1500,
    priceLabel: "1500₽",
  },
  {
    id: "tc-shifonovyj-biskvit",
    title: "Шоколадный шифоновый бисквит",
    description: "Воздушный шоколадный бисквит — основа для многих тортов",
    price: 1500,
    priceLabel: "1500₽",
  },
  {
    id: "tc-tart-yagoda",
    title: "Тарт со свежей ягодой",
    description: "Тарт и кольца со свежей ягодой — летний хит для кондитеров",
    price: 1500,
    priceLabel: "1500₽",
  },
  {
    id: "tc-chernichnye-nochi",
    title: "Торт «Черничные ночи»",
    description: "Рецепт авторского торта с черничным вкусом и нежной текстурой",
    price: 1500,
    priceLabel: "1500₽",
  },
  {
    id: "tc-tayozhnyj-roman",
    title: "Торт «Таёжный роман»",
    description: "Торт с ягодами и лесными нотками — авторский рецепт",
    price: 1500,
    priceLabel: "1500₽",
  },
  {
    id: "tc-vishnya-v-shokolade",
    title: "Торт «Вишня в шоколаде»",
    description: "Классическое сочетание вишни и шоколада в авторском исполнении",
    price: 1500,
    priceLabel: "1500₽",
  },
  {
    id: "tc-tryufel-chernosliv",
    title: "Трюфель «Чернослив-кедровый орех»",
    description: "Необычный трюфель с черносливом и кедровым орехом",
    price: 1500,
    priceLabel: "1500₽",
  },
  {
    id: "tc-tryufel-malinovyj",
    title: "Трюфель «Малиновый шоколад»",
    description: "Яркий малиновый трюфель в шоколадной глазури",
    price: 1500,
    priceLabel: "1500₽",
  },
];

const TechCardsCatalog: React.FC = () => {
  const { user } = useAuth();
  const { courseIds, loading: accessLoading } = useUserCourses();
  const [buyingId, setBuyingId] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleBuy = async (tcId: string) => {
    if (!user) {
      navigate("/auth");
      return;
    }
    setBuyingId(tcId);
    try {
      const resp = await apiFetch("/api/payments/create", {
        method: "POST",
        body: JSON.stringify({ course_id: tcId }),
      });
      if (!resp.ok) {
        const data = await resp.json();
        alert(data.detail || "Ошибка при создании платежа");
        return;
      }
      const data = await resp.json();
      window.location.href = data.confirmation_url;
    } catch {
      alert("Ошибка сети. Попробуйте ещё раз.");
    } finally {
      setBuyingId(null);
    }
  };

  const handleDownload = async (tcId: string) => {
    try {
      const resp = await apiFetch(`/api/courses/${tcId}/download`);
      if (!resp.ok) {
        alert("Ошибка при скачивании файла");
        return;
      }
      const blob = await resp.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      const disposition = resp.headers.get("content-disposition");
      const match = disposition?.match(/filename="?(.+?)"?$/i);
      a.download = match?.[1] || `${tcId}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch {
      alert("Ошибка сети при скачивании");
    }
  };

  return (
    <section className="py-16 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-800">
            Техкарты рецептов
          </h2>
          <p className="text-gray-600 max-w-3xl mx-auto">
            Готовые техкарты в формате PDF — скачайте и используйте прямо на
            кухне. Точные пропорции, пошаговые инструкции и секреты от шеф-кондитера.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {techCards.map((tc) => {
            const hasAccess = courseIds.includes(tc.id);
            const isBuying = buyingId === tc.id;

            return (
              <Card
                key={tc.id}
                className="border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
              >
                <CardContent className="p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="bg-pink-100 p-2 rounded-lg flex-shrink-0">
                      <FileText className="w-6 h-6 text-pink-600" />
                    </div>
                    <h3 className="font-semibold text-gray-800 text-sm leading-tight">
                      {tc.title}
                    </h3>
                  </div>
                  <p className="text-gray-500 text-sm mb-4 line-clamp-2">
                    {tc.description}
                  </p>

                  {accessLoading ? (
                    <div className="h-10" />
                  ) : hasAccess ? (
                    <div className="space-y-2">
                      <div className="flex items-center gap-1 text-green-600 text-sm font-medium">
                        <CheckCircle className="w-4 h-4" />
                        Куплено
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="flex-1 text-pink-600 border-pink-200 hover:bg-pink-50"
                          onClick={() => handleDownload(tc.id)}
                        >
                          <Download className="w-4 h-4 mr-1" />
                          Скачать PDF
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold text-gray-800">
                        {tc.priceLabel}
                      </span>
                      <Button
                        size="sm"
                        className="bg-pink-600 hover:bg-pink-700 text-white"
                        disabled={isBuying}
                        onClick={() => handleBuy(tc.id)}
                      >
                        {isBuying ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          "Купить"
                        )}
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default TechCardsCatalog;
