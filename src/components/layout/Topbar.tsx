import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Menu, UserPlus, Dumbbell } from 'lucide-react';
import { Button } from '../ui/Button';
import { useData } from '../../context/DataContext';

interface TopbarProps {
  onOpenSidebar: () => void;
}

export const Topbar: React.FC<TopbarProps> = ({ onOpenSidebar }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { gymProfile } = useData();

  // Derive title from route
  const getPageInfo = () => {
    const path = location.pathname;
    if (path.startsWith('/dashboard')) {
      return {
        title: 'Dashboard Overview',
        subtitle: `Performance metrics and operational health for ${gymProfile.name}`,
      };
    }
    if (path.startsWith('/members/new')) {
      return {
        title: 'Register New Member',
        subtitle: 'Enroll a client, configure membership dates, and collect initial dues',
      };
    }
    if (path.startsWith('/members/')) {
      return {
        title: 'Member Profile',
        subtitle: 'Review membership standing, renewal dates, and payment history',
      };
    }
    if (path.startsWith('/members')) {
      return {
        title: 'Member Directory',
        subtitle: 'Manage client memberships, track active plans, and handle renewals',
      };
    }
    if (path.startsWith('/plans') || path.startsWith('/subscription')) {
      return {
        title: 'Subscription Plans',
        subtitle: 'Facility software tiers: Standard (GH₵ 100), Pro (GH₵ 150), and Premium (GH₵ 200) per month',
      };
    }
    if (path.startsWith('/payments')) {
      return {
        title: 'Payment Records & Revenue',
        subtitle: 'Track dues collections, inspect transactions, and print receipts',
      };
    }
    return {
      title: 'LiftDesk SaaS',
      subtitle: 'Gym Membership & Facility Management',
    };
  };

  const pageInfo = getPageInfo();

  return (
    <header className="h-16 lg:h-20 bg-white border-b border-[#E7ECF3] px-4 sm:px-6 lg:px-8 flex items-center justify-between sticky top-0 z-30">
      {/* Left: Mobile menu & page info */}
      <div className="flex items-center gap-3 sm:gap-4 min-w-0">
        <button
          type="button"
          onClick={onOpenSidebar}
          className="lg:hidden p-2 rounded-lg text-[#64748B] hover:text-[#172033] hover:bg-slate-100 transition-colors cursor-pointer"
          aria-label="Open sidebar menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="min-w-0">
          <h1 className="text-base sm:text-xl font-bold text-[#172033] tracking-tight truncate">
            {pageInfo.title}
          </h1>
          <p className="hidden sm:block text-xs text-[#64748B] truncate mt-0.5">
            {pageInfo.subtitle}
          </p>
        </div>
      </div>

      {/* Right: Register Member action & Profile */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        <Button
          variant="primary"
          size="sm"
          leftIcon={<UserPlus className="w-4 h-4" />}
          onClick={() => navigate('/members/new')}
          className="shadow-xs"
        >
          <span className="hidden xs:inline">Register Member</span>
          <span className="xs:hidden">Register</span>
        </Button>

        {/* Gym Avatar / Manager badge */}
        <div className="hidden sm:flex items-center pl-3 border-l border-[#E7ECF3] gap-2.5">
          <div className="w-8 h-8 rounded-full bg-[#0F172A] text-white flex items-center justify-center font-bold text-xs shadow-xs">
            <Dumbbell className="w-4 h-4 text-[#3B82F6]" />
          </div>
          <div className="text-left hidden md:block">
            <p className="text-xs font-semibold text-[#172033] leading-none">Gym Admin</p>
            <p className="text-[10px] text-[#64748B] mt-0.5">Workspace Manager</p>
          </div>
        </div>
      </div>
    </header>
  );
};
