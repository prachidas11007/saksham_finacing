import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, View, type StyleProp, type ViewStyle } from "react-native";
import { AppText } from "./AppText";
import { colors, fontSizes, radii, spacing } from "../constants/theme";

export type BannerVariant = "info" | "warning" | "danger" | "success";

type IoniconName = keyof typeof Ionicons.glyphMap;

type BannerProps = {
  variant: BannerVariant;
  message: string;
  style?: StyleProp<ViewStyle>;
};

const variants: Record<BannerVariant, { icon: IoniconName; color: string }> = {
  info: { icon: "information-circle", color: colors.primary },
  warning: { icon: "warning", color: colors.warning },
  danger: { icon: "alert-circle", color: colors.danger },
  success: { icon: "checkmark-circle", color: colors.success },
};

export function Banner({ variant, message, style }: BannerProps) {
  const { icon, color } = variants[variant];

  return (
    <View
      accessibilityRole="alert"
      style={[styles.banner, { borderColor: color }, style]}
    >
      <Ionicons name={icon} size={fontSizes.title} color={color} />
      <AppText variant="body" style={styles.message}>
        {message}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    alignItems: "center",
    backgroundColor: colors.surface,
    borderRadius: radii.md,
    borderWidth: 1,
    flexDirection: "row",
    gap: spacing.sm,
    padding: spacing.md,
  },
  message: {
    flexShrink: 1,
  },
});
