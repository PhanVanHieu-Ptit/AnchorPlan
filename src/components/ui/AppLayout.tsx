import React from 'react';

interface AppLayoutProps {
  children: React.ReactNode;
  catalogue?: React.ReactNode;
}

export default function AppLayout({ children, catalogue }: AppLayoutProps) {
  return (
    <div className="flex h-screen w-screen overflow-hidden">
      <aside className="w-[280px] shrink-0 h-screen flex flex-col border-r border-slate-700 bg-slate-900">
        <header className="px-4 py-3 border-b border-slate-700">
          <span className="text-lg font-semibold text-white">DevMount</span>
        </header>
        <div id="catalogue-slot" className="flex-1 overflow-auto p-3">
          {catalogue}
        </div>
        <div id="props-slot" className="shrink-0 border-t border-slate-700" />
      </aside>
      <main className="flex-1 h-screen overflow-hidden">
        {children}
      </main>
    </div>
  );
}
