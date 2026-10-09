import React, { useState, useEffect } from 'react';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Textarea } from '../../components/ui/Textarea';
import { Button } from '../../components/ui/Button';
import { useData } from '../../context/DataContext';
import { validatePlanForm } from '../../lib/validation';
import { APP_CONFIG } from '../../constants/app';
import { Plus, X } from 'lucide-react';
import type { MembershipPlan } from '../../types';

interface PlanFormModalProps {
  planToEdit?: MembershipPlan | null;
  isOpen: boolean;
  onClose: () => void;
}

export const PlanFormModal: React.FC<PlanFormModalProps> = ({
  planToEdit,
  isOpen,
  onClose,
}) => {
  const { addPlan, updatePlan } = useData();

  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [durationMonths, setDurationMonths] = useState('1');
  const [description, setDescription] = useState('');
  const [features, setFeatures] = useState<string[]>([]);
  const [newFeatureInput, setNewFeatureInput] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (planToEdit) {
        setName(planToEdit.name || '');
        setPrice(planToEdit.price.toString() || '');
        setDurationMonths(planToEdit.durationMonths.toString() || '1');
        setDescription(planToEdit.description || '');
        setFeatures(planToEdit.features || []);
      } else {
        setName('');
        setPrice('');
        setDurationMonths('1');
        setDescription('');
        setFeatures(['Full gym floor access', 'Locker & shower facilities']);
      }
      setNewFeatureInput('');
      setErrors({});
    }
  }, [isOpen, planToEdit]);

  const handleAddFeature = () => {
    if (newFeatureInput.trim()) {
      setFeatures([...features, newFeatureInput.trim()]);
      setNewFeatureInput('');
    }
  };

  const handleRemoveFeature = (index: number) => {
    setFeatures(features.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const validation = validatePlanForm({
      name,
      price,
      durationMonths,
      description,
    });

    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    setIsSubmitting(true);

    if (planToEdit) {
      updatePlan(planToEdit.id, {
        name: name.trim(),
        price: parseFloat(price),
        durationMonths: parseInt(durationMonths, 10),
        description: description.trim(),
        features,
      });
    } else {
      addPlan({
        name: name.trim(),
        price: parseFloat(price),
        durationMonths: parseInt(durationMonths, 10),
        description: description.trim(),
        features,
        isActive: true,
      });
    }

    setIsSubmitting(false);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={planToEdit ? 'Edit Membership Plan' : 'Create Membership Plan'}
      subtitle={
        planToEdit
          ? `Modify package rates and benefits for ${planToEdit.name}`
          : 'Define a new subscription package for members'
      }
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Plan Name"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Monthly Flex, Semi-Annual Pro..."
          error={errors.name}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label={`Price (${APP_CONFIG.currency.symbol})`}
            type="number"
            min="1"
            step="1"
            required
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="180"
            prefixElement={<span className="text-xs font-semibold text-[#64748B]">{APP_CONFIG.currency.symbol}</span>}
            error={errors.price}
          />

          <Select
            label="Duration"
            required
            value={durationMonths}
            onChange={(e) => setDurationMonths(e.target.value)}
            error={errors.durationMonths}
          >
            <option value="1">1 Month (Monthly)</option>
            <option value="2">2 Months</option>
            <option value="3">3 Months (Quarterly)</option>
            <option value="6">6 Months (Semi-Annual)</option>
            <option value="12">12 Months (Annual)</option>
          </Select>
        </div>

        <Textarea
          label="Plan Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Brief description of who this plan is tailored for..."
          rows={2}
        />

        {/* Feature List Builder */}
        <div>
          <label className="block text-xs font-medium text-[#172033] mb-1.5">
            Included Features & Benefits
          </label>
          <div className="flex gap-2 mb-2">
            <Input
              value={newFeatureInput}
              onChange={(e) => setNewFeatureInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddFeature();
                }
              }}
              placeholder="e.g. Sauna access, 1 personal trainer session..."
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleAddFeature}
              leftIcon={<Plus className="w-4 h-4" />}
            >
              Add
            </Button>
          </div>

          <div className="space-y-1.5 max-h-36 overflow-y-auto">
            {features.map((feat, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-[#E7ECF3] text-xs text-[#172033]"
              >
                <span>{feat}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveFeature(idx)}
                  className="text-slate-400 hover:text-[#DC2626] transition-colors p-1"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="pt-3 flex items-center justify-end gap-3 border-t border-[#E7ECF3]">
          <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" isLoading={isSubmitting}>
            {planToEdit ? 'Save Changes' : 'Create Plan'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
