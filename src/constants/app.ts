export const APP_CONFIG = {
  name: 'LiftDesk',
  tagline: 'Gym Membership Management SaaS',
  description: 'Streamline member tracking, renewals, payments, and public gym branding in one unified workspace.',
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
    websiteSettings: 'liftdesk_website_settings_v1',
    hasInitialized: 'liftdesk_initialized_v1',
  },
  demoBadgeText: 'Client Showcase Demo',
  defaultExpiryWarningDays: 7,
};
