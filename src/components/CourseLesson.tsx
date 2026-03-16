import React, { useState, useCallback, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import Header from "./Header";
import { Button } from "./ui/button";
import {
  ArrowLeft,
  PlayCircle,
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
// Данные курса «Финишный крем»
// ==========================================

interface LessonItem {
  id: number;
  title: string;
  type: "video" | "text" | "photo" | "video-links";
  content: string; // URL для video/photo, текст для text, пусто для video-links
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
    title: "Финишный крем — рецепты",
    description: "Два рецепта покрытия на белом и тёмном шоколаде",
    items: [
      {
        id: 1,
        title: "Финишный крем на белом шоколаде",
        type: "video-links",
        content: "",
        links: [
          { title: "Финишный крем на белом шоколаде", url: "https://disk.yandex.ru/i/uEmRxd6sxQUEqw" },
        ],
        description:
          "Видео-рецепт приготовления финишного крема на белом шоколаде.",
        duration: "~5 мин",
      },
      {
        id: 2,
        title: "Рецепт крема на белом шоколаде",
        type: "text",
        content: `Финишный крем на белом шоколаде\n\n📋 **Ингредиенты:**\n• 500 г шоколада\n• 30 г какао-масла\n• 500 г творожного сыра\n• 120 г сливочного масла комнатной температуры\n• 10-20 г сахарной пудры\n\n🔹 **Пошаговое приготовление:**\n\n1. Достать сыр из холодильника за 20-30 минут до работы\n\n2. Растопить импульсно в СВЧ какао-масло, охладить до 36 градусов\n\n3. Растопить шоколад импульсно в СВЧ, постоянно перемешивая (не до конца — оставшиеся каллеты вмешать лопаткой, темперируя этим шоколад). Добавить какао-масло, перемешать. Оставить при комнатной температуре, пока взбивается масло.\n\n4. Взбить масло с пудрой до посветления и пышности\n\n5. Поменять венчик на «весло», влить шоколад в масло, перемешать несколько секунд на минимальной скорости, подбить лопаткой массу снизу вверх, снова перемешать на низкой скорости несколько секунд (масса должна стать однородной)\n\n6. Добавить сыр, так же на низкой скорости перемешать 10-15 секунд, подбить лопаткой, снова перемешать 10-15 секунд\n\n7. Недолго перемешать крем лопаткой, нанести на торт черновой слой палеткой, убрать торт в холодильник на 1 час. Крем хорошо перемешать лопаткой, переложить в кондитерский мешок, убрать в холодильник так же на час.\n\n💡 **Примечание:** Если торт для дома, если начинка плотная, если нет велюра и тяжёлого декора — в крем на белом шоколаде можно не добавлять какао-масло! Крем будет мягче 😉 Или снизить пропорции какао-масла наполовину.\n\nА сыр можно чуть прибавить — в пределах 100 грамм от количества шоколада 💥\n\nКоличество пудры зависит от вашего вкуса — можно чуть больше, но учитывайте, что пудра может разжижить крем!`,
        description: "Полный рецепт финишного крема на белом шоколаде с пошаговой инструкцией",
      },
      {
        id: 3,
        title: "Финишный крем на тёмном шоколаде",
        type: "video-links",
        content: "",
        links: [
          { title: "Финишный крем на тёмном шоколаде", url: "https://disk.yandex.ru/i/xMHFiFJGVmA1yw" },
        ],
        description:
          "Видео-рецепт финишного крема на тёмном шоколаде.",
        duration: "~15 мин",
      },
      {
        id: 4,
        title: "Рецепт крема на тёмном шоколаде",
        type: "text",
        content: `Финишный крем на тёмном шоколаде\n\n📋 **Ингредиенты:**\n• 500 г тёмного шоколада\n• 500 г творожного сыра\n• 120 г сливочного масла комнатной температуры\n• 10-20 г сахарной пудры\n\n🔹 **Пошаговое приготовление:**\n\n1. Достать сыр из холодильника за 20-30 минут до работы (если в помещении холодно, перенесите сыр в достаточно тёплую комнату — при смешивании холодного сыра и шоколада крем может стать очень плотным!)\n\n2. Растопить шоколад импульсно в СВЧ, постоянно перемешивая (не до конца — оставшиеся каллеты вмешать лопаткой). Шоколад охлаждается при комнатной температуре, пока взбивается масло. Если в помещении холодно, меньше 24 градусов, шоколад топим непосредственно перед добавлением в масло! И смешиваем при температуре около 35 градусов!\n\n3. Взбить масло с пудрой до посветления и пышности\n\n4. Поменять венчик на «весло», влить шоколад в масло, перемешать несколько секунд на минимальной скорости, подбить лопаткой массу снизу вверх, снова перемешать на низкой скорости несколько секунд (масса должна стать однородной)\n\n5. Добавить сыр, так же на низкой скорости перемешать 10-15 секунд, подбить лопаткой, снова перемешать 10-15 секунд\n\n6. Недолго перемешать крем лопаткой, нанести на торт черновой слой палеткой, убрать торт в холодильник на 15-20 минут, крем хорошо перемешать лопаткой и оставить при комнатной температуре.`,
        description: "Полный рецепт финишного крема на тёмном шоколаде с пошаговой инструкцией",
      },
      {
        id: 5,
        title: "Нюансы работы с кремом на белом шоколаде",
        type: "text",
        content: `Нюансы работы с кремом на белом шоколаде 😎\n\n🌡️ **Температурный режим:**\n\n• Температура масла перед взбиванием — 23-24 градуса (комнатная)\n• Температура какао-масла перед введением в шоколад — 36-40 градусов\n• Температура шоколада перед введением какао-масла — 32-35 градусов; перед введением в масло — не более 35\n\n⚠️ Смотрите за тем, чтобы шоколад не охладился ниже температуры стабилизации — 29-30 градусов! Иначе будут комочки!\n\n💡 Лучше пусть будет около 33-34 градусов при смешивании с маслом!\n\n• Температура сыра (стоит при комнатной около 30 минут) — 16-17 градусов. Не перегревайте, хотя в этом ничего страшного — просто крем будет изначально мягче.\n\n🔹 **После чернового слоя:**\nКрем в кондитерском мешке отправляется в холодильник на 40-60 минут. Потом следует завершающее покрытие.\n\n😱 **Одна из самых распространённых ошибок** — в креме образовались кусочки шоколада.\n\n🔹 **Причины:** шоколад остыл более положенного (меньше 31 градуса), из-за того, что холодно в помещении, холодное масло или сыр.\n\n🔹 **Как действовать?** Главное, без паники! 😉 Пишем мне, спасаем вместе! Или — аккуратно прогреваем крем на водяной бане и пробиваем блендером. Даём стабилизироваться минут 15, наносим черновой слой. Остальной крем в мешок, и действуем как обычно. 😉\n\n❤️ Не стесняемся! Пишем по всем вопросам!`,
        description: "Важные нюансы температурного режима и решение проблемы с комочками",
      },
      {
        id: 6,
        title: "Продукты для финишного крема",
        type: "photo",
        content: "/courses/finishing-cream/products.jpg",
        description:
          "Все продукты, необходимые для приготовления финишного крема.",
      },
    ],
  },
  {
    id: 2,
    title: "Стабильность и свойства крема",
    description: "Как добиться идеальной стабильности покрытия",
    items: [
      {
        id: 7,
        title: "Стабильность финишного крема",
        type: "text",
        content: `Что для Вас важнее в финишном покрытии — стабильность или вкус? 🤔\n\nА что выберут ваши заказчики, как думаете? 😉\n\nИногда я слышу — покрытие торта вообще не важно, в конце концов его можно и не есть... 🧐\n\n❌ В корне не согласна!\n\nЗа мою многолетнюю практику работы мне ни разу не встречались заказчики, которым было всё равно, чем покрыт торт!\n\n✅ **И я выбираю стабильность и вкус одновременно!**\n\nБольше семи лет работаю этим сырно-шоколадным кремом! 💥\n\nВсе торты, включая 3D, антигравитацию и ярусные, я покрываю этим вкуснейшим кремом! 😊 (подтверждено отзывами заказчиков и учениц)\n\n🔹 **Слой крема:**\n• Мои личные пропорции — слой крема в итоге около 8 мм\n• На ярусные торты — 1 см\n• Если у вас супер-стабильная начинка, можно сделать слой финиша поменьше`,
        description: "О стабильности и вкусе финишного крема — личный опыт",
      },
      {
        id: 8,
        title: "Расчёт пропорций в зависимости от диаметра бисквита",
        type: "text",
        content: `Расчёт пропорций в зависимости от диаметра бисквита 📐\n\nТорт на фото — бисквит 16 см, высота 13, итоговый 18/14 см. 😉 Подложка — 30 см.\n\nЯ пишу свои личные пропорции! 😊\n\n🔹 **Бисквит 16 см, высота торта 12-12,5 см (итог 18 диаметр / 13 высота):**\n• Шоколад: 400-450 г (с белым +15-20 какао-масло)\n• Сливочное масло: 90-100 г + 10-15 пудра\n• Сыр: 400-500 г\n\n🔹 **На те же параметры, высота 9-10 см и две прослойки:**\n• Шоколад: 300 г + 10-15 какао-масло\n• Масло: 80 г + 10 пудра\n• Сыр: 300-350 г\n\n🔹 **Бисквит 18 см, высота 12-14 см (итог 20 / 13-15):**\n• Шоколад: 500 г + 20-30 какао-масло\n• Масло: 120 г + 10-20 пудра\n• Сыр: 500-600 г\n\n🔹 **Бисквит 20 см, высота 12-14 (итог 22 / 13-15):**\n• Шоколад: 600 г + 30 какао-масло\n• Масло: 130 г + 20 пудра\n• Сыр: 600-650 г\n\n💡 **Далее подбирайте согласно пропорциям:** на 100 грамм сыра/шоколада добавляем около 10-20 грамм масла сливочного и 10 грамм какао-масла. Пудра по вкусу.\n\n🤔 **Почему «около...»?** Потому что даже при расхождении в данных пределах крем не становится хуже и работает так же! 😉😎 Но не отступайте от рецепта слишком далеко!`,
        description: "Подробная таблица пропорций крема для разных размеров бисквита",
      },
    ],
  },
  {
    id: 3,
    title: "Крем-дамба и начинка",
    description: "Крем на основе финишного для дамбы, шапочек капкейков и начинки",
    items: [
      {
        id: 9,
        title: "Крем-дамба для тортов",
        type: "text",
        content: `Что такое «дамба»? 🤔\n\nКак оказалось, есть совсем новички, которые не знают, что такое «дамба» — и это нормально! Я тоже не знала в своё время 😉\n\n🧱 **«Дамба»** — плотный крем, удерживающий нестабильную начинку внутри торта. Также она необходима для того, чтобы вы могли довезти торт до точки «икс» без эксцессов 😉 Да и выравнивать торт проще, когда есть дамба 😊\n\nВ виде кольца по краю бисквита её выдавливают из кондитерского мешка, как бы окружая ягодную или другую нежную начинку.\n\n📋 **Рецепт крем-дамбы (диаметр 16 см, три прослойки, высота 12-14 см):**\n\n• 140 г шоколада (для ванильных — белый, для шоколадных — тёмный, для остальных — смесь молочный/белый или молочный/тёмный, по вкусу) — растопить в СВЧ импульсно, не перегревая!\n• Взбить 75 г сливочного масла комнатной температуры с 30 г сахарной пудры добела\n• Влить растопленный шоколад (температура около 34 градусов, не выше!), перемешать миксером\n• Добавить 220 г сыра, взбить\n• Добавить 40 г сливок 33-35%, взбить недолго\n• Переложить в кондитерский мешок\n\n❄️ **Хранение до работы:**\n• Белый — убрать в холодильник\n• Тёмный — можно оставить при комнатной температуре минут на 20, если дольше — тоже убрать на холод, потом слегка помять руками через мешок перед работой\n\n🔹 **Пропорции на другие размеры:**\n\n• **18 см бисквита, три прослойки:** 160 г шоколад / 90 масло + 40 пудра / 300 сыр / 55 сливки\n• **20 см бисквита:** 180 / 110 + 45 / 380 / 65`,
        description: "Подробный рецепт крем-дамбы и пропорции для разных диаметров",
      },
    ],
  },
  {
    id: 4,
    title: "Велюр под крем",
    description: "Техника нанесения велюра под финишный крем",
    items: [
      {
        id: 10,
        title: "Велюр на финишный крем",
        type: "text",
        content: `Рецепт велюра на финишный крем 🎨\n\n❄️ Предварительно убрать торт в морозилку на 40-60 минут.\n\n📋 **Ингредиенты:**\n• 140 г шоколада (любого)\n• 80 г какао-масла\n• Краситель сухой жирорастворимый / диоксид\n\n🔹 **Приготовление:**\n\n1. В какао-масло добавить диоксид (если велюр будет белым или цветным, даже чёрным) и краситель по необходимости\n\n2. Растопить импульсно какао-масло в СВЧ\n\n3. Растопить в СВЧ импульсно шоколад (белый в течение 30 сек, этого достаточно, тёмный 30+15+15 сек), перемешивая\n\n4. Смешать шоколад и какао-масло, пробить блендером\n\n5. Работать при температуре 38-39 градусов (постепенно велюр будет охлаждаться, но этой температуры хватает на три слоя велюра)\n\n🔹 **Нанесение:**\nНаносить на подмороженный торт, в три подхода, каждый раз убирая в морозилку на 30-40 секунд.\n\n⚠️ **Важно:** Велюр ложится только на замороженную поверхность!`,
        description: "Полный рецепт велюра на финишный крем с пошаговой инструкцией",
      },
    ],
  },
  {
    id: 5,
    title: "Работа ручным миксером",
    description: "Как работать ручным миксером при приготовлении крема",
    items: [
      {
        id: 11,
        title: "Работа ручным миксером",
        type: "video-links",
        content: "",
        links: [
          { title: "Работа ручным миксером", url: "https://disk.yandex.ru/i/_h0ycCKTrnuXsw" },
        ],
        description:
          "Подробный видео-урок по технике работы ручным миксером при приготовлении финишного крема. Правильная скорость, движения и время взбивания.",
        duration: "~20 мин",
      },
    ],
  },
  {
    id: 6,
    title: "Выравнивание квадрата / параллелепипеда",
    description: "Видео-урок по выравниванию высокого параллелепипеда и квадрата",
    items: [
      {
        id: 12,
        title: "Ровняем квадрат",
        type: "video-links",
        content: "",
        links: [
          { title: "Равняем квадрат", url: "https://disk.yandex.ru/i/3uTKIBaLw-S7JQ" },
        ],
        description:
          "Видео-урок по выравниванию торта в форме высокого параллелепипеда/квадрата финишным кремом. Техника достижения идеально ровных граней и углов.",
        duration: "~20 мин",
      },
    ],
  },
  {
    id: 7,
    title: "Сборка двухъярусного торта",
    description: "Бонусный урок — устойчивая конструкция ярусного торта",
    items: [
      {
        id: 13,
        title: "Сборка двухъярусного торта — Часть 1",
        type: "video-links",
        content: "",
        links: [
          { title: "Сборка двухъярусного торта — Часть 1", url: "https://disk.yandex.ru/i/wx1D3lQ88e-bSw" },
        ],
        description:
          "Первая часть бонусного урока по сборке двухъярусного торта.",
        duration: "~4 мин",
      },
      {
        id: 14,
        title: "Сборка двухъярусного торта — Часть 2",
        type: "video-links",
        content: "",
        links: [
          { title: "Сборка двухъярусного торта — Часть 2", url: "https://disk.yandex.ru/i/KTIU6EQQxiu58w" },
        ],
        description:
          "Вторая часть бонусного урока — финальная сборка ярусного торта.",
        duration: "~10 мин",
      },
      {
        id: 15,
        title: "О сборке ярусных тортов",
        type: "text",
        content: `Сборка двухъярусного торта — Бонусный урок 🎂\n\nТо, как это делаю я. 😊😉🥰\n\nЭта система позволяет перевозить торты по нашим сопкам 😎\n\n🔹 **Пример с фото:**\n• Покрытие — крем на тёмном шоколаде\n• Бисквит 16 см диаметр, высота самого торта без горлышка — 14 см\n• На такой торт хватило крема: 350 г шоколада, 80 г масла, 350 г сыра\n\n💡 Делюсь тем, что помогает мне. Пишите по всем вопросам! 😉❤️`,
        description: "Описание техники сборки двухъярусного торта",
      },
    ],
  },
  {
    id: 8,
    title: "Лайфхак по остаткам крема",
    description: "Что делать с остатками финишного крема",
    items: [
      {
        id: 16,
        title: "Лайфхак по остаткам крема",
        type: "video-links",
        content: "",
        links: [
          { title: "Лайфхак по остаткам крема", url: "https://disk.yandex.ru/i/cWcw0cnWzGvVMw" },
        ],
        description:
          "Полезный лайфхак — как использовать остатки финишного крема.",
        duration: "~1 мин",
      },
      {
        id: 17,
        title: "Рецепт крема из остатков",
        type: "text",
        content: `Лайфхак по остаткам крема 😊\n\nМожно использовать как белый, так и тёмный крем!\n\n📋 **Рецепт:**\nНа пропорции финишного 200 шоколад / 10 какао-масло / 5 пудры / 200 сыр — добавила:\n• 300 г сыра\n• 150 г сливок\n• Пудру по вкусу\n\n🧁 Получается очень вкусный крем для прослойки, шапочек и просто детям с бисквитом! 😊\n\n❄️ **Хранение финишного крема:**\n• В холодильнике: до 5 дней в герметичной ёмкости\n• В морозилке: до 3 месяцев\n• Перед использованием: разморозить в холодильнике, затем слегка взбить миксером`,
        description: "Рецепт вкусного крема из остатков финишного",
      },
    ],
  },
  {
    id: 9,
    title: "Итоговые результаты",
    description: "Фотографии готовых тортов, покрытых финишным кремом",
    items: [
      {
        id: 18,
        title: "Итоговый торт — вариант 1",
        type: "photo",
        content: "/courses/finishing-cream/result-1.jpg",
        description: "Бисквит 16 см диаметр, высота 14 см. Покрытие — крем на тёмном шоколаде. Крем: 350 г шоколада, 80 г масла, 350 г сыра.",
      },
      {
        id: 19,
        title: "Итоговый торт — вариант 2",
        type: "photo",
        content: "/courses/finishing-cream/result-2.jpg",
        description: "Пример великолепного результата. Финишный крем позволяет добиться профессиональной отделки.",
      },
      {
        id: 20,
        title: "Фото из курса",
        type: "photo",
        content: "/courses/finishing-cream/course-photo.jpg",
        description: "Фото из процесса обучения на курсе «Финишный крем».",
      },
    ],
  },
];

// ==========================================
// Компонент
// ==========================================

const CourseLesson: React.FC = () => {
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

  // Navigate to next/prev item
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

  // Parse markdown-ish text to HTML-like
  const renderTextContent = (text: string) => {
    return text.split("\n").map((line, i) => {
      const trimmed = line.trim();
      if (!trimmed) return <div key={i} className="h-3" />;

      // bold **text**
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

      // Table row
      if (trimmed.startsWith("|") && trimmed.endsWith("|")) {
        const cells = trimmed
          .split("|")
          .filter((c) => c.trim())
          .map((c) => c.trim());
        if (cells.every((c) => /^[-]+$/.test(c))) return null; // separator row
        const isHeader = i > 0 && text.split("\n")[i + 1]?.trim().startsWith("|---");
        return (
          <div key={i} className={`grid grid-cols-3 gap-2 py-1 px-2 text-sm ${isHeader ? "font-semibold bg-pink-50 rounded-lg" : "border-b border-gray-100"}`}>
            {cells.map((cell, ci) => (
              <span key={ci}>{cell}</span>
            ))}
          </div>
        );
      }

      // Bullet
      if (trimmed.startsWith("•")) {
        return (
          <div key={i} className="flex gap-2 py-0.5 text-gray-600">
            <span className="text-pink-400 mt-0.5">•</span>
            <span>{parts}</span>
          </div>
        );
      }

      // Numbered
      if (/^\d+\./.test(trimmed)) {
        return (
          <div key={i} className="flex gap-2 py-0.5 text-gray-600 pl-2">
            <span>{parts}</span>
          </div>
        );
      }

      // Emoji heading
      if (/^[🔹📐💡⚠️🧱🎨🧁🍰♻️❄️✨]/.test(trimmed)) {
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
                Курс «Финишный крем»
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

          {/* Main layout: sidebar + content */}
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Sidebar — module list */}
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
                        {/* Module header */}
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

                        {/* Module items */}
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
                {/* Video */}
                {activeItem.type === "video" && (
                  <div className="relative bg-black aspect-video">
                    <video
                      key={activeItem.content}
                      controls
                      playsInline
                      className="w-full h-full"
                      poster=""
                      preload="metadata"
                    >
                      <source src={activeItem.content} type="video/mp4" />
                      Ваш браузер не поддерживает видео.
                    </video>
                  </div>
                )}

                {/* Video Links (Yandex Disk) */}
                {activeItem.type === "video-links" && activeItem.links && (
                  <div className="p-4 md:p-6 space-y-4">
                    {activeItem.links.map((link, idx) => (
                      <YandexVideoPlayer key={link.url} url={link.url} title={link.title} />
                    ))}
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
                    <div className="prose prose-pink max-w-none">
                      {renderTextContent(activeItem.content)}
                    </div>
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

                  {/* Prev / Next navigation */}
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

      {/* Photo Lightbox */}
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

export default CourseLesson;
