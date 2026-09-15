import type { LeadStatus } from '../../../types/auth';

interface LeadStatusProps {
  status: LeadStatus;
}

interface StatusConfig {
  label: string;
  badgeCls: string;
  dotCls: string;
}

const STATUS_CONFIG: Record<LeadStatus, StatusConfig> = {
  NOVO: {
    label: 'Novo',
    badgeCls: 'bg-primary-fixed/50 text-primary',
    dotCls: 'bg-primary',
  },
  EM_CONTATO: {
    label: 'Em contato',
    badgeCls: 'bg-secondary-fixed text-on-secondary-fixed',
    dotCls: 'bg-secondary',
  },
  CONVERTIDO: {
    label: 'Convertido',
    badgeCls: 'bg-tertiary-fixed/50 text-tertiary',
    dotCls: 'bg-tertiary',
  },
  PERDIDO: {
    label: 'Perdido',
    badgeCls: 'bg-surface-container-high text-secondary',
    dotCls: 'bg-secondary',
  },
};

const DEFAULT_CONFIG: StatusConfig = {
  label: 'Novo',
  badgeCls: 'bg-primary-fixed/50 text-primary',
  dotCls: 'bg-primary',
};

export function LeadStatus({ status }: LeadStatusProps) {
  const config = (status && STATUS_CONFIG[status]) || DEFAULT_CONFIG;
  const { label, badgeCls, dotCls } = config;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-space-sm py-1 rounded-full font-label-sm font-semibold ${badgeCls}`}
      aria-label={`Status: ${label}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${dotCls}`} aria-hidden="true" />
      {label}
    </span>
  );
}
