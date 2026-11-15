import { useMemo, useState } from "react";
import {
  Alert,
  FlatList,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { AppButton } from "../../components/AppButton";
import { AppText } from "../../components/AppText";
import { Banner } from "../../components/Banner";
import { Card } from "../../components/Card";
import { EmptyState } from "../../components/EmptyState";
import { ProgressBar } from "../../components/ProgressBar";
import { ScreenContainer } from "../../components/ScreenContainer";
import { MIN_TOUCH_DP, SIMPLE_TOUCH_DP } from "../../constants/limits";
import { colors, fontSizes, radii, spacing } from "../../constants/theme";
import {
  useBudgetViews,
  useFinance,
  useGoalViews,
  useMonthSummary,
} from "../../context/FinanceContext";
import { usePreferences } from "../../context/PreferencesContext";
import type { BudgetView, GoalView, Transaction } from "../../data/types";
import { formatINR, formatPercent } from "../../utils/currency";
import { currentMonthKey } from "../../utils/dates";

type ActiveTab = "transactions" | "budgets" | "goals";

const STATUS_ICONS: Record<string, keyof typeof Ionicons.glyphMap> = {
  ok: "checkmark-circle-outline",
  warning: "warning-outline",
  exceeded: "alert-circle-outline",
  notSet: "remove-circle-outline",
};

const STATUS_COLORS: Record<string, string> = {
  ok: colors.success,
  warning: colors.warning,
  exceeded: colors.danger,
  notSet: colors.mutedText,
};

const STATUS_KEYS: Record<string, string> = {
  ok: "myMoney.budgetStatusOk",
  warning: "myMoney.budgetStatusWarning",
  exceeded: "myMoney.budgetStatusExceeded",
  notSet: "myMoney.budgetStatusNotSet",
};

export default function MyMoneyScreen() {
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const { transactions, deleteTransaction } = useFinance();
  const { simpleMode } = usePreferences();

  const [activeTab, setActiveTab] = useState<ActiveTab>("transactions");
  const [showMoreTools, setShowMoreTools] = useState(false);
  const [viewedMonth, setViewedMonth] = useState<string>(() =>
    currentMonthKey(),
  );
  const [deletingTransaction, setDeletingTransaction] =
    useState<Transaction | null>(null);

  const summary = useMonthSummary(viewedMonth);
  const budgetViews = useBudgetViews(viewedMonth);
  const goalViews = useGoalViews();
  const minTouchHeight = simpleMode ? SIMPLE_TOUCH_DP : MIN_TOUCH_DP;

  const sortedTransactions = useMemo(() => {
    return [...transactions].sort((a, b) => {
      const dateCmp = b.date.localeCompare(a.date);
      if (dateCmp !== 0) {
        return dateCmp;
      }
      return (b.createdAt || "").localeCompare(a.createdAt || "");
    });
  }, [transactions]);

  const handlePrevMonth = () => {
    setViewedMonth((prev) => {
      const [yearStr, monthStr] = prev.split("-");
      let year = parseInt(yearStr, 10);
      let month = parseInt(monthStr, 10) - 1;
      if (month < 1) {
        month = 12;
        year -= 1;
      }
      return `${year}-${month.toString().padStart(2, "0")}`;
    });
  };

  const handleNextMonth = () => {
    setViewedMonth((prev) => {
      const [yearStr, monthStr] = prev.split("-");
      let year = parseInt(yearStr, 10);
      let month = parseInt(monthStr, 10) + 1;
      if (month > 12) {
        month = 1;
        year += 1;
      }
      return `${year}-${month.toString().padStart(2, "0")}`;
    });
  };

  const handleDelete = (item: Transaction) => {
    if (Platform.OS === "web") {
      setDeletingTransaction(item);
      return;
    }

    Alert.alert(
      t("myMoney.deleteConfirmTitle"),
      t("myMoney.deleteConfirmMessage"),
      [
        {
          text: t("common.cancel"),
          style: "cancel",
        },
        {
          text: t("common.delete"),
          style: "destructive",
          onPress: () => deleteTransaction(item.id),
        },
      ],
    );
  };

  const renderSectionTabs = () => {
    const showAllTabs = !simpleMode || showMoreTools;

    return (
      <View style={styles.tabContainer}>
        {showAllTabs ? (
          <View style={styles.tabButtonsRow}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={t("myMoney.tabTransactions")}
              accessibilityState={{ selected: activeTab === "transactions" }}
              onPress={() => setActiveTab("transactions")}
              style={[
                styles.tabButton,
                { minHeight: minTouchHeight },
                activeTab === "transactions"
                  ? styles.tabButtonActive
                  : styles.tabButtonInactive,
              ]}
            >
              <AppText
                variant="body"
                style={[
                  styles.tabButtonText,
                  activeTab === "transactions"
                    ? styles.tabButtonTextActive
                    : styles.tabButtonTextInactive,
                ]}
              >
                {t("myMoney.tabTransactions")}
              </AppText>
            </Pressable>

            <Pressable
              accessibilityRole="button"
              accessibilityLabel={t("myMoney.tabBudgets")}
              accessibilityState={{ selected: activeTab === "budgets" }}
              onPress={() => setActiveTab("budgets")}
              style={[
                styles.tabButton,
                { minHeight: minTouchHeight },
                activeTab === "budgets"
                  ? styles.tabButtonActive
                  : styles.tabButtonInactive,
              ]}
            >
              <AppText
                variant="body"
                style={[
                  styles.tabButtonText,
                  activeTab === "budgets"
                    ? styles.tabButtonTextActive
                    : styles.tabButtonTextInactive,
                ]}
              >
                {t("myMoney.tabBudgets")}
              </AppText>
            </Pressable>

            <Pressable
              accessibilityRole="button"
              accessibilityLabel={t("myMoney.tabGoals")}
              accessibilityState={{ selected: activeTab === "goals" }}
              onPress={() => setActiveTab("goals")}
              style={[
                styles.tabButton,
                { minHeight: minTouchHeight },
                activeTab === "goals"
                  ? styles.tabButtonActive
                  : styles.tabButtonInactive,
              ]}
            >
              <AppText
                variant="body"
                style={[
                  styles.tabButtonText,
                  activeTab === "goals"
                    ? styles.tabButtonTextActive
                    : styles.tabButtonTextInactive,
                ]}
              >
                {t("myMoney.tabGoals")}
              </AppText>
            </Pressable>
          </View>
        ) : null}

        {simpleMode ? (
          <AppButton
            label={
              showMoreTools
                ? t("myMoney.hideMoreTools")
                : t("myMoney.moreTools")
            }
            accessibilityLabel={
              showMoreTools
                ? t("myMoney.hideMoreTools")
                : t("myMoney.moreTools")
            }
            variant="secondary"
            icon={showMoreTools ? "chevron-up" : "grid-outline"}
            onPress={() => {
              if (showMoreTools) {
                setActiveTab("transactions");
              }
              setShowMoreTools(!showMoreTools);
            }}
          />
        ) : null}
      </View>
    );
  };

  const renderSummaryCard = () => (
    <Card style={styles.summaryCard}>
      <View style={styles.monthHeaderRow}>
        <AppText variant="title" style={styles.summaryTitle}>
          {t("myMoney.summaryTitle")}
        </AppText>
        <View style={styles.monthControls}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={t("myMoney.prevMonth")}
            onPress={handlePrevMonth}
            style={[
              styles.monthArrowButton,
              { minHeight: minTouchHeight, minWidth: minTouchHeight },
            ]}
          >
            <Ionicons
              name="chevron-back"
              size={fontSizes.title}
              color={colors.primary}
            />
          </Pressable>
          <AppText variant="body" style={styles.viewedMonthText}>
            {viewedMonth}
          </AppText>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={t("myMoney.nextMonth")}
            onPress={handleNextMonth}
            style={[
              styles.monthArrowButton,
              { minHeight: minTouchHeight, minWidth: minTouchHeight },
            ]}
          >
            <Ionicons
              name="chevron-forward"
              size={fontSizes.title}
              color={colors.primary}
            />
          </Pressable>
        </View>
      </View>

      <View style={styles.summaryMetricsRow}>
        <View style={styles.metricBlock}>
          <AppText variant="caption" style={styles.metricLabel}>
            {t("myMoney.incomeLabel")}
          </AppText>
          <AppText variant="title" style={styles.incomeMetricText}>
            {formatINR(summary.income)}
          </AppText>
        </View>

        <View style={styles.metricBlock}>
          <AppText variant="caption" style={styles.metricLabel}>
            {t("myMoney.expenseLabel")}
          </AppText>
          <AppText variant="title" style={styles.expenseMetricText}>
            {formatINR(summary.expense)}
          </AppText>
        </View>

        <View style={styles.metricBlock}>
          <AppText variant="caption" style={styles.metricLabel}>
            {t("myMoney.netTrackedLabel")}
          </AppText>
          <AppText variant="title" style={styles.netMetricText}>
            {formatINR(summary.net)}
          </AppText>
        </View>
      </View>

      <View style={styles.disclaimerContainer}>
        <Ionicons
          name="information-circle-outline"
          size={fontSizes.body}
          color={colors.mutedText}
        />
        <AppText variant="caption" style={styles.disclaimerText}>
          {t("myMoney.demoDisclaimer")}
        </AppText>
      </View>
    </Card>
  );

  const renderTransactionItem = ({ item }: { item: Transaction }) => {
    const isIncome = item.type === "income";
    const categoryName = t(`categories.${item.category}`);
    const amountStr = formatINR(item.amount);

    return (
      <Card style={styles.transactionCard}>
        <View style={styles.transactionMain}>
          <View style={styles.transactionDetails}>
            <View style={styles.categoryBadgeRow}>
              <AppText variant="title">{categoryName}</AppText>
              <View
                style={[
                  styles.typeBadge,
                  isIncome
                    ? styles.incomeTypeBadge
                    : styles.expenseTypeBadge,
                ]}
              >
                <AppText
                  variant="caption"
                  style={[
                    styles.typeBadgeText,
                    isIncome
                      ? styles.incomeTypeBadgeText
                      : styles.expenseTypeBadgeText,
                  ]}
                >
                  {isIncome
                    ? t("myMoney.typeIncome")
                    : t("myMoney.typeExpense")}
                </AppText>
              </View>
            </View>

            {item.description ? (
              <AppText variant="body" style={styles.transactionNote}>
                {item.description}
              </AppText>
            ) : null}

            <AppText variant="caption" style={styles.transactionDate}>
              {item.date}
            </AppText>
          </View>

          <View style={styles.transactionAmountSection}>
            <AppText
              variant="title"
              style={
                isIncome
                  ? styles.incomeAmountText
                  : styles.expenseAmountText
              }
            >
              {amountStr}
            </AppText>

            <AppButton
              icon="trash-outline"
              label={t("common.delete")}
              accessibilityLabel={t("myMoney.deleteA11y", {
                category: categoryName,
                amount: amountStr,
              })}
              variant="danger"
              onPress={() => handleDelete(item)}
            />
          </View>
        </View>
      </Card>
    );
  };

  const renderBudgetCard = ({ item }: { item: BudgetView }) => {
    const categoryName = t(`categories.${item.category}`);
    const statusText = t(STATUS_KEYS[item.status]);
    const statusColor = STATUS_COLORS[item.status];
    const statusIcon = STATUS_ICONS[item.status];
    const showWarningBanner =
      item.status === "warning" || item.status === "exceeded";
    const showOverBy = item.status === "exceeded";

    return (
      <Card style={styles.budgetCard}>
        <View style={styles.budgetHeader}>
          <AppText variant="title">{categoryName}</AppText>
          <View style={styles.statusRow}>
            <Ionicons
              name={statusIcon}
              size={fontSizes.body}
              color={statusColor}
            />
            <AppText
              variant="body"
              style={[styles.statusText, { color: statusColor }]}
            >
              {statusText}
            </AppText>
          </View>
        </View>

        <View style={styles.budgetMetrics}>
          <View style={styles.budgetMetricItem}>
            <AppText variant="caption" style={styles.metricLabel}>
              {t("myMoney.budgetSpentLabel")}
            </AppText>
            <AppText variant="body" style={styles.budgetMetricValue}>
              {formatINR(item.spent)}
            </AppText>
          </View>
          <View style={styles.budgetMetricItem}>
            <AppText variant="caption" style={styles.metricLabel}>
              {t("myMoney.budgetLimitShortLabel")}
            </AppText>
            <AppText variant="body" style={styles.budgetMetricValue}>
              {formatINR(item.limit)}
            </AppText>
          </View>
          <View style={styles.budgetMetricItem}>
            <AppText variant="caption" style={styles.metricLabel}>
              {t("myMoney.budgetRemainingLabel")}
            </AppText>
            <AppText variant="body" style={styles.budgetMetricValue}>
              {formatINR(item.remaining)}
            </AppText>
          </View>
        </View>

        <ProgressBar
          value={item.percent}
          text={formatPercent(item.percent)}
        />

        {showOverBy ? (
          <AppText variant="body" style={styles.overByText}>
            {t("myMoney.budgetOverBy", {
              amount: formatINR(Math.abs(item.remaining)),
            })}
          </AppText>
        ) : null}

        {showWarningBanner ? (
          <Banner
            variant="warning"
            message={t("myMoney.budgetWarningBanner", {
              percent: formatPercent(item.percent),
              category: categoryName,
            })}
          />
        ) : null}

        <AppButton
          label={t("myMoney.budgetEditTitle")}
          accessibilityLabel={t("myMoney.budgetEditTitle")}
          icon="create-outline"
          variant="secondary"
          onPress={() =>
            router.push({
              pathname: "/budget/edit",
              params: { budgetId: item.id },
            })
          }
        />
      </Card>
    );
  };

  const renderGoalCard = ({ item }: { item: GoalView }) => {
    const goalDisplayName = i18n.exists(item.name) ? t(item.name) : item.name;
    return (
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={goalDisplayName}
        onPress={() => router.push({
              pathname: "/savings/[id]",
              params: { id: item.id },
            })}
      >
        <Card style={styles.goalCard}>
          <AppText variant="title">{goalDisplayName}</AppText>

          <View style={styles.goalMetrics}>
            <View style={styles.goalMetricItem}>
              <AppText variant="caption" style={styles.metricLabel}>
                {t("myMoney.goalSavedLabel")}
              </AppText>
              <AppText variant="body" style={styles.goalMetricValue}>
                {formatINR(item.savedAmount)}
              </AppText>
            </View>
            <View style={styles.goalMetricItem}>
              <AppText variant="caption" style={styles.metricLabel}>
                {t("myMoney.goalTargetLabel")}
              </AppText>
              <AppText variant="body" style={styles.goalMetricValue}>
                {formatINR(item.targetAmount)}
              </AppText>
            </View>
            <View style={styles.goalMetricItem}>
              <AppText variant="caption" style={styles.metricLabel}>
                {t("myMoney.goalRemainingLabel")}
              </AppText>
              <AppText variant="body" style={styles.goalMetricValue}>
                {formatINR(item.remaining)}
              </AppText>
            </View>
          </View>

          <ProgressBar
            value={item.barPercent}
            text={formatPercent(item.rawPercent)}
          />

          {item.reached ? (
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
      </Pressable>
    );
  };

  const renderTransactionsHeader = () => (
    <View style={styles.transactionsHeader}>
      {renderSectionTabs()}
      {renderSummaryCard()}
      <AppButton
        label={t("myMoney.addTransaction")}
        accessibilityLabel={t("myMoney.addTransaction")}
        icon="add"
        variant="primary"
        fullWidth
        onPress={() => router.push("/transaction/add")}
      />
    </View>
  );

  const renderTransactionsEmpty = () => (
    <EmptyState
      icon="wallet-outline"
      title={t("myMoney.emptyTransactionsTitle")}
      message={t("myMoney.emptyTransactionsMessage")}
      style={styles.emptyContainer}
    />
  );

  if (activeTab === "budgets") {
    return (
      <ScreenContainer>
        <FlatList
          data={budgetViews}
          keyExtractor={(item) => item.id}
          renderItem={renderBudgetCard}
          ListHeaderComponent={
            <View style={styles.budgetListHeader}>
              {renderSectionTabs()}
              <AppButton
                label={t("myMoney.addBudget")}
                accessibilityLabel={t("myMoney.addBudget")}
                icon="add"
                variant="primary"
                fullWidth
                onPress={() => router.push("/budget/edit")}
              />
            </View>
          }
          ListEmptyComponent={
            <EmptyState
              icon="pie-chart-outline"
              title={t("myMoney.emptyBudgetsTitle")}
              message={t("myMoney.emptyBudgetsMessage")}
              style={styles.emptyContainer}
            />
          }
          contentContainerStyle={styles.listContent}
        />
      </ScreenContainer>
    );
  }

  if (activeTab === "goals") {
    return (
      <ScreenContainer>
        <FlatList
          data={goalViews}
          keyExtractor={(item) => item.id}
          renderItem={renderGoalCard}
          ListHeaderComponent={
            <View style={styles.goalListHeader}>
              {renderSectionTabs()}
              <AppButton
                label={t("myMoney.addGoal")}
                accessibilityLabel={t("myMoney.addGoal")}
                icon="add"
                variant="primary"
                fullWidth
                onPress={() => router.push("/savings/create")}
              />
            </View>
          }
          ListEmptyComponent={
            <EmptyState
              icon="flag-outline"
              title={t("myMoney.emptyGoalsTitle")}
              message={t("myMoney.emptyGoalsMessage")}
              style={styles.emptyContainer}
            />
          }
          contentContainerStyle={styles.listContent}
        />
      </ScreenContainer>
    );
  }

  const renderDeleteConfirmModal = () => (
    <Modal
      visible={deletingTransaction !== null}
      transparent
      animationType="fade"
      onRequestClose={() => setDeletingTransaction(null)}
    >
      <View style={styles.modalOverlay}>
        <Card style={styles.modalCard}>
          <AppText variant="title" style={styles.modalTitle}>
            {t("myMoney.deleteConfirmTitle")}
          </AppText>
          <AppText variant="body" style={styles.modalMessage}>
            {t("myMoney.deleteConfirmMessage")}
          </AppText>
          <View style={styles.modalActionsRow}>
            <View style={styles.modalActionButton}>
              <AppButton
                label={t("common.cancel")}
                accessibilityLabel={t("common.cancel")}
                variant="secondary"
                onPress={() => setDeletingTransaction(null)}
              />
            </View>
            <View style={styles.modalActionButton}>
              <AppButton
                label={t("common.delete")}
                accessibilityLabel={t("common.delete")}
                variant="danger"
                onPress={() => {
                  if (deletingTransaction) {
                    deleteTransaction(deletingTransaction.id);
                  }
                  setDeletingTransaction(null);
                }}
              />
            </View>
          </View>
        </Card>
      </View>
    </Modal>
  );

  return (
    <ScreenContainer>
      <FlatList
        data={sortedTransactions}
        keyExtractor={(item) => item.id}
        renderItem={renderTransactionItem}
        ListHeaderComponent={renderTransactionsHeader}
        ListEmptyComponent={renderTransactionsEmpty}
        contentContainerStyle={styles.listContent}
      />
      {renderDeleteConfirmModal()}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  listContent: {
    gap: spacing.md,
    paddingBottom: spacing.xxl,
  },
  tabContainer: {
    gap: spacing.sm,
  },
  tabButtonsRow: {
    flexDirection: "row",
    gap: spacing.sm,
  },
  tabButton: {
    alignItems: "center",
    borderRadius: radii.md,
    borderWidth: 1,
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.sm,
  },
  tabButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  tabButtonInactive: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
  },
  tabButtonText: {
    fontWeight: "600",
  },
  tabButtonTextActive: {
    color: colors.onPrimary,
  },
  tabButtonTextInactive: {
    color: colors.text,
  },
  transactionsHeader: {
    gap: spacing.md,
    marginBottom: spacing.sm,
  },
  budgetListHeader: {
    gap: spacing.md,
    marginBottom: spacing.sm,
  },
  goalListHeader: {
    gap: spacing.md,
    marginBottom: spacing.sm,
  },
  summaryCard: {
    gap: spacing.md,
  },
  summaryTitle: {
    fontWeight: "700",
  },
  monthHeaderRow: {
    alignItems: "center",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  monthControls: {
    alignItems: "center",
    flexDirection: "row",
    gap: spacing.xs,
  },
  monthArrowButton: {
    alignItems: "center",
    backgroundColor: colors.background,
    borderRadius: radii.sm,
    justifyContent: "center",
  },
  viewedMonthText: {
    fontWeight: "600",
    paddingHorizontal: spacing.xs,
  },
  summaryMetricsRow: {
    flexDirection: "row",
    gap: spacing.sm,
    justifyContent: "space-between",
  },
  metricBlock: {
    alignItems: "center",
    backgroundColor: colors.background,
    borderRadius: radii.md,
    flex: 1,
    paddingHorizontal: spacing.xs,
    paddingVertical: spacing.sm,
  },
  metricLabel: {
    color: colors.mutedText,
    marginBottom: spacing.xs,
    textAlign: "center",
  },
  incomeMetricText: {
    color: colors.success,
    fontWeight: "700",
    textAlign: "center",
  },
  expenseMetricText: {
    color: colors.danger,
    fontWeight: "700",
    textAlign: "center",
  },
  netMetricText: {
    color: colors.text,
    fontWeight: "700",
    textAlign: "center",
  },
  disclaimerContainer: {
    alignItems: "center",
    flexDirection: "row",
    gap: spacing.xs,
  },
  disclaimerText: {
    color: colors.mutedText,
    flex: 1,
  },
  emptyContainer: {
    paddingVertical: spacing.xl,
  },
  transactionCard: {
    gap: spacing.sm,
  },
  transactionMain: {
    flexDirection: "row",
    gap: spacing.md,
    justifyContent: "space-between",
  },
  transactionDetails: {
    flex: 1,
    gap: spacing.xs,
  },
  categoryBadgeRow: {
    alignItems: "center",
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
  },
  typeBadge: {
    borderRadius: radii.sm,
    borderWidth: 1,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
  },
  incomeTypeBadge: {
    backgroundColor: colors.background,
    borderColor: colors.success,
  },
  expenseTypeBadge: {
    backgroundColor: colors.background,
    borderColor: colors.danger,
  },
  typeBadgeText: {
    fontWeight: "600",
  },
  incomeTypeBadgeText: {
    color: colors.success,
  },
  expenseTypeBadgeText: {
    color: colors.danger,
  },
  transactionNote: {
    color: colors.mutedText,
  },
  transactionDate: {
    color: colors.mutedText,
  },
  transactionAmountSection: {
    alignItems: "flex-end",
    gap: spacing.sm,
    justifyContent: "space-between",
  },
  incomeAmountText: {
    color: colors.success,
    fontWeight: "700",
  },
  expenseAmountText: {
    color: colors.danger,
    fontWeight: "700",
  },
  budgetCard: {
    gap: spacing.sm,
  },
  budgetHeader: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
    justifyContent: "space-between",
  },
  statusRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: spacing.xs,
  },
  statusText: {
    fontWeight: "600",
  },
  budgetMetrics: {
    flexDirection: "row",
    gap: spacing.sm,
  },
  budgetMetricItem: {
    alignItems: "center",
    backgroundColor: colors.background,
    borderRadius: radii.md,
    flex: 1,
    paddingHorizontal: spacing.xs,
    paddingVertical: spacing.sm,
  },
  budgetMetricValue: {
    fontWeight: "600",
  },
  overByText: {
    color: colors.danger,
    fontWeight: "600",
  },
  goalCard: {
    gap: spacing.sm,
  },
  goalMetrics: {
    flexDirection: "row",
    gap: spacing.sm,
  },
  goalMetricItem: {
    alignItems: "center",
    backgroundColor: colors.background,
    borderRadius: radii.md,
    flex: 1,
    paddingHorizontal: spacing.xs,
    paddingVertical: spacing.sm,
  },
  goalMetricValue: {
    fontWeight: "600",
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
  modalMessage: {
    color: colors.text,
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
