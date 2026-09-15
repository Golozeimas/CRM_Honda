import { useState, useRef, forwardRef, useImperativeHandle } from 'react';

export type FormState = 'normal' | 'loading' | 'success' | 'error';

export interface LeadCaptureFormRef {
  setFormState: (state: FormState) => void;
  setModel: (model: string) => void;
  setUnit: (unit: string) => void;
  focusName: () => void;
}

export interface LeadCaptureFormProps {}

export const LeadCaptureForm = forwardRef<LeadCaptureFormRef, LeadCaptureFormProps>((_props, ref) => {
  const [formState, setFormState] = useState<FormState>('normal');
  const [model, setModel] = useState<string>('');
  const [unit, setUnit] = useState<string>('teresina');
  
  const nameInputRef = useRef<HTMLInputElement>(null);

  useImperativeHandle(ref, () => ({
    setFormState,
    setModel,
    setUnit,
    focusName: () => {
      nameInputRef.current?.focus();
    }
  }));

  const handleDemoSubmit = () => {
    setFormState('loading');
    setTimeout(() => {
      // For demo purposes, alternate between success and error or just show success
      setFormState('success');
    }, 2000);
  };

  return (
    <div className="flex flex-col gap-space-md">
      {/* State Switcher Tabs (Demo Controls) */}
      <div className="bg-surface-container-high p-1.5 rounded-xl flex items-center justify-between gap-1 shadow-inner">
        {(['normal', 'loading', 'success', 'error'] as FormState[]).map((state) => (
          <button
            key={state}
            type="button"
            className={`flex-1 py-1.5 px-2 text-center rounded-lg font-label-sm text-label-sm font-semibold transition-all cursor-pointer ${
              formState === state
                ? 'bg-surface-container-lowest shadow-sm text-on-surface'
                : 'text-secondary hover:text-on-surface'
            }`}
            onClick={() => setFormState(state)}
          >
            {state === 'normal' ? '1. Normal' : state === 'loading' ? '2. Loading' : state === 'success' ? '3. Sucesso' : '4. Erro'}
          </button>
        ))}
      </div>

      {/* Main Conversion Card Container */}
      <div className="bg-surface-container-lowest rounded-xl shadow-xl p-space-lg relative overflow-hidden transition-all duration-300">
        {/* Red Decorative Accent Top Edge */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-primary"></div>

        {/* Header of Form Card */}
        <div className="flex items-center justify-between pb-space-sm mb-space-md">
          <div>
            <span className="text-primary font-label-sm text-label-sm font-bold tracking-wider uppercase">Atendimento Digital</span>
            <h2 className="font-headline-lg text-headline-lg text-on-surface">Solicitar Proposta</h2>
          </div>
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
            <span className="material-symbols-outlined text-[22px]">bolt</span>
          </div>
        </div>

        {/* ===================== 1. NORMAL STATE ===================== */}
        {formState === 'normal' && (
          <div className="space-y-space-md animate-in fade-in">
            <div>
              <label className="block font-label-lg text-label-lg text-on-surface mb-1.5 font-semibold" htmlFor="lead-name">Nome completo</label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-2.5 text-secondary text-[20px]">person</span>
                <input
                  ref={nameInputRef}
                  className="w-full h-10 pl-10 pr-3 rounded-lg bg-surface-container-lowest text-on-surface font-body-md text-body-md placeholder:text-secondary/60 focus:outline-none focus:ring-2 focus:ring-primary shadow-sm border border-transparent focus:border-transparent"
                  id="lead-name"
                  placeholder="Digite seu nome"
                  type="text"
                />
              </div>
            </div>
            <div>
              <label className="block font-label-lg text-label-lg text-on-surface mb-1.5 font-semibold" htmlFor="lead-phone">WhatsApp</label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-2.5 text-secondary text-[20px]">phone_iphone</span>
                <input
                  className="w-full h-10 pl-10 pr-3 rounded-lg bg-surface-container-lowest text-on-surface font-body-md text-body-md placeholder:text-secondary/60 focus:outline-none focus:ring-2 focus:ring-primary shadow-sm border border-transparent focus:border-transparent"
                  id="lead-phone"
                  placeholder="(86) 99999-9999"
                  type="tel"
                  defaultValue="(86) 9"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-sm">
              <div>
                <label className="block font-label-lg text-label-lg text-on-surface mb-1.5 font-semibold" htmlFor="lead-model">Modelo de interesse</label>
                <div className="relative">
                  <select
                    className="w-full h-10 px-3 pr-8 rounded-lg bg-surface-container-lowest text-on-surface font-body-md text-body-md focus:outline-none focus:ring-2 focus:ring-primary shadow-sm appearance-none cursor-pointer border border-transparent focus:border-transparent"
                    id="lead-model"
                    value={model}
                    onChange={(e) => setModel(e.target.value)}
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
                  <span className="material-symbols-outlined absolute right-2.5 top-2.5 text-secondary pointer-events-none text-[20px]">arrow_drop_down</span>
                </div>
              </div>
              <div>
                <label className="block font-label-lg text-label-lg text-on-surface mb-1.5 font-semibold" htmlFor="lead-unit">Unidade</label>
                <div className="relative">
                  <select
                    className="w-full h-10 px-3 pr-8 rounded-lg bg-surface-container-lowest text-on-surface font-body-md text-body-md focus:outline-none focus:ring-2 focus:ring-primary shadow-sm appearance-none cursor-pointer border border-transparent focus:border-transparent"
                    id="lead-unit"
                    value={unit}
                    onChange={(e) => setUnit(e.target.value)}
                  >
                    <option value="teresina">Teresina</option>
                    <option value="timon">Timon</option>
                  </select>
                  <span className="material-symbols-outlined absolute right-2.5 top-2.5 text-secondary pointer-events-none text-[20px]">store</span>
                </div>
              </div>
            </div>
            <div className="pt-2">
              <button
                className="w-full h-11 bg-primary hover:bg-[#cc0000] active:bg-[#b30024] text-on-primary font-headline-md text-headline-md rounded-xl shadow-md flex items-center justify-center gap-2 transition-all group cursor-pointer"
                onClick={handleDemoSubmit}
                type="button"
              >
                <span>Quero receber atendimento</span>
                <span className="material-symbols-outlined text-[20px] group-hover:translate-x-1 transition-transform">arrow_forward</span>
              </button>
            </div>
            <div className="flex items-center justify-center gap-1.5 text-secondary pt-1">
              <span className="material-symbols-outlined text-[16px] text-tertiary">lock</span>
              <span className="font-label-sm text-label-sm">Seus dados estão protegidos pela LGPD</span>
            </div>
          </div>
        )}

        {/* ===================== 2. LOADING STATE ===================== */}
        {formState === 'loading' && (
          <div className="space-y-space-md animate-in fade-in">
            <div>
              <label className="block font-label-lg text-label-lg text-secondary mb-1.5 font-semibold">Nome completo</label>
              <div className="relative opacity-60">
                <span className="material-symbols-outlined absolute left-3 top-2.5 text-secondary text-[20px]">person</span>
                <input className="w-full h-10 pl-10 pr-3 rounded-lg bg-surface-container text-on-surface font-body-md text-body-md cursor-not-allowed shadow-none" disabled type="text" defaultValue="Carlos Eduardo Silva" />
              </div>
            </div>
            <div>
              <label className="block font-label-lg text-label-lg text-secondary mb-1.5 font-semibold">WhatsApp</label>
              <div className="relative opacity-60">
                <span className="material-symbols-outlined absolute left-3 top-2.5 text-secondary text-[20px]">phone_iphone</span>
                <input className="w-full h-10 pl-10 pr-3 rounded-lg bg-surface-container text-on-surface font-body-md text-body-md cursor-not-allowed shadow-none" disabled type="tel" defaultValue="(86) 98124-7730" />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-sm opacity-60">
              <div>
                <label className="block font-label-lg text-label-lg text-secondary mb-1.5 font-semibold">Modelo de interesse</label>
                <input className="w-full h-10 px-3 rounded-lg bg-surface-container text-on-surface font-body-md text-body-md cursor-not-allowed shadow-none" disabled type="text" defaultValue="Honda CG 160" />
              </div>
              <div>
                <label className="block font-label-lg text-label-lg text-secondary mb-1.5 font-semibold">Unidade</label>
                <input className="w-full h-10 px-3 rounded-lg bg-surface-container text-on-surface font-body-md text-body-md cursor-not-allowed shadow-none" disabled type="text" defaultValue="Teresina" />
              </div>
            </div>
            <div className="pt-2">
              <button className="w-full h-11 bg-primary/80 text-on-primary font-headline-md text-headline-md rounded-xl shadow-none flex items-center justify-center gap-2 cursor-wait" disabled type="button">
                <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" fill="currentColor"></path>
                </svg>
                <span>Enviando...</span>
              </button>
            </div>
            <p className="font-label-sm text-label-sm text-center text-secondary animate-pulse">Conectando ao consultor mais próximo...</p>
          </div>
        )}

        {/* ===================== 3. SUCCESS STATE ===================== */}
        {formState === 'success' && (
          <div className="py-space-md flex flex-col items-center text-center space-y-space-md animate-in zoom-in-95 duration-300">
            <div className="w-16 h-16 rounded-full bg-tertiary/15 text-tertiary flex items-center justify-center shadow-inner">
              <span className="material-symbols-outlined text-[36px]" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
            </div>
            <div className="space-y-1">
              <span className="inline-block px-2.5 py-0.5 rounded-full bg-tertiary-fixed text-on-tertiary-fixed font-label-sm text-label-sm font-bold uppercase">Tudo certo!</span>
              <h3 className="font-headline-lg text-headline-lg text-on-surface">Lead enviado com sucesso!</h3>
              <p className="font-body-md text-body-md text-secondary max-w-sm mx-auto">
                Em breve nossa equipe entrará em contato pelo WhatsApp para apresentar as melhores opções para você.
              </p>
            </div>
            <div className="w-full bg-surface-container p-3 rounded-lg text-left space-y-2">
              <div className="flex items-center justify-between text-body-sm font-body-sm">
                <span className="text-secondary">Unidade designada:</span>
                <span className="font-bold text-on-surface">Sol Nascente Teresina</span>
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
              onClick={() => setFormState('normal')}
              type="button"
            >
              Enviar nova solicitação
            </button>
          </div>
        )}

        {/* ===================== 4. ERROR STATE ===================== */}
        {formState === 'error' && (
          <div className="space-y-space-md animate-in slide-in-from-right-4">
            <div className="p-3 rounded-lg bg-error-container text-on-error-container flex items-start gap-2.5">
              <span className="material-symbols-outlined text-[20px] text-error flex-shrink-0 mt-0.5">error</span>
              <div className="flex flex-col">
                <span className="font-label-md text-label-md font-bold">Falha no envio dos dados</span>
                <span className="font-body-sm text-body-sm">Não foi possível enviar seus dados. Tente novamente ou verifique os campos em destaque.</span>
              </div>
            </div>
            <div>
              <label className="block font-label-lg text-label-lg text-error mb-1.5 font-semibold" htmlFor="err-name">Nome completo</label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-2.5 text-error text-[20px]">person</span>
                <input className="w-full h-10 pl-10 pr-3 rounded-lg bg-error-container/20 text-on-surface font-body-md text-body-md focus:outline-none focus:ring-2 focus:ring-error shadow-sm border border-error/50" id="err-name" type="text" defaultValue="J" />
              </div>
              <span className="font-label-sm text-label-sm text-error mt-1 block">Por favor, insira o nome completo com pelo menos 3 caracteres.</span>
            </div>
            <div>
              <label className="block font-label-lg text-label-lg text-error mb-1.5 font-semibold" htmlFor="err-phone">WhatsApp</label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-2.5 text-error text-[20px]">phone_iphone</span>
                <input className="w-full h-10 pl-10 pr-3 rounded-lg bg-error-container/20 text-on-surface font-body-md text-body-md focus:outline-none focus:ring-2 focus:ring-error shadow-sm border border-error/50" id="err-phone" type="tel" defaultValue="(86) 988" />
              </div>
              <span className="font-label-sm text-label-sm text-error mt-1 block">Número de WhatsApp incompleto. Digite DDD + 9 dígitos.</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-sm">
              <div>
                <label className="block font-label-lg text-label-lg text-on-surface mb-1.5 font-semibold">Modelo</label>
                <input className="w-full h-10 px-3 rounded-lg bg-surface-container-lowest text-on-surface font-body-md text-body-md shadow-sm" type="text" defaultValue="Honda CB 300F" disabled />
              </div>
              <div>
                <label className="block font-label-lg text-label-lg text-on-surface mb-1.5 font-semibold">Unidade</label>
                <input className="w-full h-10 px-3 rounded-lg bg-surface-container-lowest text-on-surface font-body-md text-body-md shadow-sm" type="text" defaultValue="Timon" disabled />
              </div>
            </div>
            <div className="pt-2 flex flex-col gap-2">
              <button
                className="w-full h-11 bg-primary hover:bg-[#cc0000] text-on-primary font-headline-md text-headline-md rounded-xl shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer"
                onClick={() => setFormState('loading')}
                type="button"
              >
                <span className="material-symbols-outlined text-[18px]">replay</span>
                <span>Tentar novamente</span>
              </button>
              <button
                className="text-center font-label-sm text-label-sm text-secondary hover:text-on-surface cursor-pointer"
                onClick={() => setFormState('normal')}
                type="button"
              >
                Limpar e preencher do zero
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Direct WhatsApp Fast-Track */}
      <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-tertiary/10 text-tertiary flex items-center justify-center">
            <span className="material-symbols-outlined text-[24px]">perm_phone_msg</span>
          </div>
          <div>
            <span className="block font-headline-md text-headline-md leading-tight text-on-surface font-semibold">Prefere atendimento imediato?</span>
            <span className="font-body-sm text-body-sm text-secondary">Fale com o plantão de vendas online</span>
          </div>
        </div>
        <a className="px-3.5 py-2 rounded-lg bg-tertiary text-on-tertiary font-label-md text-label-md font-bold flex items-center gap-1.5 hover:bg-[#005236] transition-colors" href="https://wa.me/5586999999999" target="_blank" rel="noreferrer">
          <span>Chamar</span>
          <span className="material-symbols-outlined text-[16px]">open_in_new</span>
        </a>
      </div>
    </div>
  );
});
