import { toast } from 'react-toastify';

export function LeadsHeader() {
  const handleExport = () => {
    toast.info('Exportando relatório de leads em formato CSV...');
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
        <button
          onClick={handleExport}
          id="export-btn"
          className="flex items-center gap-space-xs bg-surface-container-low hover:bg-surface-container text-on-surface font-label-md px-space-md py-space-xs rounded-lg transition-colors cursor-pointer"
          aria-label="Exportar relatório de leads em CSV"
        >
          <span className="material-symbols-outlined text-[18px] text-secondary" aria-hidden="true">
            file_download
          </span>
          <span>Exportar</span>
        </button>
      </div>
    </div>
  );
}
