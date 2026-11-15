import {
  BUDGET_WARNING_PERCENT,
  EMI_PRINCIPAL_MAX,
  EMI_PRINCIPAL_MIN,
  EMI_RATE_MAX,
  EMI_RATE_MIN,
  EMI_TENURE_MAX_MONTHS,
  EMI_TENURE_MIN_MONTHS,
} from '../constants/limits';
import type {
  BudgetStatusResult,
  EmiResult,
  GoalProgressResult,
  MonthSummaryResult,
  Transaction,
} from '../data/types';
import { monthKeyOf } from './dates';

export function round2(value: number): number {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

export function monthSummary(
  transactions: Transaction[],
  monthKey: string,
): MonthSummaryResult {
  let income = 0;
  let expense = 0;

  for (const t of transactions) {
    if (monthKeyOf(t.date) === monthKey) {
      if (t.type === 'income') {
        income += t.amount;
      } else if (t.type === 'expense') {
        expense += t.amount;
      }
    }
  }

  const roundedIncome = round2(income);
  const roundedExpense = round2(expense);
  const net = round2(roundedIncome - roundedExpense);

  return {
    income: roundedIncome,
    expense: roundedExpense,
    net,
  };
}

export function budgetSpent(
  transactions: Transaction[],
  category: string,
  monthKey: string,
): number {
  let spent = 0;
  for (const t of transactions) {
    if (
      t.type === 'expense' &&
      t.category === category &&
      monthKeyOf(t.date) === monthKey
    ) {
      spent += t.amount;
    }
  }
  return round2(spent);
}

export function budgetStatus(spent: number, limit: number): BudgetStatusResult {
  if (limit <= 0) {
    return {
      status: 'notSet',
      percent: 0,
      remaining: 0,
    };
  }

  const remaining = round2(limit - spent);
  const percent = round2((spent / limit) * 100);

  let status: 'ok' | 'warning' | 'exceeded';
  if (spent > limit) {
    status = 'exceeded';
  } else if (spent * 100 >= limit * BUDGET_WARNING_PERCENT) {
    status = 'warning';
  } else {
    status = 'ok';
  }

  return {
    status,
    percent,
    remaining,
  };
}

export function goalProgress(
  saved: number,
  target: number,
): GoalProgressResult {
  if (target <= 0) {
    return {
      barPercent: 0,
      rawPercent: 0,
      remaining: 0,
      reached: false,
    };
  }

  const rawPercent = round2((saved / target) * 100);
  const barPercent = Math.min(100, Math.max(0, rawPercent));
  const remaining = round2(Math.max(0, target - saved));
  const reached = saved >= target;

  return {
    barPercent,
    rawPercent,
    remaining,
    reached,
  };
}

export function calculateEmi(
  principal: number,
  annualRate: number,
  months: number,
): EmiResult {
  if (
    !Number.isFinite(principal) ||
    principal < EMI_PRINCIPAL_MIN ||
    principal > EMI_PRINCIPAL_MAX
  ) {
    return { ok: false, reason: 'invalidPrincipal' };
  }

  if (
    !Number.isFinite(annualRate) ||
    annualRate < EMI_RATE_MIN ||
    annualRate > EMI_RATE_MAX
  ) {
    return { ok: false, reason: 'invalidRate' };
  }

  if (
    !Number.isInteger(months) ||
    months < EMI_TENURE_MIN_MONTHS ||
    months > EMI_TENURE_MAX_MONTHS
  ) {
    return { ok: false, reason: 'invalidTenure' };
  }

  let rawEmi: number;
  if (annualRate === 0) {
    rawEmi = principal / months;
  } else {
    const r = annualRate / 1200;
    const factor = Math.pow(1 + r, months);
    rawEmi = (principal * r * factor) / (factor - 1);
  }

  const emi = round2(rawEmi);
  const total = round2(emi * months);
  const interest = round2(total - principal);

  return {
    ok: true,
    emi,
    total,
    interest,
  };
}

