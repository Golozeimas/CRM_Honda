import { useMemo, useState, useEffect } from 'react';
import { onSnapshot, query, orderBy } from 'firebase/firestore';
import type { Lead, LeadStatus } from '../../../types/auth';
import { leadsCollection } from '../../../services/firebase/firestore';
import { LeadsHeader } from './LeadsHeader';
import { LeadsToolbar } from './LeadsToolbar';
import { LeadsTable } from './LeadsTable';
import { Pagination } from './Pagination';

const PAGE_SIZE = 10;

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0 || !parts[0]) return '?';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function normalizeStatus(rawStatus?: unknown): LeadStatus {
  if (typeof rawStatus === 'string') {
    const upper = rawStatus.toUpperCase().trim();
    if (upper === 'NOVO' || upper === 'EM_CONTATO' || upper === 'CONVERTIDO' || upper === 'PERDIDO') {
      return upper;
    }
  }
  return 'NOVO';
}

export function LeadsSection() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // Filter state
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [unitFilter, setUnitFilter] = useState('ALL');
  const [modelFilter, setModelFilter] = useState('ALL');

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);

  // Action menu state — only one open at a time
  const [activeActionLeadId, setActiveActionLeadId] = useState<string | null>(null);

  useEffect(() => {
    const q = query(leadsCollection as any, orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const fetchedLeads: Lead[] = snapshot.docs.map((doc) => {
          const data: any = doc.data() || {};
          let createdAtStr = '';
          if (data.createdAt) {
            try {
              const date = typeof data.createdAt.toDate === 'function' 
                ? data.createdAt.toDate() 
                : new Date(data.createdAt);
              if (!isNaN(date.getTime())) {
                createdAtStr = new Intl.DateTimeFormat('pt-BR', {
                  dateStyle: 'short',
                  timeStyle: 'short',
                }).format(date);
              }
            } catch {
              createdAtStr = String(data.createdAt || '');
            }
          }

          const name = String(data.name || 'Sem nome');
          const initials = typeof data.initials === 'string' && data.initials ? data.initials : getInitials(name);
          const status = normalizeStatus(data.status);
          const unit = (data.unit && String(data.unit).toUpperCase() === 'TIMON') ? 'TIMON' : 'TERESINA';
          const whatsapp = String(data.whatsapp || data.phone || '');
          const rawDigits = whatsapp.replace(/\D/g, '');
          const whatsappUrl = data.whatsappUrl || (rawDigits ? `https://wa.me/55${rawDigits}` : '#');
          const model = String(data.model || 'outro');
          const modelDisplay = String(data.modelDisplay || data.model || 'Modelo não especificado');
          const email = String(data.email || '');

          return {
            id: doc.id,
            name,
            initials,
            email,
            whatsapp,
            whatsappUrl,
            model,
            modelDisplay,
            unit,
            status,
            createdAt: createdAtStr,
          };
        });

        setLeads(fetchedLeads);
        setIsLoading(false);
        setError(null);
      },
      (err) => {
        console.error('Error fetching leads:', err);
        setError('Não foi possível carregar os leads.');
        setIsLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

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
        isLoading={isLoading}
        error={error}
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
