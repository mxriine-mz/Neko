'use client';

import { useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import { usePolling } from '@/lib/hooks';
import Modal from '@/components/ui/Modal';
import { btnGhost } from '@/lib/ui';
import { initial, fmtDate } from '@/lib/utils';
import type { BotUser } from '@/lib/types';

function Pill({ color, children }: { color: string; children: React.ReactNode }) {
  return (
    <span className="rounded-full px-2 py-0.5 text-[10.5px] font-semibold" style={{ background: `${color}22`, color }}>
      {children}
    </span>
  );
}

export default function UsersPage() {
  const { data: users } = usePolling<BotUser[]>('/api/users', 20000);
  const [q, setQ] = useState('');
  const [view, setView] = useState<BotUser | null>(null);

  const filtered = useMemo(
    () =>
      (users ?? []).filter(
        (u) =>
          u.username.toLowerCase().includes(q.toLowerCase()) ||
          (u.guild?.name ?? '').toLowerCase().includes(q.toLowerCase()),
      ),
    [users, q],
  );

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2 rounded-[11px] border border-white/8 bg-surface-2 px-3 py-2">
        <Search className="size-4 text-ink-3" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Rechercher un membre ou un serveur…"
          className="w-full bg-transparent text-[13.5px] text-ink outline-none"
        />
      </div>

      <div className="overflow-hidden rounded-[16px] border border-white/8 bg-surface-2">
        <div className="divide-y divide-white/[0.05]">
          {filtered.map((u) => (
            <button
              key={u.id}
              onClick={() => setView(u)}
              className="flex w-full items-center gap-3 px-5 py-3 text-left transition hover:bg-white/[0.03]"
            >
              <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-surface-3 text-[13px] font-bold text-ink-2">
                {initial(u.username)}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="truncate font-semibold">{u.username}</span>
                  {u.isBanned && <Pill color="#f87171">Banni</Pill>}
                  {u.hasTicket && <Pill color="#a78bfa">Ticket</Pill>}
                  {!u.inGuild && <Pill color="#71717a">Parti</Pill>}
                </div>
                <div className="text-[12px] text-ink-3">
                  {u.guild?.name ?? '—'} · Niveau {u.level} · {u.warnings?.length ?? 0} avert.
                </div>
              </div>
            </button>
          ))}
          {users && !filtered.length && (
            <p className="px-5 py-10 text-center text-ink-3">Aucun membre.</p>
          )}
        </div>
      </div>

      {view && (
        <Modal
          open
          onClose={() => setView(null)}
          title={`Détails — ${view.username}`}
          maxWidth={480}
          footer={
            <button className={btnGhost} onClick={() => setView(null)}>
              Fermer
            </button>
          }
        >
          <div className="grid grid-cols-2 gap-3">
            <Info label="Serveur" value={view.guild?.name ?? '—'} />
            <Info label="Discord ID" value={view.discordId} />
            <Info label="Niveau" value={String(view.level)} />
            <Info label="XP" value={String(view.xp)} />
            <Info label="Inscrit le" value={fmtDate(view.createdAt)} />
            <Info label="Anniversaire" value={view.birthday ?? '—'} />
          </div>
          {view.isBanned && (
            <div className="mt-4 rounded-[10px] border border-danger/40 bg-danger/10 p-3 text-[13px]">
              <b className="text-danger">Banni</b> — {view.banReason || 'sans raison'}
            </div>
          )}
          <div className="mt-4 text-[12px] font-bold uppercase tracking-wide text-ink-2">
            Avertissements ({view.warnings?.length ?? 0})
          </div>
          <div className="mt-2 flex max-h-[220px] flex-col gap-2 overflow-y-auto">
            {(view.warnings ?? []).map((w) => (
              <div key={w.id} className="rounded-[10px] border border-white/8 bg-surface px-3 py-2 text-[13px]">
                <div>{w.reason}</div>
                <div className="mt-1 text-[11px] text-ink-3">
                  Par {w.moderator} · {fmtDate(w.createdAt)}
                </div>
              </div>
            ))}
            {!view.warnings?.length && <p className="text-[13px] text-ink-3">Aucun avertissement.</p>}
          </div>
        </Modal>
      )}
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[10px] border border-white/8 bg-surface px-3 py-2.5">
      <div className="text-[11px] font-semibold uppercase tracking-wide text-ink-3">{label}</div>
      <div className="mt-1 truncate text-[13.5px] font-medium">{value}</div>
    </div>
  );
}
