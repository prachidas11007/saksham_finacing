import { Alert, Linking, StyleSheet, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { AppButton } from "../components/AppButton";
import { AppText } from "../components/AppText";
import { Banner } from "../components/Banner";
import { Card } from "../components/Card";
import { ExternalLinkButton } from "../components/ExternalLinkButton";
import { ScreenContainer } from "../components/ScreenContainer";
import { colors, fontSizes, radii, spacing } from "../constants/theme";
import {
  CYBER_HELPLINE,
  CYBER_HELPLINE_TEL,
  OFFICIAL_LINKS,
} from "../data/officialLinks";
import { tList } from "../i18n";

const STEP_KEYS = [
  "safety.stepBank",
  "safety.stepHelpline",
  "safety.stepPortal",
  "safety.stepKeepDetails",
  "safety.stepOfficialChannels",
  "safety.stepComplaint",
];

export default function SafetyHelpScreen() {
  const { t } = useTranslation();
  const preventItems = tList("safety.preventList");

  const handleCall = async () => {
    try {
      await Linking.openURL(CYBER_HELPLINE_TEL);
    } catch {
      Alert.alert(t("safety.callFailed", { number: CYBER_HELPLINE }));
    }
  };

  return (
    <ScreenContainer scroll>
      <View style={styles.container}>
        <Banner variant="danger" message={t("safety.banner")} />

        <Card style={styles.section}>
          <AppText variant="title">{t("safety.stepsTitle")}</AppText>
          <View style={styles.stepsList}>
            {STEP_KEYS.map((key, index) => (
              <View key={key} style={styles.stepItem}>
                <View style={styles.stepBadge}>
                  <AppText variant="caption" style={styles.stepBadgeText}>
                    {t("common.stepNumber", { number: index + 1 })}
                  </AppText>
                </View>
                <AppText variant="body" style={styles.stepBody}>
                  {t(key, { number: CYBER_HELPLINE })}
                </AppText>
              </View>
            ))}
          </View>
        </Card>

        <Card style={styles.section}>
          <AppText variant="title">{t("safety.preventTitle")}</AppText>
          <View style={styles.preventList}>
            {preventItems.map((item) => (
              <View key={item} style={styles.preventItem}>
                <Ionicons
                  name="close-circle"
                  size={fontSizes.title}
                  color={colors.danger}
                />
                <AppText variant="body" style={styles.preventBody}>
                  {item}
                </AppText>
              </View>
            ))}
          </View>
          <AppText variant="body" style={styles.neverAsk}>
            {t("safety.neverAsk")}
          </AppText>
        </Card>

        <AppButton
          variant="danger"
          icon="call"
          label={t("safety.callButton", { number: CYBER_HELPLINE })}
          onPress={handleCall}
          fullWidth
        />

        <View style={styles.linksSection}>
          <AppText variant="title">{t("safety.linksTitle")}</AppText>
          <ExternalLinkButton link={OFFICIAL_LINKS.cybercrime} />
          <ExternalLinkButton link={OFFICIAL_LINKS.rbiComplaints} />
          <ExternalLinkButton link={OFFICIAL_LINKS.rbiCms} />
          <ExternalLinkButton link={OFFICIAL_LINKS.npciFraud} />
        </View>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.md,
    paddingBottom: spacing.xxl,
  },
  section: {
    gap: spacing.sm,
  },
  stepsList: {
    gap: spacing.md,
  },
  stepItem: {
    gap: spacing.xs,
  },
  stepBadge: {
    alignSelf: "flex-start",
    backgroundColor: colors.background,
    borderColor: colors.border,
    borderRadius: radii.sm,
    borderWidth: 1,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  stepBadgeText: {
    color: colors.primary,
    fontWeight: "600",
  },
  stepBody: {
    color: colors.text,
  },
  preventList: {
    gap: spacing.sm,
  },
  preventItem: {
    alignItems: "flex-start",
    flexDirection: "row",
    gap: spacing.sm,
  },
  preventBody: {
    color: colors.text,
    flex: 1,
  },
  neverAsk: {
    color: colors.danger,
    fontWeight: "600",
  },
  linksSection: {
    gap: spacing.sm,
    marginTop: spacing.xs,
  },
});
