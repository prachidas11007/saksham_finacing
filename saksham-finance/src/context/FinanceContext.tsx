import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  type ReactNode,
} from 'react';
import type {
  Budget,
  BudgetView,
  GoalView,
  LessonProgress,
  MonthSummaryResult,
  SavingsGoal,
  Transaction,
} from '../data/types';
import { getDemoData } from '../data/demoData';
import {
  budgetSpent,
  budgetStatus,
  goalProgress,
  monthSummary,
  round2,
} from '../utils/calculations';
import { currentMonthKey, todayLocal } from '../utils/dates';
import { makeId } from '../utils/id';
import {
  filterValidBudgets,
  filterValidGoals,
  filterValidProgress,
  filterValidTransactions,
  loadJSON,
  removeKeys,
  saveJSON,
  STORAGE_KEYS,
} from '../utils/storage';

export interface FinanceState {
  transactions: Transaction[];
  budgets: Budget[];
  goals: SavingsGoal[];
  lessonProgress: Record<string, LessonProgress>;
  ready: boolean;
}

export type FinanceAction =
  | {
      type: 'HYDRATE';
      payload: {
        transactions: Transaction[];
        budgets: Budget[];
        goals: SavingsGoal[];
        lessonProgress: Record<string, LessonProgress>;
      };
    }
  | { type: 'ADD_TRANSACTION'; payload: Transaction }
  | { type: 'DELETE_TRANSACTION'; payload: { id: string } }
  | { type: 'UPSERT_BUDGET'; payload: Budget }
  | { type: 'DELETE_BUDGET'; payload: { id: string } }
  | { type: 'CREATE_GOAL'; payload: SavingsGoal }
  | { type: 'UPDATE_GOAL'; payload: SavingsGoal }
  | { type: 'ADD_TO_GOAL'; payload: { id: string; amount: number } }
  | { type: 'DELETE_GOAL'; payload: { id: string } }
  | {
      type: 'MARK_LESSON_COMPLETE';
      payload: { lessonId: string; updatedAt: string };
    }
  | {
      type: 'SAVE_QUIZ_RESULT';
      payload: {
        lessonId: string;
        score: number;
        total: number;
        updatedAt: string;
      };
    }
  | {
      type: 'LOAD_DEMO_DATA';
      payload: {
        transactions: Transaction[];
        budgets: Budget[];
        goals: SavingsGoal[];
      };
    }
  | { type: 'RESET_DEMO_DATA' };

export const initialFinanceState: FinanceState = {
  transactions: [],
  budgets: [],
  goals: [],
  lessonProgress: {},
  ready: false,
};

