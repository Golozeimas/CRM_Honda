import { useState } from 'react';
import { AppLayout } from '../components/layout/AppLayout';
import { DashboardHeader } from '../components/dashboard/DashboardHeader';
import { MetricGrid } from '../components/dashboard/MetricGrid';
import { LeadsSection } from '../components/dashboard/leads/LeadsSection';
import { LeadDetailsModal } from '../components/dashboard/leads/LeadDetailsModal';
import { useLeads } from '../hooks/useLeads';
import type { Lead } from '../types/auth';

export function DashboardPage() {
  const { leads, isLoading, error } = useLeads();
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  const handleOpenDetails = (lead: Lead) => {
    setSelectedLead(lead);
    setIsDetailsModalOpen(true);
  };

  const handleCloseDetails = () => {
    setIsDetailsModalOpen(false);
    setSelectedLead(null);
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
        />
        <LeadDetailsModal
          lead={selectedLead}
          isOpen={isDetailsModalOpen}
          onClose={handleCloseDetails}
        />
      </div>
    </AppLayout>
  );
}
