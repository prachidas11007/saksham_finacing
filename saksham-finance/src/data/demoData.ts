import type { Budget, SavingsGoal, Transaction } from './types';
import { todayLocal } from '../utils/dates';

function getDemoDate(day: number): string {
  const [year, month] = todayLocal().split('-');
  const safeDay = Math.max(1, Math.min(28, day)).toString().padStart(2, '0');
  return `${year}-${month}-${safeDay}`;
}

export const demoBudgets: Budget[] = [
  {
    id: 'demo-b-food',
    category: 'food',
    limit: 4000,
  },
  {
    id: 'demo-b-transport',
    category: 'transport',
    limit: 1500,
  },
];

export const demoGoals: SavingsGoal[] = [
  {
    id: 'demo-g-emergency',
    name: 'demoData.emergencyGoal',
    targetAmount: 10000,
    savedAmount: 3500,
  },
];

export function getDemoTransactions(): Transaction[] {
  const today = todayLocal();
  return [
    {
      id: 'demo-tx-1',
      amount: 15000,
      type: 'income',
      category: 'salary',
      date: getDemoDate(2),
      createdAt: today,
    },
    {
      id: 'demo-tx-2',
      amount: 1200,
      type: 'expense',
      category: 'food',
      date: getDemoDate(4),
      createdAt: today,
    },
    {
      id: 'demo-tx-3',
      amount: 350,
      type: 'expense',
      category: 'transport',
      date: getDemoDate(6),
      createdAt: today,
    },
    {
      id: 'demo-tx-4',
      amount: 3000,
      type: 'income',
      category: 'business',
      date: getDemoDate(8),
      createdAt: today,
    },
    {
      id: 'demo-tx-5',
      amount: 450,
      type: 'expense',
      category: 'food',
      date: getDemoDate(10),
      createdAt: today,
    },
    {
      id: 'demo-tx-6',
      amount: 600,
      type: 'expense',
      category: 'bills',
      date: getDemoDate(12),
      createdAt: today,
    },
    {
      id: 'demo-tx-7',
      amount: 250,
      type: 'expense',
      category: 'transport',
      date: getDemoDate(13),
      createdAt: today,
    },
    {
      id: 'demo-tx-8',
      amount: 400,
      type: 'expense',
      category: 'health',
      date: getDemoDate(14),
      createdAt: today,
    },
  ];
}

export function getDemoData(): {
  transactions: Transaction[];
  budgets: Budget[];
  goals: SavingsGoal[];
} {
  return {
    transactions: getDemoTransactions(),
    budgets: [...demoBudgets],
    goals: [...demoGoals],
  };
}

export const demoData = {
  get transactions(): Transaction[] {
    return getDemoTransactions();
  },
  budgets: demoBudgets,
  goals: demoGoals,
};
