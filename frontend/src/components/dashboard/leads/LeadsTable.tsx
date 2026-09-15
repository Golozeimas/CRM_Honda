import type { Lead } from '../../../types/auth';
import { LeadRow } from './LeadRow';

interface LeadsTableProps {
  leads: Lead[];
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
          {leads.length === 0 ? (
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
