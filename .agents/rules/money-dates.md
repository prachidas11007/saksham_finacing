---
trigger: glob
globs: "src/utils/**, src/data/types.ts"
description: Money, date, EMI, budget and goal rules (D-07, D-08, D-12 to D-16)
---
D-07 Categories are fixed KEYS. Expense: food, transport, home, bills, health, education, shopping, other. Income: salary, business, farming, gift, other. Labels come from i18n.
D-08 Goal: saved >= 0 and may exceed target. barPercent stops at 100, rawPercent is real, remaining min 0, reached = saved >= target. Target 0 must not crash.
D-12 EMI: principal 1 to 10,00,00,000; annual rate 0 to 100 (decimals ok); tenure 1 to 480 whole months. r = rate/1200. r = 0: EMI = P/n. Else EMI = P*r*(1+r)^n / ((1+r)^n - 1). emi = round2(EMI); total = round2(emi*n); interest = round2(total - P). Tests allow +/- 0.01.
  T-06 (50000, 12, 12): emi 4442.44, total 53309.28, interest 3309.28. T-07 (12000, 0, 12): 1000, 12000, 0.
D-13 formatINR is our own code, NO Intl. Rupee sign, Indian grouping (12,34,567), Western digits 0-9 in all 3 languages. Whole rupees: no decimals; else 2. Negative: -₹2,500. Percent: at most 2 decimals (83.33%).
D-14 parseAmount: accepts Latin and Devanagari digits; strips ₹, commas, spaces; rejects empty, non-numeric, zero, negative, exponent, more than 2 decimals, above 10,00,00,000. Reasons: empty | invalid | notPositive | tooManyDecimals | tooLarge. Notes max 100 chars.
D-15 Dates are local 'YYYY-MM-DD'; month key 'YYYY-MM'. Build with getFullYear/getMonth/getDate. NEVER toISOString() or new Date('YYYY-MM-DD') for logic.
D-16 Budget with limit > 0: spent > limit = exceeded; spent*100 >= limit*80 = warning (includes exactly 100%); else ok. limit <= 0 = notSet. Use multiplication, not division.
