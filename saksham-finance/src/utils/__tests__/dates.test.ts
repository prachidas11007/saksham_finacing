import {
  currentMonthKey,
  isValidDateString,
  monthKeyOf,
  todayLocal,
  toLocalDateString,
} from '../dates';

describe('dates utility', () => {
  it('converts Date to local YYYY-MM-DD string', () => {
    // new Date(2026, 10, 1, 0, 30) -> month index 10 is November (11)
    expect(toLocalDateString(new Date(2026, 10, 1, 0, 30))).toBe('2026-11-01');
    // new Date(2026, 11, 31, 23, 59) -> month index 11 is December (12)
    expect(toLocalDateString(new Date(2026, 11, 31, 23, 59))).toBe('2026-12-31');
  });

  it('extracts monthKeyOf from YYYY-MM-DD', () => {
    expect(monthKeyOf('2026-11-13')).toBe('2026-11');
  });

  it('returns valid todayLocal and currentMonthKey', () => {
    const today = todayLocal();
    expect(isValidDateString(today)).toBe(true);
    expect(currentMonthKey()).toBe(today.slice(0, 7));
  });

  it('validates date strings properly', () => {
    expect(isValidDateString('2026-11-01')).toBe(true);
    expect(isValidDateString('2026-12-31')).toBe(true);
    expect(isValidDateString('2024-02-29')).toBe(true); // Leap year
    expect(isValidDateString('2023-02-29')).toBe(false); // Non-leap year
    expect(isValidDateString('2026-13-40')).toBe(false);
    expect(isValidDateString('invalid')).toBe(false);
    expect(isValidDateString('')).toBe(false);
  });
});

