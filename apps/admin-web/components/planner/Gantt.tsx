'use client';

import { Calendar } from 'lucide-react';
import { colColor, fmtRange } from '@/lib/utils';
import type { Planner, Task } from '@/lib/types';

const DAY = 86400000;

export default function Gantt({ planner, onOpenTask }: { planner: Planner; onOpenTask: (t: Task) => void }) {
  const colIndex = (colId: string) => Math.max(0, planner.columns.findIndex((c) => c.id === colId));

  const dated = planner.tasks.filter((t) => t.start && t.end && new Date(t.start) <= new Date(t.end!));
  const undated = planner.tasks.filter((t) => !(t.start && t.end && new Date(t.start) <= new Date(t.end!)));

  if (!dated.length) {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex flex-col items-center justify-center gap-3 rounded-[14px] border border-dashed border-white/10 py-16 text-center text-ink-3">
          <Calendar className="size-10" />
          <div>
            Aucune tâche avec dates de début et de fin.
            <br />
            Ajoute des dates pour voir le Gantt.
          </div>
        </div>
        {!!undated.length && <Unscheduled tasks={undated} onOpenTask={onOpenTask} />}
      </div>
    );
  }

  const min = new Date(Math.min(...dated.map((t) => +new Date(t.start!))));
  min.setHours(0, 0, 0, 0);
  const max = new Date(Math.max(...dated.map((t) => +new Date(t.end!))));
  max.setHours(0, 0, 0, 0);
  const totalDays = Math.round((+max - +min) / DAY) + 1;

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayPct = +today >= +min && +today <= +max ? (Math.round((+today - +min) / DAY) / totalDays) * 100 : null;

  // 4 repères de dates
  const ticks = Array.from({ length: 5 }, (_, i) => {
    const d = new Date(+min + Math.round((totalDays - 1) * (i / 4)) * DAY);
    return { pct: (i / 4) * 100, label: d.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' }) };
  });

  return (
    <div className="flex flex-col gap-4">
      <div className="overflow-hidden rounded-[14px] border border-white/8 bg-surface-2">
        {/* En-tête dates */}
        <div className="relative ml-[200px] h-7 border-b border-white/8">
          {ticks.map((t, i) => (
            <span
              key={i}
              className="absolute top-1.5 -translate-x-1/2 text-[11px] text-ink-3"
              style={{ left: `${t.pct}%` }}
            >
              {t.label}
            </span>
          ))}
        </div>

        <div className="flex flex-col">
          {dated.map((t) => {
            const start = new Date(t.start!);
            start.setHours(0, 0, 0, 0);
            const end = new Date(t.end!);
            end.setHours(0, 0, 0, 0);
            const left = (Math.round((+start - +min) / DAY) / totalDays) * 100;
            const width = ((Math.round((+end - +start) / DAY) + 1) / totalDays) * 100;
            const color = colColor(colIndex(t.columnId));
            return (
              <div key={t.id} className="flex items-center border-b border-white/[0.05] last:border-0">
                <div className="w-[200px] shrink-0 truncate px-3.5 py-2.5 text-[12.5px] font-medium" title={t.title}>
                  {t.title}
                </div>
                <div className="relative h-9 flex-1">
                  {todayPct != null && (
                    <span className="absolute top-0 z-[1] h-full w-px bg-danger/60" style={{ left: `${todayPct}%` }} />
                  )}
                  <button
                    onClick={() => onOpenTask(t)}
                    title={`${t.title} · ${fmtRange(t.start, t.end)}`}
                    className="absolute top-1/2 flex h-[22px] -translate-y-1/2 items-center overflow-hidden rounded-[6px] px-2 text-[11px] font-semibold text-[#06121f] transition hover:brightness-110"
                    style={{ left: `${left}%`, width: `max(${width}%, 24px)`, background: color }}
                  >
                    <span className="truncate">{t.title}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {!!undated.length && <Unscheduled tasks={undated} onOpenTask={onOpenTask} />}
    </div>
  );
}

function Unscheduled({ tasks, onOpenTask }: { tasks: Task[]; onOpenTask: (t: Task) => void }) {
  return (
    <div className="flex flex-wrap items-center gap-2 rounded-[12px] border border-white/8 bg-surface-2 px-4 py-3">
      <span className="inline-flex items-center gap-1.5 text-[12px] text-ink-3">
        <Calendar className="size-3.5" /> Sans dates :
      </span>
      {tasks.map((t) => (
        <button
          key={t.id}
          onClick={() => onOpenTask(t)}
          className="rounded-full bg-white/[0.06] px-2.5 py-1 text-[11.5px] text-ink-2 hover:bg-white/[0.1] hover:text-ink"
        >
          {t.title || 'Sans titre'}
        </button>
      ))}
    </div>
  );
}
