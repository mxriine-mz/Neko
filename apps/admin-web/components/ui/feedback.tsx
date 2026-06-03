'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { AlertTriangle, Check, Info, X } from 'lucide-react';

// ── Types ──
type ToastType = 'info' | 'success' | 'error';
interface Toast {
  id: number;
  message: string;
  type: ToastType;
}

interface PromptField {
  label?: string;
  value?: string;
  placeholder?: string;
  multiline?: boolean;
}
interface PromptOpts {
  title: string;
  okText?: string;
  label?: string;
  value?: string;
  placeholder?: string;
  fields?: PromptField[];
}
interface ConfirmOpts {
  title: string;
  message: ReactNode;
  okText?: string;
  danger?: boolean;
}

type DialogState =
  | { kind: 'prompt'; opts: PromptOpts; resolve: (v: string[] | null) => void }
  | { kind: 'confirm'; opts: ConfirmOpts; resolve: (v: boolean) => void }
  | null;

interface UIContext {
  toast: (message: string, type?: ToastType) => void;
  confirm: (opts: ConfirmOpts) => Promise<boolean>;
  // Renvoie un tableau de valeurs (une par champ), ou null si annulé.
  promptFields: (opts: PromptOpts) => Promise<string[] | null>;
  // Forme simple : un seul champ, renvoie la valeur ou null.
  prompt: (opts: PromptOpts) => Promise<string | null>;
}

const Ctx = createContext<UIContext | null>(null);

export function useUI() {
  const c = useContext(Ctx);
  if (!c) throw new Error('useUI doit être utilisé dans <FeedbackProvider>');
  return c;
}

export function FeedbackProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [dialog, setDialog] = useState<DialogState>(null);
  const idRef = useRef(0);

  const toast = useCallback((message: string, type: ToastType = 'info') => {
    const id = ++idRef.current;
    setToasts((t) => [...t, { id, message, type }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3400);
  }, []);

  const confirm = useCallback(
    (opts: ConfirmOpts) =>
      new Promise<boolean>((resolve) => setDialog({ kind: 'confirm', opts, resolve })),
    [],
  );
  const promptFields = useCallback(
    (opts: PromptOpts) =>
      new Promise<string[] | null>((resolve) => setDialog({ kind: 'prompt', opts, resolve })),
    [],
  );
  const prompt = useCallback(
    async (opts: PromptOpts) => {
      const r = await promptFields(opts);
      return r ? r[0] : null;
    },
    [promptFields],
  );

  return (
    <Ctx.Provider value={{ toast, confirm, promptFields, prompt }}>
      {children}
      <ToastStack toasts={toasts} />
      {dialog && (
        <DialogHost
          state={dialog}
          close={() => setDialog(null)}
        />
      )}
    </Ctx.Provider>
  );
}

// ── Toasts ──
function ToastStack({ toasts }: { toasts: Toast[] }) {
  return (
    <div className="fixed bottom-[22px] right-[22px] z-[1300] flex flex-col gap-2.5">
      {toasts.map((t) => {
        const Icon = t.type === 'error' ? AlertTriangle : t.type === 'success' ? Check : Info;
        const color =
          t.type === 'error' ? 'text-danger' : t.type === 'success' ? 'text-success' : 'text-accent';
        const border =
          t.type === 'error'
            ? 'border-danger/50'
            : t.type === 'success'
              ? 'border-success/45'
              : 'border-white/10';
        return (
          <div
            key={t.id}
            className={`anim-fade-up flex max-w-[340px] items-center gap-2.5 rounded-xl border ${border} bg-panel px-4 py-3 text-[13.5px] font-medium text-ink shadow-[0_12px_40px_rgba(0,0,0,0.5)]`}
          >
            <Icon className={`size-4 shrink-0 ${color}`} />
            <span>{t.message}</span>
          </div>
        );
      })}
    </div>
  );
}

