import { useState } from "react";
import { StyleSheet, View } from "react-native";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { AppButton } from "../../components/AppButton";
import { AppInput } from "../../components/AppInput";
import { AppText } from "../../components/AppText";
import { ScreenContainer } from "../../components/ScreenContainer";
import { MAX_GOAL_NAME_LENGTH } from "../../constants/limits";
import { spacing } from "../../constants/theme";
import { useFinance } from "../../context/FinanceContext";
import { parseAmount } from "../../utils/amount";

export default function CreateGoalScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { createGoal } = useFinance();

  const [name, setName] = useState("");
  const [targetText, setTargetText] = useState("");
  const [savedText, setSavedText] = useState("");

  const parsedTarget = parseAmount(targetText);
  const targetError =
    targetText.trim() !== "" && !parsedTarget.ok
      ? t(`errors.${parsedTarget.reason}`)
      : undefined;

  const parsedSaved =
    savedText.trim() !== "" ? parseAmount(savedText) : undefined;
  const savedError =
    parsedSaved !== undefined && !parsedSaved.ok
      ? t(`errors.${parsedSaved.reason}`)
      : undefined;

  const isNameValid =
    name.trim().length > 0 && name.length <= MAX_GOAL_NAME_LENGTH;
  const isValid =
    isNameValid &&
    parsedTarget.ok &&
    (parsedSaved === undefined || parsedSaved.ok);

  const handleSave = () => {
    if (!parsedTarget.ok || !isNameValid) {
      return;
    }

    createGoal({
      name: name.trim(),
      targetAmount: parsedTarget.value,
      savedAmount:
        parsedSaved !== undefined && parsedSaved.ok ? parsedSaved.value : 0,
    });

    router.back();
  };

  return (
    <ScreenContainer scroll keyboardSafe>
      <View style={styles.container}>
        <AppText variant="title" style={styles.heading}>
          {t("myMoney.goalCreateTitle")}
        </AppText>

        <AppInput
          label={t("myMoney.goalNameLabel")}
          placeholder={t("myMoney.goalNamePlaceholder")}
          maxLength={MAX_GOAL_NAME_LENGTH}
          value={name}
          onChangeText={setName}
          hint={t("myMoney.goalNameDisclaimer")}
        />

        <AppInput
          label={t("myMoney.goalTargetAmountLabel")}
          placeholder={t("myMoney.goalTargetAmountPlaceholder")}
          keyboardType="decimal-pad"
          value={targetText}
          onChangeText={setTargetText}
          error={targetError}
        />

        <AppInput
          label={t("myMoney.goalStartingSavedLabel")}
          placeholder={t("myMoney.goalStartingSavedPlaceholder")}
          keyboardType="decimal-pad"
          value={savedText}
          onChangeText={setSavedText}
          error={savedError}
        />

        <View style={styles.actionContainer}>
          <AppButton
            label={t("myMoney.goalSaveButton")}
            accessibilityLabel={t("myMoney.goalSaveButton")}
            icon="checkmark-outline"
            variant="primary"
            fullWidth
            disabled={!isValid}
            onPress={handleSave}
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
  actionContainer: {
    marginTop: spacing.sm,
  },
});

