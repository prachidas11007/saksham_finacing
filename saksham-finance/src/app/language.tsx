import { Pressable, StyleSheet, View } from "react-native";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { AppText } from "../components/AppText";
import { ScreenContainer } from "../components/ScreenContainer";
import { MIN_TOUCH_DP, SIMPLE_TOUCH_DP } from "../constants/limits";
import { SUPPORTED_LANGUAGES, type LanguageOption } from "../constants/languages";
import { colors, radii, spacing } from "../constants/theme";
import { usePreferences } from "../context/PreferencesContext";
import type { AppLanguage } from "../data/types";

export default function LanguageScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { simpleMode, setLanguage } = usePreferences();

  const minCardHeight = simpleMode ? SIMPLE_TOUCH_DP * 1.5 : MIN_TOUCH_DP * 1.5;

  const handleSelectLanguage = (code: AppLanguage) => {
    setLanguage(code);
    router.replace("/(tabs)/home");
  };

  return (
    <ScreenContainer scroll>
      <View style={styles.header}>
        <AppText variant="heading">{t("languages.title")}</AppText>
        <AppText variant="body" style={styles.subtitle}>
          {t("languages.subtitle")}
        </AppText>
      </View>
      <View style={styles.list}>
        {SUPPORTED_LANGUAGES.map((item: LanguageOption) => (
          <Pressable
            key={item.code}
            accessibilityRole="button"
            accessibilityLabel={t(`languages.${item.code}`)}
            onPress={() => handleSelectLanguage(item.code)}
            style={({ pressed }) => [
              styles.card,
              { minHeight: minCardHeight },
              pressed ? styles.pressed : null,
            ]}
          >
            <AppText variant="heading" style={styles.nativeName}>
              {item.name}
            </AppText>
            <AppText variant="body" style={styles.englishName}>
              {item.englishName}
            </AppText>
          </Pressable>
        ))}
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: {
    gap: spacing.xs,
    marginBottom: spacing.lg,
  },
  subtitle: {
    color: colors.mutedText,
  },
  list: {
    gap: spacing.md,
  },
  card: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radii.lg,
    borderWidth: 1,
    justifyContent: "center",
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  pressed: {
    borderColor: colors.primary,
    opacity: 0.85,
  },
  nativeName: {
    color: colors.text,
  },
  englishName: {
    color: colors.mutedText,
    marginTop: spacing.xs,
  },
});

