import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  EXPENSE_CATEGORIES,
  INCOME_CATEGORIES,
  type Budget,
  type LessonProgress,
  type SavingsGoal,
  type Transaction,
} from '../data/types';
import { isValidDateString } from './dates';

export const STORAGE_KEYS = {
  transactions: 'saksham:v1:transactions',
  budgets: 'saksham:v1:budgets',
  goals: 'saksham:v1:goals',
  progress: 'saksham:v1:progress',
  preferences: 'saksham:v1:preferences',
} as const;

export async function loadJSON<T>(
  key: string,
  fallback: T,
  validate?: (data: unknown) => boolean,
): Promise<T> {
  try {
    const raw = await AsyncStorage.getItem(key);
    if (raw === null || raw === undefined) {
      return fallback;
    }
    const parsed: unknown = JSON.parse(raw);
    if (validate && !validate(parsed)) {
      return fallback;
    }
    return parsed as T;
  } catch {
    return fallback;
  }
}

export async function saveJSON<T>(key: string, value: T): Promise<boolean> {
  try {
    const serialized = JSON.stringify(value);
    await AsyncStorage.setItem(key, serialized);
    return true;
  } catch {
    return false;
  }
}

export async function removeKeys(
  keys: readonly string[] | string[],
): Promise<boolean> {
  try {
    if (!keys || keys.length === 0) {
      return true;
    }
    await AsyncStorage.multiRemove([...keys]);
    return true;
  } catch {
    return false;
  }
}

export function isValidTransaction(item: unknown): item is Transaction {
  if (!item || typeof item !== 'object') {
    return false;
  }
  const candidate = item as Record<string, unknown>;
  if (typeof candidate.id !== 'string' || candidate.id.trim() === '') {
    return false;
  }
  if (
    typeof candidate.amount !== 'number' ||
    !Number.isFinite(candidate.amount) ||
    candidate.amount <= 0
  ) {
    return false;
  }
  if (candidate.type !== 'income' && candidate.type !== 'expense') {
    return false;
  }
  if (
    typeof candidate.date !== 'string' ||
    !isValidDateString(candidate.date)
  ) {
    return false;
  }
  if (typeof candidate.category !== 'string') {
    return false;
  }
  if (candidate.type === 'expense') {
    if (!(EXPENSE_CATEGORIES as readonly string[]).includes(candidate.category)) {
      return false;
    }
  } else {
    if (!(INCOME_CATEGORIES as readonly string[]).includes(candidate.category)) {
      return false;
    }
  }
  if (
    candidate.description !== undefined &&
    typeof candidate.description !== 'string'
  ) {
    return false;
  }
  if (
    candidate.createdAt !== undefined &&
    typeof candidate.createdAt !== 'string'
  ) {
    return false;
  }
  return true;
}

export function filterValidTransactions(items: unknown): Transaction[] {
  if (!Array.isArray(items)) {
    return [];
  }
  return items.filter(isValidTransaction);
}

export function isValidBudget(item: unknown): item is Budget {
  if (!item || typeof item !== 'object') {
    return false;
  }
  const candidate = item as Record<string, unknown>;
  if (typeof candidate.id !== 'string' || candidate.id.trim() === '') {
    return false;
  }
  if (
    typeof candidate.category !== 'string' ||
    !(EXPENSE_CATEGORIES as readonly string[]).includes(candidate.category)
  ) {
    return false;
  }
  if (
    typeof candidate.limit !== 'number' ||
    !Number.isFinite(candidate.limit) ||
    candidate.limit <= 0
  ) {
    return false;
  }
  return true;
}

export function filterValidBudgets(items: unknown): Budget[] {
  if (!Array.isArray(items)) {
    return [];
  }
  const valid = items.filter(isValidBudget);
  const seenCategories = new Set<string>();
  const deduplicated: Budget[] = [];
  for (const b of valid) {
    if (!seenCategories.has(b.category)) {
      seenCategories.add(b.category);
      deduplicated.push(b);
    }
  }
  return deduplicated;
}

export function isValidGoal(item: unknown): item is SavingsGoal {
  if (!item || typeof item !== 'object') {
    return false;
  }
  const candidate = item as Record<string, unknown>;
  if (typeof candidate.id !== 'string' || candidate.id.trim() === '') {
    return false;
  }
  if (typeof candidate.name !== 'string' || candidate.name.trim() === '') {
    return false;
  }
  if (
    typeof candidate.targetAmount !== 'number' ||
    !Number.isFinite(candidate.targetAmount) ||
    candidate.targetAmount <= 0
  ) {
    return false;
  }
  if (
    typeof candidate.savedAmount !== 'number' ||
    !Number.isFinite(candidate.savedAmount) ||
    candidate.savedAmount < 0
  ) {
    return false;
  }
  if (
    candidate.targetDate !== undefined &&
    typeof candidate.targetDate !== 'string'
  ) {
    return false;
  }
  return true;
}

export function filterValidGoals(items: unknown): SavingsGoal[] {
  if (!Array.isArray(items)) {
    return [];
  }
  return items.filter(isValidGoal);
}

export function filterValidProgress(
  data: unknown,
): Record<string, LessonProgress> {
  if (!data || typeof data !== 'object' || Array.isArray(data)) {
    return {};
  }
  const result: Record<string, LessonProgress> = {};
  for (const [key, val] of Object.entries(data as Record<string, unknown>)) {
    if (val && typeof val === 'object' && !Array.isArray(val)) {
      const p = val as Record<string, unknown>;
      if (typeof p.completed === 'boolean') {
        const item: LessonProgress = {
          lessonId:
            typeof p.lessonId === 'string' && p.lessonId ? p.lessonId : key,
          completed: p.completed,
          updatedAt: typeof p.updatedAt === 'string' ? p.updatedAt : '',
        };
        if (typeof p.quizScore === 'number' && Number.isFinite(p.quizScore)) {
          item.quizScore = p.quizScore;
        }
        result[key] = item;
      }
    }
  }
  return result;
}

