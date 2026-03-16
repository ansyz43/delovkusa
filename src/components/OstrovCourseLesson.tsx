import React, { useState, useCallback, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import Header from "./Header";
import { Button } from "./ui/button";
import {
  ArrowLeft,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  BookOpen,
  Clock,
  Image as ImageIcon,
  Video,
  FileText,
  ChevronLeft,
  ChevronRight,
  X,
  ExternalLink,
  Loader2,
  AlertCircle,
  Play,
} from "lucide-react";

// ==========================================
// Яндекс.Диск — встроенный видеоплеер
// ==========================================

const YandexVideoPlayer: React.FC<{ url: string; title: string }> = ({ url, title }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [started, setStarted] = useState(false);
  const [ready, setReady] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    setLoading(false);
    setError(null);
    setStarted(false);
    setReady(false);
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.removeAttribute('src');
      videoRef.current.load();
    }
  }, [url]);

  useEffect(() => {
    return () => {
      if (videoRef.current) {
        videoRef.current.pause();
        videoRef.current.removeAttribute('src');
        videoRef.current.load();
      }
    };
  }, []);

  const handlePlay = useCallback(async () => {
    setStarted(true);
    setLoading(true);
    setError(null);
    setReady(false);
    try {
      const apiUrl = `https://cloud-api.yandex.net/v1/disk/public/resources/download?public_key=${encodeURIComponent(url)}`;
      const resp = await fetch(apiUrl);
      if (!resp.ok) throw new Error("Не удалось получить ссылку на видео");
      const data = await resp.json();
      if (data.href) {
        const videoUrl = data.href.replace('disposition=attachment', 'disposition=inline');
        if (videoRef.current) {
          videoRef.current.src = videoUrl;
          setReady(true);
          setLoading(false);
          try {
            await videoRef.current.play();
          } catch {
            // Autoplay blocked — user can tap native controls
          }
        }
      } else {
        throw new Error("Скачивание запрещено владельцем файла");
      }
    } catch (e: any) {
      setError(e.message || "Ошибка загрузки видео");
      setLoading(false);
    }
  }, [url]);

  return (
    <div className="relative bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl overflow-hidden">
      <video
        ref={videoRef}
        controls
        playsInline
        preload="none"
        className={`w-full aspect-video bg-black ${ready ? '' : 'hidden'}`}
        onError={() => {
          if (ready) {
            setReady(false);
            setError("Не удалось воспроизвести видео");
          }
        }}
      >
        Ваш браузер не поддерживает видео.
      </video>

      {!started && (
        <div
          className="aspect-video flex flex-col items-center justify-center gap-3 text-white cursor-pointer group"
          onClick={handlePlay}
        >
          <div className="w-16 h-16 rounded-full bg-pink-600/90 flex items-center justify-center shadow-lg group-hover:bg-pink-500 transition-colors group-hover:scale-110 transform duration-200">
            <Play className="w-7 h-7 text-white ml-1" />
          </div>
          <p className="text-sm text-gray-300 font-medium">{title}</p>
          <p className="text-xs text-gray-500">Нажмите для воспроизведения</p>
        </div>
      )}

      {loading && (
        <div className="aspect-video flex flex-col items-center justify-center gap-3">
          <Loader2 className="w-10 h-10 text-pink-400 animate-spin" />
          <p className="text-sm text-gray-300">Загрузка видео...</p>
        </div>
      )}

      {error && (
        <div className="aspect-video flex flex-col items-center justify-center gap-3 p-4">
          <AlertCircle className="w-10 h-10 text-red-400" />
          <p className="text-sm text-red-300 text-center">{error}</p>
          <div className="flex gap-2 mt-2 flex-wrap justify-center">
            <button
              onClick={handlePlay}
              className="px-4 py-2 bg-pink-600 hover:bg-pink-500 text-white text-sm rounded-lg transition-colors"
            >
              Попробовать снова
            </button>
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white text-sm rounded-lg transition-colors flex items-center gap-1"
            >
              Смотреть на Яндекс.Диске <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      )}

      {ready && (
        <div className="absolute top-2 right-2 z-20">
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-black/60 hover:bg-black/80 text-white p-2 rounded-lg transition-colors backdrop-blur-sm"
            title="Открыть на Яндекс.Диске"
          >
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      )}
    </div>
  );
};

// ==========================================
// Данные курса «Остров»
// ==========================================

