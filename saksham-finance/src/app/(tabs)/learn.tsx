import { FlatList, Pressable, StyleSheet, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { AppButton } from "../../components/AppButton";
import { AppText } from "../../components/AppText";
import { Card } from "../../components/Card";
import { ScreenContainer } from "../../components/ScreenContainer";
import { MIN_TOUCH_DP, SIMPLE_TOUCH_DP } from "../../constants/limits";
import { colors, fontSizes, radii, spacing } from "../../constants/theme";
import { useFinance } from "../../context/FinanceContext";
import { usePreferences } from "../../context/PreferencesContext";
import { LESSONS, type Lesson } from "../../data/lessons";

export default function LearnScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { simpleMode } = usePreferences();
  const { lessonProgress } = useFinance();
  const minHeight = simpleMode ? SIMPLE_TOUCH_DP : MIN_TOUCH_DP;

  const quizProgress = lessonProgress["core"];
  const quizScore = quizProgress?.quizScore;

  const handleLessonPress = (lesson: Lesson) => {
    router.push({
      pathname: "/lesson/[id]",
      params: { id: lesson.id },
    });
  };

  const handleQuizPress = () => {
    router.push({
      pathname: "/quiz/[id]",
      params: { id: "core" },
    });
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <AppText variant="heading">{t("learn.title")}</AppText>
      <AppText variant="body" style={styles.subtitle}>
        {t("learn.subtitle")}
      </AppText>

      <Card style={styles.quizCard}>
        <View style={styles.quizHeader}>
          <View style={styles.quizIconContainer}>
            <Ionicons
              name="school-outline"
              size={fontSizes.heading}
              color={colors.primary}
            />
          </View>
          <View style={styles.quizHeaderText}>
            <AppText variant="title">{t("learn.quizCardTitle")}</AppText>
            <AppText variant="body" style={styles.subtitle}>
              {t("learn.quizCardDescription")}
            </AppText>
          </View>
        </View>

        <View style={styles.quizScoreRow}>
          <Ionicons
            name={quizScore !== undefined ? "trophy" : "help-circle-outline"}
            size={fontSizes.title}
            color={quizScore !== undefined ? colors.accent : colors.mutedText}
          />
          <AppText
            variant="body"
            style={[
              styles.quizScoreText,
              quizScore !== undefined ? styles.scoreActive : styles.scoreEmpty,
            ]}
          >
            {quizScore !== undefined
              ? t("quiz.bestScore", { score: quizScore, total: 5 })
              : t("quiz.notTakenYet")}
          </AppText>
        </View>

        <AppButton
          variant="primary"
          icon="play-outline"
          label={
            quizScore !== undefined ? t("quiz.retakeQuiz") : t("quiz.startQuiz")
          }
          onPress={handleQuizPress}
          fullWidth
        />
      </Card>

      <AppText variant="title" style={styles.sectionTitle}>
        {t("learn.lessonsTitle")}
      </AppText>
    </View>
  );

  const renderItem = ({ item }: { item: Lesson }) => {
    const isCompleted = Boolean(lessonProgress[item.id]?.completed);
    const title = t(`${item.keyPrefix}.title`);
    const summary = t(`${item.keyPrefix}.summary`);
    const statusText = isCompleted
      ? t("learn.completed")
      : t("learn.notStarted");

    return (
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`${title}, ${statusText}`}
        onPress={() => handleLessonPress(item)}
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
            <View style={styles.statusRow}>
              <Ionicons
                name={isCompleted ? "checkmark-circle" : "ellipse-outline"}
                size={fontSizes.body}
                color={isCompleted ? colors.success : colors.mutedText}
              />
              <AppText
                variant="caption"
                style={[
                  styles.statusText,
                  isCompleted ? styles.statusCompleted : styles.statusPending,
                ]}
              >
                {statusText}
              </AppText>
            </View>
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
        data={LESSONS}
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
    gap: spacing.sm,
    marginBottom: spacing.xs,
  },
  subtitle: {
    color: colors.mutedText,
  },
  quizCard: {
    gap: spacing.md,
    marginVertical: spacing.sm,
  },
  quizHeader: {
    flexDirection: "row",
    gap: spacing.md,
  },
  quizIconContainer: {
    alignItems: "center",
    backgroundColor: colors.background,
    borderRadius: radii.md,
    height: 48,
    justifyContent: "center",
    width: 48,
  },
  quizHeaderText: {
    flex: 1,
    gap: spacing.xs,
  },
  quizScoreRow: {
    alignItems: "center",
    backgroundColor: colors.background,
    borderRadius: radii.md,
    flexDirection: "row",
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  quizScoreText: {
    fontWeight: "600",
  },
  scoreActive: {
    color: colors.accent,
  },
  scoreEmpty: {
    color: colors.mutedText,
  },
  sectionTitle: {
    marginTop: spacing.sm,
  },
  pressable: {
    borderRadius: radii.lg,
  },
  card: {
    alignItems: "flex-start",
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
  statusRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: spacing.xs,
    marginTop: spacing.xs,
  },
  statusText: {
    fontWeight: "600",
  },
  statusCompleted: {
    color: colors.success,
  },
  statusPending: {
    color: colors.mutedText,
  },
  pressed: {
    opacity: 0.85,
  },
});
