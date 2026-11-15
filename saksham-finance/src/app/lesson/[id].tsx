import { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Stack, useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { AppButton } from "../../components/AppButton";
import { AppText } from "../../components/AppText";
import { Banner } from "../../components/Banner";
import { Card } from "../../components/Card";
import { EmptyState } from "../../components/EmptyState";
import { ScreenContainer } from "../../components/ScreenContainer";
import { colors, fontSizes, radii, spacing } from "../../constants/theme";
import { useFinance } from "../../context/FinanceContext";
import { usePreferences } from "../../context/PreferencesContext";
import { getLesson } from "../../data/lessons";
import { tList } from "../../i18n";
import { speakText, stopSpeech } from "../../utils/speech";

export default function LessonDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { t } = useTranslation();
  const router = useRouter();
  const navigation = useNavigation();
  const { language, simpleMode } = usePreferences();
  const { lessonProgress, markLessonComplete } = useFinance();

  const [isSpeaking, setIsSpeaking] = useState(false);
  const [noVoiceError, setNoVoiceError] = useState(false);
  const [showMore, setShowMore] = useState(false);

  const lesson = id ? getLesson(id) : undefined;
  const isCompleted = id ? Boolean(lessonProgress[id]?.completed) : false;

  useEffect(() => {
    const unsubscribe = navigation.addListener("blur", () => {
      void stopSpeech();
      setIsSpeaking(false);
    });

    return () => {
      unsubscribe();
      void stopSpeech();
    };
  }, [navigation]);

  useEffect(() => {
    void stopSpeech();
    setIsSpeaking(false);
    setNoVoiceError(false);
  }, [language]);

  if (!lesson) {
    return (
      <ScreenContainer>
        <EmptyState
          icon="alert-circle-outline"
          title={t("learn.notFound")}
          message={t("learn.notFound")}
          style={styles.empty}
        />
      </ScreenContainer>
    );
  }

  const title = t(`${lesson.keyPrefix}.title`);
  const summary = t(`${lesson.keyPrefix}.summary`);
  const paragraphs = tList(`${lesson.keyPrefix}.paragraphs`);
  const takeaways = tList(`${lesson.keyPrefix}.takeaways`);

  const handleReadAloudPress = async () => {
    if (isSpeaking) {
      await stopSpeech();
      setIsSpeaking(false);
      return;
    }

    setNoVoiceError(false);
    const textParts = [title, summary, ...paragraphs, ...takeaways];
    const fullText = textParts.join(". ");

    const result = await speakText(fullText, language ?? "en", {
      onStart: () => setIsSpeaking(true),
      onDone: () => setIsSpeaking(false),
      onStopped: () => setIsSpeaking(false),
      onError: () => setIsSpeaking(false),
    });

    if (result === "noVoice") {
      setNoVoiceError(true);
      setIsSpeaking(false);
    }
  };

  const handleMarkComplete = () => {
    markLessonComplete(lesson.id);
  };

  const handleStartQuiz = () => {
    void stopSpeech();
    setIsSpeaking(false);
    router.push({
      pathname: "/quiz/[id]",
      params: { id: "core" },
    });
  };

  const renderSummaryCard = () => (
    <Card style={styles.sectionCard}>
      <AppText variant="title">{t("learn.summary")}</AppText>
      <AppText variant="body" style={styles.bodyText}>
        {summary}
      </AppText>
    </Card>
  );

  const renderParagraphsCard = () => (
    <Card style={styles.sectionCard}>
      <AppText variant="title">{t("learn.paragraphs")}</AppText>
      <View style={styles.paragraphsList}>
        {paragraphs.map((para, index) => (
          <View key={index} style={styles.paragraphRow}>
            <View style={styles.bulletDot} />
            <AppText variant="body" style={styles.paragraphText}>
              {para}
            </AppText>
          </View>
        ))}
      </View>
    </Card>
  );

  const renderTakeawaysCard = () => (
    <Card style={styles.sectionCard}>
      <AppText variant="title">{t("learn.takeaways")}</AppText>
      <View style={styles.takeawaysList}>
        {takeaways.map((item, index) => (
          <View key={index} style={styles.takeawayItem}>
            <Ionicons
              name="checkmark-circle"
              size={fontSizes.title}
              color={colors.accent}
            />
            <AppText variant="body" style={styles.takeawayText}>
              {item}
            </AppText>
          </View>
        ))}
      </View>
    </Card>
  );

  return (
    <ScreenContainer scroll>
      <Stack.Screen options={{ title }} />
      <View style={styles.container}>
        {noVoiceError ? (
          <Banner variant="warning" message={t("learn.noVoice")} />
        ) : null}

        {isSpeaking ? (
          <Banner variant="info" message={t("learn.reading")} />
        ) : null}

        <View style={styles.titleRow}>
          <View style={styles.iconContainer}>
            <Ionicons
              name={lesson.icon}
              size={fontSizes.heading}
              color={colors.primary}
            />
          </View>
          <View style={styles.titleTextContainer}>
            <AppText variant="heading">{title}</AppText>
            {isCompleted ? (
              <View style={styles.completedBadge}>
                <Ionicons
                  name="checkmark-circle"
                  size={fontSizes.caption}
                  color={colors.success}
                />
                <AppText variant="caption" style={styles.completedBadgeText}>
                  {t("learn.completedBadge")}
                </AppText>
              </View>
            ) : null}
          </View>
        </View>

        <View style={styles.actionButtons}>
          <AppButton
            variant="secondary"
            icon={isSpeaking ? "stop-circle-outline" : "volume-high-outline"}
            label={isSpeaking ? t("learn.stopAloud") : t("learn.readAloud")}
            onPress={() => void handleReadAloudPress()}
            fullWidth
          />
          <AppButton
            variant={isCompleted ? "secondary" : "primary"}
            icon={isCompleted ? "checkmark-circle" : "checkmark-outline"}
            label={isCompleted ? t("learn.isCompleted") : t("learn.markComplete")}
            onPress={handleMarkComplete}
            fullWidth
          />
          <AppButton
            variant="secondary"
            icon="school-outline"
            label={t("learn.startQuiz")}
            onPress={handleStartQuiz}
            fullWidth
          />
        </View>

        {simpleMode ? (
          <>
            {renderSummaryCard()}
            {renderTakeawaysCard()}
            <AppButton
              variant="secondary"
              icon={showMore ? "chevron-up" : "chevron-down"}
              label={showMore ? t("learn.showLess") : t("learn.showMore")}
              onPress={() => setShowMore(!showMore)}
              fullWidth
            />
            {showMore ? renderParagraphsCard() : null}
          </>
        ) : (
          <>
            {renderSummaryCard()}
            {renderParagraphsCard()}
            {renderTakeawaysCard()}
          </>
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
  titleRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: spacing.md,
  },
  iconContainer: {
    alignItems: "center",
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radii.md,
    borderWidth: 1,
    height: 52,
    justifyContent: "center",
    width: 52,
  },
  titleTextContainer: {
    flex: 1,
    gap: spacing.xs,
  },
  completedBadge: {
    alignItems: "center",
    alignSelf: "flex-start",
    backgroundColor: colors.background,
    borderColor: colors.success,
    borderRadius: radii.full,
    borderWidth: 1,
    flexDirection: "row",
    gap: spacing.xs,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
  },
  completedBadgeText: {
    color: colors.success,
    fontWeight: "600",
  },
  actionButtons: {
    gap: spacing.sm,
  },
  sectionCard: {
    gap: spacing.sm,
  },
  bodyText: {
    color: colors.text,
    lineHeight: 22,
  },
  paragraphsList: {
    gap: spacing.sm,
  },
  paragraphRow: {
    alignItems: "flex-start",
    flexDirection: "row",
    gap: spacing.sm,
  },
  bulletDot: {
    backgroundColor: colors.primary,
    borderRadius: radii.full,
    height: 6,
    marginTop: 8,
    width: 6,
  },
  paragraphText: {
    flex: 1,
    lineHeight: 22,
  },
  takeawaysList: {
    gap: spacing.sm,
  },
  takeawayItem: {
    alignItems: "flex-start",
    flexDirection: "row",
    gap: spacing.sm,
  },
  takeawayText: {
    flex: 1,
    lineHeight: 22,
  },
});
