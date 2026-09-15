import type { ReactNode } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';

interface AppLayoutProps {
  children: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="bg-background font-body-md text-on-surface antialiased">
      <Sidebar />

      {/* Content offset by the fixed sidebar */}
      <div className="pl-[240px]">
        <Header />

        {/* Content offset by the fixed header */}
        <main className="w-full pt-16 bg-background px-margin py-margin">
          {children}
        </main>
      </div>
    </div>
  );
}
