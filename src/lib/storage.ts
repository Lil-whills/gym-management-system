import { APP_CONFIG } from '../constants/app';
import { generateSeedData } from '../data/seed';
import type { Member, MembershipPlan, Payment, GymProfile, PublicWebsiteSettings } from '../types';

export function getStoredItem<T>(key: string, fallback: T): T {
  try {
    const item = localStorage.getItem(key);
    if (item === null) return fallback;
    return JSON.parse(item) as T;
  } catch (error) {
    console.warn(`Failed to read from localStorage key "${key}":`, error);
    return fallback;
  }
}

export function setStoredItem<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Failed to write to localStorage key "${key}":`, error);
  }
}

export function removeStoredItem(key: string): void {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error(`Failed to remove localStorage key "${key}":`, error);
  }
}

export interface StoredAppData {
  members: Member[];
  plans: MembershipPlan[];
  payments: Payment[];
  gymProfile: GymProfile;
  websiteSettings: PublicWebsiteSettings;
}

/**
 * Initializes localStorage with seed data if not present.
 * Does not overwrite existing user changes unless explicitly reset.
 */
export function initializeStorage(): StoredAppData {
  const isInitialized = localStorage.getItem(APP_CONFIG.storageKeys.hasInitialized);
  const seed = generateSeedData();

  if (!isInitialized) {
    setStoredItem(APP_CONFIG.storageKeys.plans, seed.plans);
    setStoredItem(APP_CONFIG.storageKeys.members, seed.members);
    setStoredItem(APP_CONFIG.storageKeys.payments, seed.payments);
    setStoredItem(APP_CONFIG.storageKeys.gymProfile, seed.gymProfile);
    setStoredItem(APP_CONFIG.storageKeys.websiteSettings, seed.websiteSettings);
    localStorage.setItem(APP_CONFIG.storageKeys.hasInitialized, 'true');

    return seed;
  }

  const plans = getStoredItem<MembershipPlan[]>(APP_CONFIG.storageKeys.plans, seed.plans);
  const members = getStoredItem<Member[]>(APP_CONFIG.storageKeys.members, seed.members);
  const payments = getStoredItem<Payment[]>(APP_CONFIG.storageKeys.payments, seed.payments);
  const gymProfile = getStoredItem<GymProfile>(APP_CONFIG.storageKeys.gymProfile, seed.gymProfile);
  const websiteSettings = getStoredItem<PublicWebsiteSettings>(APP_CONFIG.storageKeys.websiteSettings, seed.websiteSettings);

  return {
    plans,
    members,
    payments,
    gymProfile,
    websiteSettings,
  };
}

/**
 * Hard resets demo data to fresh seed state
 */
export function resetDemoStorage(): StoredAppData {
  const seed = generateSeedData();
  setStoredItem(APP_CONFIG.storageKeys.plans, seed.plans);
  setStoredItem(APP_CONFIG.storageKeys.members, seed.members);
  setStoredItem(APP_CONFIG.storageKeys.payments, seed.payments);
  setStoredItem(APP_CONFIG.storageKeys.gymProfile, seed.gymProfile);
  setStoredItem(APP_CONFIG.storageKeys.websiteSettings, seed.websiteSettings);
  localStorage.setItem(APP_CONFIG.storageKeys.hasInitialized, 'true');
  return seed;
}

/**
 * Exports all data as a formatted JSON string for download/backup
 */
export function exportDataAsJSON(): string {
  const data = {
    exportDate: new Date().toISOString(),
    appName: APP_CONFIG.name,
    version: APP_CONFIG.version,
    members: getStoredItem(APP_CONFIG.storageKeys.members, []),
    plans: getStoredItem(APP_CONFIG.storageKeys.plans, []),
    payments: getStoredItem(APP_CONFIG.storageKeys.payments, []),
    gymProfile: getStoredItem(APP_CONFIG.storageKeys.gymProfile, {}),
    websiteSettings: getStoredItem(APP_CONFIG.storageKeys.websiteSettings, {}),
  };
  return JSON.stringify(data, null, 2);
}
