'use client';

import { useMemo, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  Users,
  UserCheck,
  Ban,
  Ticket,
  Cake,
  AlertTriangle,
  Pencil,
  Trash2,
  type LucideIcon,
} from 'lucide-react';
import { usePolling } from '@/lib/hooks';
import { apiPut, apiDelete } from '@/lib/api';
import { useUI } from '@/components/ui/feedback';
import Modal from '@/components/ui/Modal';
import { btn, btnGhost, btnPrimary, field, label } from '@/lib/ui';
import { initial } from '@/lib/utils';
import type { Guild, BotUser } from '@/lib/types';

function Kpi({ icon: Icon, label, value, accent }: { icon: LucideIcon; label: string; value: number; accent: string }) {
  return (
    <div className="flex items-center gap-3 rounded-[14px] border border-white/8 bg-surface-2 p-3.5">
      <div className="flex size-9 shrink-0 items-center justify-center rounded-[10px]" style={{ background: `${accent}1f`, color: accent }}>
        <Icon className="size-[18px]" />
      </div>
      <div>
        <div className="text-[20px] font-extrabold leading-none">{value}</div>
        <div className="mt-1 text-[11.5px] text-ink-3">{label}</div>
      </div>
    </div>
  );
}

export default function ServerDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data: guild, reload } = usePolling<Guild>(`/api/guilds/${id}`, 15000);
  const { toast, confirm } = useUI();
  const [editing, setEditing] = useState<BotUser | null>(null);

  const members = guild?.users ?? [];
  const stats = useMemo(() => {
    return {
      total: members.length,
      active: members.filter((u) => u.inGuild).length,
      banned: members.filter((u) => u.isBanned).length,
      tickets: members.filter((u) => u.hasTicket).length,
      birthdays: members.filter((u) => u.birthday).length,
      warnings: members.reduce((a, u) => a + (u.warnings?.length ?? 0), 0),
    };
  }, [members]);

  async function onDelete(u: BotUser) {
    if (
      !(await confirm({
        title: 'Supprimer le membre',
        message: (
          <>
            Supprimer <b>« {u.username} »</b> de ce serveur ?
          </>
        ),
        danger: true,
      }))
    )
      return;
    try {
      await apiDelete(`/api/users/${u.discordId}/${u.guildId}`);
      toast('Membre supprimé', 'success');
      reload();
    } catch (e) {
      toast((e as Error).message, 'error');
    }
  }

  return (
    <div className="flex flex-col gap-5">
      <Link href="/servers" className="inline-flex w-fit items-center gap-1.5 text-[13px] text-ink-2 hover:text-ink">
        <ArrowLeft className="size-4" /> Retour aux serveurs
      </Link>

      <div className="flex items-center gap-3.5">
        <div className="flex size-12 shrink-0 items-center justify-center rounded-[14px] brand-grad text-[18px] font-bold text-[#06121f]">
          {initial(guild?.name)}
        </div>
        <div>
          <h2 className="text-[20px] font-extrabold">{guild?.name ?? '…'}</h2>
          <div className="text-[12.5px] text-ink-3">Préfixe : {guild?.prefix ?? '—'}</div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
        <Kpi icon={Users} label="Membres" value={stats.total} accent="#38bdf8" />
        <Kpi icon={UserCheck} label="Actifs" value={stats.active} accent="#34d399" />
        <Kpi icon={Ban} label="Bannis" value={stats.banned} accent="#f87171" />
        <Kpi icon={Ticket} label="Tickets" value={stats.tickets} accent="#a78bfa" />
        <Kpi icon={Cake} label="Anniversaires" value={stats.birthdays} accent="#f472b6" />
        <Kpi icon={AlertTriangle} label="Avertissements" value={stats.warnings} accent="#fbbf24" />
      </div>

      {/* Membres */}
      <div className="overflow-hidden rounded-[16px] border border-white/8 bg-surface-2">
        <div className="border-b border-white/8 px-5 py-3.5 text-[13px] font-bold uppercase tracking-wide text-ink-2">
          Membres ({stats.total})
        </div>
        <div className="divide-y divide-white/[0.05]">
          {members.map((u) => (
            <div key={u.id} className="flex items-center gap-3 px-5 py-3">
              <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-surface-3 text-[13px] font-bold text-ink-2">
                {initial(u.username)}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="truncate font-semibold">{u.username}</span>
                  {u.isBanned && <Pill color="#f87171">Banni</Pill>}
                  {u.hasTicket && <Pill color="#a78bfa">Ticket</Pill>}
                  {u.birthday && <Pill color="#f472b6">{u.birthday}</Pill>}
                  {!u.inGuild && <Pill color="#71717a">Parti</Pill>}
                </div>
                <div className="text-[12px] text-ink-3">
                  Niveau {u.level} · {u.xp} XP · {u.warnings?.length ?? 0} avert.
                </div>
              </div>
              <button onClick={() => setEditing(u)} className={btn} title="Modifier">
                <Pencil className="size-4" />
              </button>
              <button onClick={() => onDelete(u)} className={`${btn} hover:!text-danger`} title="Supprimer">
                <Trash2 className="size-4" />
              </button>
            </div>
          ))}
          {guild && !members.length && (
            <p className="px-5 py-10 text-center text-ink-3">Aucun membre enregistré.</p>
          )}
        </div>
      </div>

      {editing && (
        <EditUserModal
          user={editing}
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

function Pill({ color, children }: { color: string; children: React.ReactNode }) {
  return (
    <span className="rounded-full px-2 py-0.5 text-[10.5px] font-semibold" style={{ background: `${color}22`, color }}>
      {children}
    </span>
  );
}

function EditUserModal({ user, onClose, onSaved }: { user: BotUser; onClose: () => void; onSaved: () => void }) {
  const { toast } = useUI();
  const [level, setLevel] = useState(String(user.level));
  const [xp, setXp] = useState(String(user.xp));
  const [isBanned, setIsBanned] = useState(user.isBanned);
  const [banReason, setBanReason] = useState(user.banReason ?? '');
  const [saving, setSaving] = useState(false);

  async function save() {
    setSaving(true);
    try {
      await apiPut(`/api/users/${user.discordId}/${user.guildId}`, {
        level: parseInt(level) || 0,
        xp: parseInt(xp) || 0,
        isBanned,
        banReason: isBanned ? banReason : null,
      });
      toast('Membre mis à jour', 'success');
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
      title={`Modifier — ${user.username}`}
      maxWidth={460}
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
          <label className={label}>Niveau</label>
          <input className={field} type="number" value={level} onChange={(e) => setLevel(e.target.value)} />
        </div>
        <div>
          <label className={label}>XP</label>
          <input className={field} type="number" value={xp} onChange={(e) => setXp(e.target.value)} />
        </div>
      </div>
      <label className="mt-4 flex cursor-pointer items-center justify-between rounded-[10px] border border-white/8 bg-surface-2 px-3.5 py-2.5 text-[13.5px]">
        Banni
        <input type="checkbox" checked={isBanned} onChange={(e) => setIsBanned(e.target.checked)} className="size-4 accent-accent" />
      </label>
      {isBanned && (
        <div className="mt-3.5">
          <label className={label}>Raison du bannissement</label>
          <input className={field} value={banReason} onChange={(e) => setBanReason(e.target.value)} />
        </div>
      )}
    </Modal>
  );
}
