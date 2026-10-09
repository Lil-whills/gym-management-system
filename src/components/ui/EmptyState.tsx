import React from 'react';
import { Button } from './Button';
import { Inbox } from 'lucide-react';

export interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  actionLabel,
  onAction,
  className = '',
}) => {
  return (
    <div
      className={`flex flex-col items-center justify-center p-8 sm:p-12 text-center rounded-xl bg-slate-50/60 border border-dashed border-[#CBD5E1] ${className}`}
    >
      <div className="w-12 h-12 rounded-full bg-white border border-[#E7ECF3] text-[#64748B] flex items-center justify-center shadow-xs mb-3.5">
        {icon || <Inbox className="w-6 h-6 text-[#94A3B8]" />}
      </div>
      <h4 className="text-base font-semibold text-[#172033] mb-1">{title}</h4>
      <p className="text-xs sm:text-sm text-[#64748B] max-w-md mb-5 leading-relaxed">
        {description}
      </p>
      {actionLabel && onAction && (
        <Button variant="primary" size="sm" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
};
