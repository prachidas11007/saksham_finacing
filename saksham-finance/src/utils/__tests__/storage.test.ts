import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  filterValidBudgets,
  filterValidGoals,
  filterValidProgress,
  filterValidTransactions,
  loadJSON,
  removeKeys,
  saveJSON,
  STORAGE_KEYS,
} from '../storage';

jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock'),
);

describe('storage utils', () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
    jest.clearAllMocks();
  });

  describe('loadJSON', () => {
    it('returns fallback when key is missing', async () => {
      const result = await loadJSON('non_existent_key', { fallback: true });
      expect(result).toEqual({ fallback: true });
    });

    it("returns fallback on broken text '{oops'", async () => {
      await AsyncStorage.setItem('broken_key', '{oops');
      const result = await loadJSON('broken_key', { fallback: true });
      expect(result).toEqual({ fallback: true });
    });

    it('returns fallback on wrong shape (validation fails)', async () => {
      await AsyncStorage.setItem(
        'shape_key',
        JSON.stringify({ age: 'not-a-number' }),
      );
      const validator = (data: unknown): boolean => {
        if (!data || typeof data !== 'object') return false;
        return typeof (data as { age?: unknown }).age === 'number';
      };
      const result = await loadJSON('shape_key', { default: true }, validator);
      expect(result).toEqual({ default: true });
    });

    it('returns parsed value when valid', async () => {
      await AsyncStorage.setItem('valid_key', JSON.stringify({ count: 42 }));
      const result = await loadJSON('valid_key', { count: 0 });
      expect(result).toEqual({ count: 42 });
    });
  });

  describe('saveJSON', () => {
    it('saves value to storage and returns true', async () => {
      const ok = await saveJSON('my_key', { saved: true });
      expect(ok).toBe(true);
      const stored = await AsyncStorage.getItem('my_key');
      expect(stored).toBe(JSON.stringify({ saved: true }));
    });
  });

  describe('removeKeys', () => {
    it('removes keys without throwing', async () => {
      await AsyncStorage.setItem('key1', 'val1');
      await AsyncStorage.setItem('key2', 'val2');
      const ok = await removeKeys(['key1', 'key2']);
      expect(ok).toBe(true);
      expect(await AsyncStorage.getItem('key1')).toBeNull();
      expect(await AsyncStorage.getItem('key2')).toBeNull();
    });

    it('handles empty keys array without throwing', async () => {
      const ok = await removeKeys([]);
      expect(ok).toBe(true);
    });
  });

  describe('validators', () => {
    it('filterValidTransactions keeps good items and drops bad ones', () => {
      const mixed = [
        {
          id: 'tx-1',
          amount: 500,
          type: 'expense',
          category: 'food',
          date: '2026-11-13',
        },
        {
          id: 'tx-bad-amount',
          amount: -10,
          type: 'expense',
          category: 'food',
          date: '2026-11-13',
        },
        {
          id: 'tx-bad-type',
          amount: 100,
          type: 'transfer',
          category: 'food',
          date: '2026-11-13',
        },
        {
          id: 'tx-bad-date',
          amount: 100,
          type: 'income',
          category: 'salary',
          date: '2026-02-30',
        },
        {
          id: 'tx-bad-cat',
          amount: 100,
          type: 'expense',
          category: 'cryptocurrency',
          date: '2026-11-13',
        },
        {
          id: 'tx-2',
          amount: 15000,
          type: 'income',
          category: 'salary',
          date: '2026-11-01',
        },
      ];

      const valid = filterValidTransactions(mixed);
      expect(valid).toHaveLength(2);
      expect(valid[0].id).toBe('tx-1');
      expect(valid[1].id).toBe('tx-2');
    });

    it('filterValidBudgets keeps valid budgets and deduplicates category', () => {
      const mixed = [
        { id: 'b1', category: 'food', limit: 2000 },
        { id: 'b-bad', category: 'food', limit: -100 },
        { id: 'b2', category: 'food', limit: 3000 },
        { id: 'b3', category: 'transport', limit: 1000 },
      ];
      const valid = filterValidBudgets(mixed);
      expect(valid).toHaveLength(2);
      expect(valid[0].category).toBe('food');
      expect(valid[1].category).toBe('transport');
    });

    it('filterValidGoals keeps valid goals and drops invalid', () => {
      const mixed = [
        { id: 'g1', name: 'Emergency', targetAmount: 10000, savedAmount: 2000 },
        { id: 'g2', name: '', targetAmount: 5000, savedAmount: 0 },
        { id: 'g3', name: 'Bike', targetAmount: -500, savedAmount: 0 },
      ];
      const valid = filterValidGoals(mixed);
      expect(valid).toHaveLength(1);
      expect(valid[0].id).toBe('g1');
    });

    it('filterValidProgress validates lesson progress map', () => {
      const progress = {
        lesson1: { completed: true, quizScore: 4, updatedAt: '2026-11-13' },
        bad1: 'invalid',
        lesson2: { completed: false, updatedAt: '2026-11-12' },
      };
      const valid = filterValidProgress(progress);
      expect(valid.lesson1.completed).toBe(true);
      expect(valid.lesson1.quizScore).toBe(4);
      expect(valid.lesson2.completed).toBe(false);
      expect(valid.bad1).toBeUndefined();
    });
  });
});

