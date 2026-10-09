import React, { useState, useEffect } from 'react';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Textarea } from '../../components/ui/Textarea';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { useData } from '../../context/DataContext';
import { calculateRenewalDates, calculateExpiryDate, formatDate, getMembershipStatus } from '../../lib/dates';
import { APP_CONFIG } from '../../constants/app';
import { Calendar, ArrowRight, CheckCircle2 } from 'lucide-react';
import type { Member, PaymentMethod } from '../../types';

interface MemberRenewModalProps {
  member: Member | null;
  isOpen: boolean;
  onClose: () => void;
}

export const MemberRenewModal: React.FC<MemberRenewModalProps> = ({
  member,
  isOpen,
  onClose,
}) => {
  const { plans, renewMember } = useData();

  const [selectedPlanId, setSelectedPlanId] = useState('');
  const [startDate, setStartDate] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [recordPaymentNow, setRecordPaymentNow] = useState(true);
  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('Mobile Money');
  const [paymentNotes, setPaymentNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (member && isOpen) {
      const activePlans = plans.filter((p) => p.isActive);
      const planToUse = plans.find((p) => p.id === member.planId) || activePlans[0] || plans[0];
      const planId = planToUse?.id || '';

      setSelectedPlanId(planId);

      const renewalDates = calculateRenewalDates(member.expiryDate, planToUse?.durationMonths || 1);
      setStartDate(renewalDates.startDate);
      setExpiryDate(renewalDates.expiryDate);

      setRecordPaymentNow(true);
      setPaymentAmount(planToUse?.price ? planToUse.price.toString() : '');
      setPaymentMethod('Mobile Money');
      setPaymentNotes('');
    }
  }, [member, isOpen, plans]);

  if (!member) return null;

  const currentStatus = getMembershipStatus(member.expiryDate);
  const selectedPlan = plans.find((p) => p.id === selectedPlanId);

  // Handle plan change
  const handlePlanChange = (newPlanId: string) => {
    setSelectedPlanId(newPlanId);
    const plan = plans.find((p) => p.id === newPlanId);
    if (plan) {
      setPaymentAmount(plan.price.toString());
      if (startDate) {
        const newExpiry = calculateExpiryDate(startDate, plan.durationMonths);
        setExpiryDate(newExpiry);
      }
    }
  };

  // Handle start date change
  const handleStartDateChange = (newStart: string) => {
    setStartDate(newStart);
    if (selectedPlan && newStart) {
      const newExpiry = calculateExpiryDate(newStart, selectedPlan.durationMonths);
      setExpiryDate(newExpiry);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPlanId || !startDate || !expiryDate) return;

    setIsSubmitting(true);

    const paymentDetails =
      recordPaymentNow && parseFloat(paymentAmount) > 0
        ? {
            amount: parseFloat(paymentAmount),
            paymentMethod,
            notes: paymentNotes.trim() || undefined,
          }
        : undefined;

    renewMember(member.id, selectedPlanId, startDate, expiryDate, paymentDetails);

    setIsSubmitting(false);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Renew Membership"
      subtitle={`Extend access and configure term for ${member.fullName}`}
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Current Standing Card */}
        <div className="p-3.5 bg-slate-50 rounded-xl border border-[#E7ECF3] flex items-center justify-between">
          <div>
            <span className="text-xs text-[#64748B] block">Current Membership Status:</span>
            <span className="text-sm font-semibold text-[#172033]">{formatDate(member.expiryDate)}</span>
          </div>
          <Badge variant={currentStatus.badgeVariant} dot size="sm">
            {currentStatus.label}
          </Badge>
        </div>

        {/* Plan Selection */}
        <Select
          label="Renewal Membership Plan"
          required
          value={selectedPlanId}
          onChange={(e) => handlePlanChange(e.target.value)}
        >
          {plans.map((p) => (
            <option key={p.id} value={p.id} disabled={!p.isActive}>
              {p.name} — {APP_CONFIG.currency.symbol} {p.price} ({p.durationMonths}{' '}
              {p.durationMonths === 1 ? 'month' : 'months'}) {!p.isActive ? '(Archived)' : ''}
            </option>
          ))}
        </Select>

        {/* Date Ranges preview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Renewal Start Date"
            type="date"
            required
            value={startDate}
            onChange={(e) => handleStartDateChange(e.target.value)}
            helperText="Suggested based on current expiry standing"
          />

          <Input
            label="New Expiry Date"
            type="date"
            required
            value={expiryDate}
            onChange={(e) => setExpiryDate(e.target.value)}
            helperText={`Calculated (+${selectedPlan?.durationMonths || 1} months)`}
          />
        </div>

        {/* Date visual flow summary */}
        <div className="p-3 bg-blue-50/70 rounded-xl border border-blue-100 flex items-center justify-between text-xs text-[#172033]">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-[#3B82F6]" />
            <span className="font-medium">{formatDate(startDate)}</span>
          </div>
          <ArrowRight className="w-4 h-4 text-[#3B82F6]" />
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#16A34A]" />
            <span className="font-bold text-[#16A34A]">{formatDate(expiryDate)}</span>
          </div>
        </div>

        {/* Instant Payment Collection Option */}
        <div className="pt-3 border-t border-[#E7ECF3]">
          <div className="flex items-center gap-2.5 mb-3">
            <input
              type="checkbox"
              id="recordRenewalPayment"
              checked={recordPaymentNow}
              onChange={(e) => setRecordPaymentNow(e.target.checked)}
              className="w-4 h-4 rounded text-[#3B82F6] focus:ring-[#3B82F6] border-[#CBD5E1]"
            />
            <label htmlFor="recordRenewalPayment" className="text-xs font-semibold text-[#172033] cursor-pointer">
              Record renewal payment simultaneously
            </label>
          </div>

          {recordPaymentNow && (
            <div className="p-4 bg-slate-50 rounded-xl border border-[#E7ECF3] space-y-3 animate-in fade-in duration-150">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Input
                  label={`Renewal Fee (${APP_CONFIG.currency.symbol})`}
                  type="number"
                  required={recordPaymentNow}
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(e.target.value)}
                  prefixElement={<span className="text-xs font-medium text-[#64748B]">{APP_CONFIG.currency.symbol}</span>}
                />
                <Select
                  label="Payment Method"
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                >
                  <option value="Mobile Money">Mobile Money (MTN MoMo, Telecel)</option>
                  <option value="Cash">Cash (Front Desk)</option>
                  <option value="Bank Transfer">Bank Transfer</option>
                </Select>
              </div>

              <Textarea
                label="Payment Note (Optional)"
                value={paymentNotes}
                onChange={(e) => setPaymentNotes(e.target.value)}
                placeholder="e.g. Renewal MoMo reference ID or cash receipt"
                rows={2}
              />
            </div>
          )}
        </div>

        {/* Modal Buttons */}
        <div className="pt-3 flex items-center justify-end gap-3 border-t border-[#E7ECF3]">
          <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" isLoading={isSubmitting}>
            Confirm Renewal
          </Button>
        </div>
      </form>
    </Modal>
  );
};
