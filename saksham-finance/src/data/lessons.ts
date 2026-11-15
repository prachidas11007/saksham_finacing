import type { Ionicons } from "@expo/vector-icons";

export type LessonId =
  | "banking"
  | "savings"
  | "upi"
  | "fraud"
  | "borrowing"
  | "help";

export interface Lesson {
  id: LessonId;
  icon: keyof typeof Ionicons.glyphMap;
  keyPrefix: string;
}

export const LESSONS: Lesson[] = [
  {
    id: "banking",
    icon: "business-outline",
    keyPrefix: "lessons.banking",
  },
  {
    id: "savings",
    icon: "shield-checkmark-outline",
    keyPrefix: "lessons.savings",
  },
  {
    id: "upi",
    icon: "phone-portrait-outline",
    keyPrefix: "lessons.upi",
  },
  {
    id: "fraud",
    icon: "warning-outline",
    keyPrefix: "lessons.fraud",
  },
  {
    id: "borrowing",
    icon: "calculator-outline",
    keyPrefix: "lessons.borrowing",
  },
  {
    id: "help",
    icon: "help-buoy-outline",
    keyPrefix: "lessons.help",
  },
];

export function getLesson(id: string): Lesson | undefined {
  return LESSONS.find((lesson) => lesson.id === id);
}

