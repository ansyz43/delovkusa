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
// Данные курса «Ваза с цветами»
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
    title: "Рецепт",
    description: "Полный рецепт торта-вазы",
    items: [
      {
        id: 1,
        title: "Рецепт торта «Ваза с цветами»",
        type: "text",
        content: `Рецепт торта «Ваза с цветами» 🌹\n\n📋 **Состав торта:**\n• Черничный бисквит\n• Шоколадный и ягодный кремчиз с маскарпоне\n• Пралине и хрустящий слой\n• Черничное конфи\n• Два рецепта финишного покрытия\n• Сборка, окраска и декорирование вазы\n\n✅ **Цветы в составе курса:**\n• Фантазийный большой пион\n• Роза классическая\n• Роза с двойным лепестком\n• Японская роза\n• Малый фантазийный цветок\n• Быстрая роза\n• Крокусы\n• Видео-рецепт пластичного шоколада`,
        description: "Обзор состава и структуры торта-вазы",
      },
    ],
  },
  {
    id: 2,
    title: "Бисквит",
    description: "Черничный бисквит для торта-вазы",
    items: [
      {
        id: 2,
        title: "Бисквит — видео",
        type: "video-links",
        content: "",
        links: [
          { title: "Бисквит", url: "https://disk.yandex.ru/i/_hEBH_q5QRFx5Q" },
        ],
        description: "Видео-урок по выпечке черничного бисквита для торта-вазы.",
      },
      {
        id: 3,
        title: "Рецепт бисквита",
        type: "text",
        content: `Бисквит 🧁\n\n📋 **Ингредиенты:**\n• 6 яиц категории С0\n• 220 г сахара\n• 120+100 г черники\n• 1 ч л мёда\n• 100 г растительного масла\n• 70 г молока\n• 220 г (для шоколадного) или 270 г (для черничного) муки\n• 50 г какао (для шоколадного)\n• 14 г разрыхлителя\n\n🔹 **Приготовление:**\n\n1. Включить духовку на 160 градусов с конвекцией, подготовить формы — закрыть низ фольгой, прижать\n2. Просеять муку, какао и разрыхлитель в чашку, тщательно перемешать венчиком до однородности\n3. Отделить белки от желтков\n4. Взбить белки с сахаром, начиная с минимальной скорости (~2 мин), затем 7 мин на высокой (до плотных пиков, но не до меренги)\n5. В чашу блендера — желтки, мёд, молоко, масло, 120 г черники — взбить до однородности\n6. Вылить желтковую смесь на взбитый белок, аккуратно перемешать лопаткой сверху вниз\n7. В два приёма через сито просеять мучную смесь, перемешать лопаткой сверху вниз\n8. Добавить 100 г черники, аккуратно перемешать\n9. Вылить в две формы ∅14-16 см, выпекать ~30 минут до сухой шпажки\n10. Снять фольгу, охладить на решётке ~1 час, завернуть в плёнку прямо в форме, в холодильник на 6-8 часов`,
        description: "Полный рецепт черничного бисквита",
      },
    ],
  },
  {
    id: 3,
    title: "Конфи",
    description: "Ягодное конфи для начинки",
    items: [
      {
        id: 4,
        title: "Конфи — видео",
        type: "video-links",
        content: "",
        links: [
          { title: "Конфи", url: "https://disk.yandex.ru/i/rOhMUwO6JSEqDw" },
        ],
        description: "Видео-урок по приготовлению ягодного конфи.",
      },
      {
        id: 5,
        title: "Рецепт конфи",
        type: "text",
        content: `Конфи 🍓\n\n📋 **Ингредиенты:**\n• 150 г малинового (клубничного, черничного, вишнёвого) пюре\n• 60 г сахара\n• 6 г пектина Nh\n• Щепотка лимонной кислоты\n\n🔹 **Приготовление:**\n\n1. Подготовить форму ∅10-14 см — обтянуть низ пищевой плёнкой, затем плотной фольгой\n2. Смешать 60 г сахара с 6 г пектина Nh\n3. В сотейник с толстым дном добавить 150 г пюре малины, прогреть до 38-40 градусов\n4. Всыпать «дождиком» смесь сахара с пектином, активно перемешивая, после закипания переключить на маленький огонь, варить 2 минуты, снять, добавить лимонную кислоту\n5. Вылить в форму, закрыть плёнкой в контакт, убрать в холодильник на 3-6 часов`,
        description: "Полный рецепт ягодного конфи",
      },
    ],
  },
  {
    id: 4,
    title: "Дамба и кремчиз",
    description: "Кремчиз и дамба для сборки",
    items: [
      {
        id: 6,
        title: "Дамба и кремчиз — видео",
        type: "video-links",
        content: "",
        links: [
          { title: "Дамба и кремчиз", url: "https://disk.yandex.ru/i/iHMtiqkFdjYpgw" },
        ],
        description: "Видео-урок по приготовлению кремчиза и формированию дамбы.",
      },
      {
        id: 7,
        title: "Рецепт кремчиза",
        type: "text",
        content: `Дамба и кремчиз 🍫\n\n📋 **Кремчиз на тёмном шоколаде:**\n• 150 г тёмного шоколада\n• 90 г сливочного масла комнатной температуры\n• 30 г сахарной пудры\n• 280 г творожного сыра\n• 45 г сливок 33-35%\n\n🔹 **Приготовление:**\n1. Растопить шоколад импульсно в СВЧ\n2. Взбить масло с пудрой до пышной массы\n3. Добавить шоколад, перемешать миксером\n4. Добавить сыр, взбить до однородности\n5. Влить сливки, взбить, выложить в мешок\n\n📋 **Кремчиз с маскарпоне:**\n• 120 г сливок\n• 120 г маскарпоне\n• 120 г творожного сыра\n• 50-60 г сахарной пудры\n• 90 г черничного пюре + 6 г крахмала\n• 40-50 г тёмного шоколада\n\n🔹 **Приготовление:**\n1. Проварить пюре с крахмалом до загустения, охладить\n2. Растопить шоколад\n3. Сливки + 40 г пудры — взбить до пиков\n4. Сыр + маскарпоне + 10-20 г пудры — взбить, выложить в сливки\n5. Разделить на две части: в одну — шоколад, во вторую — черничное пюре\n6. Переложить в мешки, убрать в холодильник`,
        description: "Рецепты кремчиза на тёмном шоколаде и с маскарпоне",
      },
    ],
  },
  {
    id: 5,
    title: "Хрустящий слой и пралине",
    description: "Пралине и хрустящий слой для текстуры",
    items: [
      {
        id: 8,
        title: "Хрустящий слой — видео",
        type: "video-links",
        content: "",
        links: [
          { title: "Хрустящий слой и пралине", url: "https://disk.yandex.ru/i/JhCDW5UvRqqBkA" },
        ],
        description: "Видео-урок по приготовлению хрустящего слоя и пралине.",
      },
      {
        id: 9,
        title: "Рецепт пралине и хрустика",
        type: "text",
        content: `Хрустящий слой и пралине 🥜\n\n📋 **Пралине:**\n• 100 г дробленого ореха (фундук/миндаль)\n• 65 г сахара\n\n🔹 1. Растопить сахар до карамели, всыпать орехи, перемешать, выложить на коврик, охладить\n🔹 2. Наломать, перемолоть в блендере до пасты\n\n📋 **Карамелизированный орех:**\n• 50 г дробленого обжаренного ореха\n• 25 г сахара\n\n🔹 Растопить сахар + орех, карамелизировать, охладить, разделить на мелкие кусочки\n\n📋 **Хрустик:**\n• 100 г молочного/тёмного шоколада\n• 45 г карамелизированной вафли\n• 50 г карамелизированного ореха\n• 20 г пралине\n\n🔹 1. Растопить шоколад\n🔹 2. Добавить остальное, перемешать, выложить на коврик, убрать в холодильник`,
        description: "Полный рецепт пралине, карамелизированного ореха и хрустика",
      },
    ],
  },
  {
    id: 6,
    title: "Сборка торта",
    description: "Процесс сборки торта-вазы",
    items: [
      {
        id: 10,
        title: "Сборка торта — видео",
        type: "video-links",
        content: "",
        links: [
          { title: "Сборка торта", url: "https://disk.yandex.ru/i/a7PMf3WILNq14g" },
        ],
        description: "Видео-урок по сборке торта-вазы.",
      },
    ],
  },
  {
    id: 7,
    title: "Финишный крем",
    description: "Два рецепта финишного крема — на тёмном и белом шоколаде",
    items: [
      {
        id: 11,
        title: "Финишный крем на тёмном шоколаде — видео",
        type: "video-links",
        content: "",
        links: [
          { title: "Финишный крем на тёмном шоколаде", url: "https://disk.yandex.ru/i/d4y-I_bJiWRexQ" },
        ],
        description: "Видео-урок по приготовлению финишного крема на тёмном шоколаде.",
      },
      {
        id: 12,
        title: "Рецепт финишного крема на тёмном шоколаде",
        type: "text",
        content: `Финишный крем на тёмном шоколаде 🍫\n\n📋 **Ингредиенты:**\n• 500 г тёмного шоколада\n• 500 г творожного сыра\n• 120 г сливочного масла комнатной температуры\n• 10-20 г сахарной пудры\n\n🔹 **Приготовление:**\n\n1. Достать сыр из холодильника за 20-30 минут\n2. Растопить шоколад импульсно в СВЧ, постоянно перемешивая. Оставшиеся каллеты вмешать лопаткой. Охлаждается при комнатной температуре\n3. Взбить масло с пудрой до посветления и пышности\n4. Поменять венчик на «весло», влить шоколад в масло, перемешать несколько секунд на минимальной скорости, подбить лопаткой снизу вверх\n5. Добавить сыр, на низкой скорости перемешать 10-15 секунд, подбить лопаткой\n6. Перемешать крем лопаткой, нанести черновой слой палеткой, убрать торт в холодильник на 15-20 минут`,
        description: "Полный рецепт финишного крема на тёмном шоколаде",
      },
      {
        id: 13,
        title: "Рецепт финишного крема на белом шоколаде",
        type: "text",
        content: `Финишный крем на белом шоколаде 🤍\n\n📋 **Ингредиенты:**\n• 500 г белого шоколада\n• 30 г какао-масла\n• 500 г творожного сыра\n• 120 г сливочного масла комнатной температуры\n• 10-20 г сахарной пудры\n\n🔹 **Приготовление:**\n\n1. Достать сыр из холодильника за 20-30 минут\n2. Растопить импульсно в СВЧ какао-масло, охладить до 36 градусов\n3. Растопить шоколад импульсно в СВЧ, перемешивая (каллеты вмешать). Добавить какао-масло, перемешать. Оставить при комнатной температуре\n4. Взбить масло с пудрой до посветления\n5. Поменять венчик на «весло», влить шоколад в масло, перемешать на минимальной скорости, подбить лопаткой\n6. Добавить сыр, перемешать 10-15 секунд на низкой скорости\n7. Нанести черновой слой, убрать торт в холодильник на 1 час. Крем переложить в мешок, убрать в холодильник на час`,
        description: "Полный рецепт финишного крема на белом шоколаде",
      },
    ],
  },
  {
    id: 8,
    title: "Формовка торта",
    description: "Формовка торта-вазы — 2 части",
    items: [
      {
        id: 14,
        title: "Формовка торта (2 части)",
        type: "video-links",
        content: "",
        links: [
          { title: "Часть 1", url: "https://disk.yandex.ru/i/eAkRw6DSpUnizg" },
          { title: "Часть 2", url: "https://disk.yandex.ru/i/xGKH9q9zzPCIPw" },
        ],
        description: "Видео-урок по формовке торта в виде вазы. 2 части.",
      },
    ],
  },
  {
    id: 9,
    title: "Выравнивание торта",
    description: "Выравнивание поверхности торта",
    items: [
      {
        id: 15,
        title: "Выравнивание торта — видео",
        type: "video-links",
        content: "",
        links: [
          { title: "Выравнивание торта", url: "https://disk.yandex.ru/i/VAz2S0UGPRfTTQ" },
        ],
        description: "Видео-урок по выравниванию поверхности торта-вазы.",
      },
    ],
  },
  {
    id: 10,
    title: "Текстура и грани",
    description: "Создание текстуры и граней на вазе",
    items: [
      {
        id: 16,
        title: "Текстура и грани — видео",
        type: "video-links",
        content: "",
        links: [
          { title: "Текстура и грани", url: "https://disk.yandex.ru/i/5n6kVALU1HSYSQ" },
        ],
        description: "Видео-урок по созданию текстуры и граней на торте-вазе.",
      },
    ],
  },
  {
    id: 11,
    title: "Окрашивание вазы",
    description: "3 части — окрашивание торта-вазы",
    items: [
      {
        id: 17,
        title: "Окрашивание вазы (3 части)",
        type: "video-links",
        content: "",
        links: [
          { title: "Часть 1", url: "https://disk.yandex.ru/i/d9iXBDacU9b-Iw" },
          { title: "Часть 2", url: "https://disk.yandex.ru/i/AfMsHnlSOEkUfg" },
          { title: "Часть 3", url: "https://disk.yandex.ru/i/wG13i3rmQUi3CQ" },
        ],
        description: "Видео-урок по окрашиванию торта-вазы. 3 части.",
      },
    ],
  },
  {
    id: 12,
    title: "Цветы: Роза классическая + стебель",
    description: "Лепка классической розы со стеблем",
    items: [
      {
        id: 18,
        title: "Роза классическая + стебель (4 части)",
        type: "video-links",
        content: "",
        links: [
          { title: "Часть 1", url: "https://disk.yandex.ru/i/DXy3VbwtRSGtqA" },
          { title: "Часть 2", url: "https://disk.yandex.ru/i/FCMtVB-r3zNbfg" },
          { title: "Часть 3", url: "https://disk.yandex.ru/i/Tizx87iqNQTsMw" },
          { title: "Часть 4", url: "https://disk.yandex.ru/i/zaM-Qp1wlM_IOw" },
        ],
        description: "Видео-урок: классическая роза из пластичного шоколада со стеблем. 4 части.",
      },
    ],
  },
  {
    id: 13,
    title: "Цветы: Роза с двойным лепестком",
    description: "Лепка розы с двойной окраской лепестка",
    items: [
      {
        id: 19,
        title: "Роза с двойным лепестком (2 части)",
        type: "video-links",
        content: "",
        links: [
          { title: "Часть 1", url: "https://disk.yandex.ru/i/PvCTVFAyB26Avg" },
          { title: "Часть 2", url: "https://disk.yandex.ru/i/ozA_2gSLlnAB-w" },
        ],
        description: "Видео-урок: роза с двойным лепестком из пластичного шоколада. 2 части.",
      },
    ],
  },
  {
    id: 14,
    title: "Рецепт пластичного шоколада",
    description: "Видео и текстовый рецепт пластичного шоколада",
    items: [
      {
        id: 20,
        title: "Рецепт пластичного шоколада — видео",
        type: "video-links",
        content: "",
        links: [
          { title: "Рецепт пластичного шоколада", url: "https://disk.yandex.ru/i/XFKCxrpNLGuZuw" },
        ],
        description: "Видео-рецепт приготовления пластичного шоколада.",
      },
      {
        id: 21,
        title: "Рецепт пластичного шоколада",
        type: "text",
        content: `Рецепт пластичного шоколада (перед приготовлением обязательно смотрим видео!) 🍫\n\n📋 **Ингредиенты:**\n• 300 г белого шоколада (Калебаут 25,9%)\n• 105-110 г сиропа глюкозы\n• 36 г какао-масла (Калебаут или Люкер)\n• 15 г сиропа (1/1 — сахар и вода до кипения и растворения сахара)\n\n🔹 **Приготовление:**\n\n1. Сварить сироп, добавить в горячем виде в глюкозу\n2. Растопить в СВЧ импульсно какао-масло\n3. Растопить импульсно в СВЧ шоколад (оставшиеся каллеты вмешать) — температура 29-30 градусов. Не перегревать!\n4. Смешать шоколад и какао-масло (температура масла 35 градусов)\n5. При температуре 29 градусов смешать шоколад и глюкозу осторожными движениями, недолго!\n6. Убрать в холодильник на 15-20 минут, аккуратно вымешать, убрать ещё на 1-3 часа\n7. Перед работой достать за 30-40 минут\n\n✅ Хранить при комнатной температуре, плотно упакованным в плёнку. Цветы лучше делать непосредственно перед декорированием!\n✅ На фото — ювелирные весы и пирометр. Это необходимо купить!`,
        description: "Полный рецепт белого пластичного шоколада",
      },
    ],
  },
  {
    id: 15,
    title: "Цветы: Японская роза",
    description: "3 части — японская роза из пластичного шоколада",
    items: [
      {
        id: 22,
        title: "Японская роза (4 части)",
        type: "video-links",
        content: "",
        links: [
          { title: "Часть 1", url: "https://disk.yandex.ru/i/UPNJC52phxTh3A" },
          { title: "Часть 2", url: "https://disk.yandex.ru/i/W9ZBf-n49SQJMw" },
          { title: "Часть 3", url: "https://disk.yandex.ru/i/q_2Fd7MvbsQDNw" },
          { title: "Часть 4", url: "https://disk.yandex.ru/i/4lW7T0cwwbwDEw" },
        ],
        description: "Видео-урок: японская роза с пятью серединками. 4 части.",
      },
    ],
  },
  {
    id: 16,
    title: "Цветы: Большой фантазийный цветок",
    description: "3 части — большой фантазийный цветок",
    items: [
      {
        id: 23,
        title: "Большой фантазийный цветок (3 части)",
        type: "video-links",
        content: "",
        links: [
          { title: "Часть 1", url: "https://disk.yandex.ru/i/at0iWA3y4kexmg" },
          { title: "Часть 2", url: "https://disk.yandex.ru/i/AsbEs9bfeqfcTg" },
          { title: "Часть 3", url: "https://disk.yandex.ru/i/rQ-xeL5cvQE-Pg" },
        ],
        description: "Видео-урок: большой фантазийный цветок из пластичного шоколада. 3 части.",
      },
    ],
  },
  {
    id: 17,
    title: "Цветы: Быстрая роза",
    description: "3 части — быстрая роза из пластичного шоколада",
    items: [
      {
        id: 24,
        title: "Быстрая роза (3 части)",
        type: "video-links",
        content: "",
        links: [
          { title: "Часть 1", url: "https://disk.yandex.ru/i/kbuCEHDn8b6lAQ" },
          { title: "Часть 2", url: "https://disk.yandex.ru/i/9dMjPbw9U5TzZw" },
          { title: "Часть 3", url: "https://disk.yandex.ru/i/W2JTiQri69BXUQ" },
        ],
        description: "Видео-урок: быстрая роза из пластичного шоколада. 3 части.",
      },
    ],
  },
  {
    id: 18,
    title: "Крокус (бонус)",
    description: "Бонусный урок — крокусы из пластичного шоколада",
    items: [
      {
        id: 25,
        title: "Крокус — видео",
        type: "video-links",
        content: "",
        links: [
          { title: "Крокус (бонус)", url: "https://disk.yandex.ru/i/GLId8gtwfF4Lww" },
        ],
        description: "Бонусный видео-урок по лепке крокусов из пластичного шоколада.",
      },
    ],
  },
  {
    id: 19,
    title: "Рецепт велюра на финишный крем",
    description: "Рецепт и фото велюра",
    items: [
      {
        id: 26,
        title: "Рецепт велюра на финишный крем",
        type: "text",
        content: `Рецепт велюра на финишный крем 🎨\n\n❄️ Предварительно убрать торт в морозилку на 40-60 минут.\n\n📋 **Ингредиенты:**\n• 140 г шоколада (любого)\n• 80 г какао-масла\n• Краситель сухой жирорастворимый / диоксид\n\n🔹 **Приготовление:**\n\n1. В какао-масло добавить диоксид (если велюр будет белым или цветным, даже чёрным) и краситель по необходимости\n2. Растопить импульсно какао-масло в СВЧ\n3. Растопить в СВЧ импульсно шоколад, перемешивая\n4. Смешать шоколад и какао-масло, пробить блендером\n5. Работать при температуре 38-39 градусов\n\n🔹 **Нанесение:**\nНаносить на подмороженный торт, в три подхода, каждый раз убирая в морозилку на 30-40 секунд.\n\n⚠️ Велюр ложится только на замороженную поверхность!`,
        description: "Полный рецепт велюра на финишный крем",
      },
      {
        id: 27,
        title: "Фото: рецепт велюра",
        type: "photo",
        content: "/курс ваза/рецепт велюра.jpg",
        description: "Фото рецепта велюра на финишный крем.",
      },
    ],
  },
  {
    id: 20,
    title: "Крем на белом шоколаде — нюансы и лайфхак",
    description: "Нюансы крема и лайфхак по остаткам",
    items: [
      {
        id: 28,
        title: "Крем на белом шоколаде — нюансы 😎",
        type: "text",
        content: `Крем на белом шоколаде — Нюансы 😎\n\n🔹 Температура масла перед взбиванием — 23-24 градуса (комнатная)\n\n🔹 Температура какао-масла перед введением в шоколад — 36-40 градусов\n\n🔹 Температура шоколада перед введением какао-масла — 32-35 градусов; перед введением в масло — не более 35\n\n⚠️ Смотрите за тем, чтобы шоколад не охладился ниже температуры стабилизации — 29-30 градусов! Иначе будут комочки!\n\n💡 Лучше пусть будет около 33-34 градусов при смешивании с маслом!\n\n🔹 Температура сыра (стоит при комнатной ~30 мин) — 16-17 градусов. Не перегревайте.\n\n🔹 После чернового слоя крем в кондитерском мешке отправляется в холодильник на 40-60 минут. Потом — завершающее покрытие.`,
        description: "Важные нюансы приготовления крема на белом шоколаде",
      },
      {
        id: 29,
        title: "Лайфхак по остаткам крема 💥",
        type: "text",
        content: `Лайфхак по остаткам крема 💥\n\nМожно использовать как белый, так и тёмный крем!\n\n📋 **На пропорции финишного:**\n• 200 г шоколада\n• 10 г какао-масла\n• 5 г пудры\n• 200 г сыра\n\n✅ **Добавить:**\n• 300 г сыра\n• 150 г сливок\n• Пудру по вкусу\n\n😊 Получается очень вкусный крем для прослойки, шапочек и просто детям с бисквитом 😉`,
        description: "Лайфхак: что делать с остатками финишного крема",
      },
    ],
  },
  {
    id: 21,
    title: "Фото готовых работ",
    description: "Варианты готового торта-вазы",
    items: [
      {
        id: 30,
        title: "Вариант 1",
        type: "photo",
        content: "/курс ваза/варинаты готового торта ваза.jpg",
        description: "Вариант оформления готового торта-вазы.",
      },
      {
        id: 31,
        title: "Вариант 2",
        type: "photo",
        content: "/курс ваза/варинаты готового торта ваза 2.jpg",
        description: "Вариант оформления готового торта-вазы.",
      },
      {
        id: 32,
        title: "Вариант 3",
        type: "photo",
        content: "/курс ваза/варинаты готового торта ваза 3.jpg",
        description: "Вариант оформления готового торта-вазы.",
      },
      {
        id: 33,
        title: "Вариант 4",
        type: "photo",
        content: "/курс ваза/варинаты готового торта ваза 4.jpg",
        description: "Вариант оформления готового торта-вазы.",
      },
    ],
  },
];

// ==========================================
// Компонент страницы урока
// ==========================================

const VaseCourseLesson: React.FC = () => {
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

      if (/^[🔹📋💡⚠️💥✅🌊🎨❤️❄️😎😊😉]/.test(trimmed)) {
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
                Курс «Ваза с цветами» 💐
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

export default VaseCourseLesson;
