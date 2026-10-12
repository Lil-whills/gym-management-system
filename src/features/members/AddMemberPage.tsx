import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import { Card, CardHeader, CardBody } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Textarea } from '../../components/ui/Textarea';
import { Button } from '../../components/ui/Button';
import { getTodayString, calculatePlanExpiry, formatPlanDuration } from '../../lib/dates';
import { validateMemberForm } from '../../lib/validation';
import { APP_CONFIG } from '../../constants/app';
import { formatCurrency } from '../../lib/currency';
import { CreatePlanModal } from '../plans/CreatePlanModal';
import {
  ArrowLeft,
  UserPlus,
  Calendar,
  Sparkles,
  ShieldCheck,
  Plus,
  Clock,
  CheckCircle2,
  Trash2,
  Lock,
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
    setPlanName('Custom Pass (Manual)');
    setPaymentAmount('100');
    // Default 1 month from start date, but freely editable
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
    const base = startDate ? new Date(startDate) : new Date();
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

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#172033] tracking-tight">
            Register New Member
          </h2>
          <p className="text-xs sm:text-sm text-[#64748B] mt-0.5">
            Select an established gym plan or choose manual one-off entry.
          </p>
        </div>

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => setIsCreatePlanOpen(true)}
          leftIcon={<Plus className="w-4 h-4 text-[#3B82F6]" />}
          className="self-start sm:self-auto border-blue-200 text-[#3B82F6] hover:bg-blue-50 font-semibold"
        >
          + Add New Plan
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Section 1: Personal Details */}
        <Card>
          <CardHeader
            title="1. Personal Contact Information"
            subtitle="Member's full name, direct phone number, and optional emergency contact"
          />
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
                helperText="Ghanaian mobile number for notifications"
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
                label="Emergency Contact (Name & Phone)"
                placeholder="e.g. Sister: Ama (020 123 4567)"
                value={emergencyContact}
                onChange={(e) => setEmergencyContact(e.target.value)}
              />
            </div>
          </CardBody>
        </Card>

        {/* Section 2: Subscription Plan Selection OR Manual Entry */}
        <Card>
          <div className="px-6 py-4 border-b border-[#E7ECF3] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-bold text-[#172033]">
                2. Subscription Plan & Expiry Duration
              </h3>
              <p className="text-xs text-[#64748B] mt-0.5">
                Select a predefined subscription plan, or use manual entry for ad-hoc custom durations.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsCreatePlanOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-[#3B82F6] bg-blue-50 hover:bg-blue-100 rounded-lg border border-blue-200 transition-colors cursor-pointer self-start sm:self-auto"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create Subscription Plan</span>
            </button>
          </div>

          <CardBody className="space-y-5">
            {/* Clickable Plan Shortcuts Grid */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-semibold text-[#172033] flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#3B82F6]" />
                  <span>Choose Package Mode (Click to select):</span>
                </label>
                <span className="text-[11px] text-[#64748B]">
                  {plans.length} defined plan{plans.length === 1 ? '' : 's'}
                </span>
              </div>

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
                      className={`relative p-3.5 rounded-xl border transition-all cursor-pointer text-left flex flex-col justify-between gap-2.5 ${
                        isSelected
                          ? 'bg-blue-50/90 border-blue-400 ring-2 ring-blue-500/20 shadow-xs'
                          : 'bg-white border-[#E7ECF3] hover:border-slate-300 hover:shadow-xs'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-xs text-[#172033] line-clamp-1">
                              {p.name}
                            </span>
                            {isSelected && (
                              <CheckCircle2 className="w-3.5 h-3.5 text-[#3B82F6] shrink-0" />
                            )}
                          </div>
                          <div className="flex items-center gap-1 text-[11px] text-[#64748B]">
                            <Clock className="w-3 h-3 text-[#3B82F6]" />
                            <span>{durationLabel}</span>
                          </div>
                        </div>

                        {/* Price Tag */}
                        <div className="text-right">
                          <span className="text-xs font-black text-[#172033] block">
                            {formatCurrency(p.price)}
                          </span>
                        </div>
                      </div>

                      {/* Bottom row: status & visible delete button */}
                      <div className="flex items-center justify-between pt-1 border-t border-slate-100 text-[11px]">
                        <span className={isSelected ? 'text-[#3B82F6] font-semibold' : 'text-[#64748B]'}>
                          {isSelected ? '✓ Selected (Locked Terms)' : 'Click to apply'}
                        </span>

                        <button
                          type="button"
                          title={`Delete "${p.name}" from gym plans`}
                          onClick={(e) => handleDeletePlan(e, p.id, p.name)}
                          className="text-[#94A3B8] hover:text-red-600 hover:bg-red-50 transition-colors p-1 rounded cursor-pointer"
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
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer text-left flex flex-col justify-between gap-2.5 ${
                    isManualMode
                      ? 'bg-amber-50/90 border-amber-400 ring-2 ring-amber-500/20 shadow-xs'
                      : 'bg-slate-50/70 border-dashed border-slate-300 hover:border-slate-400 hover:bg-slate-100/60'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-1.5">
                        <FileEdit className={`w-3.5 h-3.5 ${isManualMode ? 'text-amber-600' : 'text-[#64748B]'}`} />
                        <span className="font-bold text-xs text-[#172033]">
                          Manual / One-Off Entry
                        </span>
                        {isManualMode && (
                          <CheckCircle2 className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                        )}
                      </div>
                      <span className="text-[11px] text-[#64748B] block">
                        Ad-hoc terms (e.g. 3 weeks trial pass)
                      </span>
                    </div>

                    <span className="text-[10px] font-bold uppercase text-amber-700 bg-amber-100 px-1.5 py-0.5 rounded">
                      Manual
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-1 border-t border-slate-200/80 text-[11px]">
                    <span className={isManualMode ? 'text-amber-700 font-semibold' : 'text-[#64748B]'}>
                      {isManualMode ? '✓ Unlocked Inputs' : 'Click to customize manually'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Mode Banner Indicator */}
            {isManualMode ? (
              <div className="p-3 bg-amber-50/90 rounded-xl border border-amber-200 text-xs text-amber-900 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileEdit className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>
                    <strong>Manual Entry Mode Active:</strong> You can enter any custom title, set exact expiry date, and enter any fee. <em>(Manual entries do not pollute subscription plans chart).</em>
                  </span>
                </div>
              </div>
            ) : (
              <div className="p-3 bg-blue-50/80 rounded-xl border border-blue-200 text-xs text-[#172033] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Lock className="w-4 h-4 text-[#3B82F6] shrink-0" />
                  <span>
                    <strong>Subscription Plan Active:</strong> Expiry date and fee are strictly determined by <strong>{selectedPlan?.name}</strong>.
                  </span>
                </div>
                <span className="text-[11px] text-[#3B82F6] font-medium">
                  {formatPlanDuration(selectedPlan?.durationValue || 1, selectedPlan?.durationUnit || 'months')} &bull; {formatCurrency(selectedPlan?.price || 0)}
                </span>
              </div>
            )}

            {/* Plan Title */}
            <div>
              <Input
                label="Subscription Plan / Package Title"
                required
                value={planName}
                onChange={(e) => setPlanName(e.target.value)}
                placeholder="e.g. 3 Weeks Special, Student Pass..."
                disabled={!isManualMode}
                error={errors.planName}
                helperText={
                  isManualMode
                    ? 'Enter any custom title for this manual one-off arrangement'
                    : `Locked to selected plan "${selectedPlan?.name}". To change, select another plan or switch to Manual Entry.`
                }
                prefixElement={
                  !isManualMode ? (
                    <Lock className="w-3.5 h-3.5 text-[#64748B]" />
                  ) : undefined
                }
              />
            </div>

            {/* Dates: Start & Expiry */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
              <Input
                label="Access Start Date"
                type="date"
                required
                value={startDate}
                onChange={(e) => handleStartDateChange(e.target.value)}
                error={errors.startDate}
                helperText="Access validity start date"
              />

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-[#172033]">
                    Access Expiration Date <span className="text-red-500">*</span>
                  </label>
                  {!isManualMode ? (
                    <span className="text-[11px] text-[#3B82F6] font-semibold flex items-center gap-1">
                      <Lock className="w-3 h-3" />
                      Locked to plan duration
                    </span>
                  ) : (
                    <span className="text-[11px] text-amber-700 font-semibold flex items-center gap-1">
                      <FileEdit className="w-3 h-3" />
                      Manual & Editable
                    </span>
                  )}
                </div>
                <Input
                  type="date"
                  required
                  value={expiryDate}
                  onChange={(e) => setExpiryDate(e.target.value)}
                  disabled={!isManualMode}
                  error={errors.expiryDate}
                  helperText={
                    isManualMode
                      ? 'Manually pick when this one-off membership expires'
                      : `Calculated automatically based on ${selectedPlan?.name} duration`
                  }
                  prefixElement={
                    !isManualMode ? (
                      <Lock className="w-3.5 h-3.5 text-[#64748B]" />
                    ) : undefined
                  }
                />
              </div>
            </div>

            {/* Manual Date Adjusters (ONLY active in Manual Mode) */}
            {isManualMode && (
              <div className="p-3 bg-amber-50/50 rounded-xl border border-amber-200 flex flex-wrap items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-1.5 text-amber-800">
                  <Calendar className="w-4 h-4 text-amber-600" />
                  <span className="font-semibold">Quick Manual Duration Adjusters:</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  <button
                    type="button"
                    onClick={() => applyManualDuration('week')}
                    className="px-2.5 py-1 bg-white hover:bg-amber-100 rounded border border-amber-200 text-[11px] font-semibold text-[#172033] cursor-pointer"
                  >
                    +1 Week
                  </button>
                  <button
                    type="button"
                    onClick={() => applyManualDuration('1month')}
                    className="px-2.5 py-1 bg-white hover:bg-amber-100 rounded border border-amber-200 text-[11px] font-semibold text-[#172033] cursor-pointer"
                  >
                    +1 Month
                  </button>
                  <button
                    type="button"
                    onClick={() => applyManualDuration('3months')}
                    className="px-2.5 py-1 bg-white hover:bg-amber-100 rounded border border-amber-200 text-[11px] font-semibold text-[#172033] cursor-pointer"
                  >
                    +3 Months
                  </button>
                  <button
                    type="button"
                    onClick={() => applyManualDuration('6months')}
                    className="px-2.5 py-1 bg-white hover:bg-amber-100 rounded border border-amber-200 text-[11px] font-semibold text-[#172033] cursor-pointer"
                  >
                    +6 Months
                  </button>
                  <button
                    type="button"
                    onClick={() => applyManualDuration('1year')}
                    className="px-2.5 py-1 bg-white hover:bg-amber-100 rounded border border-amber-200 text-[11px] font-semibold text-[#172033] cursor-pointer"
                  >
                    +1 Year
                  </button>
                </div>
              </div>
            )}

            <Textarea
              label="Member Notes & Health Considerations (Optional)"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Health conditions, workout preferences, VIP locker assignments..."
              rows={2}
            />
          </CardBody>
        </Card>

        {/* Section 3: Initial Registration Payment & Receipt */}
        <Card className="border-blue-200 shadow-sm">
          <CardHeader
            title="3. Initial Registration Payment & Receipt"
            subtitle="Payment details for this registration. Automatically creates a record in the Payments ledger."
          />
          <CardBody className="space-y-4">
            <div className="p-3 bg-blue-50/70 rounded-xl border border-blue-100 flex items-center justify-between text-xs text-[#172033]">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span className="font-semibold text-emerald-800">
                  Automatic Ledger Entry & 1-Click Receipt
                </span>
              </div>
              <span className="text-[11px] text-[#64748B]">
                Will reflect on the Payments page for instant printing
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Input
                  label={`Amount Paid (${APP_CONFIG.currency.symbol})`}
                  type="number"
                  required
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(e.target.value)}
                  disabled={!isManualMode}
                  prefixElement={
                    <span className="text-xs font-semibold text-[#64748B] flex items-center gap-1">
                      {!isManualMode && <Lock className="w-3 h-3 text-[#64748B]" />}
                      {APP_CONFIG.currency.symbol}
                    </span>
                  }
                  helperText={
                    !isManualMode
                      ? `Locked to standard fee for ${selectedPlan?.name}. (Use Manual Entry for custom pricing).`
                      : 'Enter agreed amount for this manual one-off registration.'
                  }
                />
              </div>

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
              label="Payment Notes / Transaction Reference (Optional)"
              value={paymentNotes}
              onChange={(e) => setPaymentNotes(e.target.value)}
              placeholder="e.g. MTN MoMo transaction ID or front-desk cash receipt note"
              rows={2}
            />
          </CardBody>
        </Card>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#E7ECF3]">
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
            Register Member & View Payment Receipt
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
