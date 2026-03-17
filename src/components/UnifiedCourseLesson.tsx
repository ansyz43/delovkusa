import React, { useState, useRef, useMemo } from "react";
import { Link } from "react-router-dom";
import Header from "./Header";
import YandexVideoPlayer from "./YandexVideoPlayer";
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
} from "lucide-react";
import { useVideoUrls, injectVideoUrls } from "../lib/useVideoUrls";
import type { LessonItem, LessonModule } from "../types/lesson";

interface UnifiedCourseLessonProps {
  courseId: string;
  title: string;
  modules: LessonModule[];
}

const UnifiedCourseLesson: React.FC<UnifiedCourseLessonProps> = ({
  courseId,
  title,
  modules: rawModules,
}) => {
  const { urls: videoUrls } = useVideoUrls(courseId);
  const modules = useMemo(
    () => injectVideoUrls(rawModules, videoUrls),
    [rawModules, videoUrls],
  );

  const [openModuleId, setOpenModuleId] = useState<number>(rawModules[0]?.id ?? 1);
  const [activeItem, setActiveItem] = useState<LessonItem>(rawModules[0]?.items[0]);
  const [completedItems, setCompletedItems] = useState<Set<number>>(new Set());
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [contentKey, setContentKey] = useState(0);
  const contentRef = useRef<HTMLDivElement>(null);

  const totalItems = modules.reduce((sum, m) => sum + m.items.length, 0);
  const completedCount = completedItems.size;
  const progress = totalItems > 0 ? Math.round((completedCount / totalItems) * 100) : 0;

  const toggleModule = (id: number) => {
    setOpenModuleId(openModuleId === id ? -1 : id);
  };

  const selectItem = (item: LessonItem) => {
    if (contentRef.current) {
      contentRef.current.querySelectorAll("video").forEach((v) => {
        v.pause();
        v.removeAttribute("src");
        v.load();
      });
    }
    setActiveItem(item);
    setContentKey((k) => k + 1);
    const mod = modules.find((m) => m.items.some((i) => i.id === item.id));
    if (mod) setOpenModuleId(mod.id);
    setTimeout(() => {
      contentRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
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

  const allItems = modules.flatMap((m) => m.items);
  const currentIdx = allItems.findIndex((i) => i.id === activeItem.id);
  const prevItem = currentIdx > 0 ? allItems[currentIdx - 1] : null;
  const nextItem =
    currentIdx < allItems.length - 1 ? allItems[currentIdx + 1] : null;

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

      if (trimmed.startsWith("|") && trimmed.endsWith("|")) {
        const cells = trimmed
          .split("|")
          .filter((c) => c.trim())
          .map((c) => c.trim());
        if (cells.every((c) => /^[-]+$/.test(c))) return null;
        const isHeader =
          i > 0 && text.split("\n")[i + 1]?.trim().startsWith("|---");
        return (
          <div
            key={i}
            className={`grid grid-cols-3 gap-2 py-1 px-2 text-sm ${isHeader ? "font-semibold bg-pink-50 rounded-lg" : "border-b border-gray-100"}`}
          >
            {cells.map((cell, ci) => (
              <span key={ci}>{cell}</span>
            ))}
          </div>
        );
      }

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

      // Emoji heading — match any emoji at start of line
      if (/^[\p{Emoji_Presentation}\p{Extended_Pictographic}]/u.test(trimmed)) {
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
                {title}
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
              <span className="text-sm font-medium text-gray-600">
                {progress}%
              </span>
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
                  {modules.map((mod) => {
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
              <div
                key={contentKey}
                className="bg-white rounded-2xl shadow-md overflow-hidden"
              >
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

                {activeItem.type === "video-links" && activeItem.links && (
                  <div className="p-4 md:p-6 space-y-4">
                    {activeItem.links.map((link) => (
                      <YandexVideoPlayer
                        key={link.url}
                        url={link.url}
                        title={link.title}
                      />
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
                      variant={
                        completedItems.has(activeItem.id) ? "outline" : "default"
                      }
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
                        <span className="hidden sm:inline">
                          {prevItem.title}
                        </span>
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
                        <span className="hidden sm:inline">
                          {nextItem.title}
                        </span>
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

export default UnifiedCourseLesson;
