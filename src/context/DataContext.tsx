import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import type {
  Member,
  MembershipPlan,
  Payment,
  GymProfile,
  DashboardStats,
  PaymentMethod,
  SaaSSubscriptionPlan,
  GymSaaSSubscription,
  SaaSSubscriptionTier,
} from '../types';
import { APP_CONFIG } from '../constants/app';
import { initializeStorage, setStoredItem, resetDemoStorage, getStoredItem } from '../lib/storage';
import { getMembershipStatus, isCurrentMonth, formatToInputDate } from '../lib/dates';
import { SAAS_SUBSCRIPTION_PLANS } from '../data/subscriptionPlans';
import { useToast } from './ToastContext';

interface DataContextType {
  members: Member[];
  plans: MembershipPlan[];
  payments: Payment[];
  gymProfile: GymProfile;
  stats: DashboardStats;
  isLoaded: boolean;

  // SaaS Subscription Plan (Standard, Pro, Premium)
  gymSubscription: GymSaaSSubscription;
  subscriptionPlans: SaaSSubscriptionPlan[];
  updateGymSubscription: (tier: SaaSSubscriptionTier) => void;

  // Member actions
  addMember: (
    memberData: Omit<Member, 'id' | 'createdAt' | 'updatedAt' | 'joinedDate'> & { planName?: string },
    initialPayment?: { amount: number; paymentMethod: PaymentMethod; notes?: string }
  ) => Member;
  updateMember: (id: string, updates: Partial<Member>) => void;
  deleteMember: (id: string) => void;
  renewMember: (
    memberId: string,
    planNameOrId: string,
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

  // Gym Center SaaS Subscription (Standard 100 GHS, Pro 150 GHS, Premium 200 GHS)
  const [gymSubscription, setGymSubscription] = useState<GymSaaSSubscription>(() => {
    return getStoredItem<GymSaaSSubscription>(APP_CONFIG.storageKeys.subscription, {
      tier: 'pro',
      status: 'Active',
      nextBillingDate: '2026-11-01',
      monthlyAmount: 150,
    });
  });

  // Initialize data on mount
  useEffect(() => {
    const data = initializeStorage();
    setPlans(data.plans);
    setMembers(data.members);
    setPayments(data.payments);
    setGymProfile(data.gymProfile);
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

  // Update SaaS Subscription Tier
  const updateGymSubscription = useCallback(
    (tier: SaaSSubscriptionTier) => {
      const targetPlan = SAAS_SUBSCRIPTION_PLANS.find((p) => p.id === tier);
      const updated: GymSaaSSubscription = {
        tier,
        status: 'Active',
        nextBillingDate: '2026-11-01',
        monthlyAmount: targetPlan?.price || 150,
      };
      setGymSubscription(updated);
      setStoredItem(APP_CONFIG.storageKeys.subscription, updated);
      success(
        `Subscription Tier Updated to ${targetPlan?.name || tier}`,
        `Your gym workspace is now active on the ${targetPlan?.name} Plan (GH₵ ${targetPlan?.price}/month).`
      );
    },
    [success]
  );

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
  const getMemberById = useCallback(
    (id: string) => {
      return members.find((m) => m.id === id);
    },
    [members]
  );

  const getPlanById = useCallback(
    (id: string) => {
      return plans.find((p) => p.id === id);
    },
    [plans]
  );

  const getPaymentsByMemberId = useCallback(
    (memberId: string) => {
      return payments.filter((p) => p.memberId === memberId);
    },
    [payments]
  );

  const getActiveMembersCountForPlan = useCallback(
    (planIdOrName: string) => {
      return members.filter((m) => {
        const matchesPlan = m.planId === planIdOrName || m.planName === planIdOrName;
        if (!matchesPlan) return false;
        const status = getMembershipStatus(m.expiryDate);
        return status.status === 'active' || status.status === 'expiring_soon';
      }).length;
    },
    [members]
  );

  // Add Member - with automatic registration payment entry
  const addMember = useCallback(
    (
      memberData: Omit<Member, 'id' | 'createdAt' | 'updatedAt' | 'joinedDate'> & { planName?: string },
      initialPayment?: { amount: number; paymentMethod: PaymentMethod; notes?: string }
    ) => {
      const now = new Date();
      const todayStr = formatToInputDate(now);
      const newMemberId = `mem_${Date.now().toString().slice(-6)}`;

      const selectedPlan = plans.find((p) => p.id === memberData.planId);
      const resolvedPlanName =
        memberData.planName?.trim() ||
        selectedPlan?.name ||
        'Membership Subscription';

      const newMember: Member = {
        ...memberData,
        id: newMemberId,
        planName: resolvedPlanName,
        planId: memberData.planId || 'custom_plan',
        joinedDate: memberData.startDate || todayStr,
        createdAt: todayStr,
        updatedAt: todayStr,
      };

      const updatedMembers = [newMember, ...members];
      persistMembers(updatedMembers);

      // Automatically create payment in ledger so receipt can be printed directly from Payments
      if (initialPayment !== undefined && initialPayment.amount >= 0) {
        const refSuffix = Math.floor(1000 + Math.random() * 9000);
        const newPayment: Payment = {
          id: `pay_${Date.now()}_${refSuffix}`,
          reference: `REC-${now.getFullYear()}-${refSuffix}`,
          memberId: newMember.id,
          memberName: newMember.fullName,
          planId: newMember.planId,
          planName: resolvedPlanName,
          amount: initialPayment.amount,
          paymentMethod: initialPayment.paymentMethod,
          paymentDate: memberData.startDate || todayStr,
          expiryDate: memberData.expiryDate, // Store expiration date evidence for receipt
          status: 'Completed',
          notes:
            initialPayment.notes ||
            `Initial registration (${resolvedPlanName}) - Valid until ${memberData.expiryDate}`,
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

  // Renew Member - with automatic renewal payment entry
  const renewMember = useCallback(
    (
      memberId: string,
      planNameOrId: string,
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

      const selectedPlan = plans.find((p) => p.id === planNameOrId);
      const resolvedPlanName =
        selectedPlan?.name ||
        planNameOrId?.trim() ||
        member.planName ||
        'Membership Renewal';

      const updatedMembers = members.map((m) => {
        if (m.id === memberId) {
          return {
            ...m,
            planId: selectedPlan?.id || member.planId || 'custom_plan',
            planName: resolvedPlanName,
            startDate,
            expiryDate,
            updatedAt: todayStr,
          };
        }
        return m;
      });

      persistMembers(updatedMembers);

      // Automatically record renewal payment into financial ledger
      if (paymentDetails && paymentDetails.amount >= 0) {
        const refSuffix = Math.floor(1000 + Math.random() * 9000);
        const newPayment: Payment = {
          id: `pay_${Date.now()}_${refSuffix}`,
          reference: `REC-${now.getFullYear()}-${refSuffix}`,
          memberId: member.id,
          memberName: member.fullName,
          planId: selectedPlan?.id || member.planId || 'custom_plan',
          planName: resolvedPlanName,
          amount: paymentDetails.amount,
          paymentMethod: paymentDetails.paymentMethod,
          paymentDate: startDate || todayStr,
          expiryDate: expiryDate, // Store expiration date evidence for receipt
          status: 'Completed',
          notes:
            paymentDetails.notes ||
            `Membership renewal (${resolvedPlanName}) - Valid until ${expiryDate}`,
          createdAt: todayStr,
        };

        persistPayments([newPayment, ...payments]);
      }

      success(
        'Membership Renewed & Payment Recorded',
        `${member.fullName}'s renewal until ${expiryDate} is saved. Receipt ready in Payments.`
      );
    },
    [members, plans, payments, persistMembers, persistPayments, success, error]
  );

  // Plan actions
  const addPlan = useCallback(
    (planData: Omit<MembershipPlan, 'id' | 'createdAt' | 'updatedAt'>) => {
      const todayStr = formatToInputDate(new Date());
      const newPlanId = `plan_${Date.now().toString().slice(-6)}`;
      const durationValue = planData.durationValue || 1;
      const durationUnit = planData.durationUnit || 'months';
      let durationMonths = planData.durationMonths;
      if (!durationMonths) {
        if (durationUnit === 'years') durationMonths = durationValue * 12;
        else if (durationUnit === 'months') durationMonths = durationValue;
        else durationMonths = 1;
      }

      const newPlan: MembershipPlan = {
        ...planData,
        id: newPlanId,
        durationValue,
        durationUnit,
        durationMonths,
        isActive: planData.isActive !== false,
        createdAt: todayStr,
        updatedAt: todayStr,
      };

      const updatedPlans = [...plans, newPlan];
      persistPlans(updatedPlans);
      success('Subscription Plan Created', `"${newPlan.name}" is now ready for quick member registration.`);
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
      const plan = plans.find((p) => p.id === id);
      const updatedPlans = plans.filter((p) => p.id !== id);
      persistPlans(updatedPlans);
      info('Plan removed', `"${plan?.name || 'Plan'}" was removed from your gym plans.`);
      return { success: true };
    },
    [plans, persistPlans, info]
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
      success('Payment updated', 'Transaction record was updated.');
    },
    [payments, persistPayments, success]
  );

  const deletePayment = useCallback(
    (id: string) => {
      const updatedPayments = payments.filter((p) => p.id !== id);
      persistPayments(updatedPayments);
      info('Payment deleted', 'Transaction was removed from your records.');
    },
    [payments, persistPayments, info]
  );

  // Settings & Profile actions
  const updateGymProfile = useCallback(
    (updates: Partial<GymProfile>) => {
      const updated = { ...gymProfile, ...updates };
      persistGymProfile(updated);
      success('Settings saved', 'Gym profile information was updated.');
    },
    [gymProfile, persistGymProfile, success]
  );

  const resetData = useCallback(() => {
    const fresh = resetDemoStorage();
    setPlans(fresh.plans);
    setMembers(fresh.members);
    setPayments(fresh.payments);
    setGymProfile(fresh.gymProfile);
    info('Demo Data Reset', 'All records have been restored to initial sample data.');
  }, [info]);

  return (
    <DataContext.Provider
      value={{
        members,
        plans,
        payments,
        gymProfile,
        stats,
        isLoaded,

        gymSubscription,
        subscriptionPlans: SAAS_SUBSCRIPTION_PLANS,
        updateGymSubscription,

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
