import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import { Card, CardHeader, CardBody } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Textarea } from '../../components/ui/Textarea';
import { Button } from '../../components/ui/Button';
import {
  getTodayString,
  calculatePlanExpiry,
  formatPlanDuration,
  parseLocalDate,
} from '../../lib/dates';
import { validateMemberForm } from '../../lib/validation';
import { APP_CONFIG } from '../../constants/app';
import { formatCurrency } from '../../lib/currency';
import { CreatePlanModal } from '../plans/CreatePlanModal';
import {
  ArrowLeft,
  UserPlus,
  Plus,
  Clock,
  CheckCircle2,
  Trash2,
  FileEdit,
} from 'lucide-react';
import { addDays, addMonths, addYears, format } from 'date-fns';
import type { PaymentMethod, MembershipPlan } from '../../types';

export const AddMemberPage: React.FC = () => {
  const navigate = useNavigate();
  const { addMember, plans, deletePlan } = useData();

  // Personal Info
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [emergencyContact, setEmergencyContact] = useState('');
  const [notes, setNotes] = useState('');

  // Plan Selection State: can be a plan ID or 'manual'
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);
  const [planName, setPlanName] = useState('Monthly Flex Plan');
  const [startDate, setStartDate] = useState(getTodayString());
  const [expiryDate, setExpiryDate] = useState(() => {
    return format(addMonths(new Date(), 1), 'yyyy-MM-dd');
  });

  // Initial Payment Amount (locked when plan selected, editable when manual)
  const [paymentAmount, setPaymentAmount] = useState('180');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('Mobile Money');
  const [paymentNotes, setPaymentNotes] = useState('');

  // Modals & UI States
  const [isCreatePlanOpen, setIsCreatePlanOpen] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isManualMode = selectedPlanId === 'manual';
  const selectedPlan = plans.find((p) => p.id === selectedPlanId);

  // Initialize with first active plan if available
  useEffect(() => {
    if (plans.length > 0 && !selectedPlanId) {
      const defaultPlan = plans.find((p) => p.isActive !== false) || plans[0];
      if (defaultPlan) {
        setSelectedPlanId(defaultPlan.id);
        setPlanName(defaultPlan.name);
        setPaymentAmount(defaultPlan.price.toString());
        const calculated = calculatePlanExpiry(
          startDate,
          defaultPlan.durationValue || defaultPlan.durationMonths || 1,
          defaultPlan.durationUnit || 'months'
        );
        setExpiryDate(calculated);
      }
    }
  }, [plans]);

  // When a defined subscription plan shortcut card is clicked (Mode 1: Locked to Plan)
  const handleSelectPlan = (plan: MembershipPlan) => {
    setSelectedPlanId(plan.id);
    setPlanName(plan.name);
    setPaymentAmount(plan.price.toString());

    const durationVal = plan.durationValue || plan.durationMonths || 1;
    const durationUnit = plan.durationUnit || 'months';
    const newExpiry = calculatePlanExpiry(startDate, durationVal, durationUnit);
    setExpiryDate(newExpiry);
  };

  // When switching to manual / ad-hoc entry mode (Mode 2: Unlocked custom inputs)
  const handleSelectManualMode = () => {
    setSelectedPlanId('manual');
    setPlanName('Custom Pass');
    setPaymentAmount('100');
    const defaultExpiry = format(addMonths(new Date(startDate || new Date()), 1), 'yyyy-MM-dd');
    setExpiryDate(defaultExpiry);
  };

  // Callback when admin creates a new plan through the modal
  const handlePlanCreated = (newPlan: MembershipPlan) => {
    handleSelectPlan(newPlan);
  };

  // When startDate changes, update expiry if a known plan is selected
  const handleStartDateChange = (newStart: string) => {
    setStartDate(newStart);
    if (selectedPlan) {
      const durationVal = selectedPlan.durationValue || selectedPlan.durationMonths || 1;
      const durationUnit = selectedPlan.durationUnit || 'months';
      const newExpiry = calculatePlanExpiry(newStart, durationVal, durationUnit);
      setExpiryDate(newExpiry);
    }
  };

  // Manual date adjusters (ONLY active in manual mode)
  const applyManualDuration = (type: 'week' | '1month' | '3months' | '6months' | '1year') => {
    const base = startDate ? parseLocalDate(startDate) : new Date();
    let calculated = new Date();

    if (type === 'week') calculated = addDays(base, 7);
    else if (type === '1month') calculated = addMonths(base, 1);
    else if (type === '3months') calculated = addMonths(base, 3);
    else if (type === '6months') calculated = addMonths(base, 6);
    else if (type === '1year') calculated = addYears(base, 1);

    setExpiryDate(format(calculated, 'yyyy-MM-dd'));
  };

  // Delete any plan (seeded or custom) from the grid
  const handleDeletePlan = (e: React.MouseEvent, planId: string, pName: string) => {
    e.stopPropagation();
    if (window.confirm(`Delete "${pName}" from your gym's subscription plans?`)) {
      deletePlan(planId);
      if (selectedPlanId === planId) {
        const remaining = plans.filter((p) => p.id !== planId);
        if (remaining.length > 0) {
          handleSelectPlan(remaining[0]);
        } else {
          handleSelectManualMode();
        }
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const validation = validateMemberForm({
      fullName,
      email,
      phone,
      planName,
      startDate,
      expiryDate,
    });

    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    setIsSubmitting(true);

    const amountNum = parseFloat(paymentAmount) >= 0 ? parseFloat(paymentAmount) : 0;

    // Automatically record initial payment to reflect immediately on the payments section
    addMember(
      {
        fullName: fullName.trim(),
        email: email.trim(),
        phone: phone.trim(),
        planId: isManualMode ? undefined : selectedPlanId || undefined,
        planName: planName.trim(),
        startDate,
        expiryDate,
        amountPaid: amountNum,
        paymentMethod,
        emergencyContact: emergencyContact.trim() || undefined,
        notes: notes.trim() || undefined,
      },
      {
        amount: amountNum,
        paymentMethod,
        notes:
          paymentNotes.trim() ||
          `Initial registration (${planName.trim()}) - Valid until ${expiryDate}`,
      }
    );

    setIsSubmitting(false);

    // Redirect to Payments section so user can print the receipt straight from there
    navigate(`/payments`);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Back link */}
      <div>
        <Link
          to="/members"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#64748B] hover:text-[#172033] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Member Directory</span>
        </Link>
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#172033] tracking-tight">
            Register New Member
          </h2>
        </div>

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => setIsCreatePlanOpen(true)}
          leftIcon={<Plus className="w-4 h-4 text-[#3B82F6]" />}
          className="self-start sm:self-auto border-blue-200 text-[#3B82F6] hover:bg-blue-50 font-semibold"
        >
          Add New Plan
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Section 1: Personal Details */}
        <Card>
          <CardHeader title="1. Personal Information" />
          <CardBody className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Full Name"
                required
                placeholder="e.g. Samuel Nana Osei"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                error={errors.fullName}
              />

              <Input
                label="Phone Number"
                required
                type="tel"
                placeholder="e.g. 024 412 3456"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                error={errors.phone}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Email Address (Optional)"
                type="email"
                placeholder="e.g. samuel@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                error={errors.email}
              />

              <Input
                label="Emergency Contact (Optional)"
                placeholder="e.g. Sister: Ama (020 123 4567)"
                value={emergencyContact}
                onChange={(e) => setEmergencyContact(e.target.value)}
              />
            </div>
          </CardBody>
        </Card>

        {/* Section 2: Subscription Plan Selection OR Manual Entry */}
        <Card>
          <CardHeader title="2. Subscription Plan" />
          <CardBody className="space-y-5">
            {/* Clickable Plan Shortcuts Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {/* Predefined Subscription Plans */}
              {plans.map((p) => {
                const isSelected = selectedPlanId === p.id;
                const durationLabel = formatPlanDuration(
                  p.durationValue || p.durationMonths || 1,
                  p.durationUnit || 'months'
                );

                return (
                  <div
                    key={p.id}
                    onClick={() => handleSelectPlan(p)}
                    className={`group relative p-3.5 rounded-xl border transition-all cursor-pointer text-left flex flex-col justify-between gap-3 ${
                      isSelected
                        ? 'bg-blue-50/70 border-blue-500 ring-2 ring-blue-500/20 shadow-xs'
                        : 'bg-white border-[#E7ECF3] hover:border-slate-300 hover:shadow-xs'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-xs text-[#172033] truncate">
                            {p.name}
                          </span>
                          {isSelected && (
                            <CheckCircle2 className="w-3.5 h-3.5 text-[#3B82F6] shrink-0" />
                          )}
                        </div>
                        <div className="flex items-center gap-1 text-[11px] text-[#64748B] mt-0.5">
                          <Clock className="w-3 h-3 text-[#3B82F6]" />
                          <span>{durationLabel}</span>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="text-xs font-black text-[#172033]">
                          {formatCurrency(p.price)}
                        </span>
                      </div>
                    </div>

                    {/* Delete plan button */}
                    <div className="flex items-center justify-end pt-1 border-t border-slate-100">
                      <button
                        type="button"
                        title={`Delete "${p.name}"`}
                        onClick={(e) => handleDeletePlan(e, p.id, p.name)}
                        className="text-[#94A3B8] hover:text-red-600 hover:bg-red-50 transition-colors p-1 rounded cursor-pointer opacity-0 group-hover:opacity-100"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}

              {/* Manual / One-Off Entry Card */}
              <div
                onClick={handleSelectManualMode}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer text-left flex flex-col justify-between gap-3 ${
                  isManualMode
                    ? 'bg-amber-50/70 border-amber-500 ring-2 ring-amber-500/20 shadow-xs'
                    : 'bg-slate-50/60 border-dashed border-slate-300 hover:border-slate-400'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-1.5">
                      <FileEdit
                        className={`w-3.5 h-3.5 ${
                          isManualMode ? 'text-amber-600' : 'text-[#64748B]'
                        }`}
                      />
                      <span className="font-bold text-xs text-[#172033]">
                        Manual / Custom Entry
                      </span>
                      {isManualMode && (
                        <CheckCircle2 className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                      )}
                    </div>
                    <span className="text-[11px] text-[#64748B] block">
                      Custom duration & fee
                    </span>
                  </div>
                </div>
                <div className="pt-1 border-t border-transparent" />
              </div>
            </div>

            {/* Custom Plan Title Input (Only when Manual Mode is selected) */}
            {isManualMode && (
              <Input
                label="Custom Plan Title"
                required
                value={planName}
                onChange={(e) => setPlanName(e.target.value)}
                placeholder="e.g. 3 Weeks Special, Student Pass"
                error={errors.planName}
              />
            )}

            {/* Dates: Start & Expiry */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Start Date"
                type="date"
                required
                value={startDate}
                onChange={(e) => handleStartDateChange(e.target.value)}
                error={errors.startDate}
              />

              <Input
                label="Expiry Date"
                type="date"
                required
                value={expiryDate}
                onChange={(e) => setExpiryDate(e.target.value)}
                disabled={!isManualMode}
                error={errors.expiryDate}
              />
            </div>

            {/* Quick Manual Duration Adjusters (ONLY active in Manual Mode) */}
            {isManualMode && (
              <div className="p-3 bg-amber-50/60 rounded-xl border border-amber-200/80 flex flex-wrap items-center justify-between gap-2">
                <span className="text-xs font-semibold text-amber-900">
                  Quick Manual Duration Adjusters:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  <button
                    type="button"
                    onClick={() => applyManualDuration('week')}
                    className="px-2.5 py-1 bg-white hover:bg-amber-100 rounded border border-amber-200 text-xs font-semibold text-[#172033] cursor-pointer transition-colors"
                  >
                    +1 Week
                  </button>
                  <button
                    type="button"
                    onClick={() => applyManualDuration('1month')}
                    className="px-2.5 py-1 bg-white hover:bg-amber-100 rounded border border-amber-200 text-xs font-semibold text-[#172033] cursor-pointer transition-colors"
                  >
                    +1 Month
                  </button>
                  <button
                    type="button"
                    onClick={() => applyManualDuration('3months')}
                    className="px-2.5 py-1 bg-white hover:bg-amber-100 rounded border border-amber-200 text-xs font-semibold text-[#172033] cursor-pointer transition-colors"
                  >
                    +3 Months
                  </button>
                  <button
                    type="button"
                    onClick={() => applyManualDuration('6months')}
                    className="px-2.5 py-1 bg-white hover:bg-amber-100 rounded border border-amber-200 text-xs font-semibold text-[#172033] cursor-pointer transition-colors"
                  >
                    +6 Months
                  </button>
                  <button
                    type="button"
                    onClick={() => applyManualDuration('1year')}
                    className="px-2.5 py-1 bg-white hover:bg-amber-100 rounded border border-amber-200 text-xs font-semibold text-[#172033] cursor-pointer transition-colors"
                  >
                    +1 Year
                  </button>
                </div>
              </div>
            )}

            <Textarea
              label="Notes (Optional)"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Health conditions, workout preferences, etc."
              rows={2}
            />
          </CardBody>
        </Card>

        {/* Section 3: Payment */}
        <Card>
          <CardHeader title="3. Payment" />
          <CardBody className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label={`Amount Paid (${APP_CONFIG.currency.symbol})`}
                type="number"
                required
                value={paymentAmount}
                onChange={(e) => setPaymentAmount(e.target.value)}
                disabled={!isManualMode}
                prefixElement={
                  <span className="text-xs font-semibold text-[#64748B]">
                    {APP_CONFIG.currency.symbol}
                  </span>
                }
              />

              <Select
                label="Payment Method"
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
              >
                <option value="Mobile Money">Mobile Money (MTN MoMo, Telecel Cash)</option>
                <option value="Cash">Cash (Front Desk)</option>
                <option value="Bank Transfer">Bank Transfer</option>
              </Select>
            </div>

            <Textarea
              label="Payment Notes (Optional)"
              value={paymentNotes}
              onChange={(e) => setPaymentNotes(e.target.value)}
              placeholder="e.g. Transaction ID or receipt note"
              rows={2}
            />
          </CardBody>
        </Card>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate('/members')}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            isLoading={isSubmitting}
            leftIcon={<UserPlus className="w-4 h-4" />}
          >
            Register Member
          </Button>
        </div>
      </form>

      {/* Modal to Create New Subscription Plan */}
      <CreatePlanModal
        isOpen={isCreatePlanOpen}
        onClose={() => setIsCreatePlanOpen(false)}
        onPlanCreated={handlePlanCreated}
      />
    </div>
  );
};
