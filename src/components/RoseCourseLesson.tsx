import React, { useState, useEffect, useCallback, useRef } from "react";
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
// Яндекс.Диск — встроенный видеоплеер через iframe
// ==========================================

const YandexVideoPlayer: React.FC<{ url: string; title: string }> = ({ url, title }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [started, setStarted] = useState(false);
  const [ready, setReady] = useState(false);
  const [fallback, setFallback] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    setLoading(false);
    setError(null);
    setStarted(false);
    setReady(false);
    setFallback(false);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.removeAttribute('src');
      videoRef.current.load();
    }
  }, [url]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (videoRef.current) {
        videoRef.current.pause();
        videoRef.current.removeAttribute('src');
        videoRef.current.load();
      }
    };
  }, []);

  const isMobile = typeof navigator !== 'undefined' && /Android|iPhone|iPad|iPod|Opera Mini|IEMobile/i.test(navigator.userAgent);

  const handlePlay = useCallback(async () => {
    setStarted(true);
    setError(null);
    setReady(false);
    setFallback(false);

    if (isMobile) {
      setLoading(false);
      setFallback(true);
      return;
    }

    setLoading(true);
    try {
      const apiUrl = `https://cloud-api.yandex.net/v1/disk/public/resources/download?public_key=${encodeURIComponent(url)}`;
      const resp = await fetch(apiUrl);
      if (!resp.ok) throw new Error("Не удалось получить ссылку на видео");
      const data = await resp.json();
      if (!data.href) throw new Error("Скачивание запрещено владельцем файла");

      const videoUrl = data.href.replace('disposition=attachment', 'disposition=inline');
      const video = videoRef.current;
      if (!video) return;

      const cleanup = () => {
        video.removeEventListener('canplay', onCanPlay);
        video.removeEventListener('error', onVideoError);
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
      };

      const onCanPlay = () => {
        cleanup();
        setReady(true);
        setLoading(false);
        video.play().catch(() => {});
      };

      const onVideoError = () => {
        cleanup();
        setLoading(false);
        setFallback(true);
      };

      video.addEventListener('canplay', onCanPlay, { once: true });
      video.addEventListener('error', onVideoError, { once: true });
      video.src = videoUrl;
      video.load();

      timeoutRef.current = setTimeout(() => {
        if (video.readyState < 2) {
          cleanup();
          video.removeAttribute('src');
          video.load();
          setLoading(false);
          setFallback(true);
        }
      }, 10000);
    } catch (e: any) {
      setError(e.message || "Ошибка загрузки видео");
      setLoading(false);
    }
  }, [url, isMobile]);

  return (
    <div className="relative bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl overflow-hidden">
      <video
        ref={videoRef}
        controls
        playsInline
        preload="none"
        className={`w-full aspect-video bg-black ${ready ? '' : 'hidden'}`}
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

      {fallback && (
        <div className="aspect-video flex flex-col items-center justify-center gap-4 p-6">
          <div className="w-16 h-16 rounded-full bg-pink-600/20 flex items-center justify-center">
            <Play className="w-8 h-8 text-pink-400" />
          </div>
          <p className="text-sm text-gray-300 text-center max-w-xs">
            Нажмите кнопку, чтобы посмотреть видео
          </p>
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 bg-pink-600 hover:bg-pink-500 text-white rounded-xl flex items-center gap-2 transition-colors font-medium shadow-lg"
          >
            <Play className="w-5 h-5" />
            Смотреть видео
          </a>
          <button
            onClick={handlePlay}
            className="text-xs text-gray-500 hover:text-gray-300 transition-colors mt-1"
          >
            Попробовать снова
          </button>
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
// Типы
// ==========================================

interface LessonItem {
  id: number;
  title: string;
  type: "video" | "text" | "photo" | "video-links";
  content: string; // URL для video/photo, текст для text, JSON для video-links
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

// ==========================================
// Данные курса «Лепестками роз»
// ==========================================

const courseModules: LessonModule[] = [
  {
    id: 1,
    title: "Введение в курс",
    description: "Вводный урок курса",
    items: [
      {
        id: 1,
        title: "Вводный урок",
        type: "video-links",
        content: "",
        links: [
          { title: "Вводный урок", url: "https://disk.yandex.ru/i/ScXLIiCgZbteUw" },
        ],
        description: "Вводный видео-урок курса по розам из пластичного шоколада. Обзор программы, материалов и техник.",
      },
    ],
  },
  {
    id: 2,
    title: "Рецепты пластичного шоколада",
    description: "Белый, тёмный, клубничный, руби — полные рецепты",
    items: [
      {
        id: 4,
        title: "Рецепт пластичного шоколада (видео)",
        type: "video-links",
        content: "",
        links: [
          { title: "Рецепт пластичного шоколада — видео", url: "https://disk.yandex.ru/i/XFKCxrpNLGuZuw" },
        ],
        description: "Видео-рецепт приготовления белого пластичного шоколада. Обязательно смотрим перед приготовлением!",
      },
      {
        id: 5,
        title: "Рецепт белого пластичного шоколада",
        type: "text",
        content: `Рецепт пластичного шоколада (перед приготовлением обязательно смотрим видео!)\n\n📋 **Ингредиенты:**\n• 300 г белого шоколада (Калебаут 25,9%)\n• 105-110 г сиропа глюкозы\n• 36 г какао-масла (Калебаут или Люкер)\n• 15 г сиропа (1/1 — сахар и вода до кипения и растворения сахара)\n\n🔹 **Приготовление:**\n\n1. Сварить сироп, добавить в горячем виде в глюкозу\n2. Растопить в СВЧ импульсно какао-масло\n3. Растопить импульсно в СВЧ шоколад (оставшиеся каллеты вмешать) — температура шоколада 29-30 градусов. Не перегревать!\n4. Смешать шоколад и какао-масло (температура масла 35 градусов)\n5. При температуре 29 градусов смешать шоколад и глюкозу осторожными движениями, недолго!\n6. Убрать в холодильник на 15-20 минут, аккуратно вымешать, убрать в холодильник ещё на 1-3 часа\n7. Перед работой достать из холодильника за 30-40 минут, оставить при комнатной температуре\n\n✅ **Хранение:** При комнатной температуре, плотно упакованным в плёнку. Срок хранения — как у шоколада, из которого сделан пластичный.\n\n✅ Цветы лучше делать непосредственно перед декорированием. Или хранить в герметичном контейнере, избегая попадания солнечных лучей!\n\n✅ На фото — ювелирные весы и пирометр. Это необходимо купить!`,
        description: "Полный рецепт белого пластичного шоколада с пошаговой инструкцией",
      },
      {
        id: 6,
        title: "Новые пропорции — шоколад ещё эластичнее!",
        type: "text",
        content: `Новые пропорции! Шоколад ещё эластичнее! 🥰\n\n📋 **На 300 г шоколада:**\n• Глюкоза: 125 г\n• Сироп: 18-20 г\n• Какао-масло: 45 г\n\n🔹 Метод тот же!\n\n⚠️ Только в холодильник после замеса минут на 15-20! Иначе сложно вымешивать!`,
        description: "Обновлённые пропорции для более эластичного пластичного шоколада",
      },
      {
        id: 7,
        title: "Видео-рецепт тёмного пластичного шоколада",
        type: "video-links",
        content: "",
        links: [
          { title: "Рецепт тёмного пластичного шоколада — видео", url: "https://disk.yandex.ru/i/fRvGbdGxq9CDQg" },
        ],
        description: "Видео-рецепт приготовления тёмного пластичного шоколада.",
      },
      {
        id: 8,
        title: "Рецепт тёмного пластичного шоколада",
        type: "text",
        content: `Рецепт тёмного пластичного шоколада\n\n📋 **Ингредиенты:**\n• 300 г тёмного шоколада 54% (Калебаут)\n• 175 г глюкозы\n• 15 г сиропа (1/1)\n• 36 г какао-масла (Люкер — берём качественное любое!)\n\n💥 Обязательно смотрим видео!\n\n🔹 **Приготовление:**\n\n1. Варим сироп, добавляем в глюкозу\n2. Топим импульсно шоколад вместе с какао-маслом (максимальная температура плавления 40 градусов!)\n3. При температуре (и шоколада, и глюкозы) около 36 градусов смешиваем шоколадную массу с глюкозной\n4. Убираем в холодильник на 20-30 минут, разминаем, убираем в холодильник на 1-2 часа\n5. Перед работой даём отлежаться после холодильника минут 40-60\n\n💥 Храним при комнатной температуре плотно упакованным в плёнку (не в пакет!) ❤️`,
        description: "Полный рецепт тёмного пластичного шоколада",
        images: ["/courses/roses/dark-choco.jpg"],
      },
      {
        id: 9,
        title: "Из клубничного шоколада",
        type: "text",
        content: `Пластичный шоколад из клубничного шоколада 🍓\n\n📋 **Рецепт как белый, но:**\n• Какао-масла берём на 5-6 г больше — 50-51 г на 300 г шоколада!\n• Остальное всё как обычно!\n\n⚠️ Осторожнее с температурой, не перегреваем! 😊`,
        description: "Особенности приготовления из клубничного шоколада",
        images: ["/courses/roses/strawberry-1.jpg", "/courses/roses/strawberry-2.jpg"],
      },
      {
        id: 10,
        title: "Из шоколада Руби",
        type: "text",
        content: `Пластичный шоколад из шоколада Руби 💎\n\nДелала по рецепту белого! Можно брать граммовку как на клубничный!\n\n🌹 Сама роза собрана 3/5 лепестков в рядах. То есть первый ряд три, потом пять, и так далее! Заканчиваем пятью.\n\n💡 Смотрим розу Нео на стебле — там листики и стебель с колючками.`,
        description: "Приготовление пластичного шоколада из Руби",
        images: ["/courses/roses/ruby-1.jpg", "/courses/roses/ruby-2.jpg"],
      },
      {
        id: 11,
        title: "Пищевой клей",
        type: "text",
        content: `Пищевой клей 🫧\n\nСМС — сухой порошок, продаётся в кондитерских магазинах.\n\n🔹 **Приготовление:**\nРазводим хорошей водой (не забывайте, что цветы должны быть полностью съедобны и безопасны!) в пропорции **1/30**.\n\nПросто заливаем порошок водой, даём настояться при комнатной температуре до прозрачности и состояния клея.\n\nПри загустении в дальнейшем добавляем воду, перемешиваем.\n\n❄️ **Хранить** в холодильнике около месяца. 😊`,
        description: "Рецепт пищевого клея для склейки лепестков роз",
      },
    ],
  },
  {
    id: 3,
    title: "Классическая роза",
    description: "4 части — техника создания классической розы",
    items: [
      {
        id: 12,
        title: "Классическая роза (4 части)",
        type: "video-links",
        content: "",
        links: [
          { title: "Часть 1", url: "https://disk.yandex.ru/i/DXy3VbwtRSGtqA" },
          { title: "Часть 2", url: "https://disk.yandex.ru/i/FCMtVB-r3zNbfg" },
          { title: "Часть 3", url: "https://disk.yandex.ru/i/Tizx87iqNQTsMw" },
          { title: "Часть 4", url: "https://disk.yandex.ru/i/zaM-Qp1wlM_IOw" },
        ],
        description: "Полный видео-урок по созданию классической розы из пластичного шоколада. 4 части.",
        images: ["/courses/roses/classic-rose.jpg"],
      },
      {
        id: 13,
        title: "Фото: Классическая роза",
        type: "photo",
        content: "/courses/roses/classic-rose.jpg",
        description: "Готовая классическая роза из пластичного шоколада.",
      },
    ],
  },
  {
    id: 4,
    title: "Классическая роза с двойной окраской",
    description: "2 части — техника двойной окраски лепестка",
    items: [
      {
        id: 14,
        title: "Классическая роза с двойной окраской (2 части)",
        type: "video-links",
        content: "",
        links: [
          { title: "Часть 1", url: "https://disk.yandex.ru/i/PvCTVFAyB26Avg" },
          { title: "Часть 2", url: "https://disk.yandex.ru/i/ozA_2gSLlnAB-w" },
        ],
        description: "Классическая роза с двойной окраской лепестка — красивый эффект градиента цвета.",
        images: ["/courses/roses/classic-double-color.jpg"],
      },
    ],
  },
  {
    id: 5,
    title: "Японская роза с пятью серединками",
    description: "4 части — необычная техника с пятью серединками",
    items: [
      {
        id: 15,
        title: "Японская роза с 5 серединками (4 части)",
        type: "video-links",
        content: "",
        links: [
          { title: "Часть 1", url: "https://disk.yandex.ru/i/UPNJC52phxTh3A" },
          { title: "Часть 2", url: "https://disk.yandex.ru/i/W9ZBf-n49SQJMw" },
          { title: "Часть 3", url: "https://disk.yandex.ru/i/q_2Fd7MvbsQDNw" },
          { title: "Часть 4", url: "https://disk.yandex.ru/i/4lW7T0cwwbwDEw" },
        ],
        description: "Видео-урок по созданию японской розы с пятью серединками. 4 части.",
        images: ["/courses/roses/japanese-5centers.jpg"],
      },
      {
        id: 16,
        title: "Фото: Японская роза с 5 серединками",
        type: "photo",
        content: "/courses/roses/japanese-5centers.jpg",
        description: "Готовая японская роза с пятью серединками.",
      },
    ],
  },
  {
    id: 6,
    title: "Японская роза с двойной окраской",
    description: "5 частей — двойная окраска лепестка в японском стиле",
    items: [
      {
        id: 17,
        title: "Японская роза с двойной окраской (5 частей)",
        type: "video-links",
        content: "",
        links: [
          { title: "Часть 1", url: "https://disk.yandex.ru/i/VBeNBxVHLIbn9g" },
          { title: "Часть 2", url: "https://disk.yandex.ru/i/uzXbl6EKu7-YrA" },
          { title: "Часть 3", url: "https://disk.yandex.ru/i/QTRw62qJVy9PGg" },
          { title: "Часть 4", url: "https://disk.yandex.ru/i/ef11F8AfiEmOWA" },
          { title: "Часть 5", url: "https://disk.yandex.ru/i/wmLGvRmKB6YW4A" },
        ],
        description: "Видео-урок: японская роза с двойной окраской лепестка. 5 частей.",
        images: ["/courses/roses/japanese-double-color.jpg"],
      },
      {
        id: 18,
        title: "Фото: Японская роза с двойной окраской",
        type: "photo",
        content: "/courses/roses/japanese-double-color.jpg",
        description: "Готовая японская роза с двойной окраской лепестка.",
      },
    ],
  },
  {
    id: 7,
    title: "Раскрытая махровая роза (японская)",
    description: "5 частей — раскрытая махровая роза в японском стиле",
    items: [
      {
        id: 19,
        title: "Раскрытая махровая роза (5 частей)",
        type: "video-links",
        content: "",
        links: [
          { title: "Часть 1", url: "https://disk.yandex.ru/i/XZjbMNVPsda54w" },
          { title: "Часть 2", url: "https://disk.yandex.ru/i/w1x3o-Rpu_xXiw" },
          { title: "Часть 3", url: "https://disk.yandex.ru/i/Pd9Z5OApV1pvDQ" },
          { title: "Часть 4", url: "https://disk.yandex.ru/i/jZZDk5u5RMvzPQ" },
          { title: "Часть 5", url: "https://disk.yandex.ru/i/aNEViM_h-G_seg" },
        ],
        description: "Видео-урок по созданию раскрытой махровой розы в японском стиле. 5 частей.",
        images: ["/courses/roses/japanese-open.jpg"],
      },
      {
        id: 20,
        title: "Фото: Раскрытая махровая роза",
        type: "photo",
        content: "/courses/roses/japanese-open.jpg",
        description: "Раскрытая махровая роза в японском стиле из пластичного шоколада.",
      },
    ],
  },
  {
    id: 8,
    title: "Роза в японском стиле с начинкой",
    description: "3 части — роза с начинкой внутри",
    items: [
      {
        id: 21,
        title: "Роза с начинкой (3 части)",
        type: "video-links",
        content: "",
        links: [
          { title: "Часть 1", url: "https://disk.yandex.ru/i/eiZ-34PjjSIg5w" },
          { title: "Часть 2", url: "https://disk.yandex.ru/i/FNubDxZ7w4idRA" },
          { title: "Часть 3", url: "https://disk.yandex.ru/i/TQIbnETn-MxxUg" },
        ],
        description: "Видео-урок: роза в японском стиле с начинкой внутри. 3 части.",
        images: ["/courses/roses/japanese-filled.jpg"],
      },
      {
        id: 22,
        title: "Фото: Роза с начинкой",
        type: "photo",
        content: "/courses/roses/japanese-filled.jpg",
        description: "Роза в японском стиле с начинкой из пластичного шоколада.",
      },
    ],
  },
  {
    id: 9,
    title: "Быстрые розы",
    description: "3 вида быстрых роз — первый, второй вариант и спиральная серединка",
    items: [
      {
        id: 23,
        title: "Быстрая роза — первый вариант (3 части)",
        type: "video-links",
        content: "",
        links: [
          { title: "Часть 1", url: "https://disk.yandex.ru/i/kbuCEHDn8b6lAQ" },
          { title: "Часть 2", url: "https://disk.yandex.ru/i/9dMjPbw9U5TzZw" },
          { title: "Часть 3", url: "https://disk.yandex.ru/i/W2JTiQri69BXUQ" },
        ],
        description: "Быстрая роза — первый вариант. 3 части.",
      },
      {
        id: 24,
        title: "Быстрая роза — второй вариант (3 части)",
        type: "video-links",
        content: "",
        links: [
          { title: "Часть 1", url: "https://disk.yandex.ru/i/FJLH8D6HKJbESw" },
          { title: "Часть 2", url: "https://disk.yandex.ru/i/H52ACKoW2mNPNg" },
          { title: "Часть 3", url: "https://disk.yandex.ru/i/rHQmkP33LxNrcQ" },
        ],
        description: "Быстрая роза — второй вариант. 3 части.",
        images: ["/courses/roses/fast-rose-v2.jpg", "/courses/roses/fast-rose-v2-parts.jpg"],
      },
      {
        id: 25,
        title: "Быстрая роза со спиральной серединкой (3 части)",
        type: "video-links",
        content: "",
        links: [
          { title: "Часть 1", url: "https://disk.yandex.ru/i/uYr8OTPFggInAw" },
          { title: "Часть 2", url: "https://disk.yandex.ru/i/qJ93gLO1Bvo90g" },
          { title: "Часть 3", url: "https://disk.yandex.ru/i/Wjq1y3-5btG9ww" },
        ],
        description: "Быстрая роза со спиральной серединкой. 3 части.",
      },
    ],
  },
  {
    id: 10,
    title: "Роза Мондиаль",
    description: "5 частей — элегантная роза Мондиаль",
    items: [
      {
        id: 26,
        title: "Роза Мондиаль (5 частей)",
        type: "video-links",
        content: "",
        links: [
          { title: "Часть 1", url: "https://disk.yandex.ru/i/LToevFMTp1aLKg" },
          { title: "Часть 2", url: "https://disk.yandex.ru/i/-Byj5aM_TShElw" },
          { title: "Часть 3", url: "https://disk.yandex.ru/i/E8dWM-aT03K1Zg" },
          { title: "Часть 4", url: "https://disk.yandex.ru/i/MBHvUSjx1FUBeA" },
          { title: "Часть 5", url: "https://disk.yandex.ru/i/l2u9m0UQgHozxQ" },
        ],
        description: "Полный видео-урок по созданию элегантной розы Мондиаль. 5 частей.",
        images: ["/courses/roses/mondial.jpg"],
      },
      {
        id: 27,
        title: "Фото: Роза Мондиаль",
        type: "photo",
        content: "/courses/roses/mondial.jpg",
        description: "Готовая роза Мондиаль из пластичного шоколада.",
      },
    ],
  },
  {
    id: 11,
    title: "Роза Остина раскрытая",
    description: "6 частей — пышная раскрытая роза Остина",
    items: [
      {
        id: 28,
        title: "Роза Остина раскрытая (6 частей)",
        type: "video-links",
        content: "",
        links: [
          { title: "Часть 1", url: "https://disk.yandex.ru/i/LE8QTIP1XeC1WA" },
          { title: "Часть 2", url: "https://disk.yandex.ru/i/0ihaoC_9iXYlNQ" },
          { title: "Часть 3", url: "https://disk.yandex.ru/i/k8Ptk4KgIJhJRA" },
          { title: "Часть 4", url: "https://disk.yandex.ru/i/a12mTPwUtdt2HQ" },
          { title: "Часть 5", url: "https://disk.yandex.ru/i/OJ1vZX_RUHKXOg" },
          { title: "Часть 6", url: "https://disk.yandex.ru/i/EdIN24xGEAQ08Q" },
        ],
        description: "Полный видео-урок по созданию раскрытой розы Остина. 6 частей.",
        images: ["/courses/roses/austin-open.jpg"],
      },
      {
        id: 29,
        title: "Фото: Роза Остина раскрытая",
        type: "photo",
        content: "/courses/roses/austin-open.jpg",
        description: "Пышная раскрытая роза Остина из пластичного шоколада.",
      },
    ],
  },
  {
    id: 12,
    title: "Роза Остина полузакрытая",
    description: "7 частей — полузакрытая роза Остина",
    items: [
      {
        id: 30,
        title: "Роза Остина полузакрытая (7 частей)",
        type: "video-links",
        content: "",
        links: [
          { title: "Часть 1", url: "https://disk.yandex.ru/i/pEcXX09yNEzujw" },
          { title: "Часть 2", url: "https://disk.yandex.ru/i/pPi5Hmk3R8ILAg" },
          { title: "Часть 3", url: "https://disk.yandex.ru/i/vpAGgYkFfwkojg" },
          { title: "Часть 4", url: "https://disk.yandex.ru/i/Fly9x8ehopt-sw" },
          { title: "Часть 5", url: "https://disk.yandex.ru/i/30xnoraqZV1fnA" },
          { title: "Часть 6", url: "https://disk.yandex.ru/i/AwEPepCHvAKUJQ" },
          { title: "Часть 7", url: "https://disk.yandex.ru/i/DQog_gyRxCsl-g" },
        ],
        description: "Полный видео-урок по созданию полузакрытой розы Остина. 7 частей.",
        images: ["/courses/roses/austin-half.jpg"],
      },
      {
        id: 31,
        title: "Фото: Роза Остина полузакрытая",
        type: "photo",
        content: "/courses/roses/austin-half.jpg",
        description: "Полузакрытая роза Остина из пластичного шоколада.",
      },
    ],
  },
  {
    id: 13,
    title: "Роза с острыми лепестками",
    description: "4 части — роза с окрашенными кончиками",
    items: [
      {
        id: 32,
        title: "Роза с острыми лепестками (4 части)",
        type: "video-links",
        content: "",
        links: [
          { title: "Часть 1", url: "https://disk.yandex.ru/i/bQCoD4Cdr_6XTg" },
          { title: "Часть 2", url: "https://disk.yandex.ru/i/Hv-3lluNHdOtzg" },
          { title: "Часть 3", url: "https://disk.yandex.ru/i/PZFsqDJUFb_exg" },
          { title: "Часть 4", url: "https://disk.yandex.ru/i/CwT_JDB713nRBQ" },
        ],
        description: "Видео-урок: роза с острыми лепестками и окрашенными кончиками. 4 части.",
        images: ["/courses/roses/sharp-petals.jpg"],
      },
      {
        id: 33,
        title: "Фото: Роза с острыми лепестками",
        type: "photo",
        content: "/courses/roses/sharp-petals.jpg",
        description: "Роза с острыми лепестками и окрашенными кончиками.",
      },
    ],
  },
  {
    id: 14,
    title: "Тройная махровая роза",
    description: "5 частей — эффектная тройная махровая роза",
    items: [
      {
        id: 34,
        title: "Тройная махровая роза (5 частей)",
        type: "video-links",
        content: "",
        links: [
          { title: "Часть 1", url: "https://disk.yandex.ru/i/v9CZyN-2P33zPA" },
          { title: "Часть 2", url: "https://disk.yandex.ru/i/lSapg9mMLOBv5Q" },
          { title: "Часть 3", url: "https://disk.yandex.ru/i/WXlyZElfQysMnQ" },
          { title: "Часть 4", url: "https://disk.yandex.ru/i/62qKa2kOpaLthA" },
          { title: "Часть 5", url: "https://disk.yandex.ru/i/rFHWJf19d90odQ" },
        ],
        description: "Видео-урок по созданию тройной махровой розы. 5 частей.",
        images: ["/courses/roses/triple-terry.jpg"],
      },
      {
        id: 35,
        title: "Фото: Тройная махровая роза",
        type: "photo",
        content: "/courses/roses/triple-terry.jpg",
        description: "Эффектная тройная махровая роза из пластичного шоколада.",
      },
    ],
  },
  {
    id: 15,
    title: "Роза Катана",
    description: "5 частей — три вида сборки розы Катана",
    items: [
      {
        id: 36,
        title: "Роза Катана — три вида сборки (5 частей)",
        type: "video-links",
        content: "",
        links: [
          { title: "Часть 1", url: "https://disk.yandex.ru/i/B7Qdw9x4h5fNPA" },
          { title: "Часть 2", url: "https://disk.yandex.ru/i/jrjoO9ZNpK4U5g" },
          { title: "Часть 3", url: "https://disk.yandex.ru/i/eWOQ3o4vr3b3dg" },
          { title: "Часть 4", url: "https://disk.yandex.ru/i/RSMdjz77lWe9IQ" },
          { title: "Часть 5", url: "https://disk.yandex.ru/i/l6-EF2FJX_yPkA" },
        ],
        description: "Видео-урок: роза Катана с тремя видами сборки. 5 частей.",
        images: ["/courses/roses/katana-1.jpg", "/courses/roses/katana-2.jpg"],
      },
      {
        id: 37,
        title: "Фото: Роза Катана",
        type: "photo",
        content: "/courses/roses/katana-1.jpg",
        description: "Роза Катана из пластичного шоколада.",
      },
    ],
  },
  {
    id: 16,
    title: "Фиалки",
    description: "5 частей — бонусный урок по фиалкам",
    items: [
      {
        id: 38,
        title: "Фиалки (5 частей)",
        type: "video-links",
        content: "",
        links: [
          { title: "Часть 1", url: "https://disk.yandex.ru/i/zcwXiY8hU-VCxQ" },
          { title: "Часть 2", url: "https://disk.yandex.ru/i/LFe9At92QOgqUw" },
          { title: "Часть 3", url: "https://disk.yandex.ru/i/YVERArObNfB4cA" },
          { title: "Часть 4", url: "https://disk.yandex.ru/i/jQcA2vRMkXSkoQ" },
          { title: "Часть 5", url: "https://disk.yandex.ru/i/GX-gi93U6mq3iQ" },
        ],
        description: "Бонусный урок по созданию фиалок из пластичного шоколада. 5 частей.",
        images: ["/courses/roses/violets.jpg"],
      },
      {
        id: 39,
        title: "Фото: Фиалки",
        type: "photo",
        content: "/courses/roses/violets.jpg",
        description: "Фиалки из пластичного шоколада — бонусный урок.",
      },
    ],
  },
  {
    id: 17,
    title: "🌱 Для новичков",
    description: "Инструменты, материалы и советы для начинающих",
    items: [
      {
        id: 2,
        title: "Инструменты и материалы",
        type: "text",
        content: `Для изготовления роз нам понадобятся — желание научиться 😉❤ и подобные моим инструменты:\n\n🔹 **Список инструментов:**\n\n1. Коврик для раскатки шоколада (можно работать на столе, без него)\n2. Мат цветочный (двусторонний)\n3. Скалочка (у меня пластиковая)\n4. Шарики цветочные (можно один — с большим диаметром и чуть меньше)\n5. Кисточки для клея и тонировки\n6. Вырубки разного размера лепестка роз, для быстрых роз пятилистники и любой лепесток с «махровым» кончиком (у меня лепесток пиона) для махровой японской розы\n7. Красители гелевые — на фото просто пример. Можете брать любой оттенок для самого цветка и зелени. Чёрный краситель — по желанию. Можно обойтись без него\n8. Пыльца для тонировки кончиков и листьев — подбираем под тон красителя\n9. Вырубки листьев или плунжеры\n10. Вайнер листа розы, если будете делать композицию с листьями\n11. Вырубка чашелистника розы — для бутона и розы на стебле\n12. Любой инструмент типа лопаточки для помощи при отделении лепестка от мата или стола\n13. Тейплента зелёного цвета (если будете делать розу на стебле)\n14. Шпажка — для стебля, по необходимости\n15. Ножнички — просто отрезать кусочек тейпленты\n16. Кукурузный крахмал в полотняном мешочке или марле (прикрахмаливать стол или коврик при раскатке)\n17. По желанию — мармелад в виде малинки (для серединки роз, но покажу обычную серединку из шоколада)\n18. Короткие шпажки или зубочистки — насаживать серединку при работе\n19. Кусочек пеноплекса или пенопласта — воткнуть шпажку с серединкой`,
        description: "Полный список инструментов и материалов для изготовления роз из пластичного шоколада",
        images: ["/courses/roses/tools-0.jpg", "/courses/roses/tools-1.jpg", "/courses/roses/tools-2.jpg", "/courses/roses/tools-3.jpg"],
      },
      {
        id: 3,
        title: "Фото инструментов",
        type: "photo",
        content: "/courses/roses/tools-0.jpg",
        description: "Инструменты для работы с пластичным шоколадом: коврик, мат, скалка, шарики, вырубки, красители и другое.",
      },
      {
        id: 42,
        title: "Советы для новичков — фото 1",
        type: "photo",
        content: "/courses/roses/beginners-0.jpg",
        description: "Полезные советы и визуальная подсказка для начинающих.",
      },
      {
        id: 43,
        title: "Советы для новичков — фото 2",
        type: "photo",
        content: "/courses/roses/beginners-1.jpg",
        description: "Визуальная подсказка для начинающих — формирование лепестков.",
      },
      {
        id: 44,
        title: "Советы для новичков — фото 3",
        type: "photo",
        content: "/courses/roses/beginners-2.jpg",
        description: "Визуальная подсказка — сборка розы.",
      },
      {
        id: 45,
        title: "Советы для новичков — фото 4",
        type: "photo",
        content: "/courses/roses/beginners-4.jpg",
        description: "Визуальная подсказка — окраска лепестков.",
      },
      {
        id: 46,
        title: "Советы для новичков — фото 5",
        type: "photo",
        content: "/courses/roses/beginners-5.jpg",
        description: "Визуальная подсказка — финальная сборка.",
      },
      {
        id: 47,
        title: "Советы для новичков — фото 6",
        type: "photo",
        content: "/courses/roses/beginners-6.jpg",
        description: "Визуальная подсказка — готовые композиции.",
      },
    ],
  },
  {
    id: 18,
    title: "Галерея работ",
    description: "Примеры готовых работ курса",
    items: [
      {
        id: 40,
        title: "Результат курса",
        type: "photo",
        content: "/courses/roses/result.jpg",
        description: "Фото результата — готовая композиция из шоколадных роз на торте.",
      },
      {
        id: 41,
        title: "Обложка курса",
        type: "photo",
        content: "/courses/roses/cover.jpg",
        description: "Обложка курса «Лепестками роз» — пример готовых работ.",
      },
    ],
  },
];

// ==========================================
// Компонент
// ==========================================

const RoseCourseLesson: React.FC = () => {
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

      if (/^\d+[\./]/.test(trimmed)) {
        return (
          <div key={i} className="flex gap-2 py-0.5 text-gray-600 pl-2">
            <span>{parts}</span>
          </div>
        );
      }

      if (/^[🔹📋💥⚠️✅❄️💡🌹💎🫧🍓🥰🤔❤️]/.test(trimmed)) {
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
          {/* Breadcrumb */}
          <Link
            to="/dashboard/courses"
            className="inline-flex items-center text-gray-500 hover:text-pink-600 mb-4 transition-colors text-sm"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Мои курсы
          </Link>

          {/* Title + progress */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl md:text-3xl font-display font-bold text-gray-800">
                🌹 Курс «Лепестками роз»
              </h1>
              <p className="text-gray-500 text-sm mt-1">
                {completedCount} из {totalItems} материалов изучено
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-48 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-pink-500 to-rose-500 rounded-full transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <span className="text-sm font-medium text-gray-600">{progress}%</span>
            </div>
          </div>

          {/* Main layout */}
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
                          <span className="flex-1 font-medium truncate">{mod.title}</span>
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

                {/* Video — встроенные Яндекс.Диск плееры */}
                {activeItem.type === "video-links" && activeItem.links && (
                  <div className="p-6 md:p-8">

                    {/* Фото к уроку — горизонтальный ряд над видео */}
                    {activeItem.images && activeItem.images.length > 0 && (
                      <div className="mb-6">
                        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin">
                          {activeItem.images.map((img, i) => (
                            <img
                              key={i}
                              src={img}
                              alt={`${activeItem.title} ${i + 1}`}
                              className="h-28 md:h-36 rounded-xl shadow-sm object-cover flex-shrink-0 cursor-pointer hover:shadow-md hover:scale-105 transition-all duration-200"
                              onClick={() => setLightboxOpen(true)}
                            />
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="mb-6">
                      <h3 className="text-lg font-semibold text-gray-800 mb-2 flex items-center gap-2">
                        <Video className="w-5 h-5 text-pink-500" />
                        Видео-уроки
                      </h3>
                      <p className="text-sm text-gray-500 mb-5">
                        {activeItem.links.length > 1
                          ? `${activeItem.links.length} видео. Нажмите на плеер для воспроизведения.`
                          : "Нажмите на плеер для воспроизведения."}
                      </p>
                      <div className="space-y-5">
                        {activeItem.links.map((link, i) => (
                          <div key={i}>
                            {activeItem.links!.length > 1 && (
                              <p className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                                <span className="w-6 h-6 bg-pink-100 text-pink-600 rounded-full flex items-center justify-center text-xs font-bold">
                                  {i + 1}
                                </span>
                                {link.title}
                              </p>
                            )}
                            <YandexVideoPlayer url={link.url} title={link.title} />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Photo */}
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

                {/* Text */}
                {activeItem.type === "text" && (
                  <div className="p-6 md:p-8">
                    <div className="prose prose-pink max-w-none mb-6">
                      {renderTextContent(activeItem.content)}
                    </div>

                    {/* Attached images for text */}
                    {activeItem.images && activeItem.images.length > 0 && (
                      <div className="mt-6 pt-6 border-t border-gray-100">
                        <h4 className="text-sm font-medium text-gray-500 mb-3">Фото к разделу:</h4>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                          {activeItem.images.map((img, i) => (
                            <img
                              key={i}
                              src={img}
                              alt={`${activeItem.title} ${i + 1}`}
                              className="w-full rounded-lg shadow-sm object-cover aspect-square"
                            />
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Item info bar */}
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

                  {/* Prev / Next */}
                  <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-100">
                    {prevItem ? (
                      <button
                        onClick={() => selectItem(prevItem)}
                        className="flex items-center gap-2 text-sm text-gray-500 hover:text-pink-600 transition-colors"
                      >
                        <ChevronLeft className="w-4 h-4" />
                        <span className="hidden sm:inline truncate max-w-[200px]">{prevItem.title}</span>
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
                        <span className="hidden sm:inline truncate max-w-[200px]">{nextItem.title}</span>
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

      {/* Photo Lightbox */}
      {lightboxOpen && (activeItem.type === "photo" || activeItem.images) && (
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
            src={activeItem.type === "photo" ? activeItem.content : (activeItem.images?.[0] || "")}
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

export default RoseCourseLesson;
