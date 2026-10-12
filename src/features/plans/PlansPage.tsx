import React from 'react';
import { useData } from '../../context/DataContext';
import { Card, CardHeader } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { formatCurrency } from '../../lib/currency';
import { APP_CONFIG } from '../../constants/app';
import {
  Check,
  X,
  Crown,
  Sparkles,
  Globe,
  Bell,
  Zap,
} from 'lucide-react';
import type { SaaSSubscriptionTier } from '../../types';

export const PlansPage: React.FC = () => {
  const { gymSubscription, updateGymSubscription, subscriptionPlans } = useData();

  const handleSelectTier = (tier: SaaSSubscriptionTier) => {
    if (tier === gymSubscription.tier) return;
    updateGymSubscription(tier);
  };

  const currentPlan = subscriptionPlans.find((p) => p.id === gymSubscription.tier);

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-50 text-[#3B82F6] text-xs font-bold uppercase tracking-wider mb-2 border border-blue-200">
            <Sparkles className="w-3.5 h-3.5" />
            <span>LiftDesk Software Licensing</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-[#172033] tracking-tight">
            Subscription Plans
          </h2>
          <p className="text-xs sm:text-sm text-[#64748B] mt-1">
            Operational tiers for your fitness centre: Standard (GH₵ 100), Pro (GH₵ 150), and Premium (GH₵ 200) per month.
          </p>
        </div>

        {/* Current Active Plan Badge */}
        <div className="p-3.5 bg-white rounded-2xl border border-[#E7ECF3] shadow-xs flex items-center gap-3 self-start md:self-auto">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white flex items-center justify-center font-bold shadow-md shadow-blue-500/20">
            <Crown className="w-5 h-5 text-amber-300" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-[#64748B] tracking-wider block">
              Active Facility Subscription
            </span>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-sm text-[#172033]">
                {currentPlan?.name} Plan
              </span>
              <Badge variant="success" dot size="sm">
                Active
              </Badge>
            </div>
            <span className="text-[11px] text-[#3B82F6] font-semibold">
              {formatCurrency(currentPlan?.price || 150)} / month
            </span>
          </div>
        </div>
      </div>

      {/* Subscription Tier Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {subscriptionPlans.map((plan) => {
          const isCurrent = plan.id === gymSubscription.tier;
          const isPremium = plan.id === 'premium';

          return (
            <Card
              key={plan.id}
              className={`flex flex-col justify-between relative transition-all duration-200 ${
                isCurrent
                  ? 'ring-2 ring-[#3B82F6] shadow-lg border-blue-200 bg-white'
                  : isPremium
                  ? 'hover:border-purple-300 hover:shadow-md'
                  : 'hover:border-blue-300 hover:shadow-md'
              }`}
            >
              {/* Highlight Tag */}
              {plan.badge && (
                <div
                  className={`absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider text-white shadow-sm ${
                    isPremium
                      ? 'bg-gradient-to-r from-purple-600 to-indigo-600'
                      : 'bg-[#3B82F6]'
                  }`}
                >
                  {plan.badge}
                </div>
              )}

              <div>
                {/* Header Section */}
                <div className="p-6 border-b border-[#E7ECF3]">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-[#64748B] uppercase tracking-wider">
                      {plan.category}
                    </span>
                    {isCurrent && (
                      <Badge variant="success" dot size="sm">
                        Current Plan
                      </Badge>
                    )}
                  </div>

                  <h3 className="text-xl font-black text-[#172033] tracking-tight">
                    {plan.name} Plan
                  </h3>
                  <p className="text-xs text-[#64748B] mt-1 min-h-[32px] leading-relaxed">
                    {plan.tagline}
                  </p>

                  <div className="mt-4 flex items-baseline gap-1">
                    <span className="text-3xl sm:text-4xl font-black text-[#172033]">
                      {APP_CONFIG.currency.symbol} {plan.price}
                    </span>
                    <span className="text-xs font-semibold text-[#64748B]">/ month</span>
                  </div>
                </div>

                {/* Features Checklist */}
                <div className="p-6 space-y-4">
                  <div>
                    <span className="text-[11px] font-bold text-[#172033] uppercase tracking-wider block mb-3">
                      Included Capabilities:
                    </span>
                    <ul className="space-y-2.5 text-xs text-[#172033]">
                      {plan.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-2.5">
                          <div className="w-4 h-4 rounded-full bg-emerald-100 text-[#16A34A] flex items-center justify-center shrink-0 mt-0.5">
                            <Check className="w-2.5 h-2.5 stroke-[3]" />
                          </div>
                          <span
                            className={
                              feature.startsWith('Everything') ||
                              feature.includes('Free Branding') ||
                              feature.includes('Automatic Online') ||
                              feature.includes('Automated SMS')
                                ? 'font-bold text-[#172033]'
                                : 'text-slate-700'
                            }
                          >
                            {feature}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Limitations if any */}
                  {plan.limitations && plan.limitations.length > 0 && (
                    <div className="pt-3 border-t border-[#E7ECF3]">
                      <span className="text-[10px] font-semibold text-[#94A3B8] uppercase tracking-wider block mb-2">
                        Not Included:
                      </span>
                      <ul className="space-y-1.5 text-xs text-[#94A3B8]">
                        {plan.limitations.map((limit, idx) => (
                          <li key={idx} className="flex items-center gap-2">
                            <X className="w-3.5 h-3.5 text-slate-300 shrink-0" />
                            <span className="line-through">{limit}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>

              {/* Bottom Action */}
              <div className="p-6 pt-0">
                <Button
                  variant={isCurrent ? 'outline' : isPremium ? 'primary' : 'primary'}
                  className={`w-full justify-center ${
                    isCurrent
                      ? 'bg-blue-50/50 text-[#3B82F6] border-blue-200 cursor-default'
                      : isPremium
                      ? 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700'
                      : ''
                  }`}
                  onClick={() => handleSelectTier(plan.id)}
                  disabled={isCurrent}
                >
                  {isCurrent
                    ? 'Active Workspace Plan'
                    : isPremium
                    ? 'Upgrade to Premium (GH₵ 200)'
                    : `Switch to ${plan.name} (GH₵ ${plan.price})`}
                </Button>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Feature Matrix / Comparison Table */}
      <Card className="overflow-hidden">
        <CardHeader
          title="Feature & Service Comparison Matrix"
          subtitle="Detailed breakdown of capabilities across Standard, Pro, and Premium tiers"
        />
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-[#64748B] border-b border-[#E7ECF3] uppercase tracking-wider font-semibold">
              <tr>
                <th className="py-4 px-6 w-2/5">Feature / Capability</th>
                <th className="py-4 px-4 text-center">Standard (GH₵ 100)</th>
                <th className="py-4 px-4 text-center bg-blue-50/50 text-[#3B82F6]">
                  Pro (GH₵ 150)
                </th>
                <th className="py-4 px-4 text-center text-purple-700">
                  Premium (GH₵ 200)
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E7ECF3] text-[#172033]">
              <tr>
                <td className="py-3.5 px-6 font-semibold">
                  Full Member Directory & Manual Registration
                </td>
                <td className="py-3.5 px-4 text-center font-bold text-[#16A34A]">&#10003;</td>
                <td className="py-3.5 px-4 text-center font-bold text-[#16A34A] bg-blue-50/20">
                  &#10003;
                </td>
                <td className="py-3.5 px-4 text-center font-bold text-[#16A34A]">&#10003;</td>
              </tr>
              <tr>
                <td className="py-3.5 px-6 font-semibold">
                  Custom Expiry Dates & Terms (1 week, 6 months, etc.)
                </td>
                <td className="py-3.5 px-4 text-center font-bold text-[#16A34A]">&#10003;</td>
                <td className="py-3.5 px-4 text-center font-bold text-[#16A34A] bg-blue-50/20">
                  &#10003;
                </td>
                <td className="py-3.5 px-4 text-center font-bold text-[#16A34A]">&#10003;</td>
              </tr>
              <tr>
                <td className="py-3.5 px-6 font-semibold">
                  Payments Ledger & Official 1-Copy Receipt Printing
                </td>
                <td className="py-3.5 px-4 text-center font-bold text-[#16A34A]">&#10003;</td>
                <td className="py-3.5 px-4 text-center font-bold text-[#16A34A] bg-blue-50/20">
                  &#10003;
                </td>
                <td className="py-3.5 px-4 text-center font-bold text-[#16A34A]">&#10003;</td>
              </tr>
              <tr>
                <td className="py-3.5 px-6 font-semibold">
                  Free Branding Gym Website (Deployed Online & Google-Indexed)
                </td>
                <td className="py-3.5 px-4 text-center text-[#94A3B8]">&mdash;</td>
                <td className="py-3.5 px-4 text-center font-bold text-[#16A34A] bg-blue-50/20">
                  &#10003; Included
                </td>
                <td className="py-3.5 px-4 text-center font-bold text-[#16A34A]">
                  &#10003; Included
                </td>
              </tr>
              <tr>
                <td className="py-3.5 px-6 font-semibold">
                  Automated SMS / Email Notifications to Members on Expiry Dates
                </td>
                <td className="py-3.5 px-4 text-center text-[#94A3B8]">&mdash;</td>
                <td className="py-3.5 px-4 text-center font-bold text-[#16A34A] bg-blue-50/20">
                  &#10003; Automated
                </td>
                <td className="py-3.5 px-4 text-center font-bold text-[#16A34A]">
                  &#10003; Automated
                </td>
              </tr>
              <tr>
                <td className="py-3.5 px-6 font-semibold">
                  Online Member Self-Registration via Gym Portal
                </td>
                <td className="py-3.5 px-4 text-center text-[#94A3B8]">&mdash;</td>
                <td className="py-3.5 px-4 text-center text-[#94A3B8] bg-blue-50/20">&mdash;</td>
                <td className="py-3.5 px-4 text-center font-bold text-[#16A34A]">
                  &#10003; Self-Service
                </td>
              </tr>
              <tr>
                <td className="py-3.5 px-6 font-semibold">
                  Automatic Online Renewal by Members Directly
                </td>
                <td className="py-3.5 px-4 text-center text-[#94A3B8]">&mdash;</td>
                <td className="py-3.5 px-4 text-center text-[#94A3B8] bg-blue-50/20">&mdash;</td>
                <td className="py-3.5 px-4 text-center font-bold text-[#16A34A]">
                  &#10003; 24/7 Online
                </td>
              </tr>
              <tr>
                <td className="py-3.5 px-6 font-semibold">
                  Instant SMS / Email Confirmation on Successful Subscription
                </td>
                <td className="py-3.5 px-4 text-center text-[#94A3B8]">&mdash;</td>
                <td className="py-3.5 px-4 text-center font-bold text-[#16A34A] bg-blue-50/20">
                  &#10003;
                </td>
                <td className="py-3.5 px-4 text-center font-bold text-[#16A34A]">
                  &#10003;
                </td>
              </tr>
              <tr>
                <td className="py-3.5 px-6 font-semibold">
                  Online Receipt Viewing & Direct Print by Members
                </td>
                <td className="py-3.5 px-4 text-center text-[#94A3B8]">&mdash;</td>
                <td className="py-3.5 px-4 text-center text-[#94A3B8] bg-blue-50/20">&mdash;</td>
                <td className="py-3.5 px-4 text-center font-bold text-[#16A34A]">
                  &#10003; Online Portal
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </Card>

      {/* Value Add Highlights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 bg-white rounded-xl border border-[#E7ECF3] flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-blue-100 text-[#3B82F6] flex items-center justify-center shrink-0">
            <Globe className="w-4 h-4" />
          </div>
          <div>
            <h4 className="font-bold text-xs text-[#172033]">Free Branding Website</h4>
            <p className="text-[11px] text-[#64748B] mt-0.5 leading-relaxed">
              Included on Pro & Premium. Fully hosted, branded with your gym logo, and indexed on Google Search.
            </p>
          </div>
        </div>

        <div className="p-4 bg-white rounded-xl border border-[#E7ECF3] flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-emerald-100 text-[#16A34A] flex items-center justify-center shrink-0">
            <Bell className="w-4 h-4" />
          </div>
          <div>
            <h4 className="font-bold text-xs text-[#172033]">Automated Expiry Alerts</h4>
            <p className="text-[11px] text-[#64748B] mt-0.5 leading-relaxed">
              Instant SMS and email reminders notify members 3 days and 1 day prior to membership expiry.
            </p>
          </div>
        </div>

        <div className="p-4 bg-white rounded-xl border border-[#E7ECF3] flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center shrink-0">
            <Zap className="w-4 h-4" />
          </div>
          <div>
            <h4 className="font-bold text-xs text-[#172033]">Online Member Portal</h4>
            <p className="text-[11px] text-[#64748B] mt-0.5 leading-relaxed">
              Premium exclusive: Members register, renew online via MoMo, and print their own receipts anytime.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
