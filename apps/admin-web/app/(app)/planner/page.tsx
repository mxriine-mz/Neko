'use client';

import { useEffect, useState } from 'react';
import { Plus, KanbanSquare, GanttChartSquare, Pencil, Trash2 } from 'lucide-react';
import { apiGet, apiPost, apiPatch, apiDelete } from '@/lib/api';
import { useUI } from '@/components/ui/feedback';
import { btn, btnPrimary } from '@/lib/ui';
import Board from '@/components/planner/Board';
import Gantt from '@/components/planner/Gantt';
import TaskViewModal from '@/components/planner/TaskViewModal';
import TaskEditModal from '@/components/planner/TaskEditModal';
import type { Planner, Task, BoardColumn } from '@/lib/types';

export default function PlannerPage() {
  const { toast, prompt, promptFields, confirm } = useUI();
  const [planners, setPlanners] = useState<Planner[]>([]);
  const [curId, setCurId] = useState<string | null>(null);
  const [view, setView] = useState<'board' | 'gantt'>('board');
  const [loaded, setLoaded] = useState(false);

  const [viewTask, setViewTask] = useState<Task | null>(null);
  const [editTask, setEditTask] = useState<{ task: Task | null; columnId?: string } | null>(null);

  useEffect(() => {
    apiGet<Planner[]>('/api/planners')
      .then((p) => {
        setPlanners(p);
        if (p[0]) setCurId(p[0].id);
        setLoaded(true);
      })
      .catch((e) => toast((e as Error).message, 'error'));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const planner = planners.find((p) => p.id === curId) ?? null;

  function patchPlanner(id: string, fn: (p: Planner) => Planner) {
    setPlanners((prev) => prev.map((p) => (p.id === id ? fn(p) : p)));
  }

  // ── Planners ──
  async function newPlanner() {
    const res = await promptFields({
      title: 'Nouveau planner',
      okText: 'Créer',
      fields: [
        { label: 'Nom du planner', value: 'Nouveau planner', placeholder: 'Ex. Sprint produit' },
        {
          label: 'Catégories / colonnes (séparées par des virgules)',
          value: 'À faire, En cours, À revoir, Terminé',
          multiline: true,
        },
      ],
    });
    if (!res) return;
    const [name, cats] = res;
    try {
      const p = await apiPost<Planner>('/api/planners', {
        name,
        categories: (cats || '').split(',').map((s) => s.trim()).filter(Boolean),
      });
      setPlanners((prev) => [...prev, p]);
      setCurId(p.id);
    } catch (e) {
      toast((e as Error).message, 'error');
    }
  }
  async function renamePlanner(p: Planner) {
    const name = await prompt({ title: 'Renommer le planner', label: 'Nom', value: p.name, okText: 'Renommer' });
    if (name === null) return;
    try {
      await apiPatch(`/api/planners/${p.id}`, { name });
      patchPlanner(p.id, (x) => ({ ...x, name: name.trim() || x.name }));
    } catch (e) {
      toast((e as Error).message, 'error');
    }
  }
  async function deletePlanner(p: Planner) {
    if (!(await confirm({ title: 'Supprimer le planner', message: <>Supprimer <b>« {p.name} »</b> et ses {p.tasks.length} tâche(s) ?</>, danger: true }))) return;
    try {
      await apiDelete(`/api/planners/${p.id}`);
      setPlanners((prev) => {
        const next = prev.filter((x) => x.id !== p.id);
        if (curId === p.id) setCurId(next[0]?.id ?? null);
        return next;
      });
    } catch (e) {
      toast((e as Error).message, 'error');
    }
  }

  // ── Colonnes ──
  async function addColumn() {
    if (!planner) return;
    const name = await prompt({ title: 'Nouvelle colonne', label: 'Nom de la colonne', placeholder: 'Ex. En revue', okText: 'Ajouter' });
    if (!name || !name.trim()) return;
    try {
      const col = await apiPost<BoardColumn>('/api/columns', { plannerId: planner.id, name });
      patchPlanner(planner.id, (p) => ({ ...p, columns: [...p.columns, col] }));
    } catch (e) {
      toast((e as Error).message, 'error');
    }
  }
  async function renameColumn(col: BoardColumn) {
    if (!planner) return;
    const name = await prompt({ title: 'Renommer la colonne', label: 'Nom', value: col.name, okText: 'Renommer' });
    if (name === null) return;
    try {
      await apiPatch(`/api/columns/${col.id}`, { name });
      patchPlanner(planner.id, (p) => ({ ...p, columns: p.columns.map((c) => (c.id === col.id ? { ...c, name: name.trim() || c.name } : c)) }));
    } catch (e) {
      toast((e as Error).message, 'error');
    }
  }
  async function deleteColumn(col: BoardColumn) {
    if (!planner) return;
    const n = planner.tasks.filter((t) => t.columnId === col.id).length;
    if (!(await confirm({ title: 'Supprimer la colonne', message: <>Supprimer <b>« {col.name} »</b>{n ? ` et ses ${n} tâche(s)` : ''} ?</>, danger: true }))) return;
    try {
      await apiDelete(`/api/columns/${col.id}`);
      patchPlanner(planner.id, (p) => ({
        ...p,
        columns: p.columns.filter((c) => c.id !== col.id),
        tasks: p.tasks.filter((t) => t.columnId !== col.id),
      }));
    } catch (e) {
      toast((e as Error).message, 'error');
    }
  }

  // ── Tâches ──
  async function moveTask(taskId: string, columnId: string) {
    if (!planner) return;
    const t = planner.tasks.find((x) => x.id === taskId);
    if (!t || t.columnId === columnId) return;
    patchPlanner(planner.id, (p) => ({ ...p, tasks: p.tasks.map((x) => (x.id === taskId ? { ...x, columnId } : x)) }));
    try {
      await apiPatch(`/api/tasks/${taskId}`, { columnId });
    } catch (e) {
      toast((e as Error).message, 'error');
    }
  }
  function onTaskSaved(t: Task, isNew: boolean) {
    if (!planner) return;
    patchPlanner(planner.id, (p) => ({
      ...p,
      tasks: isNew ? [...p.tasks, t] : p.tasks.map((x) => (x.id === t.id ? { ...x, ...t } : x)),
    }));
    setEditTask(null);
    if (viewTask && viewTask.id === t.id) setViewTask({ ...viewTask, ...t });
  }
  function onTaskChange(t: Task) {
    if (!planner) return;
    patchPlanner(planner.id, (p) => ({ ...p, tasks: p.tasks.map((x) => (x.id === t.id ? t : x)) }));
  }
  async function deleteTask(t: Task) {
    if (!planner) return;
    if (!(await confirm({ title: 'Supprimer la tâche', message: <>Supprimer <b>« {t.title || 'Sans titre'} »</b> ?</>, danger: true }))) return;
    try {
      await apiDelete(`/api/tasks/${t.id}`);
      patchPlanner(planner.id, (p) => ({ ...p, tasks: p.tasks.filter((x) => x.id !== t.id) }));
      setViewTask(null);
    } catch (e) {
      toast((e as Error).message, 'error');
    }
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Barre planners + vue */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex flex-wrap items-center gap-1.5">
          {planners.map((p) => (
            <button
              key={p.id}
              onClick={() => setCurId(p.id)}
              className={`group flex items-center gap-2 rounded-full px-3.5 py-1.5 text-[13px] font-semibold transition ${
                curId === p.id ? 'brand-grad text-[#06121f]' : 'border border-white/8 bg-surface-2 text-ink-2 hover:text-ink'
              }`}
            >
              {p.name}
              {curId === p.id && (
                <span className="flex items-center gap-1">
                  <Pencil
                    className="size-3.5 opacity-70 hover:opacity-100"
                    onClick={(e) => {
                      e.stopPropagation();
                      renamePlanner(p);
                    }}
                  />
                  <Trash2
                    className="size-3.5 opacity-70 hover:opacity-100"
                    onClick={(e) => {
                      e.stopPropagation();
                      deletePlanner(p);
                    }}
                  />
                </span>
              )}
            </button>
          ))}
          <button onClick={newPlanner} className="flex size-8 items-center justify-center rounded-full border border-white/8 bg-surface-2 text-ink-2 hover:text-ink">
            <Plus className="size-4" />
          </button>
        </div>

        <div className="ml-auto flex items-center gap-2">
          {planner && (
            <div className="flex items-center rounded-[10px] border border-white/8 bg-surface-2 p-1">
              <button
                onClick={() => setView('board')}
                className={`flex items-center gap-1.5 rounded-[7px] px-3 py-1.5 text-[12.5px] font-semibold ${view === 'board' ? 'bg-white/[0.08] text-ink' : 'text-ink-3'}`}
              >
                <KanbanSquare className="size-4" /> Tableau
              </button>
              <button
                onClick={() => setView('gantt')}
                className={`flex items-center gap-1.5 rounded-[7px] px-3 py-1.5 text-[12.5px] font-semibold ${view === 'gantt' ? 'bg-white/[0.08] text-ink' : 'text-ink-3'}`}
              >
                <GanttChartSquare className="size-4" /> Gantt
              </button>
            </div>
          )}
          {planner && planner.columns.length > 0 && (
            <button onClick={() => setEditTask({ task: null })} className={btnPrimary}>
              <Plus className="size-4" /> Nouvelle tâche
            </button>
          )}
        </div>
      </div>

      {/* Contenu */}
      {!planner ? (
        <div className="flex flex-col items-center justify-center gap-4 rounded-[16px] border border-dashed border-white/10 py-20 text-center">
          <KanbanSquare className="size-12 text-ink-3" />
          <div className="text-ink-3">
            {loaded ? 'Aucun planner. Crée-en un pour commencer.' : 'Chargement…'}
          </div>
          {loaded && (
            <button onClick={newPlanner} className={btnPrimary}>
              <Plus className="size-4" /> Nouveau planner
            </button>
          )}
        </div>
      ) : view === 'board' ? (
        <Board
          planner={planner}
          onMoveTask={moveTask}
          onOpenTask={setViewTask}
          onAddTask={(columnId) => setEditTask({ task: null, columnId })}
          onAddColumn={addColumn}
          onRenameColumn={renameColumn}
          onDeleteColumn={deleteColumn}
        />
      ) : (
        <Gantt planner={planner} onOpenTask={setViewTask} />
      )}

      {/* Modales */}
      {viewTask && planner && (
        <TaskViewModal
          planner={planner}
          task={planner.tasks.find((t) => t.id === viewTask.id) ?? viewTask}
          onClose={() => setViewTask(null)}
          onEdit={() => {
            const t = planner.tasks.find((x) => x.id === viewTask.id) ?? viewTask;
            setViewTask(null);
            setEditTask({ task: t });
          }}
          onDelete={() => deleteTask(viewTask)}
          onTaskChange={onTaskChange}
        />
      )}
      {editTask && planner && (
        <TaskEditModal
          planner={planner}
          task={editTask.task}
          defaultColumnId={editTask.columnId}
          onClose={() => setEditTask(null)}
          onSaved={onTaskSaved}
        />
      )}
    </div>
  );
}
