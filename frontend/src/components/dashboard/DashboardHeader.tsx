interface DashboardHeaderProps {
  onNewLead?: () => void;
}

export function DashboardHeader({ onNewLead }: DashboardHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-space-md">
      {/* Page title */}
      <div className="flex flex-col">
        <h1 className="font-headline-xl text-on-surface tracking-tight">Dashboard</h1>
        <p className="font-body-md text-secondary mt-space-xs">
          Acompanhe e gerencie seus leads em tempo real.
        </p>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-space-sm">
        {/* Showroom Online indicator */}
        <div className="flex items-center gap-space-xs bg-surface-container-lowest px-space-md py-space-sm rounded-xl shadow-sm">
          <span className="w-2.5 h-2.5 rounded-full bg-tertiary animate-pulse" aria-hidden="true" />
          <span className="font-label-sm text-secondary font-semibold uppercase tracking-wider">
            Showroom Online
          </span>
        </div>

        {/* New lead action */}
        <button
          onClick={onNewLead}
          className="flex items-center gap-space-xs bg-primary-container text-on-primary font-label-md px-space-md py-space-sm rounded-xl shadow-sm hover:bg-primary transition-all cursor-pointer"
          aria-label="Adicionar novo lead"
        >
          <span className="material-symbols-outlined text-[18px]" aria-hidden="true">add</span>
          <span>Novo Lead</span>
        </button>
      </div>
    </div>
  );
}
