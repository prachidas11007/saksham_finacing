import { useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { AppButton } from "../../components/AppButton";
import { AppText } from "../../components/AppText";
import { Card } from "../../components/Card";
import { EmptyState } from "../../components/EmptyState";
import { ProgressBar } from "../../components/ProgressBar";
import { ScreenContainer } from "../../components/ScreenContainer";
import { MIN_TOUCH_DP, SIMPLE_TOUCH_DP } from "../../constants/limits";
import { colors, fontSizes, radii, spacing } from "../../constants/theme";
import { useFinance } from "../../context/FinanceContext";
import { usePreferences } from "../../context/PreferencesContext";
import { getQuiz } from "../../data/quizzes";
import { tList } from "../../i18n";
import { scoreQuiz } from "../../utils/quiz";

export default function QuizScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { t } = useTranslation();
  const router = useRouter();
  const { simpleMode } = usePreferences();
  const { lessonProgress, saveQuizResult } = useFinance();

  const quiz = getQuiz(id || "core") ?? getQuiz("core");

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [answers, setAnswers] = useState<(number | null)[]>([]);
  const [isFinished, setIsFinished] = useState(false);
  const [finalScore, setFinalScore] = useState(0);

  const minTouchHeight = simpleMode ? SIMPLE_TOUCH_DP : MIN_TOUCH_DP;

  if (!quiz || quiz.questions.length === 0) {
    return (
      <ScreenContainer>
        <EmptyState
          icon="alert-circle-outline"
          title={t("quiz.title")}
          message={t("learn.notFound")}
          style={styles.empty}
        />
      </ScreenContainer>
    );
  }

  const questions = quiz.questions;
  const currentQ = questions[currentIndex];
  const totalQuestions = questions.length;
  const correctIndexes = questions.map((q) => q.correctIndex);

  const prevBest = lessonProgress[quiz.id]?.quizScore;

  const handleSelectOption = (index: number) => {
    if (isSubmitted) {
      return;
    }
    setSelectedOption(index);
  };

  const handleSubmitAnswer = () => {
    if (selectedOption === null || isSubmitted) {
      return;
    }
    setIsSubmitted(true);
    const updatedAnswers = [...answers];
    updatedAnswers[currentIndex] = selectedOption;
    setAnswers(updatedAnswers);
  };

  const handleNextQuestion = () => {
    if (currentIndex < totalQuestions - 1) {
      const nextIndex = currentIndex + 1;
      setCurrentIndex(nextIndex);
      const nextAnswer = answers[nextIndex];
      setSelectedOption(nextAnswer ?? null);
      setIsSubmitted(nextAnswer !== undefined && nextAnswer !== null);
    } else {
      const result = scoreQuiz(answers, correctIndexes);
      const computedBest =
        prevBest !== undefined
          ? Math.max(prevBest, result.score)
          : result.score;

      saveQuizResult(quiz.id, computedBest, result.total);
      setFinalScore(result.score);
      setIsFinished(true);
    }
  };

  const handleBack = () => {
    if (currentIndex > 0) {
      const prevIndex = currentIndex - 1;
      setCurrentIndex(prevIndex);
      const prevAnswer = answers[prevIndex];
      setSelectedOption(prevAnswer ?? null);
      setIsSubmitted(prevAnswer !== undefined && prevAnswer !== null);
    } else {
      router.back();
    }
  };

  const handleRetry = () => {
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsSubmitted(false);
    setAnswers([]);
    setIsFinished(false);
    setFinalScore(0);
  };

  const handleBackToLearn = () => {
    router.replace("/(tabs)/learn");
  };

  const quizTitle = t(`quiz.${quiz.id}.title`);

  if (isFinished) {
    const isPerfect = finalScore === totalQuestions;
    const bestScoreToShow =
      prevBest !== undefined ? Math.max(prevBest, finalScore) : finalScore;

    return (
      <ScreenContainer scroll>
        <Stack.Screen options={{ title: quizTitle }} />
        <View style={styles.container}>
          <Card style={styles.resultCard}>
            <View style={styles.resultIconContainer}>
              <Ionicons
                name={isPerfect ? "ribbon" : "checkmark-circle"}
                size={fontSizes.heading * 1.5}
                color={isPerfect ? colors.accent : colors.success}
              />
            </View>

            <AppText variant="heading" style={styles.resultTitle}>
              {t("quiz.scoreResult", {
                score: finalScore,
                total: totalQuestions,
              })}
            </AppText>

            <AppText variant="body" style={styles.resultMessage}>
              {isPerfect ? t("quiz.perfectScore") : t("quiz.goodEffort")}
            </AppText>

            <View style={styles.bestScoreBox}>
              <Ionicons name="trophy" size={fontSizes.title} color={colors.accent} />
              <AppText variant="body" style={styles.bestScoreText}>
                {t("quiz.bestScore", {
                  score: bestScoreToShow,
                  total: totalQuestions,
                })}
              </AppText>
            </View>

            <View style={styles.resultActions}>
              <AppButton
                variant="primary"
                icon="refresh-outline"
                label={t("quiz.retry")}
                onPress={handleRetry}
                fullWidth
              />
              <AppButton
                variant="secondary"
                icon="book-outline"
                label={t("quiz.backToLearn")}
                onPress={handleBackToLearn}
                fullWidth
              />
            </View>
          </Card>
        </View>
      </ScreenContainer>
    );
  }

  const questionText = t(`quiz.${quiz.id}.${currentQ.id}.question`);
  const options = tList(`quiz.${quiz.id}.${currentQ.id}.options`);
  const explanation = t(`quiz.${quiz.id}.${currentQ.id}.explanation`);
  const isCorrect = selectedOption === currentQ.correctIndex;
  const progressPercent = Math.round(((currentIndex + 1) / totalQuestions) * 100);

  return (
    <ScreenContainer scroll>
      <Stack.Screen options={{ title: quizTitle }} />
      <View style={styles.container}>
        <View style={styles.progressSection}>
          <ProgressBar
            value={progressPercent}
            text={t("quiz.questionProgress", {
              current: currentIndex + 1,
              total: totalQuestions,
            })}
          />
        </View>

        <Card style={styles.questionCard}>
          <AppText variant="title" style={styles.questionText}>
            {questionText}
          </AppText>
        </Card>

        <View style={styles.optionsList}>
          {options.map((optionText, optIndex) => {
            const isSelected = selectedOption === optIndex;
            const isOptionCorrect = optIndex === currentQ.correctIndex;

            let optionBorderColor: string = colors.border;
            let optionBgColor: string = colors.surface;
            let statusIcon: keyof typeof Ionicons.glyphMap = "radio-button-off";
            let iconColor: string = colors.mutedText;

            if (isSubmitted) {
              if (isOptionCorrect) {
                optionBorderColor = colors.success;
                statusIcon = "checkmark-circle";
                iconColor = colors.success;
              } else if (isSelected && !isOptionCorrect) {
                optionBorderColor = colors.danger;
                statusIcon = "close-circle";
                iconColor = colors.danger;
              }
            } else if (isSelected) {
              optionBorderColor = colors.primary;
              statusIcon = "radio-button-on";
              iconColor = colors.primary;
            } else {
              statusIcon = "radio-button-off";
              iconColor = colors.mutedText;
            }

            return (
              <Pressable
                key={optIndex}
                accessibilityRole="button"
                accessibilityLabel={optionText}
                accessibilityState={{
                  selected: isSelected,
                  disabled: isSubmitted,
                }}
                disabled={isSubmitted}
                onPress={() => handleSelectOption(optIndex)}
                style={({ pressed }) => [
                  styles.optionButton,
                  {
                    backgroundColor: optionBgColor,
                    borderColor: optionBorderColor,
                    minHeight: minTouchHeight,
                  },
                  pressed && !isSubmitted ? styles.optionPressed : null,
                ]}
              >
                <Ionicons
                  name={statusIcon}
                  size={fontSizes.title}
                  color={iconColor}
                />
                <AppText variant="body" style={styles.optionLabel}>
                  {optionText}
                </AppText>
              </Pressable>
            );
          })}
        </View>

        {!isSubmitted ? (
          <View style={styles.quizNavActions}>
            <AppButton
              variant="primary"
              icon="checkmark-outline"
              label={t("quiz.submit")}
              disabled={selectedOption === null || isSubmitted}
              onPress={handleSubmitAnswer}
              fullWidth
            />
            <AppButton
              variant="secondary"
              icon="arrow-back-outline"
              label={t("common.back")}
              accessibilityLabel={t("a11y.back")}
              onPress={handleBack}
              fullWidth
            />
          </View>
        ) : (
          <View style={styles.feedbackSection}>
            <Card
              style={[
                styles.feedbackCard,
                {
                  borderColor: isCorrect ? colors.success : colors.danger,
                },
              ]}
            >
              <View style={styles.feedbackHeader}>
                <Ionicons
                  name={isCorrect ? "checkmark-circle" : "close-circle"}
                  size={fontSizes.heading}
                  color={isCorrect ? colors.success : colors.danger}
                />
                <AppText
                  variant="title"
                  style={{
                    color: isCorrect ? colors.success : colors.danger,
                  }}
                >
                  {isCorrect ? t("quiz.correct") : t("quiz.incorrect")}
                </AppText>
              </View>

              <AppText variant="caption" style={styles.explanationHeading}>
                {t("quiz.explanation")}
              </AppText>
              <AppText variant="body" style={styles.explanationText}>
                {explanation}
              </AppText>
            </Card>

            <View style={styles.quizNavActions}>
              <AppButton
                variant="primary"
                icon={
                  currentIndex < totalQuestions - 1
                    ? "arrow-forward-outline"
                    : "checkmark-done-outline"
                }
                label={
                  currentIndex < totalQuestions - 1
                    ? t("quiz.next")
                    : t("quiz.seeScore")
                }
                onPress={handleNextQuestion}
                fullWidth
              />
              <AppButton
                variant="secondary"
                icon="arrow-back-outline"
                label={t("common.back")}
                accessibilityLabel={t("a11y.back")}
                onPress={handleBack}
                fullWidth
              />
            </View>
          </View>
        )}
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.md,
    paddingBottom: spacing.xl,
  },
  empty: {
    flex: 1,
    justifyContent: "center",
  },
  progressSection: {
    marginBottom: spacing.xs,
  },
  questionCard: {
    gap: spacing.sm,
  },
  questionText: {
    lineHeight: 26,
  },
  optionsList: {
    gap: spacing.sm,
  },
  optionButton: {
    alignItems: "center",
    borderRadius: radii.md,
    borderWidth: 2,
    flexDirection: "row",
    gap: spacing.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  optionLabel: {
    flex: 1,
    lineHeight: 22,
  },
  optionPressed: {
    opacity: 0.8,
  },
  feedbackSection: {
    gap: spacing.md,
  },
  quizNavActions: {
    gap: spacing.sm,
  },
  feedbackCard: {
    gap: spacing.xs,
  },
  feedbackHeader: {
    alignItems: "center",
    flexDirection: "row",
    gap: spacing.sm,
    marginBottom: spacing.xs,
  },
  explanationHeading: {
    color: colors.mutedText,
    fontWeight: "600",
    textTransform: "uppercase",
  },
  explanationText: {
    lineHeight: 22,
  },
  resultCard: {
    alignItems: "center",
    gap: spacing.md,
    paddingVertical: spacing.xl,
  },
  resultIconContainer: {
    alignItems: "center",
    backgroundColor: colors.background,
    borderRadius: radii.full,
    height: 72,
    justifyContent: "center",
    width: 72,
  },
  resultTitle: {
    textAlign: "center",
  },
  resultMessage: {
    color: colors.mutedText,
    lineHeight: 22,
    textAlign: "center",
  },
  bestScoreBox: {
    alignItems: "center",
    backgroundColor: colors.background,
    borderRadius: radii.md,
    flexDirection: "row",
    gap: spacing.sm,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
  },
  bestScoreText: {
    color: colors.accent,
    fontWeight: "600",
  },
  resultActions: {
    alignSelf: "stretch",
    gap: spacing.sm,
    marginTop: spacing.md,
  },
});
