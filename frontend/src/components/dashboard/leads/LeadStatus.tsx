import { useState, useRef, useEffect } from 'react';
import { toast } from 'react-toastify';
import type { LeadStatus } from '../../../types/auth';
import { updateLeadStatus } from '../../../services/leads/updateLeadStatus';

interface LeadStatusProps {
  status: LeadStatus;
  leadId?: string;
  isOpen?: boolean;
  onToggleOpen?: (isOpen: boolean) => void;
  onStatusChange?: (leadId: string, newStatus: LeadStatus) => Promise<void>;
  disabled?: boolean;
}

interface StatusConfig {
  label: string;
  badgeCls: string;
  dotCls: string;
}

const STATUS_CONFIG: Record<LeadStatus, StatusConfig> = {
  NOVO: {
    label: 'Novo',
    badgeCls: 'bg-primary-fixed/50 text-primary hover:bg-primary-fixed/80',
    dotCls: 'bg-primary',
  },
  EM_CONTATO: {
    label: 'Em contato',
    badgeCls: 'bg-secondary-fixed text-on-secondary-fixed hover:bg-secondary-fixed/80',
    dotCls: 'bg-secondary',
  },
  CONVERTIDO: {
    label: 'Convertido',
    badgeCls: 'bg-tertiary-fixed/50 text-tertiary hover:bg-tertiary-fixed/80',
    dotCls: 'bg-tertiary',
  },
  PERDIDO: {
    label: 'Perdido',
    badgeCls: 'bg-surface-container-high text-secondary hover:bg-surface-container-highest',
    dotCls: 'bg-secondary',
  },
};

const DEFAULT_CONFIG: StatusConfig = {
  label: 'Novo',
  badgeCls: 'bg-primary-fixed/50 text-primary hover:bg-primary-fixed/80',
  dotCls: 'bg-primary',
};

const ALL_STATUSES: LeadStatus[] = ['NOVO', 'EM_CONTATO', 'CONVERTIDO', 'PERDIDO'];

export function LeadStatus({
  status,
  leadId,
  isOpen: controlledIsOpen,
  onToggleOpen,
  onStatusChange,
  disabled = false,
}: LeadStatusProps) {
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const isControlled = controlledIsOpen !== undefined;
  const isOpen = isControlled ? controlledIsOpen : internalIsOpen;

  const setOpen = (val: boolean) => {
    if (isControlled) {
      onToggleOpen?.(val);
    } else {
      setInternalIsOpen(val);
    }
  };

  const config = (status && STATUS_CONFIG[status]) || DEFAULT_CONFIG;
  const { label, badgeCls, dotCls } = config;

  // Handle outside click to close dropdown
  useEffect(() => {
    if (!isOpen) return;

    const handleOutsideClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        if (isControlled) {
          onToggleOpen?.(false);
        } else {
          setInternalIsOpen(false);
        }
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [isOpen, isControlled, onToggleOpen]);

  const handleSelectStatus = async (newStatus: LeadStatus) => {
    if (!leadId || newStatus === status || isUpdating) {
      setOpen(false);
      return;
    }

    setIsUpdating(true);

    try {
      if (onStatusChange) {
        await onStatusChange(leadId, newStatus);
      } else {
        await updateLeadStatus(leadId, newStatus);
      }
      toast.success(`Status alterado para "${STATUS_CONFIG[newStatus].label}".`);
      setOpen(false);
    } catch (err) {
      console.error('Falha ao atualizar status:', err);
      toast.error('Não foi possível alterar o status do lead.');
    } finally {
      setIsUpdating(false);
    }
  };

  // If leadId is not provided, render static badge
  if (!leadId) {
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

  return (
    <div ref={containerRef} className="relative inline-block text-left">
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          if (!disabled && !isUpdating) {
            setOpen(!isOpen);
          }
        }}
        disabled={disabled || isUpdating}
        className={`inline-flex items-center gap-1.5 px-space-sm py-1 rounded-full font-label-sm font-semibold transition-all cursor-pointer select-none ${badgeCls} ${
          isUpdating ? 'opacity-70 cursor-wait' : ''
        }`}
        aria-label={`Alterar status de ${label}`}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        {isUpdating ? (
          <svg className="animate-spin h-3 w-3 text-current" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
        ) : (
          <span className={`w-1.5 h-1.5 rounded-full ${dotCls}`} aria-hidden="true" />
        )}
        <span>{label}</span>
        <span className="material-symbols-outlined text-[14px] leading-none opacity-60" aria-hidden="true">
          arrow_drop_down
        </span>
      </button>

      {isOpen && (
        <div
          role="listbox"
          className="absolute left-0 top-full mt-1 w-40 bg-surface-container-lowest rounded-xl shadow-xl border border-surface-container-highest p-1 z-30 flex flex-col gap-0.5 animate-in fade-in zoom-in-95 duration-100"
        >
          {ALL_STATUSES.map((s) => {
            const itemConfig = STATUS_CONFIG[s] || DEFAULT_CONFIG;
            const isSelected = s === status;
            return (
              <button
                key={s}
                type="button"
                role="option"
                aria-selected={isSelected}
                disabled={isUpdating}
                onClick={(e) => {
                  e.stopPropagation();
                  handleSelectStatus(s);
                }}
                className={`w-full text-left px-2.5 py-1.5 rounded-lg font-label-sm font-semibold flex items-center gap-2 transition-colors cursor-pointer ${
                  isSelected
                    ? 'bg-surface-container text-on-surface'
                    : 'text-secondary hover:bg-surface-container-low hover:text-on-surface'
                }`}
              >
                <span className={`w-2 h-2 rounded-full ${itemConfig.dotCls}`} aria-hidden="true" />
                <span>{itemConfig.label}</span>
                {isSelected && (
                  <span className="material-symbols-outlined text-[14px] ml-auto text-primary" aria-hidden="true">
                    check
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
