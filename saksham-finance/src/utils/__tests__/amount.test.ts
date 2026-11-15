import { parseAmount } from '../amount';

describe('parseAmount utility', () => {
  it('parses valid amounts with Latin digits, commas, and rupee symbols', () => {
    expect(parseAmount('1000')).toEqual({ ok: true, value: 1000 });
    expect(parseAmount('1,000')).toEqual({ ok: true, value: 1000 });
    expect(parseAmount('₹ 2,500.50')).toEqual({ ok: true, value: 2500.5 });
  });

  it('parses amounts with Devanagari numerals and separators', () => {
    expect(parseAmount('१०००')).toEqual({ ok: true, value: 1000 });
    expect(parseAmount('१,२५०.५०')).toEqual({ ok: true, value: 1250.5 });
  });

  it('allows maximum limit of 10,00,00,000', () => {
    expect(parseAmount('10,00,00,000')).toEqual({ ok: true, value: 100000000 });
  });

  it('rejects empty input', () => {
    expect(parseAmount('')).toEqual({ ok: false, reason: 'empty' });
    expect(parseAmount('   ')).toEqual({ ok: false, reason: 'empty' });
  });

  it('rejects non-numeric characters, negative numbers, and exponents as invalid', () => {
    expect(parseAmount('abc')).toEqual({ ok: false, reason: 'invalid' });
    expect(parseAmount('-5')).toEqual({ ok: false, reason: 'invalid' });
    expect(parseAmount('1e5')).toEqual({ ok: false, reason: 'invalid' });
  });

  it('rejects zero as notPositive', () => {
    expect(parseAmount('0')).toEqual({ ok: false, reason: 'notPositive' });
  });

  it('rejects more than 2 decimal digits as tooManyDecimals', () => {
    expect(parseAmount('12.345')).toEqual({ ok: false, reason: 'tooManyDecimals' });
  });

  it('rejects amounts above 10,00,00,000 as tooLarge', () => {
    expect(parseAmount('100000001')).toEqual({ ok: false, reason: 'tooLarge' });
  });
});

