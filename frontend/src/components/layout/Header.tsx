interface HeaderProps {
  onToggleMenu?: () => void;
}

export function Header({ onToggleMenu }: HeaderProps) {
  return (
    <header className="fixed top-0 left-0 md:left-[240px] right-0 h-16 bg-surface-container-lowest/90 backdrop-blur-md z-40 border-b border-surface-container-highest flex items-center justify-between md:justify-end px-4 sm:px-margin shadow-[0_1px_8px_rgba(0,0,0,0.03)] transition-[left] duration-200">
      {/* Mobile hamburger button */}
      <div className="flex items-center gap-2 md:hidden">
        <button
          type="button"
          onClick={onToggleMenu}
          className="p-2 -ml-1 rounded-xl text-on-surface hover:bg-surface-container transition-colors cursor-pointer flex items-center justify-center"
          aria-label="Abrir menu de navegação"
        >
          <span className="material-symbols-outlined text-[24px]">menu</span>
        </button>
        <span className="font-label-lg font-bold text-on-surface uppercase tracking-tight">
          Sol Nascente
        </span>
      </div>

      {/* User avatar */}
      <div className="flex items-center gap-space-sm">
        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center" aria-hidden="true">
          <span className="material-symbols-outlined text-on-primary text-[18px]">person</span>
        </div>
      </div>
    </header>
  );
}
