import { toast } from 'react-toastify';
import type { Lead } from '../../../types/auth';
import { exportLeadsToCsv } from '../../../services/leads/exportLeadsToCsv';

interface LeadsHeaderProps {
  leads: Lead[];
}

export function LeadsHeader({ leads }: LeadsHeaderProps) {
  const handleExport = () => {
    if (leads.length === 0) {
      toast.info('Nenhum lead para exportar');
      return;
    }

    try {
      exportLeadsToCsv(leads);
      toast.success(`${leads.length} ${leads.length === 1 ? 'lead exportado' : 'leads exportados'} com sucesso!`);
    } catch {
      toast.error('Não foi possível exportar os leads. Tente novamente.');
    }
  };

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-sm">
      <div className="flex flex-col">
        <h2 className="font-headline-lg text-on-surface tracking-tight">Leads</h2>
        <p className="font-body-sm text-secondary">
          Gerencie os leads recebidos pela concessionária Sol Nascente.
        </p>
      </div>

      <div className="flex items-center gap-space-xs">
        <span title={leads.length === 0 ? 'Nenhum lead para exportar' : undefined}>
          <button
            onClick={handleExport}
            disabled={leads.length === 0}
            id="export-btn"
            className="flex items-center gap-space-xs bg-surface-container-low hover:bg-surface-container text-on-surface font-label-md px-space-md py-space-xs rounded-lg transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Exportar relatório de leads em CSV"
          >
            <span className="material-symbols-outlined text-[18px] text-secondary" aria-hidden="true">
              file_download
            </span>
            <span>Exportar</span>
          </button>
        </span>
      </div>
    </div>
  );
}
