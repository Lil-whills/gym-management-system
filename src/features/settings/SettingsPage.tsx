import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { Card, CardHeader, CardBody } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Textarea } from '../../components/ui/Textarea';
import { Button } from '../../components/ui/Button';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import { exportDataAsJSON } from '../../lib/storage';
import {
  Save,
  RotateCcw,
  Download,
  Info,
} from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const { gymProfile, updateGymProfile, resetData, members, payments, plans } = useData();

  const [name, setName] = useState(gymProfile.name || '');
  const [email, setEmail] = useState(gymProfile.email || '');
  const [phone, setPhone] = useState(gymProfile.phone || '');
  const [location, setLocation] = useState(gymProfile.location || '');
  const [description, setDescription] = useState(gymProfile.description || '');
  const [weekdays, setWeekdays] = useState(gymProfile.openingHours?.weekdays || '');
  const [saturday, setSaturday] = useState(gymProfile.openingHours?.saturday || '');
  const [sunday, setSunday] = useState(gymProfile.openingHours?.sunday || '');

  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    updateGymProfile({
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      location: location.trim(),
      description: description.trim(),
      openingHours: {
        weekdays: weekdays.trim(),
        saturday: saturday.trim(),
        sunday: sunday.trim(),
      },
    });
  };

  const handleExportJSON = () => {
    const jsonStr = exportDataAsJSON();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `liftdesk-demo-backup-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-[#172033] tracking-tight">
            Gym Settings & Workspace
          </h2>
          <p className="text-xs sm:text-sm text-[#64748B] mt-0.5">
            Configure gym operational parameters, operating hours, and prototype persistence
          </p>
        </div>
        <Button variant="primary" leftIcon={<Save className="w-4 h-4" />} onClick={handleSave}>
          Save Settings
        </Button>
      </div>

      {/* Demo Notice Banner */}
      <div className="p-4 bg-slate-900 text-white rounded-2xl border border-slate-800 flex items-start gap-3.5 shadow-xs">
        <div className="w-8 h-8 rounded-lg bg-blue-500/20 text-[#3B82F6] flex items-center justify-center shrink-0 mt-0.5">
          <Info className="w-5 h-5" />
        </div>
        <div className="text-xs space-y-1">
          <div className="flex items-center gap-2">
            <span className="font-bold text-white text-sm">Demo Workspace Persistence Note</span>
            <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-semibold">
              Local Browser Storage
            </span>
          </div>
          <p className="text-slate-300 leading-relaxed">
            All records created or modified in this prototype are safely persisted in your browser’s <code className="bg-slate-800 px-1 py-0.5 rounded text-blue-300">localStorage</code>. Data survives page refreshes and browser reloads on this machine.
          </p>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Section 1: Facility Profile */}
        <Card>
          <CardHeader
            title="1. Gym Identity & Contact Details"
            subtitle="Core facility details and primary communication channels for your gym workspace"
          />
          <CardBody className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Gym Facility Name"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="IronPulse Fitness Club"
              />

              <Input
                label="Primary Contact Email"
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="info@ironpulsefitness.com"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Primary Contact Phone"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+233 24 456 7890"
              />

              <Input
                label="Physical Address & Area"
                required
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Plot 14, Ring Road Central, Osu, Accra, Ghana"
              />
            </div>

            <Textarea
              label="Gym Description & Overview"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief summary of gym facilities and mission..."
              rows={3}
            />
          </CardBody>
        </Card>

        {/* Section 2: Operating Schedule */}
        <Card>
          <CardHeader
            title="2. Operating Schedule & Hours"
            subtitle="Set open hours for weekdays and weekends"
          />
          <CardBody className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Input
                label="Monday – Friday"
                required
                value={weekdays}
                onChange={(e) => setWeekdays(e.target.value)}
                placeholder="5:30 AM – 9:30 PM"
              />

              <Input
                label="Saturday"
                required
                value={saturday}
                onChange={(e) => setSaturday(e.target.value)}
                placeholder="6:00 AM – 8:00 PM"
              />

              <Input
                label="Sunday"
                required
                value={sunday}
                onChange={(e) => setSunday(e.target.value)}
                placeholder="8:00 AM – 4:00 PM"
              />
            </div>
          </CardBody>
        </Card>

        {/* Section 3: Data Management & Reset */}
        <Card>
          <CardHeader
            title="3. Data Management & Prototype Reset"
            subtitle="Backup your current prototype records or reset back to default initial dataset"
          />
          <CardBody className="space-y-4">
            <div className="p-4 bg-slate-50 rounded-xl border border-[#E7ECF3] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h5 className="font-bold text-xs text-[#172033]">Export Data Backup (JSON)</h5>
                <p className="text-[11px] text-[#64748B] mt-0.5">
                  Download a snapshot of {members.length} members, {payments.length} transactions, and {plans.length} plans.
                </p>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                leftIcon={<Download className="w-4 h-4" />}
                onClick={handleExportJSON}
              >
                Export JSON
              </Button>
            </div>

            <div className="p-4 bg-red-50/60 rounded-xl border border-red-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h5 className="font-bold text-xs text-[#DC2626]">Reset Demo Data</h5>
                <p className="text-[11px] text-[#64748B] mt-0.5">
                  Restores initial sample data (12 demo members, 3 standard plans, and transactions).
                </p>
              </div>
              <Button
                type="button"
                variant="danger"
                size="sm"
                leftIcon={<RotateCcw className="w-4 h-4" />}
                onClick={() => setIsResetConfirmOpen(true)}
              >
                Reset Demo Data
              </Button>
            </div>
          </CardBody>
        </Card>

        {/* Bottom Save Action */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <Button type="submit" variant="primary" size="lg" leftIcon={<Save className="w-4 h-4" />}>
            Save All Settings
          </Button>
        </div>
      </form>

      {/* Reset Confirmation Dialog */}
      <ConfirmDialog
        isOpen={isResetConfirmOpen}
        onClose={() => setIsResetConfirmOpen(false)}
        onConfirm={() => {
          resetData();
          setIsResetConfirmOpen(false);
          const profile = gymProfile;
          setName(profile.name || '');
          setEmail(profile.email || '');
          setPhone(profile.phone || '');
          setLocation(profile.location || '');
          setDescription(profile.description || '');
        }}
        title="Reset All Demo Data?"
        description={
          <div>
            <p className="mb-2">
              Are you sure you want to reset your local database back to default seed records?
            </p>
            <p className="text-xs text-slate-500">
              Any custom members, payments, or plan packages created during this session will be replaced by the default demo records.
            </p>
          </div>
        }
        confirmLabel="Yes, Reset Everything"
        variant="danger"
      />
    </div>
  );
};
