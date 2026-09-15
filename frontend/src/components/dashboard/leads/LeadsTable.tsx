import type { Lead } from '../../../types/auth';
import { LeadRow } from './LeadRow';

interface LeadsTableProps {
  leads: Lead[];
  isLoading?: boolean;
  error?: string | null;
  activeActionLeadId: string | null;
  onToggleAction: (leadId: string) => void;
  onCloseAction: () => void;
  onViewDetails?: (lead: Lead) => void;
  onChangeStatus?: (lead: Lead) => void;
}

const TABLE_HEADERS = [
  { label: 'Lead',                 className: 'py-space-sm px-space-md rounded-l-lg' },
  { label: 'WhatsApp',             className: 'py-space-sm px-space-sm' },
  { label: 'Modelo de Interesse',  className: 'py-space-sm px-space-sm' },
  { label: 'Unidade',              className: 'py-space-sm px-space-sm' },
  { label: 'Status',               className: 'py-space-sm px-space-sm' },
  { label: 'Criado em',            className: 'py-space-sm px-space-sm' },
  { label: 'Ações',                className: 'py-space-sm px-space-sm text-right rounded-r-lg' },
] as const;

export function LeadsTable({
  leads,
  isLoading,
  error,
  activeActionLeadId,
  onToggleAction,
  onCloseAction,
  onViewDetails,
  onChangeStatus,
}: LeadsTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left">
        <thead>
          <tr className="bg-surface-container-low text-secondary font-label-sm uppercase tracking-wider rounded-lg">
            {TABLE_HEADERS.map(({ label, className }) => (
              <th key={label} className={className} scope="col">
                {label}
              </th>
            ))}
          </tr>
        </thead>

        <tbody className="font-body-md text-on-surface">
          {isLoading ? (
            <tr>
              <td colSpan={7} className="py-space-xl text-center font-body-md text-secondary">
                <div className="flex flex-col items-center justify-center gap-2">
                  <svg className="animate-spin h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" fill="currentColor"></path>
                  </svg>
                  <span>Carregando leads...</span>
                </div>
              </td>
            </tr>
          ) : error ? (
            <tr>
              <td colSpan={7} className="py-space-xl text-center font-body-md text-error">
                <div className="flex flex-col items-center justify-center gap-1">
                  <span className="material-symbols-outlined text-[24px]">error</span>
                  <span>{error}</span>
                </div>
              </td>
            </tr>
          ) : leads.length === 0 ? (
            <tr>
              <td colSpan={7} className="py-space-xl text-center font-body-md text-secondary">
                Nenhum lead encontrado para os filtros aplicados.
              </td>
            </tr>
          ) : (
            leads.map((lead) => (
              <LeadRow
                key={lead.id}
                lead={lead}
                isActionOpen={activeActionLeadId === lead.id}
                onToggleAction={() => onToggleAction(lead.id)}
                onCloseAction={onCloseAction}
                onViewDetails={onViewDetails}
                onChangeStatus={onChangeStatus}
              />
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
