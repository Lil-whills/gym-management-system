import React, { useState, useMemo } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import {
  Search,
  UserPlus,
  RefreshCw,
  Trash2,
  Edit2,
  CreditCard,
  Eye,
  Phone,
  Mail,
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { EmptyState } from '../../components/ui/EmptyState';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import { formatDate, getMembershipStatus } from '../../lib/dates';
import { MemberRenewModal } from './MemberRenewModal';
import { MemberEditModal } from './MemberEditModal';
import { RecordPaymentModal } from '../payments/RecordPaymentModal';
import type { Member } from '../../types';

export const MembersListPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { members, plans, deleteMember } = useData();

  // Search and Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const statusFilter = searchParams.get('status') || 'all';
  const [planFilter, setPlanFilter] = useState('all');
  const [sortBy, setSortBy] = useState<'name' | 'expiry_asc' | 'expiry_desc' | 'joined_desc'>('expiry_asc');

  // Modals state
  const [memberToRenew, setMemberToRenew] = useState<Member | null>(null);
  const [memberToEdit, setMemberToEdit] = useState<Member | null>(null);
  const [memberToRecordPayment, setMemberToRecordPayment] = useState<Member | null>(null);
  const [memberToDelete, setMemberToDelete] = useState<Member | null>(null);

  // Status counts for tabs
  const statusCounts = useMemo(() => {
    let all = members.length;
    let active = 0;
    let expiring_soon = 0;
    let expired = 0;

    members.forEach((m) => {
      const { status } = getMembershipStatus(m.expiryDate);
      if (status === 'active') active++;
      else if (status === 'expiring_soon') expiring_soon++;
      else if (status === 'expired') expired++;
    });

    return { all, active, expiring_soon, expired };
  }, [members]);

  // Filter and Sort members
  const filteredMembers = useMemo(() => {
    return members
      .filter((member) => {
        // Text Search
        const query = searchQuery.toLowerCase().trim();
        const matchesQuery =
          !query ||
          member.fullName.toLowerCase().includes(query) ||
          member.phone.toLowerCase().includes(query) ||
          (member.email && member.email.toLowerCase().includes(query));

        if (!matchesQuery) return false;

        // Status Filter
        if (statusFilter !== 'all') {
          const { status } = getMembershipStatus(member.expiryDate);
          if (status !== statusFilter) return false;
        }

        // Plan Filter
        if (planFilter !== 'all') {
          if (member.planId !== planFilter) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'name') {
          return a.fullName.localeCompare(b.fullName);
        }
        if (sortBy === 'expiry_asc') {
          return new Date(a.expiryDate).getTime() - new Date(b.expiryDate).getTime();
        }
        if (sortBy === 'expiry_desc') {
          return new Date(b.expiryDate).getTime() - new Date(a.expiryDate).getTime();
        }
        if (sortBy === 'joined_desc') {
          return new Date(b.joinedDate || b.createdAt).getTime() - new Date(a.joinedDate || a.createdAt).getTime();
        }
        return 0;
      });
  }, [members, searchQuery, statusFilter, planFilter, sortBy]);

  const handleStatusTabChange = (newStatus: string) => {
    if (newStatus === 'all') {
      searchParams.delete('status');
      setSearchParams(searchParams);
    } else {
      setSearchParams({ ...Object.fromEntries(searchParams.entries()), status: newStatus });
    }
  };

  const handleConfirmDelete = () => {
    if (memberToDelete) {
      deleteMember(memberToDelete.id);
      setMemberToDelete(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-[#172033] tracking-tight">Member Directory</h2>
          <p className="text-xs sm:text-sm text-[#64748B] mt-0.5">
            Total of {members.length} registered gym members
          </p>
        </div>
        <Button
          variant="primary"
          leftIcon={<UserPlus className="w-4 h-4" />}
          onClick={() => navigate('/members/new')}
        >
          Register New Member
        </Button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-[#E7ECF3]">
        <button
          onClick={() => handleStatusTabChange('all')}
          className={`px-3.5 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-2 cursor-pointer ${
            statusFilter === 'all'
              ? 'bg-[#3B82F6] text-white shadow-xs'
              : 'text-[#64748B] hover:text-[#172033] hover:bg-slate-100'
          }`}
        >
          <span>All Members</span>
          <span
            className={`px-1.5 py-0.2 rounded-full text-[10px] ${
              statusFilter === 'all' ? 'bg-white/25 text-white' : 'bg-slate-200 text-slate-700'
            }`}
          >
            {statusCounts.all}
          </span>
        </button>

        <button
          onClick={() => handleStatusTabChange('active')}
          className={`px-3.5 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-2 cursor-pointer ${
            statusFilter === 'active'
              ? 'bg-[#16A34A] text-white shadow-xs'
              : 'text-[#64748B] hover:text-[#172033] hover:bg-slate-100'
          }`}
        >
          <span>Active</span>
          <span
            className={`px-1.5 py-0.2 rounded-full text-[10px] ${
              statusFilter === 'active' ? 'bg-white/25 text-white' : 'bg-green-100 text-green-800'
            }`}
          >
            {statusCounts.active}
          </span>
        </button>

        <button
          onClick={() => handleStatusTabChange('expiring_soon')}
          className={`px-3.5 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-2 cursor-pointer ${
            statusFilter === 'expiring_soon'
              ? 'bg-[#D97706] text-white shadow-xs'
              : 'text-[#64748B] hover:text-[#172033] hover:bg-slate-100'
          }`}
        >
          <span>Expiring Soon (≤ 7 days)</span>
          <span
            className={`px-1.5 py-0.2 rounded-full text-[10px] ${
              statusFilter === 'expiring_soon' ? 'bg-white/25 text-white' : 'bg-amber-100 text-amber-800'
            }`}
          >
            {statusCounts.expiring_soon}
          </span>
        </button>

        <button
          onClick={() => handleStatusTabChange('expired')}
          className={`px-3.5 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-2 cursor-pointer ${
            statusFilter === 'expired'
              ? 'bg-[#DC2626] text-white shadow-xs'
              : 'text-[#64748B] hover:text-[#172033] hover:bg-slate-100'
          }`}
        >
          <span>Expired</span>
          <span
            className={`px-1.5 py-0.2 rounded-full text-[10px] ${
              statusFilter === 'expired' ? 'bg-white/25 text-white' : 'bg-red-100 text-red-800'
            }`}
          >
            {statusCounts.expired}
          </span>
        </button>
      </div>

      {/* Search and Dropdown Filter Bar */}
      <div className="bg-white p-4 rounded-xl border border-[#E7ECF3] grid grid-cols-1 sm:grid-cols-3 gap-3 shadow-xs">
        <Input
          placeholder="Search by name, phone, or email..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          prefixElement={<Search className="w-4 h-4 text-slate-400" />}
        />

        <Select
          value={planFilter}
          onChange={(e) => setPlanFilter(e.target.value)}
        >
          <option value="all">All Plans</option>
          {plans.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </Select>

        <Select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as any)}
        >
          <option value="expiry_asc">Sort by: Expiry Date (Soonest first)</option>
          <option value="expiry_desc">Sort by: Expiry Date (Furthest first)</option>
          <option value="name">Sort by: Name (A – Z)</option>
          <option value="joined_desc">Sort by: Recently Registered</option>
        </Select>
      </div>

      {/* Members Table Card */}
      <Card>
        {filteredMembers.length === 0 ? (
          <div className="p-8">
            <EmptyState
              title="No members found"
              description={
                searchQuery || statusFilter !== 'all' || planFilter !== 'all'
                  ? 'No members match your current filters. Try resetting search criteria.'
                  : 'Start by registering your first gym member.'
              }
              actionLabel={
                searchQuery || statusFilter !== 'all' || planFilter !== 'all'
                  ? 'Clear Filters'
                  : 'Register Member'
              }
              onAction={() => {
                if (searchQuery || statusFilter !== 'all' || planFilter !== 'all') {
                  setSearchQuery('');
                  setPlanFilter('all');
                  handleStatusTabChange('all');
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
                  <th className="py-3.5 px-5">Member Name</th>
                  <th className="py-3.5 px-4">Contact Info</th>
                  <th className="py-3.5 px-4">Membership Plan</th>
                  <th className="py-3.5 px-4">Expiry Date</th>
                  <th className="py-3.5 px-4">Standing</th>
                  <th className="py-3.5 px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E7ECF3] text-[#172033]">
                {filteredMembers.map((member) => {
                  const statusInfo = getMembershipStatus(member.expiryDate);
                  const plan = plans.find((p) => p.id === member.planId);

                  return (
                    <tr key={member.id} className="hover:bg-slate-50/80 transition-colors">
                      {/* Name & Avatar */}
                      <td className="py-3.5 px-5">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-[#0F172A] text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-xs">
                            {member.fullName.slice(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <Link
                              to={`/members/${member.id}`}
                              className="font-bold text-sm text-[#172033] hover:text-[#3B82F6] transition-colors"
                            >
                              {member.fullName}
                            </Link>
                            <p className="text-[11px] text-[#64748B]">
                              Member ID: {member.id}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Contact */}
                      <td className="py-3.5 px-4">
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-1.5 text-[#172033] font-medium">
                            <Phone className="w-3.5 h-3.5 text-slate-400" />
                            <span>{member.phone}</span>
                          </div>
                          {member.email && (
                            <div className="flex items-center gap-1.5 text-[11px] text-[#64748B]">
                              <Mail className="w-3 h-3 text-slate-400" />
                              <span className="truncate max-w-[150px]">{member.email}</span>
                            </div>
                          )}
                        </div>
                      </td>

                      {/* Plan */}
                      <td className="py-3.5 px-4">
                        <span className="font-semibold text-[#172033]">{plan?.name || 'General Access'}</span>
                        <p className="text-[11px] text-[#64748B]">
                          Since {formatDate(member.startDate)}
                        </p>
                      </td>

                      {/* Expiry Date */}
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-[#172033]">
                          {formatDate(member.expiryDate)}
                        </div>
                        <div className="text-[11px] text-[#64748B]">
                          {statusInfo.daysRemaining >= 0
                            ? `${statusInfo.daysRemaining} days remaining`
                            : `Overdue by ${Math.abs(statusInfo.daysRemaining)} days`}
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4">
                        <Badge variant={statusInfo.badgeVariant} dot size="sm">
                          {statusInfo.label}
                        </Badge>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <Button
                            variant="subtle"
                            size="sm"
                            leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
                            onClick={() => setMemberToRenew(member)}
                            title="Renew membership"
                          >
                            Renew
                          </Button>

                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => navigate(`/members/${member.id}`)}
                            title="View member profile"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </Button>

                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setMemberToRecordPayment(member)}
                            title="Record payment"
                            className="text-[#16A34A] hover:bg-green-50"
                          >
                            <CreditCard className="w-3.5 h-3.5" />
                          </Button>

                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setMemberToEdit(member)}
                            title="Edit details"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </Button>

                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setMemberToDelete(member)}
                            title="Delete member"
                            className="text-slate-400 hover:text-[#DC2626] hover:bg-red-50"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Modals */}
      <MemberRenewModal
        member={memberToRenew}
        isOpen={!!memberToRenew}
        onClose={() => setMemberToRenew(null)}
      />

      <MemberEditModal
        member={memberToEdit}
        isOpen={!!memberToEdit}
        onClose={() => setMemberToEdit(null)}
      />

      <RecordPaymentModal
        preselectedMemberId={memberToRecordPayment?.id}
        isOpen={!!memberToRecordPayment}
        onClose={() => setMemberToRecordPayment(null)}
      />

      <ConfirmDialog
        isOpen={!!memberToDelete}
        onClose={() => setMemberToDelete(null)}
        onConfirm={handleConfirmDelete}
        title="Delete Member Record"
        description={
          <div>
            <p className="mb-2">
              Are you sure you want to delete <strong>{memberToDelete?.fullName}</strong>?
            </p>
            <p className="text-xs text-amber-700 bg-amber-50 p-2.5 rounded-lg border border-amber-200">
              Note: Historical payment receipts associated with this member will be preserved in your financial ledger for accounting integrity.
            </p>
          </div>
        }
        confirmLabel="Delete Member"
        variant="danger"
      />
    </div>
  );
};
