import { useRef } from 'react';
import { PublicHeader } from '../components/public/PublicHeader';
import { PublicFooter } from '../components/public/PublicFooter';
import { ModelCard, type ModelData } from '../components/public/ModelCard';
import { UnitCard, type UnitData } from '../components/public/UnitCard';
import { LeadCaptureForm, type LeadCaptureFormRef } from '../components/public/LeadCaptureForm';
import cg160Img from '../assets/CG160.jpg';
import bizImg from '../assets/HondaBIZ.jpg';
import nxr160Img from '../assets/NXR160.jpg';
import cb300Img from '../assets/CB300F.jpg';

const models: ModelData[] = [
  {
    id: 'cg160',
    tag: 'CG 160 Titan',
    badge: 'Em Estoque',
    name: 'Honda CG 160',
    description: 'A motocicleta mais vendida do Brasil, econômica e robusta.',
    priceText: 'R$ 389,00/mês',
    imageUrl: cg160Img
  },
  {
    id: 'biz',
    tag: 'Biz 125',
    badge: 'Pronta Entrega',
    name: 'Honda Biz',
    description: 'Praticidade com porta-capacete e câmbio semiautomático.',
    priceText: 'R$ 349,00/mês',
    imageUrl: bizImg
  },
  {
    id: 'nxr160',
    tag: 'Bros 160 ABS',
    badge: 'Últimas Unidades',
    name: 'Honda NXR 160 Bros',
    description: 'Suspensão de longo curso para qualquer tipo de terreno.',
    priceText: 'R$ 459,00/mês',
    imageUrl: nxr160Img
  },
  {
    id: 'cb300',
    tag: 'Twister 2025',
    badge: 'Lançamento',
    name: 'Honda CB 300F',
    description: 'Design esportivo, embreagem assistida e iluminação full LED.',
    priceText: 'R$ 549,00/mês',
    imageUrl: cb300Img
  }
];

const units: UnitData[] = [
  {
    id: 'teresina',
    name: 'Unidade Teresina - PI',
    badge: 'Matriz',
    address: 'Av. Frei Serafim, 2800 — Centro, Teresina - PI',
    schedule: 'Seg à Sex: 08:00 às 18:00 | Sáb: 08:00 às 12:00'
  },
  {
    id: 'timon',
    name: 'Unidade Timon - MA',
    badge: 'Filial',
    address: 'Av. Presidente Médici, 1420 — Formosa, Timon - MA',
    schedule: 'Seg à Sex: 08:00 às 18:00 | Sáb: 08:00 às 12:00'
  }
];

