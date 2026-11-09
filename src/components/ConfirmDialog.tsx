import { tr } from '../i18n/tr';
import { TrashIcon } from './icons';

interface Props {
  open: boolean;
  text: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmDialog({ open, text, onConfirm, onCancel }: Props) {
  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-[2px]"
      role="presentation"
      onKeyDown={(e) => {
        if (e.key === 'Escape') {
          e.stopPropagation();
          onCancel();
        }
      }}
    >
      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirm-dialog-title"
        aria-describedby="confirm-dialog-text"
        className="w-full max-w-sm rounded-card border border-line bg-paper p-5 shadow-float"
      >
        <div className="mb-3 flex items-center gap-2">
          <span
            aria-hidden="true"
            className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-hover text-danger"
          >
            <TrashIcon className="h-4 w-4" />
          </span>
          <h2 id="confirm-dialog-title" className="text-base font-bold text-fg">
            {tr.delete}
          </h2>
        </div>
        <p id="confirm-dialog-text" className="mb-5 text-sm text-muted">
          {text}
        </p>
        <div className="flex justify-end gap-2">
          <button type="button" aria-label={tr.cancel} className="btn" onClick={onCancel}>
            {tr.cancel}
          </button>
          <button
            type="button"
            autoFocus
            aria-label={tr.delete}
            className="inline-flex items-center justify-center gap-1.5 whitespace-nowrap rounded-lg border border-danger bg-danger px-3 py-1.5 text-sm font-semibold text-paper transition-opacity duration-150 hover:brightness-110"
            onClick={onConfirm}
          >
            {tr.delete}
          </button>
        </div>
      </div>
    </div>
  );
}
