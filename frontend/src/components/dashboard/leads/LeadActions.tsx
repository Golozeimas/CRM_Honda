import { useEffect, useRef } from 'react';
import { toast } from 'react-toastify';
import type { Lead } from '../../../types/auth';

interface LeadActionsProps {
  lead: Lead;
  isOpen: boolean;
  onToggle: () => void;
  onClose: () => void;
  onViewDetails?: (lead: Lead) => void;
  onChangeStatus?: (lead: Lead) => void;
}

export function LeadActions({
  lead,
  isOpen,
  onToggle,
  onClose,
  onViewDetails,
  onChangeStatus,
}: LeadActionsProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Close when clicking outside this component
  useEffect(() => {
    if (!isOpen) return;

    const handleOutsideClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [isOpen, onClose]);

  const handleCopyWhatsApp = async () => {
    try {
      await navigator.clipboard.writeText(lead.whatsapp);
      toast.success(`Número copiado: ${lead.whatsapp}`);
    } catch {
      toast.error('Não foi possível copiar o número.');
    }
    onClose();
  };

  const handleViewDetails = () => {
    onViewDetails?.(lead);
    onClose();
  };

  const handleChangeStatus = () => {
    onChangeStatus?.(lead);
    onClose();
  };

  return (
    <div ref={containerRef} className="relative inline-block text-right">
      <button
        onClick={(e) => {
          e.stopPropagation();
          onToggle();
        }}
        className="w-8 h-8 rounded-lg hover:bg-surface-container flex items-center justify-center text-secondary transition-colors cursor-pointer"
        aria-label={`Ações para ${lead.name}`}
        aria-expanded={isOpen}
        aria-haspopup="menu"
      >
        <span className="material-symbols-outlined text-[18px]" aria-hidden="true">more_vert</span>
      </button>

      {isOpen && (
        <div
          role="menu"
          className="absolute right-0 top-10 w-44 bg-surface-container-lowest rounded-xl shadow-lg p-space-xs z-30 flex flex-col"
        >
          <button
            role="menuitem"
            onClick={handleViewDetails}
            className="w-full text-left px-space-sm py-space-xs hover:bg-surface-container-low rounded-lg font-label-sm text-on-surface flex items-center gap-space-xs cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px] text-secondary" aria-hidden="true">visibility</span>
            Ver detalhes
          </button>

          <button
            role="menuitem"
            onClick={handleChangeStatus}
            className="w-full text-left px-space-sm py-space-xs hover:bg-surface-container-low rounded-lg font-label-sm text-on-surface flex items-center gap-space-xs cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px] text-secondary" aria-hidden="true">sync_alt</span>
            Alterar status
          </button>

          <button
            role="menuitem"
            onClick={handleCopyWhatsApp}
            className="w-full text-left px-space-sm py-space-xs hover:bg-surface-container-low rounded-lg font-label-sm text-on-surface flex items-center gap-space-xs cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px] text-secondary" aria-hidden="true">content_copy</span>
            Copiar WhatsApp
          </button>
        </div>
      )}
    </div>
  );
}
