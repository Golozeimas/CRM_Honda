export function PublicHeader() {
  return (
    <header className="w-full bg-surface-container-lowest shadow-sm sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-margin py-space-sm flex items-center justify-between">
        <div className="flex items-center gap-space-md">
          <div className="flex items-center gap-space-xs">
            <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center text-on-primary font-headline-lg shadow-sm">
              <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>sports_motorsports</span>
            </div>
            <div className="flex flex-col">
              <span className="font-headline-md text-headline-md tracking-tight leading-none text-on-surface uppercase">Sol Nascente</span>
              <div className="flex items-center gap-1 mt-0.5">
                <span className="text-[10px] uppercase font-bold tracking-widest text-primary">Concessionária Autorizada</span>
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-primary"></span>
                <span className="text-[10px] font-bold text-secondary uppercase">Honda</span>
              </div>
            </div>
          </div>
          <div className="hidden lg:flex items-center gap-space-md ml-space-xl">
            <a className="font-label-lg text-label-lg text-secondary hover:text-primary transition-colors flex items-center gap-1" href="#modelos">
              Modelos
              <span className="material-symbols-outlined text-[16px]">expand_more</span>
            </a>
            <a className="font-label-lg text-label-lg text-secondary hover:text-primary transition-colors flex items-center gap-1" href="#consorcio">
              Consórcio Honda
              <span className="bg-primary/10 text-primary text-[10px] font-bold px-1.5 py-0.5 rounded">Tabelas 2025</span>
            </a>
            <a className="font-label-lg text-label-lg text-secondary hover:text-primary transition-colors" href="#pos-venda">Pós-Venda</a>
            <a className="font-label-lg text-label-lg text-secondary hover:text-primary transition-colors" href="#unidades">Unidades</a>
          </div>
        </div>
        <div className="flex items-center gap-space-sm">
          <div className="hidden md:flex items-center gap-2 bg-surface-container px-3 py-1.5 rounded-full mr-2 text-on-secondary-container">
            <span className="material-symbols-outlined text-[16px] text-tertiary">chat</span>
            <span className="font-label-sm text-label-sm font-semibold">Teresina & Timon</span>
          </div>
          <a className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-container text-on-surface hover:bg-surface-container-highest transition-colors font-label-md text-label-md" href="/login">
            <span className="material-symbols-outlined text-[16px] text-secondary">lock</span>
            <span>Área Administrativa</span>
          </a>
        </div>
      </div>
    </header>
  );
}
