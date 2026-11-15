import type { Transaction } from '../../data/types';
import {
  budgetSpent,
  budgetStatus,
  calculateEmi,
  goalProgress,
  monthSummary,
  round2,
} from '../calculations';

describe('calculations utility', () => {
  describe('round2', () => {
    it('rounds to 2 decimal places', () => {
      expect(round2(10.254)).toBe(10.25);
      expect(round2(10.255)).toBe(10.26);
    });
  });

  describe('monthSummary', () => {
    it('calculates income, expense, and net for the given month, excluding other months', () => {
      const transactions: Transaction[] = [
        {
          id: '1',
          amount: 10000,
          type: 'income',
          category: 'salary',
          date: '2026-11-01',
          createdAt: '2026-11-01',
        },
        {
          id: '2',
          amount: 2500,
          type: 'expense',
          category: 'food',
          date: '2026-11-05',
          createdAt: '2026-11-05',
        },
        {
          id: '3',
          amount: 5000,
          type: 'income',
          category: 'gift',
          date: '2026-10-15',
          createdAt: '2026-10-15',
        },
        {
          id: '4',
          amount: 1200,
          type: 'expense',
          category: 'bills',
          date: '2026-12-01',
          createdAt: '2026-12-01',
        },
      ];

      const result = monthSummary(transactions, '2026-11');
      expect(result).toEqual({
        income: 10000,
        expense: 2500,
        net: 7500,
      });
    });
  });

  describe('budgetSpent', () => {
    it('sums expenses for a category in a specific month', () => {
      const transactions: Transaction[] = [
        {
          id: '1',
          amount: 500,
          type: 'expense',
          category: 'food',
          date: '2026-11-02',
          createdAt: '2026-11-02',
        },
        {
          id: '2',
          amount: 700,
          type: 'expense',
          category: 'food',
          date: '2026-11-08',
          createdAt: '2026-11-08',
        },
        {
          id: '3',
          amount: 300,
          type: 'expense',
          category: 'transport',
          date: '2026-11-10',
          createdAt: '2026-11-10',
        },
        {
          id: '4',
          amount: 400,
          type: 'expense',
          category: 'food',
          date: '2026-10-02',
          createdAt: '2026-10-02',
        },
      ];

      expect(budgetSpent(transactions, 'food', '2026-11')).toBe(1200);
      expect(budgetSpent(transactions, 'transport', '2026-11')).toBe(300);
      expect(budgetSpent(transactions, 'home', '2026-11')).toBe(0);
    });
  });

  describe('budgetStatus', () => {
    it('evaluates budget status thresholds accurately', () => {
      // limit 3000
      expect(budgetStatus(2500, 3000)).toEqual({
        status: 'warning',
        percent: 83.33,
        remaining: 500,
      });
      expect(budgetStatus(2400, 3000).status).toBe('warning');
      expect(budgetStatus(2399, 3000).status).toBe('ok');
      expect(budgetStatus(3000, 3000)).toEqual({
        status: 'warning',
        percent: 100,
        remaining: 0,
      });
      expect(budgetStatus(3001, 3000)).toEqual({
        status: 'exceeded',
        percent: 100.03,
        remaining: -1,
      });
      expect(budgetStatus(100, 0).status).toBe('notSet');
    });
  });

  describe('goalProgress', () => {
    it('computes savings goal progress correctly', () => {
      const p1 = goalProgress(1000, 5000);
      expect(p1.rawPercent).toBe(20);
      expect(p1.barPercent).toBe(20);
      expect(p1.remaining).toBe(4000);
      expect(p1.reached).toBe(false);

      const p2 = goalProgress(6000, 5000);
      expect(p2.barPercent).toBe(100);
      expect(p2.rawPercent).toBe(120);
      expect(p2.remaining).toBe(0);
      expect(p2.reached).toBe(true);

      expect(() => goalProgress(1000, 0)).not.toThrow();
      const pZero = goalProgress(1000, 0);
      expect(pZero.barPercent).toBe(0);
    });
  });

  describe('calculateEmi', () => {
    const TOLERANCE = 0.01;

    it('calculates EMI and totals within tolerance', () => {
      const res1 = calculateEmi(50000, 12, 12);
      expect(res1.ok).toBe(true);
      if (res1.ok) {
        expect(Math.abs(res1.emi - 4442.44)).toBeLessThanOrEqual(TOLERANCE);
        expect(Math.abs(res1.total - 53309.28)).toBeLessThanOrEqual(TOLERANCE);
        expect(Math.abs(res1.interest - 3309.28)).toBeLessThanOrEqual(TOLERANCE);
      }

      const res2 = calculateEmi(12000, 0, 12);
      expect(res2.ok).toBe(true);
      if (res2.ok) {
        expect(res2.emi).toBe(1000);
        expect(res2.total).toBe(12000);
        expect(res2.interest).toBe(0);
      }

      const res3 = calculateEmi(100000, 10, 24);
      expect(res3.ok).toBe(true);
      if (res3.ok) {
        expect(Math.abs(res3.emi - 4614.49)).toBeLessThanOrEqual(TOLERANCE);
        expect(Math.abs(res3.total - 110747.76)).toBeLessThanOrEqual(TOLERANCE);
        expect(Math.abs(res3.interest - 10747.76)).toBeLessThanOrEqual(TOLERANCE);
      }

      const res4 = calculateEmi(250000, 18, 36);
      expect(res4.ok).toBe(true);
      if (res4.ok) {
        expect(Math.abs(res4.emi - 9038.1)).toBeLessThanOrEqual(TOLERANCE);
        expect(Math.abs(res4.total - 325371.6)).toBeLessThanOrEqual(TOLERANCE);
        expect(Math.abs(res4.interest - 75371.6)).toBeLessThanOrEqual(TOLERANCE);
      }

      const resMax = calculateEmi(100000000, 100, 480);
      expect(resMax.ok).toBe(true);
      if (resMax.ok) {
        expect(Number.isFinite(resMax.emi)).toBe(true);
        expect(Number.isFinite(resMax.total)).toBe(true);
        expect(Number.isFinite(resMax.interest)).toBe(true);
      }
    });

    it('rejects invalid inputs', () => {
      expect(calculateEmi(0, 10, 12).ok).toBe(false);
      expect(calculateEmi(50000, -1, 12).ok).toBe(false);
      expect(calculateEmi(50000, 101, 12).ok).toBe(false);
      expect(calculateEmi(50000, 10, 0).ok).toBe(false);
      expect(calculateEmi(50000, 10, 12.5).ok).toBe(false);
    });
  });
});

