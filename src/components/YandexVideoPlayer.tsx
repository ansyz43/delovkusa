import React, { useState, useCallback, useEffect, useRef } from "react";
import { Play, ExternalLink, Loader2, AlertCircle } from "lucide-react";

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
    setLoading(true);

    try {
      let videoUrl: string;

      if (isMobile) {
        videoUrl = `/api/courses/video-proxy?url=${encodeURIComponent(url)}`;
      } else {
        const apiUrl = `https://cloud-api.yandex.net/v1/disk/public/resources/download?public_key=${encodeURIComponent(url)}`;
        const resp = await fetch(apiUrl);
        if (!resp.ok) throw new Error("Не удалось получить ссылку на видео");
        const data = await resp.json();
        if (!data.href) throw new Error("Скачивание запрещено владельцем файла");
        videoUrl = data.href.replace('disposition=attachment', 'disposition=inline');
      }

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
      }, 15000);
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

export default YandexVideoPlayer;
