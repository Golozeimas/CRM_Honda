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

/**
 * Normalizes a motorcycle model name or code into a canonical model group.
 * Matches all variations across form inputs, display names, and Firestore values:
 * - CG 160: 'cg160', 'cg 160', 'titan', 'CG 160 Titan', 'Honda CG 160'
 * - Biz: 'biz', 'biz 125', 'Honda Biz 125', 'Honda Biz'
 * - Pop: 'pop', 'pop110', 'pop 110i', 'Honda Pop 110i'
 * - Bros: 'bros', 'nxr', 'nxr160', 'nxr 160 bros', 'Honda NXR 160 Bros'
 * - Twister: 'twister', 'cb300', 'cb 300f', 'cb 300f twister', 'Honda CB 300F Twister'
 * - PCX: 'pcx', 'honda pcx'
 * - Outro: 'outro', 'outro modelo'
 */
function normalizeModelKey(raw?: string | null): string {
  if (!raw) return '';
  const clean = raw.toLowerCase().replace(/[^a-z0-9]/g, '');
  if (!clean) return '';
  if (clean.includes('cg') || clean.includes('titan')) return 'cg160';
  if (clean.includes('biz')) return 'biz';
  if (clean.includes('pop')) return 'pop';
  if (clean.includes('bros') || clean.includes('nxr')) return 'bros';
  if (clean.includes('twister') || clean.includes('cb300')) return 'twister';
  if (clean.includes('pcx')) return 'pcx';
  if (clean.includes('outro')) return 'outro';
  return clean;
}

function matchesModelFilter(lead: Lead, filter: string): boolean {
  if (!filter || filter === 'ALL') return true;

  const target = filter.trim();
  const leadModel = (lead.model || '').trim();
  const leadDisplay = (lead.modelDisplay || '').trim();

  // Direct exact match
  if (leadModel === target || leadDisplay === target) return true;

  // Direct case-insensitive match
  const targetLower = target.toLowerCase();
  if (
    leadModel.toLowerCase() === targetLower ||
    leadDisplay.toLowerCase() === targetLower
  ) {
    return true;
  }

  // Canonical normalized group match
  const filterKey = normalizeModelKey(target);
  if (!filterKey) return false;

  const modelKey = normalizeModelKey(leadModel);
  const displayKey = normalizeModelKey(leadDisplay);

  return modelKey === filterKey || displayKey === filterKey;
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

      const matchesModel = matchesModelFilter(lead, modelFilter);

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
