import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Receipt,
  Settings,
  Dumbbell,
  Crown,
  X,
} from 'lucide-react';
import { APP_CONFIG } from '../../constants/app';
import { useData } from '../../context/DataContext';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { gymProfile, stats } = useData();

  const navItems = [
    {
      label: 'Overview',
      path: '/dashboard',
      icon: LayoutDashboard,
      badge: undefined,
    },
    {
      label: 'Members',
      path: '/members',
      icon: Users,
      badge: stats.expiringSoonMembers > 0 ? `${stats.expiringSoonMembers} expiring` : undefined,
      badgeType: 'warning',
    },
    {
      label: 'Subscription Plans',
      path: '/plans',
      icon: Crown,
      badge: undefined,
    },
    {
      label: 'Payments',
      path: '/payments',
      icon: Receipt,
      badge: undefined,
    },
    {
      label: 'Settings',
      path: '/settings',
      icon: Settings,
      badge: undefined,
    },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-xs lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 w-64 bg-[#0F172A] text-white flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="h-16 px-5 border-b border-slate-800 flex items-center justify-between shrink-0">
          <Link to="/dashboard" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-xl bg-[#3B82F6] flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
              <Dumbbell className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-lg tracking-tight text-white flex items-center gap-1.5">
                {APP_CONFIG.name}
              </span>
              <span className="text-[10px] uppercase font-semibold tracking-wider text-[#3B82F6] block -mt-1">
                SaaS Dashboard
              </span>
            </div>
          </Link>

          {/* Close button for mobile */}
          <button
            onClick={onClose}
            className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Current Active Gym Info */}
        <div className="px-4 py-3.5 mx-3 my-3 rounded-xl bg-slate-800/60 border border-slate-700/60 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-blue-600/20 text-[#3B82F6] font-bold text-xs flex items-center justify-center border border-blue-500/30 shrink-0">
            {gymProfile.logoInitials || gymProfile.name?.slice(0, 2).toUpperCase() || 'IP'}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold text-slate-100 truncate">{gymProfile.name}</p>
            <p className="text-[11px] text-slate-400 truncate">Accra, Ghana</p>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
          <div className="px-3 pb-2 pt-1 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            Main Menu
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => {
                  if (window.innerWidth < 1024) onClose();
                }}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 group ${
                    isActive
                      ? 'bg-[#3B82F6] text-white shadow-md shadow-blue-500/20'
                      : 'text-slate-300 hover:bg-slate-800/70 hover:text-white'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <div className="flex items-center gap-3">
                      <Icon
                        className={`w-4 h-4 transition-colors ${
                          isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-200'
                        }`}
                      />
                      <span>{item.label}</span>
                    </div>
                    {item.badge && (
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          isActive
                            ? 'bg-white/20 text-white'
                            : item.badgeType === 'warning'
                            ? 'bg-[#FEF3C7] text-[#D97706]'
                            : 'bg-[#DCFCE7] text-[#16A34A]'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Bottom Prototype Demo Badge */}
        <div className="p-3 border-t border-slate-800">
          <div className="px-3 py-2.5 rounded-xl bg-slate-900/80 border border-slate-800 text-center">
            <span className="inline-flex items-center gap-1.5 text-[11px] text-slate-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              {APP_CONFIG.demoBadgeText}
            </span>
          </div>
        </div>
      </aside>
    </>
  );
};
