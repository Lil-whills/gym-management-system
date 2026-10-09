import React, { useState, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import { Card, CardHeader, CardBody } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { EmptyState } from '../../components/ui/EmptyState';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import { formatDate, getMembershipStatus } from '../../lib/dates';
import { formatCurrency } from '../../lib/currency';
import { MemberRenewModal } from './MemberRenewModal';
import { MemberEditModal } from './MemberEditModal';
import { RecordPaymentModal } from '../payments/RecordPaymentModal';
import { PaymentReceiptModal } from '../payments/PaymentReceiptModal';
import {
  ArrowLeft,
  Phone,
  Mail,
  CreditCard,
  RefreshCw,
  Edit2,
  Trash2,
  Receipt,
  AlertTriangle,
  CheckCircle2,
} from 'lucide-react';
import type { Payment } from '../../types';

export const MemberDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getMemberById, plans, getPaymentsByMemberId, deleteMember } = useData();

  const member = getMemberById(id || '');

  // Modals state
  const [isRenewOpen, setIsRenewOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isRecordPaymentOpen, setIsRecordPaymentOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState<Payment | null>(null);

  const memberPayments = useMemo(() => {
    return member ? getPaymentsByMemberId(member.id) : [];
  }, [member, getPaymentsByMemberId]);

  const totalPaid = useMemo(() => {
    return memberPayments
      .filter((p) => p.status === 'Completed')
      .reduce((acc, curr) => acc + curr.amount, 0);
  }, [memberPayments]);

  if (!member) {
    return (
      <div className="max-w-3xl mx-auto py-12">
        <EmptyState
          title="Member not found"
          description="The requested member record could not be found or has been deleted."
          actionLabel="Back to Member Directory"
          onAction={() => navigate('/members')}
        />
      </div>
    );
  }

  const plan = plans.find((p) => p.id === member.planId);
  const statusInfo = getMembershipStatus(member.expiryDate);

  const handleDelete = () => {
    deleteMember(member.id);
    navigate('/members');
  };

  return (
    <div className="space-y-6">
      {/* Top navigation */}
      <div className="flex items-center justify-between">
        <Link
          to="/members"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#64748B] hover:text-[#172033] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Member Directory</span>
        </Link>
      </div>

      {/* Member Hero Profile Card */}
      <div className="bg-white rounded-2xl border border-[#E7ECF3] p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          {/* Avatar & Main Info */}
          <div className="flex items-start sm:items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-[#0F172A] text-white flex items-center justify-center font-bold text-xl shrink-0 shadow-md">
              {member.fullName.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2.5">
                <h2 className="text-xl sm:text-2xl font-bold text-[#172033] tracking-tight">
                  {member.fullName}
                </h2>
                <Badge variant={statusInfo.badgeVariant} dot size="md">
                  {statusInfo.label}
                </Badge>
              </div>
              <p className="text-xs text-[#64748B] mt-1">
                Member ID: <span className="font-mono font-semibold">{member.id}</span> · Enrolled since{' '}
                {formatDate(member.joinedDate || member.startDate)}
              </p>
            </div>
          </div>

          {/* Top Quick Actions */}
          <div className="flex flex-wrap items-center gap-2.5">
            <Button
              variant="primary"
              size="sm"
              leftIcon={<RefreshCw className="w-4 h-4" />}
              onClick={() => setIsRenewOpen(true)}
            >
              Renew Membership
            </Button>
            <Button
              variant="outline"
              size="sm"
              leftIcon={<CreditCard className="w-4 h-4" />}
              onClick={() => setIsRecordPaymentOpen(true)}
            >
              Record Payment
            </Button>
            <Button
              variant="ghost"
              size="sm"
              leftIcon={<Edit2 className="w-4 h-4" />}
              onClick={() => setIsEditOpen(true)}
            >
              Edit
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-[#DC2626] hover:bg-red-50"
              leftIcon={<Trash2 className="w-4 h-4" />}
              onClick={() => setIsDeleteOpen(true)}
            >
              Delete
            </Button>
          </div>
        </div>
      </div>

      {/* Grid: Details & Payment History */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Membership standing & Contact details */}
        <div className="space-y-6">
          {/* Membership Package Card */}
          <Card>
            <CardHeader
              title="Membership Plan & Standing"
              action={
                <Badge variant={statusInfo.badgeVariant} dot size="sm">
                  {statusInfo.status === 'active' ? 'Active' : statusInfo.status === 'expiring_soon' ? 'Expiring' : 'Expired'}
                </Badge>
              }
            />
            <CardBody className="space-y-4">
              <div>
                <span className="text-xs text-[#64748B] block">Current Plan:</span>
                <p className="text-base font-bold text-[#172033]">{plan?.name || 'Standard Plan'}</p>
                <p className="text-xs text-[#64748B] mt-0.5">{plan?.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-3 border-t border-[#E7ECF3] text-xs">
                <div>
                  <span className="text-[#64748B] block">Start Date:</span>
                  <span className="font-semibold text-[#172033]">{formatDate(member.startDate)}</span>
                </div>
                <div>
                  <span className="text-[#64748B] block">Expiry Date:</span>
                  <span className="font-bold text-[#172033]">{formatDate(member.expiryDate)}</span>
                </div>
              </div>

              {/* Status Alert Banner */}
              <div
                className={`p-3.5 rounded-xl border text-xs flex items-center gap-3 ${
                  statusInfo.status === 'active'
                    ? 'bg-[#DCFCE7]/70 border-[#BBF7D0] text-[#16A34A]'
                    : statusInfo.status === 'expiring_soon'
                    ? 'bg-[#FEF3C7]/70 border-[#FDE68A] text-[#D97706]'
                    : 'bg-[#FEE2E2]/70 border-[#FECACA] text-[#DC2626]'
                }`}
              >
                {statusInfo.status === 'active' ? (
                  <CheckCircle2 className="w-5 h-5 shrink-0" />
                ) : (
                  <AlertTriangle className="w-5 h-5 shrink-0" />
                )}
                <div className="font-medium">
                  {statusInfo.daysRemaining >= 0 ? (
                    <span>
                      {statusInfo.daysRemaining} days of gym access remaining.
                    </span>
                  ) : (
                    <span>
                      Membership expired {Math.abs(statusInfo.daysRemaining)} days ago. Please renew to restore access.
                    </span>
                  )}
                </div>
              </div>
            </CardBody>
          </Card>

          {/* Contact Details Card */}
          <Card>
            <CardHeader title="Contact Information" />
            <CardBody className="space-y-3.5 text-xs">
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-[#3B82F6]" />
                <div>
                  <span className="text-[#64748B] block text-[11px]">Phone Number</span>
                  <a href={`tel:${member.phone}`} className="font-semibold text-[#172033] hover:underline">
                    {member.phone}
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-[#3B82F6]" />
                <div>
                  <span className="text-[#64748B] block text-[11px]">Email Address</span>
                  <span className="font-semibold text-[#172033]">{member.email || 'None provided'}</span>
                </div>
              </div>

              {member.emergencyContact && (
                <div className="pt-2 border-t border-[#E7ECF3]">
                  <span className="text-[#64748B] block text-[11px]">Emergency Contact</span>
                  <span className="font-medium text-[#172033]">{member.emergencyContact}</span>
                </div>
              )}

              {member.notes && (
                <div className="pt-2 border-t border-[#E7ECF3]">
                  <span className="text-[#64748B] block text-[11px]">Notes & Preferences</span>
                  <p className="text-[#172033] bg-slate-50 p-2.5 rounded-lg border border-[#E7ECF3] mt-1 italic">
                    {member.notes}
                  </p>
                </div>
              )}
            </CardBody>
          </Card>
        </div>

        {/* Right 2 Columns: Payment History Ledger */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader
              title="Payment History & Ledger"
              subtitle={`Total lifetime contributions: ${formatCurrency(totalPaid, true)}`}
              action={
                <Button
                  variant="primary"
                  size="sm"
                  leftIcon={<CreditCard className="w-4 h-4" />}
                  onClick={() => setIsRecordPaymentOpen(true)}
                >
                  Record Payment
                </Button>
              }
            />
            <CardBody className="p-0">
              {memberPayments.length === 0 ? (
                <div className="p-8">
                  <EmptyState
                    icon={<Receipt className="w-6 h-6 text-[#64748B]" />}
                    title="No payments recorded yet"
                    description="Record the first membership dues or renewal payment for this client."
                    actionLabel="Record Payment"
                    onAction={() => setIsRecordPaymentOpen(true)}
                  />
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 text-[#64748B] border-b border-[#E7ECF3] uppercase tracking-wider font-semibold">
                      <tr>
                        <th className="py-3 px-5">Receipt Ref</th>
                        <th className="py-3 px-4">Date</th>
                        <th className="py-3 px-4">Plan / Purpose</th>
                        <th className="py-3 px-4">Method</th>
                        <th className="py-3 px-4">Amount</th>
                        <th className="py-3 px-5 text-right">Receipt</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E7ECF3] text-[#172033]">
                      {memberPayments.map((payment) => (
                        <tr key={payment.id} className="hover:bg-slate-50/80 transition-colors">
                          <td className="py-3 px-5 font-mono font-semibold text-[#3B82F6]">
                            {payment.reference}
                          </td>
                          <td className="py-3 px-4 font-medium">{formatDate(payment.paymentDate)}</td>
                          <td className="py-3 px-4 font-medium">{payment.planName}</td>
                          <td className="py-3 px-4">
                            <span className="px-2 py-0.5 rounded-full bg-slate-100 text-[#172033] font-medium text-[11px] border border-[#E7ECF3]">
                              {payment.paymentMethod}
                            </span>
                          </td>
                          <td className="py-3 px-4 font-bold text-[#172033]">
                            {formatCurrency(payment.amount, true)}
                          </td>
                          <td className="py-3 px-5 text-right">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setSelectedReceipt(payment)}
                            >
                              View
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
        </div>
      </div>

      {/* Modals */}
      <MemberRenewModal
        member={member}
        isOpen={isRenewOpen}
        onClose={() => setIsRenewOpen(false)}
      />

      <MemberEditModal
        member={member}
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
      />

      <RecordPaymentModal
        preselectedMemberId={member.id}
        isOpen={isRecordPaymentOpen}
        onClose={() => setIsRecordPaymentOpen(false)}
      />

      <PaymentReceiptModal
        payment={selectedReceipt}
        isOpen={!!selectedReceipt}
        onClose={() => setSelectedReceipt(null)}
      />

      <ConfirmDialog
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDelete}
        title="Delete Member Record"
        description={
          <div>
            <p className="mb-2">
              Are you sure you want to permanently delete <strong>{member.fullName}</strong>?
            </p>
            <p className="text-xs text-amber-700 bg-amber-50 p-2.5 rounded-lg border border-amber-200">
              Note: Historical payment records will remain in your financial ledger for accounting purposes.
            </p>
          </div>
        }
        confirmLabel="Confirm Deletion"
        variant="danger"
      />
    </div>
  );
};
