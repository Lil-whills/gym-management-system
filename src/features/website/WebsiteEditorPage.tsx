import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import { Card, CardHeader, CardBody } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Textarea } from '../../components/ui/Textarea';
import { Button } from '../../components/ui/Button';
import {
  Globe,
  ExternalLink,
  Save,
  Plus,
  Trash2,
  MapPin,
  Phone,
  Mail,
  Clock,
} from 'lucide-react';

export const WebsiteEditorPage: React.FC = () => {
  const { websiteSettings, updateWebsiteSettings } = useData();

  const [gymName, setGymName] = useState(websiteSettings.gymName || '');
  const [headline, setHeadline] = useState(websiteSettings.headline || '');
  const [subheadline, setSubheadline] = useState(websiteSettings.subheadline || '');
  const [heroTag, setHeroTag] = useState(websiteSettings.heroTag || '');
  const [aboutText, setAboutText] = useState(websiteSettings.aboutText || '');
  const [location, setLocation] = useState(websiteSettings.location || '');
  const [contactPhone, setContactPhone] = useState(websiteSettings.contactPhone || '');
  const [contactEmail, setContactEmail] = useState(websiteSettings.contactEmail || '');
  const [openingHoursText, setOpeningHoursText] = useState(websiteSettings.openingHoursText || '');
  const [callToActionText, setCallToActionText] = useState(websiteSettings.callToActionText || '');
  const [whatsappNumber, setWhatsappNumber] = useState(websiteSettings.whatsappNumber || '');
  const [instagramHandle, setInstagramHandle] = useState(websiteSettings.instagramHandle || '');
  const [features, setFeatures] = useState(websiteSettings.features || []);

  const [newFeatTitle, setNewFeatTitle] = useState('');
  const [newFeatDesc, setNewFeatDesc] = useState('');

  const handleAddFeature = () => {
    if (newFeatTitle.trim() && newFeatDesc.trim()) {
      const newFeat = {
        id: `feat_${Date.now()}`,
        title: newFeatTitle.trim(),
        description: newFeatDesc.trim(),
        iconName: 'Dumbbell',
      };
      setFeatures([...features, newFeat]);
      setNewFeatTitle('');
      setNewFeatDesc('');
    }
  };

  const handleRemoveFeature = (id: string) => {
    setFeatures(features.filter((f) => f.id !== id));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    updateWebsiteSettings({
      gymName: gymName.trim(),
      headline: headline.trim(),
      subheadline: subheadline.trim(),
      heroTag: heroTag.trim(),
      aboutText: aboutText.trim(),
      location: location.trim(),
      contactPhone: contactPhone.trim(),
      contactEmail: contactEmail.trim(),
      openingHoursText: openingHoursText.trim(),
      callToActionText: callToActionText.trim(),
      whatsappNumber: whatsappNumber.trim() || undefined,
      instagramHandle: instagramHandle.trim() || undefined,
      features,
    });
  };

  return (
    <div className="space-y-6">
      {/* Header with Live Preview CTA */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-[#172033] tracking-tight">
            Public Website Builder & Branding
          </h2>
          <p className="text-xs sm:text-sm text-[#64748B] mt-0.5">
            Customize your public gym landing page that prospective members see
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/gym-preview" target="_blank" rel="noopener noreferrer">
            <Button
              variant="outline"
              leftIcon={<ExternalLink className="w-4 h-4 text-[#3B82F6]" />}
            >
              Open Live Page
            </Button>
          </Link>
          <Button
            variant="primary"
            leftIcon={<Save className="w-4 h-4" />}
            onClick={handleSave}
          >
            Save All Changes
          </Button>
        </div>
      </div>

      {/* Live Preview Banner */}
      <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#3B82F6] text-white flex items-center justify-center shrink-0 shadow-sm">
            <Globe className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-[#172033]">
              Public Website Live at: <span className="text-[#3B82F6] font-mono">/gym-preview</span>
            </h4>
            <p className="text-xs text-[#64748B]">
              Visitors can inspect plans, gym amenities, hours, and submit membership inquiries.
            </p>
          </div>
        </div>
        <Link to="/gym-preview" target="_blank" rel="noopener noreferrer">
          <Button variant="primary" size="sm" rightIcon={<ExternalLink className="w-3.5 h-3.5" />}>
            View Website
          </Button>
        </Link>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Section 1: Hero & Branding */}
        <Card>
          <CardHeader
            title="1. Hero Section & Main Tagline"
            subtitle="The very first impression visitors see at the top of your website"
          />
          <CardBody className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Gym Brand Name"
                required
                value={gymName}
                onChange={(e) => setGymName(e.target.value)}
                placeholder="e.g. IronPulse Fitness Club"
              />
              <Input
                label="Hero Badge / Tag"
                value={heroTag}
                onChange={(e) => setHeroTag(e.target.value)}
                placeholder="e.g. Accra’s #1 Ranked Fitness Center"
              />
            </div>

            <Input
              label="Main Landing Headline"
              required
              value={headline}
              onChange={(e) => setHeadline(e.target.value)}
              placeholder="e.g. Build Your Strength, Transform Your Health"
            />

            <Textarea
              label="Hero Subheadline / Introduction"
              value={subheadline}
              onChange={(e) => setSubheadline(e.target.value)}
              placeholder="A captivating 1-2 sentence overview of your gym's atmosphere and mission..."
              rows={2}
            />

            <Input
              label="Call to Action (CTA) Button Text"
              value={callToActionText}
              onChange={(e) => setCallToActionText(e.target.value)}
              placeholder="e.g. Claim Your Free Gym Trial Pass"
            />
          </CardBody>
        </Card>

        {/* Section 2: About & Story */}
        <Card>
          <CardHeader
            title="2. About the Gym & Philosophy"
            subtitle="Share your gym's origin, coaching philosophy, and community values"
          />
          <CardBody className="space-y-4">
            <Textarea
              label="About Us Paragraph"
              value={aboutText}
              onChange={(e) => setAboutText(e.target.value)}
              placeholder="Tell prospective members what makes your gym the best choice in the city..."
              rows={4}
            />
          </CardBody>
        </Card>

        {/* Section 3: Facilities & Highlight Features */}
        <Card>
          <CardHeader
            title="3. Facility Highlights & Amenities"
            subtitle="Showcase your equipment, specialized training areas, and luxury perks"
          />
          <CardBody className="space-y-4">
            {/* Add Feature mini-form */}
            <div className="p-4 bg-slate-50 rounded-xl border border-[#E7ECF3] space-y-3">
              <span className="text-xs font-semibold text-[#172033] block">
                Add New Facility Highlight:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Input
                  placeholder="Feature Title (e.g. Olympic Lifting Zone)"
                  value={newFeatTitle}
                  onChange={(e) => setNewFeatTitle(e.target.value)}
                />
                <Input
                  placeholder="Short description (e.g. Calibrated Eleiko plates and racks)"
                  value={newFeatDesc}
                  onChange={(e) => setNewFeatDesc(e.target.value)}
                />
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAddFeature}
                leftIcon={<Plus className="w-4 h-4 text-[#3B82F6]" />}
              >
                Add Highlight
              </Button>
            </div>

            {/* List of current features */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {features.map((feat) => (
                <div
                  key={feat.id}
                  className="p-3.5 rounded-xl bg-white border border-[#E7ECF3] flex items-start justify-between gap-3 shadow-2xs"
                >
                  <div>
                    <h5 className="font-bold text-xs text-[#172033]">{feat.title}</h5>
                    <p className="text-[11px] text-[#64748B] mt-0.5 leading-relaxed">
                      {feat.description}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveFeature(feat.id)}
                    className="text-slate-400 hover:text-[#DC2626] transition-colors p-1 rounded-md"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>

        {/* Section 4: Contact, Location & Opening Hours */}
        <Card>
          <CardHeader
            title="4. Location, Operating Hours & Contact Details"
            subtitle="Essential logistics shown on the footer and contact sections"
          />
          <CardBody className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Physical Address / Location"
                required
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Plot 14, Ring Road Central, Osu, Accra"
                prefixElement={<MapPin className="w-4 h-4" />}
              />

              <Input
                label="Public Operating Hours"
                required
                value={openingHoursText}
                onChange={(e) => setOpeningHoursText(e.target.value)}
                placeholder="Mon–Fri: 5:30 AM – 9:30 PM | Sat: 6:00 AM – 8:00 PM"
                prefixElement={<Clock className="w-4 h-4" />}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Contact Phone"
                required
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
                placeholder="+233 24 456 7890"
                prefixElement={<Phone className="w-4 h-4" />}
              />

              <Input
                label="Contact Email"
                required
                type="email"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                placeholder="info@ironpulsefitness.com"
                prefixElement={<Mail className="w-4 h-4" />}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="WhatsApp Number (for direct chat enquiries)"
                value={whatsappNumber}
                onChange={(e) => setWhatsappNumber(e.target.value)}
                placeholder="+233244567890"
              />

              <Input
                label="Instagram Handle"
                value={instagramHandle}
                onChange={(e) => setInstagramHandle(e.target.value)}
                placeholder="@ironpulse_accra"
              />
            </div>
          </CardBody>
        </Card>

        {/* Save Bar */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <Button type="submit" variant="primary" size="lg" leftIcon={<Save className="w-4 h-4" />}>
            Save Website Configuration
          </Button>
        </div>
      </form>
    </div>
  );
};
