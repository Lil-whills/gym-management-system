import React from 'react';
import { Modal } from './Modal';
import { Button } from './Button';
import { AlertTriangle, AlertCircle, Info } from 'lucide-react';

export interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: React.ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'danger' | 'warning' | 'primary';
  isLoading?: boolean;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  variant = 'danger',
  isLoading = false,
}) => {
  let iconComponent = <AlertCircle className="w-6 h-6 text-[#DC2626]" />;
  let iconBg = 'bg-[#FEE2E2]';

  if (variant === 'warning') {
    iconComponent = <AlertTriangle className="w-6 h-6 text-[#D97706]" />;
    iconBg = 'bg-[#FEF3C7]';
  } else if (variant === 'primary') {
    iconComponent = <Info className="w-6 h-6 text-[#3B82F6]" />;
    iconBg = 'bg-[#EFF6FF]';
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="sm" showCloseButton={false}>
      <div className="flex flex-col items-center text-center p-2">
        <div className={`w-12 h-12 rounded-full ${iconBg} flex items-center justify-center mb-4`}>
          {iconComponent}
        </div>
        <h3 className="text-lg font-semibold text-[#172033] mb-2">{title}</h3>
        <div className="text-sm text-[#64748B] leading-relaxed mb-6">{description}</div>

        <div className="flex items-center justify-center gap-3 w-full">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isLoading}
            className="flex-1"
          >
            {cancelLabel}
          </Button>
          <Button
            type="button"
            variant={variant === 'danger' ? 'danger' : variant === 'warning' ? 'secondary' : 'primary'}
            onClick={() => {
              onConfirm();
            }}
            isLoading={isLoading}
            className="flex-1"
          >
            {confirmLabel}
          </Button>
        </div>
      </div>
    </Modal>
  );
};
