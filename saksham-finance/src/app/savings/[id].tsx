import { useState } from "react";
import { Alert, StyleSheet, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { AppButton } from "../../components/AppButton";
import { AppInput } from "../../components/AppInput";
import { AppText } from "../../components/AppText";
import { Card } from "../../components/Card";
import { ProgressBar } from "../../components/ProgressBar";
import { ScreenContainer } from "../../components/ScreenContainer";
import { MAX_GOAL_NAME_LENGTH } from "../../constants/limits";
import { colors, fontSizes, spacing } from "../../constants/theme";
import { useFinance, useGoalViews } from "../../context/FinanceContext";
import { parseAmount } from "../../utils/amount";
import { formatINR, formatPercent } from "../../utils/currency";

type ActiveMode = "view" | "addMoney" | "edit";

export default function GoalDetailScreen() {
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { addToGoal, updateGoal, deleteGoal } = useFinance();
  const goalViews = useGoalViews();

  const goalView = goalViews.find((g) => g.id === id);
  const goalDisplayName = goalView
    ? i18n.exists(goalView.name)
      ? t(goalView.name)
      : goalView.name
    : "";

  const [mode, setMode] = useState<ActiveMode>("view");
  const [addAmountText, setAddAmountText] = useState("");
  const [editName, setEditName] = useState(goalView?.name ?? "");
  const [editTargetText, setEditTargetText] = useState(
    goalView ? String(goalView.targetAmount) : "",
  );
  const [editSavedText, setEditSavedText] = useState(
    goalView ? String(goalView.savedAmount) : "",
  );

  if (!goalView) {
    return (
      <ScreenContainer scroll>
        <AppText variant="body">{t("learn.notFound")}</AppText>
      </ScreenContainer>
    );
  }

  const parsedAddAmount = parseAmount(addAmountText);
  const addAmountError =
    addAmountText.trim() !== "" && !parsedAddAmount.ok
      ? t(`errors.${parsedAddAmount.reason}`)
      : undefined;

  const parsedEditTarget = parseAmount(editTargetText);
  const editTargetError =
    editTargetText.trim() !== "" && !parsedEditTarget.ok
      ? t(`errors.${parsedEditTarget.reason}`)
      : undefined;

  const parsedEditSaved =
    editSavedText.trim() !== "" ? parseAmount(editSavedText) : undefined;
  const editSavedError =
    parsedEditSaved !== undefined && !parsedEditSaved.ok
      ? t(`errors.${parsedEditSaved.reason}`)
      : undefined;

  const isEditNameValid =
    editName.trim().length > 0 && editName.length <= MAX_GOAL_NAME_LENGTH;
  const isEditValid =
    isEditNameValid &&
    parsedEditTarget.ok &&
    (parsedEditSaved === undefined || parsedEditSaved.ok);

  const handleAddMoney = () => {
    if (!parsedAddAmount.ok) {
      return;
    }
    addToGoal(goalView.id, parsedAddAmount.value);
    setAddAmountText("");
    setMode("view");
  };

  const handleEditSave = () => {
    if (!parsedEditTarget.ok || !isEditNameValid) {
      return;
    }

    updateGoal({
      ...goalView.goal,
      name: editName.trim(),
      targetAmount: parsedEditTarget.value,
      savedAmount:
        parsedEditSaved !== undefined && parsedEditSaved.ok
          ? parsedEditSaved.value
          : goalView.savedAmount,
    });

    setMode("view");
  };

  const handleDelete = () => {
    Alert.alert(
      t("myMoney.goalDeleteConfirmTitle"),
      t("myMoney.goalDeleteConfirmMessage"),
      [
        { text: t("common.cancel"), style: "cancel" },
        {
          text: t("common.delete"),
          style: "destructive",
          onPress: () => {
            deleteGoal(goalView.id);
            router.back();
          },
        },
      ],
    );
  };

  const handleStartEdit = () => {
    setEditName(goalDisplayName);
    setEditTargetText(String(goalView.targetAmount));
    setEditSavedText(String(goalView.savedAmount));
    setMode("edit");
  };

  if (mode === "addMoney") {
    return (
      <ScreenContainer scroll keyboardSafe>
        <View style={styles.container}>
          <AppText variant="title" style={styles.heading}>
            {t("myMoney.goalAddMoneyTitle")}
          </AppText>

          <AppInput
            label={t("myMoney.goalAddAmountLabel")}
            placeholder={t("myMoney.goalAddAmountPlaceholder")}
            keyboardType="decimal-pad"
            value={addAmountText}
            onChangeText={setAddAmountText}
            error={addAmountError}
          />

          <View style={styles.actionRow}>
            <AppButton
              label={t("myMoney.goalAddSave")}
              accessibilityLabel={t("myMoney.goalAddSave")}
              icon="checkmark-outline"
              variant="primary"
              fullWidth
              disabled={!parsedAddAmount.ok}
              onPress={handleAddMoney}
            />
            <AppButton
              label={t("common.cancel")}
              accessibilityLabel={t("common.cancel")}
              variant="secondary"
              fullWidth
              onPress={() => {
                setAddAmountText("");
                setMode("view");
              }}
            />
          </View>
        </View>
      </ScreenContainer>
    );
  }

  if (mode === "edit") {
    return (
      <ScreenContainer scroll keyboardSafe>
        <View style={styles.container}>
          <AppText variant="title" style={styles.heading}>
            {t("myMoney.goalEditTitle")}
          </AppText>

          <AppInput
            label={t("myMoney.goalNameLabel")}
            placeholder={t("myMoney.goalNamePlaceholder")}
            maxLength={MAX_GOAL_NAME_LENGTH}
            value={editName}
            onChangeText={setEditName}
            hint={t("myMoney.goalNameDisclaimer")}
          />

          <AppInput
            label={t("myMoney.goalTargetAmountLabel")}
            placeholder={t("myMoney.goalTargetAmountPlaceholder")}
            keyboardType="decimal-pad"
            value={editTargetText}
            onChangeText={setEditTargetText}
            error={editTargetError}
          />

          <AppInput
            label={t("myMoney.goalSavedLabel")}
            placeholder={t("myMoney.goalStartingSavedPlaceholder")}
            keyboardType="decimal-pad"
            value={editSavedText}
            onChangeText={setEditSavedText}
            error={editSavedError}
          />

          <View style={styles.actionRow}>
            <AppButton
              label={t("myMoney.goalEditSave")}
              accessibilityLabel={t("myMoney.goalEditSave")}
              icon="checkmark-outline"
              variant="primary"
              fullWidth
              disabled={!isEditValid}
              onPress={handleEditSave}
            />
            <AppButton
              label={t("common.cancel")}
              accessibilityLabel={t("common.cancel")}
              variant="secondary"
              fullWidth
              onPress={() => setMode("view")}
            />
          </View>
        </View>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer scroll>
      <View style={styles.container}>
        <AppText variant="title" style={styles.heading}>
          {goalDisplayName}
        </AppText>

        <Card style={styles.summaryCard}>
          <View style={styles.metricsRow}>
            <View style={styles.metricBlock}>
              <AppText variant="caption" style={styles.metricLabel}>
                {t("myMoney.goalSavedLabel")}
              </AppText>
              <AppText variant="body" style={styles.metricValue}>
                {formatINR(goalView.savedAmount)}
              </AppText>
            </View>
            <View style={styles.metricBlock}>
              <AppText variant="caption" style={styles.metricLabel}>
                {t("myMoney.goalTargetLabel")}
              </AppText>
              <AppText variant="body" style={styles.metricValue}>
                {formatINR(goalView.targetAmount)}
              </AppText>
            </View>
            <View style={styles.metricBlock}>
              <AppText variant="caption" style={styles.metricLabel}>
                {t("myMoney.goalRemainingLabel")}
              </AppText>
              <AppText variant="body" style={styles.metricValue}>
                {formatINR(goalView.remaining)}
              </AppText>
            </View>
          </View>

          <ProgressBar
            value={goalView.barPercent}
            text={formatPercent(goalView.rawPercent)}
          />

          {goalView.reached ? (
            <View style={styles.reachedRow}>
              <Ionicons
                name="checkmark-circle"
                size={fontSizes.title}
                color={colors.success}
              />
              <AppText variant="body" style={styles.reachedText}>
                {t("myMoney.goalReached")}
              </AppText>
            </View>
          ) : null}
        </Card>

        <View style={styles.actionRow}>
          <AppButton
            label={t("myMoney.goalAddMoney")}
            accessibilityLabel={t("myMoney.goalAddMoney")}
            icon="add"
            variant="primary"
            fullWidth
            onPress={() => setMode("addMoney")}
          />
          <AppButton
            label={t("myMoney.goalEditTitle")}
            accessibilityLabel={t("myMoney.goalEditTitle")}
            icon="create-outline"
            variant="secondary"
            fullWidth
            onPress={handleStartEdit}
          />
          <AppButton
            label={t("common.delete")}
            accessibilityLabel={t("common.delete")}
            icon="trash-outline"
            variant="danger"
            fullWidth
            onPress={handleDelete}
          />
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
  summaryCard: {
    gap: spacing.md,
  },
  metricsRow: {
    flexDirection: "row",
    gap: spacing.sm,
  },
  metricBlock: {
    alignItems: "center",
    backgroundColor: colors.background,
    borderRadius: 12,
    flex: 1,
    paddingHorizontal: spacing.xs,
    paddingVertical: spacing.sm,
  },
  metricLabel: {
    color: colors.mutedText,
    marginBottom: spacing.xs,
    textAlign: "center",
  },
  metricValue: {
    fontWeight: "600",
    textAlign: "center",
  },
  reachedRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: spacing.sm,
  },
  reachedText: {
    color: colors.success,
    fontWeight: "700",
  },
  actionRow: {
    gap: spacing.sm,
  },
});

