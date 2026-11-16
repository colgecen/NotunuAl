import { tr } from '../i18n/tr';
import { PlusIcon, SearchIcon } from './icons';

interface Props {
  onNewNote?: () => void;
  /** Arama sonucu boşsa farklı metin gösterilir. */
  searching?: boolean;
}

export default function EmptyState({ onNewNote, searching }: Props) {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-4 p-8 text-center">
      <span
        aria-hidden="true"
        className="inline-flex h-14 w-14 items-center justify-center rounded-full border border-line bg-surface text-muted shadow-panel"
      >
        {searching ? <SearchIcon className="h-5 w-5" /> : <PlusIcon className="h-6 w-6" />}
      </span>
      <div className="space-y-1.5">
        <p className="text-[15px] font-semibold text-fg">{searching ? tr.noResults : tr.emptyState}</p>
        {searching ? null : <p className="max-w-sm text-[12.5px] text-muted">{tr.emptyHint}</p>}
      </div>
      {searching || !onNewNote ? null : (
        <button type="button" onClick={onNewNote} className="btn-primary">
          {tr.newNote}
        </button>
      )}
    </div>
  );
}
