export type TransactionType = 'income' | 'expense';

export const EXPENSE_CATEGORIES = [
  'food',
  'transport',
  'home',
  'bills',
  'health',
  'education',
  'shopping',
  'other',
] as const;

export type ExpenseCategory = (typeof EXPENSE_CATEGORIES)[number];

export const INCOME_CATEGORIES = [
  'salary',
  'business',
  'farming',
  'gift',
  'other',
] as const;

export type IncomeCategory = (typeof INCOME_CATEGORIES)[number];

export type TransactionCategory = ExpenseCategory | IncomeCategory;

export interface Transaction {
  id: string;
  amount: number;
  type: TransactionType;
  category: string;
  date: string;
  description?: string;
  createdAt: string;
}

export interface Budget {
  id: string;
  category: string;
  limit: number;
}

export interface SavingsGoal {
  id: string;
  name: string;
  targetAmount: number;
  savedAmount: number;
  targetDate?: string;
}

export interface LessonProgress {
  lessonId: string;
  completed: boolean;
  quizScore?: number;
  updatedAt: string;
}

export type AppLanguage = 'en' | 'hi' | 'mr';

export interface Preferences {
  language: AppLanguage | null;
  simpleMode: boolean;
  largeText: boolean;
}

export interface BudgetView {
  id: string;
  category: string;
  limit: number;
  spent: number;
  remaining: number;
  percent: number;
  status: BudgetStatusType;
  budget: Budget;
}

export interface GoalView {
  id: string;
  name: string;
  targetAmount: number;
  savedAmount: number;
  targetDate?: string;
  barPercent: number;
  rawPercent: number;
  remaining: number;
  reached: boolean;
  goal: SavingsGoal;
}

export type ParseAmountErrorReason =
  | 'empty'
  | 'invalid'
  | 'notPositive'
  | 'tooManyDecimals'
  | 'tooLarge';

export type ParseAmountResult =
  | { ok: true; value: number }
  | { ok: false; reason: ParseAmountErrorReason };

export type BudgetStatusType = 'notSet' | 'ok' | 'warning' | 'exceeded';

export interface BudgetStatusResult {
  status: BudgetStatusType;
  percent: number;
  remaining: number;
}

export interface GoalProgressResult {
  barPercent: number;
  rawPercent: number;
  remaining: number;
  reached: boolean;
}

export interface MonthSummaryResult {
  income: number;
  expense: number;
  net: number;
}

export type EmiResult =
  | { ok: true; emi: number; total: number; interest: number }
  | { ok: false; reason: string };

export interface QuizScoreResult {
  score: number;
  total: number;
}

