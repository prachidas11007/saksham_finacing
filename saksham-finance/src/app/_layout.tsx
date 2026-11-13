import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { PreferencesProvider } from "../context/PreferencesContext";

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <PreferencesProvider>
        <Stack />
      </PreferencesProvider>
    </SafeAreaProvider>
  );
}
