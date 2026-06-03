'use client';

import {
  Server,
  Users,
  Terminal,
  AlertTriangle,
  Cpu,
  Database,
  Save,
  Clock,
  Activity,
  type LucideIcon,
} from 'lucide-react';
import { usePolling } from '@/lib/hooks';
import { fmtBytes, fmtUptime, fmtDateTime } from '@/lib/utils';
import type { Stats, SystemInfo } from '@/lib/types';
import { MemoryDonut, CommandsBars } from '@/components/dashboard/Charts';

function Kpi({ icon: Icon, label, value, accent }: { icon: LucideIcon; label: string; value: string | number; accent: string }) {
  return (
    <div className="flex items-center gap-4 rounded-[16px] border border-white/8 bg-surface-2 p-[18px]">
      <div className="flex size-11 shrink-0 items-center justify-center rounded-[12px]" style={{ background: `${accent}1f`, color: accent }}>
        <Icon className="size-5" strokeWidth={2} />
      </div>
      <div className="min-w-0">
        <div className="text-[24px] font-extrabold leading-none">{value}</div>
        <div className="mt-1.5 text-[12.5px] text-ink-3">{label}</div>
      </div>
    </div>
  );
}

function Panel({ icon: Icon, title, children }: { icon: LucideIcon; title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-[16px] border border-white/8 bg-surface-2 p-5">
      <div className="mb-4 flex items-center gap-2.5 text-[13px] font-bold uppercase tracking-wide text-ink-2">
        <Icon className="size-[15px] text-sky" />
        {title}
      </div>
      {children}
    </div>
  );
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-white/[0.05] py-2 text-[13px] last:border-0">
      <span className="text-ink-3">{label}</span>
      <span className="truncate font-semibold text-ink">{value}</span>
    </div>
  );
}

export default function DashboardPage() {
  const { data: stats } = usePolling<Stats>('/api/stats', 15000);
  const { data: sys } = usePolling<SystemInfo>('/api/system', 10000);

  return (
    <div className="flex flex-col gap-5">
      {/* KPIs bot */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Kpi icon={Server} label="Serveurs" value={stats?.totalGuilds ?? '—'} accent="#38bdf8" />
        <Kpi icon={Users} label="Membres" value={stats?.totalUsers ?? '—'} accent="#34d399" />
        <Kpi icon={Terminal} label="Commandes" value={sys?.commands.total ?? '—'} accent="#a78bfa" />
        <Kpi icon={AlertTriangle} label="Avertissements" value={stats?.totalWarnings ?? '—'} accent="#fbbf24" />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* Ressources */}
        <Panel icon={Activity} title="Ressources">
          {sys ? (
            <>
              <MemoryDonut used={sys.memory.used} total={sys.memory.total} />
              <div className="mt-2">
                <Row label="RAM totale" value={fmtBytes(sys.memory.total)} />
                <Row label="RAM libre" value={fmtBytes(sys.memory.free)} />
                <Row label="Process (RSS)" value={fmtBytes(sys.memory.process)} />
                <Row label="Charge CPU (1min)" value={sys.cpu.load1.toFixed(2)} />
              </div>
            </>
          ) : (
            <Skeleton />
          )}
        </Panel>

        {/* Système */}
        <Panel icon={Cpu} title="Système">
          {sys ? (
            <div>
              <Row label="Node" value={sys.node} />
              <Row label="Plateforme" value={sys.platform} />
              <Row label="Hôte" value={sys.hostname} />
              <Row label="CPU" value={`${sys.cpu.cores} cœurs`} />
              <Row label="Uptime système" value={fmtUptime(sys.uptimeSystem)} />
              <Row label="Uptime process" value={fmtUptime(sys.uptimeProcess)} />
            </div>
          ) : (
            <Skeleton />
          )}
        </Panel>

        {/* Base + Sauvegardes */}
        <div className="flex flex-col gap-4">
          <Panel icon={Database} title="Base de données">
            {sys ? (
              <div>
                <Row label="Latence" value={sys.db.latencyMs != null ? `${sys.db.latencyMs} ms` : 'indispo'} />
                <Row label="Taille" value={fmtBytes(sys.db.sizeBytes)} />
              </div>
            ) : (
              <Skeleton />
            )}
          </Panel>
          <Panel icon={Save} title="Sauvegardes">
            {sys ? (
              sys.backups ? (
                <div>
                  <Row label="Nombre" value={sys.backups.count} />
                  <Row label="Taille totale" value={fmtBytes(sys.backups.totalSize)} />
                  <Row
                    label="Dernière"
                    value={sys.backups.last ? fmtDateTime(sys.backups.last.mtime) : '—'}
                  />
                </div>
              ) : (
                <p className="text-[13px] text-ink-3">Aucun dossier de sauvegarde.</p>
              )
            ) : (
              <Skeleton />
            )}
          </Panel>
        </div>
      </div>

      {/* Commandes par catégorie */}
      <Panel icon={Clock} title="Commandes par catégorie">
        {sys ? <CommandsBars categories={sys.commands.categories} /> : <Skeleton />}
      </Panel>
    </div>
  );
}

function Skeleton() {
  return <div className="h-24 animate-pulse rounded-lg bg-white/[0.04]" />;
}
