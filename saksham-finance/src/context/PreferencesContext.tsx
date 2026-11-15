import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { AppLanguage, Preferences } from "../data/types";
import i18n from "../i18n";
import { loadJSON, saveJSON, STORAGE_KEYS } from "../utils/storage";

export type PreferencesContextValue = {
  language: AppLanguage | null;
  simpleMode: boolean;
  largeText: boolean;
  ready: boolean;
  setLanguage: (value: AppLanguage | null) => void;
  setSimpleMode: (value: boolean) => void;
  setLargeText: (value: boolean) => void;
};

const DEFAULT_PREFERENCES: Preferences = {
  language: null,
  simpleMode: false,
  largeText: false,
};

export function isValidPreferences(data: unknown): boolean {
  if (!data || typeof data !== "object") {
    return false;
  }
  const candidate = data as Record<string, unknown>;
  const validLang =
    candidate.language === null ||
    candidate.language === "en" ||
    candidate.language === "hi" ||
    candidate.language === "mr";
  return (
    validLang &&
    typeof candidate.simpleMode === "boolean" &&
    typeof candidate.largeText === "boolean"
  );
}

const PreferencesContext = createContext<PreferencesContextValue | null>(null);

export function PreferencesProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<AppLanguage | null>(null);
  const [simpleMode, setSimpleMode] = useState(false);
  const [largeText, setLargeText] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let active = true;

    async function load() {
      const loaded = await loadJSON<Preferences>(
        STORAGE_KEYS.preferences,
        DEFAULT_PREFERENCES,
        isValidPreferences,
      );
      if (active) {
        setLanguage(loaded.language);
        setSimpleMode(loaded.simpleMode);
        setLargeText(loaded.largeText);
        setReady(true);
      }
    }

    void load();

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (language) {
      i18n.changeLanguage(language).catch((err: unknown) => {
        if (__DEV__) {
          console.warn("PreferencesContext: changeLanguage failed", err);
        }
      });
    }
  }, [language]);

  useEffect(() => {
    if (!ready) {
      return;
    }
    const current: Preferences = {
      language,
      simpleMode,
      largeText,
    };
    void saveJSON(STORAGE_KEYS.preferences, current);
  }, [language, simpleMode, largeText, ready]);

  const value = useMemo(
    () => ({
      language,
      simpleMode,
      largeText,
      ready,
      setLanguage,
      setSimpleMode,
      setLargeText,
    }),
    [language, simpleMode, largeText, ready],
  );

  return (
    <PreferencesContext.Provider value={value}>
      {children}
    </PreferencesContext.Provider>
  );
}

export function usePreferences(): PreferencesContextValue {
  const value = useContext(PreferencesContext);
  if (!value) {
    throw new Error("usePreferences must be used inside PreferencesProvider");
  }
  return value;
}
