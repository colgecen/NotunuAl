import type { Note } from '../types';
import { tr } from '../i18n/tr';
import EmptyState from './EmptyState';
import { TrashIcon } from './icons';

interface Props {
  notes: Note[];
  selectedIndex?: number;
  onOpen?: (id: string) => void;
  onDelete?: (id: string) => void;
  onNewNote?: () => void;
  searching?: boolean;
}

export default function NoteGrid({
  notes,
  selectedIndex = -1,
  onOpen,
  onDelete,
  onNewNote,
  searching,
}: Props) {
  if (notes.length === 0) {
    return <EmptyState onNewNote={onNewNote} searching={searching} />;
  }
  return (
    <div
      role="list"
      aria-label={tr.noteListLabel}
      className="scroll-slim grid grid-cols-1 content-start gap-3 overflow-y-auto p-4 sm:grid-cols-2 lg:grid-cols-3"
    >
      {notes.map((n, idx) => {
        const title = n.title || tr.untitled;
        const selected = idx === selectedIndex;
        return (
          <div
            key={n.id}
            role="listitem"
            className={`group relative flex min-h-28 flex-col rounded-card border bg-paper p-3 transition-shadow duration-150 hover:shadow-panel ${
              selected ? 'border-accent shadow-panel' : 'border-line'
            }`}
          >
            {selected ? (
              <span
                aria-hidden="true"
                className="absolute inset-x-0 top-0 h-[3px] rounded-t-card bg-accent"
              />
            ) : null}
            <button
              type="button"
              aria-current={selected ? 'true' : undefined}
              className="min-w-0 flex-1 pr-7 text-left"
              onClick={() => onOpen?.(n.id)}
              aria-label={tr.openNote(title)}
            >
              <span
                className="block truncate font-bold"
                style={{ color: n.titleColor ?? undefined }}
              >
                {title}
              </span>
              {n.date ? (
                <span className="mt-0.5 block text-[11px] tabular-nums text-muted">{n.date}</span>
              ) : null}
              <span className="mt-1 block text-xs leading-relaxed text-muted line-clamp-3">
                {n.bodyText}
              </span>
            </button>
            <button
              type="button"
              aria-label={tr.deleteNote(title)}
              title={tr.delete}
              className="btn-icon absolute right-1.5 top-1.5 h-7 w-7 opacity-0 hover:text-danger focus-visible:opacity-100 group-focus-within:opacity-100 group-hover:opacity-100"
              onClick={(e) => {
                e.stopPropagation();
                onDelete?.(n.id);
              }}
            >
              <TrashIcon className="h-4 w-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
