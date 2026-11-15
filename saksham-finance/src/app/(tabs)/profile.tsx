import { Alert, Pressable, StyleSheet, Switch, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { AppButton } from "../../components/AppButton";
import { AppText } from "../../components/AppText";
import { Card } from "../../components/Card";
import { ScreenContainer } from "../../components/ScreenContainer";
import { SUPPORTED_LANGUAGES } from "../../constants/languages";
import { MIN_TOUCH_DP, SIMPLE_TOUCH_DP } from "../../constants/limits";
import { colors, fontSizes, radii, spacing } from "../../constants/theme";
import { useFinance } from "../../context/FinanceContext";
import { usePreferences } from "../../context/PreferencesContext";

export default function ProfileScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const {
    language,
    simpleMode,
    largeText,
    setLanguage,
    setSimpleMode,
    setLargeText,
  } = usePreferences();
  const { resetDemoData, loadDemoData } = useFinance();
  const minTouchHeight = simpleMode ? SIMPLE_TOUCH_DP : MIN_TOUCH_DP;

  const confirmLoadDemo = () => {
    Alert.alert(
      t("profile.loadDemoDialogTitle"),
      t("profile.loadDemoDialogMessage"),
      [
        {
          text: t("common.cancel"),
          style: "cancel",
        },
        {
          text: t("profile.loadDemoConfirm"),
          onPress: () => {
            loadDemoData()
              .then(() => {
                Alert.alert(
                  t("profile.loadDemoSuccessTitle"),
                  t("profile.loadDemoSuccessMessage"),
                );
              })
              .catch(() => {
                Alert.alert(t("errors.generic"));
              });
          },
        },
      ],
    );
  };

  const confirmReset = () => {
    Alert.alert(t("profile.resetDialogTitle"), t("profile.resetDialogMessage"), [
      {
        text: t("common.cancel"),
        style: "cancel",
      },
      {
        text: t("profile.resetConfirm"),
        style: "destructive",
        onPress: () => {
          resetDemoData()
            .then(() => {
              Alert.alert(
                t("profile.resetSuccessTitle"),
                t("profile.resetSuccessMessage"),
              );
            })
            .catch(() => {
              Alert.alert(t("errors.generic"));
            });
        },
      },
    ]);
  };

  return (
    <ScreenContainer scroll>
      <View style={styles.container}>
        <AppText variant="heading">{t("tabs.profile")}</AppText>

        <Card style={styles.section}>
          <AppText variant="title">{t("profile.language")}</AppText>
          <AppText variant="caption" style={styles.help}>
            {t("profile.languageHelp")}
          </AppText>
          <View style={styles.languageList}>
            {SUPPORTED_LANGUAGES.map((item) => {
              const isCurrent = language === item.code;
              return (
                <Pressable
                  key={item.code}
                  accessibilityRole="radio"
                  accessibilityState={{ selected: isCurrent }}
                  accessibilityLabel={t(`languages.${item.code}`)}
                  onPress={() => setLanguage(item.code)}
                  style={({ pressed }) => [
                    styles.languageOption,
                    { minHeight: minTouchHeight },
                    isCurrent ? styles.languageOptionCurrent : null,
                    pressed ? styles.pressed : null,
                  ]}
                >
                  <AppText variant="body">
                    {t(`languages.${item.code}`)}
                  </AppText>
                  {isCurrent ? (
                    <View style={styles.currentBadge}>
                      <Ionicons
                        name="checkmark-circle"
                        size={fontSizes.title}
                        color={colors.success}
                      />
                      <AppText variant="caption" style={styles.currentText}>
                        {t("profile.currentLanguage")}
                      </AppText>
                    </View>
                  ) : null}
                </Pressable>
              );
            })}
          </View>
        </Card>

        <Card style={styles.section}>
          <AppText variant="title">{t("profile.display")}</AppText>
          <View style={[styles.switchRow, { minHeight: minTouchHeight }]}>
            <View style={styles.switchLabels}>
              <AppText variant="body">{t("profile.simpleMode")}</AppText>
              <AppText variant="caption" style={styles.help}>
                {t("profile.simpleModeHelp")}
              </AppText>
            </View>
            <Switch
              accessibilityLabel={t("profile.simpleMode")}
              accessibilityHint={t("profile.simpleModeHelp")}
              value={simpleMode}
              onValueChange={setSimpleMode}
              trackColor={{ false: colors.border, true: colors.primary }}
            />
          </View>
          <View style={[styles.switchRow, { minHeight: minTouchHeight }]}>
            <View style={styles.switchLabels}>
              <AppText variant="body">{t("profile.largeText")}</AppText>
              <AppText variant="caption" style={styles.help}>
                {t("profile.largeTextHelp")}
              </AppText>
            </View>
            <Switch
              accessibilityLabel={t("profile.largeText")}
              accessibilityHint={t("profile.largeTextHelp")}
              value={largeText}
              onValueChange={setLargeText}
              trackColor={{ false: colors.border, true: colors.primary }}
            />
          </View>
        </Card>

        <Pressable
          accessibilityRole="link"
          accessibilityLabel={t("profile.about")}
          onPress={() => router.push("/about")}
          style={({ pressed }) => [
            styles.linkRow,
            { minHeight: minTouchHeight },
            pressed ? styles.pressed : null,
          ]}
        >
          <Ionicons
            name="information-circle"
            size={fontSizes.title}
            color={colors.primary}
          />
          <View style={styles.linkLabels}>
            <AppText variant="body">{t("profile.about")}</AppText>
            <AppText variant="caption" style={styles.help}>
              {t("profile.aboutHelp")}
            </AppText>
          </View>
          <Ionicons
            name="chevron-forward"
            size={fontSizes.title}
            color={colors.mutedText}
          />
        </Pressable>

        <Pressable
          accessibilityRole="link"
          accessibilityLabel={t("placeholders.safetyHelp.title")}
          onPress={() => router.push("/safety-help")}
          style={({ pressed }) => [
            styles.linkRow,
            { minHeight: minTouchHeight },
            pressed ? styles.pressed : null,
          ]}
        >
          <Ionicons
            name="shield-checkmark"
            size={fontSizes.title}
            color={colors.primary}
          />
          <View style={styles.linkLabels}>
            <AppText variant="body">
              {t("placeholders.safetyHelp.title")}
            </AppText>
            <AppText variant="caption" style={styles.help}>
              {t("safety.profileHelp")}
            </AppText>
          </View>
          <Ionicons
            name="chevron-forward"
            size={fontSizes.title}
            color={colors.mutedText}
          />
        </Pressable>

        <Card style={styles.section}>
          <View style={styles.demoTitleRow}>
            <AppText variant="title">{t("profile.demoSectionTitle")}</AppText>
            <View style={styles.demoBadge}>
              <AppText variant="caption" style={styles.demoBadgeText}>
                {t("profile.demoBadge")}
              </AppText>
            </View>
          </View>
          <AppText variant="caption" style={styles.help}>
            {t("profile.loadDemoHelp")}
          </AppText>
          <AppButton
            label={t("profile.loadDemo")}
            variant="secondary"
            icon="download-outline"
            fullWidth
            onPress={confirmLoadDemo}
          />
          <View style={styles.demoDivider} />
          <AppText variant="caption" style={styles.help}>
            {t("profile.resetHelp")}
          </AppText>
          <AppButton
            label={t("profile.reset")}
            variant="danger"
            icon="trash"
            fullWidth
            onPress={confirmReset}
          />
        </Card>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.md,
  },
  section: {
    gap: spacing.sm,
  },
  demoTitleRow: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  demoBadge: {
    backgroundColor: colors.background,
    borderColor: colors.border,
    borderRadius: radii.sm,
    borderWidth: 1,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  demoBadgeText: {
    color: colors.mutedText,
  },
  demoDivider: {
    backgroundColor: colors.border,
    height: 1,
    marginVertical: spacing.sm,
  },
  help: {
    color: colors.mutedText,
  },
  languageList: {
    gap: spacing.sm,
  },
  languageOption: {
    alignItems: "center",
    borderColor: colors.border,
    borderRadius: radii.md,
    borderWidth: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    minHeight: MIN_TOUCH_DP,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  languageOptionCurrent: {
    borderColor: colors.primary,
  },
  currentBadge: {
    alignItems: "center",
    flexDirection: "row",
    gap: spacing.xs,
  },
  currentText: {
    color: colors.mutedText,
  },
  switchRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: spacing.md,
    minHeight: MIN_TOUCH_DP,
  },
  switchLabels: {
    flex: 1,
    gap: spacing.xs,
  },
  linkRow: {
    alignItems: "center",
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radii.lg,
    borderWidth: 1,
    flexDirection: "row",
    gap: spacing.sm,
    minHeight: MIN_TOUCH_DP,
    padding: spacing.md,
  },
  linkLabels: {
    flex: 1,
    gap: spacing.xs,
  },
  pressed: {
    opacity: 0.85,
  },
});