interface LessonItem {
  id: number;
  title: string;
  type: "video" | "text" | "photo" | "video-links";
  content: string;
  description: string;
  duration?: string;
  links?: { title: string; url: string }[];
}

interface LessonModule {
  id: number;
  title: string;
  description: string;
  items: LessonItem[];
}

const courseModules: LessonModule[] = [
  {
    id: 1,
    title: "Бисквит",
    description: "Приготовление шоколадного шифонового бисквита",
    items: [
      {
        id: 1,
        title: "Видео приготовления бисквита",
        type: "video-links",
        content: "",
        links: [
          { title: "Приготовление бисквита", url: "https://disk.yandex.ru/i/c6o0O35SqsIpjw" },
        ],
        description: "Подробное видео процесса приготовления бисквита — выпечка и проверка готовности.",
        duration: "~10 мин",
      },
      {
        id: 2,
        title: "Шоколадный шифоновый бисквит",
        type: "video-links",
        content: "",
        links: [
          { title: "Шоколадный шифоновый бисквит", url: "https://disk.yandex.ru/i/ZB1qeWNDRUjPoQ" },
        ],
        description: "Видео-урок по приготовлению шоколадного шифонового бисквита для торта «Остров».",
        duration: "~15 мин",
      },
    ],
  },
  {
    id: 2,
    title: "Начинка",
    description: "Шоколадное кремю, вишня фламбе и карамелизированный орех",
    items: [
      {
        id: 3,
        title: "Шоколадное кремю",
        type: "video-links",
        content: "",
        links: [
          { title: "Шоколадное кремю", url: "https://disk.yandex.ru/i/iDG3sCgc22bboQ" },
        ],
        description: "Видео-урок по приготовлению шоколадного кремю — нежной начинки для торта.",
        duration: "~10 мин",
      },
      {
        id: 4,
        title: "Вишня фламбе",
        type: "video-links",
        content: "",
        links: [
          { title: "Вишня фламбе", url: "https://disk.yandex.ru/i/6rIZI_-GQjo9zg" },
        ],
        description: "Видео-урок по приготовлению вишни фламбе — яркого вкусового акцента.",
        duration: "~10 мин",
      },
      {
        id: 5,
        title: "Карамелизированный грецкий орех",
        type: "video-links",
        content: "",
        links: [
          { title: "Карамелизированный грецкий орех", url: "https://disk.yandex.ru/i/RUF0G21M9uNzQw" },
        ],
        description: "Видео-урок по приготовлению карамелизированного грецкого ореха.",
        duration: "~10 мин",
      },
    ],
  },
  {
    id: 3,
    title: "Подложка",
    description: "Подготовка подложки 30/30 см (35/35)",
    items: [
      {
        id: 6,
        title: "Подложка 30/30 см (35/35)",
        type: "video-links",
        content: "",
        links: [
          { title: "Подложка 30 на 30", url: "https://disk.yandex.ru/i/uGTwom6LFJx7Ag" },
        ],
        description: "Видео-урок по подготовке подложки размером 30x30 (35x35) см для торта «Остров».",
        duration: "~10 мин",
      },
    ],
  },
  {
    id: 4,
    title: "Пластичный шоколад",
    description: "Белый и тёмный пластичный шоколад — рецепты и техника",
    items: [
      {
        id: 7,
        title: "✅ Пластичный шоколад белый",
        type: "video-links",
        content: "",
        links: [
          { title: "Белый пластичный шоколад", url: "https://disk.yandex.ru/i/2O7D3g3gVY4bEg" },
        ],
        description: "Видео-урок по приготовлению белого пластичного шоколада.",
        duration: "~10 мин",
      },
      {
        id: 8,
        title: "✅ Рецепт тёмного пластичного шоколада",
        type: "text",
        content: `✅ Рецепт тёмного пластичного шоколада\n\n📋 **Ингредиенты:**\n• 300 г тёмного шоколада 54% (Callebaut)\n• 175 г глюкозы\n• 15 г сиропа (1/1)\n• 36 г какао-масла (Люкер или Callebaut — берём качественное любое!)\n\n💥 **Обязательно смотрим видео!**\n\n🔹 **Пошаговое приготовление:**\n\n1. Варим сироп, добавляем в глюкозу\n\n2. Топим импульсно шоколад вместе с какао-маслом (максимальная температура плавления 40 градусов!)\n\n3. При температуре (и шоколада, и глюкозы) около 36 градусов смешиваем шоколадную массу с глюкозной (получается жидковатая смесь, это нормально!)\n\n4. Убираем в холодильник на 20-30 минут (не передержите!), разминаем, вымешиваем, убираем в холодильник на 1-2 часа\n\n5. Перед работой даём отлежаться после холодильника минут 40-60\n\n💥 Храним при комнатной температуре плотно упакованным в плёнку (не в пакет!) ❤️`,
        description: "Полный рецепт тёмного пластичного шоколада с пошаговой инструкцией",
      },
      {
        id: 9,
        title: "Тёмный пластичный шоколад — видео",
        type: "video-links",
        content: "",
        links: [
          { title: "Тёмный пластичный шоколад", url: "https://disk.yandex.ru/i/EQmZXTzdOkp-nw" },
        ],
        description: "Видео-урок по приготовлению тёмного пластичного шоколада.",
        duration: "~10 мин",
      },
    ],
  },
  {
    id: 5,
    title: "Кокос и основа",
    description: "Заливка основы кокоса и мякоть кокоса",
    items: [
      {
        id: 10,
        title: "Заливка основы кокоса",
        type: "video-links",
        content: "",
        links: [
          { title: "Заливка основы кокоса", url: "https://disk.yandex.ru/i/XXXqcpdIIdQNMQ" },
        ],
        description: "Видео-урок по заливке и формированию кокосовой основы острова.",
        duration: "~10 мин",
      },
    ],
  },
  {
    id: 6,
    title: "Пальмы и инструменты",
    description: "Создание пальм и необходимые инструменты",
    items: [
      {
        id: 11,
        title: "Пальмы. Инструменты для работы",
        type: "video-links",
        content: "",
        links: [
          { title: "Пальмы — инструменты", url: "https://disk.yandex.ru/i/sAjGvoOiFtSQxw" },
        ],
        description: "Видео-урок по инструментам и технике создания пальм.",
        duration: "~10 мин",
      },
      {
        id: 12,
        title: "Мякоть кокоса",
        type: "video-links",
        content: "",
        links: [
          { title: "Мякоть кокоса", url: "https://disk.yandex.ru/i/lWCRFg8B7KMKoQ" },
        ],
        description: "Видео-урок по работе с кокосовой мякотью для украшения острова.",
        duration: "~10 мин",
      },
    ],
  },
  {
    id: 7,
    title: "Декор — черепаха и мелкий декор",
    description: "Черепаха из изомальта, зонтик, шезлонг, цветы",
    items: [
      {
        id: 13,
        title: "Черепаха из изомальта",
        type: "video-links",
        content: "",
        links: [
          { title: "Черепаха из изомальта", url: "https://disk.yandex.ru/i/JZvAQrCq52LIsA" },
        ],
        description: "Видео-урок по созданию черепахи из изомальта — способ 1.",
        duration: "~10 мин",
      },
      {
        id: 14,
        title: "Мелкий декор",
        type: "video-links",
        content: "",
        links: [
          { title: "Мелкий декор", url: "https://disk.yandex.ru/i/4DLLogKevk1pBw" },
        ],
        description: "Видео-урок по созданию мелких декоративных элементов.",
        duration: "~10 мин",
      },
      {
        id: 15,
        title: "Зонтик, шезлонг, цветы",
        type: "video-links",
        content: "",
        links: [
          { title: "Мелкий декор — часть 2", url: "https://disk.yandex.ru/i/lHH6PKNPttCKTA" },
        ],
        description: "Зонтик, шезлонг, цветы и другие мелкие декоративные элементы.",
        duration: "~10 мин",
      },
      {
        id: 16,
        title: "Черепаха — способ 2",
        type: "video-links",
        content: "",
        links: [
          { title: "Черепаха — способ 2", url: "https://disk.yandex.ru/i/c6YpVqbGrDyMdQ" },
        ],
        description: "Альтернативный способ создания черепахи для декора.",
        duration: "~10 мин",
      },
      {
        id: 17,
        title: "Список материалов для декора",
        type: "text",
        content: `Декор — что понадобится 🎨\n\n📋 **Материалы:**\n\n• Пашмание (восточная сладость) или пластичный шоколад (смешать белый и тёмный до светло-коричневого цвета), небольшой кусочек + скалочка\n\n• Ножичек (для нанесения текстуры)\n\n• Насадка открытая звезда на 12 зубчиков\n\n• Какао для обвалки\n\n• Печенье типа «Юбилейного», песочное — 3-4 штуки\n\n• Остатки ганаша\n\n• Тёмный шоколад (в кондитерском мешке, остатки после сборки)\n\n• Коктейльные трубочки пластик (по количеству пальм)\n\n• Лента для бортов подложки — атласная, репсовая, любая`,
        description: "Полный список материалов и инструментов для декорирования торта «Остров»",
      },
    ],
  },
  {
    id: 8,
    title: "Сборка торта",
    description: "Полная сборка торта «Остров»",
    items: [
      {
        id: 18,
        title: "Сборка торта",
        type: "video-links",
        content: "",
        links: [
          { title: "Сборка торта", url: "https://disk.yandex.ru/i/CvQjo4nKWSel5Q" },
        ],
        description: "Подробное видео по сборке торта «Остров» — все этапы от основания до завершения.",
        duration: "~15 мин",
      },
    ],
  },
  {
    id: 9,
    title: "Море",
    description: "Создание реалистичного моря — ганаш и желе",
    items: [
      {
        id: 19,
        title: "Море — видео",
        type: "video-links",
        content: "",
        links: [
          { title: "Море", url: "https://disk.yandex.ru/i/woyYGheC3jKzkA" },
        ],
        description: "Видео-урок по созданию реалистичного моря для торта «Остров».",
        duration: "~15 мин",
      },
      {
        id: 20,
        title: "Рецепт: Море — ганаш и желе",
        type: "text",
        content: `Море — рецепт 🌊\n\n🔹 **Ганаш:**\n• 150 г белого шоколада\n• 75 г сливочного масла комнатной температуры\n\n1. Растопить шоколад импульсно в СВЧ\n2. Добавить масло, перемешать\n3. По желанию добавить белый краситель/диоксид, пробить блендером\n4. Работать можно сразу\n\n🔹 **Желе:**\n• 125 г воды\n• 45 г сахара\n• Ваниль\n• 12 г желатина + 60 г холодной воды — на 15 минут замочить\n\n• Краситель + кандурин\n• Белый гелевый краситель + кисточка\n\n🔹 **Приготовление желе:**\n\n1. В сотейнике довести до кипения воду с сахаром и ванилью, снять с огня\n2. Желатин распустить в СВЧ, вылить в сироп, перемешать, окрасить\n3. Работать при температуре около 35 градусов\n4. Если застынет, можно слегка подогреть в СВЧ\n5. Работать послойно, давая застыть каждому слою около 5-8 минут`,
        description: "Рецепт ганаша и желе для создания реалистичного моря",
      },
    ],
  },
  {
    id: 10,
    title: "Декор — финал",
    description: "Финальное декорирование торта",
    items: [
      {
        id: 21,
        title: "Декор",
        type: "video-links",
        content: "",
        links: [
          { title: "Декор", url: "https://disk.yandex.ru/i/8Ij76pga_iWHDA" },
        ],
        description: "Финальный видео-урок по декорированию торта «Остров».",
        duration: "~15 мин",
      },
    ],
  },
  {
    id: 11,
    title: "Итоговые результаты",
    description: "Фотографии готового торта «Остров»",
    items: [
      {
        id: 22,
        title: "Итоговый результат — вариант 1",
        type: "photo",
        content: "/courses/ostrov/result-1.jpg",
        description: "Готовый торт «Остров» — общий вид сверху.",
      },
      {
        id: 23,
        title: "Итоговый результат — вариант 2",
        type: "photo",
        content: "/courses/ostrov/result-2.jpg",
        description: "Готовый торт «Остров» — детали декора.",
      },
    ],
  },
  {
    id: 12,
    title: "Бонус",
    description: "Пирожное «Картошка», кейкпопсы и эскимошки",
    items: [
      {
        id: 24,
        title: "Бонус — фото пирожного «Картошка»",
        type: "photo",
        content: "/courses/ostrov/bonus-kartoshka.jpg",
        description: "Пирожное «Картошка» — оно же кейкпопсы и эскимошки из остатков бисквита.",
      },
      {
        id: 25,
        title: "Рецепт пирожного «Картошка»",
        type: "text",
        content: `Бонус 🎁\n\nПирожное «Картошка»\n\nОно же кейкпопсы и эскимошки.\n\n📋 **Бисквит:**\nШоколадный шифоновый (торт). На количество данного ниже крема — рецепт на 10 яиц.\nОхлаждённый бисквит перетираем в блендере в крошку.\nЕсли делаете кейкпопсы, часть бисквита заменить на ванильный.\n\n🔹 **Крем:**\n• 250 г сливочного масла комнатной температуры\n• 1 банка варёной сгущёнки\n• 2 ст. л. какао\n• 150 г тёмного шоколада — растопить\n\n1. Масло взбить, постепенно добавлять сгущёнку, взбивая\n2. Добавить какао, взбить\n3. Добавить чуть тёплый шоколад (не охлаждаем ниже 33 градусов!), взбить\n\n🔹 **Шоколадное молоко:**\n• 200 г молока\n• 2 ст. л. какао\n• 150 г мороженого «Пломбир» (можно пропустить, в этом случае добавить 1 ст. л. сахара)\n• 20-30 г бейлиса\n• 20 г тёмного шоколада\n\nДовести до кипения, охладить до комнатной температуры.\n\n🔹 **Грецкий орех:**\n• 100-150 г — слегка обжарить в СВЧ (1-2 мин), раздробить\n\n🔹 **Сборка:**\nВ деже миксера смешиваем веслом частями (делю всё на 3-4 части) крошку, молоко, крем и орех. Перекладываем в большую чашу. И так до полного использования ингредиентов. Перемешиваем.\n\n❄️ **Хранение:**\n• Срок хранения — 5 дней\n• Можно замораживать (1 месяц)\n• Дефростировать через холодильник`,
        description: "Бонусный рецепт пирожного «Картошка» — кейкпопсы и эскимошки из остатков бисквита",
      },
    ],
  },
];

