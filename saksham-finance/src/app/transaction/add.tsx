import { useEffect, useState } from "react";
import { Modal, Platform, Pressable, StyleSheet, View } from "react-native";
import DateTimePicker, {
  type DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { AppButton } from "../../components/AppButton";
import { AppInput } from "../../components/AppInput";
import { AppText } from "../../components/AppText";
import { Card } from "../../components/Card";
import { ScreenContainer } from "../../components/ScreenContainer";
import {
  MAX_NOTE_LENGTH,
  MIN_TOUCH_DP,
  SIMPLE_TOUCH_DP,
} from "../../constants/limits";
import { colors, fontSizes, radii, spacing } from "../../constants/theme";
import { useFinance } from "../../context/FinanceContext";
import { usePreferences } from "../../context/PreferencesContext";
import {
  EXPENSE_CATEGORIES,
  INCOME_CATEGORIES,
  type TransactionType,
} from "../../data/types";
import { parseAmount } from "../../utils/amount";
import {
  isValidDateString,
  todayLocal,
  toLocalDateString,
} from "../../utils/dates";

export default function AddTransactionScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const params = useLocalSearchParams<{ type?: string }>();
  const { addTransaction } = useFinance();
  const { simpleMode } = usePreferences();

  const initialType: TransactionType =
    params.type === "income" ? "income" : "expense";
  const [type, setType] = useState<TransactionType>(initialType);
  const [amountText, setAmountText] = useState("");
  const [category, setCategory] = useState<string>(
    initialType === "expense" ? EXPENSE_CATEGORIES[0] : INCOME_CATEGORIES[0],
  );
  const [date, setDate] = useState<Date>(() => new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showWebDatePicker, setShowWebDatePicker] = useState(false);
  const [webDateText, setWebDateText] = useState(() =>
    toLocalDateString(new Date()),
  );
  const [note, setNote] = useState("");

  useEffect(() => {
    if (params.type === "income" || params.type === "expense") {
      setType(params.type);
      const nextCategories =
        params.type === "expense" ? EXPENSE_CATEGORIES : INCOME_CATEGORIES;
      setCategory((prev) =>
        nextCategories.includes(prev as never) ? prev : nextCategories[0],
      );
    }
  }, [params.type]);

  const minTouchHeight = simpleMode ? SIMPLE_TOUCH_DP : MIN_TOUCH_DP;
  const categories =
    type === "expense" ? EXPENSE_CATEGORIES : INCOME_CATEGORIES;

  const parsedAmount = parseAmount(amountText);
  const amountError =
    amountText.trim() !== "" && !parsedAmount.ok
      ? t(`errors.${parsedAmount.reason}`)
      : undefined;

  const dateString = toLocalDateString(date);
  const isDateValid = isValidDateString(dateString);
  const isCategoryValid = categories.includes(category as never);
  const isNoteValid = note.length <= MAX_NOTE_LENGTH;
  const isValid =
    parsedAmount.ok && isCategoryValid && isDateValid && isNoteValid;

  const handleTypeChange = (nextType: TransactionType) => {
    setType(nextType);
    const nextCategories =
      nextType === "expense" ? EXPENSE_CATEGORIES : INCOME_CATEGORIES;
    if (!nextCategories.includes(category as never)) {
      setCategory(nextCategories[0]);
    }
  };

  const handleDateChange = (
    _event: DateTimePickerEvent,
    selectedDate?: Date,
  ) => {
    setShowDatePicker(Platform.OS === "ios");
    if (selectedDate) {
      setDate(selectedDate);
    }
  };

  const handleOpenDatePicker = () => {
    if (Platform.OS === "web") {
      setWebDateText(toLocalDateString(date));
      setShowWebDatePicker(true);
    } else {
      setShowDatePicker(true);
    }
  };

  const handleSave = () => {
    if (!parsedAmount.ok || !isValid) {
      return;
    }

    addTransaction({
      amount: parsedAmount.value,
      type,
      category,
      date: dateString,
      description: note.trim() || undefined,
    });

    router.back();
  };

  return (
    <ScreenContainer scroll>
      <View style={styles.container}>
        <View style={styles.section}>
          <AppText variant="body" style={styles.sectionLabel}>
            {t("myMoney.addTitle")}
          </AppText>
          <View style={styles.toggleRow}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={t("myMoney.typeExpense")}
              accessibilityState={{ selected: type === "expense" }}
              onPress={() => handleTypeChange("expense")}
              style={[
                styles.toggleButton,
                { minHeight: minTouchHeight },
                type === "expense"
                  ? styles.toggleButtonActive
                  : styles.toggleButtonInactive,
              ]}
            >
              <AppText
                variant="body"
                style={[
                  styles.toggleText,
                  type === "expense"
                    ? styles.toggleTextActive
                    : styles.toggleTextInactive,
                ]}
              >
                {t("myMoney.typeExpense")}
              </AppText>
            </Pressable>

            <Pressable
              accessibilityRole="button"
              accessibilityLabel={t("myMoney.typeIncome")}
              accessibilityState={{ selected: type === "income" }}
              onPress={() => handleTypeChange("income")}
              style={[
                styles.toggleButton,
                { minHeight: minTouchHeight },
                type === "income"
                  ? styles.toggleButtonActive
                  : styles.toggleButtonInactive,
              ]}
            >
              <AppText
                variant="body"
                style={[
                  styles.toggleText,
                  type === "income"
                    ? styles.toggleTextActive
                    : styles.toggleTextInactive,
                ]}
              >
                {t("myMoney.typeIncome")}
              </AppText>
            </Pressable>
          </View>
        </View>

        <AppInput
          label={t("myMoney.amountLabel")}
          placeholder={t("myMoney.amountPlaceholder")}
          keyboardType="decimal-pad"
          value={amountText}
          onChangeText={setAmountText}
          error={amountError}
        />

        <View style={styles.section}>
          <AppText variant="body" style={styles.sectionLabel}>
            {t("myMoney.categoryLabel")}
          </AppText>
          <View style={styles.chipsContainer}>
            {categories.map((cat) => {
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

        <View style={styles.section}>
          <AppText variant="body" style={styles.sectionLabel}>
            {t("myMoney.dateLabel")}
          </AppText>
          <Card style={styles.dateCard}>
            <View style={styles.dateRow}>
              <View style={styles.dateTextContainer}>
                <AppText variant="title">{dateString}</AppText>
              </View>
              <AppButton
                label={t("myMoney.changeDate")}
                accessibilityLabel={t("myMoney.changeDate")}
                icon="calendar-outline"
                variant="secondary"
                onPress={handleOpenDatePicker}
              />
            </View>
          </Card>
          {showDatePicker ? (
            <DateTimePicker
              value={date}
              mode="date"
              display="default"
              onChange={handleDateChange}
            />
          ) : null}

          <Modal
            visible={showWebDatePicker}
            transparent
            animationType="fade"
            onRequestClose={() => setShowWebDatePicker(false)}
          >
            <View style={styles.modalOverlay}>
              <Card style={styles.modalCard}>
                <AppText variant="title" style={styles.modalTitle}>
                  {t("myMoney.changeDate")}
                </AppText>
                <AppInput
                  label={t("myMoney.dateLabel")}
                  placeholder={dateString}
                  value={webDateText}
                  onChangeText={setWebDateText}
                  error={
                    webDateText.trim() !== "" && !isValidDateString(webDateText)
                      ? t("errors.invalid")
                      : undefined
                  }
                />
                <View style={styles.quickDateRow}>
                  <View style={styles.quickDateBtnWrapper}>
                    <AppButton
                      label={t("common.today")}
                      accessibilityLabel={t("common.today")}
                      icon="calendar-outline"
                      variant="secondary"
                      onPress={() => setWebDateText(todayLocal())}
                    />
                  </View>
                </View>
                <View style={styles.modalActionsRow}>
                  <View style={styles.modalActionButton}>
                    <AppButton
                      label={t("common.cancel")}
                      accessibilityLabel={t("common.cancel")}
                      variant="secondary"
                      onPress={() => setShowWebDatePicker(false)}
                    />
                  </View>
                  <View style={styles.modalActionButton}>
                    <AppButton
                      label={t("common.save")}
                      accessibilityLabel={t("common.save")}
                      variant="primary"
                      disabled={!isValidDateString(webDateText)}
                      onPress={() => {
                        if (isValidDateString(webDateText)) {
                          const [y, m, d] = webDateText
                            .split("-")
                            .map((part) => parseInt(part, 10));
                          setDate(new Date(y, m - 1, d, 12, 0, 0));
                          setShowWebDatePicker(false);
                        }
                      }}
                    />
                  </View>
                </View>
              </Card>
            </View>
          </Modal>
        </View>

        <AppInput
          label={t("myMoney.noteLabel")}
          placeholder={t("myMoney.notePlaceholder")}
          hint={t("myMoney.noteDisclaimer")}
          maxLength={MAX_NOTE_LENGTH}
          value={note}
          onChangeText={setNote}
        />

        <View style={styles.actionContainer}>
          <AppButton
            label={t("myMoney.saveTransaction")}
            accessibilityLabel={t("myMoney.saveTransaction")}
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
  section: {
    gap: spacing.xs,
  },
  sectionLabel: {
    fontWeight: "600",
  },
  toggleRow: {
    flexDirection: "row",
    gap: spacing.sm,
  },
  toggleButton: {
    alignItems: "center",
    borderRadius: radii.md,
    borderWidth: 1,
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  toggleButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  toggleButtonInactive: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
  },
  toggleText: {
    fontWeight: "600",
  },
  toggleTextActive: {
    color: colors.onPrimary,
  },
  toggleTextInactive: {
    color: colors.text,
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
  dateCard: {
    padding: spacing.sm,
  },
  dateRow: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  dateTextContainer: {
    flex: 1,
    paddingLeft: spacing.sm,
  },
  actionContainer: {
    marginTop: spacing.sm,
  },
  modalOverlay: {
    alignItems: "center",
    backgroundColor: colors.overlay,
    flex: 1,
    justifyContent: "center",
    padding: spacing.md,
  },
  modalCard: {
    gap: spacing.md,
    maxWidth: 400,
    width: "100%",
  },
  modalTitle: {
    fontWeight: "700",
  },
  quickDateRow: {
    flexDirection: "row",
    justifyContent: "flex-start",
  },
  quickDateBtnWrapper: {
    flex: 1,
  },
  modalActionsRow: {
    flexDirection: "row",
    gap: spacing.sm,
    justifyContent: "flex-end",
  },
  modalActionButton: {
    flex: 1,
  },
});

