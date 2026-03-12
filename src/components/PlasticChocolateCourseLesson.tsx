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
  const [videoSrc, setVideoSrc] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [started, setStarted] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    setVideoSrc(null);
    setLoading(false);
    setError(null);
    setStarted(false);
  }, [url]);

  useEffect(() => {
    return () => {
      if (videoRef.current) {
        videoRef.current.pause();
        videoRef.current.src = "";
        videoRef.current.load();
      }
    };
  }, []);

  const loadVideo = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const apiUrl = `https://cloud-api.yandex.net/v1/disk/public/resources/download?public_key=${encodeURIComponent(url)}`;
      const resp = await fetch(apiUrl);
      if (!resp.ok) throw new Error("Не удалось получить ссылку на видео");
      const data = await resp.json();
      if (data.href) {
        setVideoSrc(data.href);
      } else {
        throw new Error("Скачивание запрещено владельцем файла");
      }
    } catch (e: any) {
      setError(e.message || "Ошибка загрузки видео");
    } finally {
      setLoading(false);
    }
  }, [url]);

  const handlePlay = () => {
    setStarted(true);
    loadVideo();
  };

  if (!started) {
    return (
      <div
        className="relative bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl overflow-hidden cursor-pointer group"
        onClick={handlePlay}
      >
        <div className="aspect-video flex flex-col items-center justify-center gap-3 text-white">
          <div className="w-16 h-16 rounded-full bg-pink-600/90 flex items-center justify-center shadow-lg group-hover:bg-pink-500 transition-colors group-hover:scale-110 transform duration-200">
            <Play className="w-7 h-7 text-white ml-1" />
          </div>
          <p className="text-sm text-gray-300 font-medium">{title}</p>
          <p className="text-xs text-gray-500">Нажмите для воспроизведения</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl overflow-hidden">
        <div className="aspect-video flex flex-col items-center justify-center gap-3">
          <Loader2 className="w-10 h-10 text-pink-400 animate-spin" />
          <p className="text-sm text-gray-300">Загрузка видео...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl overflow-hidden">
        <div className="aspect-video flex flex-col items-center justify-center gap-3 p-4">
          <AlertCircle className="w-10 h-10 text-red-400" />
          <p className="text-sm text-red-300 text-center">{error}</p>
          <div className="flex gap-2 mt-2">
            <button
              onClick={() => { setError(null); loadVideo(); }}
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
              Открыть на Яндекс.Диске <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative bg-black rounded-xl overflow-hidden shadow-lg">
      <video
        ref={videoRef}
        src={videoSrc!}
        controls
        autoPlay
        className="w-full aspect-video"
      >
        Ваш браузер не поддерживает видео.
      </video>
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
    </div>
  );
};

// ==========================================
// Данные курса «Пластичный шоколад»
// ==========================================

