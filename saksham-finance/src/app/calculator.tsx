import { useState } from "react";
import { StyleSheet, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { AppButton } from "../components/AppButton";
import { AppInput } from "../components/AppInput";
import { AppText } from "../components/AppText";
import { Banner } from "../components/Banner";
import { Card } from "../components/Card";
import { ScreenContainer } from "../components/ScreenContainer";
import {
  EMI_PRINCIPAL_MIN,
  EMI_RATE_MAX,
  EMI_RATE_MIN,
  EMI_TENURE_MAX_MONTHS,
  EMI_TENURE_MIN_MONTHS,
} from "../constants/limits";
import { colors, fontSizes, spacing } from "../constants/theme";
import { tList } from "../i18n";
import { parseAmount } from "../utils/amount";
import { calculateEmi } from "../utils/calculations";
import { formatINR } from "../utils/currency";

type EmiFigures = {
  emi: number;
  total: number;
  interest: number;
};

const DECIMAL_PATTERN = /^-?\d+(\.\d+)?$/;

function principalErrorKey(text: string): string | null {
  const parsed = parseAmount(text);
  if (parsed.ok) {
    return parsed.value < EMI_PRINCIPAL_MIN
      ? "calculator.errors.principalTooSmall"
      : null;
  }

  switch (parsed.reason) {
    case "empty":
      return "calculator.errors.principalEmpty";
    case "notPositive":
      return "calculator.errors.principalTooSmall";
    case "tooManyDecimals":
      return "calculator.errors.principalTooManyDecimals";
    case "tooLarge":
      return "calculator.errors.principalTooLarge";
    default:
      return "calculator.errors.principalInvalid";
  }
}

function rateErrorKey(text: string): string | null {
  const trimmed = text.trim();
  if (trimmed === "") {
    return "calculator.errors.rateEmpty";
  }
  if (!DECIMAL_PATTERN.test(trimmed)) {
    return "calculator.errors.rateInvalid";
  }

  const value = Number(trimmed);
  if (!Number.isFinite(value)) {
    return "calculator.errors.rateInvalid";
  }
  if (value < EMI_RATE_MIN) {
    return "calculator.errors.rateTooSmall";
  }
  if (value > EMI_RATE_MAX) {
    return "calculator.errors.rateTooLarge";
  }
  return null;
}

function tenureErrorKey(text: string): string | null {
  const trimmed = text.trim();
  if (trimmed === "") {
    return "calculator.errors.tenureEmpty";
  }
  if (!DECIMAL_PATTERN.test(trimmed)) {
    return "calculator.errors.tenureInvalid";
  }

  const value = Number(trimmed);
  if (!Number.isFinite(value)) {
    return "calculator.errors.tenureInvalid";
  }
  if (value < EMI_TENURE_MIN_MONTHS) {
    return "calculator.errors.tenureTooSmall";
  }
  if (value > EMI_TENURE_MAX_MONTHS) {
    return "calculator.errors.tenureTooLarge";
  }
  if (!Number.isInteger(value)) {
    return "calculator.errors.tenureNotWhole";
  }
  return null;
}

export default function CalculatorScreen() {
  const { t } = useTranslation();

  const [principalText, setPrincipalText] = useState("");
  const [rateText, setRateText] = useState("");
  const [tenureText, setTenureText] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState<EmiFigures | null>(null);

  const questions = tList("calculator.checklist");

  const principalError = principalErrorKey(principalText);
  const rateError = rateErrorKey(rateText);
  const tenureError = tenureErrorKey(tenureText);

  const principalErrorMessage =
    principalError !== null && (submitted || principalText.trim() !== "")
      ? t(principalError)
      : undefined;
  const rateErrorMessage =
    rateError !== null && (submitted || rateText.trim() !== "")
      ? t(rateError)
      : undefined;
  const tenureErrorMessage =
    tenureError !== null && (submitted || tenureText.trim() !== "")
      ? t(tenureError)
      : undefined;

  const handlePrincipalChange = (text: string) => {
    setPrincipalText(text);
    setResult(null);
  };

  const handleRateChange = (text: string) => {
    setRateText(text);
    setResult(null);
  };

  const handleTenureChange = (text: string) => {
    setTenureText(text);
    setResult(null);
  };

  const handleCalculate = () => {
    setSubmitted(true);

    const parsedPrincipal = parseAmount(principalText);
    if (
      !parsedPrincipal.ok ||
      parsedPrincipal.value < EMI_PRINCIPAL_MIN ||
      principalError !== null ||
      rateError !== null ||
      tenureError !== null
    ) {
      setResult(null);
      return;
    }

    const annualRate = Number(rateText.trim());
    const months = Number(tenureText.trim());
    const calculated = calculateEmi(
      parsedPrincipal.value,
      annualRate,
      months,
    );

    if (calculated.ok) {
      setResult({
        emi: calculated.emi,
        total: calculated.total,
        interest: calculated.interest,
      });
    } else {
      setResult(null);
    }
  };

  return (
    <ScreenContainer scroll keyboardSafe>
      <View style={styles.container}>
        <AppText variant="body" style={styles.subtitle}>
          {t("calculator.subtitle")}
        </AppText>

        <AppInput
          label={t("calculator.principalLabel")}
          placeholder={t("calculator.principalPlaceholder")}
          keyboardType="decimal-pad"
          value={principalText}
          onChangeText={handlePrincipalChange}
          error={principalErrorMessage}
        />

        <AppInput
          label={t("calculator.rateLabel")}
          placeholder={t("calculator.ratePlaceholder")}
          keyboardType="decimal-pad"
          value={rateText}
          onChangeText={handleRateChange}
          error={rateErrorMessage}
        />

        <AppInput
          label={t("calculator.tenureLabel")}
          placeholder={t("calculator.tenurePlaceholder")}
          keyboardType="decimal-pad"
          value={tenureText}
          onChangeText={handleTenureChange}
          error={tenureErrorMessage}
        />

        <AppButton
          label={t("calculator.calculate")}
          accessibilityLabel={t("calculator.calculate")}
          icon="calculator-outline"
          variant="primary"
          fullWidth
          onPress={handleCalculate}
        />

        {result ? (
          <>
            <Card style={styles.sectionCard}>
              <AppText variant="title">{t("calculator.resultsTitle")}</AppText>
              <View style={styles.resultRow}>
                <AppText variant="body" style={styles.resultLabel}>
                  {t("calculator.monthlyEmi")}
                </AppText>
                <AppText variant="title">{formatINR(result.emi)}</AppText>
              </View>
              <View style={styles.resultRow}>
                <AppText variant="body" style={styles.resultLabel}>
                  {t("calculator.totalRepayment")}
                </AppText>
                <AppText variant="title">{formatINR(result.total)}</AppText>
              </View>
              <View style={styles.resultRow}>
                <AppText variant="body" style={styles.resultLabel}>
                  {t("calculator.totalInterest")}
                </AppText>
                <AppText variant="title">{formatINR(result.interest)}</AppText>
              </View>
            </Card>

            <Banner variant="info" message={t("calculator.estimateNotice")} />
          </>
        ) : null}

        <Card style={styles.sectionCard}>
          <AppText variant="title">{t("calculator.checklistTitle")}</AppText>
          <View style={styles.checklist}>
            {questions.map((question, index) => (
              <View key={index} style={styles.checklistItem}>
                <Ionicons
                  name="help-circle"
                  size={fontSizes.title}
                  color={colors.primary}
                />
                <AppText variant="body" style={styles.checklistBody}>
                  {question}
                </AppText>
              </View>
            ))}
          </View>
        </Card>

        <Banner variant="warning" message={t("calculator.checklistNote")} />
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  subtitle: {
    color: colors.mutedText,
  },
  sectionCard: {
    gap: spacing.sm,
  },
  resultRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: spacing.sm,
    justifyContent: "space-between",
  },
  resultLabel: {
    flexShrink: 1,
  },
  checklist: {
    gap: spacing.md,
  },
  checklistItem: {
    alignItems: "flex-start",
    flexDirection: "row",
    gap: spacing.sm,
  },
  checklistBody: {
    flex: 1,
  },
});
