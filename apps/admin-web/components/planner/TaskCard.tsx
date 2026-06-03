'use client';

import { Calendar, CheckSquare } from 'lucide-react';
import { fmtRange, initial } from '@/lib/utils';
import type { Task } from '@/lib/types';

export default function TaskCard({
  task,
  onOpen,
  onDragStart,
  onDragEnd,
}: {
  task: Task;
  onOpen: () => void;
  onDragStart: () => void;
  onDragEnd: () => void;
}) {
  const subs = task.subtasks ?? [];
  const done = subs.filter((s) => s.done).length;

  return (
    <div
      draggable
      onDragStart={(e) => {
        e.dataTransfer.effectAllowed = 'move';
        try {
          e.dataTransfer.setData('text/plain', task.id);
        } catch {
          /* ignore */
        }
        onDragStart();
      }}
      onDragEnd={onDragEnd}
      onClick={onOpen}
      className="cursor-pointer rounded-[12px] border border-white/8 bg-surface p-3 transition hover:border-white/[0.16] active:opacity-60"
    >
      {!!task.tags.length && (
        <div className="mb-2 flex flex-wrap gap-1.5">
          {task.tags.map((t, i) => (
            <span key={i} className="rounded-full bg-accent/15 px-2 py-0.5 text-[10.5px] font-semibold text-sky">
              {t}
            </span>
          ))}
        </div>
      )}
      <div className="text-[13.5px] font-semibold leading-snug text-ink">{task.title || 'Sans titre'}</div>
      {task.description && (
        <div className="mt-1 line-clamp-2 text-[12px] text-ink-3">{task.description}</div>
      )}
      <div className="mt-2.5 flex min-h-[24px] items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          {(task.start || task.end) && (
            <span className="inline-flex items-center gap-1 text-[11px] text-ink-3">
              <Calendar className="size-3" />
              {fmtRange(task.start, task.end)}
            </span>
          )}
          {!!subs.length && (
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-ink-3">
              <CheckSquare className="size-3 text-success" />
              {done}/{subs.length}
            </span>
          )}
        </div>
        {task.assignee && (
          <span
            title={task.assignee}
            className="flex size-6 items-center justify-center rounded-full brand-grad text-[11px] font-bold text-[#06121f]"
          >
            {initial(task.assignee)}
          </span>
        )}
      </div>
    </div>
  );
}
