'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { Search, Pencil, Trash2, Users, ChevronRight } from 'lucide-react';
import { usePolling } from '@/lib/hooks';
import { apiPut, apiDelete } from '@/lib/api';
import { useUI } from '@/components/ui/feedback';
import Modal from '@/components/ui/Modal';
import { btn, btnGhost, btnPrimary, field, label } from '@/lib/ui';
import { initial } from '@/lib/utils';
import type { Guild } from '@/lib/types';

const MODULES: { key: keyof Guild; label: string }[] = [
  { key: 'ticketEnabled', label: 'Tickets' },
  { key: 'levelEnabled', label: 'Niveaux' },
  { key: 'welcomeEnabled', label: 'Bienvenue' },
  { key: 'modEnabled', label: 'Modération' },
  { key: 'birthdayEnabled', label: 'Anniv.' },
];

export default function ServersPage() {
  const { data: guilds, reload } = usePolling<Guild[]>('/api/guilds', 15000);
  const { toast, confirm } = useUI();
  const [q, setQ] = useState('');
  const [editing, setEditing] = useState<Guild | null>(null);

  const filtered = useMemo(
    () => (guilds ?? []).filter((g) => g.name.toLowerCase().includes(q.toLowerCase())),
    [guilds, q],
  );

  async function onDelete(g: Guild) {
    if (
      !(await confirm({
        title: 'Supprimer le serveur',
        message: (
          <>
            Supprimer <b>« {g.name} »</b> et toutes ses données (membres, avertissements) ?
          </>
        ),
        danger: true,
      }))
    )
      return;
    try {
      await apiDelete(`/api/guilds/${g.id}`);
      toast('Serveur supprimé', 'success');
      reload();
    } catch (e) {
      toast((e as Error).message, 'error');
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2 rounded-[11px] border border-white/8 bg-surface-2 px-3 py-2">
        <Search className="size-4 text-ink-3" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Rechercher un serveur…"
          className="w-full bg-transparent text-[13.5px] text-ink outline-none"
        />
      </div>

      <div className="grid grid-cols-1 gap-3.5 md:grid-cols-2 xl:grid-cols-3">
        {filtered.map((g) => (
          <div
            key={g.id}
            className="group flex flex-col gap-3 rounded-[16px] border border-white/8 bg-surface-2 p-[18px] transition hover:border-white/[0.16]"
          >
            <div className="flex items-center gap-3">
              <div className="flex size-11 shrink-0 items-center justify-center rounded-[12px] brand-grad text-[16px] font-bold text-[#06121f]">
                {initial(g.name)}
              </div>
              <div className="min-w-0 flex-1">
                <div className="truncate font-bold">{g.name}</div>
                <div className="flex items-center gap-1.5 text-[12px] text-ink-3">
                  <Users className="size-3.5" />
                  {g._count?.users ?? g.users?.length ?? 0} membres
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {MODULES.filter((m) => g[m.key]).map((m) => (
                <span
                  key={m.key}
                  className="rounded-full bg-accent/15 px-2 py-0.5 text-[10.5px] font-semibold text-sky"
                >
                  {m.label}
                </span>
              ))}
              {MODULES.every((m) => !g[m.key]) && (
                <span className="text-[11px] text-ink-3">Aucun module activé</span>
              )}
            </div>

            <div className="mt-1 flex items-center gap-2">
              <Link href={`/servers/${g.id}`} className={`${btnPrimary} flex-1`}>
                Détails <ChevronRight className="size-4" />
              </Link>
              <button onClick={() => setEditing(g)} className={btn} title="Modifier">
                <Pencil className="size-4" />
              </button>
              <button onClick={() => onDelete(g)} className={`${btn} hover:!text-danger`} title="Supprimer">
                <Trash2 className="size-4" />
              </button>
            </div>
          </div>
        ))}
        {guilds && !filtered.length && (
          <p className="col-span-full py-10 text-center text-ink-3">Aucun serveur.</p>
        )}
      </div>

      {editing && (
        <EditGuildModal
          guild={editing}
          onClose={() => setEditing(null)}
          onSaved={() => {
            setEditing(null);
            reload();
          }}
        />
      )}
    </div>
  );
}

function EditGuildModal({
  guild,
  onClose,
  onSaved,
}: {
  guild: Guild;
  onClose: () => void;
  onSaved: () => void;
}) {
  const { toast } = useUI();
  const [name, setName] = useState(guild.name);
  const [prefix, setPrefix] = useState(guild.prefix);
  const [mods, setMods] = useState<Record<string, boolean>>(
    Object.fromEntries(MODULES.map((m) => [m.key, !!guild[m.key]])),
  );
  const [saving, setSaving] = useState(false);

  async function save() {
    setSaving(true);
    try {
      await apiPut(`/api/guilds/${guild.id}`, { name, prefix, ...mods });
      toast('Serveur mis à jour', 'success');
      onSaved();
    } catch (e) {
      toast((e as Error).message, 'error');
      setSaving(false);
    }
  }

  return (
    <Modal
      open
      onClose={onClose}
      title="Configurer le serveur"
      maxWidth={520}
      footer={
        <>
          <button className={btnGhost} onClick={onClose}>
            Annuler
          </button>
          <button className={btnPrimary} onClick={save} disabled={saving}>
            Enregistrer
          </button>
        </>
      }
    >
      <div className="grid grid-cols-2 gap-3.5">
        <div>
          <label className={label}>Nom</label>
          <input className={field} value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div>
          <label className={label}>Préfixe</label>
          <input className={field} value={prefix} onChange={(e) => setPrefix(e.target.value)} />
        </div>
      </div>
      <div className="mt-4 text-[12px] font-bold uppercase tracking-wide text-ink-2">Modules</div>
      <div className="mt-2 flex flex-col gap-1.5">
        {MODULES.map((m) => (
          <label
            key={m.key}
            className="flex cursor-pointer items-center justify-between rounded-[10px] border border-white/8 bg-surface-2 px-3.5 py-2.5 text-[13.5px]"
          >
            {m.label}
            <input
              type="checkbox"
              checked={mods[m.key]}
              onChange={(e) => setMods((s) => ({ ...s, [m.key]: e.target.checked }))}
              className="size-4 accent-accent"
            />
          </label>
        ))}
      </div>
    </Modal>
  );
}
