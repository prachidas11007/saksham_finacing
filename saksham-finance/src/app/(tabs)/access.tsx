import { FlatList, Pressable, StyleSheet, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { AppText } from "../../components/AppText";
import { Card } from "../../components/Card";
import { ScreenContainer } from "../../components/ScreenContainer";
import { MIN_TOUCH_DP, SIMPLE_TOUCH_DP } from "../../constants/limits";
import { colors, fontSizes, radii, spacing } from "../../constants/theme";
import { usePreferences } from "../../context/PreferencesContext";
import { ACCESS_GUIDES, type AccessGuide } from "../../data/accessGuides";

export default function AccessScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { simpleMode } = usePreferences();
  const minHeight = simpleMode ? SIMPLE_TOUCH_DP : MIN_TOUCH_DP;

  const handleGuidePress = (guide: AccessGuide) => {
    if (guide.route) {
      router.push(guide.route as "/safety-help");
    } else {
      router.push({
        pathname: "/access/[topic]",
        params: { topic: guide.id },
      });
    }
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <AppText variant="heading">{t("guides.headerTitle")}</AppText>
      <AppText variant="body" style={styles.subtitle}>
        {t("guides.headerSubtitle")}
      </AppText>
    </View>
  );

  const renderItem = ({ item }: { item: AccessGuide }) => {
    const title = t(`${item.translationKeyPrefix}.title`);
    const summary = t(`${item.translationKeyPrefix}.summary`);

    return (
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={title}
        onPress={() => handleGuidePress(item)}
        style={({ pressed }) => [
          styles.pressable,
          pressed ? styles.pressed : null,
        ]}
      >
        <Card style={[styles.card, { minHeight }]}>
          <View style={styles.iconContainer}>
            <Ionicons
              name={item.icon}
              size={fontSizes.heading}
              color={colors.primary}
            />
          </View>
          <View style={styles.textContainer}>
            <AppText variant="title">{title}</AppText>
            <AppText variant="body" style={styles.summaryText}>
              {summary}
            </AppText>
          </View>
          <Ionicons
            name="chevron-forward"
            size={fontSizes.title}
            color={colors.mutedText}
          />
        </Card>
      </Pressable>
    );
  };

  return (
    <ScreenContainer>
      <FlatList
        data={ACCESS_GUIDES}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ListHeaderComponent={renderHeader}
        contentContainerStyle={styles.listContent}
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  listContent: {
    gap: spacing.md,
    paddingBottom: spacing.xl,
  },
  header: {
    gap: spacing.xs,
    marginBottom: spacing.sm,
  },
  subtitle: {
    color: colors.mutedText,
  },
  pressable: {
    borderRadius: radii.lg,
  },
  card: {
    alignItems: "center",
    flexDirection: "row",
    gap: spacing.md,
    padding: spacing.md,
  },
  iconContainer: {
    alignItems: "center",
    backgroundColor: colors.background,
    borderRadius: radii.md,
    height: 48,
    justifyContent: "center",
    width: 48,
  },
  textContainer: {
    flex: 1,
    gap: spacing.xs,
  },
  summaryText: {
    color: colors.mutedText,
  },
  pressed: {
    opacity: 0.85,
  },
});
