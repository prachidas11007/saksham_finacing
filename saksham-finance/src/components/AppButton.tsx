import { Ionicons } from "@expo/vector-icons";
import {
  Pressable,
  StyleSheet,
  type StyleProp,
  type ViewStyle,
} from "react-native";
import { AppText } from "./AppText";
import { usePreferences } from "../context/PreferencesContext";
import { MIN_TOUCH_DP, SIMPLE_TOUCH_DP } from "../constants/limits";
import { colors, fontSizes, radii, spacing } from "../constants/theme";

export type AppButtonVariant = "primary" | "secondary" | "danger";

type IoniconName = keyof typeof Ionicons.glyphMap;

type AppButtonProps = {
  label: string;
  onPress: () => void;
  variant?: AppButtonVariant;
  icon?: IoniconName;
  fullWidth?: boolean;
  disabled?: boolean;
  accessibilityLabel?: string;
  style?: StyleProp<ViewStyle>;
};

const variants: Record<
  AppButtonVariant,
  { background: string; border: string; label: string }
> = {
  primary: {
    background: colors.primary,
    border: colors.primary,
    label: colors.onPrimary,
  },
  secondary: {
    background: colors.surface,
    border: colors.primary,
    label: colors.primary,
  },
  danger: {
    background: colors.danger,
    border: colors.danger,
    label: colors.surface,
  },
};

export function AppButton({
  label,
  onPress,
  variant = "primary",
  icon,
  fullWidth = false,
  disabled = false,
  accessibilityLabel,
  style,
}: AppButtonProps) {
  const { simpleMode } = usePreferences();
  const palette = variants[variant];
  const minHeight = simpleMode ? SIMPLE_TOUCH_DP : MIN_TOUCH_DP;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? label}
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        {
          backgroundColor: palette.background,
          borderColor: palette.border,
          minHeight,
        },
        fullWidth ? styles.fullWidth : null,
        pressed && !disabled ? styles.pressed : null,
        disabled ? styles.disabled : null,
        style,
      ]}
    >
      {icon ? (
        <Ionicons name={icon} size={fontSizes.title} color={palette.label} />
      ) : null}
      <AppText variant="body" style={[styles.label, { color: palette.label }]}>
        {label}
      </AppText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: "center",
    alignSelf: "flex-start",
    borderRadius: radii.md,
    borderWidth: 1,
    flexDirection: "row",
    gap: spacing.sm,
    justifyContent: "center",
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
  },
  fullWidth: {
    alignSelf: "stretch",
  },
  label: {
    fontWeight: "600",
    textAlign: "center",
  },
  pressed: {
    opacity: 0.85,
  },
  disabled: {
    opacity: 0.5,
  },
});
