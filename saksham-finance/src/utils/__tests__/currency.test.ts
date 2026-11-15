import { formatINR, formatPercent } from '../currency';

describe('currency utilities', () => {
  describe('formatINR', () => {
    it('formats numbers with Indian grouping and proper decimal formatting without Intl', () => {
      expect(formatINR(0)).toBe('₹0');
      expect(formatINR(999)).toBe('₹999');
      expect(formatINR(1000)).toBe('₹1,000');
      expect(formatINR(10000)).toBe('₹10,000');
      expect(formatINR(100000)).toBe('₹1,00,000');
      expect(formatINR(1234567)).toBe('₹12,34,567');
      expect(formatINR(2500.5)).toBe('₹2,500.50');
      expect(formatINR(-2500)).toBe('-₹2,500');
    });
  });

  describe('formatPercent', () => {
    it('formats percentage with at most 2 decimal places and no trailing decimals for integers', () => {
      expect(formatPercent(83.3333)).toBe('83.33%');
      expect(formatPercent(20)).toBe('20%');
    });
  });
});

