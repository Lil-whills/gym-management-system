import React, { forwardRef } from 'react';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
  containerClassName?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      label,
      error,
      helperText,
      className = '',
      containerClassName = '',
      id,
      required,
      disabled,
      rows = 3,
      ...props
    },
    ref
  ) => {
    const textareaId = id || (label ? `textarea-${label.toLowerCase().replace(/\s+/g, '-')}` : undefined);

    return (
      <div className={`w-full ${containerClassName}`}>
        {label && (
          <label
            htmlFor={textareaId}
            className="block text-xs font-medium text-[#172033] mb-1.5"
          >
            {label}
            {required && <span className="text-[#DC2626] ml-0.5">*</span>}
          </label>
        )}
        <textarea
          id={textareaId}
          ref={ref}
          rows={rows}
          disabled={disabled}
          required={required}
          className={`w-full rounded-lg border bg-white px-3.5 py-2 text-sm text-[#172033] placeholder-[#94A3B8] transition-colors focus:outline-none focus:ring-2 focus:ring-[#3B82F6] focus:border-[#3B82F6] disabled:bg-slate-50 disabled:text-slate-500 disabled:cursor-not-allowed ${
            error
              ? 'border-[#DC2626] focus:ring-[#DC2626] focus:border-[#DC2626]'
              : 'border-[#E7ECF3] hover:border-[#CBD5E1]'
          } ${className}`}
          {...props}
        />
        {error && <p className="mt-1 text-xs text-[#DC2626] font-medium">{error}</p>}
        {!error && helperText && (
          <p className="mt-1 text-xs text-[#64748B]">{helperText}</p>
        )}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';
