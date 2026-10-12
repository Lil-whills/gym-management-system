export type MembershipStatus = 'active' | 'expiring_soon' | 'expired';

export type PaymentMethod = 'Cash' | 'Mobile Money' | 'Bank Transfer';

export type PaymentStatus = 'Completed' | 'Pending' | 'Refunded';

// SaaS Subscription Tiers for the Gym Facility (LiftDesk Platform Plans)
export type SaaSSubscriptionTier = 'standard' | 'pro' | 'premium';

export interface SaaSSubscriptionPlan {
  id: SaaSSubscriptionTier;
  name: string;
  price: number; // 100, 150, 200 in Ghanaian Cedis
  period: string; // 'month'
  tagline: string;
  category: string;
  badge?: string;
  features: string[];
  limitations?: string[];
  isPopular?: boolean;
  hasWebsite: boolean; // Branding website deployed online & indexed on google
  hasSmsEmailNotifications: boolean; // SMS/Email alerts on expiry dates
  hasOnlineRegistration: boolean; // Member self-registration online
  hasOnlineRenewals: boolean; // Automatic renewal online by members
  hasOnlineReceipts: boolean; // Member can print/view receipts online
  hasInstantAlerts: boolean; // Instant SMS/Email on successful subscription
}

export interface GymSaaSSubscription {
  tier: SaaSSubscriptionTier;
  status: 'Active' | 'Trial' | 'Expired';
  nextBillingDate: string;
  monthlyAmount: number;
}

// Gym Member's custom plan / arrangement configured by the gym centre
export type PlanDurationUnit = 'days' | 'weeks' | 'months' | 'years';

export interface MembershipPlan {
  id: string;
  name: string;
  price: number; // in Ghanaian Cedis
  durationValue: number; // e.g. 1, 6, 3, 4, 7
  durationUnit: PlanDurationUnit; // 'days' | 'weeks' | 'months' | 'years'
  durationMonths?: number; // legacy fallback
  description?: string;
  features?: string[];
  isActive?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Member {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  planId?: string;
  planName?: string; // e.g. "6 Months Subscription", "1 Week Plan", "Monthly Flex", "Annual Pass"
  startDate: string; // YYYY-MM-DD
  expiryDate: string; // YYYY-MM-DD (Manually set by gym)
  amountPaid?: number; // Fee paid in GH₵
  paymentMethod?: PaymentMethod;
  notes?: string;
  emergencyContact?: string;
  joinedDate: string; // YYYY-MM-DD
  createdAt: string;
  updatedAt: string;
}

export interface Payment {
  id: string;
  reference: string;
  memberId: string;
  memberName: string;
  planId?: string;
  planName: string;
  amount: number; // in Ghanaian Cedis
  paymentMethod: PaymentMethod;
  paymentDate: string; // YYYY-MM-DD
  expiryDate?: string; // Expiry date evidence on receipt
  status: PaymentStatus;
  notes?: string;
  createdAt: string;
}

export interface GymOpeningHours {
  weekdays: string;
  saturday: string;
  sunday: string;
}

export interface GymProfile {
  name: string;
  email: string;
  phone: string;
  location: string;
  description: string;
  openingHours: GymOpeningHours;
  logoInitials?: string;
  subscription?: GymSaaSSubscription;
}

export interface MembershipStatusInfo {
  status: MembershipStatus;
  label: string;
  daysRemaining: number;
  badgeVariant: 'success' | 'warning' | 'danger';
}

export interface DashboardStats {
  totalMembers: number;
  activeMembers: number;
  expiringSoonMembers: number;
  expiredMembers: number;
  currentMonthRevenue: number;
  totalRevenue: number;
}

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
  duration?: number;
}
