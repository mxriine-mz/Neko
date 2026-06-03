'use client';

import { useEffect, useRef, useState } from 'react';
import { Plus, Trash2, FileText, FolderClosed } from 'lucide-react';
import { apiGet, apiPost, apiPatch, apiDelete } from '@/lib/api';
import { useUI } from '@/components/ui/feedback';
import { fmtDateTime } from '@/lib/utils';
import type { Section, Note } from '@/lib/types';

export default function NotesPage() {
  const { toast, prompt, confirm } = useUI();
  const [sections, setSections] = useState<Section[]>([]);
  const [curSection, setCurSection] = useState<string | null>(null);
  const [curNote, setCurNote] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    apiGet<Section[]>('/api/sections')
      .then((s) => {
        setSections(s);
        if (s[0]) setCurSection(s[0].id);
        setLoaded(true);
      })
      .catch((e) => toast((e as Error).message, 'error'));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const section = sections.find((s) => s.id === curSection) ?? null;
  const note = section?.notes.find((n) => n.id === curNote) ?? null;

  async function addSection() {
    const name = await prompt({ title: 'Nouvelle section', label: 'Nom de la section', value: 'Nouvelle section', okText: 'Créer' });
    if (name === null) return;
    try {
      const s = await apiPost<Section>('/api/sections', { name });
      setSections((prev) => [...prev, { ...s, notes: [] }]);
      setCurSection(s.id);
      setCurNote(null);
    } catch (e) {
      toast((e as Error).message, 'error');
    }
  }
  async function renameSection(s: Section) {
    const name = await prompt({ title: 'Renommer la section', label: 'Nom', value: s.name, okText: 'Renommer' });
    if (name === null) return;
    try {
      await apiPatch(`/api/sections/${s.id}`, { name });
      setSections((prev) => prev.map((x) => (x.id === s.id ? { ...x, name: name.trim() || x.name } : x)));
    } catch (e) {
      toast((e as Error).message, 'error');
    }
  }
  async function deleteSection(s: Section) {
    if (!(await confirm({ title: 'Supprimer la section', message: <>Supprimer <b>« {s.name} »</b> et ses {s.notes.length} note(s) ?</>, danger: true }))) return;
    try {
      await apiDelete(`/api/sections/${s.id}`);
      setSections((prev) => {
        const next = prev.filter((x) => x.id !== s.id);
        if (curSection === s.id) {
          setCurSection(next[0]?.id ?? null);
          setCurNote(null);
        }
        return next;
      });
    } catch (e) {
      toast((e as Error).message, 'error');
    }
  }

  async function addNote() {
    if (!section) {
      toast("Crée d'abord une section.", 'info');
      return;
    }
    try {
      const n = await apiPost<Note>('/api/notes', { sectionId: section.id, title: 'Sans titre' });
      setSections((prev) => prev.map((s) => (s.id === section.id ? { ...s, notes: [n, ...s.notes] } : s)));
      setCurNote(n.id);
    } catch (e) {
      toast((e as Error).message, 'error');
    }
  }
  async function deleteNote(n: Note) {
    if (!(await confirm({ title: 'Supprimer la note', message: <>Supprimer <b>« {n.title || 'Sans titre'} »</b> ?</>, danger: true }))) return;
    try {
      await apiDelete(`/api/notes/${n.id}`);
      setSections((prev) => prev.map((s) => (s.id === n.sectionId ? { ...s, notes: s.notes.filter((x) => x.id !== n.id) } : s)));
      if (curNote === n.id) setCurNote(null);
    } catch (e) {
      toast((e as Error).message, 'error');
    }
  }

  function onNoteSaved(updated: Note) {
    setSections((prev) =>
      prev.map((s) =>
        s.id === updated.sectionId
          ? { ...s, notes: s.notes.map((x) => (x.id === updated.id ? { ...x, ...updated } : x)) }
          : s,
      ),
    );
  }

  return (
    <div className="flex h-[calc(100vh-150px)] gap-3 overflow-hidden rounded-[16px] border border-white/8 bg-surface-2">
      {/* Sections */}
      <div className="flex w-[200px] shrink-0 flex-col border-r border-white/8">
        <Header title="Sections" onAdd={addSection} />
        <div className="flex-1 overflow-y-auto p-2">
          {sections.map((s) => (
            <div
              key={s.id}
              onClick={() => {
                setCurSection(s.id);
                setCurNote(null);
              }}
              onDoubleClick={() => renameSection(s)}
              className={`group flex cursor-pointer items-center gap-2 rounded-[9px] px-2.5 py-2 text-[13px] ${
                curSection === s.id ? 'bg-white/[0.07] text-ink' : 'text-ink-2 hover:bg-white/[0.04]'
              }`}
            >
              <FolderClosed className="size-4 shrink-0 text-sky" />
              <span className="flex-1 truncate">{s.name}</span>
              <span className="text-[11px] text-ink-3 group-hover:hidden">{s.notes.length}</span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  deleteSection(s);
                }}
                className="hidden text-ink-3 hover:text-danger group-hover:block"
              >
                <Trash2 className="size-3.5" />
              </button>
            </div>
          ))}
          {loaded && !sections.length && <Empty>Aucune section</Empty>}
        </div>
      </div>

      {/* Notes */}
      <div className="flex w-[252px] shrink-0 flex-col border-r border-white/8">
        <Header title="Notes" onAdd={addNote} />
        <div className="flex-1 overflow-y-auto p-2">
          {section?.notes.map((n) => (
            <div
              key={n.id}
              onClick={() => setCurNote(n.id)}
              className={`group flex cursor-pointer items-start gap-2 rounded-[9px] px-2.5 py-2 ${
                curNote === n.id ? 'bg-white/[0.07]' : 'hover:bg-white/[0.04]'
              }`}
            >
              <FileText className="mt-0.5 size-4 shrink-0 text-ink-3" />
              <div className="min-w-0 flex-1">
                <div className="truncate text-[13px] font-medium text-ink">{n.title || 'Sans titre'}</div>
                <div className="truncate text-[11px] text-ink-3">{fmtDateTime(n.updatedAt)}</div>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  deleteNote(n);
                }}
                className="hidden text-ink-3 hover:text-danger group-hover:block"
              >
                <Trash2 className="size-3.5" />
              </button>
            </div>
          ))}
          {section && !section.notes.length && <Empty>Aucune note</Empty>}
        </div>
      </div>

      {/* Editeur */}
      <div className="flex min-w-0 flex-1 flex-col">
        {note ? (
          <NoteEditor key={note.id} note={note} onSaved={onNoteSaved} />
        ) : (
          <div className="flex flex-1 items-center justify-center text-ink-3">
            Sélectionne ou crée une note.
          </div>
        )}
      </div>
    </div>
  );
}

