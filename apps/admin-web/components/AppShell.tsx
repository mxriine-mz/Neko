'use client';

import { useState, type ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';
import { Menu, LogOut } from 'lucide-react';
import Sidebar from './Sidebar';
import LocaleSwitcher from './ui/LocaleSwitcher';
import { FeedbackProvider } from './ui/feedback';

interface SessionUser {
  name?: string | null;
  image?: string | null;
}

const TITLES: Record<string, [string, string]> = {
  '/': ['Dashboard', 'Vue d’ensemble du bot et du système'],
  '/servers': ['Serveurs', 'Serveurs Discord gérés par Neko'],
  '/users': ['Membres', 'Tous les membres connus du bot'],
  '/notes': ['Notes', 'Sections et notes'],
  '/planner': ['Planner', 'Tableaux de tâches et Gantt'],
};

function titleFor(pathname: string): [string, string] {
  if (pathname.startsWith('/servers/')) return ['Détail du serveur', 'Statistiques et membres'];
  return TITLES[pathname] ?? ['Neko', 'Administration'];
}

export default function AppShell({ children, user }: { children: ReactNode; user?: SessionUser }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const [title, sub] = titleFor(pathname);

  return (
    <FeedbackProvider>
      <div className="flex min-h-screen">
        {/* Sidebar desktop */}
        <aside className="sticky top-0 hidden h-screen md:block">
          <Sidebar />
        </aside>

        {/* Drawer mobile */}
        {open && (
          <>
            <div
              className="fixed inset-0 z-[150] bg-black/50 md:hidden"
              onClick={() => setOpen(false)}
            />
            <aside className="fixed left-0 top-0 z-[200] h-screen shadow-[0_0_60px_rgba(0,0,0,0.6)] md:hidden">
              <Sidebar onNavigate={() => setOpen(false)} />
            </aside>
          </>
        )}

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-[80] flex items-center gap-3 border-b border-white/8 bg-surface-2/65 px-5 py-3.5 backdrop-blur-xl md:px-7">
            <button
              onClick={() => setOpen(true)}
              className="flex size-[38px] items-center justify-center rounded-[9px] border border-white/8 bg-white/[0.04] text-ink md:hidden"
            >
              <Menu className="size-[18px]" />
            </button>
            <div className="min-w-0">
              <h1 className="truncate text-[17px] font-bold">{title}</h1>
              <p className="truncate text-[12.5px] text-ink-3">{sub}</p>
            </div>

            <div className="ml-auto flex items-center gap-3">
              {user?.image && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={user.image}
                  alt=""
                  width={28}
                  height={28}
                  className="size-7 rounded-full border border-white/10"
                />
              )}
              {user?.name && (
                <span className="hidden text-[13px] font-medium text-ink-2 sm:inline">
                  {user.name}
                </span>
              )}
              <button
                onClick={() => signOut({ redirectTo: '/login' })}
                className="inline-flex items-center gap-1.5 rounded-full bg-white/[0.05] px-3 py-1.5 text-[12.5px] font-medium text-ink-2 transition hover:bg-white/[0.1] hover:text-ink"
              >
                <LogOut className="size-4" />
                <span className="hidden sm:inline">Déconnexion</span>
              </button>
              <span className="mx-0.5 hidden h-5 w-px bg-white/10 sm:block" />
              <LocaleSwitcher />
            </div>
          </header>

          <main className="flex-1 px-5 pb-10 pt-6 md:px-7">{children}</main>
        </div>
      </div>
    </FeedbackProvider>
  );
}
