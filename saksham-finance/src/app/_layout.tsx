import { useEffect, useRef } from "react";
import { Alert, Platform } from "react-native";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useTranslation } from "react-i18next";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { colors } from "../constants/theme";
import { FinanceProvider } from "../context/FinanceContext";
import { PreferencesProvider, usePreferences } from "../context/PreferencesContext";
import "../i18n";

if (Platform.OS === "web") {
  Alert.alert = (title, message, buttons) => {
    if (!buttons || buttons.length === 0) {
      if (typeof globalThis.alert === "function") {
        globalThis.alert([title, message].filter(Boolean).join("\n\n"));
      }
      return;
    }
    const hasCancel = buttons.some((b) => b.style === "cancel");
    let confirmed = true;
    if (hasCancel && typeof globalThis.confirm === "function") {
      confirmed = globalThis.confirm(
        [title, message].filter(Boolean).join("\n\n")
      );
    } else if (typeof globalThis.alert === "function") {
      globalThis.alert([title, message].filter(Boolean).join("\n\n"));
    }
    if (confirmed) {
      const confirmBtn =
        buttons.find((b) => b.style !== "cancel") || buttons[0];
      confirmBtn?.onPress?.();
    } else {
      const cancelBtn = buttons.find((b) => b.style === "cancel");
      cancelBtn?.onPress?.();
    }
  };
}

SplashScreen.preventAutoHideAsync().catch((err: unknown) => {
  if (__DEV__) {
    console.warn("SplashScreen.preventAutoHideAsync error", err);
  }
});

function RootNavigator() {
  const { ready } = usePreferences();
  const { t } = useTranslation();
  const splashHiddenRef = useRef(false);

  useEffect(() => {
    if (ready && !splashHiddenRef.current) {
      splashHiddenRef.current = true;
      SplashScreen.hideAsync().catch((err: unknown) => {
        if (__DEV__) {
          console.warn("SplashScreen.hideAsync error", err);
        }
      });
    }
  }, [ready]);

  if (!ready) {
    return null;
  }

  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: colors.surface },
        headerTintColor: colors.text,
        headerTitleStyle: { fontWeight: "600" },
        headerBackTitle: t("common.back"),
      }}
    >
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="language" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="about" options={{ title: t("about.title") }} />
      <Stack.Screen name="access/[topic]" options={{ title: t("tabs.access") }} />
      <Stack.Screen name="safety-help" options={{ title: t("placeholders.safetyHelp.title") }} />
      <Stack.Screen name="calculator" options={{ title: t("placeholders.calculator.title") }} />
      <Stack.Screen name="lesson/[id]" options={{ title: t("tabs.learn") }} />
      <Stack.Screen name="quiz/[id]" options={{ title: t("quiz.title") }} />
      <Stack.Screen name="transaction/add" options={{ title: t("myMoney.addTitle") }} />
      <Stack.Screen name="budget/edit" options={{ title: t("myMoney.budgetEditTitle") }} />
      <Stack.Screen name="savings/create" options={{ title: t("myMoney.goalCreateTitle") }} />
      <Stack.Screen name="savings/[id]" options={{ title: t("myMoney.goalDetailTitle") }} />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <PreferencesProvider>
        <FinanceProvider>
          <RootNavigator />
        </FinanceProvider>
      </PreferencesProvider>
    </SafeAreaProvider>
  );
}
