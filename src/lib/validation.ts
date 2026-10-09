import { parseLocalDate } from './dates';
import { differenceInCalendarDays } from 'date-fns';

export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

export function validateEmail(email: string): boolean {
  if (!email) return true; // optional unless specified
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
}

export function validatePhone(phone: string): boolean {
  if (!phone) return false;
  // Allows formats like 0244123456, +233244123456, 024 412 3456, +233 24 412 3456
  const cleanPhone = phone.replace(/[\s\-()]/g, '');
  const phoneRegex = /^(\+?233|0)[235][0-9]{8}$/;
  return cleanPhone.length >= 9 && (/^[0-9+]+$/.test(cleanPhone) || phoneRegex.test(cleanPhone));
}

export function validateMemberForm(data: {
  fullName: string;
  email?: string;
  phone: string;
  planId: string;
  startDate: string;
  expiryDate: string;
}): ValidationResult {
  const errors: Record<string, string> = {};

  if (!data.fullName || data.fullName.trim().length < 2) {
    errors.fullName = 'Full name is required (at least 2 characters).';
  }

  if (data.email && !validateEmail(data.email)) {
    errors.email = 'Please enter a valid email address.';
  }

  if (!data.phone || data.phone.trim().length < 7) {
    errors.phone = 'A valid phone number is required (e.g., 024 456 7890).';
  }

  if (!data.planId) {
    errors.planId = 'Please select a membership plan.';
  }

  if (!data.startDate) {
    errors.startDate = 'Start date is required.';
  }

  if (!data.expiryDate) {
    errors.expiryDate = 'Expiry date is required.';
  } else if (data.startDate) {
    const start = parseLocalDate(data.startDate);
    const end = parseLocalDate(data.expiryDate);
    if (differenceInCalendarDays(end, start) < 0) {
      errors.expiryDate = 'Expiry date cannot be earlier than the start date.';
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

export function validatePlanForm(data: {
  name: string;
  price: number | string;
  durationMonths: number | string;
  description?: string;
}): ValidationResult {
  const errors: Record<string, string> = {};

  if (!data.name || data.name.trim().length < 2) {
    errors.name = 'Plan name is required.';
  }

  const priceNum = typeof data.price === 'string' ? parseFloat(data.price) : data.price;
  if (isNaN(priceNum) || priceNum <= 0) {
    errors.price = 'Price must be greater than GH₵ 0.';
  }

  const durationNum = typeof data.durationMonths === 'string' ? parseInt(data.durationMonths, 10) : data.durationMonths;
  if (isNaN(durationNum) || durationNum <= 0) {
    errors.durationMonths = 'Duration must be at least 1 month.';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

export function validatePaymentForm(data: {
  memberId: string;
  amount: number | string;
  paymentMethod: string;
  paymentDate: string;
}): ValidationResult {
  const errors: Record<string, string> = {};

  if (!data.memberId) {
    errors.memberId = 'Please select a member.';
  }

  const amountNum = typeof data.amount === 'string' ? parseFloat(data.amount) : data.amount;
  if (isNaN(amountNum) || amountNum <= 0) {
    errors.amount = 'Amount must be greater than GH₵ 0.';
  }

  if (!data.paymentMethod) {
    errors.paymentMethod = 'Please select a payment method.';
  }

  if (!data.paymentDate) {
    errors.paymentDate = 'Payment date is required.';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}
