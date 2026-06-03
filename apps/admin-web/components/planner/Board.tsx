'use client';

import { useState } from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import TaskCard from './TaskCard';
import { colColor } from '@/lib/utils';
import { btn } from '@/lib/ui';
import type { Planner, Task, BoardColumn } from '@/lib/types';

export default function Board({
  planner,
  onMoveTask,
  onOpenTask,
  onAddTask,
  onAddColumn,
  onRenameColumn,
  onDeleteColumn,
}: {
  planner: Planner;
  onMoveTask: (taskId: string, columnId: string) => void;
  onOpenTask: (task: Task) => void;
  onAddTask: (columnId: string) => void;
  onAddColumn: () => void;
  onRenameColumn: (col: BoardColumn) => void;
  onDeleteColumn: (col: BoardColumn) => void;
}) {
  const [dragId, setDragId] = useState<string | null>(null);
  const [overCol, setOverCol] = useState<string | null>(null);

  return (
    <div className="flex gap-4 overflow-x-auto pb-3">
      {planner.columns.map((col, i) => {
        const color = colColor(i);
        const tasks = planner.tasks.filter((t) => t.columnId === col.id);
        return (
          <div
            key={col.id}
            onDragOver={(e) => {
              e.preventDefault();
              e.dataTransfer.dropEffect = 'move';
              setOverCol(col.id);
            }}
            onDragLeave={(e) => {
              if (!e.currentTarget.contains(e.relatedTarget as Node)) setOverCol(null);
            }}
            onDrop={(e) => {
              e.preventDefault();
              setOverCol(null);
              const id = dragId || e.dataTransfer.getData('text/plain');
              if (id) onMoveTask(id, col.id);
              setDragId(null);
            }}
            className={`flex max-h-[calc(100vh-240px)] w-[272px] shrink-0 flex-col rounded-[14px] border bg-surface-2 transition ${
              overCol === col.id ? 'border-accent/60 bg-accent/[0.04]' : 'border-white/8'
            }`}
          >
            <div className="group flex items-center gap-2 border-b border-white/8 px-3.5 py-2.5">
              <span className="size-2.5 rounded-full" style={{ background: color }} />
              <span className="flex-1 truncate text-[13px] font-bold">{col.name}</span>
              <span className="text-[11px] text-ink-3 group-hover:hidden">{tasks.length}</span>
              <button onClick={() => onRenameColumn(col)} className="hidden text-ink-3 hover:text-ink group-hover:block">
                <Pencil className="size-3.5" />
              </button>
              <button onClick={() => onDeleteColumn(col)} className="hidden text-ink-3 hover:text-danger group-hover:block">
                <Trash2 className="size-3.5" />
              </button>
            </div>

            <div className="flex flex-1 flex-col gap-2.5 overflow-y-auto p-2.5">
              {tasks.map((t) => (
                <TaskCard
                  key={t.id}
                  task={t}
                  onOpen={() => onOpenTask(t)}
                  onDragStart={() => setDragId(t.id)}
                  onDragEnd={() => setDragId(null)}
                />
              ))}
              <button
                onClick={() => onAddTask(col.id)}
                className="flex items-center justify-center gap-1.5 rounded-[10px] border border-dashed border-white/10 py-2 text-[12.5px] font-medium text-ink-3 transition hover:border-white/20 hover:text-ink-2"
              >
                <Plus className="size-3.5" /> Ajouter
              </button>
            </div>
          </div>
        );
      })}

      <button
        onClick={onAddColumn}
        className={`${btn} h-fit w-[200px] shrink-0 border-dashed`}
      >
        <Plus className="size-4" /> Nouvelle colonne
      </button>
    </div>
  );
}
