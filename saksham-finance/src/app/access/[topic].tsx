import { useState } from "react";
import { StyleSheet, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { AppButton } from "../../components/AppButton";
import { AppText } from "../../components/AppText";
import { Banner } from "../../components/Banner";
import { Card } from "../../components/Card";
import { EmptyState } from "../../components/EmptyState";
import { ExternalLinkButton } from "../../components/ExternalLinkButton";
import { ScreenContainer } from "../../components/ScreenContainer";
import { colors, fontSizes, radii, spacing } from "../../constants/theme";
import { usePreferences } from "../../context/PreferencesContext";
import { getAccessGuide } from "../../data/accessGuides";
import { OFFICIAL_LINKS } from "../../data/officialLinks";
import { tList } from "../../i18n";

export default function AccessTopicScreen() {
  const { topic } = useLocalSearchParams<{ topic: string }>();
  const { t } = useTranslation();
  const router = useRouter();
  const { simpleMode } = usePreferences();
  const [showMore, setShowMore] = useState(false);

  const guide = topic ? getAccessGuide(topic) : undefined;

  if (!guide) {
    return (
      <ScreenContainer>
        <EmptyState
          icon="alert-circle-outline"
          title={t("guides.notFound")}
          message={t("guides.notFound")}
          style={styles.empty}
        />
      </ScreenContainer>
    );
  }

  const title = t(`${guide.translationKeyPrefix}.title`);
  const summary = t(`${guide.translationKeyPrefix}.summary`);
  const whoItHelps = t(`${guide.translationKeyPrefix}.whoItHelps`);
  const steps = tList(`${guide.translationKeyPrefix}.steps`);
  const questions = tList(`${guide.translationKeyPrefix}.questions`);
  const caution = t(`${guide.translationKeyPrefix}.caution`);

  const showAdditionalSections = !simpleMode || showMore;

  return (
    <ScreenContainer scroll>
      <Stack.Screen options={{ title }} />
      <View style={styles.container}>
        <Banner
          variant="warning"
          message={t("guides.verifyTerms")}
        />

        <View style={styles.titleRow}>
          <Ionicons
            name={guide.icon}
            size={fontSizes.heading}
            color={colors.primary}
          />
          <AppText variant="heading" style={styles.titleText}>
            {title}
          </AppText>
        </View>

        <Card style={styles.sectionCard}>
          <AppText variant="title">{t("guides.summarySection")}</AppText>
          <AppText variant="body" style={styles.bodyText}>
            {summary}
          </AppText>
        </Card>

        <Card style={styles.sectionCard}>
          <AppText variant="title">{t("guides.stepsSection")}</AppText>
          <View style={styles.stepsList}>
            {steps.map((step, index) => (
              <View key={index} style={styles.stepItem}>
                <View style={styles.stepBadge}>
                  <AppText variant="caption" style={styles.stepBadgeText}>
                    {t("common.stepNumber", { number: index + 1 })}
                  </AppText>
                </View>
                <AppText variant="body" style={styles.stepBody}>
                  {step}
                </AppText>
              </View>
            ))}
          </View>
        </Card>

        {simpleMode ? (
          <AppButton
            variant="secondary"
            icon={showMore ? "chevron-up" : "chevron-down"}
            label={showMore ? t("guides.showLess") : t("guides.showMore")}
            onPress={() => setShowMore(!showMore)}
            fullWidth
          />
        ) : null}

        {showAdditionalSections ? (
          <>
            <Card style={styles.sectionCard}>
              <AppText variant="title">{t("guides.whoItHelpsSection")}</AppText>
              <AppText variant="body" style={styles.bodyText}>
                {whoItHelps}
              </AppText>
            </Card>

            <Card style={styles.sectionCard}>
              <AppText variant="title">{t("guides.questionsSection")}</AppText>
              <View style={styles.questionsList}>
                {questions.map((question, index) => (
                  <View key={index} style={styles.questionItem}>
                    <Ionicons
                      name="help-circle"
                      size={fontSizes.title}
                      color={colors.primary}
                    />
                    <AppText variant="body" style={styles.questionBody}>
                      {question}
                    </AppText>
                  </View>
                ))}
              </View>
            </Card>

            <Banner
              variant="danger"
              message={caution}
            />

            {guide.id === "borrowing" ? (
              <AppButton
                variant="secondary"
                icon="calculator"
                label={t("guides.openCalculator")}
                onPress={() => router.push("/calculator")}
                fullWidth
              />
            ) : null}

            {guide.linkIds.length > 0 ? (
              <View style={styles.linksSection}>
                <AppText variant="title">
                  {t("guides.officialLinksSection")}
                </AppText>
                {guide.linkIds.map((linkId) => (
                  <ExternalLinkButton
                    key={linkId}
                    link={OFFICIAL_LINKS[linkId]}
                  />
                ))}
              </View>
            ) : null}
          </>
        ) : null}
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.md,
    paddingBottom: spacing.xxl,
  },
  empty: {
    flex: 1,
    justifyContent: "center",
  },
  titleRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: spacing.sm,
  },
  titleText: {
    flex: 1,
  },
  sectionCard: {
    gap: spacing.sm,
  },
  bodyText: {
    color: colors.text,
  },
  stepsList: {
    gap: spacing.md,
  },
  stepItem: {
    gap: spacing.xs,
  },
  stepBadge: {
    alignSelf: "flex-start",
    backgroundColor: colors.background,
    borderColor: colors.border,
    borderRadius: radii.sm,
    borderWidth: 1,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  stepBadgeText: {
    color: colors.primary,
    fontWeight: "600",
  },
  stepBody: {
    color: colors.text,
  },
  questionsList: {
    gap: spacing.md,
  },
  questionItem: {
    alignItems: "flex-start",
    flexDirection: "row",
    gap: spacing.sm,
  },
  questionBody: {
    color: colors.text,
    flex: 1,
  },
  linksSection: {
    gap: spacing.sm,
    marginTop: spacing.xs,
  },
});