export function financeReducer(
  state: FinanceState,
  action: FinanceAction,
): FinanceState {
  switch (action.type) {
    case 'HYDRATE':
      return {
        ...state,
        transactions: action.payload.transactions,
        budgets: action.payload.budgets,
        goals: action.payload.goals,
        lessonProgress: action.payload.lessonProgress,
        ready: true,
      };

    case 'ADD_TRANSACTION':
      return {
        ...state,
        transactions: [action.payload, ...state.transactions],
      };

    case 'DELETE_TRANSACTION':
      return {
        ...state,
        transactions: state.transactions.filter(
          (t) => t.id !== action.payload.id,
        ),
      };

    case 'UPSERT_BUDGET': {
      const existingIdx = state.budgets.findIndex(
        (b) => b.category === action.payload.category,
      );
      if (existingIdx >= 0) {
        const nextBudgets = [...state.budgets];
        nextBudgets[existingIdx] = {
          ...action.payload,
          id: action.payload.id || state.budgets[existingIdx].id,
          limit: round2(action.payload.limit),
        };
        return {
          ...state,
          budgets: nextBudgets,
        };
      }
      return {
        ...state,
        budgets: [
          ...state.budgets,
          {
            ...action.payload,
            id: action.payload.id || makeId(),
            limit: round2(action.payload.limit),
          },
        ],
      };
    }

    case 'DELETE_BUDGET':
      return {
        ...state,
        budgets: state.budgets.filter(
          (b) =>
            b.id !== action.payload.id && b.category !== action.payload.id,
        ),
      };

    case 'CREATE_GOAL':
      return {
        ...state,
        goals: [...state.goals, action.payload],
      };

    case 'UPDATE_GOAL':
      return {
        ...state,
        goals: state.goals.map((g) =>
          g.id === action.payload.id
            ? {
                ...action.payload,
                savedAmount: round2(action.payload.savedAmount),
                targetAmount: round2(action.payload.targetAmount),
              }
            : g,
        ),
      };

    case 'ADD_TO_GOAL': {
      const { id, amount } = action.payload;
      return {
        ...state,
        goals: state.goals.map((g) => {
          if (g.id === id) {
            return {
              ...g,
              savedAmount: round2(g.savedAmount + amount),
            };
          }
          return g;
        }),
      };
    }

    case 'DELETE_GOAL':
      return {
        ...state,
        goals: state.goals.filter((g) => g.id !== action.payload.id),
      };

    case 'MARK_LESSON_COMPLETE': {
      const { lessonId, updatedAt } = action.payload;
      const prev = state.lessonProgress[lessonId];
      return {
        ...state,
        lessonProgress: {
          ...state.lessonProgress,
          [lessonId]: {
            lessonId,
            completed: true,
            quizScore: prev?.quizScore,
            updatedAt,
          },
        },
      };
    }

    case 'SAVE_QUIZ_RESULT': {
      const { lessonId, score, updatedAt } = action.payload;
      return {
        ...state,
        lessonProgress: {
          ...state.lessonProgress,
          [lessonId]: {
            lessonId,
            completed: true,
            quizScore: score,
            updatedAt,
          },
        },
      };
    }

    case 'LOAD_DEMO_DATA': {
      const incomingTxIds = new Set(
        action.payload.transactions.map((t) => t.id),
      );
      const existingTx = state.transactions.filter(
        (t) => !incomingTxIds.has(t.id),
      );

      const incomingBudgetCats = new Set(
        action.payload.budgets.map((b) => b.category),
      );
      const existingBudgets = state.budgets.filter(
        (b) => !incomingBudgetCats.has(b.category),
      );

      const incomingGoalIds = new Set(action.payload.goals.map((g) => g.id));
      const existingGoals = state.goals.filter(
        (g) => !incomingGoalIds.has(g.id),
      );

      return {
        ...state,
        transactions: [...action.payload.transactions, ...existingTx],
        budgets: [...action.payload.budgets, ...existingBudgets],
        goals: [...action.payload.goals, ...existingGoals],
      };
    }

    case 'RESET_DEMO_DATA':
      return {
        ...state,
        transactions: [],
        budgets: [],
        goals: [],
        lessonProgress: {},
      };

    default:
      return state;
  }
}

export type NewTransactionInput = Partial<Pick<Transaction, 'id' | 'createdAt'>> &
  Omit<Transaction, 'id' | 'createdAt'>;

export type NewBudgetInput = Partial<Pick<Budget, 'id'>> & Omit<Budget, 'id'>;

export type NewGoalInput = Partial<Pick<SavingsGoal, 'id' | 'savedAmount'>> &
  Omit<SavingsGoal, 'id' | 'savedAmount'>;

export interface FinanceContextValue extends FinanceState {
  addTransaction: (transaction: NewTransactionInput) => void;
  deleteTransaction: (id: string) => void;
  upsertBudget: (budget: NewBudgetInput) => void;
  deleteBudget: (id: string) => void;
  createGoal: (goal: NewGoalInput) => void;
  updateGoal: (goal: SavingsGoal) => void;
  addToGoal: (goalIdOrAmount: string | number, maybeAmount?: number) => void;
  deleteGoal: (id: string) => void;
  markLessonComplete: (lessonId: string) => void;
  saveQuizResult: (
    scoreOrLessonId: number | string,
    totalOrScore?: number,
    optionalTotal?: number,
  ) => void;
  resetDemoData: () => Promise<void>;
  loadDemoData: () => Promise<void>;
}

const FinanceContext = createContext<FinanceContextValue | null>(null);

