import React from 'react';
import { useToast } from '../../context/ToastContext';
import { CheckCircle2, AlertCircle, AlertTriangle, Info, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useToast();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col space-y-2 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => {
        let borderClass = 'border-[#E7ECF3]';
        let bgIconClass = 'text-blue-500';
        let IconComponent = Info;

        if (toast.type === 'success') {
          borderClass = 'border-[#BBF7D0]';
          bgIconClass = 'text-[#16A34A]';
          IconComponent = CheckCircle2;
        } else if (toast.type === 'error') {
          borderClass = 'border-[#FECACA]';
          bgIconClass = 'text-[#DC2626]';
          IconComponent = AlertCircle;
        } else if (toast.type === 'warning') {
          borderClass = 'border-[#FDE68A]';
          bgIconClass = 'text-[#D97706]';
          IconComponent = AlertTriangle;
        }

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start p-4 bg-white rounded-xl shadow-lg border ${borderClass} transition-all transform translate-y-0 opacity-100 duration-200`}
            role="alert"
          >
            <div className={`shrink-0 mr-3 mt-0.5 ${bgIconClass}`}>
              <IconComponent className="w-5 h-5" />
            </div>
            <div className="flex-1 mr-2">
              <h4 className="text-sm font-semibold text-[#172033] leading-5">{toast.title}</h4>
              {toast.message && (
                <p className="mt-1 text-xs text-[#64748B] leading-4">{toast.message}</p>
              )}
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="shrink-0 text-[#94A3B8] hover:text-[#172033] transition-colors p-1 rounded-md hover:bg-slate-100"
              aria-label="Close notification"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
