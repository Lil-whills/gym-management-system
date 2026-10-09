import React, { forwardRef } from 'react';

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options?: SelectOption[];
  error?: string;
  helperText?: string;
  containerClassName?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      label,
      options = [],
      children,
      error,
      helperText,
      className = '',
      containerClassName = '',
      id,
      required,
      disabled,
      ...props
    },
    ref
  ) => {
    const selectId = id || (label ? `select-${label.toLowerCase().replace(/\s+/g, '-')}` : undefined);

    return (
      <div className={`w-full ${containerClassName}`}>
        {label && (
          <label
            htmlFor={selectId}
            className="block text-xs font-medium text-[#172033] mb-1.5"
          >
            {label}
            {required && <span className="text-[#DC2626] ml-0.5">*</span>}
          </label>
        )}
        <div className="relative">
          <select
            id={selectId}
            ref={ref}
            disabled={disabled}
            required={required}
            className={`w-full appearance-none rounded-lg border bg-white px-3.5 py-2 text-sm text-[#172033] transition-colors focus:outline-none focus:ring-2 focus:ring-[#3B82F6] focus:border-[#3B82F6] disabled:bg-slate-50 disabled:text-slate-500 disabled:cursor-not-allowed ${
              error
                ? 'border-[#DC2626] focus:ring-[#DC2626] focus:border-[#DC2626]'
                : 'border-[#E7ECF3] hover:border-[#CBD5E1]'
            } ${className}`}
            {...props}
          >
            {options.map((opt) => (
              <option key={opt.value} value={opt.value} disabled={opt.disabled}>
                {opt.label}
              </option>
            ))}
            {children}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-[#64748B]">
            <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20">
              <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
            </svg>
          </div>
        </div>
        {error && <p className="mt-1 text-xs text-[#DC2626] font-medium">{error}</p>}
        {!error && helperText && (
          <p className="mt-1 text-xs text-[#64748B]">{helperText}</p>
        )}
      </div>
    );
  }
);

Select.displayName = 'Select';
