import React, { useState, useEffect } from 'react';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Textarea } from '../../components/ui/Textarea';
import { Button } from '../../components/ui/Button';
import { useData } from '../../context/DataContext';
import { validateMemberForm } from '../../lib/validation';
import type { Member } from '../../types';

interface MemberEditModalProps {
  member: Member | null;
  isOpen: boolean;
  onClose: () => void;
}

export const MemberEditModal: React.FC<MemberEditModalProps> = ({
  member,
  isOpen,
  onClose,
}) => {
  const { plans, updateMember } = useData();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [planId, setPlanId] = useState('');
  const [startDate, setStartDate] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [notes, setNotes] = useState('');
  const [emergencyContact, setEmergencyContact] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (member && isOpen) {
      setFullName(member.fullName || '');
      setEmail(member.email || '');
      setPhone(member.phone || '');
      setPlanId(member.planId || '');
      setStartDate(member.startDate || '');
      setExpiryDate(member.expiryDate || '');
      setNotes(member.notes || '');
      setEmergencyContact(member.emergencyContact || '');
      setErrors({});
    }
  }, [member, isOpen]);

  if (!member) return null;

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

    updateMember(member.id, {
      fullName: fullName.trim(),
      email: email.trim(),
      phone: phone.trim(),
      planId,
      startDate,
      expiryDate,
      notes: notes.trim() || undefined,
      emergencyContact: emergencyContact.trim() || undefined,
    });

    setIsSubmitting(false);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Edit Member Information"
      subtitle={`Update contact details and plan assignments for ${member.fullName}`}
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Full Name"
            required
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            error={errors.fullName}
          />
          <Input
            label="Phone Number"
            required
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            error={errors.phone}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Email Address"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={errors.email}
          />
          <Select
            label="Membership Plan"
            required
            value={planId}
            onChange={(e) => setPlanId(e.target.value)}
            error={errors.planId}
          >
            {plans.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </Select>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Membership Start Date"
            type="date"
            required
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            error={errors.startDate}
          />
          <Input
            label="Membership Expiry Date"
            type="date"
            required
            value={expiryDate}
            onChange={(e) => setExpiryDate(e.target.value)}
            error={errors.expiryDate}
          />
        </div>

        <Input
          label="Emergency Contact (Name & Phone)"
          value={emergencyContact}
          onChange={(e) => setEmergencyContact(e.target.value)}
          placeholder="e.g. Ama Osei (+233 24 000 0000)"
        />

        <Textarea
          label="Member Notes & Preferences"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Fitness goals, locker preferences, health considerations..."
          rows={2}
        />

        <div className="pt-3 flex items-center justify-end gap-3 border-t border-[#E7ECF3]">
          <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" isLoading={isSubmitting}>
            Save Changes
          </Button>
        </div>
      </form>
    </Modal>
  );
};
