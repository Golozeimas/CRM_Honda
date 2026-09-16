export function PublicFooter() {
  return (
    <footer className="w-full bg-surface-container-lowest py-space-md sm:py-space-lg shadow-inner">
      <div className="max-w-7xl mx-auto px-4 sm:px-margin flex flex-col md:flex-row items-center justify-between gap-space-md text-secondary text-center md:text-left">
        <div className="flex items-center justify-center md:justify-start gap-2">
          <span className="w-2 h-2 rounded-full bg-primary flex-shrink-0"></span>
          <span className="font-body-sm text-body-sm font-medium">Sol Nascente Motos LTDA — Concessionária Autorizada Honda</span>
        </div>
        <div className="flex flex-wrap items-center justify-center md:justify-start gap-space-md font-body-sm text-body-sm">
          <span>CNPJ: 07.892.124/0001-90</span>
          <a className="hover:underline hover:text-on-surface" href="#termos">Termos de Uso</a>
          <a className="hover:underline hover:text-on-surface flex items-center gap-1" href="#privacidade">
            <span className="material-symbols-outlined text-[16px] text-tertiary">verified_user</span>
            Política de Privacidade (LGPD)
          </a>
        </div>
        <div className="font-body-sm text-body-sm text-secondary/80">
          © {new Date().getFullYear()} Sol Nascente Motos. Todos os direitos reservados.
        </div>
      </div>
    </footer>
  );
}
