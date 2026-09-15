import { useMemo, useState } from 'react';
import type { Lead } from '../../../types/auth';
import { LEADS_DATA } from '../../../data/leads.data';
import { LeadsHeader } from './LeadsHeader';
import { LeadsToolbar } from './LeadsToolbar';
import { LeadsTable } from './LeadsTable';
import { Pagination } from './Pagination';

const PAGE_SIZE = 10;

// Total leads count for the static dataset (matches the HTML metric: 128)
const TOTAL_LEADS_COUNT = 128;

export function LeadsSection() {
  // Filter state
  const [search, setSearch]             = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [unitFilter, setUnitFilter]     = useState('ALL');
  const [modelFilter, setModelFilter]   = useState('ALL');

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

    return LEADS_DATA.filter((lead) => {
      // Search matches name OR WhatsApp
      const matchesSearch =
        q === '' ||
        lead.name.toLowerCase().includes(q) ||
        lead.whatsapp.includes(q);

      const matchesStatus =
        statusFilter === 'ALL' || lead.status === statusFilter;

      const matchesUnit =
        unitFilter === 'ALL' || lead.unit === unitFilter;

      const matchesModel =
        modelFilter === 'ALL' || lead.model === modelFilter;

      return matchesSearch && matchesStatus && matchesUnit && matchesModel;
    });
  }, [search, statusFilter, unitFilter, modelFilter]);

  // Total pages based on the FULL dataset count (simulates server-side total)
  // For this static dataset, filtered count drives pagination instead
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

  // Integration-point handlers (no workflow implemented)
  const handleViewDetails = (_lead: Lead) => {
    // TODO: open lead detail drawer/modal when implemented
  };
  const handleChangeStatus = (_lead: Lead) => {
    // TODO: open status change dialog when implemented
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
        activeActionLeadId={activeActionLeadId}
        onToggleAction={handleToggleAction}
        onCloseAction={handleCloseAction}
        onViewDetails={handleViewDetails}
        onChangeStatus={handleChangeStatus}
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
