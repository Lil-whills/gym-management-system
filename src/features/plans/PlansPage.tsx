import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { Card, CardFooter } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { EmptyState } from '../../components/ui/EmptyState';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import { PlanFormModal } from './PlanFormModal';
import { formatCurrency } from '../../lib/currency';
import {
  Plus,
  Edit2,
  Trash2,
  Users,
  Power,
  Clock,
  Check,
} from 'lucide-react';
import type { MembershipPlan } from '../../types';

export const PlansPage: React.FC = () => {
  const { plans, getActiveMembersCountForPlan, togglePlanActive, deletePlan } = useData();

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [planToEdit, setPlanToEdit] = useState<MembershipPlan | null>(null);
  const [planToDelete, setPlanToDelete] = useState<MembershipPlan | null>(null);
  const [deleteErrorMsg, setDeleteErrorMsg] = useState<string | null>(null);

  const handleDeleteAttempt = (plan: MembershipPlan) => {
    const assignedCount = getActiveMembersCountForPlan(plan.id);
    if (assignedCount > 0) {
      setDeleteErrorMsg(
        `This plan cannot be deleted because ${assignedCount} active member(s) are currently subscribed to it. To stop new signups without affecting existing members, simply toggle this plan to Inactive.`
      );
      setPlanToDelete(plan);
    } else {
      setDeleteErrorMsg(null);
      setPlanToDelete(plan);
    }
  };

  const handleConfirmDelete = () => {
    if (planToDelete) {
      const result = deletePlan(planToDelete.id);
      if (result.success) {
        setPlanToDelete(null);
        setDeleteErrorMsg(null);
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-[#172033] tracking-tight">
            Membership Plans & Pricing
          </h2>
          <p className="text-xs sm:text-sm text-[#64748B] mt-0.5">
            Configure subscription tiers, durations, and pricing in Ghanaian Cedis (GH₵)
          </p>
        </div>
        <Button
          variant="primary"
          leftIcon={<Plus className="w-4 h-4" />}
          onClick={() => setIsCreateOpen(true)}
        >
          Create New Plan
        </Button>
      </div>

      {/* Plans Grid */}
      {plans.length === 0 ? (
        <EmptyState
          title="No membership plans found"
          description="Create your first membership plan to start enrolling members."
          actionLabel="Create Plan"
          onAction={() => setIsCreateOpen(true)}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {plans.map((plan) => {
            const memberCount = getActiveMembersCountForPlan(plan.id);

            return (
              <Card
                key={plan.id}
                className={`flex flex-col justify-between transition-all ${
                  !plan.isActive ? 'opacity-75 bg-slate-50/50' : 'hover:shadow-md'
                }`}
              >
                <div>
                  {/* Plan Top Header */}
                  <div className="p-5 border-b border-[#E7ECF3]">
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <Badge variant={plan.isActive ? 'success' : 'neutral'} dot size="sm">
                        {plan.isActive ? 'Active Plan' : 'Inactive / Archived'}
                      </Badge>

                      <div className="flex items-center gap-1.5 text-xs text-[#64748B] bg-slate-50 px-2 py-0.5 rounded-md border border-[#E7ECF3]">
                        <Users className="w-3.5 h-3.5 text-[#3B82F6]" />
                        <span className="font-semibold text-[#172033]">{memberCount}</span>
                        <span>members</span>
                      </div>
                    </div>

                    <h3 className="text-lg font-bold text-[#172033] tracking-tight">{plan.name}</h3>
                    <p className="text-xs text-[#64748B] mt-1 min-h-[32px]">{plan.description}</p>
                  </div>

                  {/* Pricing Box */}
                  <div className="px-5 py-4 bg-slate-50/70 border-b border-[#E7ECF3] flex items-baseline justify-between">
                    <div>
                      <span className="text-2xl font-extrabold text-[#172033] tracking-tight">
                        {formatCurrency(plan.price)}
                      </span>
                      <span className="text-xs text-[#64748B] ml-1">
                        / {plan.durationMonths} {plan.durationMonths === 1 ? 'month' : 'months'}
                      </span>
                    </div>

                    <div className="text-[11px] font-medium text-slate-500 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      <span>
                        {plan.durationMonths === 1
                          ? 'Monthly'
                          : plan.durationMonths === 3
                          ? 'Quarterly'
                          : plan.durationMonths === 12
                          ? 'Annual'
                          : `${plan.durationMonths} Mo`}
                      </span>
                    </div>
                  </div>

                  {/* Features List */}
                  <div className="p-5 space-y-2.5">
                    <span className="text-[11px] font-semibold text-[#64748B] uppercase tracking-wider block mb-2">
                      Included Package Benefits:
                    </span>
                    <ul className="space-y-2">
                      {plan.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-xs text-[#172033]">
                          <Check className="w-4 h-4 text-[#16A34A] shrink-0 mt-0.5" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Plan Footer Actions */}
                <CardFooter className="bg-slate-50/80">
                  <button
                    type="button"
                    onClick={() => togglePlanActive(plan.id)}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#64748B] hover:text-[#172033] transition-colors cursor-pointer"
                  >
                    <Power
                      className={`w-3.5 h-3.5 ${
                        plan.isActive ? 'text-[#16A34A]' : 'text-slate-400'
                      }`}
                    />
                    <span>{plan.isActive ? 'Deactivate' : 'Activate'}</span>
                  </button>

                  <div className="flex items-center gap-1.5">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPlanToEdit(plan)}
                      leftIcon={<Edit2 className="w-3.5 h-3.5" />}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteAttempt(plan)}
                      className="text-slate-400 hover:text-[#DC2626] hover:bg-red-50 p-1.5"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      )}

      {/* Modals */}
      <PlanFormModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
      />

      <PlanFormModal
        planToEdit={planToEdit}
        isOpen={!!planToEdit}
        onClose={() => setPlanToEdit(null)}
      />

      {/* Confirm or Notice Dialog for Plan Deletion */}
      <ConfirmDialog
        isOpen={!!planToDelete}
        onClose={() => {
          setPlanToDelete(null);
          setDeleteErrorMsg(null);
        }}
        onConfirm={() => {
          if (deleteErrorMsg) {
            // User requested to deactivate instead
            if (planToDelete) {
              togglePlanActive(planToDelete.id);
            }
            setPlanToDelete(null);
            setDeleteErrorMsg(null);
          } else {
            handleConfirmDelete();
          }
        }}
        title={deleteErrorMsg ? 'Cannot Delete Active Plan' : 'Delete Membership Plan'}
        description={
          <div>
            {deleteErrorMsg ? (
              <div className="space-y-3 text-left">
                <p className="text-xs text-[#172033] leading-relaxed">{deleteErrorMsg}</p>
                <p className="text-xs text-blue-700 bg-blue-50 p-2.5 rounded-lg border border-blue-200">
                  Would you like to <strong>Deactivate this plan</strong> instead so current members remain unaffected?
                </p>
              </div>
            ) : (
              <p>
                Are you sure you want to permanently delete <strong>{planToDelete?.name}</strong>?
              </p>
            )}
          </div>
        }
        confirmLabel={deleteErrorMsg ? 'Deactivate Plan Instead' : 'Delete Plan'}
        variant={deleteErrorMsg ? 'warning' : 'danger'}
      />
    </div>
  );
};
