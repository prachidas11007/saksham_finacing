import { Alert, Linking, Pressable, StyleSheet, View, type StyleProp, type ViewStyle } from "react-native";
import NetInfo from "@react-native-community/netinfo";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { AppText } from "./AppText";
import { usePreferences } from "../context/PreferencesContext";
import { MIN_TOUCH_DP, SIMPLE_TOUCH_DP } from "../constants/limits";
import { colors, fontSizes, radii, spacing } from "../constants/theme";
import type { OfficialLink } from "../data/officialLinks";

type ExternalLinkButtonProps = {
  link: OfficialLink;
  style?: StyleProp<ViewStyle>;
};

export function ExternalLinkButton({ link, style }: ExternalLinkButtonProps) {
  const { t } = useTranslation();
  const { simpleMode } = usePreferences();
  const minHeight = simpleMode ? SIMPLE_TOUCH_DP : MIN_TOUCH_DP;

  const handlePress = async () => {
    try {
      const state = await NetInfo.fetch();
      const isOnline = Boolean(
        state.isConnected && state.isInternetReachable !== false
      );
      if (!isOnline) {
        Alert.alert(t("common.offlineLinkError"));
        return;
      }
      await Linking.openURL(link.url);
    } catch {
      Alert.alert(t("errors.generic"));
    }
  };

  const titleText = t(link.labelKey);
  const noticeText = t("common.externalLinkNotice");
  const reviewedText = t("common.lastReviewed", { date: link.lastReviewedAt });
  const a11yLabel = `${titleText}. ${noticeText}. ${reviewedText}`;

  return (
    <Pressable
      accessibilityRole="link"
      accessibilityLabel={a11yLabel}
      onPress={handlePress}
      style={({ pressed }) => [
        styles.button,
        { minHeight },
        pressed ? styles.pressed : null,
        style,
      ]}
    >
      <View style={styles.content}>
        <View style={styles.headerRow}>
          <AppText variant="body" style={styles.title}>
            {titleText}
          </AppText>
          <Ionicons
            name="open-outline"
            size={fontSizes.title}
            color={colors.primary}
          />
        </View>
        <AppText variant="caption" style={styles.notice}>
          {noticeText}
        </AppText>
        <AppText variant="caption" style={styles.reviewed}>
          {reviewedText}
        </AppText>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radii.md,
    borderWidth: 1,
    justifyContent: "center",
    padding: spacing.md,
  },
  content: {
    gap: spacing.xs,
  },
  headerRow: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  title: {
    color: colors.primary,
    flex: 1,
    fontWeight: "600",
  },
  notice: {
    color: colors.mutedText,
  },
  reviewed: {
    color: colors.mutedText,
  },
  pressed: {
    opacity: 0.85,
  },
});