export function PublicLandingPage() {
  const formRef = useRef<LeadCaptureFormRef>(null);

  const handleSelectModel = (modelId: string) => {
    formRef.current?.setFormState('normal');
    formRef.current?.setModel(modelId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setTimeout(() => {
      formRef.current?.focusName();
    }, 500);
  };

  const handleSelectUnit = (unitId: string) => {
    formRef.current?.setFormState('normal');
    formRef.current?.setUnit(unitId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setTimeout(() => {
      formRef.current?.focusName();
    }, 500);
  };

  return (
    <div className="bg-background font-body-md text-on-surface antialiased">
      <main className="min-h-screen w-full flex items-center justify-center p-space-md">
        <div className="flex flex-col w-full">
          <PublicHeader />

          {/* Hero Content Area */}
          <section className="relative w-full overflow-hidden bg-gradient-to-b from-surface to-surface-container-low pt-space-lg pb-space-xl">
            <div className="max-w-7xl mx-auto px-margin">
              {/* Badge and Announcement */}
              <div className="flex flex-wrap items-center gap-2 mb-space-md">
                <span className="inline-flex items-center gap-1.5 bg-primary/10 text-primary px-3 py-1 rounded-full font-label-sm text-label-sm font-bold uppercase tracking-wider">
                  <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                  Condições Exclusivas de Fábrica
                </span>
                <span className="font-body-sm text-body-sm text-secondary">Entrada facilitada + parcelas que cabem no seu bolso</span>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-xl items-start">
                {/* Left Column: Copy + Showroom Motorcycle Showcase */}
                <div className="lg:col-span-7 flex flex-col gap-space-lg">
                  <div className="space-y-space-sm">
                    <h1 className="font-headline-xl text-headline-xl md:text-[40px] md:leading-[46px] text-on-surface tracking-tight">
                      Encontre sua <span className="text-primary underline decoration-primary/30 underline-offset-4">próxima Honda</span> zero km.
                    </h1>
                    <p className="font-body-lg text-body-lg text-secondary max-w-xl">
                      Preencha seus dados e nossa equipe de consultores oficiais entrará em contato pelo WhatsApp para ajudar você a encontrar a moto ideal com simulação em tempo real.
                    </p>
                  </div>

                  {/* Hero Image Frame with Dealership Context */}
                  <div className="relative rounded-xl overflow-hidden shadow-xl bg-surface-container-highest group">
                    <img
                      alt="Motocicleta esportiva Honda vermelha em showroom moderno e iluminado da Sol Nascente Motos"
                      className="w-full h-[340px] sm:h-[420px] object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuDMhSZhjsvnRwJzeRnaCgfcGljwFA3xk844WpJWGlaq9P2rAKB9DszxkifJg2MizXaYCgRf5_3RIEbb144u_AwR1hX4Bx1wIycBaw8GTItfDIfMQ-RmIvq4n5dRCKnwqWfLKd1ogA-RmbnxkUIRruti3snBtvB61lL-b5CskQrKMpkVA1Jg61tLG7yt6kW8uv534zT5FjqrAVOXNJ5nr3IshecVIM1StpZqO-UxISaq3Ouq4bpV98-b"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent flex flex-col justify-end p-space-lg">
                      <div className="flex flex-wrap items-end justify-between gap-space-sm">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="bg-primary text-on-primary font-label-sm text-label-sm px-2 py-0.5 rounded font-bold uppercase">Showroom Oficial</span>
                            <span className="bg-surface-container-lowest/20 backdrop-blur-md text-white font-label-sm text-label-sm px-2 py-0.5 rounded">Pronta Entrega</span>
                          </div>
                          <h3 className="text-white font-headline-lg text-headline-lg font-bold drop-shadow-sm">Linha Honda Performance & Urbano</h3>
                          <p className="text-white/80 font-body-sm text-body-sm">Disponível para test-ride nas concessionárias de Teresina e Timon</p>
                        </div>
                        <div className="bg-surface-container-lowest/90 backdrop-blur-md p-3 rounded-lg shadow-md flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                            <span className="material-symbols-outlined text-[24px]">verified</span>
                          </div>
                          <div>
                            <span className="block font-headline-md text-headline-md leading-none text-on-surface font-bold">3 Anos</span>
                            <span className="font-label-sm text-label-sm text-secondary">de Garantia Honda</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Proof Badges */}
                  <div className="grid grid-cols-3 gap-space-sm pt-2">
                    <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm flex flex-col gap-1">
                      <div className="flex items-center gap-1.5 text-primary">
                        <span className="material-symbols-outlined text-[20px]">schedule</span>
                        <span className="font-headline-md text-headline-md font-bold text-on-surface">5 min</span>
                      </div>
                      <p className="font-body-sm text-body-sm text-secondary">Tempo médio de primeiro contato</p>
                    </div>
                    <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm flex flex-col gap-1">
                      <div className="flex items-center gap-1.5 text-primary">
                        <span className="material-symbols-outlined text-[20px]">savings</span>
                        <span className="font-headline-md text-headline-md font-bold text-on-surface">0% Taxa</span>
                      </div>
                      <p className="font-body-sm text-body-sm text-secondary">Planos de consórcio contemplados</p>
                    </div>
                    <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm flex flex-col gap-1">
                      <div className="flex items-center gap-1.5 text-tertiary">
                        <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>thumb_up</span>
                        <span className="font-headline-md text-headline-md font-bold text-on-surface">Líder</span>
                      </div>
                      <p className="font-body-sm text-body-sm text-secondary">Maior estoque do Piauí e Maranhão</p>
                    </div>
                  </div>
                </div>

                {/* Right Column: Interactive Lead Capture Component */}
                <div className="lg:col-span-5">
                  <LeadCaptureForm ref={formRef} />
                </div>
              </div>
            </div>
          </section>

          {/* Popular Models Catalog Strip */}
          <section className="w-full bg-surface-container-lowest py-space-xl" id="modelos">
            <div className="max-w-7xl mx-auto px-margin">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-space-lg gap-2">
                <div>
                  <span className="text-primary font-label-sm text-label-sm font-bold uppercase tracking-wider">Garagem Sol Nascente</span>
                  <h2 className="font-headline-lg text-headline-lg text-on-surface">Mais Procuradas da Semana</h2>
                </div>
                <a className="font-label-lg text-label-lg text-primary hover:underline flex items-center gap-1" href="#solicitar">
                  Ver todas as condições
                  <span className="material-symbols-outlined text-[18px]">chevron_right</span>
                </a>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-space-md">
                {models.map(model => (
                  <ModelCard key={model.id} model={model} onSelect={handleSelectModel} />
                ))}
              </div>
            </div>
          </section>

          {/* Dealership Units & Location Section */}
          <section className="w-full bg-surface-container-low py-space-xl" id="unidades">
            <div className="max-w-7xl mx-auto px-margin">
              <div className="text-center max-w-xl mx-auto mb-space-lg">
                <span className="text-primary font-label-sm text-label-sm font-bold uppercase tracking-wider">Rede Sol Nascente</span>
                <h2 className="font-headline-lg text-headline-lg text-on-surface">Nossas Concessionárias</h2>
                <p className="font-body-md text-body-md text-secondary">Estrutura completa com oficina autorizada, boutique de peças originais e test-ride disponível.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-space-lg">
                {units.map(unit => (
                  <UnitCard key={unit.id} unit={unit} onSelect={handleSelectUnit} />
                ))}
              </div>
            </div>
          </section>

          <PublicFooter />
        </div>
      </main>
    </div>
  );
}
