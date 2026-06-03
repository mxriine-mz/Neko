'use client';

import { useEffect, useRef, useState } from 'react';
import { MoreVertical, Pencil, Trash2, Check, Plus, User, Calendar, Tag, X } from 'lucide-react';
import { useUI } from '@/components/ui/feedback';
import { apiPost, apiPatch, apiDelete } from '@/lib/api';
import { colColor, fmtRange, initial } from '@/lib/utils';
import { btnGhost, btnPrimary } from '@/lib/ui';
import type { Planner, Task, Subtask } from '@/lib/types';

export default function TaskViewModal({
  planner,
  task,
  onClose,
  onEdit,
  onDelete,
  onTaskChange,
}: {
  planner: Planner;
  task: Task;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onTaskChange: (t: Task) => void;
}) {
  const { toast } = useUI();
  const [menu, setMenu] = useState(false);
  const [subs, setSubs] = useState<Subtask[]>(task.subtasks ?? []);
  const [newText, setNewText] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    const onClick = () => setMenu(false);
    document.addEventListener('click', onClick);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('click', onClick);
    };
  }, [onClose]);

  const colIdx = Math.max(0, planner.columns.findIndex((c) => c.id === task.columnId));
  const col = planner.columns[colIdx];
  const color = colColor(colIdx);
  const done = subs.filter((s) => s.done).length;
  const pct = subs.length ? Math.round((done / subs.length) * 100) : 0;

  function sync(next: Subtask[]) {
    setSubs(next);
    onTaskChange({ ...task, subtasks: next });
  }

  async function toggle(s: Subtask) {
    const next = subs.map((x) => (x.id === s.id ? { ...x, done: !x.done } : x));
    sync(next);
    try {
      await apiPatch(`/api/subtasks/${s.id}`, { done: !s.done });
    } catch (e) {
      toast((e as Error).message, 'error');
      sync(subs);
    }
  }
  async function add() {
    const text = newText.trim();
    if (!text) return;
    setNewText('');
    try {
      const s = await apiPost<Subtask>('/api/subtasks', { taskId: task.id, text });
      sync([...subs, s]);
      inputRef.current?.focus();
    } catch (e) {
      toast((e as Error).message, 'error');
    }
  }
  async function removeSub(s: Subtask) {
    sync(subs.filter((x) => x.id !== s.id));
    try {
      await apiDelete(`/api/subtasks/${s.id}`);
    } catch (e) {
      toast((e as Error).message, 'error');
    }
  }

  return (
    <div
      className="anim-fade-up fixed inset-0 z-[1000] flex items-center justify-center bg-black/65 p-5 backdrop-blur-sm"
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="max-h-[90vh] w-full max-w-[560px] overflow-y-auto rounded-[18px] border border-white/8 bg-panel shadow-[0_24px_70px_rgba(0,0,0,0.55)]">
        {/* En-tête : titre + statut */}
        <div className="sticky top-0 z-[1] flex items-center justify-between border-b border-white/8 bg-panel px-[22px] py-[18px]">
          <h2 className="flex items-center gap-2.5 text-[16px] font-bold">
            Détails de la tâche
            <span className="font-normal text-ink-3">—</span>
            <span className="font-bold" style={{ color }}>
              {col?.name ?? 'Sans colonne'}
            </span>
          </h2>
          <div className="flex items-center gap-1">
            <div className="relative">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setMenu((m) => !m);
                }}
                className="flex size-[30px] items-center justify-center rounded-lg text-ink-3 hover:bg-white/[0.06] hover:text-ink"
              >
                <MoreVertical className="size-4" />
              </button>
              {menu && (
                <div
                  className="anim-fade-up absolute right-0 top-[38px] z-[5] min-w-[172px] rounded-[11px] border border-white/[0.14] bg-surface-3 p-1.5 shadow-[0_16px_44px_rgba(0,0,0,0.55)]"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    onClick={() => {
                      setMenu(false);
                      onEdit();
                    }}
                    className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-[13.5px] font-medium text-ink hover:bg-white/[0.07]"
                  >
                    <Pencil className="size-4" /> Modifier
                  </button>
                  <button
                    onClick={() => {
                      setMenu(false);
                      onDelete();
                    }}
                    className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-[13.5px] font-medium text-danger hover:bg-danger/[0.12]"
                  >
                    <Trash2 className="size-4" /> Supprimer
                  </button>
                </div>
              )}
            </div>
            <button
              onClick={onClose}
              className="flex size-[30px] items-center justify-center rounded-lg text-ink-3 hover:bg-white/[0.06] hover:text-ink"
            >
              <X className="size-4" />
            </button>
          </div>
        </div>

        <div className="px-[22px] py-[22px]">
          {/* Titre + tags sur la même ligne */}
          <div className="mb-3.5 flex items-start justify-between gap-3.5">
            <div className="flex-1 text-[19px] font-bold leading-tight">{task.title || 'Sans titre'}</div>
            <div className="flex max-w-[55%] shrink-0 flex-wrap justify-end gap-1.5 pt-0.5">
              {task.tags.length ? (
                task.tags.map((t, i) => (
                  <span key={i} className="rounded-full bg-accent/15 px-2 py-0.5 text-[10.5px] font-semibold text-sky">
                    {t}
                  </span>
                ))
              ) : (
                <span className="text-[12px] italic text-ink-3">Aucun tag</span>
              )}
            </div>
          </div>

          <div className="mb-[18px] whitespace-pre-wrap text-[14px] leading-relaxed text-ink-2">
            {task.description || <span className="italic text-ink-3">Aucune description</span>}
          </div>

          <div className="mb-5 grid grid-cols-2 gap-3">
            <Field icon={User} label="Personne">
              {task.assignee ? (
                <span className="flex items-center gap-2">
                  <span className="flex size-6 items-center justify-center rounded-full brand-grad text-[11px] font-bold text-[#06121f]">
                    {initial(task.assignee)}
                  </span>
                  {task.assignee}
                </span>
              ) : (
                <span className="italic text-ink-3">Non assignée</span>
              )}
            </Field>
            <Field icon={Calendar} label="Dates">
              {task.start || task.end ? fmtRange(task.start, task.end) : <span className="italic text-ink-3">Aucune date</span>}
            </Field>
          </div>

          {/* Sous-tâches */}
          <div className="mb-2 flex items-center justify-between">
            <span className="flex items-center gap-2 text-[12px] font-bold uppercase tracking-wide text-ink-2">
              <Check className="size-3.5" /> Sous-tâches
            </span>
            <span className="text-[12px] font-bold text-ink-3">
              {done}/{subs.length}
            </span>
          </div>
          <div className="mb-3.5 h-[7px] overflow-hidden rounded-full bg-surface-3">
            <div className="h-full rounded-full brand-grad transition-[width] duration-200" style={{ width: `${pct}%` }} />
          </div>

          <div className="mb-3 flex flex-col gap-1.5">
            {subs.map((s) => (
              <div key={s.id} className="group flex items-center gap-2.5 rounded-[10px] border border-white/8 bg-surface-2 px-3 py-2.5">
                <button
                  onClick={() => toggle(s)}
                  className={`flex size-[19px] shrink-0 items-center justify-center rounded-md border transition ${
                    s.done ? 'border-transparent brand-grad text-white' : 'border-white/[0.16] text-transparent hover:border-accent'
                  }`}
                >
                  <Check className="size-3" />
                </button>
                <span className={`flex-1 text-[13.5px] ${s.done ? 'text-ink-3 line-through' : 'text-ink'}`}>{s.text}</span>
                <button onClick={() => removeSub(s)} className="hidden text-ink-3 hover:text-danger group-hover:block">
                  <Trash2 className="size-3.5" />
                </button>
              </div>
            ))}
            {!subs.length && <p className="text-[13px] italic text-ink-3">Aucune sous-tâche pour l’instant.</p>}
          </div>

          <div className="flex gap-2">
            <input
              ref={inputRef}
              value={newText}
              onChange={(e) => setNewText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), add())}
              placeholder="Ajouter une sous-tâche…"
              className="flex-1 rounded-[9px] border border-white/8 bg-surface-2 px-3 py-2.5 text-[13.5px] text-ink outline-none focus:border-accent focus:bg-surface"
            />
            <button onClick={add} className={`${btnPrimary} shrink-0`}>
              <Plus className="size-4" /> Ajouter
            </button>
          </div>
        </div>

        <div className="sticky bottom-0 flex justify-end gap-2.5 border-t border-white/8 bg-panel px-[22px] py-4">
          <button className={btnGhost} onClick={onClose}>
            Fermer
          </button>
          <button className={btnPrimary} onClick={onEdit}>
            <Pencil className="size-4" /> Modifier
          </button>
        </div>
      </div>
    </div>
  );
}

function Field({ icon: Icon, label, children }: { icon: typeof User; label: string; children: React.ReactNode }) {
  return (
    <div className="rounded-[11px] border border-white/8 bg-surface-2 px-3.5 py-3">
      <div className="mb-1.5 flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wide text-ink-3">
        <Icon className="size-3.5" /> {label}
      </div>
      <div className="text-[14px] font-medium text-ink">{children}</div>
    </div>
  );
}
