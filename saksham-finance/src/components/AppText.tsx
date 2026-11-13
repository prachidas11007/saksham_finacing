import type { ReactNode } from "react";
import { StyleSheet, Text, type TextProps } from "react-native";
import { usePreferences } from "../context/PreferencesContext";
import { LARGE_TEXT_SCALE, MAX_FONT_MULTIPLIER } from "../constants/limits";
import { colors, fontSizes } from "../constants/theme";

export type AppTextVariant = keyof typeof fontSizes;

type AppTextProps = TextProps & {
  variant?: AppTextVariant;
  children?: ReactNode;
};

export function AppText({
  variant = "body",
  style,
  children,
  ...rest
}: AppTextProps) {
  const { largeText } = usePreferences();
  const fontSize = fontSizes[variant] * (largeText ? LARGE_TEXT_SCALE : 1);

  return (
    <Text
      {...rest}
      maxFontSizeMultiplier={MAX_FONT_MULTIPLIER}
      style={[styles.base, styles[variant], { fontSize }, style]}
    >
      {children}
    </Text>
  );
}

const styles = StyleSheet.create({
  base: {
    color: colors.text,
    flexShrink: 1,
  },
  caption: {
    fontWeight: "400",
  },
  body: {
    fontWeight: "400",
  },
  title: {
    fontWeight: "600",
  },
  heading: {
    fontWeight: "700",
  },
});
