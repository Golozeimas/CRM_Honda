import { useState } from 'react';
import { AppLayout } from '../components/layout/AppLayout';
import { DashboardHeader } from '../components/dashboard/DashboardHeader';
import { MetricGrid } from '../components/dashboard/MetricGrid';
import { LeadsSection } from '../components/dashboard/leads/LeadsSection';
import { LeadDetailsModal } from '../components/dashboard/leads/LeadDetailsModal';
import { LeadEditModal } from '../components/dashboard/leads/LeadEditModal';
import { LeadDeleteConfirmModal } from '../components/dashboard/leads/LeadDeleteConfirmModal';
import { useLeads } from '../hooks/useLeads';
import type { Lead } from '../types/auth';

export function DashboardPage() {
  const { leads, isLoading, error } = useLeads();
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [editingLead, setEditingLead] = useState<Lead | null>(null);
  const [deletingLead, setDeletingLead] = useState<Lead | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  const handleOpenDetails = (lead: Lead) => {
    setSelectedLead(lead);
    setIsDetailsModalOpen(true);
  };

  const handleCloseDetails = () => {
    setIsDetailsModalOpen(false);
    setSelectedLead(null);
  };

  const handleOpenEdit = (lead: Lead) => {
    setEditingLead(lead);
  };

  const handleCloseEdit = () => {
    setEditingLead(null);
  };

  const handleOpenDelete = (lead: Lead) => {
    setDeletingLead(lead);
  };

  const handleCloseDelete = () => {
    setDeletingLead(null);
  };

  return (
    <AppLayout>
      <div className="flex flex-col w-full gap-space-lg">
        <DashboardHeader />
        <MetricGrid leads={leads} isLoading={isLoading} />
        <LeadsSection
          leads={leads}
          isLoading={isLoading}
          error={error}
          onViewDetails={handleOpenDetails}
          onEditLead={handleOpenEdit}
          onDeleteLead={handleOpenDelete}
        />
        <LeadDetailsModal
          lead={selectedLead}
          isOpen={isDetailsModalOpen}
          onClose={handleCloseDetails}
          onEditLead={handleOpenEdit}
          onDeleteLead={handleOpenDelete}
        />
        <LeadEditModal
          lead={editingLead}
          isOpen={!!editingLead}
          onClose={handleCloseEdit}
        />
        <LeadDeleteConfirmModal
          lead={deletingLead}
          isOpen={!!deletingLead}
          onClose={handleCloseDelete}
        />
      </div>
    </AppLayout>
  );
}
