'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Server,
  Users,
  StickyNote,
  KanbanSquare,
  type LucideIcon,
} from 'lucide-react';

interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
}
interface NavGroup {
  title: string;
  items: NavItem[];
}

const GROUPS: NavGroup[] = [
  { title: 'Pilotage', items: [{ href: '/', label: 'Dashboard', icon: LayoutDashboard }] },
  {
    title: 'Données',
    items: [
      { href: '/servers', label: 'Serveurs', icon: Server },
      { href: '/users', label: 'Membres', icon: Users },
    ],
  },
  {
    title: 'Administration',
    items: [
      { href: '/notes', label: 'Notes', icon: StickyNote },
      { href: '/planner', label: 'Planner', icon: KanbanSquare },
    ],
  },
];

export default function Sidebar({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href);

  return (
    <nav className="flex h-full w-[248px] shrink-0 flex-col gap-7 border-r border-white/8 bg-surface-2/70 px-4 py-6 backdrop-blur">
      <div className="px-2.5">
        <div className="text-[22px] font-extrabold leading-none">
          <span className="brand-text">Neko</span>
        </div>
        <div className="mt-1 text-[11px] font-medium uppercase tracking-wider text-ink-3">
          Database Admin
        </div>
      </div>

      {GROUPS.map((g) => (
        <div key={g.title} className="flex flex-col gap-1">
          <div className="mb-1 px-2.5 text-[10.5px] font-bold uppercase tracking-[0.08em] text-ink-3">
            {g.title}
          </div>
          {g.items.map((it) => {
            const active = isActive(it.href);
            const Icon = it.icon;
            return (
              <Link
                key={it.href}
                href={it.href}
                onClick={onNavigate}
                className={`relative flex items-center gap-3 rounded-[10px] px-2.5 py-2 text-[13.5px] font-medium transition ${
                  active
                    ? 'bg-white/[0.06] text-ink'
                    : 'text-ink-2 hover:bg-white/[0.04] hover:text-ink'
                }`}
              >
                {active && (
                  <span className="absolute left-0 top-1/2 h-5 w-[3px] -translate-y-1/2 rounded-full brand-grad" />
                )}
                <Icon className={`size-[18px] ${active ? 'text-sky' : ''}`} strokeWidth={2} />
                {it.label}
              </Link>
            );
          })}
        </div>
      ))}
    </nav>
  );
}
