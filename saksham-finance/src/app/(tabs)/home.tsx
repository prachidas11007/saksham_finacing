import { useMemo } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { AppButton } from "../../components/AppButton";
import { AppText } from "../../components/AppText";
import { Card } from "../../components/Card";
import { EmptyState } from "../../components/EmptyState";
import { ScreenContainer } from "../../components/ScreenContainer";
import { MIN_TOUCH_DP, SIMPLE_TOUCH_DP } from "../../constants/limits";
import { colors, fontSizes, radii, spacing } from "../../constants/theme";
import { useFinance, useMonthSummary } from "../../context/FinanceContext";
import { usePreferences } from "../../context/PreferencesContext";
import { LESSONS } from "../../data/lessons";
import { formatINR } from "../../utils/currency";

export default function HomeScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { simpleMode } = usePreferences();
  const { transactions, lessonProgress } = useFinance();
  const summary = useMonthSummary();

  const minTouchHeight = simpleMode ? SIMPLE_TOUCH_DP : MIN_TOUCH_DP;

  const featuredLesson = useMemo(() => {
    const notCompleted = LESSONS.find((l) => !lessonProgress[l.id]?.completed);
    return notCompleted ?? LESSONS[0];
  }, [lessonProgress]);

  const renderTrackedAmountCard = () => (
    <Card style={styles.primaryCard}>
      <View style={styles.cardHeader}>
        <Ionicons
          name="shield-checkmark-outline"
          size={fontSizes.title}
          color={colors.primary}
        />
        <AppText variant="caption" style={styles.cardHeaderTitle}>
          {t("home.trackedDemoAmountTitle")}
        </AppText>
      </View>
      <AppText variant="heading" style={styles.trackedAmountValue}>
        {formatINR(summary.net)}
      </AppText>
      <AppText variant="caption" style={styles.cardNote}>
        {t("home.trackedAmountNote")}
      </AppText>
    </Card>
  );

  if (simpleMode) {
    return (
      <ScreenContainer scroll>
        <View style={styles.container}>
          {renderTrackedAmountCard()}
          <View style={styles.simpleButtonsContainer}>
            <AppButton
              variant="primary"
              icon="compass-outline"
              label={t("home.simpleAccessGuide")}
              accessibilityLabel={t("home.simpleAccessGuide")}
              fullWidth
              onPress={() => router.push("/(tabs)/access")}
            />
            <AppButton
              variant="primary"
              icon="remove-circle-outline"
              label={t("home.simpleAddExpense")}
              accessibilityLabel={t("home.simpleAddExpense")}
              fullWidth
              onPress={() =>
                router.push({
                  pathname: "/transaction/add",
                  params: { type: "expense" },
                })
              }
            />
            <AppButton
              variant="primary"
              icon="book-outline"
              label={t("home.simpleLearn")}
              accessibilityLabel={t("home.simpleLearn")}
              fullWidth
              onPress={() => router.push("/(tabs)/learn")}
            />
            <AppButton
              variant="danger"
              icon="shield-checkmark-outline"
              label={t("home.simpleSafetyHelp")}
              accessibilityLabel={t("home.simpleSafetyHelp")}
              fullWidth
              onPress={() => router.push("/safety-help")}
            />
          </View>
        </View>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer scroll>
      <View style={styles.container}>
        {/* 1. Translated greeting + visible Profile shortcut */}
        <View style={styles.headerRow}>
          <View style={styles.greetingContainer}>
            <AppText variant="heading" style={styles.greetingText}>
              {t("home.greeting")}
            </AppText>
            <AppText variant="caption" style={styles.appNameText}>
              {t("common.appName")}
            </AppText>
          </View>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={t("home.profileShortcut")}
            onPress={() => router.push("/(tabs)/profile")}
            style={({ pressed }) => [
              styles.profileButton,
              { minHeight: minTouchHeight },
              pressed ? styles.pressed : null,
            ]}
          >
            <Ionicons
              name="person-circle-outline"
              size={fontSizes.title}
              color={colors.primary}
            />
            <AppText variant="body" style={styles.profileButtonLabel}>
              {t("home.profileShortcut")}
            </AppText>
          </Pressable>
        </View>

        {/* 2. Primary card "Tracked demo amount" */}
        {renderTrackedAmountCard()}

        {/* 3. Two compact cards: Income this month, Expenses this month */}
        <View style={styles.compactRow}>
          <Card style={styles.compactCard}>
            <View style={styles.compactHeader}>
              <Ionicons
                name="arrow-down-circle-outline"
                size={fontSizes.body}
                color={colors.success}
              />
              <AppText variant="caption" style={styles.compactLabel}>
                {t("home.incomeThisMonth")}
              </AppText>
            </View>
            <AppText
              variant="title"
              style={[styles.compactValue, { color: colors.success }]}
            >
              {formatINR(summary.income)}
            </AppText>
          </Card>

          <Card style={styles.compactCard}>
            <View style={styles.compactHeader}>
              <Ionicons
                name="arrow-up-circle-outline"
                size={fontSizes.body}
                color={colors.warning}
              />
              <AppText variant="caption" style={styles.compactLabel}>
                {t("home.expensesThisMonth")}
              </AppText>
            </View>
            <AppText
              variant="title"
              style={[styles.compactValue, { color: colors.warning }]}
            >
              {formatINR(summary.expense)}
            </AppText>
          </Card>
        </View>

        {/* 4. Primary button "Need help accessing a service?" */}
        <AppButton
          variant="primary"
          icon="compass-outline"
          label={t("home.accessCta")}
          accessibilityLabel={t("home.accessCta")}
          fullWidth
          onPress={() => router.push("/(tabs)/access")}
        />

        {/* 5. Quick actions */}
        <View style={styles.quickActionsSection}>
          <AppText variant="title" style={styles.sectionTitle}>
            {t("home.quickActionsTitle")}
          </AppText>
          <View style={styles.quickActionsGrid}>
            <View style={styles.quickActionRow}>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={t("home.quickAddExpense")}
                onPress={() =>
                  router.push({
                    pathname: "/transaction/add",
                    params: { type: "expense" },
                  })
                }
                style={({ pressed }) => [
                  styles.quickActionButton,
                  { minHeight: minTouchHeight },
                  pressed ? styles.pressed : null,
                ]}
              >
                <Ionicons
                  name="remove-circle-outline"
                  size={fontSizes.title}
                  color={colors.primary}
                />
                <AppText variant="body" style={styles.quickActionLabel}>
                  {t("home.quickAddExpense")}
                </AppText>
              </Pressable>

              <Pressable
                accessibilityRole="button"
                accessibilityLabel={t("home.quickAddIncome")}
                onPress={() =>
                  router.push({
                    pathname: "/transaction/add",
                    params: { type: "income" },
                  })
                }
                style={({ pressed }) => [
                  styles.quickActionButton,
                  { minHeight: minTouchHeight },
                  pressed ? styles.pressed : null,
                ]}
              >
                <Ionicons
                  name="add-circle-outline"
                  size={fontSizes.title}
                  color={colors.primary}
                />
                <AppText variant="body" style={styles.quickActionLabel}>
                  {t("home.quickAddIncome")}
                </AppText>
              </Pressable>
            </View>

            <View style={styles.quickActionRow}>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={t("home.quickSavingsGoal")}
                onPress={() => router.push("/savings/create")}
                style={({ pressed }) => [
                  styles.quickActionButton,
                  { minHeight: minTouchHeight },
                  pressed ? styles.pressed : null,
                ]}
              >
                <Ionicons
                  name="flag-outline"
                  size={fontSizes.title}
                  color={colors.primary}
                />
                <AppText variant="body" style={styles.quickActionLabel}>
                  {t("home.quickSavingsGoal")}
                </AppText>
              </Pressable>

              <Pressable
                accessibilityRole="button"
                accessibilityLabel={t("home.quickCalculator")}
                onPress={() => router.push("/calculator")}
                style={({ pressed }) => [
                  styles.quickActionButton,
                  { minHeight: minTouchHeight },
                  pressed ? styles.pressed : null,
                ]}
              >
                <Ionicons
                  name="calculator-outline"
                  size={fontSizes.title}
                  color={colors.primary}
                />
                <AppText variant="body" style={styles.quickActionLabel}>
                  {t("home.quickCalculator")}
                </AppText>
              </Pressable>
            </View>
          </View>
        </View>

        {/* 6. Featured lesson + Stay safe shortcut */}
        <View style={styles.learningSection}>
          <AppText variant="title" style={styles.sectionTitle}>
            {t("home.featuredLessonTitle")}
          </AppText>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`${t("home.featuredLessonTitle")}: ${t(`${featuredLesson.keyPrefix}.title`)}`}
            onPress={() =>
              router.push({
                pathname: "/lesson/[id]",
                params: { id: featuredLesson.id },
              })
            }
            style={({ pressed }) => [
              styles.featuredPressable,
              pressed ? styles.pressed : null,
            ]}
          >
            <Card style={styles.featuredCard}>
              <View style={styles.featuredHeader}>
                <View style={styles.featuredIconContainer}>
                  <Ionicons
                    name={featuredLesson.icon}
                    size={fontSizes.heading}
                    color={colors.primary}
                  />
                </View>
                <View style={styles.featuredTextContainer}>
                  <AppText variant="title" style={styles.featuredTitle}>
                    {t(`${featuredLesson.keyPrefix}.title`)}
                  </AppText>
                  <AppText variant="caption" style={styles.featuredStatus}>
                    {lessonProgress[featuredLesson.id]?.completed
                      ? t("learn.completed")
                      : t("learn.notStarted")}
                  </AppText>
                </View>
              </View>
              <AppText variant="body" style={styles.featuredSummary}>
                {t(`${featuredLesson.keyPrefix}.summary`)}
              </AppText>
            </Card>
          </Pressable>

          <Pressable
            accessibilityRole="button"
            accessibilityLabel={t("home.staySafeTitle")}
            onPress={() => router.push("/safety-help")}
            style={({ pressed }) => [
              styles.staySafePressable,
              pressed ? styles.pressed : null,
            ]}
          >
            <Card style={styles.staySafeCard}>
              <View style={styles.staySafeRow}>
                <Ionicons
                  name="shield-checkmark-outline"
                  size={fontSizes.heading}
                  color={colors.danger}
                />
                <View style={styles.staySafeTextContainer}>
                  <AppText variant="title" style={styles.staySafeTitle}>
                    {t("home.staySafeTitle")}
                  </AppText>
                  <AppText variant="caption" style={styles.staySafeSubtitle}>
                    {t("home.staySafeSubtitle")}
                  </AppText>
                </View>
                <Ionicons
                  name="chevron-forward"
                  size={fontSizes.title}
                  color={colors.mutedText}
                />
              </View>
            </Card>
          </Pressable>
        </View>

        {/* 7. Empty state with no entries */}
        {transactions.length === 0 ? (
          <Card style={styles.emptyCard}>
            <EmptyState
              icon="receipt-outline"
              title={t("home.emptyTitle")}
              message={t("home.emptyMessage")}
              action={
                <AppButton
                  variant="secondary"
                  icon="add-circle-outline"
                  label={t("home.quickAddExpense")}
                  accessibilityLabel={t("home.quickAddExpense")}
                  onPress={() =>
                    router.push({
                      pathname: "/transaction/add",
                      params: { type: "expense" },
                    })
                  }
                />
              }
            />
          </Card>
        ) : null}
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.md,
  },
  headerRow: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  greetingContainer: {
    flex: 1,
    gap: spacing.xs,
  },
  greetingText: {
    color: colors.text,
  },
  appNameText: {
    color: colors.mutedText,
  },
  profileButton: {
    alignItems: "center",
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radii.md,
    borderWidth: 1,
    flexDirection: "row",
    gap: spacing.xs,
    justifyContent: "center",
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  profileButtonLabel: {
    color: colors.primary,
  },
  pressed: {
    opacity: 0.7,
  },
  primaryCard: {
    gap: spacing.sm,
  },
  cardHeader: {
    alignItems: "center",
    flexDirection: "row",
    gap: spacing.sm,
  },
  cardHeaderTitle: {
    color: colors.mutedText,
  },
  trackedAmountValue: {
    color: colors.primary,
  },
  cardNote: {
    color: colors.mutedText,
  },
  compactRow: {
    flexDirection: "row",
    gap: spacing.md,
  },
  compactCard: {
    flex: 1,
    gap: spacing.xs,
  },
  compactHeader: {
    alignItems: "center",
    flexDirection: "row",
    gap: spacing.xs,
  },
  compactLabel: {
    color: colors.mutedText,
  },
  compactValue: {
    fontWeight: "600",
  },
  quickActionsSection: {
    gap: spacing.sm,
  },
  sectionTitle: {
    color: colors.text,
  },
  quickActionsGrid: {
    gap: spacing.sm,
  },
  quickActionRow: {
    flexDirection: "row",
    gap: spacing.sm,
  },
  quickActionButton: {
    alignItems: "center",
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radii.md,
    borderWidth: 1,
    flex: 1,
    flexDirection: "row",
    gap: spacing.sm,
    justifyContent: "center",
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.md,
  },
  quickActionLabel: {
    color: colors.text,
    textAlign: "center",
  },
  learningSection: {
    gap: spacing.sm,
  },
  featuredPressable: {
    borderRadius: radii.lg,
  },
  featuredCard: {
    gap: spacing.sm,
  },
  featuredHeader: {
    alignItems: "center",
    flexDirection: "row",
    gap: spacing.md,
  },
  featuredIconContainer: {
    alignItems: "center",
    backgroundColor: colors.background,
    borderRadius: radii.md,
    justifyContent: "center",
    padding: spacing.sm,
  },
  featuredTextContainer: {
    flex: 1,
    gap: spacing.xs,
  },
  featuredTitle: {
    color: colors.text,
  },
  featuredStatus: {
    color: colors.mutedText,
  },
  featuredSummary: {
    color: colors.mutedText,
  },
  staySafePressable: {
    borderRadius: radii.lg,
  },
  staySafeCard: {
    borderColor: colors.border,
  },
  staySafeRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: spacing.md,
  },
  staySafeTextContainer: {
    flex: 1,
    gap: spacing.xs,
  },
  staySafeTitle: {
    color: colors.danger,
  },
  staySafeSubtitle: {
    color: colors.mutedText,
  },
  emptyCard: {
    padding: 0,
  },
  simpleButtonsContainer: {
    gap: spacing.md,
  },
});
