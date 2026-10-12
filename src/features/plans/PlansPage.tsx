import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import {
  Check,
  Globe,
  Sparkles,
  Smartphone,
  Bell,
  CreditCard,
  Zap,
  Printer,
  Users,
  Calendar,
  Shield,
  Crown,
  Clock,
} from 'lucide-react';
import type { SaaSSubscriptionTier } from '../../types';

export const PlansPage: React.FC = () => {
  const { gymSubscription, updateGymSubscription } = useData();
  const [billingInterval, setBillingInterval] = useState<'monthly' | 'annual'>('monthly');

  const handleSelectTier = (tier: SaaSSubscriptionTier) => {
    if (tier === gymSubscription.tier) return;
    updateGymSubscription(tier);
  };

  // Pricing helper
  const getPrice = (monthlyPrice: number) => {
    if (billingInterval === 'annual') {
      return Math.round(monthlyPrice * 0.8);
    }
    return monthlyPrice;
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-10 lg:p-12 border border-[#E2E8F0] shadow-sm space-y-10">
      {/* Header section matching the template hierarchy in clean white */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-[#0F172A]">
          See what&apos;s new with LiftDesk Plans
        </h1>
        <p className="text-xs sm:text-sm text-[#64748B] leading-relaxed">
          Operational tiers for your fitness centre. Standard, Pro, and Premium packages designed to streamline and scale your gym.
        </p>

        {/* Pill interval switcher */}
        <div className="pt-2">
          <div className="inline-flex items-center p-1 bg-slate-100 rounded-full border border-slate-200 shadow-inner">
            <button
              type="button"
              onClick={() => setBillingInterval('monthly')}
              className={`px-5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                billingInterval === 'monthly'
                  ? 'bg-white text-[#0F172A] shadow-xs'
                  : 'text-[#64748B] hover:text-[#0F172A]'
              }`}
            >
              Monthly
            </button>
            <button
              type="button"
              onClick={() => setBillingInterval('annual')}
              className={`px-5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                billingInterval === 'annual'
                  ? 'bg-white text-[#0F172A] shadow-xs'
                  : 'text-[#64748B] hover:text-[#0F172A]'
              }`}
            >
              <span>Annual</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-700 font-bold border border-emerald-200">
                Save 20%
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* 3 Tier Cards Grid in crisp white */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-6xl mx-auto items-stretch">
        {/* 1. Standard Card */}
        {(() => {
          const isCurrent = gymSubscription.tier === 'standard';
          const price = getPrice(100);

          return (
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-[#E2E8F0] hover:border-slate-300 hover:shadow-md transition-all flex flex-col justify-between">
              <div className="space-y-4">
                {/* Top header row */}
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#64748B]">
                    Standard
                  </span>
                </div>

                {/* Title & Description */}
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-[#0F172A] tracking-tight">
                    Core Management
                  </h2>
                  <p className="text-xs text-[#64748B] mt-2 min-h-[36px] leading-relaxed">
                    Essential tools for boutique studios and front-desk member registration.
                  </p>
                </div>

                {/* Action Button right below description */}
                <div>
                  {isCurrent ? (
                    <button
                      disabled
                      className="w-full py-2.5 rounded-full text-xs font-bold bg-slate-100 text-slate-400 border border-slate-200 cursor-default"
                    >
                      Your current plan
                    </button>
                  ) : (
                    <button
                      onClick={() => handleSelectTier('standard')}
                      className="w-full py-2.5 rounded-full text-xs font-bold bg-[#0F172A] text-white hover:bg-[#1E293B] transition-all cursor-pointer shadow-xs"
                    >
                      Switch to Standard
                    </button>
                  )}
                </div>

                {/* Price */}
                <div className="pt-2">
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-3xl sm:text-4xl font-extrabold text-[#0F172A]">
                      GH₵ {price}
                    </span>
                    <span className="text-xs text-[#64748B] font-medium">/ month</span>
                  </div>
                  {billingInterval === 'annual' && (
                    <p className="text-[11px] text-[#64748B] mt-0.5">
                      Billed annually (GH₵ 960/yr)
                    </p>
                  )}
                </div>

                {/* Features List */}
                <div className="pt-2 space-y-3">
                  <div className="flex items-center gap-2.5 text-xs text-[#334155]">
                    <Users className="w-4 h-4 text-[#64748B] shrink-0" />
                    <span>Full member directory & profiles</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-xs text-[#334155]">
                    <Calendar className="w-4 h-4 text-[#64748B] shrink-0" />
                    <span>Front-desk manual registration</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-xs text-[#334155]">
                    <Clock className="w-4 h-4 text-[#64748B] shrink-0" />
                    <span>Flexible custom expiry tracking</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-xs text-[#334155]">
                    <CreditCard className="w-4 h-4 text-[#64748B] shrink-0" />
                    <span>Payment ledger & cash tracking</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-xs text-[#334155]">
                    <Printer className="w-4 h-4 text-[#64748B] shrink-0" />
                    <span>Single-copy official receipt printing</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-xs text-[#334155]">
                    <Shield className="w-4 h-4 text-[#64748B] shrink-0" />
                    <span>Offline local data persistence</span>
                  </div>
                </div>
              </div>

              {/* Footer note */}
              <div className="mt-8 pt-4 border-t border-slate-100 text-[11px] text-[#64748B]">
                Essential front-desk setup
              </div>
            </div>
          );
        })()}

        {/* 2. Pro Card (RECOMMENDED in crisp white with blue highlights) */}
        {(() => {
          const isCurrent = gymSubscription.tier === 'pro';
          const price = getPrice(150);

          return (
            <div className="bg-white rounded-3xl p-6 sm:p-7 border-2 border-[#3B82F6] shadow-xl shadow-blue-500/10 flex flex-col justify-between relative ring-4 ring-blue-500/10">
              <div className="space-y-4">
                {/* Top header row */}
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#3B82F6]">
                    Pro
                  </span>
                  <span className="text-[10px] font-extrabold uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-blue-50 text-[#3B82F6] border border-blue-200">
                    RECOMMENDED
                  </span>
                </div>

                {/* Title & Description */}
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-[#0F172A] tracking-tight">
                    Growth & Automation
                  </h2>
                  <p className="text-xs text-[#64748B] mt-2 min-h-[36px] leading-relaxed">
                    Branded gym website and automated expiry SMS alerts to maximize member retention.
                  </p>
                </div>

                {/* Action Button */}
                <div>
                  {isCurrent ? (
                    <button
                      disabled
                      className="w-full py-2.5 rounded-full text-xs font-bold bg-blue-50 text-blue-600 border border-blue-200 cursor-default"
                    >
                      Your current plan
                    </button>
                  ) : (
                    <button
                      onClick={() => handleSelectTier('pro')}
                      className="w-full py-2.5 rounded-full text-xs font-bold bg-[#3B82F6] hover:bg-[#2563EB] text-white shadow-md shadow-blue-500/25 transition-all cursor-pointer"
                    >
                      Switch to Pro
                    </button>
                  )}
                </div>

                {/* Price */}
                <div className="pt-2">
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-3xl sm:text-4xl font-extrabold text-[#0F172A]">
                      GH₵ {price}
                    </span>
                    <span className="text-xs text-[#64748B] font-medium">/ month</span>
                  </div>
                  {billingInterval === 'annual' && (
                    <p className="text-[11px] text-[#64748B] mt-0.5">
                      Billed annually (GH₵ 1,440/yr)
                    </p>
                  )}
                </div>

                {/* Features List */}
                <div className="pt-2 space-y-3">
                  <div className="flex items-center gap-2 text-xs font-bold text-[#0F172A]">
                    <span>Everything in Standard, plus:</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-xs text-[#1E293B]">
                    <Globe className="w-4 h-4 text-[#3B82F6] shrink-0" />
                    <span>Free branded gym website online</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-xs text-[#1E293B]">
                    <Sparkles className="w-4 h-4 text-[#3B82F6] shrink-0" />
                    <span>Google Search SEO indexing</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-xs text-[#1E293B]">
                    <Smartphone className="w-4 h-4 text-[#3B82F6] shrink-0" />
                    <span>Automated SMS expiry notifications</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-xs text-[#1E293B]">
                    <Bell className="w-4 h-4 text-[#3B82F6] shrink-0" />
                    <span>Automated email reminder alerts</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-xs text-[#1E293B]">
                    <CreditCard className="w-4 h-4 text-[#3B82F6] shrink-0" />
                    <span>Multi-channel payment recording (MoMo)</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-xs text-[#1E293B]">
                    <Zap className="w-4 h-4 text-[#3B82F6] shrink-0" />
                    <span>Revenue breakdown & package metrics</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-xs text-[#1E293B]">
                    <Check className="w-4 h-4 text-[#3B82F6] shrink-0" />
                    <span>Priority gym setup & onboarding</span>
                  </div>
                </div>
              </div>

              {/* Footer note */}
              <div className="mt-8 pt-4 border-t border-blue-100 text-[11px] text-[#3B82F6] font-medium">
                Our most popular choice for modern fitness clubs
              </div>
            </div>
          );
        })()}

        {/* 3. Premium Card */}
        {(() => {
          const isCurrent = gymSubscription.tier === 'premium';
          const price = getPrice(200);

          return (
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-[#E2E8F0] hover:border-slate-300 hover:shadow-md transition-all flex flex-col justify-between">
              <div className="space-y-4">
                {/* Top header row */}
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#64748B]">
                    Premium
                  </span>
                </div>

                {/* Title & Description */}
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-[#0F172A] tracking-tight">
                    Maximum Power
                  </h2>
                  <p className="text-xs text-[#64748B] mt-2 min-h-[36px] leading-relaxed">
                    The ultimate 24/7 digital suite with online member self-service and direct renewals.
                  </p>
                </div>

                {/* Action Button */}
                <div>
                  {isCurrent ? (
                    <button
                      disabled
                      className="w-full py-2.5 rounded-full text-xs font-bold bg-slate-100 text-slate-400 border border-slate-200 cursor-default"
                    >
                      Your current plan
                    </button>
                  ) : (
                    <button
                      onClick={() => handleSelectTier('premium')}
                      className="w-full py-2.5 rounded-full text-xs font-bold bg-[#0F172A] text-white hover:bg-[#1E293B] transition-all cursor-pointer shadow-xs"
                    >
                      Upgrade to Premium
                    </button>
                  )}
                </div>

                {/* Price */}
                <div className="pt-2">
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-3xl sm:text-4xl font-extrabold text-[#0F172A]">
                      GH₵ {price}
                    </span>
                    <span className="text-xs text-[#64748B] font-medium">/ month</span>
                  </div>
                  {billingInterval === 'annual' && (
                    <p className="text-[11px] text-[#64748B] mt-0.5">
                      Billed annually (GH₵ 1,920/yr)
                    </p>
                  )}
                </div>

                {/* Features List */}
                <div className="pt-2 space-y-3">
                  <div className="flex items-center gap-2 text-xs font-bold text-[#0F172A]">
                    <span>Everything in Pro & Standard, plus:</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-xs text-[#334155]">
                    <Globe className="w-4 h-4 text-purple-600 shrink-0" />
                    <span>Online member self-registration portal</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-xs text-[#334155]">
                    <Smartphone className="w-4 h-4 text-purple-600 shrink-0" />
                    <span>Direct online renewals via MoMo</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-xs text-[#334155]">
                    <Printer className="w-4 h-4 text-purple-600 shrink-0" />
                    <span>Members view & print receipts online</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-xs text-[#334155]">
                    <Bell className="w-4 h-4 text-purple-600 shrink-0" />
                    <span>Instant SMS & email confirmations</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-xs text-[#334155]">
                    <Sparkles className="w-4 h-4 text-purple-600 shrink-0" />
                    <span>Custom domain gym integration</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-xs text-[#334155]">
                    <Crown className="w-4 h-4 text-amber-500 shrink-0" />
                    <span>24/7 dedicated VIP concierge support</span>
                  </div>
                </div>
              </div>

              {/* Footer note */}
              <div className="mt-8 pt-4 border-t border-slate-100 text-[11px] text-[#64748B]">
                Complete hands-off digital management
              </div>
            </div>
          );
        })()}
      </div>

      {/* Footer Notes */}
      <div className="text-center pt-4 border-t border-slate-100 text-xs text-[#64748B] space-y-1.5">
        <p>
          Need custom multi-branch licensing or dedicated enterprise deployment?{' '}
          <span className="text-[#3B82F6] hover:text-[#2563EB] font-medium cursor-pointer">
            Contact LiftDesk Support
          </span>
        </p>
        <p className="text-[11px] text-[#94A3B8]">
          All prices in Ghanaian Cedis (GH₵) &bull; Switch or upgrade your tier anytime &bull; Instant activation
        </p>
      </div>
    </div>
  );
};
