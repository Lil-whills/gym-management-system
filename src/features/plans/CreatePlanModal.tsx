import React, { useState } from 'react';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Textarea } from '../../components/ui/Textarea';
import { Button } from '../../components/ui/Button';
import { useData } from '../../context/DataContext';
import { APP_CONFIG } from '../../constants/app';
import { Sparkles, Plus, Clock } from 'lucide-react';
import type { MembershipPlan, PlanDurationUnit } from '../../types';

interface CreatePlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPlanCreated?: (plan: MembershipPlan) => void;
}

export const CreatePlanModal: React.FC<CreatePlanModalProps> = ({
  isOpen,
  onClose,
  onPlanCreated,
}) => {
  const { addPlan } = useData();

  const [name, setName] = useState('');
  const [durationValue, setDurationValue] = useState('1');
  const [durationUnit, setDurationUnit] = useState<PlanDurationUnit>('months');
  const [price, setPrice] = useState('180');
  const [description, setDescription] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const quickPresets = [
    { label: 'Yellow Promo', value: '4', unit: 'months' as PlanDurationUnit, price: '480' },
    { label: '1 Week Pass', value: '1', unit: 'weeks' as PlanDurationUnit, price: '60' },
    { label: '1 Month Standard', value: '1', unit: 'months' as PlanDurationUnit, price: '180' },
    { label: '3 Months Performance', value: '3', unit: 'months' as PlanDurationUnit, price: '450' },
    { label: '1 Semester (4 Months)', value: '4', unit: 'months' as PlanDurationUnit, price: '480' },
    { label: '6 Months VIP', value: '6', unit: 'months' as PlanDurationUnit, price: '800' },
    { label: 'Annual Champion Pass', value: '1', unit: 'years' as PlanDurationUnit, price: '1600' },
  ];

  const handleApplyPreset = (preset: typeof quickPresets[0]) => {
    setName(preset.label);
    setDurationValue(preset.value);
    setDurationUnit(preset.unit);
    setPrice(preset.price);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!name.trim()) {
      newErrors.name = 'Subscription plan name is required';
    }

    const valNum = parseInt(durationValue, 10);
    if (isNaN(valNum) || valNum <= 0) {
      newErrors.duration = 'Enter a valid duration (1 or greater)';
    }

    const priceNum = parseFloat(price);
    if (isNaN(priceNum) || priceNum < 0) {
      newErrors.price = 'Enter a valid price amount in GH₵';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);

    const created = addPlan({
      name: name.trim(),
      price: priceNum,
      durationValue: valNum,
      durationUnit,
      description: description.trim() || undefined,
      isActive: true,
      features: ['Full gym access', 'Valid for specified duration'],
    });

    setIsSubmitting(false);

    // Callback to auto-select this new plan in the registration form
    if (onPlanCreated) {
      onPlanCreated(created);
    }

    // Reset form and close
    setName('');
    setDurationValue('1');
    setDurationUnit('months');
    setPrice('180');
    setDescription('');
    setErrors({});
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create New Subscription Plan"
      subtitle="Define a custom membership package for your gym center. It will automatically appear as a clickable shortcut."
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Quick Suggestion Chips */}
        <div>
          <label className="block text-xs font-semibold text-[#172033] mb-1.5 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#3B82F6]" />
            <span>Common Plan Templates (Click to fill):</span>
          </label>
          <div className="flex flex-wrap gap-1.5">
            {quickPresets.map((preset) => (
              <button
                key={preset.label}
                type="button"
                onClick={() => handleApplyPreset(preset)}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition-all cursor-pointer ${
                  name === preset.label
                    ? 'bg-blue-50 text-[#3B82F6] border-blue-300 font-bold'
                    : 'bg-white text-[#64748B] border-[#E7ECF3] hover:border-slate-300 hover:text-[#172033]'
                }`}
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>

        {/* Plan Name */}
        <Input
          label="Subscription Plan Name"
          required
          placeholder="e.g. Yellow Promo, 1 Semester, 6 Months VIP..."
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            if (errors.name) setErrors((prev) => ({ ...prev, name: '' }));
          }}
          error={errors.name}
          helperText="The package name that will appear on grid cards, receipts, and reports"
        />

        {/* Duration Configuration */}
        <div>
          <label className="block text-xs font-semibold text-[#172033] mb-1">
            Access Duration <span className="text-red-500">*</span>
          </label>
          <div className="grid grid-cols-2 gap-3">
            <Input
              type="number"
              min="1"
              required
              value={durationValue}
              onChange={(e) => {
                setDurationValue(e.target.value);
                if (errors.duration) setErrors((prev) => ({ ...prev, duration: '' }));
              }}
              error={errors.duration}
              placeholder="e.g. 4"
              prefixElement={<Clock className="w-3.5 h-3.5 text-[#64748B]" />}
            />

            <Select
              value={durationUnit}
              onChange={(e) => setDurationUnit(e.target.value as PlanDurationUnit)}
            >
              <option value="days">Day(s)</option>
              <option value="weeks">Week(s)</option>
              <option value="months">Month(s)</option>
              <option value="years">Year(s)</option>
            </Select>
          </div>
          <p className="text-[11px] text-[#64748B] mt-1">
            Registration forms will automatically calculate the expiry date based on this duration.
          </p>
        </div>

        {/* Standard Fee (GH₵) */}
        <div>
          <Input
            label={`Default Fee (${APP_CONFIG.currency.symbol})`}
            type="number"
            min="0"
            required
            value={price}
            onChange={(e) => {
              setPrice(e.target.value);
              if (errors.price) setErrors((prev) => ({ ...prev, price: '' }));
            }}
            prefixElement={
              <span className="text-xs font-semibold text-[#64748B]">
                {APP_CONFIG.currency.symbol}
              </span>
            }
            error={errors.price}
            helperText="Standard fee in Ghanaian Cedis for this subscription package"
          />
        </div>

        {/* Optional Description */}
        <Textarea
          label="Plan Description / Inclusions (Optional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="e.g. Unlimited gym floor, locker access, 1 complimentary trainer assessment"
          rows={2}
        />

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-[#E7ECF3]">
          <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            isLoading={isSubmitting}
            leftIcon={<Plus className="w-4 h-4" />}
          >
            Save & Add to Grid
          </Button>
        </div>
      </form>
    </Modal>
  );
};
