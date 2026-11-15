import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "./locales/en.json";
import hi from "./locales/hi.json";
import mr from "./locales/mr.json";

export const defaultNS = "translation";
export const resources = {
  en: { translation: en },
  hi: { translation: hi },
  mr: { translation: mr },
} as const;

void i18n.use(initReactI18next).init({
  resources,
  lng: "en",
  fallbackLng: "en",
  interpolation: {
    escapeValue: false,
  },
  react: {
    useSuspense: false,
  },
});

export function tList(key: string): string[] {
  const value = i18n.t(key, { returnObjects: true });
  if (Array.isArray(value)) {
    return value as string[];
  }
  if (__DEV__) {
    console.warn(`tList: translation key "${key}" did not return an array.`);
  }
  return [];
}

export default i18n;

