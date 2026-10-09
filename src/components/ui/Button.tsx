import React from 'react';
import { Loader2 } from 'lucide-react';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost' | 'subtle';
export type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  className = '',
  disabled,
  ...props
}) => {
  const baseClasses =
    'inline-flex items-center justify-center font-medium rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed select-none cursor-pointer';

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-xs gap-1.5',
    md: 'px-4 py-2 text-sm gap-2',
    lg: 'px-5 py-2.5 text-base gap-2.5',
  };

  const variantClasses = {
    primary:
      'bg-[#3B82F6] hover:bg-[#2563EB] active:bg-[#1D4ED8] text-white shadow-sm focus:ring-[#3B82F6]',
    secondary:
      'bg-[#0F172A] hover:bg-[#1E293B] active:bg-[#090D16] text-white shadow-sm focus:ring-[#0F172A]',
    outline:
      'bg-white hover:bg-slate-50 text-[#172033] border border-[#E7ECF3] hover:border-[#CBD5E1] shadow-xs focus:ring-[#3B82F6]',
    danger:
      'bg-[#DC2626] hover:bg-[#B91C1C] active:bg-[#991B1B] text-white shadow-sm focus:ring-[#DC2626]',
    ghost:
      'bg-transparent hover:bg-slate-100 text-[#64748B] hover:text-[#172033] focus:ring-slate-300',
    subtle:
      'bg-[#EFF6FF] hover:bg-blue-100 text-[#3B82F6] font-semibold focus:ring-[#3B82F6]',
  };

  return (
    <button
      className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin shrink-0" />
      ) : (
        leftIcon && <span className="shrink-0">{leftIcon}</span>
      )}
      <span>{children}</span>
      {!isLoading && rightIcon && <span className="shrink-0">{rightIcon}</span>}
    </button>
  );
};
