import {
  StyleSheet,
  TextInput,
  View,
  type TextInputProps,
} from "react-native";
import { AppText } from "./AppText";
import { MIN_TOUCH_DP } from "../constants/limits";
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
        placeholderTextColor={colors.mutedText}
        style={[
          styles.input,
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
    fontSize: fontSizes.body,
    minHeight: MIN_TOUCH_DP,
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
