import { useState, useEffect, type FormEvent } from 'react';
import { toast } from 'react-toastify';
import type { Lead } from '../../../types/auth';
import { updateLead, type UpdateLeadInput } from '../../../services/leads/updateLead';

interface LeadEditModalProps {
  lead: Lead | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const formatPhoneDDD = (value: string): string => {
  const digits = value.replace(/\D/g, '').slice(0, 11);
  if (digits.length === 0) return '';
  if (digits.length <= 2) return `(${digits}`;
  if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  if (digits.length <= 10) return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7, 11)}`;
};

export function LeadEditModal({ lead, isOpen, onClose, onSuccess }: LeadEditModalProps) {
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

  return (
    <LeadEditDialog lead={lead} onClose={onClose} onSuccess={onSuccess} />
  );
}

interface LeadEditDialogProps {
  lead: Lead;
  onClose: () => void;
  onSuccess?: () => void;
}

function LeadEditDialog({ lead, onClose, onSuccess }: LeadEditDialogProps) {
  const [name, setName] = useState(lead.name || '');
  const [whatsapp, setWhatsapp] = useState(lead.whatsapp || '');
  const [email, setEmail] = useState(lead.email || '');
  const [model, setModel] = useState(lead.model || 'cg160');
  const [unit, setUnit] = useState<'TERESINA' | 'TIMON'>(lead.unit || 'TERESINA');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{ name?: string; whatsapp?: string; model?: string }>({});

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const newErrors: { name?: string; whatsapp?: string; model?: string } = {};

    if (!name.trim() || name.trim().length < 3) {
      newErrors.name = 'O nome deve ter no mínimo 3 caracteres.';
    }

    const digits = whatsapp.replace(/\D/g, '');
    if (digits.length < 10 || digits.length > 11) {
      newErrors.whatsapp = 'Digite um telefone válido com DDD (ex: (86) 99999-9999).';
    }

    if (!model) {
      newErrors.model = 'Selecione um modelo de interesse.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      const updateData: UpdateLeadInput = {
        name: name.trim(),
        whatsapp: whatsapp.trim(),
        email: email.trim(),
        model,
        unit,
      };

      await updateLead(lead.id, updateData);
      toast.success('Lead atualizado com sucesso!');
      onSuccess?.();
      onClose();
    } catch (err) {
      console.error('Erro ao atualizar lead:', err);
      toast.error('Não foi possível atualizar o lead. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget && !isSubmitting) {
          onClose();
        }
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="edit-modal-title"
    >
      <div className="relative w-full max-w-lg max-h-[90vh] bg-surface-container-lowest rounded-2xl shadow-2xl border border-surface-container-highest overflow-hidden flex flex-col">
        {/* Modal Header */}
        <div className="px-4 py-4 sm:px-6 sm:py-5 border-b border-surface-container-highest flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
              <span className="material-symbols-outlined text-[22px]">edit</span>
            </div>
            <div>
              <h2 id="edit-modal-title" className="font-headline-md text-on-surface font-bold leading-tight">
                Editar Dados do Lead
              </h2>
              <p className="font-body-sm text-secondary">
                Atualize as informações cadastrais do lead
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="w-9 h-9 rounded-xl hover:bg-surface-container-high flex items-center justify-center text-secondary hover:text-on-surface transition-colors cursor-pointer disabled:opacity-50"
            aria-label="Fechar modal"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} noValidate className="p-4 sm:p-6 overflow-y-auto flex flex-col gap-4">
          {/* Nome completo */}
          <div>
            <label className="block font-label-md text-on-surface mb-1 font-semibold" htmlFor="edit-name">
              Nome completo *
            </label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-2.5 text-secondary text-[20px]">
                person
              </span>
              <input
                id="edit-name"
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (errors.name) setErrors((prev) => ({ ...prev, name: undefined }));
                }}
                disabled={isSubmitting}
                className={`w-full h-10 pl-10 pr-3 rounded-lg bg-surface-container-low text-on-surface font-body-md focus:outline-none transition-all border ${
                  errors.name ? 'border-error focus:ring-2 focus:ring-error' : 'border-outline/20 focus:ring-2 focus:ring-primary'
                }`}
                placeholder="Nome do lead"
              />
            </div>
            {errors.name && (
              <span className="font-label-sm text-error mt-1 flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]">error</span>
                {errors.name}
              </span>
            )}
          </div>

          {/* WhatsApp & Email */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-label-md text-on-surface mb-1 font-semibold" htmlFor="edit-whatsapp">
                WhatsApp *
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-2.5 text-secondary text-[20px]">
                  phone_iphone
                </span>
                <input
                  id="edit-whatsapp"
                  type="tel"
                  value={whatsapp}
                  onChange={(e) => {
                    setWhatsapp(formatPhoneDDD(e.target.value));
                    if (errors.whatsapp) setErrors((prev) => ({ ...prev, whatsapp: undefined }));
                  }}
                  disabled={isSubmitting}
                  maxLength={15}
                  className={`w-full h-10 pl-10 pr-3 rounded-lg bg-surface-container-low text-on-surface font-body-md focus:outline-none transition-all border ${
                    errors.whatsapp ? 'border-error focus:ring-2 focus:ring-error' : 'border-outline/20 focus:ring-2 focus:ring-primary'
                  }`}
                  placeholder="(86) 99999-9999"
                />
              </div>
              {errors.whatsapp && (
                <span className="font-label-sm text-error mt-1 flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">error</span>
                  {errors.whatsapp}
                </span>
              )}
            </div>

            <div>
              <label className="block font-label-md text-on-surface mb-1 font-semibold" htmlFor="edit-email">
                E-mail (opcional)
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-2.5 text-secondary text-[20px]">
                  mail
                </span>
                <input
                  id="edit-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isSubmitting}
                  className="w-full h-10 pl-10 pr-3 rounded-lg bg-surface-container-low text-on-surface font-body-md focus:outline-none transition-all border border-outline/20 focus:ring-2 focus:ring-primary"
                  placeholder="exemplo@email.com"
                />
              </div>
            </div>
          </div>

          {/* Modelo e Unidade */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-label-md text-on-surface mb-1 font-semibold" htmlFor="edit-model">
                Modelo de interesse *
              </label>
              <div className="relative">
                <select
                  id="edit-model"
                  value={model}
                  onChange={(e) => {
                    setModel(e.target.value);
                    if (errors.model) setErrors((prev) => ({ ...prev, model: undefined }));
                  }}
                  disabled={isSubmitting}
                  className={`w-full h-10 px-3 pr-8 rounded-lg bg-surface-container-low text-on-surface font-body-md appearance-none focus:outline-none transition-all border cursor-pointer ${
                    errors.model ? 'border-error focus:ring-2 focus:ring-error' : 'border-outline/20 focus:ring-2 focus:ring-primary'
                  }`}
                >
                  <option value="cg160">Honda CG 160</option>
                  <option value="biz">Honda Biz 125</option>
                  <option value="pop110">Honda Pop 110i</option>
                  <option value="nxr160">Honda NXR 160 Bros</option>
                  <option value="cb300">Honda CB 300F</option>
                  <option value="pcx">Honda PCX</option>
                  <option value="outro">Outro modelo</option>
                </select>
                <span className="material-symbols-outlined absolute right-2.5 top-2.5 text-secondary pointer-events-none text-[20px]">
                  arrow_drop_down
                </span>
              </div>
              {errors.model && (
                <span className="font-label-sm text-error mt-1 flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">error</span>
                  {errors.model}
                </span>
              )}
            </div>

            <div>
              <label className="block font-label-md text-on-surface mb-1 font-semibold" htmlFor="edit-unit">
                Unidade *
              </label>
              <div className="relative">
                <select
                  id="edit-unit"
                  value={unit}
                  onChange={(e) => setUnit(e.target.value as 'TERESINA' | 'TIMON')}
                  disabled={isSubmitting}
                  className="w-full h-10 px-3 pr-8 rounded-lg bg-surface-container-low text-on-surface font-body-md appearance-none focus:outline-none transition-all border border-outline/20 focus:ring-2 focus:ring-primary cursor-pointer"
                >
                  <option value="TERESINA">Sol Nascente Teresina - PI</option>
                  <option value="TIMON">Sol Nascente Timon - MA</option>
                </select>
                <span className="material-symbols-outlined absolute right-2.5 top-2.5 text-secondary pointer-events-none text-[20px]">
                  arrow_drop_down
                </span>
              </div>
            </div>
          </div>

          {/* Modal Actions */}
          <div className="pt-3 flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-2 border-t border-surface-container-highest">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="w-full sm:w-auto justify-center px-4 py-2 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface font-label-md font-semibold transition-colors cursor-pointer disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:w-auto justify-center px-5 py-2 rounded-xl bg-primary hover:bg-[#cc0000] text-on-primary font-label-md font-semibold shadow-sm flex items-center gap-2 transition-all cursor-pointer disabled:opacity-60"
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" fill="currentColor"></path>
                  </svg>
                  <span>Salvando...</span>
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-[18px]">check</span>
                  <span>Salvar alterações</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
