export function formatINR(value: number): string {
  if (isNaN(value)) {
    return '₹0';
  }

  const isNegative = value < 0;
  const absVal = Math.abs(value);

  const rounded = Math.round((absVal + Number.EPSILON) * 100) / 100;
  const isWhole = rounded % 1 === 0;

  let integerStr: string;
  let decimalStr = '';

  if (isWhole) {
    integerStr = rounded.toFixed(0);
  } else {
    const fixedStr = rounded.toFixed(2);
    const parts = fixedStr.split('.');
    integerStr = parts[0];
    decimalStr = '.' + parts[1];
  }

  let groupedInteger: string;
  if (integerStr.length <= 3) {
    groupedInteger = integerStr;
  } else {
    const last3 = integerStr.slice(-3);
    const rest = integerStr.slice(0, -3);
    const groupedRest = rest.replace(/\B(?=(\d{2})+(?!\d))/g, ',');
    groupedInteger = `${groupedRest},${last3}`;
  }

  const sign = isNegative ? '-' : '';
  return `${sign}₹${groupedInteger}${decimalStr}`;
}

export function formatPercent(value: number): string {
  if (isNaN(value)) {
    return '0%';
  }
  const rounded = Math.round((value + Number.EPSILON) * 100) / 100;
  return `${rounded}%`;
}

