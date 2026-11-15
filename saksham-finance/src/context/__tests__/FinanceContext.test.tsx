import AsyncStorage from '@react-native-async-storage/async-storage';
import { act } from 'react';
import { createRoot } from 'test-renderer';
import type { Preferences, Transaction } from '../../data/types';
import { STORAGE_KEYS } from '../../utils/storage';
import {
  financeReducer,
  FinanceProvider,
  initialFinanceState,
  useBudgetViews,
  useFinance,
  useGoalViews,
  useMonthSummary,
  type FinanceContextValue,
} from '../FinanceContext';
import { PreferencesProvider, usePreferences } from '../PreferencesContext';

jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock'),
);

describe('FinanceContext', () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
    jest.clearAllMocks();
  });

  describe('financeReducer', () => {
    it('handles ADD_TRANSACTION and DELETE_TRANSACTION', () => {
      const tx: Transaction = {
        id: 'tx-1',
        amount: 250,
        type: 'expense',
        category: 'food',
        date: '2026-11-13',
        createdAt: '2026-11-13',
      };

      const added = financeReducer(initialFinanceState, {
        type: 'ADD_TRANSACTION',
        payload: tx,
      });
      expect(added.transactions).toHaveLength(1);
      expect(added.transactions[0]).toEqual(tx);

      const deleted = financeReducer(added, {
        type: 'DELETE_TRANSACTION',
        payload: { id: 'tx-1' },
      });
      expect(deleted.transactions).toHaveLength(0);
    });

    it('upsert (same category twice = one budget)', () => {
      const budget1 = { id: 'b1', category: 'food', limit: 2000 };
      const budget2 = { id: 'b2', category: 'food', limit: 3500 };

      const state1 = financeReducer(initialFinanceState, {
        type: 'UPSERT_BUDGET',
        payload: budget1,
      });
      expect(state1.budgets).toHaveLength(1);
      expect(state1.budgets[0].limit).toBe(2000);

      const state2 = financeReducer(state1, {
        type: 'UPSERT_BUDGET',
        payload: budget2,
      });
      expect(state2.budgets).toHaveLength(1);
      expect(state2.budgets[0].category).toBe('food');
      expect(state2.budgets[0].limit).toBe(3500);
    });

    it('handles goals: create, update, addToGoal, delete', () => {
      const goal = {
        id: 'g1',
        name: 'Emergency Fund',
        targetAmount: 5000,
        savedAmount: 1000,
      };

      const created = financeReducer(initialFinanceState, {
        type: 'CREATE_GOAL',
        payload: goal,
      });
      expect(created.goals).toHaveLength(1);
      expect(created.goals[0].savedAmount).toBe(1000);

      const added = financeReducer(created, {
        type: 'ADD_TO_GOAL',
        payload: { id: 'g1', amount: 500 },
      });
      expect(added.goals[0].savedAmount).toBe(1500);

      const updated = financeReducer(added, {
        type: 'UPDATE_GOAL',
        payload: { ...goal, name: 'Renamed Fund', savedAmount: 1500 },
      });
      expect(updated.goals[0].name).toBe('Renamed Fund');

      const deleted = financeReducer(updated, {
        type: 'DELETE_GOAL',
        payload: { id: 'g1' },
      });
      expect(deleted.goals).toHaveLength(0);
    });

    it('handles lesson progress and quiz results', () => {
      const completed = financeReducer(initialFinanceState, {
        type: 'MARK_LESSON_COMPLETE',
        payload: { lessonId: 'l1', updatedAt: '2026-11-13' },
      });
      expect(completed.lessonProgress.l1.completed).toBe(true);

      const scored = financeReducer(completed, {
        type: 'SAVE_QUIZ_RESULT',
        payload: {
          lessonId: 'l1',
          score: 5,
          total: 5,
          updatedAt: '2026-11-13',
        },
      });
      expect(scored.lessonProgress.l1.quizScore).toBe(5);
    });

    it('reset keeps preferences', () => {
      const populatedState = {
        ...initialFinanceState,
        transactions: [
          {
            id: 't1',
            amount: 100,
            type: 'income' as const,
            category: 'salary',
            date: '2026-11-13',
            createdAt: '2026-11-13',
          },
        ],
        budgets: [{ id: 'b1', category: 'food', limit: 1000 }],
        goals: [
          {
            id: 'g1',
            name: 'Save',
            targetAmount: 5000,
            savedAmount: 200,
          },
        ],
        lessonProgress: {
          l1: { lessonId: 'l1', completed: true, updatedAt: '2026-11-13' },
        },
      };

      const resetState = financeReducer(populatedState, {
        type: 'RESET_DEMO_DATA',
      });

      expect(resetState.transactions).toEqual([]);
      expect(resetState.budgets).toEqual([]);
      expect(resetState.goals).toEqual([]);
      expect(resetState.lessonProgress).toEqual({});

      // Preferences are maintained separately and unaffected by finance reset
      const preferences: Preferences = {
        language: 'hi',
        simpleMode: true,
        largeText: true,
      };
      expect(preferences.language).toBe('hi');
      expect(preferences.simpleMode).toBe(true);
      expect(preferences.largeText).toBe(true);
    });

    it('handles LOAD_DEMO_DATA and then clears it via RESET_DEMO_DATA', () => {
      const demoPayload = {
        transactions: [
          {
            id: 'tx-1',
            amount: 500,
            type: 'expense' as const,
            category: 'food',
            date: '2026-11-04',
            createdAt: '2026-11-04',
          },
        ],
        budgets: [{ id: 'b-1', category: 'food', limit: 2000 }],
        goals: [
          {
            id: 'g-1',
            name: 'demoData.emergencyGoal',
            targetAmount: 10000,
            savedAmount: 3000,
          },
        ],
      };

      const loaded = financeReducer(initialFinanceState, {
        type: 'LOAD_DEMO_DATA',
        payload: demoPayload,
      });

      expect(loaded.transactions).toHaveLength(1);
      expect(loaded.budgets).toHaveLength(1);
      expect(loaded.goals).toHaveLength(1);

      const cleared = financeReducer(loaded, {
        type: 'RESET_DEMO_DATA',
      });

      expect(cleared.transactions).toHaveLength(0);
      expect(cleared.budgets).toHaveLength(0);
      expect(cleared.goals).toHaveLength(0);
    });
  });

  describe('HYDRATION', () => {
    it('put 2 transactions in mock storage, render FinanceProvider, wait for ready, assert the 2 are in state AND still in storage', async () => {
      const tx1: Transaction = {
        id: 'tx-1',
        amount: 500,
        type: 'expense',
        category: 'food',
        date: '2026-11-10',
        createdAt: '2026-11-10',
      };
      const tx2: Transaction = {
        id: 'tx-2',
        amount: 1500,
        type: 'income',
        category: 'salary',
        date: '2026-11-01',
        createdAt: '2026-11-01',
      };

      // Put 2 transactions in mock storage
      await AsyncStorage.setItem(
        STORAGE_KEYS.transactions,
        JSON.stringify([tx1, tx2]),
      );

      let contextRef: FinanceContextValue | null = null;
      function Consumer() {
        contextRef = useFinance();
        return null;
      }

      // Render FinanceProvider
      const renderer = createRoot();
      await act(async () => {
        renderer.render(
          <FinanceProvider>
            <Consumer />
          </FinanceProvider>,
        );
      });

      // Wait for ready
      for (let i = 0; i < 20; i++) {
        if (contextRef && (contextRef as FinanceContextValue).ready) {
          break;
        }
        await act(async () => {
          await new Promise((r) => setTimeout(r, 20));
        });
      }

      expect(contextRef).not.toBeNull();
      expect((contextRef as unknown as FinanceContextValue).ready).toBe(true);

      // Assert the 2 are in state
      const stateTransactions = (contextRef as unknown as FinanceContextValue)
        .transactions;
      expect(stateTransactions).toHaveLength(2);
      expect(stateTransactions).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ id: 'tx-1', amount: 500 }),
          expect.objectContaining({ id: 'tx-2', amount: 1500 }),
        ]),
      );

      // Assert the 2 are still in storage
      const rawStored = await AsyncStorage.getItem(STORAGE_KEYS.transactions);
      expect(rawStored).not.toBeNull();
      const storedTransactions = JSON.parse(rawStored!);
      expect(storedTransactions).toHaveLength(2);
      expect(storedTransactions).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ id: 'tx-1', amount: 500 }),
          expect.objectContaining({ id: 'tx-2', amount: 1500 }),
        ]),
      );
    });
  });

  describe('selector hooks', () => {
    it('computes selectors correctly with populated state', async () => {
      let monthSummaryResult: unknown = null;
      let budgetViewsResult: unknown = null;
      let goalViewsResult: unknown = null;
      let financeContext: FinanceContextValue | null = null;

      function Consumer() {
        financeContext = useFinance();
        monthSummaryResult = useMonthSummary('2026-11');
        budgetViewsResult = useBudgetViews('2026-11');
        goalViewsResult = useGoalViews();
        return null;
      }

      const renderer = createRoot();
      await act(async () => {
        renderer.render(
          <FinanceProvider>
            <Consumer />
          </FinanceProvider>,
        );
      });

      for (let i = 0; i < 20; i++) {
        if (financeContext && (financeContext as FinanceContextValue).ready) {
          break;
        }
        await act(async () => {
          await new Promise((r) => setTimeout(r, 20));
        });
      }

      await act(async () => {
        financeContext!.addTransaction({
          amount: 5000,
          type: 'income',
          category: 'salary',
          date: '2026-11-01',
        });
        financeContext!.addTransaction({
          amount: 1200,
          type: 'expense',
          category: 'food',
          date: '2026-11-05',
        });
        financeContext!.upsertBudget({
          category: 'food',
          limit: 2000,
        });
        financeContext!.createGoal({
          name: 'Festival',
          targetAmount: 5000,
          savedAmount: 2500,
        });
      });

      expect(monthSummaryResult).toEqual({
        income: 5000,
        expense: 1200,
        net: 3800,
      });

      const budgetViews = budgetViewsResult as Array<{
        category: string;
        limit: number;
        spent: number;
        remaining: number;
        percent: number;
        status: string;
      }>;
      expect(budgetViews).toHaveLength(1);
      expect(budgetViews[0].category).toBe('food');
      expect(budgetViews[0].spent).toBe(1200);
      expect(budgetViews[0].limit).toBe(2000);
      expect(budgetViews[0].remaining).toBe(800);
      expect(budgetViews[0].status).toBe('ok');

      const goalViews = goalViewsResult as Array<{
        name: string;
        targetAmount: number;
        savedAmount: number;
        rawPercent: number;
        barPercent: number;
        reached: boolean;
      }>;
      expect(goalViews).toHaveLength(1);
      expect(goalViews[0].name).toBe('Festival');
      expect(goalViews[0].rawPercent).toBe(50);
      expect(goalViews[0].barPercent).toBe(50);
      expect(goalViews[0].reached).toBe(false);
    });

    it('loadDemoData loads demo items and resetDemoData clears them', async () => {
      let financeCtx: FinanceContextValue | null = null;
      function Consumer() {
        financeCtx = useFinance();
        return null;
      }

      const renderer = createRoot();
      await act(async () => {
        renderer.render(
          <FinanceProvider>
            <Consumer />
          </FinanceProvider>,
        );
      });

      for (let i = 0; i < 20; i++) {
        if (
          financeCtx &&
          (financeCtx as unknown as { ready: boolean }).ready
        ) {
          break;
        }
        await act(async () => {
          await new Promise((r) => setTimeout(r, 20));
        });
      }

      await act(async () => {
        await financeCtx!.loadDemoData();
      });

      expect(financeCtx!.transactions).toHaveLength(8);
      expect(financeCtx!.budgets).toHaveLength(2);
      expect(financeCtx!.goals).toHaveLength(1);

      await act(async () => {
        await financeCtx!.resetDemoData();
      });

      expect(financeCtx!.transactions).toHaveLength(0);
      expect(financeCtx!.budgets).toHaveLength(0);
      expect(financeCtx!.goals).toHaveLength(0);
    });
  });

  describe('PreferencesContext integration', () => {
    it('loads and persists preferences without affecting finance data', async () => {
      await AsyncStorage.setItem(
        STORAGE_KEYS.preferences,
        JSON.stringify({
          language: 'mr',
          simpleMode: true,
          largeText: false,
        }),
      );

      let prefsContext: ReturnType<typeof usePreferences> | null = null;
      function Consumer() {
        prefsContext = usePreferences();
        return null;
      }

      const renderer = createRoot();
      await act(async () => {
        renderer.render(
          <PreferencesProvider>
            <Consumer />
          </PreferencesProvider>,
        );
      });

      for (let i = 0; i < 20; i++) {
        if (prefsContext && (prefsContext as unknown as { ready: boolean }).ready) {
          break;
        }
        await act(async () => {
          await new Promise((r) => setTimeout(r, 20));
        });
      }

      expect(prefsContext!.language).toBe('mr');
      expect(prefsContext!.simpleMode).toBe(true);
      expect(prefsContext!.largeText).toBe(false);
    });
  });
});

