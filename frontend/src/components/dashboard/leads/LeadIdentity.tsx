import type { LeadStatus } from '../../../types/auth';

interface LeadIdentityProps {
  initials: string;
  name: string;
  email: string;
  status: LeadStatus;
}

/** Deterministic avatar color based on lead status — matches HTML exactly */
const AVATAR_CLS: Record<LeadStatus, string> = {
  NOVO:       'bg-primary-fixed text-primary',
  EM_CONTATO: 'bg-secondary-fixed text-on-secondary-fixed',
  CONVERTIDO: 'bg-tertiary-fixed text-on-tertiary-fixed',
  PERDIDO:    'bg-surface-container-high text-secondary',
};

export function LeadIdentity({ initials, name, email, status }: LeadIdentityProps) {
  const avatarCls = AVATAR_CLS[status];

  return (
    <div className="flex items-center gap-space-sm">
      <div
        className={`w-9 h-9 rounded-full ${avatarCls} font-label-md font-bold flex items-center justify-center flex-shrink-0`}
        aria-hidden="true"
      >
        {initials}
      </div>
      <div className="flex flex-col min-w-0">
        <span className="font-label-lg text-on-surface font-semibold truncate">{name}</span>
        <span className="font-body-sm text-secondary truncate">{email}</span>
      </div>
    </div>
  );
}
