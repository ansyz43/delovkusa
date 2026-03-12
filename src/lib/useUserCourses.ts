import { useState, useEffect, useCallback } from "react";
import { apiFetch } from "./api";

/**
 * Hook to get list of course IDs the current user has purchased.
 * Returns empty array if not authenticated.
 */
export function useUserCourses() {
  const [courseIds, setCourseIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const refetch = useCallback(async () => {
    try {
      const resp = await apiFetch("/api/courses/my");
      if (resp.ok) {
        const data = await resp.json();
        setCourseIds(data.course_ids);
      } else {
        setCourseIds([]);
      }
    } catch {
      setCourseIds([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { courseIds, loading, refetch };
}
