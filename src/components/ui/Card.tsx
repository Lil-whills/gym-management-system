import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  hoverable?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  hoverable = false,
  ...props
}) => {
  return (
    <div
      className={`bg-white rounded-xl border border-[#E7ECF3] shadow-xs ${
        hoverable ? 'hover:border-[#CBD5E1] hover:shadow-sm transition-all duration-150' : ''
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export const CardHeader: React.FC<{
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}> = ({ title, subtitle, action, className = '' }) => {
  return (
    <div
      className={`px-5 py-4 border-b border-[#E7ECF3] flex items-center justify-between gap-4 ${className}`}
    >
      <div>
        <h3 className="text-base font-semibold text-[#172033] tracking-tight">{title}</h3>
        {subtitle && <p className="text-xs text-[#64748B] mt-0.5">{subtitle}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
};

export const CardBody: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className = '' }) => {
  return <div className={`p-5 ${className}`}>{children}</div>;
};

export const CardFooter: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className = '' }) => {
  return (
    <div
      className={`px-5 py-3.5 bg-slate-50/50 border-t border-[#E7ECF3] rounded-b-xl flex items-center justify-between ${className}`}
    >
      {children}
    </div>
  );
};
