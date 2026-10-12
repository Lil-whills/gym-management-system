import React, { useState } from 'react';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Textarea } from '../../components/ui/Textarea';
import { Button } from '../../components/ui/Button';
import { useData } from '../../context/DataContext';
import { APP_CONFIG } from '../../constants/app';
import { Plus } from 'lucide-react';
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!name.trim()) {
      newErrors.name = 'Plan name is required';
    }

    const valNum = parseInt(durationValue, 10);
    if (isNaN(valNum) || valNum <= 0) {
      newErrors.duration = 'Enter a valid duration (1 or greater)';
    }

    const priceNum = parseFloat(price);
    if (isNaN(priceNum) || priceNum < 0) {
      newErrors.price = 'Enter a valid amount';
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
      title="Add New Plan"
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Plan Name */}
        <Input
          label="Plan Name"
          required
          placeholder="e.g. 1 Month Standard, 3 Months Flex"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            if (errors.name) setErrors((prev) => ({ ...prev, name: '' }));
          }}
          error={errors.name}
        />

        {/* Access Duration */}
        <div>
          <label className="block text-xs font-semibold text-[#172033] mb-1.5">
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
              placeholder="1"
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
        </div>

        {/* Amount */}
        <Input
          label={`Amount (${APP_CONFIG.currency.symbol})`}
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
        />

        {/* Description */}
        <Textarea
          label="Description (Optional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="e.g. Full gym floor and locker access"
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
            Add Plan
          </Button>
        </div>
      </form>
    </Modal>
  );
};
