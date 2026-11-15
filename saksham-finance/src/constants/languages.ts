import type { AppLanguage } from "../data/types";

export interface LanguageOption {
  code: AppLanguage;
  name: string;
  englishName: string;
}

export const SUPPORTED_LANGUAGES: readonly LanguageOption[] = [
  { code: "en", name: "English", englishName: "English" },
  { code: "hi", name: "हिंदी", englishName: "Hindi" },
  { code: "mr", name: "मराठी", englishName: "Marathi" },
] as const;

