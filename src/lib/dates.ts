import {
  parseISO,
  format,
  differenceInCalendarDays,
  addMonths,
  addDays,
  subDays,
  isValid,
  startOfDay,
  isSameMonth,
} from 'date-fns';
import type { MembershipStatusInfo } from '../types';

/**
 * Safely parse a date-only string (YYYY-MM-DD) into a local Date object at midnight
 */
export function parseLocalDate(dateString: string): Date {
  if (!dateString) return new Date();
  const parts = dateString.split('-');
  if (parts.length === 3) {
    const year = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1;
    const day = parseInt(parts[2], 10);
    const date = new Date(year, month, day, 0, 0, 0, 0);
    if (isValid(date)) return date;
  }
  const fallback = parseISO(dateString);
  return isValid(fallback) ? startOfDay(fallback) : new Date();
}

/**
 * Formats a Date object or YYYY-MM-DD string into standard input format YYYY-MM-DD
 */
export function formatToInputDate(date: Date | string): string {
  if (typeof date === 'string') {
    const parsed = parseLocalDate(date);
    return format(parsed, 'yyyy-MM-dd');
  }
  return format(date, 'yyyy-MM-dd');
}

/**
 * Formats a Date object or YYYY-MM-DD string for display (e.g. "Oct 15, 2026")
 */
export function formatDate(dateString: string | Date | undefined): string {
  if (!dateString) return '—';
  const date = typeof dateString === 'string' ? parseLocalDate(dateString) : dateString;
  if (!isValid(date)) return 'Invalid date';
  return format(date, 'MMM d, yyyy');
}

/**
 * Returns today's date formatted as YYYY-MM-DD
 */
export function getTodayString(): string {
  return format(new Date(), 'yyyy-MM-dd');
}

/**
 * Standard single-source-of-truth membership status calculator
 * - Active: valid period and > 7 days remaining
 * - Expiring Soon: not expired and <= 7 days remaining (0 to 7 days)
 * - Expired: expiry date is in the past (< 0 days)
 */
export function getMembershipStatus(expiryDateString: string): MembershipStatusInfo {
  if (!expiryDateString) {
    return {
      status: 'expired',
      label: 'No Expiry Set',
      daysRemaining: -1,
      badgeVariant: 'danger',
    };
  }

  const today = startOfDay(new Date());
  const expiryDate = parseLocalDate(expiryDateString);
  const daysDiff = differenceInCalendarDays(expiryDate, today);

  if (daysDiff < 0) {
    const daysAgo = Math.abs(daysDiff);
    return {
      status: 'expired',
      label: daysAgo === 1 ? 'Expired yesterday' : `Expired ${daysAgo} days ago`,
      daysRemaining: daysDiff,
      badgeVariant: 'danger',
    };
  }

  if (daysDiff <= 7) {
    let label = `Expires in ${daysDiff} days`;
    if (daysDiff === 0) label = 'Expires today';
    if (daysDiff === 1) label = 'Expires tomorrow';

    return {
      status: 'expiring_soon',
      label,
      daysRemaining: daysDiff,
      badgeVariant: 'warning',
    };
  }

  return {
    status: 'active',
    label: `${daysDiff} days remaining`,
    daysRemaining: daysDiff,
    badgeVariant: 'success',
  };
}

/**
 * Calculates a suggested expiry date from a given start date and duration in months
 */
export function calculateExpiryDate(startDateString: string, durationMonths: number): string {
  const startDate = parseLocalDate(startDateString);
  const futureDate = addMonths(startDate, durationMonths || 1);
  const expiryDate = subDays(futureDate, 1);
  return formatToInputDate(expiryDate);
}

/**
 * Calculates suggested renewal dates based on current member expiry
 */
export function calculateRenewalDates(currentExpiryString: string, durationMonths: number): {
  startDate: string;
  expiryDate: string;
} {
  const today = startOfDay(new Date());
  const currentExpiry = parseLocalDate(currentExpiryString);
  const isPast = differenceInCalendarDays(currentExpiry, today) < 0;

  const newStartDate = isPast ? today : addDays(currentExpiry, 1);
  const newStartDateStr = formatToInputDate(newStartDate);
  const newExpiryDateStr = calculateExpiryDate(newStartDateStr, durationMonths);

  return {
    startDate: newStartDateStr,
    expiryDate: newExpiryDateStr,
  };
}

/**
 * Check if a date string falls in the current calendar month
 */
export function isCurrentMonth(dateString: string): boolean {
  if (!dateString) return false;
  const date = parseLocalDate(dateString);
  return isSameMonth(date, new Date());
}
