import { useEffect } from 'react';
import type { Lead } from '../../../types/auth';
import { LeadStatus } from './LeadStatus';

interface LeadDetailsModalProps {
  lead: Lead | null;
  isOpen: boolean;
  onClose: () => void;
  onEditLead?: (lead: Lead) => void;
  onDeleteLead?: (lead: Lead) => void;
}

export function LeadDetailsModal({
  lead,
  isOpen,
  onClose,
  onEditLead,
  onDeleteLead,
}: LeadDetailsModalProps) {
  // Close on Escape key press
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !lead) return null;

  const handleEdit = () => {
    onClose();
    onEditLead?.(lead);
  };

  const handleDelete = () => {
    onClose();
    onDeleteLead?.(lead);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div className="relative w-full max-w-lg bg-surface-container-lowest rounded-2xl shadow-2xl border border-surface-container-highest overflow-hidden flex flex-col">
        {/* Modal Header */}
        <div className="px-6 py-5 border-b border-surface-container-highest flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
              <span className="material-symbols-outlined text-[22px]">badge</span>
            </div>
            <div>
              <h2 id="modal-title" className="font-headline-md text-on-surface font-bold leading-tight">
                Detalhes do Lead
              </h2>
              <p className="font-body-sm text-secondary">
                Informações completas do lead cadastrado
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl hover:bg-surface-container-high flex items-center justify-center text-secondary hover:text-on-surface transition-colors cursor-pointer"
            aria-label="Fechar modal"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 flex flex-col gap-5">
          {/* Identity card */}
          <div className="flex items-center justify-between p-4 rounded-xl bg-surface-container-low">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-12 h-12 rounded-full bg-primary-fixed text-primary font-headline-md font-bold flex items-center justify-center flex-shrink-0">
                {lead.initials}
              </div>
              <div className="flex flex-col min-w-0">
                <span className="font-headline-sm text-on-surface font-bold truncate">
                  {lead.name}
                </span>
                <span className="font-body-sm text-secondary truncate">
                  {lead.email || 'Email não informado'}
                </span>
              </div>
            </div>

            <div className="flex-shrink-0">
              <LeadStatus status={lead.status} leadId={lead.id} />
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* WhatsApp */}
            <div className="flex flex-col gap-1 p-3.5 rounded-xl border border-surface-container-highest bg-surface-container-lowest">
              <span className="font-label-sm text-secondary uppercase font-semibold">
                WhatsApp
              </span>
              {lead.whatsapp ? (
                <a
                  href={lead.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-label-md text-tertiary hover:underline flex items-center gap-1.5 font-medium"
                >
                  <span className="material-symbols-outlined text-[18px]">chat</span>
                  <span>{lead.whatsapp}</span>
                </a>
              ) : (
                <span className="font-body-md text-secondary">Não informado</span>
              )}
            </div>

            {/* Unidade */}
            <div className="flex flex-col gap-1 p-3.5 rounded-xl border border-surface-container-highest bg-surface-container-lowest">
              <span className="font-label-sm text-secondary uppercase font-semibold">
                Unidade
              </span>
              <span className="font-label-md text-on-surface font-medium flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[18px] text-secondary">storefront</span>
                {lead.unit === 'TERESINA' ? 'Teresina' : 'Timon'}
              </span>
            </div>

            {/* Modelo de Interesse */}
            <div className="flex flex-col gap-1 p-3.5 rounded-xl border border-surface-container-highest bg-surface-container-lowest">
              <span className="font-label-sm text-secondary uppercase font-semibold">
                Modelo de Interesse
              </span>
              <span className="font-label-md text-on-surface font-medium flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[18px] text-secondary">two_wheeler</span>
                {lead.modelDisplay}
              </span>
            </div>

            {/* Data de Criação */}
            <div className="flex flex-col gap-1 p-3.5 rounded-xl border border-surface-container-highest bg-surface-container-lowest">
              <span className="font-label-sm text-secondary uppercase font-semibold">
                Cadastrado em
              </span>
              <span className="font-label-md text-on-surface font-medium flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[18px] text-secondary">calendar_today</span>
                {lead.createdAt || 'Data desconhecida'}
              </span>
            </div>
          </div>

          {/* Document ID */}
          <div className="flex items-center justify-between px-3 py-2 rounded-lg bg-surface-container-low text-[11px] text-secondary font-mono">
            <span>ID Firestore:</span>
            <span className="truncate max-w-[240px]">{lead.id}</span>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-surface-container-low border-t border-surface-container-highest flex items-center justify-between">
          <button
            type="button"
            onClick={handleDelete}
            className="px-4 py-2 rounded-xl text-error hover:bg-error-container/40 font-label-md font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">delete</span>
            <span>Excluir lead</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleEdit}
              className="px-4 py-2 rounded-xl bg-primary hover:bg-[#cc0000] text-on-primary font-label-md font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">edit</span>
              <span>Editar dados</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-surface-container-highest hover:bg-surface-container text-on-surface font-label-md font-semibold transition-colors cursor-pointer"
            >
              Fechar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
