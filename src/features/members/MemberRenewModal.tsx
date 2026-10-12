import React, { useState, useEffect } from 'react';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Textarea } from '../../components/ui/Textarea';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { useData } from '../../context/DataContext';
import { calculateRenewalDates, formatDate, getMembershipStatus, calculatePlanExpiry, formatPlanDuration } from '../../lib/dates';
import { APP_CONFIG } from '../../constants/app';
import { formatCurrency } from '../../lib/currency';
import { Calendar, ArrowRight, CheckCircle2, Receipt, ShieldCheck, Sparkles, Lock, FileEdit } from 'lucide-react';
import { addDays, addMonths, addYears, format } from 'date-fns';
import type { Member, PaymentMethod, MembershipPlan } from '../../types';

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
  const { renewMember, plans } = useData();

  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);
  const [planName, setPlanName] = useState('');
  const [startDate, setStartDate] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [paymentAmount, setPaymentAmount] = useState('180');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('Mobile Money');
  const [paymentNotes, setPaymentNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (member && isOpen) {
      const renewalDates = calculateRenewalDates(member.expiryDate, 1);
      setStartDate(renewalDates.startDate);

      // Match member's existing plan in plans if possible
      const matched = plans.find((p) => p.id === member.planId || p.name === member.planName);
      if (matched) {
        setSelectedPlanId(matched.id);
        setPlanName(matched.name);
        setPaymentAmount(matched.price.toString());
        const durVal = matched.durationValue || matched.durationMonths || 1;
        const durUnit = matched.durationUnit || 'months';
        setExpiryDate(calculatePlanExpiry(renewalDates.startDate, durVal, durUnit));
      } else {
        setSelectedPlanId('manual');
        setPlanName(member.planName || 'Custom Renewal (Manual)');
        setExpiryDate(renewalDates.expiryDate);
        setPaymentAmount(member.amountPaid ? member.amountPaid.toString() : '180');
      }

      setPaymentMethod('Mobile Money');
      setPaymentNotes(`Renewal for ${member.fullName}`);
    }
  }, [member, isOpen, plans]);

  if (!member) return null;

  const currentStatus = getMembershipStatus(member.expiryDate);
  const isManualMode = selectedPlanId === 'manual';
  const selectedPlan = plans.find((p) => p.id === selectedPlanId);

  // When staff selects a gym plan for renewal (Mode 1: Locked to Plan)
  const handleSelectPlan = (plan: MembershipPlan) => {
    setSelectedPlanId(plan.id);
    setPlanName(plan.name);
    setPaymentAmount(plan.price.toString());
    const durationVal = plan.durationValue || plan.durationMonths || 1;
    const durationUnit = plan.durationUnit || 'months';
    const calculatedExpiry = calculatePlanExpiry(startDate, durationVal, durationUnit);
    setExpiryDate(calculatedExpiry);
  };

  // When staff chooses manual renewal (Mode 2: Unlocked custom inputs)
  const handleSelectManual = () => {
    setSelectedPlanId('manual');
    setPlanName('Custom Renewal (Manual)');
    const defaultExpiry = format(addMonths(new Date(startDate || new Date()), 1), 'yyyy-MM-dd');
    setExpiryDate(defaultExpiry);
  };

  // Quick duration applier relative to current renewal start date (manual mode only)
  const applyDuration = (type: 'week' | '1month' | '3months' | '6months' | '1year') => {
    const base = startDate ? new Date(startDate) : new Date();
    let calculated = new Date();

    if (type === 'week') calculated = addDays(base, 7);
    else if (type === '1month') calculated = addMonths(base, 1);
    else if (type === '3months') calculated = addMonths(base, 3);
    else if (type === '6months') calculated = addMonths(base, 6);
    else if (type === '1year') calculated = addYears(base, 1);

    setExpiryDate(format(calculated, 'yyyy-MM-dd'));
  };

  const handleStartDateChange = (newStart: string) => {
    setStartDate(newStart);
    if (selectedPlan) {
      const durVal = selectedPlan.durationValue || selectedPlan.durationMonths || 1;
      const durUnit = selectedPlan.durationUnit || 'months';
      setExpiryDate(calculatePlanExpiry(newStart, durVal, durUnit));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!planName.trim() || !startDate || !expiryDate) return;

    setIsSubmitting(true);

    const parsedAmount = parseFloat(paymentAmount) >= 0 ? parseFloat(paymentAmount) : 0;

    // Automatically record the renewal payment in the ledger
    const paymentDetails = {
      amount: parsedAmount,
      paymentMethod,
      notes: paymentNotes.trim() || undefined,
    };

    renewMember(
      member.id,
      isManualMode ? planName.trim() : selectedPlanId || planName.trim(),
      startDate,
      expiryDate,
      paymentDetails
    );

    setIsSubmitting(false);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Renew Membership"
      subtitle={`Configure renewal package and automatically record payment for ${member.fullName}`}
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Current Standing Card */}
        <div className="p-3.5 bg-slate-50 rounded-xl border border-[#E7ECF3] flex items-center justify-between">
          <div>
            <span className="text-xs text-[#64748B] block">Current Membership Standing:</span>
            <span className="text-sm font-semibold text-[#172033]">
              {member.planName || 'Active Package'} &bull; Expiry: {formatDate(member.expiryDate)}
            </span>
          </div>
          <Badge variant={currentStatus.badgeVariant} dot size="sm">
            {currentStatus.label}
          </Badge>
        </div>

        {/* Gym subscription plan shortcuts for renewal */}
        <div>
          <label className="block text-xs font-semibold text-[#172033] mb-1.5 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#3B82F6]" />
              <span>Select Renewal Package:</span>
            </span>
            <span className="text-[11px] text-[#64748B]">Choose defined plan or manual renewal</span>
          </label>
          <div className="flex flex-wrap gap-2">
            {plans.map((p) => {
              const isSelected = selectedPlanId === p.id;
              const durLabel = formatPlanDuration(
                p.durationValue || p.durationMonths || 1,
                p.durationUnit || 'months'
              );

              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => handleSelectPlan(p)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all cursor-pointer flex items-center gap-2 ${
                    isSelected
                      ? 'bg-blue-50 text-[#3B82F6] border-blue-400 font-bold shadow-xs'
                      : 'bg-white text-[#172033] border-[#E7ECF3] hover:border-slate-300'
                  }`}
                >
                  <span>{p.name}</span>
                  <span className="text-[10px] text-[#64748B] bg-slate-100 px-1.5 py-0.5 rounded">
                    {durLabel} &bull; {formatCurrency(p.price)}
                  </span>
                </button>
              );
            })}

            {/* Manual Renewal Chip */}
            <button
              type="button"
              onClick={handleSelectManual}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium border border-dashed transition-all cursor-pointer flex items-center gap-1.5 ${
                isManualMode
                  ? 'bg-amber-50 text-amber-800 border-amber-400 font-bold shadow-xs'
                  : 'bg-white text-[#64748B] border-slate-300 hover:border-slate-400'
              }`}
            >
              <FileEdit className="w-3.5 h-3.5 text-amber-600" />
              <span>Manual / One-Off Renewal</span>
            </button>
          </div>
        </div>

        {/* Renewal Package Title */}
        <Input
          label="Renewal Membership Plan Title"
          required
          value={planName}
          onChange={(e) => setPlanName(e.target.value)}
          disabled={!isManualMode}
          placeholder="e.g. 6 Months Subscription, 3 Weeks Trial..."
          helperText={
            isManualMode
              ? 'Enter custom title for this manual renewal (excluded from plan charts)'
              : `Locked to selected plan "${selectedPlan?.name}".`
          }
          prefixElement={
            !isManualMode ? (
              <Lock className="w-3.5 h-3.5 text-[#64748B]" />
            ) : undefined
          }
        />

        {/* Date Ranges preview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Renewal Start Date"
            type="date"
            required
            value={startDate}
            onChange={(e) => handleStartDateChange(e.target.value)}
            helperText="Continuation from previous expiry date"
          />

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold text-[#172033]">
                New Expiry Date <span className="text-red-500">*</span>
              </label>
              {!isManualMode ? (
                <div className="flex items-center gap-1 text-[11px] text-[#3B82F6] font-semibold">
                  <Lock className="w-3 h-3" />
                  <span>Locked to plan duration</span>
                </div>
              ) : (
                <div className="flex items-center gap-1 text-[11px] text-amber-700 font-semibold">
                  <FileEdit className="w-3 h-3" />
                  <span>Manual & Editable</span>
                </div>
              )}
            </div>
            <Input
              type="date"
              required
              value={expiryDate}
              onChange={(e) => setExpiryDate(e.target.value)}
              disabled={!isManualMode}
              helperText={
                isManualMode
                  ? 'Manually select any date when the renewed term expires'
                  : `Calculated from ${selectedPlan?.name} duration`
              }
              prefixElement={
                !isManualMode ? (
                  <Lock className="w-3.5 h-3.5 text-[#64748B]" />
                ) : undefined
              }
            />
          </div>
        </div>

        {/* Quick Expiry Date Adjusters (Manual Mode Only) */}
        {isManualMode && (
          <div className="p-2.5 bg-amber-50/50 rounded-xl border border-amber-200 flex flex-wrap items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-1.5 text-amber-800">
              <Calendar className="w-3.5 h-3.5 text-amber-600" />
              <span className="font-semibold text-[11px]">Quick Extend:</span>
            </div>
            <div className="flex flex-wrap gap-1">
              <button
                type="button"
                onClick={() => applyDuration('week')}
                className="px-2 py-0.5 bg-white hover:bg-amber-100 rounded border border-amber-200 text-[11px] font-semibold text-[#172033] cursor-pointer"
              >
                +1 Week
              </button>
              <button
                type="button"
                onClick={() => applyDuration('1month')}
                className="px-2 py-0.5 bg-white hover:bg-amber-100 rounded border border-amber-200 text-[11px] font-semibold text-[#172033] cursor-pointer"
              >
                +1 Month
              </button>
              <button
                type="button"
                onClick={() => applyDuration('3months')}
                className="px-2 py-0.5 bg-white hover:bg-amber-100 rounded border border-amber-200 text-[11px] font-semibold text-[#172033] cursor-pointer"
              >
                +3 Months
              </button>
              <button
                type="button"
                onClick={() => applyDuration('6months')}
                className="px-2 py-0.5 bg-white hover:bg-amber-100 rounded border border-amber-200 text-[11px] font-semibold text-[#172033] cursor-pointer"
              >
                +6 Months
              </button>
              <button
                type="button"
                onClick={() => applyDuration('1year')}
                className="px-2 py-0.5 bg-white hover:bg-amber-100 rounded border border-amber-200 text-[11px] font-semibold text-[#172033] cursor-pointer"
              >
                +1 Year
              </button>
            </div>
          </div>
        )}

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

        {/* Automatic Renewal Payment Section */}
        <div className="p-4 bg-slate-50 rounded-xl border border-[#E7ECF3] space-y-3.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Receipt className="w-4 h-4 text-[#3B82F6]" />
              <h4 className="text-xs font-bold text-[#172033] uppercase tracking-wider">
                Automatic Renewal Payment & Ledger Entry
              </h4>
            </div>
            <span className="text-[11px] font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100 flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" />
              Receipt Auto-Generated
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              label={`Renewal Fee Paid (${APP_CONFIG.currency.symbol})`}
              type="number"
              required
              value={paymentAmount}
              onChange={(e) => setPaymentAmount(e.target.value)}
              disabled={!isManualMode}
              prefixElement={
                <span className="text-xs font-medium text-[#64748B] flex items-center gap-1">
                  {!isManualMode && <Lock className="w-3 h-3 text-[#64748B]" />}
                  {APP_CONFIG.currency.symbol}
                </span>
              }
              helperText={
                !isManualMode
                  ? `Locked to standard fee for ${selectedPlan?.name}`
                  : 'Enter agreed amount for this manual renewal'
              }
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
            label="Payment Remarks / Reference (Optional)"
            value={paymentNotes}
            onChange={(e) => setPaymentNotes(e.target.value)}
            placeholder="e.g. MoMo transaction ID or desk notes"
            rows={2}
          />
        </div>

        {/* Modal Buttons */}
        <div className="pt-2 flex items-center justify-end gap-3 border-t border-[#E7ECF3]">
          <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" isLoading={isSubmitting}>
            Confirm Renewal & Record Payment
          </Button>
        </div>
      </form>
    </Modal>
  );
};
