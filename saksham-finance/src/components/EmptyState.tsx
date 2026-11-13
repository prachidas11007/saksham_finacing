import type { ReactNode } from "react";
import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, View, type StyleProp, type ViewStyle } from "react-native";
import { AppText } from "./AppText";
import { colors, fontSizes, spacing } from "../constants/theme";

type IoniconName = keyof typeof Ionicons.glyphMap;

type EmptyStateProps = {
  icon: IoniconName;
  title: string;
  message: string;
  action?: ReactNode;
  style?: StyleProp<ViewStyle>;
};

export function EmptyState({
  icon,
  title,
  message,
  action,
  style,
}: EmptyStateProps) {
  return (
    <View style={[styles.container, style]}>
      <Ionicons
        name={icon}
        size={fontSizes.heading * 2}
        color={colors.mutedText}
      />
      <AppText variant="title" style={styles.title}>
        {title}
      </AppText>
      <AppText variant="body" style={styles.message}>
        {message}
      </AppText>
      {action ? <View style={styles.action}>{action}</View> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    gap: spacing.sm,
    justifyContent: "center",
    padding: spacing.lg,
  },
  title: {
    textAlign: "center",
  },
  message: {
    color: colors.mutedText,
    textAlign: "center",
  },
  action: {
    marginTop: spacing.sm,
  },
});
