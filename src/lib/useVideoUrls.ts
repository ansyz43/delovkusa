import { useState, useEffect, useCallback } from "react";
import { apiFetch } from "./api";

/**
 * Fetches protected video URLs for a course from the backend.
 * Returns an array of URLs indexed by position (matching __VIDEO_N__ placeholders).
 */
export function useVideoUrls(courseId: string) {
  const [urls, setUrls] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchUrls = useCallback(async () => {
    try {
      const resp = await apiFetch(`/api/courses/${courseId}/videos`);
      if (resp.ok) {
        const data = await resp.json();
        setUrls(data.urls || []);
      }
    } catch {
      // ignore — URLs stay empty, videos won't play
    } finally {
      setLoading(false);
    }
  }, [courseId]);

  useEffect(() => {
    fetchUrls();
  }, [fetchUrls]);

  return { urls, loading };
}

/**
 * Replaces __VIDEO_N__ placeholders in courseModules with actual URLs.
 */
export function injectVideoUrls<T>(modules: T[], urls: string[]): T[] {
  if (!urls.length) return modules;

  return JSON.parse(
    JSON.stringify(modules).replace(/__VIDEO_(\d+)__/g, (_, idx) => {
      return urls[parseInt(idx)] || "";
    })
  );
}
