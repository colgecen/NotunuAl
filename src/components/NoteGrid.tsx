import type { Note } from '../types';
import { tr } from '../i18n/tr';

interface Props {
  notes: Note[];
  selectedIndex?: number;
  onOpen?: (id: string) => void;
  onDelete?: (id: string) => void;
  onNewNote?: () => void;
}

export default function NoteGrid({ notes, selectedIndex = -1, onOpen, onDelete, onNewNote }: Props) {
  if (notes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center text-muted p-6">
        <p className="mb-4">{tr.emptyState}</p>
        <button type="button" onClick={onNewNote} className="px-3 py-2 rounded border border-line text-fg">
          {tr.newNote}
        </button>
      </div>
    );
  }
  return (
    <div
      role="list"
      aria-label={tr.noteListLabel}
      className="grid grid-cols-2 md:grid-cols-3 gap-2 p-2 overflow-y-auto"
    >
      {notes.map((n, idx) => {
        const title = n.title || tr.untitled;
        return (
          <div
            key={n.id}
            role="listitem"
            className={`relative text-left p-3 rounded border border-line bg-paper ${
              idx === selectedIndex ? 'ring-2 ring-accent' : ''
            }`}
          >
            <button
              type="button"
              className="text-left w-full pr-10"
              onClick={() => onOpen?.(n.id)}
              aria-label={tr.openNote(title)}
            >
              <span
                className="block font-bold truncate"
                style={{ color: n.titleColor ?? undefined }}
              >
                {title}
              </span>
              <span className="block text-xs text-muted mt-1 line-clamp-2">{n.bodyText}</span>
            </button>
            <button
              type="button"
              aria-label={tr.deleteNote(title)}
              className="absolute right-2 top-2 text-xs text-danger underline"
              onClick={(e) => {
                e.stopPropagation();
                onDelete?.(n.id);
              }}
            >
              {tr.delete}
            </button>
          </div>
        );
      })}
    </div>
  );
}
