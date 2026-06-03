'use client';

import { useEffect, type ReactNode } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
  headerExtra?: ReactNode;
  maxWidth?: number;
}

export default function Modal({
  open,
  onClose,
  title,
  children,
  footer,
  headerExtra,
  maxWidth = 600,
}: ModalProps) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="anim-fade-up fixed inset-0 z-[1000] flex items-center justify-center bg-black/65 p-5 backdrop-blur-sm"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="max-h-[90vh] w-full overflow-y-auto rounded-[18px] border border-white/8 bg-panel shadow-[0_24px_70px_rgba(0,0,0,0.55)]"
        style={{ maxWidth }}
      >
        <div className="sticky top-0 z-[1] flex items-center justify-between border-b border-white/8 bg-panel px-[22px] py-[18px]">
          <h2 className="flex items-center gap-2.5 text-[16px] font-bold">{title}</h2>
          <div className="flex items-center gap-1">
            {headerExtra}
            <button
              onClick={onClose}
              className="flex size-[30px] items-center justify-center rounded-lg text-ink-3 hover:bg-white/[0.06] hover:text-ink"
            >
              <X className="size-4" />
            </button>
          </div>
        </div>
        <div className="px-[22px] py-[22px]">{children}</div>
        {footer && (
          <div className="sticky bottom-0 flex justify-end gap-2.5 border-t border-white/8 bg-panel px-[22px] py-4">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
