import { useState, type ReactNode } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';

interface AppLayoutProps {
  children: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="bg-background font-body-md text-on-surface antialiased min-h-screen">
      {/* Mobile backdrop */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-xs transition-opacity"
          onClick={() => setIsMobileMenuOpen(false)}
          aria-hidden="true"
        />
      )}

      <Sidebar isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />

      {/* Content offset by sidebar on desktop */}
      <div className="pl-0 md:pl-[240px] transition-[padding] duration-200">
        <Header onToggleMenu={() => setIsMobileMenuOpen((prev) => !prev)} />

        {/* Content offset by the fixed header */}
        <main className="w-full pt-16 bg-background px-3 sm:px-margin py-4 sm:py-margin min-w-0">
          {children}
        </main>
      </div>
    </div>
  );
}
