import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Textarea } from '../../components/ui/Textarea';
import { formatCurrency } from '../../lib/currency';
import { APP_CONFIG } from '../../constants/app';
import {
  Dumbbell,
  MapPin,
  Phone,
  Clock,
  Check,
  ArrowRight,
  ShieldCheck,
  Zap,
  Users,
  Award,
  Sparkles,
  Send,
  ArrowLeft,
} from 'lucide-react';

export const GymPublicPage: React.FC = () => {
  const { websiteSettings, plans } = useData();

  // Interactive Enquiry Form State
  const [inquiryName, setInquiryName] = useState('');
  const [inquiryPhone, setInquiryPhone] = useState('');
  const [inquiryPlan, setInquiryPlan] = useState('');
  const [inquiryMessage, setInquiryMessage] = useState('');
  const [inquirySubmitted, setInquirySubmitted] = useState(false);

  const activePlans = plans.filter((p) => p.isActive);

  const handleInquirySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inquiryName || !inquiryPhone) return;
    setInquirySubmitted(true);
  };

  const getFeatureIcon = (index: number) => {
    switch (index % 4) {
      case 0:
        return <Dumbbell className="w-5 h-5 text-[#3B82F6]" />;
      case 1:
        return <Zap className="w-5 h-5 text-amber-500" />;
      case 2:
        return <Users className="w-5 h-5 text-emerald-500" />;
      default:
        return <ShieldCheck className="w-5 h-5 text-purple-500" />;
    }
  };

  return (
    <div className="min-h-screen bg-white text-[#172033] font-sans antialiased selection:bg-blue-500 selection:text-white">
      {/* Top Demo Helper Bar */}
      <div className="bg-[#0F172A] text-slate-300 text-xs py-2 px-4 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>
            <strong>Public Gym Website Preview:</strong> Displaying live branding for{' '}
            <strong className="text-white">{websiteSettings.gymName}</strong>
          </span>
        </div>
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-1 text-xs font-semibold text-[#3B82F6] hover:text-blue-400 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Return to Dashboard</span>
        </Link>
      </div>

      {/* Public Header / Navbar */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#E7ECF3]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#0F172A] text-white flex items-center justify-center font-bold text-sm shadow-md">
              <Dumbbell className="w-5 h-5 text-[#3B82F6]" />
            </div>
            <div>
              <span className="font-extrabold text-lg sm:text-xl tracking-tight text-[#172033] block leading-tight">
                {websiteSettings.gymName}
              </span>
              <span className="text-[11px] font-semibold text-[#64748B] tracking-wider uppercase">
                Premier Fitness Facility
              </span>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-xs font-semibold text-[#64748B]">
            <a href="#about" className="hover:text-[#3B82F6] transition-colors">
              About Us
            </a>
            <a href="#facilities" className="hover:text-[#3B82F6] transition-colors">
              Facilities
            </a>
            <a href="#pricing" className="hover:text-[#3B82F6] transition-colors">
              Membership Plans
            </a>
            <a href="#location" className="hover:text-[#3B82F6] transition-colors">
              Location & Hours
            </a>
          </nav>

          <div>
            <a href="#join">
              <Button variant="primary" size="md">
                Join Today
              </Button>
            </a>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#F6F8FC] via-white to-white py-16 sm:py-24 border-b border-[#E7ECF3]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-6">
            {/* Tag Badge */}
            {websiteSettings.heroTag && (
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-[#3B82F6] text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{websiteSettings.heroTag}</span>
              </div>
            )}

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#172033] leading-tight">
              {websiteSettings.headline}
            </h1>

            <p className="text-base sm:text-lg text-[#64748B] leading-relaxed max-w-2xl">
              {websiteSettings.subheadline}
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <a href="#join">
                <Button variant="primary" size="lg" rightIcon={<ArrowRight className="w-4 h-4" />}>
                  {websiteSettings.callToActionText || 'Claim Free Pass'}
                </Button>
              </a>
              <a href="#pricing">
                <Button variant="outline" size="lg">
                  Explore Membership Plans
                </Button>
              </a>
            </div>

            {/* Quick trust metrics */}
            <div className="pt-8 border-t border-[#E7ECF3] grid grid-cols-3 gap-6 text-left max-w-md">
              <div>
                <span className="text-2xl font-extrabold text-[#172033]">100%</span>
                <p className="text-xs text-[#64748B]">Modern Equipment</p>
              </div>
              <div>
                <span className="text-2xl font-extrabold text-[#172033]">7 Days</span>
                <p className="text-xs text-[#64748B]">Open Weekly</p>
              </div>
              <div>
                <span className="text-2xl font-extrabold text-[#172033]">Top 1%</span>
                <p className="text-xs text-[#64748B]">Coaching Staff</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-16 sm:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-[#3B82F6]">
                Our Mission & Story
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#172033] tracking-tight">
                Designed for Performance, Built for Everyone
              </h2>
              <p className="text-sm sm:text-base text-[#64748B] leading-relaxed">
                {websiteSettings.aboutText}
              </p>
              <div className="pt-2 flex items-center gap-4">
                <div className="p-3 bg-blue-50 rounded-xl flex items-center gap-3">
                  <Award className="w-5 h-5 text-[#3B82F6]" />
                  <div>
                    <h5 className="font-bold text-xs text-[#172033]">Certified Trainers</h5>
                    <p className="text-[11px] text-[#64748B]">Personalized workout instruction</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Feature preview cards */}
            <div className="bg-[#F6F8FC] p-8 rounded-2xl border border-[#E7ECF3] space-y-4">
              <h4 className="font-bold text-base text-[#172033]">Why Train With Us?</h4>
              <ul className="space-y-3">
                <li className="flex items-start gap-3 text-xs text-[#172033]">
                  <div className="w-5 h-5 rounded-full bg-emerald-100 text-[#16A34A] flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <span>
                    <strong>Flexible Memberships:</strong> Transparent monthly, quarterly, and annual passes with no hidden lock-in penalties.
                  </span>
                </li>
                <li className="flex items-start gap-3 text-xs text-[#172033]">
                  <div className="w-5 h-5 rounded-full bg-emerald-100 text-[#16A34A] flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <span>
                    <strong>Hygienic Recovery Suites:</strong> High-pressure showers, private changing rooms, and wellness sauna.
                  </span>
                </li>
                <li className="flex items-start gap-3 text-xs text-[#172033]">
                  <div className="w-5 h-5 rounded-full bg-emerald-100 text-[#16A34A] flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <span>
                    <strong>Seamless Payment Options:</strong> Quick payment via MTN Mobile Money, Telecel Cash, or Front Desk Cash.
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Facilities & Amenities */}
      <section id="facilities" className="py-16 sm:py-20 bg-[#F6F8FC] border-y border-[#E7ECF3]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#3B82F6]">
              World-Class Equipment
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#172033] tracking-tight">
              Explore Our Training Zones
            </h2>
            <p className="text-xs sm:text-sm text-[#64748B]">
              Everything you need for strength development, conditioning, and recovery
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {websiteSettings.features.map((feat, index) => (
              <div
                key={feat.id || index}
                className="bg-white p-6 rounded-2xl border border-[#E7ECF3] shadow-xs hover:shadow-md transition-all space-y-3"
              >
                <div className="w-10 h-10 rounded-xl bg-slate-50 border border-[#E7ECF3] flex items-center justify-center">
                  {getFeatureIcon(index)}
                </div>
                <h4 className="font-bold text-sm text-[#172033]">{feat.title}</h4>
                <p className="text-xs text-[#64748B] leading-relaxed">{feat.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing & Membership Plans */}
      <section id="pricing" className="py-16 sm:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#3B82F6]">
              Simple & Transparent Pricing
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#172033] tracking-tight">
              Choose Your Membership Pass
            </h2>
            <p className="text-xs sm:text-sm text-[#64748B]">
              No sign-up initiation fees. Full access to facilities included in all passes.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {activePlans.map((plan, idx) => {
              const isPopular = plan.durationMonths === 3 || idx === 1;

              return (
                <div
                  key={plan.id}
                  className={`rounded-2xl p-6 sm:p-8 flex flex-col justify-between transition-all ${
                    isPopular
                      ? 'bg-[#0F172A] text-white shadow-xl ring-2 ring-[#3B82F6]'
                      : 'bg-white text-[#172033] border border-[#E7ECF3] shadow-xs hover:shadow-md'
                  }`}
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span
                        className={`text-xs font-bold uppercase tracking-wider ${
                          isPopular ? 'text-blue-400' : 'text-[#3B82F6]'
                        }`}
                      >
                        {plan.name}
                      </span>
                      {isPopular && (
                        <span className="px-2.5 py-0.5 rounded-full bg-blue-500 text-white text-[10px] font-bold">
                          Most Popular
                        </span>
                      )}
                    </div>

                    <div>
                      <div className="flex items-baseline gap-1">
                        <span className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                          {formatCurrency(plan.price)}
                        </span>
                        <span className={`text-xs ${isPopular ? 'text-slate-400' : 'text-[#64748B]'}`}>
                          / {plan.durationMonths} {plan.durationMonths === 1 ? 'month' : 'months'}
                        </span>
                      </div>
                      <p className={`text-xs mt-2 ${isPopular ? 'text-slate-300' : 'text-[#64748B]'}`}>
                        {plan.description}
                      </p>
                    </div>

                    <div className={`pt-4 border-t ${isPopular ? 'border-slate-800' : 'border-[#E7ECF3]'}`}>
                      <span
                        className={`text-[11px] font-semibold uppercase tracking-wider block mb-3 ${
                          isPopular ? 'text-slate-400' : 'text-[#64748B]'
                        }`}
                      >
                        What’s included:
                      </span>
                      <ul className="space-y-2.5">
                        {plan.features.map((feat, fIdx) => (
                          <li key={fIdx} className="flex items-start gap-2.5 text-xs">
                            <Check className="w-4 h-4 text-[#16A34A] shrink-0 mt-0.5" />
                            <span className={isPopular ? 'text-slate-200' : 'text-[#172033]'}>
                              {feat}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="pt-8">
                    <a href="#join">
                      <Button
                        variant={isPopular ? 'primary' : 'outline'}
                        size="md"
                        className="w-full"
                        onClick={() => setInquiryPlan(plan.name)}
                      >
                        Select {plan.name}
                      </Button>
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Location, Opening Hours & Inquiry Form Section */}
      <section id="join" className="py-16 sm:py-20 bg-[#F6F8FC] border-t border-[#E7ECF3]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Left: Contact & Location details */}
            <div className="space-y-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#3B82F6]">
                  Visit Our Facility
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-[#172033] tracking-tight mt-1">
                  Location & Operating Hours
                </h2>
                <p className="text-xs sm:text-sm text-[#64748B] mt-2">
                  Drop by for a tour, baseline body composition check, or friendly workout trial.
                </p>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-[#E7ECF3] space-y-4 shadow-xs">
                <div className="flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-xl bg-blue-50 text-[#3B82F6] flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <h5 className="font-bold text-xs text-[#172033]">Physical Address</h5>
                    <p className="text-xs text-[#64748B] mt-0.5">{websiteSettings.location}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5 pt-3 border-t border-[#E7ECF3]">
                  <div className="w-9 h-9 rounded-xl bg-blue-50 text-[#3B82F6] flex items-center justify-center shrink-0">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <h5 className="font-bold text-xs text-[#172033]">Gym Hours</h5>
                    <p className="text-xs text-[#64748B] mt-0.5">{websiteSettings.openingHoursText}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5 pt-3 border-t border-[#E7ECF3]">
                  <div className="w-9 h-9 rounded-xl bg-blue-50 text-[#3B82F6] flex items-center justify-center shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <h5 className="font-bold text-xs text-[#172033]">Phone & Inquiries</h5>
                    <p className="text-xs text-[#64748B] mt-0.5">{websiteSettings.contactPhone}</p>
                    <p className="text-xs text-[#64748B]">{websiteSettings.contactEmail}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Interactive Inquiry Form */}
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#E7ECF3] shadow-md space-y-5">
              <div>
                <h3 className="text-lg sm:text-xl font-bold text-[#172033] tracking-tight">
                  Get in Touch / Request a Free Trial Pass
                </h3>
                <p className="text-xs text-[#64748B] mt-1">
                  Leave your details and our member coordinator will reach out right away.
                </p>
              </div>

              {inquirySubmitted ? (
                <div className="p-6 bg-green-50 rounded-xl border border-green-200 text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-emerald-100 text-[#16A34A] flex items-center justify-center mx-auto">
                    <Check className="w-6 h-6" />
                  </div>
                  <h4 className="text-base font-bold text-[#172033]">Inquiry Received!</h4>
                  <p className="text-xs text-[#64748B] max-w-sm mx-auto">
                    Thank you, <strong>{inquiryName}</strong>. Our front desk team at {websiteSettings.gymName} has received your request and will contact you via {inquiryPhone}.
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setInquirySubmitted(false);
                      setInquiryName('');
                      setInquiryPhone('');
                      setInquiryMessage('');
                    }}
                  >
                    Send Another Message
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleInquirySubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input
                      label="Your Name"
                      required
                      placeholder="e.g. Abena Mensah"
                      value={inquiryName}
                      onChange={(e) => setInquiryName(e.target.value)}
                    />
                    <Input
                      label="Phone / WhatsApp Number"
                      required
                      placeholder="e.g. 024 456 7890"
                      value={inquiryPhone}
                      onChange={(e) => setInquiryPhone(e.target.value)}
                    />
                  </div>

                  <Input
                    label="Interested Plan / Package"
                    placeholder="e.g. Monthly Flex or Quarterly"
                    value={inquiryPlan}
                    onChange={(e) => setInquiryPlan(e.target.value)}
                  />

                  <Textarea
                    label="Questions or Fitness Goals (Optional)"
                    placeholder="Tell us what you'd like to achieve or when you'd like to visit..."
                    value={inquiryMessage}
                    onChange={(e) => setInquiryMessage(e.target.value)}
                    rows={3}
                  />

                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    className="w-full"
                    leftIcon={<Send className="w-4 h-4" />}
                  >
                    Submit Membership Inquiry
                  </Button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Public Footer */}
      <footer className="bg-[#0F172A] text-slate-400 py-12 border-t border-slate-800 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#3B82F6] text-white flex items-center justify-center font-bold text-xs">
              <Dumbbell className="w-4 h-4" />
            </div>
            <div>
              <p className="font-bold text-white text-sm">{websiteSettings.gymName}</p>
              <p className="text-[11px] text-slate-400">© {new Date().getFullYear()} All rights reserved.</p>
            </div>
          </div>

          <div className="text-center sm:text-right">
            <p className="text-slate-400 text-xs">
              Powered by{' '}
              <Link to="/dashboard" className="text-[#3B82F6] hover:underline font-semibold">
                {APP_CONFIG.name} SaaS
              </Link>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};
