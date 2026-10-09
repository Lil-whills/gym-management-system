import React from 'react';
import { Modal } from '../../components/ui/Modal';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { useData } from '../../context/DataContext';
import { formatDate } from '../../lib/dates';
import { formatCurrency } from '../../lib/currency';
import { Printer, Dumbbell } from 'lucide-react';
import type { Payment } from '../../types';

interface PaymentReceiptModalProps {
  payment: Payment | null;
  isOpen: boolean;
  onClose: () => void;
}

export const PaymentReceiptModal: React.FC<PaymentReceiptModalProps> = ({
  payment,
  isOpen,
  onClose,
}) => {
  const { gymProfile } = useData();

  if (!payment) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md" title="Transaction Receipt">
      <div className="space-y-6">
        {/* Receipt Header */}
        <div className="p-4 bg-slate-50 rounded-xl border border-[#E7ECF3] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#0F172A] text-white flex items-center justify-center font-bold text-sm">
              <Dumbbell className="w-5 h-5 text-[#3B82F6]" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-[#172033]">{gymProfile.name}</h4>
              <p className="text-[11px] text-[#64748B]">{gymProfile.location}</p>
            </div>
          </div>
          <Badge variant="success" dot size="sm">
            {payment.status}
          </Badge>
        </div>

        {/* Amount Box */}
        <div className="text-center py-3 bg-blue-50/50 rounded-xl border border-blue-100">
          <span className="text-xs font-semibold text-[#3B82F6] uppercase tracking-wider">
            Total Amount Paid
          </span>
          <div className="text-3xl font-extrabold text-[#172033] mt-1">
            {formatCurrency(payment.amount, true)}
          </div>
          <div className="text-xs text-[#64748B] mt-0.5">
            Method: <strong className="text-[#172033]">{payment.paymentMethod}</strong>
          </div>
        </div>

        {/* Receipt Breakdown Fields */}
        <div className="divide-y divide-[#E7ECF3] text-xs">
          <div className="py-2.5 flex justify-between items-center">
            <span className="text-[#64748B]">Receipt Reference:</span>
            <span className="font-mono font-bold text-[#172033]">{payment.reference}</span>
          </div>
          <div className="py-2.5 flex justify-between items-center">
            <span className="text-[#64748B]">Member Name:</span>
            <span className="font-semibold text-[#172033]">{payment.memberName}</span>
          </div>
          <div className="py-2.5 flex justify-between items-center">
            <span className="text-[#64748B]">Membership Plan:</span>
            <span className="font-medium text-[#172033]">{payment.planName}</span>
          </div>
          <div className="py-2.5 flex justify-between items-center">
            <span className="text-[#64748B]">Payment Date:</span>
            <span className="font-medium text-[#172033]">{formatDate(payment.paymentDate)}</span>
          </div>
          <div className="py-2.5 flex justify-between items-center">
            <span className="text-[#64748B]">Recorded On:</span>
            <span className="font-medium text-[#172033]">{formatDate(payment.createdAt)}</span>
          </div>
          {payment.notes && (
            <div className="py-2.5 flex flex-col gap-1">
              <span className="text-[#64748B]">Notes / Remarks:</span>
              <p className="text-[#172033] bg-slate-50 p-2.5 rounded-lg border border-[#E7ECF3] italic">
                {payment.notes}
              </p>
            </div>
          )}
        </div>

        <div className="pt-2 flex items-center justify-between gap-3 border-t border-[#E7ECF3]">
          <Button variant="outline" size="sm" onClick={handlePrint} leftIcon={<Printer className="w-4 h-4" />}>
            Print Receipt
          </Button>
          <Button variant="primary" size="sm" onClick={onClose}>
            Done
          </Button>
        </div>
      </div>
    </Modal>
  );
};
