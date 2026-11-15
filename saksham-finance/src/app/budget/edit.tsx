import { useState } from "react";
import { Alert, Pressable, StyleSheet, View } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { AppButton } from "../../components/AppButton";
import { AppInput } from "../../components/AppInput";
import { AppText } from "../../components/AppText";
import { ScreenContainer } from "../../components/ScreenContainer";
import { MIN_TOUCH_DP, SIMPLE_TOUCH_DP } from "../../constants/limits";
import { colors, fontSizes, radii, spacing } from "../../constants/theme";
import { useFinance } from "../../context/FinanceContext";
import { usePreferences } from "../../context/PreferencesContext";
import { EXPENSE_CATEGORIES } from "../../data/types";
import { parseAmount } from "../../utils/amount";

export default function BudgetEditScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { budgets, upsertBudget, deleteBudget } = useFinance();
  const { simpleMode } = usePreferences();
  const params = useLocalSearchParams<{ budgetId?: string }>();

  const existingBudget = params.budgetId
    ? budgets.find((b) => b.id === params.budgetId)
    : undefined;

  const isEditing = existingBudget !== undefined;

  const [category, setCategory] = useState<string>(
    existingBudget?.category ?? EXPENSE_CATEGORIES[0],
  );
  const [limitText, setLimitText] = useState(
    existingBudget ? String(existingBudget.limit) : "",
  );

  const minTouchHeight = simpleMode ? SIMPLE_TOUCH_DP : MIN_TOUCH_DP;
  const parsedLimit = parseAmount(limitText);
  const limitError =
    limitText.trim() !== "" && !parsedLimit.ok
      ? t(`errors.${parsedLimit.reason}`)
      : undefined;

  const isValid = parsedLimit.ok;

  const handleSave = () => {
    if (!parsedLimit.ok) {
      return;
    }

    upsertBudget({
      id: existingBudget?.id,
      category,
      limit: parsedLimit.value,
    });

    router.back();
  };

  const handleDelete = () => {
    if (!existingBudget) {
      return;
    }

    Alert.alert(
      t("myMoney.budgetDeleteConfirmTitle"),
      t("myMoney.budgetDeleteConfirmMessage"),
      [
        { text: t("common.cancel"), style: "cancel" },
        {
          text: t("common.delete"),
          style: "destructive",
          onPress: () => {
            deleteBudget(existingBudget.id);
            router.back();
          },
        },
      ],
    );
  };

  return (
    <ScreenContainer scroll keyboardSafe>
      <View style={styles.container}>
        <AppText variant="title" style={styles.heading}>
          {isEditing
            ? t("myMoney.budgetEditTitle")
            : t("myMoney.budgetCreateTitle")}
        </AppText>

        <View style={styles.section}>
          <AppText variant="body" style={styles.sectionLabel}>
            {t("myMoney.budgetCategoryLabel")}
          </AppText>
          <View style={styles.chipsContainer}>
            {EXPENSE_CATEGORIES.map((cat) => {
              const isSelected = category === cat;
              return (
                <Pressable
                  key={cat}
                  accessibilityRole="button"
                  accessibilityLabel={t(`categories.${cat}`)}
                  accessibilityState={{ selected: isSelected }}
                  onPress={() => setCategory(cat)}
                  style={[
                    styles.chip,
                    { minHeight: minTouchHeight },
                    isSelected ? styles.chipSelected : styles.chipUnselected,
                  ]}
                >
                  <AppText
                    variant="body"
                    style={[
                      styles.chipText,
                      isSelected
                        ? styles.chipTextSelected
                        : styles.chipTextUnselected,
                    ]}
                  >
                    {t(`categories.${cat}`)}
                  </AppText>
                </Pressable>
              );
            })}
          </View>
        </View>

        <AppInput
          label={t("myMoney.budgetLimitLabel")}
          placeholder={t("myMoney.budgetLimitPlaceholder")}
          keyboardType="decimal-pad"
          value={limitText}
          onChangeText={setLimitText}
          error={limitError}
        />

        <View style={styles.actionContainer}>
          <AppButton
            label={t("myMoney.budgetSave")}
            accessibilityLabel={t("myMoney.budgetSave")}
            icon="checkmark-outline"
            variant="primary"
            fullWidth
            disabled={!isValid}
            onPress={handleSave}
          />

          {isEditing ? (
            <AppButton
              label={t("myMoney.deleteBudget")}
              accessibilityLabel={t("myMoney.deleteBudget")}
              icon="trash-outline"
              variant="danger"
              fullWidth
              onPress={handleDelete}
            />
          ) : null}
        </View>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  heading: {
    fontWeight: "700",
  },
  section: {
    gap: spacing.xs,
  },
  sectionLabel: {
    fontWeight: "600",
  },
  chipsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
  },
  chip: {
    alignItems: "center",
    borderRadius: radii.full,
    borderWidth: 1,
    justifyContent: "center",
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
  },
  chipSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  chipUnselected: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
  },
  chipText: {},
  chipTextSelected: {
    color: colors.onPrimary,
    fontWeight: "600",
  },
  chipTextUnselected: {
    color: colors.text,
  },
  actionContainer: {
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
});

