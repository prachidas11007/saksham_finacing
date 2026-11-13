import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type PreferencesContextValue = {
  simpleMode: boolean;
  largeText: boolean;
  setSimpleMode: (value: boolean) => void;
  setLargeText: (value: boolean) => void;
};

const PreferencesContext = createContext<PreferencesContextValue | null>(null);

export function PreferencesProvider({ children }: { children: ReactNode }) {
  const [simpleMode, setSimpleMode] = useState(false);
  const [largeText, setLargeText] = useState(false);

  const value = useMemo(
    () => ({ simpleMode, largeText, setSimpleMode, setLargeText }),
    [simpleMode, largeText],
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
