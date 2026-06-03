'use client';

import { useState } from 'react';
import Modal from '@/components/ui/Modal';
import { useUI } from '@/components/ui/feedback';
import { apiPost, apiPatch } from '@/lib/api';
import { btnGhost, btnPrimary, field, label } from '@/lib/ui';
import type { Planner, Task } from '@/lib/types';

export default function TaskEditModal({
  planner,
  task,
  defaultColumnId,
  onClose,
  onSaved,
}: {
  planner: Planner;
  task: Task | null; // null = création
  defaultColumnId?: string;
  onClose: () => void;
  onSaved: (t: Task, isNew: boolean) => void;
}) {
  const { toast } = useUI();
  const [title, setTitle] = useState(task?.title ?? '');
  const [description, setDescription] = useState(task?.description ?? '');
  const [columnId, setColumnId] = useState(task?.columnId ?? defaultColumnId ?? planner.columns[0]?.id ?? '');
  const [assignee, setAssignee] = useState(task?.assignee ?? '');
  const [start, setStart] = useState(task?.start ?? '');
  const [end, setEnd] = useState(task?.end ?? '');
  const [tags, setTags] = useState((task?.tags ?? []).join(', '));
  const [saving, setSaving] = useState(false);

  async function save() {
    setSaving(true);
    const payload = {
      title: title.trim() || 'Sans titre',
      description: description.trim(),
      columnId,
      assignee: assignee.trim() || null,
      start: start || null,
      end: end || null,
      tags: tags.split(',').map((s) => s.trim()).filter(Boolean),
    };
    try {
      if (task) {
        const updated = await apiPatch<Task>(`/api/tasks/${task.id}`, payload);
        onSaved(updated, false);
      } else {
        const created = await apiPost<Task>('/api/tasks', { plannerId: planner.id, ...payload });
        onSaved(created, true);
      }
    } catch (e) {
      toast((e as Error).message, 'error');
      setSaving(false);
    }
  }

  return (
    <Modal
      open
      onClose={onClose}
      title={task ? 'Modifier la tâche' : 'Nouvelle tâche'}
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
      <div className="mb-3.5">
        <label className={label}>Titre</label>
        <input className={field} value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Titre de la tâche" autoFocus />
      </div>
      <div className="mb-3.5">
        <label className={label}>Description</label>
        <textarea className={`${field} resize-y`} rows={3} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Détails…" />
      </div>
      <div className="grid grid-cols-2 gap-3.5">
        <div>
          <label className={label}>Colonne / Statut</label>
          <select className={field} value={columnId} onChange={(e) => setColumnId(e.target.value)}>
            {planner.columns.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className={label}>Personne</label>
          <input className={field} value={assignee} onChange={(e) => setAssignee(e.target.value)} placeholder="Nom" />
        </div>
        <div>
          <label className={label}>Début</label>
          <input className={field} type="date" value={start} onChange={(e) => setStart(e.target.value)} />
        </div>
        <div>
          <label className={label}>Fin</label>
          <input className={field} type="date" value={end} onChange={(e) => setEnd(e.target.value)} />
        </div>
        <div className="col-span-2">
          <label className={label}>Tags (séparés par des virgules)</label>
          <input className={field} value={tags} onChange={(e) => setTags(e.target.value)} placeholder="urgent, backend, v2" />
        </div>
      </div>
    </Modal>
  );
}
