import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import type {
  Member,
  MembershipPlan,
  Payment,
  GymProfile,
  PublicWebsiteSettings,
  DashboardStats,
  PaymentMethod,
} from '../types';
import { APP_CONFIG } from '../constants/app';
import { initializeStorage, setStoredItem, resetDemoStorage } from '../lib/storage';
import { getMembershipStatus, isCurrentMonth, formatToInputDate } from '../lib/dates';
import { useToast } from './ToastContext';

interface DataContextType {
  members: Member[];
  plans: MembershipPlan[];
  payments: Payment[];
  gymProfile: GymProfile;
  websiteSettings: PublicWebsiteSettings;
  stats: DashboardStats;
  isLoaded: boolean;

  // Member actions
  addMember: (
    memberData: Omit<Member, 'id' | 'createdAt' | 'updatedAt' | 'joinedDate'>,
    initialPayment?: { amount: number; paymentMethod: PaymentMethod; notes?: string }
  ) => Member;
  updateMember: (id: string, updates: Partial<Member>) => void;
  deleteMember: (id: string) => void;
  renewMember: (
    memberId: string,
    planId: string,
    startDate: string,
    expiryDate: string,
    paymentDetails?: { amount: number; paymentMethod: PaymentMethod; notes?: string }
  ) => void;
  getMemberById: (id: string) => Member | undefined;

  // Plan actions
  addPlan: (planData: Omit<MembershipPlan, 'id' | 'createdAt' | 'updatedAt'>) => MembershipPlan;
  updatePlan: (id: string, updates: Partial<MembershipPlan>) => void;
  togglePlanActive: (id: string) => void;
  deletePlan: (id: string) => { success: boolean; message?: string };
  getPlanById: (id: string) => MembershipPlan | undefined;
  getActiveMembersCountForPlan: (planId: string) => number;

  // Payment actions
  addPayment: (paymentData: Omit<Payment, 'id' | 'reference' | 'createdAt'>) => Payment;
  updatePayment: (id: string, updates: Partial<Payment>) => void;
  deletePayment: (id: string) => void;
  getPaymentsByMemberId: (memberId: string) => Payment[];

