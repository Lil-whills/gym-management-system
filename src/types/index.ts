export type MembershipStatus = 'active' | 'expiring_soon' | 'expired';

export type PaymentMethod = 'Cash' | 'Mobile Money' | 'Bank Transfer';

export type PaymentStatus = 'Completed' | 'Pending' | 'Refunded';

export interface MembershipPlan {
  id: string;
  name: string;
  price: number; // in Ghanaian Cedis
  durationMonths: number;
  description: string;
  features: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Member {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  planId: string;
  startDate: string; // YYYY-MM-DD
  expiryDate: string; // YYYY-MM-DD
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
  planId: string;
  planName: string;
  amount: number; // in Ghanaian Cedis
  paymentMethod: PaymentMethod;
  paymentDate: string; // YYYY-MM-DD
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
}

export interface WebsiteFeature {
  id: string;
  title: string;
  description: string;
  iconName: string;
}

export interface PublicWebsiteSettings {
  gymName: string;
  headline: string;
  subheadline: string;
  aboutText: string;
  location: string;
  contactPhone: string;
  contactEmail: string;
  openingHoursText: string;
  accentColor: string;
  heroTag: string;
  features: WebsiteFeature[];
  callToActionText: string;
  whatsappNumber?: string;
  instagramHandle?: string;
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