// ==========================================
// Компонент
// ==========================================

const OstrovCourseLesson: React.FC = () => {
  const [openModuleId, setOpenModuleId] = useState<number>(1);
  const [activeItem, setActiveItem] = useState<LessonItem>(courseModules[0].items[0]);
  const [completedItems, setCompletedItems] = useState<Set<number>>(new Set());
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [contentKey, setContentKey] = useState(0);
  const contentRef = useRef<HTMLDivElement>(null);

  const totalItems = courseModules.reduce((sum, m) => sum + m.items.length, 0);
  const completedCount = completedItems.size;
  const progress = Math.round((completedCount / totalItems) * 100);

  const toggleModule = (id: number) => {
    setOpenModuleId(openModuleId === id ? -1 : id);
  };

  const selectItem = (item: LessonItem) => {
    // Stop all playing videos before switching
    if (contentRef.current) {
      contentRef.current.querySelectorAll('video').forEach((v) => {
        v.pause();
        v.removeAttribute('src');
        v.load();
      });
    }
    setActiveItem(item);
    setContentKey((k) => k + 1);
    const mod = courseModules.find((m) => m.items.some((i) => i.id === item.id));
    if (mod) setOpenModuleId(mod.id);
    setTimeout(() => {
      contentRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  const markComplete = (itemId: number) => {
    setCompletedItems((prev) => {
      const next = new Set(prev);
      if (next.has(itemId)) next.delete(itemId);
      else next.add(itemId);
      return next;
    });
  };

  const allItems = courseModules.flatMap((m) => m.items);
  const currentIdx = allItems.findIndex((i) => i.id === activeItem.id);
  const prevItem = currentIdx > 0 ? allItems[currentIdx - 1] : null;
  const nextItem = currentIdx < allItems.length - 1 ? allItems[currentIdx + 1] : null;

  const typeIcon = (type: string) => {
    switch (type) {
      case "video":
      case "video-links":
        return <Video className="w-4 h-4 text-pink-500" />;
      case "photo":
        return <ImageIcon className="w-4 h-4 text-blue-500" />;
      case "text":
        return <FileText className="w-4 h-4 text-amber-500" />;
      default:
        return null;
    }
  };

  const renderTextContent = (text: string) => {
    return text.split("\n").map((line, i) => {
      const trimmed = line.trim();
      if (!trimmed) return <div key={i} className="h-3" />;

      const parts = trimmed.split(/(\*\*.*?\*\*)/g).map((part, j) => {
        if (part.startsWith("**") && part.endsWith("**")) {
          return (
            <strong key={j} className="font-semibold text-gray-800">
              {part.slice(2, -2)}
            </strong>
          );
        }
        return part;
      });

      if (trimmed.startsWith("•")) {
        return (
          <div key={i} className="flex gap-2 py-0.5 text-gray-600">
            <span className="text-pink-400 mt-0.5">•</span>
            <span>{parts}</span>
          </div>
        );
      }

      if (/^\d+\./.test(trimmed)) {
        return (
          <div key={i} className="flex gap-2 py-0.5 text-gray-600 pl-2">
            <span>{parts}</span>
          </div>
        );
      }

      if (/^[🔹📋💡⚠️💥✅🌊🎨❤️]/.test(trimmed)) {
        return (
          <p key={i} className="text-gray-700 font-medium mt-3 mb-1">
            {parts}
          </p>
        );
      }

      return (
        <p key={i} className="text-gray-600 leading-relaxed">
          {parts}
        </p>
      );
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 via-white to-purple-50">
      <Header />

      <main className="pt-24 pb-16 px-4">
        <div className="max-w-7xl mx-auto">
          <Link
            to="/dashboard/courses"
            className="inline-flex items-center text-gray-500 hover:text-pink-600 mb-4 transition-colors text-sm"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Мои курсы
          </Link>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl md:text-3xl font-display font-bold text-gray-800">
                Курс «Остров» 🏝️
              </h1>
              <p className="text-gray-500 text-sm mt-1">
                {completedCount} из {totalItems} материалов изучено
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-48 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-pink-500 to-purple-500 rounded-full transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <span className="text-sm font-medium text-gray-600">{progress}%</span>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-6">
            {/* Sidebar */}
            <div className="lg:w-80 xl:w-96 flex-shrink-0">
              <div className="bg-white rounded-2xl shadow-md p-4 lg:sticky lg:top-24 lg:max-h-[calc(100vh-7rem)] lg:overflow-y-auto">
                <h3 className="font-semibold text-gray-700 mb-3 flex items-center gap-2 text-sm uppercase tracking-wide">
                  <BookOpen className="w-4 h-4" />
                  Содержание курса
                </h3>

                <div className="space-y-1">
                  {courseModules.map((mod) => {
                    const isOpen = openModuleId === mod.id;
                    const modCompleted = mod.items.every((i) =>
                      completedItems.has(i.id),
                    );

                    return (
                      <div key={mod.id}>
                        <button
                          onClick={() => toggleModule(mod.id)}
                          className={`w-full text-left px-3 py-2.5 rounded-xl flex items-center gap-2 transition-all text-sm ${
                            isOpen
                              ? "bg-pink-50 text-pink-700"
                              : "hover:bg-gray-50 text-gray-700"
                          }`}
                        >
                          {modCompleted ? (
                            <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                          ) : (
                            <span className="w-4 h-4 rounded-full border-2 border-gray-300 flex-shrink-0 text-[10px] flex items-center justify-center font-bold text-gray-400">
                              {mod.id}
                            </span>
                          )}
                          <span className="flex-1 font-medium">{mod.title}</span>
                          {isOpen ? (
                            <ChevronUp className="w-4 h-4 flex-shrink-0" />
                          ) : (
                            <ChevronDown className="w-4 h-4 flex-shrink-0" />
                          )}
                        </button>

                        {isOpen && (
                          <div className="ml-4 mt-1 space-y-0.5 mb-2">
                            {mod.items.map((item) => {
                              const isActive = activeItem.id === item.id;
                              const isDone = completedItems.has(item.id);
                              return (
                                <button
                                  key={item.id}
                                  onClick={() => selectItem(item)}
                                  className={`w-full text-left px-3 py-2 rounded-lg flex items-center gap-2 transition-all text-sm ${
                                    isActive
                                      ? "bg-pink-100 text-pink-800 font-medium"
                                      : isDone
                                        ? "text-green-600 hover:bg-green-50"
                                        : "text-gray-600 hover:bg-gray-50"
                                  }`}
                                >
                                  {isDone ? (
                                    <CheckCircle className="w-3.5 h-3.5 text-green-500 flex-shrink-0" />
                                  ) : (
                                    typeIcon(item.type)
                                  )}
                                  <span className="flex-1 truncate">
                                    {item.title}
                                  </span>
                                  {item.duration && (
                                    <span className="text-xs text-gray-400 flex-shrink-0">
                                      {item.duration}
                                    </span>
                                  )}
                                </button>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Content area */}
            <div className="flex-1 min-w-0" ref={contentRef}>
              <div key={contentKey} className="bg-white rounded-2xl shadow-md overflow-hidden">
                {activeItem.type === "video" && (
                  <div className="relative bg-black aspect-video">
                    <video
                      key={activeItem.content}
                      controls
                      playsInline
                      className="w-full h-full"
                      preload="metadata"
                    >
                      <source src={activeItem.content} type="video/mp4" />
                      Ваш браузер не поддерживает видео.
                    </video>
                  </div>
                )}

                {activeItem.type === "video-links" && activeItem.links && (
                  <div className="p-4 md:p-6 space-y-4">
                    {activeItem.links.map((link, idx) => (
                      <YandexVideoPlayer key={link.url} url={link.url} title={link.title} />
                    ))}
                  </div>
                )}

                {activeItem.type === "photo" && (
                  <div
                    className="relative bg-gray-50 flex items-center justify-center p-4 cursor-pointer"
                    onClick={() => setLightboxOpen(true)}
                  >
                    <img
                      src={activeItem.content}
                      alt={activeItem.title}
                      className="max-h-[60vh] object-contain rounded-lg shadow-sm hover:shadow-md transition-shadow"
                    />
                    <div className="absolute bottom-6 right-6 bg-white/80 backdrop-blur-sm rounded-full px-3 py-1.5 text-xs text-gray-500 flex items-center gap-1">
                      <ImageIcon className="w-3 h-3" />
                      Нажмите для увеличения
                    </div>
                  </div>
                )}

                {activeItem.type === "text" && (
                  <div className="p-6 md:p-8">
                    <div className="prose prose-pink max-w-none">
                      {renderTextContent(activeItem.content)}
                    </div>
                  </div>
                )}

                <div className="border-t border-gray-100 p-4 md:p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h2 className="text-lg font-semibold text-gray-800 mb-1">
                        {activeItem.title}
                      </h2>
                      <p className="text-sm text-gray-500">
                        {activeItem.description}
                      </p>
                      {activeItem.duration && (
                        <span className="inline-flex items-center gap-1 mt-2 text-xs text-gray-400">
                          <Clock className="w-3 h-3" />
                          {activeItem.duration}
                        </span>
                      )}
                    </div>
                    <Button
                      onClick={() => markComplete(activeItem.id)}
                      variant={completedItems.has(activeItem.id) ? "outline" : "default"}
                      className={
                        completedItems.has(activeItem.id)
                          ? "border-green-200 text-green-600 hover:bg-green-50 flex-shrink-0"
                          : "bg-pink-600 hover:bg-pink-700 text-white flex-shrink-0"
                      }
                    >
                      <CheckCircle className="w-4 h-4 mr-1" />
                      {completedItems.has(activeItem.id)
                        ? "Изучено ✓"
                        : "Отметить как изученное"}
                    </Button>
                  </div>

                  <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-100">
                    {prevItem ? (
                      <button
                        onClick={() => selectItem(prevItem)}
                        className="flex items-center gap-2 text-sm text-gray-500 hover:text-pink-600 transition-colors"
                      >
                        <ChevronLeft className="w-4 h-4" />
                        <span className="hidden sm:inline">{prevItem.title}</span>
                        <span className="sm:hidden">Назад</span>
                      </button>
                    ) : (
                      <div />
                    )}
                    {nextItem ? (
                      <button
                        onClick={() => selectItem(nextItem)}
                        className="flex items-center gap-2 text-sm text-gray-500 hover:text-pink-600 transition-colors"
                      >
                        <span className="hidden sm:inline">{nextItem.title}</span>
                        <span className="sm:hidden">Далее</span>
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    ) : (
                      <div />
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {lightboxOpen && activeItem.type === "photo" && (
        <div
          className="fixed inset-0 z-[9999] bg-black/80 flex items-center justify-center"
          onClick={() => setLightboxOpen(false)}
        >
          <button
            onClick={() => setLightboxOpen(false)}
            className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/20 hover:bg-white/40 transition-colors"
          >
            <X className="w-6 h-6 text-white" />
          </button>
          <img
            src={activeItem.content}
            alt={activeItem.title}
            className="max-w-[92vw] max-h-[92vh] object-contain select-none"
            onClick={(e) => e.stopPropagation()}
            draggable={false}
          />
        </div>
      )}
    </div>
  );
};

export default OstrovCourseLesson;
