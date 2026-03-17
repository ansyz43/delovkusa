export interface LessonItem {
  id: number;
  title: string;
  type: "video" | "text" | "photo" | "video-links";
  content: string;
  description: string;
  duration?: string;
  links?: { title: string; url: string }[];
  images?: string[];
}

export interface LessonModule {
  id: number;
  title: string;
  description: string;
  items: LessonItem[];
}
