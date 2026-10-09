import React from 'react';

export type BadgeVariant = 'success' | 'warning' | 'danger' | 'navy' | 'blue' | 'neutral';
export type BadgeSize = 'sm' | 'md';

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  size?: BadgeSize;
  dot?: boolean;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'neutral',
  size = 'md',
  dot = false,
  className = '',
}) => {
  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-xs font-medium',
  };

  const variantClasses = {
    success: 'bg-[#DCFCE7] text-[#16A34A] border border-[#BBF7D0]',
    warning: 'bg-[#FEF3C7] text-[#D97706] border border-[#FDE68A]',
    danger: 'bg-[#FEE2E2] text-[#DC2626] border border-[#FECACA]',
    navy: 'bg-slate-900 text-white border border-slate-800',
    blue: 'bg-[#EFF6FF] text-[#3B82F6] border border-blue-200',
    neutral: 'bg-slate-100 text-[#64748B] border border-[#E7ECF3]',
  };

  const dotClasses = {
    success: 'bg-[#16A34A]',
    warning: 'bg-[#D97706]',
    danger: 'bg-[#DC2626]',
    navy: 'bg-white',
    blue: 'bg-[#3B82F6]',
    neutral: 'bg-[#64748B]',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
    >
      {dot && <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${dotClasses[variant]}`} />}
      <span className="truncate">{children}</span>
    </span>
  );
};