function NoteEditor({ note, onSaved }: { note: Note; onSaved: (n: Note) => void }) {
  const [title, setTitle] = useState(note.title);
  const [content, setContent] = useState(note.content);
  const [status, setStatus] = useState<'idle' | 'saving' | 'saved'>('idle');
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const firstRun = useRef(true);

  useEffect(() => {
    if (firstRun.current) {
      firstRun.current = false;
      return;
    }
    setStatus('saving');
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(async () => {
      try {
        const updated = await apiPatch<Note>(`/api/notes/${note.id}`, { title, content });
        onSaved(updated);
        setStatus('saved');
      } catch {
        setStatus('idle');
      }
    }, 600);
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [title, content]);

  return (
    <div className="flex flex-1 flex-col">
      <div className="flex items-center gap-3 border-b border-white/8 px-5 py-3">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Titre de la note"
          className="flex-1 bg-transparent text-[17px] font-bold text-ink outline-none placeholder:text-ink-3"
        />
        <span className="text-[11px] text-ink-3">
          {status === 'saving' ? 'Enregistrement…' : status === 'saved' ? 'Enregistré' : ''}
        </span>
      </div>
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Commence à écrire…"
        className="flex-1 resize-none bg-transparent px-5 py-4 text-[14px] leading-relaxed text-ink outline-none placeholder:text-ink-3"
      />
    </div>
  );
}

function Header({ title, onAdd }: { title: string; onAdd: () => void }) {
  return (
    <div className="flex items-center justify-between border-b border-white/8 px-3 py-2.5">
      <span className="text-[11px] font-bold uppercase tracking-wide text-ink-2">{title}</span>
      <button onClick={onAdd} className="flex size-6 items-center justify-center rounded-md text-ink-2 hover:bg-white/[0.07] hover:text-ink">
        <Plus className="size-4" />
      </button>
    </div>
  );
}

function Empty({ children }: { children: React.ReactNode }) {
  return <p className="px-2.5 py-6 text-center text-[12px] text-ink-3">{children}</p>;
}
