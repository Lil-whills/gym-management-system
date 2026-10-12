import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { EmptyState } from '../../components/ui/EmptyState';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import { formatCurrency } from '../../lib/currency';
import { formatDate, isCurrentMonth } from '../../lib/dates';
import { PaymentReceiptModal } from './PaymentReceiptModal';
import {
  Search,
  Eye,
  Trash2,
  CircleDollarSign,
  Building,
  Smartphone,
  Banknote,
} from 'lucide-react';
import type { Payment } from '../../types';

export const PaymentsPage: React.FC = () => {
  const navigate = useNavigate();
  const { payments, deletePayment, stats } = useData();

  const [selectedReceipt, setSelectedReceipt] = useState<Payment | null>(null);
  const [paymentToDelete, setPaymentToDelete] = useState<Payment | null>(null);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [methodFilter, setMethodFilter] = useState('all');
  const [timeFilter, setTimeFilter] = useState<'all' | 'current_month'>('all');

  // Breakdown metrics
  const methodTotals = useMemo(() => {
    let cash = 0;
    let momo = 0;
    let bank = 0;

    payments
      .filter((p) => p.status === 'Completed')
      .forEach((p) => {
        if (p.paymentMethod === 'Cash') cash += p.amount;
        else if (p.paymentMethod === 'Mobile Money') momo += p.amount;
        else if (p.paymentMethod === 'Bank Transfer') bank += p.amount;
      });

    return { cash, momo, bank };
  }, [payments]);

  // Filtered payments list
  const filteredPayments = useMemo(() => {
    return payments
      .filter((payment) => {
        const query = searchQuery.toLowerCase().trim();
        const matchesQuery =
          !query ||
          payment.reference.toLowerCase().includes(query) ||
          payment.memberName.toLowerCase().includes(query) ||
          payment.planName.toLowerCase().includes(query) ||
          (payment.notes && payment.notes.toLowerCase().includes(query));

        if (!matchesQuery) return false;

        if (methodFilter !== 'all' && payment.paymentMethod !== methodFilter) {
          return false;
        }

        if (timeFilter === 'current_month' && !isCurrentMonth(payment.paymentDate)) {
          return false;
        }

        return true;
      })
      .sort((a, b) => new Date(b.paymentDate).getTime() - new Date(a.paymentDate).getTime());
  }, [payments, searchQuery, methodFilter, timeFilter]);

  const handleDeleteConfirm = () => {
    if (paymentToDelete) {
      deletePayment(paymentToDelete.id);
      setPaymentToDelete(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-[#172033] tracking-tight">
            Payments & Financial Ledger
          </h2>
          <p className="text-xs sm:text-sm text-[#64748B] mt-0.5">
            Dues collections, official receipts, and transaction history
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="blue" size="md">
            Auto-Recorded on Enrollment & Renewal
          </Badge>
        </div>
      </div>

      {/* Revenue Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4.5 bg-gradient-to-br from-slate-900 to-slate-800 text-white">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-300 font-medium">This Month</span>
            <div className="w-8 h-8 rounded-lg bg-blue-500/20 text-[#3B82F6] flex items-center justify-center">
              <CircleDollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold mt-2">
            {formatCurrency(stats.currentMonthRevenue)}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Dues collected this calendar month</p>
        </Card>

        <Card className="p-4.5">
          <div className="flex items-center justify-between">
            <span className="text-xs text-[#64748B] font-medium">Mobile Money</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <Smartphone className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-[#172033] mt-2">
            {formatCurrency(methodTotals.momo)}
          </div>
          <p className="text-[11px] text-[#64748B] mt-1">MTN MoMo, Telecel Cash</p>
        </Card>

        <Card className="p-4.5">
          <div className="flex items-center justify-between">
            <span className="text-xs text-[#64748B] font-medium">Cash Collected</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Banknote className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-[#172033] mt-2">
            {formatCurrency(methodTotals.cash)}
          </div>
          <p className="text-[11px] text-[#64748B] mt-1">Front desk cash receipts</p>
        </Card>

        <Card className="p-4.5">
          <div className="flex items-center justify-between">
            <span className="text-xs text-[#64748B] font-medium">Bank Transfers</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#3B82F6] flex items-center justify-center">
              <Building className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-[#172033] mt-2">
            {formatCurrency(methodTotals.bank)}
          </div>
          <p className="text-[11px] text-[#64748B] mt-1">Direct deposit & wire payments</p>
        </Card>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white p-4 rounded-xl border border-[#E7ECF3] grid grid-cols-1 sm:grid-cols-3 gap-3 shadow-xs">
        <Input
          placeholder="Search by receipt ref, member, or notes..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          prefixElement={<Search className="w-4 h-4 text-slate-400" />}
        />

        <Select
          value={methodFilter}
          onChange={(e) => setMethodFilter(e.target.value)}
        >
          <option value="all">All Payment Methods</option>
          <option value="Mobile Money">Mobile Money</option>
          <option value="Cash">Cash</option>
          <option value="Bank Transfer">Bank Transfer</option>
        </Select>

        <Select
          value={timeFilter}
          onChange={(e) => setTimeFilter(e.target.value as any)}
        >
          <option value="all">All Time Records</option>
          <option value="current_month">Current Month Only</option>
        </Select>
      </div>

      {/* Transactions Table Card */}
      <Card>
        {filteredPayments.length === 0 ? (
          <div className="p-8">
            <EmptyState
              title="No payments found"
              description="No transaction records match your search query or filters."
              actionLabel={searchQuery || methodFilter !== 'all' || timeFilter !== 'all' ? 'Clear Filters' : 'Register Member'}
              onAction={() => {
                if (searchQuery || methodFilter !== 'all' || timeFilter !== 'all') {
                  setSearchQuery('');
                  setMethodFilter('all');
                  setTimeFilter('all');
                } else {
                  navigate('/members/new');
                }
              }}
            />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-[#64748B] border-b border-[#E7ECF3] uppercase tracking-wider font-semibold">
                <tr>
                  <th className="py-3.5 px-5">Receipt Ref</th>
                  <th className="py-3.5 px-4">Member Name</th>
                  <th className="py-3.5 px-4">Package / Plan</th>
                  <th className="py-3.5 px-4">Amount</th>
                  <th className="py-3.5 px-4">Payment Method</th>
                  <th className="py-3.5 px-4">Date</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E7ECF3] text-[#172033]">
                {filteredPayments.map((payment) => (
                  <tr key={payment.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-5 font-mono font-bold text-[#3B82F6]">
                      {payment.reference}
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-[#172033]">
                      {payment.memberName}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-semibold text-[#172033] block">{payment.planName}</span>
                      {payment.expiryDate && (
                        <span className="text-[11px] text-[#3B82F6] font-medium block">
                          Valid until {formatDate(payment.expiryDate)}
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-[#172033]">
                      {formatCurrency(payment.amount, true)}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-medium bg-slate-100 text-[#172033] border border-[#E7ECF3]">
                        {payment.paymentMethod}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-medium text-[#64748B]">
                      {formatDate(payment.paymentDate)}
                    </td>
                    <td className="py-3.5 px-4">
                      <Badge variant="success" dot size="sm">
                        {payment.status}
                      </Badge>
                    </td>
                    <td className="py-3.5 px-5 text-right space-x-1.5">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedReceipt(payment)}
                        leftIcon={<Eye className="w-3.5 h-3.5" />}
                      >
                        Receipt
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setPaymentToDelete(payment)}
                        className="text-slate-400 hover:text-[#DC2626] hover:bg-red-50 p-1.5"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>


      <PaymentReceiptModal
        payment={selectedReceipt}
        isOpen={!!selectedReceipt}
        onClose={() => setSelectedReceipt(null)}
      />

      <ConfirmDialog
        isOpen={!!paymentToDelete}
        onClose={() => setPaymentToDelete(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Transaction Record"
        description={
          <div>
            <p className="mb-2">
              Are you sure you want to delete payment receipt <strong>{paymentToDelete?.reference}</strong> ({paymentToDelete?.memberName})?
            </p>
            <p className="text-xs text-red-600 bg-red-50 p-2.5 rounded-lg border border-red-200">
              This will subtract {formatCurrency(paymentToDelete?.amount)} from your recorded revenue totals.
            </p>
          </div>
        }
        confirmLabel="Delete Transaction"
        variant="danger"
      />
    </div>
  );
};
