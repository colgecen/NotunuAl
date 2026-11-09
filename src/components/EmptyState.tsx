import { tr } from '../i18n/tr';
import { PlusIcon } from './icons';

interface Props {
  onNewNote?: () => void;
  /** Arama sonucu boşsa farklı metin gösterilir. */
  searching?: boolean;
}

export default function EmptyState({ onNewNote, searching }: Props) {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-3 p-8 text-center">
      <span
        aria-hidden="true"
        className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-line bg-surface text-muted"
      >
        <PlusIcon className="h-5 w-5" />
      </span>
      <p className="text-base font-semibold text-fg">{searching ? tr.noResults : tr.emptyState}</p>
      {searching ? null : <p className="max-w-sm text-sm text-muted">{tr.emptyHint}</p>}
      {searching || !onNewNote ? null : (
        <button type="button" onClick={onNewNote} className="btn-primary mt-1">
          {tr.newNote}
        </button>
      )}
    </div>
  );
}
