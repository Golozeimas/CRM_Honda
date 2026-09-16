import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import type { Lead } from '../../../types/auth';
import { deleteLead } from '../../../services/leads/deleteLead';

interface LeadDeleteConfirmModalProps {
  lead: Lead | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function LeadDeleteConfirmModal({
  lead,
  isOpen,
  onClose,
  onSuccess,
}: LeadDeleteConfirmModalProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  // Close on Escape key press
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !isDeleting) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, isDeleting]);

  if (!isOpen || !lead) return null;

  const handleConfirmDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteLead(lead.id);
      toast.success(`Lead "${lead.name}" excluído com sucesso.`);
      onSuccess?.();
      onClose();
    } catch (err) {
      console.error('Erro ao excluir lead:', err);
      toast.error('Não foi possível excluir o lead. Tente novamente.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget && !isDeleting) {
          onClose();
        }
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="delete-modal-title"
    >
      <div className="relative w-full max-w-md bg-surface-container-lowest rounded-2xl shadow-2xl border border-surface-container-highest overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
        <div className="p-6 flex flex-col gap-4">
          {/* Header with warning icon */}
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-error-container text-error flex items-center justify-center flex-shrink-0">
              <span className="material-symbols-outlined text-[28px]">delete_forever</span>
            </div>

            <div className="flex flex-col">
              <h3 id="delete-modal-title" className="font-headline-sm text-on-surface font-bold leading-snug">
                Excluir Lead
              </h3>
              <p className="font-body-sm text-secondary mt-1">
                Tem certeza que deseja excluir o cadastro de{' '}
                <strong className="text-on-surface font-semibold">{lead.name}</strong>?
              </p>
            </div>
          </div>

          {/* Lead info recap */}
          <div className="p-3.5 rounded-xl bg-surface-container-low border border-surface-container-highest flex flex-col gap-1.5 text-body-sm">
            <div className="flex justify-between">
              <span className="text-secondary">Modelo:</span>
              <span className="font-semibold text-on-surface">{lead.modelDisplay}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-secondary">WhatsApp:</span>
              <span className="text-on-surface">{lead.whatsapp}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-secondary">Unidade:</span>
              <span className="text-on-surface capitalize">
                {lead.unit === 'TERESINA' ? 'Teresina' : 'Timon'}
              </span>
            </div>
          </div>

          <p className="font-label-sm text-error flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[16px]">warning</span>
            <span>Esta operação é definitiva e não poderá ser desfeita.</span>
          </p>

          {/* Action buttons */}
          <div className="pt-2 flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              disabled={isDeleting}
              className="w-full sm:w-auto justify-center px-4 py-2 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface font-label-md font-semibold transition-colors cursor-pointer disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleConfirmDelete}
              disabled={isDeleting}
              className="w-full sm:w-auto justify-center px-4 py-2 rounded-xl bg-error hover:bg-[#b3261e] text-on-error font-label-md font-semibold shadow-sm flex items-center gap-2 transition-all cursor-pointer disabled:opacity-60"
            >
              {isDeleting ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" fill="currentColor"></path>
                  </svg>
                  <span>Excluindo...</span>
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-[18px]">delete</span>
                  <span>Sim, excluir lead</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