// ── Dialogues ──
function DialogHost({ state, close }: { state: NonNullable<DialogState>; close: () => void }) {
  const [values, setValues] = useState<string[]>(() =>
    state.kind === 'prompt'
      ? (state.opts.fields ?? [{ value: state.opts.value }]).map((f) => f.value ?? '')
      : [],
  );
  const firstRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);

  useEffect(() => {
    const t = setTimeout(() => firstRef.current?.focus(), 30);
    return () => clearTimeout(t);
  }, []);

  const cancel = () => {
    if (state.kind === 'prompt') state.resolve(null);
    else state.resolve(false);
    close();
  };
  const ok = () => {
    if (state.kind === 'prompt') state.resolve(values);
    else state.resolve(true);
    close();
  };

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      cancel();
    } else if (e.key === 'Enter' && (e.target as HTMLElement).tagName !== 'TEXTAREA') {
      e.preventDefault();
      ok();
    }
  };

  const fields =
    state.kind === 'prompt'
      ? (state.opts.fields ?? [
          { label: state.opts.label, value: state.opts.value, placeholder: state.opts.placeholder },
        ])
      : [];

  return (
    <div
      className="anim-fade-up fixed inset-0 z-[1100] flex items-center justify-center bg-black/65 p-5 backdrop-blur-sm"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) cancel();
      }}
      onKeyDown={onKey}
    >
      <div className="w-full max-w-[440px] overflow-hidden rounded-[18px] border border-white/8 bg-panel shadow-[0_24px_70px_rgba(0,0,0,0.55)]">
        <div className="flex items-center justify-between border-b border-white/8 px-[22px] py-[18px]">
          <h2 className="text-[16px] font-bold">{state.opts.title}</h2>
          <button
            onClick={cancel}
            className="flex size-[30px] items-center justify-center rounded-lg text-ink-3 hover:bg-white/[0.06] hover:text-ink"
          >
            <X className="size-4" />
          </button>
        </div>

        <div className="px-[22px] py-[22px]">
          {state.kind === 'confirm' ? (
            <p className="text-[14px] leading-relaxed text-ink-2">{state.opts.message}</p>
          ) : (
            fields.map((f, i) => (
              <div key={i} className={i < fields.length - 1 ? 'mb-3.5' : ''}>
                {f.label && (
                  <label className="mb-1.5 block text-xs font-semibold text-ink-2">{f.label}</label>
                )}
                {f.multiline ? (
                  <textarea
                    ref={i === 0 ? (firstRef as React.RefObject<HTMLTextAreaElement>) : undefined}
                    rows={3}
                    value={values[i] ?? ''}
                    placeholder={f.placeholder}
                    onChange={(e) =>
                      setValues((v) => v.map((x, j) => (j === i ? e.target.value : x)))
                    }
                    className="w-full resize-y rounded-[9px] border border-white/8 bg-surface-2 px-3 py-2.5 text-[14px] text-ink outline-none focus:border-accent focus:bg-surface"
                  />
                ) : (
                  <input
                    ref={i === 0 ? (firstRef as React.RefObject<HTMLInputElement>) : undefined}
                    type="text"
                    value={values[i] ?? ''}
                    placeholder={f.placeholder}
                    onChange={(e) =>
                      setValues((v) => v.map((x, j) => (j === i ? e.target.value : x)))
                    }
                    onFocus={(e) => e.target.select()}
                    className="w-full rounded-[9px] border border-white/8 bg-surface-2 px-3 py-2.5 text-[14px] text-ink outline-none focus:border-accent focus:bg-surface"
                  />
                )}
              </div>
            ))
          )}
        </div>

        <div className="flex justify-end gap-2.5 border-t border-white/8 px-[22px] py-4">
          <button
            onClick={cancel}
            className="rounded-[9px] border border-white/8 bg-transparent px-[15px] py-2 text-[13.5px] font-semibold text-ink hover:bg-white/[0.07]"
          >
            Annuler
          </button>
          <button
            onClick={ok}
            className={`rounded-[9px] border px-[15px] py-2 text-[13.5px] font-semibold text-white ${
              state.kind === 'confirm' && state.opts.danger
                ? 'border-transparent bg-danger hover:brightness-110'
                : 'border-transparent bg-gradient-to-br from-sky-500 to-blue-600 hover:brightness-110'
            }`}
          >
            {state.kind === 'confirm'
              ? (state.opts.okText ?? (state.opts.danger ? 'Supprimer' : 'Confirmer'))
              : (state.opts.okText ?? 'Valider')}
          </button>
        </div>
      </div>
    </div>
  );
}
