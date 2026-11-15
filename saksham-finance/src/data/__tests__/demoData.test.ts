import {
  demoBudgets,
  demoData,
  demoGoals,
  getDemoData,
  getDemoTransactions,
} from "../demoData";
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES } from "../types";
import { currentMonthKey, isValidDateString, monthKeyOf } from "../../utils/dates";

describe("demoData", () => {
  it("exports about 8 transactions in the current month with no notes", () => {
    const transactions = getDemoTransactions();
    expect(transactions).toHaveLength(8);

    const thisMonth = currentMonthKey();
    const validCategories = new Set<string>([
      ...EXPENSE_CATEGORIES,
      ...INCOME_CATEGORIES,
    ]);

    for (const tx of transactions) {
      expect(isValidDateString(tx.date)).toBe(true);
      expect(monthKeyOf(tx.date)).toBe(thisMonth);
      expect(tx.description).toBeUndefined();
      expect(validCategories.has(tx.category)).toBe(true);
      expect(tx.amount).toBeGreaterThan(0);
      expect(tx.type === "income" || tx.type === "expense").toBe(true);
    }
  });

  it("exports 2 budgets for food and transport", () => {
    expect(demoBudgets).toHaveLength(2);
    const categories = demoBudgets.map((b) => b.category);
    expect(categories).toContain("food");
    expect(categories).toContain("transport");

    for (const budget of demoBudgets) {
      expect(budget.limit).toBeGreaterThan(0);
    }
  });

  it("exports 1 savings goal with positive target and saved amounts", () => {
    expect(demoGoals).toHaveLength(1);
    const [goal] = demoGoals;
    expect(goal.targetAmount).toBeGreaterThan(0);
    expect(goal.savedAmount).toBeGreaterThan(0);
    expect(goal.name).toBe("demoData.emergencyGoal");
  });

  it("provides getDemoData and demoData object consistency", () => {
    const data = getDemoData();
    expect(data.transactions).toHaveLength(8);
    expect(data.budgets).toHaveLength(2);
    expect(data.goals).toHaveLength(1);

    expect(demoData.transactions).toHaveLength(8);
    expect(demoData.budgets).toHaveLength(2);
    expect(demoData.goals).toHaveLength(1);
  });
});