  // Settings & Profile actions
  updateGymProfile: (updates: Partial<GymProfile>) => void;
  updateWebsiteSettings: (updates: Partial<PublicWebsiteSettings>) => void;
  resetData: () => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: React.ReactNode }) {
  const { success, error, info } = useToast();
  const [isLoaded, setIsLoaded] = useState(false);

  const [members, setMembers] = useState<Member[]>([]);
  const [plans, setPlans] = useState<MembershipPlan[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [gymProfile, setGymProfile] = useState<GymProfile>({} as GymProfile);
  const [websiteSettings, setWebsiteSettings] = useState<PublicWebsiteSettings>({} as PublicWebsiteSettings);

  // Initialize data on mount
  useEffect(() => {
    const data = initializeStorage();
    setPlans(data.plans);
    setMembers(data.members);
    setPayments(data.payments);
    setGymProfile(data.gymProfile);
    setWebsiteSettings(data.websiteSettings);
    setIsLoaded(true);
  }, []);

  // Sync state changes with localStorage
  const persistMembers = useCallback((newMembers: Member[]) => {
    setMembers(newMembers);
    setStoredItem(APP_CONFIG.storageKeys.members, newMembers);
  }, []);

  const persistPlans = useCallback((newPlans: MembershipPlan[]) => {
    setPlans(newPlans);
    setStoredItem(APP_CONFIG.storageKeys.plans, newPlans);
  }, []);

  const persistPayments = useCallback((newPayments: Payment[]) => {
    setPayments(newPayments);
    setStoredItem(APP_CONFIG.storageKeys.payments, newPayments);
  }, []);

  const persistGymProfile = useCallback((newProfile: GymProfile) => {
    setGymProfile(newProfile);
    setStoredItem(APP_CONFIG.storageKeys.gymProfile, newProfile);
  }, []);

  const persistWebsiteSettings = useCallback((newSettings: PublicWebsiteSettings) => {
    setWebsiteSettings(newSettings);
    setStoredItem(APP_CONFIG.storageKeys.websiteSettings, newSettings);
  }, []);

  // Compute live dynamic stats
  const stats = useMemo<DashboardStats>(() => {
    let activeMembers = 0;
    let expiringSoonMembers = 0;
    let expiredMembers = 0;

    members.forEach((member) => {
      const statusInfo = getMembershipStatus(member.expiryDate);
      if (statusInfo.status === 'active') activeMembers++;
      else if (statusInfo.status === 'expiring_soon') expiringSoonMembers++;
      else if (statusInfo.status === 'expired') expiredMembers++;
    });

    const currentMonthRevenue = payments
      .filter((p) => p.status === 'Completed' && isCurrentMonth(p.paymentDate))
      .reduce((acc, curr) => acc + curr.amount, 0);

    const totalRevenue = payments
      .filter((p) => p.status === 'Completed')
      .reduce((acc, curr) => acc + curr.amount, 0);

    return {
      totalMembers: members.length,
      activeMembers,
      expiringSoonMembers,
      expiredMembers,
      currentMonthRevenue,
      totalRevenue,
    };
  }, [members, payments]);

  // Member getters and actions
  const getMemberById = useCallback((id: string) => {
    return members.find((m) => m.id === id);
  }, [members]);

  const getPlanById = useCallback((id: string) => {
    return plans.find((p) => p.id === id);
  }, [plans]);

  const getPaymentsByMemberId = useCallback((memberId: string) => {
    return payments
      .filter((p) => p.memberId === memberId)
      .sort((a, b) => new Date(b.paymentDate).getTime() - new Date(a.paymentDate).getTime());
  }, [payments]);

  const getActiveMembersCountForPlan = useCallback((planId: string) => {
    return members.filter((m) => m.planId === planId).length;
  }, [members]);

  // Add Member
  const addMember = useCallback(
    (
      memberData: Omit<Member, 'id' | 'createdAt' | 'updatedAt' | 'joinedDate'>,
      initialPayment?: { amount: number; paymentMethod: PaymentMethod; notes?: string }
    ) => {
      const now = new Date();
      const todayStr = formatToInputDate(now);
      const uniqueSuffix = Math.floor(1000 + Math.random() * 9000);
      const newMemberId = `mem_${Date.now().toString().slice(-4)}_${uniqueSuffix}`;

      const newMember: Member = {
        ...memberData,
        id: newMemberId,
        joinedDate: memberData.startDate || todayStr,
        createdAt: todayStr,
        updatedAt: todayStr,
      };

      const updatedMembers = [newMember, ...members];
      persistMembers(updatedMembers);

      if (initialPayment && initialPayment.amount > 0) {
        const selectedPlan = plans.find((p) => p.id === memberData.planId);
        const refSuffix = Math.floor(1000 + Math.random() * 9000);
        const newPayment: Payment = {
          id: `pay_${Date.now()}_${refSuffix}`,
          reference: `REC-${now.getFullYear()}-${refSuffix}`,
          memberId: newMember.id,
          memberName: newMember.fullName,
          planId: memberData.planId,
          planName: selectedPlan?.name || 'Membership Plan',
          amount: initialPayment.amount,
          paymentMethod: initialPayment.paymentMethod,
          paymentDate: memberData.startDate || todayStr,
          status: 'Completed',
          notes: initialPayment.notes || 'Initial registration payment',
          createdAt: todayStr,
        };

        persistPayments([newPayment, ...payments]);
      }

      success('Member registered successfully', `${newMember.fullName} has been added to LiftDesk.`);
      return newMember;
    },
    [members, plans, payments, persistMembers, persistPayments, success]
  );

  // Update Member
  const updateMember = useCallback(
    (id: string, updates: Partial<Member>) => {
      const todayStr = formatToInputDate(new Date());
      const updatedMembers = members.map((m) => {
        if (m.id === id) {
          return { ...m, ...updates, updatedAt: todayStr };
        }
        return m;
      });

      persistMembers(updatedMembers);
      success('Member updated', 'Member information was saved successfully.');
    },
    [members, persistMembers, success]
  );

  // Delete Member
  const deleteMember = useCallback(
    (id: string) => {
      const target = members.find((m) => m.id === id);
      const updatedMembers = members.filter((m) => m.id !== id);
      persistMembers(updatedMembers);
      info('Member deleted', `${target?.fullName || 'Member'} was removed from your records.`);
    },
    [members, persistMembers, info]
  );

  // Renew Member
  const renewMember = useCallback(
    (
      memberId: string,
      planId: string,
      startDate: string,
      expiryDate: string,
      paymentDetails?: { amount: number; paymentMethod: PaymentMethod; notes?: string }
    ) => {
      const now = new Date();
      const todayStr = formatToInputDate(now);
      const member = members.find((m) => m.id === memberId);
      if (!member) {
        error('Member not found', 'Unable to process renewal.');
        return;
      }

      const updatedMembers = members.map((m) => {
        if (m.id === memberId) {
          return {
            ...m,
            planId,
            startDate,
            expiryDate,
            updatedAt: todayStr,
          };
        }
        return m;
      });

      persistMembers(updatedMembers);

      if (paymentDetails && paymentDetails.amount > 0) {
        const selectedPlan = plans.find((p) => p.id === planId);
        const refSuffix = Math.floor(1000 + Math.random() * 9000);
        const newPayment: Payment = {
          id: `pay_${Date.now()}_${refSuffix}`,
          reference: `REC-${now.getFullYear()}-${refSuffix}`,
          memberId: member.id,
          memberName: member.fullName,
          planId: planId,
          planName: selectedPlan?.name || 'Membership Plan Renewal',
          amount: paymentDetails.amount,
          paymentMethod: paymentDetails.paymentMethod,
          paymentDate: startDate || todayStr,
          status: 'Completed',
          notes: paymentDetails.notes || `Membership renewal (${selectedPlan?.name || 'Plan'})`,
          createdAt: todayStr,
        };

        persistPayments([newPayment, ...payments]);
      }

      success('Membership Renewed', `${member.fullName}'s membership is now renewed until ${expiryDate}.`);
    },
    [members, plans, payments, persistMembers, persistPayments, success, error]
  );

  // Plan actions
  const addPlan = useCallback(
    (planData: Omit<MembershipPlan, 'id' | 'createdAt' | 'updatedAt'>) => {
      const todayStr = formatToInputDate(new Date());
      const newPlanId = `plan_${Date.now().toString().slice(-6)}`;
      const newPlan: MembershipPlan = {
        ...planData,
        id: newPlanId,
        createdAt: todayStr,
        updatedAt: todayStr,
      };

      persistPlans([...plans, newPlan]);
      success('Plan created', `"${newPlan.name}" has been created.`);
      return newPlan;
    },
    [plans, persistPlans, success]
  );

  const updatePlan = useCallback(
    (id: string, updates: Partial<MembershipPlan>) => {
      const todayStr = formatToInputDate(new Date());
      const updatedPlans = plans.map((p) => {
        if (p.id === id) {
          return { ...p, ...updates, updatedAt: todayStr };
        }
        return p;
      });

      persistPlans(updatedPlans);
      success('Plan updated', 'Membership plan details saved.');
    },
    [plans, persistPlans, success]
  );

  const togglePlanActive = useCallback(
    (id: string) => {
      const plan = plans.find((p) => p.id === id);
      if (!plan) return;

      const newState = !plan.isActive;
      updatePlan(id, { isActive: newState });
      info(
        newState ? 'Plan Activated' : 'Plan Deactivated',
        `"${plan.name}" is now ${newState ? 'available for member enrollment' : 'hidden from new enrollments'}.`
      );
    },
    [plans, updatePlan, info]
  );

  const deletePlan = useCallback(
    (id: string): { success: boolean; message?: string } => {
      const assignedCount = members.filter((m) => m.planId === id).length;
      if (assignedCount > 0) {
        return {
          success: false,
          message: `Cannot delete plan because ${assignedCount} member(s) are currently assigned to it. You can deactivate this plan instead.`,
        };
      }

      const plan = plans.find((p) => p.id === id);
      const updatedPlans = plans.filter((p) => p.id !== id);
      persistPlans(updatedPlans);
      info('Plan removed', `"${plan?.name || 'Plan'}" has been deleted.`);
      return { success: true };
    },
    [members, plans, persistPlans, info]
  );

  // Payment actions
  const addPayment = useCallback(
    (paymentData: Omit<Payment, 'id' | 'reference' | 'createdAt'>) => {
      const now = new Date();
      const todayStr = formatToInputDate(now);
      const refSuffix = Math.floor(1000 + Math.random() * 9000);
      const newPayment: Payment = {
        ...paymentData,
        id: `pay_${Date.now()}_${refSuffix}`,
        reference: `REC-${now.getFullYear()}-${refSuffix}`,
        createdAt: todayStr,
      };

      persistPayments([newPayment, ...payments]);
      success('Payment recorded', `Receipt ${newPayment.reference} created for ${newPayment.memberName}.`);
      return newPayment;
    },
    [payments, persistPayments, success]
  );

  const updatePayment = useCallback(
    (id: string, updates: Partial<Payment>) => {
      const updatedPayments = payments.map((p) => {
        if (p.id === id) {
          return { ...p, ...updates };
        }
        return p;
      });

      persistPayments(updatedPayments);
      success('Payment updated', 'Transaction details have been updated.');
    },
    [payments, persistPayments, success]
  );

  const deletePayment = useCallback(
    (id: string) => {
      const target = payments.find((p) => p.id === id);
      const updatedPayments = payments.filter((p) => p.id !== id);
      persistPayments(updatedPayments);
      info('Payment deleted', `Receipt ${target?.reference || id} was removed.`);
    },
    [payments, persistPayments, info]
  );

  // Gym Profile & Settings actions
  const updateGymProfile = useCallback(
    (updates: Partial<GymProfile>) => {
      const updated = { ...gymProfile, ...updates };
      persistGymProfile(updated);

      // Keep website settings synchronized with profile name/location/contact
      const updatedWeb = {
        ...websiteSettings,
        gymName: updated.name || websiteSettings.gymName,
        location: updated.location || websiteSettings.location,
        contactEmail: updated.email || websiteSettings.contactEmail,
        contactPhone: updated.phone || websiteSettings.contactPhone,
      };
      persistWebsiteSettings(updatedWeb);

      success('Settings saved', 'Gym profile and public website details updated.');
    },
    [gymProfile, websiteSettings, persistGymProfile, persistWebsiteSettings, success]
  );

  const updateWebsiteSettings = useCallback(
    (updates: Partial<PublicWebsiteSettings>) => {
      const updated = { ...websiteSettings, ...updates };
      persistWebsiteSettings(updated);

      // Keep gym profile name in sync
      if (updates.gymName && updates.gymName !== gymProfile.name) {
        persistGymProfile({ ...gymProfile, name: updates.gymName });
      }

      success('Website updated', 'Public gym website configuration saved.');
    },
    [websiteSettings, gymProfile, persistWebsiteSettings, persistGymProfile, success]
  );

  // Reset Demo Data
  const resetData = useCallback(() => {
    const fresh = resetDemoStorage();
    setPlans(fresh.plans);
    setMembers(fresh.members);
    setPayments(fresh.payments);
    setGymProfile(fresh.gymProfile);
    setWebsiteSettings(fresh.websiteSettings);
    info('Demo Data Reset', 'All records have been restored to initial sample data.');
  }, [info]);

  return (
    <DataContext.Provider
      value={{
        members,
        plans,
        payments,
        gymProfile,
        websiteSettings,
        stats,
        isLoaded,

        addMember,
        updateMember,
        deleteMember,
        renewMember,
        getMemberById,

        addPlan,
        updatePlan,
        togglePlanActive,
        deletePlan,
        getPlanById,
        getActiveMembersCountForPlan,

        addPayment,
        updatePayment,
        deletePayment,
        getPaymentsByMemberId,

        updateGymProfile,
        updateWebsiteSettings,
        resetData,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}
