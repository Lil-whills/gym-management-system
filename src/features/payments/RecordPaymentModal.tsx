import React, { useState, useEffect } from 'react';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Textarea } from '../../components/ui/Textarea';
import { Button } from '../../components/ui/Button';
import { useData } from '../../context/DataContext';
import { getTodayString } from '../../lib/dates';
import { validatePaymentForm } from '../../lib/validation';
import { APP_CONFIG } from '../../constants/app';
import type { PaymentMethod } from '../../types';

interface RecordPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  preselectedMemberId?: string;
}

export const RecordPaymentModal: React.FC<RecordPaymentModalProps> = ({
  isOpen,
  onClose,
  preselectedMemberId,
}) => {
  const { members, plans, addPayment } = useData();

  const [memberId, setMemberId] = useState(preselectedMemberId || '');
  const [amount, setAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('Mobile Money');
  const [paymentDate, setPaymentDate] = useState(getTodayString());
  const [notes, setNotes] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Sync preselectedMemberId when opened
  useEffect(() => {
    if (isOpen) {
      const targetMemberId = preselectedMemberId || (members[0]?.id || '');
      setMemberId(targetMemberId);
      setPaymentDate(getTodayString());
      setNotes('');
      setErrors({});

      if (targetMemberId) {
        const member = members.find((m) => m.id === targetMemberId);
        if (member) {
          const plan = plans.find((p) => p.id === member.planId);
          if (plan) {
            setAmount(plan.price.toString());
          }
        }
      }
    }
  }, [isOpen, preselectedMemberId, members, plans]);

  // When member selection changes, suggest member's plan price
  const handleMemberChange = (newMemberId: string) => {
    setMemberId(newMemberId);
    const member = members.find((m) => m.id === newMemberId);
    if (member) {
      const plan = plans.find((p) => p.id === member.planId);
      if (plan) {
        setAmount(plan.price.toString());
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const validation = validatePaymentForm({
      memberId,
      amount,
      paymentMethod,
      paymentDate,
    });

    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    setIsSubmitting(true);

    const member = members.find((m) => m.id === memberId);
    const plan = plans.find((p) => p.id === member?.planId);

    addPayment({
      memberId,
      memberName: member?.fullName || 'Unknown Member',
      planId: plan?.id || 'general',
      planName: plan?.name || 'General Payment',
      amount: parseFloat(amount),
      paymentMethod,
      paymentDate,
      status: 'Completed',
      notes: notes.trim() || undefined,
    });

    setIsSubmitting(false);
    onClose();
  };

  const selectedMember = members.find((m) => m.id === memberId);
  const memberPlan = plans.find((p) => p.id === selectedMember?.planId);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Record Membership Payment"
      subtitle="Issue an official transaction receipt for cash, Mobile Money, or bank transfer"
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Member Selector */}
        <Select
          label="Select Member"
          required
          value={memberId}
          onChange={(e) => handleMemberChange(e.target.value)}
          error={errors.memberId}
        >
          <option value="">-- Choose Member --</option>
          {members.map((m) => (
            <option key={m.id} value={m.id}>
              {m.fullName} ({m.phone})
            </option>
          ))}
        </Select>

        {/* Selected Member's Plan Info Banner */}
        {selectedMember && (
          <div className="p-3 bg-slate-50 rounded-lg border border-[#E7ECF3] flex items-center justify-between text-xs">
            <div>
              <span className="text-[#64748B] block">Assigned Plan:</span>
              <span className="font-semibold text-[#172033]">{memberPlan?.name || 'No Plan'}</span>
            </div>
            <div className="text-right">
              <span className="text-[#64748B] block">Standard Dues:</span>
              <span className="font-bold text-[#3B82F6]">
                {APP_CONFIG.currency.symbol} {memberPlan?.price || 0}
              </span>
            </div>
          </div>
        )}

        {/* Amount in Cedis */}
        <Input
          label={`Amount Paid (${APP_CONFIG.currency.symbol})`}
          type="number"
          step="1"
          min="1"
          required
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="e.g. 180"
          prefixElement={<span className="font-medium text-xs text-[#64748B]">{APP_CONFIG.currency.symbol}</span>}
          error={errors.amount}
          helperText="Enter the total amount received from the member"
        />

        {/* Payment Method */}
        <Select
          label="Payment Method"
          required
          value={paymentMethod}
          onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
          error={errors.paymentMethod}
        >
          <option value="Mobile Money">Mobile Money (MTN MoMo, Telecel Cash, AT Money)</option>
          <option value="Cash">Cash (Front Desk)</option>
          <option value="Bank Transfer">Bank Transfer / Direct Deposit</option>
        </Select>

        {/* Payment Date */}
        <Input
          label="Payment Date"
          type="date"
          required
          value={paymentDate}
          onChange={(e) => setPaymentDate(e.target.value)}
          error={errors.paymentDate}
        />

        {/* Notes */}
        <Textarea
          label="Transaction Notes (Optional)"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="e.g. MoMo Transaction ID 9823145, paid by partner, partial discount note..."
          rows={2}
        />

        <div className="pt-3 flex items-center justify-end gap-3 border-t border-[#E7ECF3]">
          <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" isLoading={isSubmitting}>
            Record Transaction
          </Button>
        </div>
      </form>
    </Modal>
  );
};
