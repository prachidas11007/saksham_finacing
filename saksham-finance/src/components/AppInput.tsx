import {
  StyleSheet,
  TextInput,
  View,
  type TextInputProps,
} from "react-native";
import { AppText } from "./AppText";
import { usePreferences } from "../context/PreferencesContext";
import {
  LARGE_TEXT_SCALE,
  MAX_FONT_MULTIPLIER,
  MIN_TOUCH_DP,
  SIMPLE_TOUCH_DP,
} from "../constants/limits";
import { colors, fontSizes, radii, spacing } from "../constants/theme";

type AppInputProps = TextInputProps & {
  label: string;
  hint?: string;
  error?: string;
};

export function AppInput({
  label,
  hint,
  error,
  multiline,
  style,
  ...rest
}: AppInputProps) {
  const { largeText, simpleMode } = usePreferences();
  const fontSize = fontSizes.body * (largeText ? LARGE_TEXT_SCALE : 1);
  const minHeight = simpleMode ? SIMPLE_TOUCH_DP : MIN_TOUCH_DP;

  return (
    <View style={styles.wrapper}>
      <AppText variant="body" style={styles.label}>
        {label}
      </AppText>
      <TextInput
        {...rest}
        multiline={multiline}
        accessibilityLabel={label}
        accessibilityHint={error ?? hint}
        maxFontSizeMultiplier={MAX_FONT_MULTIPLIER}
        placeholderTextColor={colors.mutedText}
        style={[
          styles.input,
          {
            fontSize,
            minHeight: multiline ? Math.max(minHeight, 80) : minHeight,
          },
          multiline ? styles.multiline : null,
          error ? styles.inputError : null,
          style,
        ]}
      />
      {error ? (
        <AppText variant="caption" style={styles.error}>
          {error}
        </AppText>
      ) : hint ? (
        <AppText variant="caption" style={styles.hint}>
          {hint}
        </AppText>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    gap: spacing.xs,
  },
  label: {
    fontWeight: "600",
  },
  input: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radii.md,
    borderWidth: 1,
    color: colors.text,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  multiline: {
    paddingTop: spacing.sm,
    textAlignVertical: "top",
  },
  inputError: {
    borderColor: colors.danger,
  },
  hint: {
    color: colors.mutedText,
  },
  error: {
    color: colors.danger,
  },
});
