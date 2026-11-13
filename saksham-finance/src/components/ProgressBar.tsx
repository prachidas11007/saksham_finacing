import { StyleSheet, View, type StyleProp, type ViewStyle } from "react-native";
import { AppText } from "./AppText";
import { colors, radii, spacing } from "../constants/theme";

type ProgressBarProps = {
  value: number;
  text: string;
  style?: StyleProp<ViewStyle>;
};

export function ProgressBar({ value, text, style }: ProgressBarProps) {
  const safeValue = Number.isFinite(value) ? value : 0;
  const clamped = Math.min(100, Math.max(0, safeValue));

  return (
    <View style={[styles.wrapper, style]}>
      <AppText variant="caption" style={styles.text}>
        {text}
      </AppText>
      <View
        style={styles.track}
        accessibilityRole="progressbar"
        accessibilityValue={{ min: 0, max: 100, now: clamped }}
      >
        <View
          style={[styles.fill, { width: `${clamped}%` as `${number}%` }]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    gap: spacing.xs,
  },
  text: {
    color: colors.mutedText,
  },
  track: {
    backgroundColor: colors.border,
    borderRadius: radii.full,
    height: spacing.sm,
    overflow: "hidden",
  },
  fill: {
    backgroundColor: colors.accent,
    borderRadius: radii.full,
    height: "100%",
  },
});
