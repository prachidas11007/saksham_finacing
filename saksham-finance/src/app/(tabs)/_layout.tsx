import { Tabs } from "expo-router";
import { useTranslation } from "react-i18next";
import { Ionicons } from "@expo/vector-icons";
import { fontSizes, colors } from "../../constants/theme";

export default function TabLayout() {
  const { t } = useTranslation();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.mutedText,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
        },
        tabBarLabelStyle: {
          fontSize: fontSizes.caption,
        },
        tabBarAllowFontScaling: true,
        tabBarItemStyle: {
          paddingHorizontal: 0,
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          tabBarLabel: t("tabs.home"),
          tabBarAccessibilityLabel: t("a11y.homeTab"),
          tabBarIcon: ({ color, size }) => (
            <Ionicons
              name="home"
              size={size}
              color={typeof color === "string" ? color : colors.primary}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="my-money"
        options={{
          tabBarLabel: t("tabs.myMoney"),
          tabBarAccessibilityLabel: t("a11y.myMoneyTab"),
          tabBarIcon: ({ color, size }) => (
            <Ionicons
              name="wallet"
              size={size}
              color={typeof color === "string" ? color : colors.primary}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="learn"
        options={{
          tabBarLabel: t("tabs.learn"),
          tabBarAccessibilityLabel: t("a11y.learnTab"),
          tabBarIcon: ({ color, size }) => (
            <Ionicons
              name="book"
              size={size}
              color={typeof color === "string" ? color : colors.primary}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="access"
        options={{
          tabBarLabel: t("tabs.access"),
          tabBarAccessibilityLabel: t("a11y.accessTab"),
          tabBarIcon: ({ color, size }) => (
            <Ionicons
              name="compass"
              size={size}
              color={typeof color === "string" ? color : colors.primary}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          tabBarLabel: t("tabs.profile"),
          tabBarAccessibilityLabel: t("a11y.profileTab"),
          tabBarIcon: ({ color, size }) => (
            <Ionicons
              name="person"
              size={size}
              color={typeof color === "string" ? color : colors.primary}
            />
          ),
        }}
      />
    </Tabs>
  );
}
