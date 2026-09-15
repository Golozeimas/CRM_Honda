import { useMemo, useState } from 'react';
import type { Lead, LeadStatus } from '../../../types/auth';
import { updateLeadStatus } from '../../../services/leads/updateLeadStatus';
import { LeadsHeader } from './LeadsHeader';
import { LeadsToolbar } from './LeadsToolbar';
import { LeadsTable } from './LeadsTable';
import { Pagination } from './Pagination';

const PAGE_SIZE = 10;

interface LeadsSectionProps {
  leads?: Lead[];
  isLoading?: boolean;
  error?: string | null;
  onViewDetails?: (lead: Lead) => void;
}

export function LeadsSection({
  leads = [],
  isLoading = false,
  error = null,
  onViewDetails,
}: LeadsSectionProps) {
  // Filter state
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [unitFilter, setUnitFilter] = useState('ALL');
  const [modelFilter, setModelFilter] = useState('ALL');

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);

  // Action menu state — only one open at a time
  const [activeActionLeadId, setActiveActionLeadId] = useState<string | null>(null);

  // ------------------------------------------------------------------
  // Derived: filtered collection
  // Pipeline: raw leads → search → status → unit → model → paginated
  // ------------------------------------------------------------------
  const filteredLeads = useMemo<Lead[]>(() => {
    const q = search.toLowerCase().trim();

    return leads.filter((lead) => {
      // Search matches name OR WhatsApp
      const leadName = lead.name || '';
      const leadWhatsapp = lead.whatsapp || '';
      
      const matchesSearch =
        q === '' ||
        leadName.toLowerCase().includes(q) ||
        leadWhatsapp.includes(q);

      const matchesStatus =
        statusFilter === 'ALL' || lead.status === statusFilter;

      const matchesUnit =
        unitFilter === 'ALL' || lead.unit === unitFilter;

      const matchesModel =
        modelFilter === 'ALL' || lead.model === modelFilter;

      return matchesSearch && matchesStatus && matchesUnit && matchesModel;
    });
  }, [leads, search, statusFilter, unitFilter, modelFilter]);

  const TOTAL_LEADS_COUNT = leads.length;
  const totalPages = Math.max(1, Math.ceil(TOTAL_LEADS_COUNT / PAGE_SIZE));

  // When filters/search change, reset to page 1
  const handleSearchChange = (value: string) => {
    setSearch(value);
    setCurrentPage(1);
  };
  const handleStatusChange = (value: string) => {
    setStatusFilter(value);
    setCurrentPage(1);
  };
  const handleUnitChange = (value: string) => {
    setUnitFilter(value);
    setCurrentPage(1);
  };
  const handleModelChange = (value: string) => {
    setModelFilter(value);
    setCurrentPage(1);
  };

  // Action menu handlers
  const handleToggleAction = (leadId: string) => {
    setActiveActionLeadId((prev) => (prev === leadId ? null : leadId));
  };
  const handleCloseAction = () => setActiveActionLeadId(null);

  const handleStatusChangeAction = async (leadId: string, newStatus: LeadStatus) => {
    await updateLeadStatus(leadId, newStatus);
  };

  return (
    <div className="bg-surface-container-lowest rounded-xl shadow-sm p-space-md md:p-space-lg flex flex-col gap-space-md">
      <LeadsHeader />

      <LeadsToolbar
        search={search}
        statusFilter={statusFilter}
        unitFilter={unitFilter}
        modelFilter={modelFilter}
        onSearchChange={handleSearchChange}
        onStatusChange={handleStatusChange}
        onUnitChange={handleUnitChange}
        onModelChange={handleModelChange}
      />

      <LeadsTable
        leads={filteredLeads}
        isLoading={isLoading}
        error={error}
        activeActionLeadId={activeActionLeadId}
        onToggleAction={handleToggleAction}
        onCloseAction={handleCloseAction}
        onViewDetails={onViewDetails}
        onStatusChange={handleStatusChangeAction}
      />

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={TOTAL_LEADS_COUNT}
        pageSize={PAGE_SIZE}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}
