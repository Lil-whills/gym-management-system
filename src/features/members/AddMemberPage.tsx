import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import { Card, CardHeader, CardBody } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Textarea } from '../../components/ui/Textarea';
import { Button } from '../../components/ui/Button';
import { getTodayString, calculateExpiryDate } from '../../lib/dates';
import { validateMemberForm } from '../../lib/validation';
import { APP_CONFIG } from '../../constants/app';
import { ArrowLeft, UserPlus } from 'lucide-react';
import type { PaymentMethod } from '../../types';

export const AddMemberPage: React.FC = () => {
  const navigate = useNavigate();
  const { plans, addMember } = useData();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [planId, setPlanId] = useState('');
  const [startDate, setStartDate] = useState(getTodayString());
  const [expiryDate, setExpiryDate] = useState('');
  const [emergencyContact, setEmergencyContact] = useState('');
  const [notes, setNotes] = useState('');

  // Initial payment collection
  const [collectPaymentNow, setCollectPaymentNow] = useState(true);
  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('Mobile Money');
  const [paymentNotes, setPaymentNotes] = useState('');

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Set initial plan and calculate expiry on mount
  useEffect(() => {
    const activePlans = plans.filter((p) => p.isActive);
    if (activePlans.length > 0 && !planId) {
      const defaultPlan = activePlans[0];
      setPlanId(defaultPlan.id);
      setPaymentAmount(defaultPlan.price.toString());
      const calculated = calculateExpiryDate(startDate, defaultPlan.durationMonths);
      setExpiryDate(calculated);
    }
  }, [plans, startDate, planId]);

  // Handle plan change
  const handlePlanChange = (newPlanId: string) => {
    setPlanId(newPlanId);
    const plan = plans.find((p) => p.id === newPlanId);
    if (plan) {
      setPaymentAmount(plan.price.toString());
      if (startDate) {
        const calculated = calculateExpiryDate(startDate, plan.durationMonths);
        setExpiryDate(calculated);
      }
    }
  };

  // Handle start date change
  const handleStartDateChange = (newStart: string) => {
    setStartDate(newStart);
    const plan = plans.find((p) => p.id === planId);
    if (plan && newStart) {
      const calculated = calculateExpiryDate(newStart, plan.durationMonths);
      setExpiryDate(calculated);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const validation = validateMemberForm({
      fullName,
      email,
      phone,
      planId,
      startDate,
      expiryDate,
    });

    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    setIsSubmitting(true);

    const initialPayment =
      collectPaymentNow && parseFloat(paymentAmount) > 0
        ? {
            amount: parseFloat(paymentAmount),
            paymentMethod,
            notes: paymentNotes.trim() || 'Initial registration payment',
          }
        : undefined;

    const newMember = addMember(
      {
        fullName: fullName.trim(),
        email: email.trim(),
        phone: phone.trim(),
        planId,
        startDate,
        expiryDate,
        emergencyContact: emergencyContact.trim() || undefined,
        notes: notes.trim() || undefined,
      },
      initialPayment
    );

    setIsSubmitting(false);
    navigate(`/members/${newMember.id}`);
  };

  const selectedPlan = plans.find((p) => p.id === planId);

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

      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#172033] tracking-tight">
            Register New Member
          </h2>
          <p className="text-xs sm:text-sm text-[#64748B] mt-0.5">
            Fill in personal contact details, select a membership tier, and set access dates.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Section 1: Member Contact Info */}
        <Card>
          <CardHeader
            title="1. Personal & Contact Information"
            subtitle="Essential customer contact details for records and communication"
          />
          <CardBody className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Full Name"
                required
                placeholder="e.g. Kwame Mensah"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                error={errors.fullName}
              />

              <Input
                label="Phone Number"
                required
                placeholder="e.g. 024 456 7890 or +233 24..."
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                error={errors.phone}
                helperText="Ghanaian standard phone number"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Email Address (Optional)"
                type="email"
                placeholder="e.g. kwame@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                error={errors.email}
              />

              <Input
                label="Emergency Contact (Optional)"
                placeholder="e.g. Esi Mensah (024 111 2222)"
                value={emergencyContact}
                onChange={(e) => setEmergencyContact(e.target.value)}
              />
            </div>
          </CardBody>
        </Card>

        {/* Section 2: Membership Plan & Dates */}
        <Card>
          <CardHeader
            title="2. Membership Package & Validity Period"
            subtitle="Plan selection automatically calculates the term and suggested expiry date"
          />
          <CardBody className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-1">
                <Select
                  label="Selected Membership Plan"
                  required
                  value={planId}
                  onChange={(e) => handlePlanChange(e.target.value)}
                  error={errors.planId}
                >
                  {plans.map((p) => (
                    <option key={p.id} value={p.id} disabled={!p.isActive}>
                      {p.name} ({APP_CONFIG.currency.symbol} {p.price}) {!p.isActive ? '- Archived' : ''}
                    </option>
                  ))}
                </Select>
              </div>

              <div className="sm:col-span-1">
                <Input
                  label="Membership Start Date"
                  type="date"
                  required
                  value={startDate}
                  onChange={(e) => handleStartDateChange(e.target.value)}
                  error={errors.startDate}
                />
              </div>

              <div className="sm:col-span-1">
                <Input
                  label="Membership Expiry Date"
                  type="date"
                  required
                  value={expiryDate}
                  onChange={(e) => setExpiryDate(e.target.value)}
                  error={errors.expiryDate}
                  helperText="Editable expiry date"
                />
              </div>
            </div>

            {/* Plan Details Preview Box */}
            {selectedPlan && (
              <div className="p-4 bg-slate-50 rounded-xl border border-[#E7ECF3] flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
                <div>
                  <span className="text-[#64748B] block">Package summary:</span>
                  <span className="font-bold text-sm text-[#172033]">{selectedPlan.name}</span>
                  <p className="text-[#64748B] mt-0.5">{selectedPlan.description}</p>
                </div>
                <div className="sm:text-right shrink-0 bg-white px-3.5 py-2 rounded-lg border border-[#E7ECF3]">
                  <span className="text-[#64748B] block">Registration Fee</span>
                  <span className="text-base font-extrabold text-[#3B82F6]">
                    {APP_CONFIG.currency.symbol} {selectedPlan.price}
                  </span>
                  <span className="text-[10px] text-[#64748B] block">
                    Valid for {selectedPlan.durationMonths} {selectedPlan.durationMonths === 1 ? 'month' : 'months'}
                  </span>
                </div>
              </div>
            )}

            <Textarea
              label="Member Notes or Special Requests (Optional)"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Health conditions, workout preferences, VIP locker assignments..."
              rows={2}
            />
          </CardBody>
        </Card>

        {/* Section 3: Initial Payment Recording */}
        <Card>
          <CardHeader
            title="3. Collect Initial Payment"
            subtitle="Record dues immediately to issue a receipt upon registration"
          />
          <CardBody className="space-y-4">
            <div className="flex items-center gap-2.5">
              <input
                type="checkbox"
                id="collectPaymentNow"
                checked={collectPaymentNow}
                onChange={(e) => setCollectPaymentNow(e.target.checked)}
                className="w-4 h-4 rounded text-[#3B82F6] focus:ring-[#3B82F6] border-[#CBD5E1]"
              />
              <label htmlFor="collectPaymentNow" className="text-xs font-semibold text-[#172033] cursor-pointer">
                Record registration payment now
              </label>
            </div>

            {collectPaymentNow && (
              <div className="p-4 bg-blue-50/50 rounded-xl border border-blue-100 space-y-4 animate-in fade-in duration-150">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label={`Amount Received (${APP_CONFIG.currency.symbol})`}
                    type="number"
                    required={collectPaymentNow}
                    value={paymentAmount}
                    onChange={(e) => setPaymentAmount(e.target.value)}
                    prefixElement={<span className="text-xs font-semibold text-[#64748B]">{APP_CONFIG.currency.symbol}</span>}
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

                <Input
                  label="Payment Reference / Note (Optional)"
                  placeholder="e.g. MoMo Transaction ID 882914 or Cash received by front desk"
                  value={paymentNotes}
                  onChange={(e) => setPaymentNotes(e.target.value)}
                />
              </div>
            )}
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
            size="lg"
            isLoading={isSubmitting}
            leftIcon={<UserPlus className="w-4 h-4" />}
          >
            Complete Registration
          </Button>
        </div>
      </form>
    </div>
  );
};
