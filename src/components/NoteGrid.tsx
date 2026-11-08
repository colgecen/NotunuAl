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
    <div role="listbox" aria-label={tr.appTitle} className="grid grid-cols-2 md:grid-cols-3 gap-2 p-2 overflow-y-auto">
      {notes.map((n, idx) => (
        <div
          key={n.id}
          className={`relative text-left p-3 rounded border border-line bg-paper ${idx === selectedIndex ? 'ring-2 ring-accent' : ''}`}
          role="option"
          aria-selected={idx === selectedIndex}
        >
          <button
            type="button"
            className="text-left w-full"
            onClick={() => onOpen?.(n.id)}
            aria-label={`${n.title} notunu aç`}
          >
            <div className="font-bold truncate" style={{ color: n.titleColor ?? undefined }}>
              {n.title}
            </div>
            <div className="text-xs text-muted mt-1 line-clamp-2">{n.bodyText}</div>
          </button>
          <button
            type="button"
            aria-label={`${tr.delete}: ${n.title}`}
            className="absolute right-2 top-2 text-xs text-red-500"
            onClick={(e) => {
              e.stopPropagation();
              onDelete?.(n.id);
            }}
          >
            {tr.delete}
          </button>
        </div>
      ))}
    </div>
  );
}