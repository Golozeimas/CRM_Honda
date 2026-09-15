import { useState } from 'react';
import logoUrl from '../../assets/logo_sol_nascente.jpg';

export function Header() {
  const [search, setSearch] = useState('');

  return (
    <header className="fixed top-0 left-[240px] right-0 h-16 bg-surface-container-lowest/90 backdrop-blur-md z-40 border-b border-surface-container-highest flex items-center justify-between px-margin shadow-[0_1px_8px_rgba(0,0,0,0.03)]">
      {/* Logo + brand */}
      <div className="flex items-center gap-space-md">
        <img
          src={logoUrl}
          alt="Sol Nascente Motos Logo"
          className="h-8 w-auto object-contain"
        />
        <span className="font-headline-md text-on-surface tracking-tight hidden sm:inline-block">
          Concessionária Oficial
        </span>
      </div>

      {/* Global search */}
      <div className="flex items-center gap-space-md flex-1 max-w-md mx-space-lg">
        <div className="relative w-full">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[18px]">
            search
          </span>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar lead, modelo, chassi ou CPF..."
            className="w-full h-9 pl-9 pr-space-sm bg-surface-container-low rounded-xl text-on-surface font-body-sm placeholder:text-on-surface-variant/70 focus:outline-none focus:ring-2 focus:ring-primary-container transition-all border border-transparent focus:bg-surface-container-lowest"
            aria-label="Busca global"
          />
        </div>
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