export function FinanceProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(financeReducer, initialFinanceState);

  useEffect(() => {
    let active = true;

    async function loadAll() {
      const [
        rawTransactions,
        rawBudgets,
        rawGoals,
        rawProgress,
      ] = await Promise.all([
        loadJSON<Transaction[]>(STORAGE_KEYS.transactions, []),
        loadJSON<Budget[]>(STORAGE_KEYS.budgets, []),
        loadJSON<SavingsGoal[]>(STORAGE_KEYS.goals, []),
        loadJSON<Record<string, LessonProgress>>(STORAGE_KEYS.progress, {}),
      ]);

      if (active) {
        dispatch({
          type: 'HYDRATE',
          payload: {
            transactions: filterValidTransactions(rawTransactions),
            budgets: filterValidBudgets(rawBudgets),
            goals: filterValidGoals(rawGoals),
            lessonProgress: filterValidProgress(rawProgress),
          },
        });
      }
    }

    void loadAll();

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!state.ready) {
      return;
    }
    void saveJSON(STORAGE_KEYS.transactions, state.transactions);
  }, [state.transactions, state.ready]);

  useEffect(() => {
    if (!state.ready) {
      return;
    }
    void saveJSON(STORAGE_KEYS.budgets, state.budgets);
  }, [state.budgets, state.ready]);

  useEffect(() => {
    if (!state.ready) {
      return;
    }
    void saveJSON(STORAGE_KEYS.goals, state.goals);
  }, [state.goals, state.ready]);

  useEffect(() => {
    if (!state.ready) {
      return;
    }
    void saveJSON(STORAGE_KEYS.progress, state.lessonProgress);
  }, [state.lessonProgress, state.ready]);

  const addTransaction = useCallback((transaction: NewTransactionInput) => {
    const fullTransaction: Transaction = {
      ...transaction,
      id:
        transaction.id && transaction.id.trim() !== ''
          ? transaction.id
          : makeId(),
      createdAt:
        transaction.createdAt && transaction.createdAt.trim() !== ''
          ? transaction.createdAt
          : todayLocal(),
      amount: round2(transaction.amount),
    };
    dispatch({ type: 'ADD_TRANSACTION', payload: fullTransaction });
  }, []);

  const deleteTransaction = useCallback((id: string) => {
    dispatch({ type: 'DELETE_TRANSACTION', payload: { id } });
  }, []);

  const upsertBudget = useCallback((budget: NewBudgetInput) => {
    const fullBudget: Budget = {
      category: budget.category,
      limit: round2(budget.limit),
      id: budget.id && budget.id.trim() !== '' ? budget.id : makeId(),
    };
    dispatch({ type: 'UPSERT_BUDGET', payload: fullBudget });
  }, []);

  const deleteBudget = useCallback((id: string) => {
    dispatch({ type: 'DELETE_BUDGET', payload: { id } });
  }, []);

  const createGoal = useCallback((goal: NewGoalInput) => {
    const fullGoal: SavingsGoal = {
      ...goal,
      id: goal.id && goal.id.trim() !== '' ? goal.id : makeId(),
      savedAmount: round2(goal.savedAmount ?? 0),
      targetAmount: round2(goal.targetAmount),
    };
    dispatch({ type: 'CREATE_GOAL', payload: fullGoal });
  }, []);

  const updateGoal = useCallback((goal: SavingsGoal) => {
    dispatch({
      type: 'UPDATE_GOAL',
      payload: {
        ...goal,
        savedAmount: round2(goal.savedAmount),
        targetAmount: round2(goal.targetAmount),
      },
    });
  }, []);

  const addToGoal = useCallback(
    (goalIdOrAmount: string | number, maybeAmount?: number) => {
      if (typeof goalIdOrAmount === 'string') {
        const amount = typeof maybeAmount === 'number' ? maybeAmount : 0;
        dispatch({
          type: 'ADD_TO_GOAL',
          payload: { id: goalIdOrAmount, amount: round2(amount) },
        });
      } else if (typeof goalIdOrAmount === 'number') {
        const targetId = state.goals[0]?.id;
        if (targetId) {
          dispatch({
            type: 'ADD_TO_GOAL',
            payload: { id: targetId, amount: round2(goalIdOrAmount) },
          });
        }
      }
    },
    [state.goals],
  );

  const deleteGoal = useCallback((id: string) => {
    dispatch({ type: 'DELETE_GOAL', payload: { id } });
  }, []);

  const markLessonComplete = useCallback((lessonId: string) => {
    dispatch({
      type: 'MARK_LESSON_COMPLETE',
      payload: { lessonId, updatedAt: todayLocal() },
    });
  }, []);

  const saveQuizResult = useCallback(
    (
      scoreOrLessonId: number | string,
      totalOrScore?: number,
      optionalTotal?: number,
    ) => {
      let lessonId = 'core';
      let score = 0;
      let total = 5;

      if (typeof scoreOrLessonId === 'string') {
        lessonId = scoreOrLessonId;
        score = typeof totalOrScore === 'number' ? totalOrScore : 0;
        total = typeof optionalTotal === 'number' ? optionalTotal : 5;
      } else {
        score = scoreOrLessonId;
        total = typeof totalOrScore === 'number' ? totalOrScore : 5;
      }

      dispatch({
        type: 'SAVE_QUIZ_RESULT',
        payload: {
          lessonId,
          score,
          total,
          updatedAt: todayLocal(),
        },
      });
    },
    [],
  );

  const resetDemoData = useCallback(async () => {
    dispatch({ type: 'RESET_DEMO_DATA' });
    await removeKeys([
      STORAGE_KEYS.transactions,
      STORAGE_KEYS.budgets,
      STORAGE_KEYS.goals,
      STORAGE_KEYS.progress,
    ]);
  }, []);

  const loadDemoData = useCallback(async () => {
    const demo = getDemoData();
    dispatch({ type: 'LOAD_DEMO_DATA', payload: demo });
  }, []);

  const value = useMemo(
    () => ({
      ...state,
      addTransaction,
      deleteTransaction,
      upsertBudget,
      deleteBudget,
      createGoal,
      updateGoal,
      addToGoal,
      deleteGoal,
      markLessonComplete,
      saveQuizResult,
      resetDemoData,
      loadDemoData,
    }),
    [
      state,
      addTransaction,
      deleteTransaction,
      upsertBudget,
      deleteBudget,
      createGoal,
      updateGoal,
      addToGoal,
      deleteGoal,
      markLessonComplete,
      saveQuizResult,
      resetDemoData,
      loadDemoData,
    ],
  );

  return (
    <FinanceContext.Provider value={value}>{children}</FinanceContext.Provider>
  );
}

