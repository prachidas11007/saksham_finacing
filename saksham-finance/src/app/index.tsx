import { Redirect } from "expo-router";
import { usePreferences } from "../context/PreferencesContext";

export default function Index() {
  const { language } = usePreferences();

  if (!language) {
    return <Redirect href="/language" />;
  }

  return <Redirect href="/(tabs)/home" />;
}
