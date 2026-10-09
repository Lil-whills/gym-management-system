import React, { forwardRef } from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  prefixElement?: React.ReactNode;
  suffixElement?: React.ReactNode;
  containerClassName?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      helperText,
      prefixElement,
      suffixElement,
      className = '',
      containerClassName = '',
      id,
      required,
      disabled,
      ...props
    },
    ref
  ) => {
    const inputId = id || (label ? `input-${label.toLowerCase().replace(/\s+/g, '-')}` : undefined);

    return (
      <div className={`w-full ${containerClassName}`}>
        {label && (
          <label
            htmlFor={inputId}
            className="block text-xs font-medium text-[#172033] mb-1.5"
          >
            {label}
            {required && <span className="text-[#DC2626] ml-0.5">*</span>}
          </label>
        )}
        <div className="relative flex items-center">
          {prefixElement && (
            <div className="absolute left-3 flex items-center pointer-events-none text-[#64748B]">
              {prefixElement}
            </div>
          )}
          <input
            id={inputId}
            ref={ref}
            disabled={disabled}
            required={required}
            className={`w-full rounded-lg border bg-white px-3.5 py-2 text-sm text-[#172033] placeholder-[#94A3B8] transition-colors focus:outline-none focus:ring-2 focus:ring-[#3B82F6] focus:border-[#3B82F6] disabled:bg-slate-50 disabled:text-slate-500 disabled:cursor-not-allowed ${
              prefixElement ? 'pl-9' : ''
            } ${suffixElement ? 'pr-9' : ''} ${
              error
                ? 'border-[#DC2626] focus:ring-[#DC2626] focus:border-[#DC2626]'
                : 'border-[#E7ECF3] hover:border-[#CBD5E1]'
            } ${className}`}
            {...props}
          />
          {suffixElement && (
            <div className="absolute right-3 flex items-center text-[#64748B]">
              {suffixElement}
            </div>
          )}
        </div>
        {error && <p className="mt-1 text-xs text-[#DC2626] font-medium">{error}</p>}
        {!error && helperText && (
          <p className="mt-1 text-xs text-[#64748B]">{helperText}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
