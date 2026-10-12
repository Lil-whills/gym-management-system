export const APP_CONFIG = {
  name: 'LiftDesk',
  tagline: 'Gym Membership Management SaaS',
  description: 'Streamline member tracking, renewals, and payments in one unified workspace.',
  version: '1.0.0-prototype',
  currency: {
    symbol: 'GH₵',
    code: 'GHS',
    name: 'Ghanaian Cedi',
  },
  storageKeys: {
    members: 'liftdesk_members_v1',
    plans: 'liftdesk_plans_v1',
    payments: 'liftdesk_payments_v1',
    gymProfile: 'liftdesk_gym_profile_v1',
    subscription: 'liftdesk_gym_subscription_v1',
    hasInitialized: 'liftdesk_initialized_v1',
  },
  demoBadgeText: 'Client Showcase Demo',
  defaultExpiryWarningDays: 7,
};
