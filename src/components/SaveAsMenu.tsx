import { useEffect, useRef, useState } from 'react';import { tr } from '../i18n/tr';
import type { ExportFormat } from '../services/export';
import { ChevronDownIcon } from './icons';

interface Props {
  onSelect: (format: ExportFormat) => void;
}

const FORMATS: ExportFormat[] = ['xlsx', 'docx', 'pptx', 'pdf', 'txt'];

const LABELS: Record<ExportFormat, string> = {
  xlsx: tr.export.excel,
  docx: tr.export.word,
  pptx: tr.export.powerpoint,
  pdf: tr.export.pdf,
  txt: tr.export.text,
};

export default function SaveAsMenu({ onSelect }: Props) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const close = (restoreFocus: boolean) => {
      setOpen(false);
      if (restoreFocus) triggerRef.current?.focus();
    };
    const onPointerDown = (event: PointerEvent) => {
      if (!wrapRef.current?.contains(event.target as Node)) close(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      // Genel Esc kısayolu editörü kapatmasın; önce menü kapanır.
      event.preventDefault();
      event.stopPropagation();
      close(true);
    };
    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    const frame = window.requestAnimationFrame(() => {
      wrapRef.current?.querySelector<HTMLButtonElement>('[role="menuitem"]')?.focus();
    });
    return () => {
      window.cancelAnimationFrame(frame);
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open]);

  return (
    <div className="relative" ref={wrapRef}>
      <button
        ref={triggerRef}
        type="button"
        aria-label={tr.saveAs}
        aria-haspopup="menu"
        aria-expanded={open}
        className="btn gap-1"
        onClick={() => setOpen((v) => !v)}
      >
        {tr.saveAs}
        <ChevronDownIcon
          className={`h-3 w-3 transition-transform ${open ? 'rotate-180' : ''}`}
        />
      </button>
      {open ? (
        <div
          role="menu"
          aria-label={tr.saveAs}
          className="animate-pop absolute left-0 top-full z-30 mt-1.5 w-56 rounded-[10px] border border-line bg-paper p-1 shadow-float"
          onKeyDown={(event) => {
            if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return;
            event.preventDefault();
            const items = Array.from(
              wrapRef.current?.querySelectorAll<HTMLButtonElement>('[role="menuitem"]') ?? [],
            );
            const current = items.indexOf(document.activeElement as HTMLButtonElement);
            const step = event.key === 'ArrowDown' ? 1 : -1;
            items[(current + step + items.length) % items.length]?.focus();
          }}
        >
          {FORMATS.map((fmt) => (
            <button
              key={fmt}
              type="button"
              role="menuitem"
              className="flex w-full items-center rounded-md px-2.5 py-1.5 text-left text-[12.5px] text-fg transition-colors hover:bg-hover focus:bg-selection focus:outline-none"
              onClick={() => {
                setOpen(false);
                onSelect(fmt);
              }}
            >
              {LABELS[fmt]}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
