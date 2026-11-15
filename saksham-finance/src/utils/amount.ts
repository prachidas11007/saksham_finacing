import { MAX_AMOUNT } from '../constants/limits';
import type { ParseAmountResult } from '../data/types';

const DEVANAGARI_DIGITS: Record<string, string> = {
  '०': '0',
  '१': '1',
  '२': '2',
  '३': '3',
  '४': '4',
  '५': '5',
  '६': '6',
  '७': '7',
  '८': '8',
  '९': '9',
};

export function parseAmount(text: string): ParseAmountResult {
  if (text.trim() === '') {
    return { ok: false, reason: 'empty' };
  }

  let cleaned = text.replace(/\s+/g, '');
  cleaned = cleaned.replace(/[₹\u20B9,]/g, '');

  if (cleaned === '') {
    return { ok: false, reason: 'empty' };
  }

  cleaned = cleaned.replace(
    /[०-९]/g,
    (char) => DEVANAGARI_DIGITS[char] ?? char,
  );

  if (!/^\d+(\.\d+)?$/.test(cleaned)) {
    return { ok: false, reason: 'invalid' };
  }

  if (cleaned.includes('.')) {
    const decimalPart = cleaned.split('.')[1];
    if (decimalPart.length > 2) {
      return { ok: false, reason: 'tooManyDecimals' };
    }
  }

  const value = parseFloat(cleaned);
  if (isNaN(value)) {
    return { ok: false, reason: 'invalid' };
  }

  if (value <= 0) {
    return { ok: false, reason: 'notPositive' };
  }

  if (value > MAX_AMOUNT) {
    return { ok: false, reason: 'tooLarge' };
  }

  return { ok: true, value };
}

