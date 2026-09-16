import { useState, forwardRef, useImperativeHandle } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { createLead } from '../../services/leads/createLead';

export type FormState = 'normal' | 'loading' | 'success' | 'error';

export interface LeadFormData {
  name: string;
  phone: string;
  model: string;
  unit: string;
}

export interface LeadCaptureFormRef {
  setFormState: (state: FormState) => void;
  setModel: (model: string) => void;
  setUnit: (unit: string) => void;
  focusName: () => void;
}

export interface LeadCaptureFormProps {}

const modelLabels: Record<string, string> = {
  cg160: 'Honda CG 160',
  biz: 'Honda Biz',
  pop110: 'Honda Pop 110i',
  nxr160: 'Honda NXR 160 Bros',
  pcx: 'Honda PCX',
  cb300: 'Honda CB 300F',
  outro: 'Outro modelo'
};

const unitLabels: Record<string, string> = {
  teresina: 'Sol Nascente Teresina - PI',
  timon: 'Sol Nascente Timon - MA'
};

const formatPhoneDDD = (value: string): string => {
  const digits = value.replace(/\D/g, '').slice(0, 11);
  if (digits.length === 0) return '';
  if (digits.length <= 2) return `(${digits}`;
  if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  if (digits.length <= 10) return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7, 11)}`;
};

export const LeadCaptureForm = forwardRef<LeadCaptureFormRef, LeadCaptureFormProps>((_props, ref) => {
  const [formState, setFormState] = useState<FormState>('normal');
  const [submittedData, setSubmittedData] = useState<LeadFormData | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    setFocus,
    reset,
    formState: { errors }
  } = useForm<LeadFormData>({
    defaultValues: {
      name: '',
      phone: '',
      model: '',
      unit: 'teresina'
    },
    mode: 'onBlur'
  });

  useImperativeHandle(ref, () => ({
    setFormState,
    setModel: (modelValue: string) => {
      setValue('model', modelValue, { shouldValidate: true });
    },
    setUnit: (unitValue: string) => {
      setValue('unit', unitValue, { shouldValidate: true });
    },
    focusName: () => {
      setFocus('name');
    }
  }));

  const onSubmit = async (data: LeadFormData) => {
    setSubmittedData(data);
    setFormState('loading');

    try {
      await createLead(data);
      setFormState('success');
      toast.success('Proposta solicitada com sucesso! Nossa equipe entrará em contato.');
    } catch (err) {
      console.error('Error creating lead:', err);
      setFormState('error');
      toast.error('Falha no envio da proposta. Por favor, tente novamente.');
    }
  };

  const onError = () => {
    toast.error('Preencha todos os campos obrigatórios corretamente.');
  };

  return (
    <div className="flex flex-col gap-space-md">
      {/* Card Principal de Conversão */}
      <div className="bg-surface-container-lowest rounded-xl shadow-xl p-4 sm:p-space-lg relative overflow-hidden transition-all duration-300">
        {/* Borda Vermelha de Destaque Honda */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-primary"></div>

        {/* Cabeçalho do Card */}
        <div className="flex items-center justify-between pb-space-sm mb-space-md">
          <div>
            <span className="text-primary font-label-sm text-label-sm font-bold tracking-wider uppercase">Atendimento Digital</span>
            <h2 className="font-headline-lg text-headline-lg text-on-surface">Solicitar Proposta</h2>
          </div>
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
            <span className="material-symbols-outlined text-[22px]">bolt</span>
          </div>
        </div>

        {/* ===================== 1. ESTADO NORMAL (FORMULÁRIO ATIVO) ===================== */}
        {formState === 'normal' && (
          <form onSubmit={handleSubmit(onSubmit, onError)} noValidate className="space-y-space-md animate-in fade-in">
            {/* Campo Nome */}
            <div>
              <label className="block font-label-lg text-label-lg text-on-surface mb-1.5 font-semibold" htmlFor="lead-name">
                Nome completo
              </label>
              <div className="relative">
                <span className={`material-symbols-outlined absolute left-3 top-2.5 text-[20px] ${errors.name ? 'text-error' : 'text-secondary'}`}>
                  person
                </span>
                <input
                  {...register('name', {
                    required: 'Nome completo é obrigatório',
                    minLength: {
                      value: 3,
                      message: 'O nome deve ter no mínimo 3 caracteres'
                    }
                  })}
                  className={`w-full h-10 pl-10 pr-3 rounded-lg bg-surface-container-lowest text-on-surface font-body-md text-body-md placeholder:text-secondary/60 focus:outline-none transition-all shadow-sm border ${
                    errors.name
                      ? 'border-error focus:ring-2 focus:ring-error'
                      : 'border-outline/20 focus:ring-2 focus:ring-primary focus:border-transparent'
                  }`}
                  id="lead-name"
                  placeholder="Digite seu nome completo"
                  type="text"
                />
              </div>
              {errors.name && (
                <span className="font-label-sm text-label-sm text-error mt-1 flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">error</span>
                  {errors.name.message}
                </span>
              )}
            </div>

            {/* Campo WhatsApp */}
            <div>
              <label className="block font-label-lg text-label-lg text-on-surface mb-1.5 font-semibold" htmlFor="lead-phone">
                WhatsApp
              </label>
              <div className="relative">
                <span className={`material-symbols-outlined absolute left-3 top-2.5 text-[20px] ${errors.phone ? 'text-error' : 'text-secondary'}`}>
                  phone_iphone
                </span>
                <input
                  {...register('phone', {
                    required: 'Número de WhatsApp é obrigatório',
                    validate: (val) => {
                      const digits = (val || '').replace(/\D/g, '');
                      if (digits.length < 10 || digits.length > 11) {
                        return 'Digite o DDD e o número completo (ex: (86) 99999-9999)';
                      }
                      return true;
                    },
                    onChange: (e) => {
                      e.target.value = formatPhoneDDD(e.target.value);
                    }
                  })}
                  className={`w-full h-10 pl-10 pr-3 rounded-lg bg-surface-container-lowest text-on-surface font-body-md text-body-md placeholder:text-secondary/60 focus:outline-none transition-all shadow-sm border ${
                    errors.phone
                      ? 'border-error focus:ring-2 focus:ring-error'
                      : 'border-outline/20 focus:ring-2 focus:ring-primary focus:border-transparent'
                  }`}
                  id="lead-phone"
                  placeholder="(86) 99999-9999"
                  type="tel"
                  maxLength={15}
                />
              </div>
              {errors.phone && (
                <span className="font-label-sm text-label-sm text-error mt-1 flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">error</span>
                  {errors.phone.message}
                </span>
              )}
            </div>

            {/* Grade Modelo e Unidade */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-sm">
              <div>
                <label className="block font-label-lg text-label-lg text-on-surface mb-1.5 font-semibold" htmlFor="lead-model">
                  Modelo de interesse
                </label>
                <div className="relative">
                  <select
                    {...register('model', {
                      required: 'Selecione um modelo'
                    })}
                    className={`w-full h-10 px-3 pr-8 rounded-lg bg-surface-container-lowest text-on-surface font-body-md text-body-md focus:outline-none transition-all shadow-sm appearance-none cursor-pointer border ${
                      errors.model
                        ? 'border-error focus:ring-2 focus:ring-error'
                        : 'border-outline/20 focus:ring-2 focus:ring-primary focus:border-transparent'
                    }`}
                    id="lead-model"
                  >
                    <option value="">Selecione o modelo</option>
                    <option value="cg160">Honda CG 160</option>
                    <option value="biz">Honda Biz</option>
                    <option value="pop110">Honda Pop 110i</option>
                    <option value="nxr160">Honda NXR 160 Bros</option>
                    <option value="pcx">Honda PCX</option>
                    <option value="cb300">Honda CB 300F</option>
                    <option value="outro">Outro modelo</option>
                  </select>
                  <span className="material-symbols-outlined absolute right-2.5 top-2.5 text-secondary pointer-events-none text-[20px]">
                    arrow_drop_down
                  </span>
                </div>
                {errors.model && (
                  <span className="font-label-sm text-label-sm text-error mt-1 flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px]">error</span>
                    {errors.model.message}
                  </span>
                )}
              </div>

              <div>
                <label className="block font-label-lg text-label-lg text-on-surface mb-1.5 font-semibold" htmlFor="lead-unit">
                  Unidade
                </label>
                <div className="relative">
                  <select
                    {...register('unit', {
                      required: 'Selecione a concessionária'
                    })}
                    className={`w-full h-10 px-3 pr-8 rounded-lg bg-surface-container-lowest text-on-surface font-body-md text-body-md focus:outline-none transition-all shadow-sm appearance-none cursor-pointer border ${
                      errors.unit
                        ? 'border-error focus:ring-2 focus:ring-error'
                        : 'border-outline/20 focus:ring-2 focus:ring-primary focus:border-transparent'
                    }`}
                    id="lead-unit"
                  >
                    <option value="teresina">Teresina - PI</option>
                    <option value="timon">Timon - MA</option>
                  </select>
                  <span className="material-symbols-outlined absolute right-2.5 top-2.5 text-secondary pointer-events-none text-[20px]">
                    store
                  </span>
                </div>
                {errors.unit && (
                  <span className="font-label-sm text-label-sm text-error mt-1 flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px]">error</span>
                    {errors.unit.message}
                  </span>
                )}
              </div>
            </div>

            {/* Botão de Envio */}
            <div className="pt-2">
              <button
                className="w-full h-11 bg-primary hover:bg-[#cc0000] active:bg-[#b30024] text-on-primary font-headline-md text-headline-md rounded-xl shadow-md flex items-center justify-center gap-2 transition-all group cursor-pointer"
                type="submit"
              >
                <span>Quero receber atendimento</span>
                <span className="material-symbols-outlined text-[20px] group-hover:translate-x-1 transition-transform">
                  arrow_forward
                </span>
              </button>
            </div>

            <div className="flex items-center justify-center gap-1.5 text-secondary pt-1">
              <span className="material-symbols-outlined text-[16px] text-tertiary">lock</span>
              <span className="font-label-sm text-label-sm">Seus dados estão protegidos pela LGPD</span>
            </div>
          </form>
        )}

        {/* ===================== 2. ESTADO DE LOADING ===================== */}
        {formState === 'loading' && (
          <div className="space-y-space-md animate-in fade-in">
            <div>
              <label className="block font-label-lg text-label-lg text-secondary mb-1.5 font-semibold">Nome completo</label>
              <div className="relative opacity-60">
                <span className="material-symbols-outlined absolute left-3 top-2.5 text-secondary text-[20px]">person</span>
                <input
                  className="w-full h-10 pl-10 pr-3 rounded-lg bg-surface-container text-on-surface font-body-md text-body-md cursor-not-allowed shadow-none border-transparent"
                  disabled
                  type="text"
                  value={submittedData?.name || 'Carlos Eduardo Silva'}
                  readOnly
                />
              </div>
            </div>
            <div>
              <label className="block font-label-lg text-label-lg text-secondary mb-1.5 font-semibold">WhatsApp</label>
              <div className="relative opacity-60">
                <span className="material-symbols-outlined absolute left-3 top-2.5 text-secondary text-[20px]">phone_iphone</span>
                <input
                  className="w-full h-10 pl-10 pr-3 rounded-lg bg-surface-container text-on-surface font-body-md text-body-md cursor-not-allowed shadow-none border-transparent"
                  disabled
                  type="tel"
                  value={submittedData?.phone || '(86) 98124-7730'}
                  readOnly
                />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-sm opacity-60">
              <div>
                <label className="block font-label-lg text-label-lg text-secondary mb-1.5 font-semibold">Modelo de interesse</label>
                <input
                  className="w-full h-10 px-3 rounded-lg bg-surface-container text-on-surface font-body-md text-body-md cursor-not-allowed shadow-none border-transparent"
                  disabled
                  type="text"
                  value={modelLabels[submittedData?.model || ''] || 'Honda CG 160'}
                  readOnly
                />
              </div>
              <div>
                <label className="block font-label-lg text-label-lg text-secondary mb-1.5 font-semibold">Unidade</label>
                <input
                  className="w-full h-10 px-3 rounded-lg bg-surface-container text-on-surface font-body-md text-body-md cursor-not-allowed shadow-none border-transparent"
                  disabled
                  type="text"
                  value={submittedData?.unit === 'timon' ? 'Timon - MA' : 'Teresina - PI'}
                  readOnly
                />
              </div>
            </div>
            <div className="pt-2">
              <button
                className="w-full h-11 bg-primary/80 text-on-primary font-headline-md text-headline-md rounded-xl shadow-none flex items-center justify-center gap-2 cursor-wait"
                disabled
                type="button"
              >
                <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" fill="currentColor"></path>
                </svg>
                <span>Enviando proposta...</span>
              </button>
            </div>
            <p className="font-label-sm text-label-sm text-center text-secondary animate-pulse">
              Conectando com o consultor de vendas Sol Nascente...
            </p>
          </div>
        )}

        {/* ===================== 3. ESTADO DE SUCESSO ===================== */}
        {formState === 'success' && (
          <div className="py-space-md flex flex-col items-center text-center space-y-space-md animate-in zoom-in-95 duration-300">
            <div className="w-16 h-16 rounded-full bg-tertiary/15 text-tertiary flex items-center justify-center shadow-inner">
              <span className="material-symbols-outlined text-[36px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                check_circle
              </span>
            </div>
            <div className="space-y-1">
              <span className="inline-block px-2.5 py-0.5 rounded-full bg-tertiary-fixed text-on-tertiary-fixed font-label-sm text-label-sm font-bold uppercase">
                Tudo certo!
              </span>
              <h3 className="font-headline-lg text-headline-lg text-on-surface">Proposta enviada com sucesso!</h3>
              <p className="font-body-md text-body-md text-secondary max-w-sm mx-auto">
                Em breve nossa equipe entrará em contato pelo WhatsApp para apresentar as condições especiais para{' '}
                <strong className="text-on-surface font-semibold">
                  {submittedData?.name || 'você'}
                </strong>.
              </p>
            </div>
            <div className="w-full bg-surface-container p-3 rounded-lg text-left space-y-2">
              <div className="flex items-center justify-between text-body-sm font-body-sm">
                <span className="text-secondary">Modelo escolhido:</span>
                <span className="font-bold text-on-surface">
                  {modelLabels[submittedData?.model || 'cg160'] || 'Honda CG 160'}
                </span>
              </div>
              <div className="flex items-center justify-between text-body-sm font-body-sm">
                <span className="text-secondary">Unidade designada:</span>
                <span className="font-bold text-on-surface">
                  {unitLabels[submittedData?.unit || 'teresina'] || 'Sol Nascente Teresina'}
                </span>
              </div>
              <div className="flex items-center justify-between text-body-sm font-body-sm">
                <span className="text-secondary">Previsão de retorno:</span>
                <span className="font-bold text-tertiary flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">bolt</span> Em até 10 minutos
                </span>
              </div>
            </div>
            <button
              className="w-full h-10 bg-surface-container text-on-surface hover:bg-surface-container-high font-label-lg text-label-lg rounded-xl transition-colors cursor-pointer"
              onClick={() => {
                reset();
                setSubmittedData(null);
                setFormState('normal');
              }}
              type="button"
            >
              Enviar nova solicitação
            </button>
          </div>
        )}

        {/* ===================== 4. ESTADO DE ERRO ===================== */}
        {formState === 'error' && (
          <div className="space-y-space-md animate-in slide-in-from-right-4">
            <div className="p-3 rounded-lg bg-error-container text-on-error-container flex items-start gap-2.5">
              <span className="material-symbols-outlined text-[20px] text-error flex-shrink-0 mt-0.5">error</span>
              <div className="flex flex-col">
                <span className="font-label-md text-label-md font-bold">Falha no envio dos dados</span>
                <span className="font-body-sm text-body-sm">
                  Não foi possível enviar seus dados no momento. Tente novamente ou entre em contato direto pelo WhatsApp.
                </span>
              </div>
            </div>

            <div className="pt-2 flex flex-col gap-2">
              <button
                className="w-full h-11 bg-primary hover:bg-[#cc0000] text-on-primary font-headline-md text-headline-md rounded-xl shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer"
                onClick={() => {
                  setFormState('normal');
                }}
                type="button"
              >
                <span className="material-symbols-outlined text-[18px]">replay</span>
                <span>Voltar e tentar novamente</span>
              </button>
              <button
                className="text-center font-label-sm text-label-sm text-secondary hover:text-on-surface cursor-pointer py-1"
                onClick={() => {
                  reset();
                  setSubmittedData(null);
                  setFormState('normal');
                }}
                type="button"
              >
                Limpar formulário
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Canal Rápido Direto no WhatsApp */}
      <div className="bg-surface-container-lowest p-3.5 sm:p-space-md rounded-xl shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-tertiary/10 text-tertiary flex items-center justify-center flex-shrink-0">
            <span className="material-symbols-outlined text-[24px]">perm_phone_msg</span>
          </div>
          <div>
            <span className="block font-headline-md text-headline-md leading-tight text-on-surface font-semibold">
              Prefere atendimento imediato?
            </span>
            <span className="font-body-sm text-body-sm text-secondary">Fale com o plantão de vendas online</span>
          </div>
        </div>
        <a
          className="w-full sm:w-auto justify-center px-3.5 py-2 rounded-lg bg-tertiary text-on-tertiary font-label-md text-label-md font-bold flex items-center gap-1.5 hover:bg-[#005236] transition-colors"
          href="https://wa.me/5586999999999"
          target="_blank"
          rel="noreferrer"
        >
          <span>Chamar</span>
          <span className="material-symbols-outlined text-[16px]">open_in_new</span>
        </a>
      </div>
    </div>
  );
});
