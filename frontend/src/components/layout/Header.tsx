export function Header() {
  return (
    <header className="fixed top-0 left-[240px] right-0 h-16 bg-surface-container-lowest/90 backdrop-blur-md z-40 border-b border-surface-container-highest flex items-center justify-end px-margin shadow-[0_1px_8px_rgba(0,0,0,0.03)]">
      {/* User avatar */}
      <div className="flex items-center gap-space-sm ml-auto">
        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center" aria-hidden="true">
          <span className="material-symbols-outlined text-on-primary text-[18px]">person</span>
        </div>
      </div>
    </header>
  );
}
