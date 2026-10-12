import React from 'react';
import { Modal } from '../../components/ui/Modal';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { useData } from '../../context/DataContext';
import { formatDate } from '../../lib/dates';
import { formatCurrency } from '../../lib/currency';
import { Printer, Dumbbell, ShieldCheck, Check } from 'lucide-react';
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
  const { gymProfile, members } = useData();

  if (!payment) return null;

  const member = members.find((m) => m.id === payment.memberId);
  const expiryDateEvidence = payment.expiryDate || member?.expiryDate || payment.paymentDate;

  const handlePrint = () => {
    // Isolate printable receipt via a dedicated off-screen iframe
    // This prevents Chromium from repeating the fixed modal on multiple background pages
    const iframe = document.createElement('iframe');
    iframe.setAttribute(
      'style',
      'position:fixed;right:0;bottom:0;width:0;height:0;border:0;visibility:hidden;'
    );
    document.body.appendChild(iframe);

    const doc = iframe.contentWindow?.document;
    if (!doc) {
      window.print();
      return;
    }

    const receiptHtml = `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="utf-8" />
          <title>Receipt - ${payment.reference}</title>
          <style>
            @page {
              size: portrait;
              margin: 10mm;
            }
            *, *::before, *::after {
              box-sizing: border-box;
              margin: 0;
              padding: 0;
            }
            body {
              font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
              color: #0F172A;
              background: #FFFFFF;
              padding: 16px;
              max-width: 480px;
              margin: 0 auto;
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
            }
            .receipt-card {
              border: 1px dashed #94A3B8;
              border-radius: 12px;
              padding: 24px;
              page-break-inside: avoid;
              break-inside: avoid;
            }
            .receipt-header {
              text-align: center;
              border-bottom: 1px dashed #CBD5E1;
              padding-bottom: 16px;
              margin-bottom: 16px;
            }
            .gym-name {
              font-size: 20px;
              font-weight: 800;
              color: #0F172A;
              letter-spacing: 0.5px;
              text-transform: uppercase;
            }
            .gym-sub {
              font-size: 11px;
              color: #64748B;
              margin-top: 3px;
            }
            .badge-paid {
              display: inline-block;
              font-size: 10px;
              font-weight: 700;
              letter-spacing: 0.8px;
              text-transform: uppercase;
              padding: 4px 12px;
              background: #DCFCE7;
              color: #16A34A;
              border: 1px solid #BBF7D0;
              border-radius: 9999px;
              margin-top: 10px;
            }
            .amount-container {
              text-align: center;
              background: #F8FAFC;
              border: 1px solid #E2E8F0;
              border-radius: 10px;
              padding: 14px;
              margin-bottom: 16px;
            }
            .amount-title {
              font-size: 10px;
              font-weight: 700;
              text-transform: uppercase;
              letter-spacing: 0.8px;
              color: #2563EB;
            }
            .amount-value {
              font-size: 28px;
              font-weight: 900;
              color: #0F172A;
              margin-top: 4px;
            }
            .amount-sub {
              font-size: 11px;
              color: #475569;
              margin-top: 3px;
            }
            .meta-table {
              width: 100%;
              border-collapse: collapse;
              margin-bottom: 16px;
              font-size: 12px;
            }
            .meta-table tr {
              border-bottom: 1px solid #F1F5F9;
            }
            .meta-table td {
              padding: 8px 0;
            }
            .meta-table td.label {
              color: #64748B;
              width: 42%;
            }
            .meta-table td.value {
              text-align: right;
              font-weight: 600;
              color: #0F172A;
            }
            .meta-table td.value.ref {
              font-family: monospace;
              color: #2563EB;
              font-size: 13px;
            }
            .notes-section {
              background: #F8FAFC;
              border: 1px solid #E2E8F0;
              border-radius: 8px;
              padding: 10px 12px;
              font-size: 11px;
              color: #334155;
              font-style: italic;
              margin-bottom: 16px;
            }
            .receipt-footer {
              text-align: center;
              border-top: 1px dashed #CBD5E1;
              padding-top: 14px;
              font-size: 10px;
              color: #64748B;
            }
            .receipt-footer .signature-line {
              margin-top: 8px;
              font-weight: 600;
              color: #0F172A;
            }
            .receipt-footer .system-stamp {
              margin-top: 4px;
              font-size: 9px;
              color: #94A3B8;
            }
          </style>
        </head>
        <body>
          <div class="receipt-card">
            <div class="receipt-header">
              <div class="gym-name">${gymProfile.name}</div>
              <div class="gym-sub">${gymProfile.location || 'Official Fitness Facility'} &bull; ${gymProfile.phone || 'Front Desk'}</div>
              <div class="badge-paid">&#10003; Official Payment Receipt &bull; ${payment.status}</div>
            </div>

            <div class="amount-container">
              <div class="amount-title">Total Amount Paid</div>
              <div class="amount-value">${formatCurrency(payment.amount, true)}</div>
              <div class="amount-sub">Payment Method: <strong>${payment.paymentMethod}</strong></div>
            </div>

            <table class="meta-table">
              <tr>
                <td class="label">Receipt Reference:</td>
                <td class="value ref">${payment.reference}</td>
              </tr>
              <tr>
                <td class="label">Member Name:</td>
                <td class="value">${payment.memberName}</td>
              </tr>
              <tr>
                <td class="label">Membership Plan / Term:</td>
                <td class="value">${payment.planName}</td>
              </tr>
              <tr>
                <td class="label">Access Valid Until (Expiry):</td>
                <td class="value" style="color: #2563EB; font-weight: 700;">${formatDate(expiryDateEvidence)}</td>
              </tr>
              <tr>
                <td class="label">Payment Date:</td>
                <td class="value">${formatDate(payment.paymentDate)}</td>
              </tr>
              <tr>
                <td class="label">Status:</td>
                <td class="value" style="color: #16A34A;">${payment.status}</td>
              </tr>
            </table>

            ${
              payment.notes
                ? `
              <div style="font-size: 10px; color: #64748B; margin-bottom: 4px; font-weight: 600; text-transform: uppercase;">Remarks / Payment Notes:</div>
              <div class="notes-section">${payment.notes}</div>
            `
                : ''
            }

            <div class="receipt-footer">
              <div>Thank you for choosing ${gymProfile.name}!</div>
              <div class="signature-line">Authorized Front Desk &bull; LiftDesk Verification</div>
              <div class="system-stamp">System Generated Receipt &bull; 1 Copy Single-Page Standard</div>
            </div>
          </div>
        </body>
      </html>
    `;

    doc.open();
    doc.write(receiptHtml);
    doc.close();

    // Trigger print after iframe renders
    setTimeout(() => {
      iframe.contentWindow?.focus();
      iframe.contentWindow?.print();
      setTimeout(() => {
        if (document.body.contains(iframe)) {
          document.body.removeChild(iframe);
        }
      }, 1500);
    }, 200);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md" title="Transaction Receipt">
      <div className="space-y-6">
        {/* Printable Receipt Container */}
        <div
          id="printable-receipt"
          className="p-5 bg-white rounded-xl border border-[#E7ECF3] shadow-xs space-y-5"
        >
          {/* Receipt Header */}
          <div className="flex items-center justify-between pb-4 border-b border-dashed border-[#CBD5E1]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#0F172A] text-white flex items-center justify-center font-bold text-sm shadow-xs">
                <Dumbbell className="w-5 h-5 text-[#3B82F6]" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-[#172033] uppercase tracking-wide">
                  {gymProfile.name}
                </h4>
                <p className="text-[11px] text-[#64748B]">
                  {gymProfile.location || 'Official Fitness Facility'} &bull; {gymProfile.phone || 'Front Desk'}
                </p>
              </div>
            </div>
            <Badge variant="success" dot size="sm">
              {payment.status}
            </Badge>
          </div>

          {/* Amount Box */}
          <div className="text-center py-4 bg-gradient-to-b from-blue-50/70 to-blue-50/30 rounded-xl border border-blue-100">
            <span className="text-[10px] font-bold text-[#3B82F6] uppercase tracking-wider">
              Total Amount Paid
            </span>
            <div className="text-3xl font-black text-[#172033] mt-1">
              {formatCurrency(payment.amount, true)}
            </div>
            <div className="text-xs text-[#64748B] mt-0.5">
              Payment Method: <strong className="text-[#172033]">{payment.paymentMethod}</strong>
            </div>
          </div>

          {/* Breakdown Fields */}
          <div className="divide-y divide-[#E7ECF3] text-xs">
            <div className="py-2.5 flex justify-between items-center">
              <span className="text-[#64748B]">Receipt Reference:</span>
              <span className="font-mono font-bold text-[#3B82F6] text-sm">{payment.reference}</span>
            </div>
            <div className="py-2.5 flex justify-between items-center">
              <span className="text-[#64748B]">Member Name:</span>
              <span className="font-semibold text-[#172033]">{payment.memberName}</span>
            </div>
            <div className="py-2.5 flex justify-between items-center">
              <span className="text-[#64748B]">Membership Plan / Term:</span>
              <span className="font-medium text-[#172033]">{payment.planName}</span>
            </div>
            <div className="py-2.5 flex justify-between items-center bg-blue-50/60 px-2 rounded-lg -mx-2">
              <span className="text-[#172033] font-semibold">Access Valid Until (Expiry):</span>
              <span className="font-bold text-[#2563EB]">{formatDate(expiryDateEvidence)}</span>
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

          {/* Verification Stamp */}
          <div className="pt-3 border-t border-dashed border-[#CBD5E1] flex items-center justify-between text-[11px] text-[#64748B]">
            <div className="flex items-center gap-1.5 text-emerald-600 font-medium">
              <ShieldCheck className="w-4 h-4" />
              <span>Verified LiftDesk Record</span>
            </div>
            <span className="font-mono text-[10px]">1 Copy &bull; Single-Page</span>
          </div>
        </div>

        {/* Action Buttons (Excluded from print) */}
        <div className="no-print pt-2 flex items-center justify-between gap-3 border-t border-[#E7ECF3]">
          <Button
            variant="outline"
            size="sm"
            onClick={handlePrint}
            leftIcon={<Printer className="w-4 h-4" />}
          >
            Print Receipt (1 Copy)
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={onClose}
            leftIcon={<Check className="w-4 h-4" />}
          >
            Done
          </Button>
        </div>
      </div>
    </Modal>
  );
};
