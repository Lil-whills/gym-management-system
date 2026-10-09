import { APP_CONFIG } from '../constants/app';

/**
 * Format a number as Ghanaian Cedis (e.g. GH₵ 1,600 or GH₵ 180.00)
 */
export function formatCurrency(amount: number | string | undefined, showDecimals: boolean = false): string {
  const num = typeof amount === 'string' ? parseFloat(amount) : (amount ?? 0);
  if (isNaN(num)) return `${APP_CONFIG.currency.symbol} 0`;

  const formattedNumber = new Intl.NumberFormat('en-GH', {
    minimumFractionDigits: showDecimals ? 2 : (num % 1 === 0 ? 0 : 2),
    maximumFractionDigits: 2,
  }).format(num);

  return `${APP_CONFIG.currency.symbol} ${formattedNumber}`;
}

/**
 * Parses a currency string or input into a clean positive number
 */
export function parseCurrencyInput(value: string | number): number {
  if (typeof value === 'number') return Math.max(0, value);
  const clean = value.replace(/[^0-9.]/g, '');
  const parsed = parseFloat(clean);
  return isNaN(parsed) ? 0 : Math.max(0, parsed);
}
