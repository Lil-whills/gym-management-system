import React from 'react';
import { Card } from './Card';

export interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  iconBgColor?: string;
  badge?: {
    text: string;
    variant: 'success' | 'warning' | 'danger' | 'blue' | 'neutral';
  };
  onClick?: () => void;
  className?: string;
}

export const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  iconBgColor = 'bg-[#EFF6FF] text-[#3B82F6]',
  badge,
  onClick,
  className = '',
}) => {
  return (
    <Card
      hoverable={!!onClick}
      onClick={onClick}
      className={`p-5 relative overflow-hidden ${onClick ? 'cursor-pointer' : ''} ${className}`}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-xs font-medium text-[#64748B] uppercase tracking-wider">{title}</p>
          <div className="flex items-baseline gap-2">
            <h3 className="text-2xl sm:text-3xl font-bold text-[#172033] tracking-tight">{value}</h3>
          </div>
          {subtitle && <p className="text-xs text-[#64748B] pt-0.5">{subtitle}</p>}
        </div>
        <div className={`p-3 rounded-xl shrink-0 ${iconBgColor}`}>{icon}</div>
      </div>

      {badge && (
        <div className="mt-3.5 pt-3 border-t border-[#E7ECF3] flex items-center justify-between text-xs">
          <span className="text-[#64748B]">Current status:</span>
          <span
            className={`px-2 py-0.5 rounded-full font-medium ${
              badge.variant === 'success'
                ? 'bg-[#DCFCE7] text-[#16A34A]'
                : badge.variant === 'warning'
                ? 'bg-[#FEF3C7] text-[#D97706]'
                : badge.variant === 'danger'
                ? 'bg-[#FEE2E2] text-[#DC2626]'
                : 'bg-blue-50 text-[#3B82F6]'
            }`}
          >
            {badge.text}
          </span>
        </div>
      )}
    </Card>
  );
};
