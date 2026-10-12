import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Users,
  UserCheck,
  Clock,
  CircleDollarSign,
  UserPlus,
  CreditCard,
  ArrowRight,
  RefreshCw,
  Eye,
  Receipt,
  Crown,
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { StatsCard } from '../../components/ui/StatsCard';
import { Card, CardHeader, CardBody } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { EmptyState } from '../../components/ui/EmptyState';
import { formatCurrency } from '../../lib/currency';
import { formatDate, getMembershipStatus } from '../../lib/dates';
import { MemberRenewModal } from '../members/MemberRenewModal';
import { PaymentReceiptModal } from '../payments/PaymentReceiptModal';
import type { Member, Payment } from '../../types';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { members, plans, payments, stats, gymProfile } = useData();

  // State for modals triggered from dashboard
  const [memberToRenew, setMemberToRenew] = useState<Member | null>(null);
  const [selectedReceipt, setSelectedReceipt] = useState<Payment | null>(null);

  // Filter members needing attention (Expiring soon or Expired)
  const attentionMembers = useMemo(() => {
    return members
      .map((m) => ({
        member: m,
        statusInfo: getMembershipStatus(m.expiryDate),
        plan: plans.find((p) => p.id === m.planId),
      }))
      .filter((item) => item.statusInfo.status === 'expiring_soon' || item.statusInfo.status === 'expired')
      .sort((a, b) => a.statusInfo.daysRemaining - b.statusInfo.daysRemaining)
      .slice(0, 6);
  }, [members, plans]);

  // Recent 5 payments
  const recentPayments = useMemo(() => {
    return [...payments]
      .sort((a, b) => new Date(b.paymentDate).getTime() - new Date(a.paymentDate).getTime())
      .slice(0, 5);
  }, [payments]);

  // Revenue chart data: Group payments by registered subscription plan
  const chartData = useMemo(() => {
    const planRevenueMap: Record<string, number> = {};
    const validPlanNames = new Set(plans.map((p) => p.name));
    plans.forEach((p) => {
      planRevenueMap[p.name] = 0;
    });

    payments
      .filter((p) => p.status === 'Completed')
      .forEach((p) => {
        // Only include payments matching registered gym subscription plans; manual entries are excluded to keep chart clean
        if (p.planName && validPlanNames.has(p.planName)) {
          planRevenueMap[p.planName] = (planRevenueMap[p.planName] || 0) + p.amount;
        }
      });

    return Object.entries(planRevenueMap).map(([name, revenue]) => ({
      name: name.replace(' Plan', '').replace(' Pass', ''),
      revenue,
    }));
  }, [plans, payments]);

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-[#0F172A] to-[#1E293B] rounded-2xl p-6 sm:p-8 text-white shadow-lg relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1.5 z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-medium border border-blue-400/20 mb-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Live Gym Management Center
          </div>
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight">
            Welcome to {gymProfile.name}
          </h2>
          <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
            Monitor active members, track expiring packages, issue payment receipts, and streamline your gym’s day-to-day operations.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 z-10">
          <Button
            variant="primary"
            size="md"
            leftIcon={<UserPlus className="w-4 h-4" />}
            onClick={() => navigate('/members/new')}
          >
            Register Member
          </Button>
          <Button
            variant="outline"
            size="md"
            className="bg-white/10 hover:bg-white/20 text-white border-white/20 hover:border-white/30"
            leftIcon={<CreditCard className="w-4 h-4" />}
            onClick={() => navigate('/payments')}
          >
            Payments & Receipts
          </Button>
        </div>

        {/* Subtle Decorative Background Glow */}
        <div className="absolute right-0 top-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* 4 Summary Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <StatsCard
          title="Total Members"
          value={stats.totalMembers}
          subtitle="Enrolled in system"
          icon={<Users className="w-6 h-6 text-[#3B82F6]" />}
          iconBgColor="bg-blue-50"
          onClick={() => navigate('/members')}
        />

        <StatsCard
          title="Active Members"
          value={stats.activeMembers}
          subtitle="Valid membership status"
          icon={<UserCheck className="w-6 h-6 text-[#16A34A]" />}
          iconBgColor="bg-[#DCFCE7]"
          badge={{
            text: `${Math.round((stats.activeMembers / (stats.totalMembers || 1)) * 100)}% active`,
            variant: 'success',
          }}
          onClick={() => navigate('/members?status=active')}
        />

        <StatsCard
          title="Expiring / Attention"
          value={stats.expiringSoonMembers + stats.expiredMembers}
          subtitle={`${stats.expiringSoonMembers} soon · ${stats.expiredMembers} expired`}
          icon={<Clock className="w-6 h-6 text-[#D97706]" />}
          iconBgColor="bg-[#FEF3C7]"
          badge={{
            text: stats.expiringSoonMembers > 0 ? 'Action needed' : 'All good',
            variant: stats.expiringSoonMembers > 0 ? 'warning' : 'success',
          }}
          onClick={() => navigate('/members?status=expiring_soon')}
        />

        <StatsCard
          title="This Month's Dues"
          value={formatCurrency(stats.currentMonthRevenue)}
          subtitle={`Total: ${formatCurrency(stats.totalRevenue)}`}
          icon={<CircleDollarSign className="w-6 h-6 text-[#3B82F6]" />}
          iconBgColor="bg-blue-50"
          onClick={() => navigate('/payments')}
        />
      </div>

      {/* Main 2-Column Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Memberships Needing Attention */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader
              title="Memberships Needing Attention"
              subtitle="Members with expired access or packages expiring within 7 days"
              action={
                <Link
                  to="/members"
                  className="text-xs font-semibold text-[#3B82F6] hover:text-[#2563EB] flex items-center gap-1"
                >
                  View all <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              }
            />
            <CardBody className="p-0">
              {attentionMembers.length === 0 ? (
                <div className="p-6">
                  <EmptyState
                    icon={<UserCheck className="w-6 h-6 text-[#16A34A]" />}
                    title="All memberships are active!"
                    description="There are currently no members with memberships expiring within 7 days."
                  />
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50/80 text-[#64748B] border-b border-[#E7ECF3] uppercase tracking-wider font-semibold">
                      <tr>
                        <th className="py-3 px-5">Member</th>
                        <th className="py-3 px-4">Plan</th>
                        <th className="py-3 px-4">Expiry Date</th>
                        <th className="py-3 px-4">Status</th>
                        <th className="py-3 px-5 text-right">Quick Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E7ECF3] text-[#172033]">
                      {attentionMembers.map(({ member, statusInfo, plan }) => (
                        <tr key={member.id} className="hover:bg-slate-50/70 transition-colors">
                          <td className="py-3 px-5">
                            <Link
                              to={`/members/${member.id}`}
                              className="font-semibold text-[#172033] hover:text-[#3B82F6] transition-colors"
                            >
                              {member.fullName}
                            </Link>
                            <p className="text-[11px] text-[#64748B]">{member.phone}</p>
                          </td>
                          <td className="py-3 px-4">
                            <span className="font-medium">{plan?.name || 'Standard Plan'}</span>
                          </td>
                          <td className="py-3 px-4 font-medium">{formatDate(member.expiryDate)}</td>
                          <td className="py-3 px-4">
                            <Badge variant={statusInfo.badgeVariant} dot size="sm">
                              {statusInfo.label}
                            </Badge>
                          </td>
                          <td className="py-3 px-5 text-right space-x-2">
                            <Button
                              variant="primary"
                              size="sm"
                              leftIcon={<RefreshCw className="w-3 h-3" />}
                              onClick={() => setMemberToRenew(member)}
                            >
                              Renew
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => navigate(`/members/${member.id}`)}
                            >
                              <Eye className="w-3 h-3" />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardBody>
          </Card>

          {/* Revenue Distribution Chart */}
          <Card>
            <CardHeader
              title="Revenue Breakdown by Plan Package"
              subtitle="Aggregated collections across active membership tiers"
            />
            <CardBody>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E7ECF3" />
                    <XAxis
                      dataKey="name"
                      stroke="#64748B"
                      fontSize={11}
                      tickLine={false}
                      axisLine={{ stroke: '#E7ECF3' }}
                    />
                    <YAxis
                      stroke="#64748B"
                      fontSize={11}
                      tickLine={false}
                      axisLine={{ stroke: '#E7ECF3' }}
                      tickFormatter={(val) => `GH₵${val}`}
                    />
                    <Tooltip
                      formatter={(val: any) => [`${formatCurrency(val as number, true)}`, 'Total Revenue']}
                      contentStyle={{
                        backgroundColor: '#FFFFFF',
                        border: '1px solid #E7ECF3',
                        borderRadius: '0.75rem',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                        fontSize: '12px',
                      }}
                    />
                    <Bar
                      dataKey="revenue"
                      fill="#3B82F6"
                      radius={[6, 6, 0, 0]}
                      barSize={40}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Right 1 Col: Quick Actions & Recent Payments */}
        <div className="space-y-6">
          {/* Quick Actions Card */}
          <Card>
            <CardHeader title="Quick Actions" subtitle="Frequently used gym management tasks" />
            <CardBody className="p-4 space-y-2.5">
              <button
                type="button"
                onClick={() => navigate('/members/new')}
                className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-blue-50/80 border border-[#E7ECF3] hover:border-blue-200 transition-all text-left cursor-pointer group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-100 text-[#3B82F6] flex items-center justify-center group-hover:scale-105 transition-transform">
                    <UserPlus className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="block text-xs font-bold text-[#172033] group-hover:text-[#3B82F6]">
                      Register Member
                    </span>
                    <span className="text-[11px] text-[#64748B]">Enroll client and assign start date</span>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-[#3B82F6] transition-colors" />
              </button>

              <button
                type="button"
                onClick={() => navigate('/payments')}
                className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-blue-50/80 border border-[#E7ECF3] hover:border-blue-200 transition-all text-left cursor-pointer group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 text-[#16A34A] flex items-center justify-center group-hover:scale-105 transition-transform">
                    <CreditCard className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="block text-xs font-bold text-[#172033] group-hover:text-[#3B82F6]">
                      Payments & Receipts
                    </span>
                    <span className="text-[11px] text-[#64748B]">View transactions and print receipts</span>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-[#3B82F6] transition-colors" />
              </button>

              <button
                type="button"
                onClick={() => navigate('/plans')}
                className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-blue-50/80 border border-[#E7ECF3] hover:border-blue-200 transition-all text-left cursor-pointer group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                    <Crown className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="block text-xs font-bold text-[#172033] group-hover:text-[#3B82F6]">
                      Subscription Plans
                    </span>
                    <span className="text-[11px] text-[#64748B]">Standard (100), Pro (150), Premium (200)</span>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-[#3B82F6] transition-colors" />
              </button>

              <button
                type="button"
                onClick={() => navigate('/members')}
                className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-blue-50/80 border border-[#E7ECF3] hover:border-blue-200 transition-all text-left cursor-pointer group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-slate-200 text-[#0F172A] flex items-center justify-center group-hover:scale-105 transition-transform">
                    <Users className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="block text-xs font-bold text-[#172033] group-hover:text-[#3B82F6]">
                      View All Members
                    </span>
                    <span className="text-[11px] text-[#64748B]">Search, filter, and export records</span>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-[#3B82F6] transition-colors" />
              </button>
            </CardBody>
          </Card>

          {/* Recent Recorded Payments Feed */}
          <Card>
            <CardHeader
              title="Recent Transactions"
              subtitle="Latest recorded member dues"
              action={
                <Link
                  to="/payments"
                  className="text-xs font-semibold text-[#3B82F6] hover:text-[#2563EB] flex items-center gap-1"
                >
                  All payments <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              }
            />
            <CardBody className="p-0">
              {recentPayments.length === 0 ? (
                <div className="p-6">
                  <EmptyState
                    title="No payments recorded yet"
                    description="Record a payment to view transaction receipts here."
                  />
                </div>
              ) : (
                <div className="divide-y divide-[#E7ECF3]">
                  {recentPayments.map((payment) => (
                    <div
                      key={payment.id}
                      className="p-3.5 flex items-center justify-between hover:bg-slate-50 transition-colors cursor-pointer"
                      onClick={() => setSelectedReceipt(payment)}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#3B82F6] flex items-center justify-center shrink-0">
                          <Receipt className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-semibold text-[#172033] truncate">
                            {payment.memberName}
                          </p>
                          <p className="text-[10px] text-[#64748B]">
                            {payment.paymentMethod} · {formatDate(payment.paymentDate)}
                          </p>
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-xs font-bold text-[#172033]">
                          {formatCurrency(payment.amount)}
                        </p>
                        <span className="text-[10px] text-[#16A34A] font-medium">Completed</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardBody>
          </Card>
        </div>
      </div>

      {/* Modals */}
      <MemberRenewModal
        member={memberToRenew}
        isOpen={!!memberToRenew}
        onClose={() => setMemberToRenew(null)}
      />



      <PaymentReceiptModal
        payment={selectedReceipt}
        isOpen={!!selectedReceipt}
        onClose={() => setSelectedReceipt(null)}
      />
    </div>
  );
};
