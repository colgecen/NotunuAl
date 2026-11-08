import type { Note } from '../types';
import NoteRow from './NoteRow';
import { tr } from '../i18n/tr';

interface Props {
  notes: Note[];
  selectedIndex?: number;
  onOpen?: (id: string) => void;
  onDelete?: (id: string) => void;
  onNewNote?: () => void;
}

export default function NoteList({ notes, selectedIndex = -1, onOpen, onDelete, onNewNote }: Props) {
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
    <div role="listbox" aria-label={tr.appTitle} className="overflow-y-auto">
      {notes.map((n, idx) => (
        <div key={n.id} role="option" aria-selected={idx === selectedIndex}>
          <NoteRow note={n} selected={idx === selectedIndex} onClick={onOpen} onDelete={onDelete} />
        </div>
      ))}
    </div>
  );
}