interface LessonItem {
  id: number;
  title: string;
  type: "video" | "text" | "photo" | "video-links";
  content: string;
  description: string;
  duration?: string;
  links?: { title: string; url: string }[];
  images?: string[];
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
    title: "Вводный урок",
    description: "Введение в курс пластичного шоколада",
    items: [
      {
        id: 1,
        title: "Вводный урок — видео",
        type: "video-links",
        content: "",
        links: [
          { title: "Вводный урок", url: "https://disk.yandex.ru/i/ScXLIiCgZbteUw" },
        ],
        description: "Вводное видео к курсу по пластичному шоколаду.",
      },
    ],
  },
  {
    id: 2,
    title: "Рецепт пластичного шоколада (белый)",
    description: "Видео и рецепт на белом шоколаде",
    items: [
      {
        id: 2,
        title: "Рецепт пластичного шоколада — видео",
        type: "video-links",
        content: "",
        links: [
          { title: "Рецепт пластичного шоколада", url: "https://disk.yandex.ru/i/XFKCxrpNLGuZuw" },
        ],
        description: "Видео-рецепт приготовления пластичного шоколада на белом шоколаде.",
      },
      {
        id: 3,
        title: "Рецепт пластичного шоколада (белый)",
        type: "text",
        content: `Рецепт пластичного шоколада 🍫\n(перед приготовлением обязательно смотрим видео!)\n\n📋 **Ингредиенты:**\n• 300 г белого шоколада (Калебаут 25,9%)\n• 105-110 г сиропа глюкозы\n• 36 г какао-масла (Калебаут или Люкер)\n• 15 г сиропа (1/1 — сахар и вода до кипения и растворения сахара)\n\n🔹 **Приготовление:**\n\n1. Сварить сироп, добавить в горячем виде в глюкозу\n2. Растопить в СВЧ импульсно какао-масло\n3. Растопить импульсно в СВЧ шоколад (оставшиеся каллеты вмешать) — температура шоколада 29-30 градусов. Не перегревать!\n4. Смешать шоколад и какао-масло (температура масла 35 градусов)\n5. При температуре 29 градусов смешать шоколад и глюкозу осторожными движениями, недолго!\n6. Убрать в холодильник на 15-20 минут, аккуратно вымешать, убрать в холодильник ещё на 1-3 часа\n7. Перед работой достать из холодильника за 30-40 минут, оставить при комнатной температуре\n\n✅ Хранить при комнатной температуре, плотно упакованным в плёнку. Срок хранения — как у шоколада, из которого сделан пластичный.\n✅ Цветы лучше делать непосредственно перед декорированием. Или хранить в герметичном контейнере, избегая попадания солнечных лучей!\n✅ На фото — ювелирные весы и пирометр. Это необходимо купить!`,
        description: "Полный рецепт пластичного шоколада на белом шоколаде",
      },
      {
        id: 4,
        title: "Фото: ювелирные весы и пирометр",
        type: "photo",
        content: "/курс роза/Для изготовления роз нам понадобятся.jpg",
        description: "Ювелирные весы и пирометр — необходимые инструменты.",
      },
    ],
  },
  {
    id: 3,
    title: "Рецепт тёмного пластичного шоколада",
    description: "Видео и рецепт на тёмном шоколаде",
    items: [
      {
        id: 5,
        title: "Видео-рецепт тёмного пластичного шоколада",
        type: "video-links",
        content: "",
        links: [
          { title: "Видео-рецепт тёмного пластичного шоколада", url: "https://disk.yandex.ru/i/fRvGbdGxq9CDQg" },
        ],
        description: "Видео-рецепт приготовления пластичного шоколада на тёмном шоколаде.",
      },
      {
        id: 6,
        title: "Рецепт тёмного пластичного шоколада",
        type: "text",
        content: `Рецепт тёмного пластичного шоколада 🍫\n\n📋 **Ингредиенты:**\n• 300 г тёмного шоколада 54% (Калебаут)\n• 175 г глюкозы\n• 15 г сиропа (1/1)\n• 36 г какао-масла (Люкер, берём качественное любое!)\n\n💥 **Обязательно смотрим видео!**\n\n🔹 **Приготовление:**\n\n1. Варим сироп, добавляем в глюкозу\n2. Топим импульсно шоколад вместе с какао-маслом (максимальная температура плавления 40 градусов!)\n3. При температуре (и шоколада, и глюкозы) около 36 градусов смешиваем шоколадную массу с глюкозной\n4. Убираем в холодильник на 20-30 минут, разминаем, убираем в холодильник на 1-2 часа\n5. Перед работой даём отлежаться после холодильника минут 40-60\n\n💥 Храним при комнатной температуре плотно упакованным в плёнку (не в пакет!)`,
        description: "Полный рецепт пластичного шоколада на тёмном шоколаде",
      },
      {
        id: 7,
        title: "Фото: тёмный шоколад",
        type: "photo",
        content: "/курс роза/темный шоколад.jpg",
        description: "Пример тёмного пластичного шоколада.",
      },
    ],
  },
  {
    id: 4,
    title: "Из клубничного шоколада",
    description: "Рецепт на клубничном шоколаде",
    items: [
      {
        id: 8,
        title: "Рецепт из клубничного шоколада",
        type: "text",
        content: `Из клубничного шоколада 🍓\n\nРецепт как белый, но какао-масла берём на 5-6 грамм больше — 50-51 грамм на 300 грамм шоколада!\n\nОстальное всё как обычно!\n\n⚠️ Осторожнее с температурой, не перегреваем!`,
        description: "Рецепт пластичного шоколада из клубничного шоколада",
      },
      {
        id: 9,
        title: "Фото: клубничный шоколад",
        type: "photo",
        content: "/курс роза/клубничного шоколада.jpg",
        description: "Пример пластичного шоколада из клубничного шоколада.",
      },
      {
        id: 10,
        title: "Фото: клубничный шоколад (2)",
        type: "photo",
        content: "/курс роза/клубничного шоколада (1).jpg",
        description: "Пример изделий из клубничного пластичного шоколада.",
      },
    ],
  },
  {
    id: 5,
    title: "Из шоколада Руби",
    description: "Рецепт на шоколаде Руби",
    items: [
      {
        id: 11,
        title: "Рецепт из шоколада Руби",
        type: "text",
        content: `Из шоколада Руби 💎\n\nПо рецепту белого делала! Можно брать граммовку как на клубничный!\n\nСама Роза собрана 3/5 лепестков в рядах. То есть первый ряд три, потом пять, и так далее! Заканчиваем пятью.\n\n💡 Смотрим розу Нео на стебле — там листики и стебель с колючками.`,
        description: "Рецепт пластичного шоколада из шоколада Руби",
      },
      {
        id: 12,
        title: "Фото: шоколад Руби",
        type: "photo",
        content: "/курс роза/шоколада Руби (1).jpg",
        description: "Пример изделий из шоколада Руби.",
      },
      {
        id: 13,
        title: "Фото: шоколад Руби (2)",
        type: "photo",
        content: "/курс роза/шоколада Руби (2).jpg",
        description: "Ещё один пример из шоколада Руби.",
      },
    ],
  },
  {
    id: 6,
    title: "Новые пропорции — ещё эластичнее!",
    description: "Улучшенные пропорции пластичного шоколада",
    items: [
      {
        id: 14,
        title: "Новые пропорции! Шоколад ещё эластичнее! 🥰",
        type: "text",
        content: `Новые пропорции! Шоколад ещё эластичнее! 🥰\n\n📋 **На 300 г шоколада:**\n• 125 г глюкозы\n• 18-20 г сиропа\n• 45 г какао-масла\n\n🔹 Метод тот же!\n\n⚠️ Только в холодильник после замеса минут на 15-20! Иначе сложно вымешивать!`,
        description: "Улучшенный рецепт для более эластичного шоколада",
      },
    ],
  },
  {
    id: 7,
    title: "Пищевой клей",
    description: "Как приготовить пищевой клей",
    items: [
      {
        id: 15,
        title: "Пищевой клей — рецепт",
        type: "text",
        content: `Пищевой клей 🧪\n\nСМС — сухой порошок, продаётся в кондитерских магазинах.\n\n🔹 Разводим хорошей водой (не забывайте, что цветы должны быть полностью съедобны и безопасны!) в пропорции 1/30.\n\n🔹 Просто заливаем порошок водой, даём настояться при комнатной температуре до прозрачности и состояния клея.\n\n🔹 При загустении в дальнейшем добавляем воду, перемешиваем.\n\n✅ Хранить в холодильнике около месяца.`,
        description: "Рецепт пищевого клея из СМС",
      },
    ],
  },
  {
    id: 8,
    title: "Инструменты для работы",
    description: "Список необходимых инструментов",
    items: [
      {
        id: 16,
        title: "Что нам понадобится",
        type: "text",
        content: `Для изготовления роз нам понадобятся — желание научиться 😉❤ и подобные моим инструменты:\n\n1. Коврик для раскатки шоколада (можно работать на столе, без него)\n2. Мат цветочный (двусторонний)\n3. Скалочка (у меня пластиковая)\n4. Шарики цветочные (можно один — с большим диаметром и чуть меньше)\n5. Кисточки для клея и тонировки\n6. Вырубки разного размера лепестка роз, для быстрых роз пятилистники и любой лепесток с «махровым» кончиком (у меня лепесток пиона) для махровой японской розы\n7. Красители гелевые — можете брать любой оттенок для самого цветка и зелени. Чёрный краситель — по желанию\n8. Пыльца для тонировки кончиков и листьев — подбираем под тон красителя\n9. Вырубки листьев или плунжеры\n10. Вайнер листа розы, если будете делать композицию с листьями\n11. Вырубка чашелистника розы — для бутона и розы на стебле\n12. Любой инструмент типа лопаточки для помощи при отделении лепестка от мата или стола\n13. Тейплента зелёного цвета (если будете делать розу на стебле)\n14. Шпажка — для стебля, по необходимости\n15. Ножнички — просто отрезать кусочек тейпленты\n16. Кукурузный крахмал в полотняном мешочке или марле (прикрахмаливать стол или коврик при раскатке)\n17. По желанию — мармелад в виде малинки (продаётся в кондитерском магазине). Это для серединки роз, но покажу обычную серединку из шоколада\n18. Короткие шпажки или зубочистки, насаживать серединку при работе\n19. Кусочек пеноплекса или пенопласта — воткнуть шпажку с серединкой`,
        description: "Полный список инструментов для работы с пластичным шоколадом",
      },
      {
        id: 17,
        title: "Фото: инструменты (1)",
        type: "photo",
        content: "/курс роза/Для изготовления роз нам понадобятся (1).jpg",
        description: "Инструменты для работы с пластичным шоколадом.",
      },
      {
        id: 18,
        title: "Фото: инструменты (2)",
        type: "photo",
        content: "/курс роза/Для изготовления роз нам понадобятся (2).jpg",
        description: "Дополнительные инструменты.",
      },
      {
        id: 19,
        title: "Фото: инструменты (3)",
        type: "photo",
        content: "/курс роза/Для изготовления роз нам понадобятся (3).jpg",
        description: "Вырубки и плунжеры.",
      },
    ],
  },
  {
    id: 9,
    title: "Примеры работ",
    description: "Фото готовых изделий из пластичного шоколада",
    items: [
      {
        id: 20,
        title: "Классическая роза",
        type: "photo",
        content: "/курс роза/Классическая роза.jpg",
        description: "Классическая роза из пластичного шоколада.",
      },
      {
        id: 21,
        title: "Классическая роза с двойной окраской",
        type: "photo",
        content: "/курс роза/Классическая роза с двойной окраской лепестка.jpg",
        description: "Роза с двойной окраской лепестка.",
      },
      {
        id: 22,
        title: "Раскрытая махровая роза в японском стиле",
        type: "photo",
        content: "/курс роза/Раскрытая махровая роза в японском стиле.jpg",
        description: "Махровая роза в японском стиле.",
      },
      {
        id: 23,
        title: "Японская роза с пятью серединками",
        type: "photo",
        content: "/курс роза/Японская роза с пятью серединками.jpg",
        description: "Японская роза с пятью серединками.",
      },
      {
        id: 24,
        title: "Японская роза с двойной окраской",
        type: "photo",
        content: "/курс роза/Японская роза с двойной окраской лепестка.jpg",
        description: "Японская роза с двойной окраской лепестка.",
      },
      {
        id: 25,
        title: "Роза Мондиаль",
        type: "photo",
        content: "/курс роза/Роза Мондиаль.jpg",
        description: "Роза Мондиаль из пластичного шоколада.",
      },
      {
        id: 26,
        title: "Роза Остина раскрытая",
        type: "photo",
        content: "/курс роза/Роза Остина раскрытая.jpg",
        description: "Роза Остина раскрытая.",
      },
      {
        id: 27,
        title: "Роза Остина полузакрытая",
        type: "photo",
        content: "/курс роза/Роза остина полузакрытая.jpg",
        description: "Роза Остина полузакрытая.",
      },
      {
        id: 28,
        title: "Роза с острыми лепестками",
        type: "photo",
        content: "/курс роза/Роза с острыми лепестками и окрашенными кончикам.jpg",
        description: "Роза с острыми лепестками и окрашенными кончиками.",
      },
      {
        id: 29,
        title: "Тройная махровая роза",
        type: "photo",
        content: "/курс роза/Тройная махровая роза.jpg",
        description: "Тройная махровая роза из пластичного шоколада.",
      },
      {
        id: 30,
        title: "Роза с начинкой",
        type: "photo",
        content: "/курс роза/Роза в японском стиле с начинкой.jpg",
        description: "Роза в японском стиле с начинкой.",
      },
      {
        id: 31,
        title: "Фиалки",
        type: "photo",
        content: "/курс роза/фиалки.jpg",
        description: "Фиалки из пластичного шоколада.",
      },
      {
        id: 32,
        title: "Быстрая роза вариант 2",
        type: "photo",
        content: "/курс роза/Быстрая роза вариант второй.jpg",
        description: "Быстрая роза — второй вариант.",
      },
      {
        id: 33,
        title: "Роза Катана",
        type: "photo",
        content: "/курс роза/роза катана  (1).jpg",
        description: "Роза Катана из пластичного шоколада.",
      },
      {
        id: 34,
        title: "Роза Катана (2)",
        type: "photo",
        content: "/курс роза/роза катана  (2).jpg",
        description: "Роза Катана — другой ракурс.",
      },
      {
        id: 35,
        title: "Фото результата",
        type: "photo",
        content: "/курс роза/фото результата.jpg",
        description: "Пример готовой композиции из пластичного шоколада.",
      },
    ],
  },
];

// ==========================================
// Компонент страницы урока
// ==========================================

const PlasticChocolateCourseLesson: React.FC = () => {
  const [activeItem, setActiveItem] = useState<LessonItem>(courseModules[0].items[0]);
  const [completedItems, setCompletedItems] = useState<Set<number>>(new Set());
  const [openModuleId, setOpenModuleId] = useState<number>(courseModules[0].id);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [contentKey, setContentKey] = useState(0);
  const contentRef = useRef<HTMLDivElement>(null);

  const totalItems = courseModules.reduce((s, m) => s + m.items.length, 0);
  const completedCount = completedItems.size;
  const progress = totalItems > 0 ? Math.round((completedCount / totalItems) * 100) : 0;

  const toggleModule = (id: number) => {
    setOpenModuleId(openModuleId === id ? -1 : id);
  };

  const selectItem = (item: LessonItem) => {
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

      if (/^[🔹📋💡⚠️💥✅🧪💎🍓🍫🥰😉❤]/.test(trimmed)) {
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
                Мини-курс «Пластичный шоколад» 🍫
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
              <div className="bg-white rounded-2xl shadow-md p-4 sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto">
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
                    {activeItem.links.map((link) => (
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

export default PlasticChocolateCourseLesson;
