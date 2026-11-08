import { tr } from '../i18n/tr';

interface Props {
  open: boolean;
  text: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmDialog({ open, text, onConfirm, onCancel }: Props) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/30 z-50" role="presentation">
      <div role="dialog" aria-modal="true" aria-label={tr.delete} className="bg-paper text-fg p-5 rounded shadow-lg min-w-[280px]">
        <p className="mb-4">{text}</p>
        <div className="flex gap-2 justify-end">
          <button type="button" aria-label={tr.cancel} className="px-3 py-1 rounded border border-line" onClick={onCancel}>
            {tr.cancel}
          </button>
          <button
            type="button"
            autoFocus
            aria-label={tr.delete}
            className="px-3 py-1 rounded border border-red-500 text-red-500"
            onClick={onConfirm}
          >
            {tr.delete}
          </button>
        </div>
      </div>
    </div>
  );
}