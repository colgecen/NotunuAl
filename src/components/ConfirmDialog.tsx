import { useEffect, useRef } from 'react';
import { tr } from '../i18n/tr';
import { TrashIcon } from './icons';

interface Props {
  open: boolean;
  text: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmDialog({ open, text, onConfirm, onCancel }: Props) {
  const restoreRef = useRef<HTMLElement | null>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const confirmRef = useRef<HTMLButtonElement>(null);
  const cancelRef = useRef(onCancel);

  useEffect(() => {
    cancelRef.current = onCancel;
  }, [onCancel]);

  useEffect(() => {
    if (!open) return;

    // Otomatik odaklamadan önce açılış anındaki odağı sakla, kapanınca geri ver.
    restoreRef.current =
      document.activeElement instanceof HTMLElement ? document.activeElement : null;
    confirmRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        event.stopPropagation();
        cancelRef.current();
        return;
      }
      if (event.key !== 'Tab') return;

      const focusable = dialogRef.current?.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
      );
      if (!focusable?.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      restoreRef.current?.focus();
      restoreRef.current = null;
    };
  }, [open]);

  if (!open) return null;
  return (
    <div
      className="animate-fade fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4 backdrop-blur-[3px]"
      role="presentation"
    >
      <div
        ref={dialogRef}
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirm-dialog-title"
        aria-describedby="confirm-dialog-text"
        className="animate-pop w-full max-w-[350px] overflow-hidden rounded-[14px] border border-line bg-paper shadow-float"
      >
        <div className="px-5 pt-5">
          <div className="mb-2.5 flex items-center gap-2.5">
            <span
              aria-hidden="true"
              className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-selection text-danger"
            >
              <TrashIcon className="h-4 w-4" />
            </span>
            <h2 id="confirm-dialog-title" className="text-[15px] font-semibold text-fg">
              {tr.delete}
            </h2>
          </div>
          <p id="confirm-dialog-text" className="text-[12.5px] leading-relaxed text-muted">
            {text}
          </p>
        </div>
        <div className="mt-5 flex justify-end gap-2 border-t border-line bg-surface px-4 py-3">
          <button type="button" aria-label={tr.cancel} className="btn" onClick={onCancel}>
            {tr.cancel}
          </button>
          <button
            ref={confirmRef}
            type="button"
            aria-label={tr.delete}
            className="btn-destructive min-w-[68px]"
            onClick={onConfirm}
          >
            {tr.delete}
          </button>
        </div>
      </div>
    </div>
  );
}