export function useFinance(): FinanceContextValue {
  const context = useContext(FinanceContext);
  if (!context) {
    throw new Error('useFinance must be used within a FinanceProvider');
  }
  return context;
}

export function useMonthSummary(monthKey?: string): MonthSummaryResult {
  const { transactions } = useFinance();
  const targetMonth = monthKey ?? currentMonthKey();
  return useMemo(() => {
    return monthSummary(transactions, targetMonth);
  }, [transactions, targetMonth]);
}

export function useBudgetViews(monthKey?: string): BudgetView[] {
  const { transactions, budgets } = useFinance();
  const targetMonth = monthKey ?? currentMonthKey();
  return useMemo(() => {
    return budgets.map((b) => {
      const spent = budgetSpent(transactions, b.category, targetMonth);
      const statusInfo = budgetStatus(spent, b.limit);
      return {
        id: b.id,
        category: b.category,
        limit: b.limit,
        spent,
        remaining: statusInfo.remaining,
        percent: statusInfo.percent,
        status: statusInfo.status,
        budget: b,
      };
    });
  }, [transactions, budgets, targetMonth]);
}

export function useGoalViews(): GoalView[] {
  const { goals } = useFinance();
  return useMemo(() => {
    return goals.map((g) => {
      const progress = goalProgress(g.savedAmount, g.targetAmount);
      return {
        id: g.id,
        name: g.name,
        targetAmount: g.targetAmount,
        savedAmount: g.savedAmount,
        targetDate: g.targetDate,
        barPercent: progress.barPercent,
        rawPercent: progress.rawPercent,
        remaining: progress.remaining,
        reached: progress.reached,
        goal: g,
      };
    });
  }, [goals]);
}
