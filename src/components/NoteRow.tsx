import type { Note } from '../types';
import { tr } from '../i18n/tr';
import { TrashIcon } from './icons';

interface Props {
  note: Note;
  selected?: boolean;
  spacious?: boolean;
  onClick?: (id: string) => void;
  onDelete?: (id: string) => void;
}

export default function NoteRow({ note, selected, spacious, onClick, onDelete }: Props) {
  const snippet = note.bodyText.replace(/\s+/g, ' ').trim();
  const title = note.title || tr.untitled;
  return (
    <div
      data-id={note.id}
      className={`group relative flex h-full w-full items-center gap-2 border-b border-line pr-2 transition-colors duration-100 ${
        spacious ? 'py-3.5 pl-7' : 'py-1.5 pl-4'
      } ${selected ? 'bg-hover' : 'hover:bg-surface'}`}
    >
      {selected ? (
        <span aria-hidden="true" className="absolute inset-y-0 left-0 w-[3px] bg-accent" />
      ) : null}
      <button
        type="button"
        aria-current={selected ? 'true' : undefined}
        aria-label={tr.openNote(title)}
        onClick={() => onClick?.(note.id)}
        className="flex min-w-0 flex-1 items-baseline gap-3 text-left"
      >
        <span
          className={`shrink-0 truncate font-bold ${spacious ? 'text-lg' : 'text-sm'}`}
          style={{ color: note.titleColor ?? undefined }}
        >
          {title}
        </span>
        {note.date ? (
          <span className="shrink-0 text-[11px] tabular-nums text-muted">{note.date}</span>
        ) : null}
        <span
          className={`ml-auto min-w-0 flex-1 truncate text-right text-muted ${
            spacious ? 'text-sm' : 'text-xs'
          }`}
        >
          {snippet}
        </span>
      </button>
      <button
        type="button"
        aria-label={tr.deleteNote(title)}
        title={tr.delete}
        className="btn-icon h-7 w-7 opacity-0 hover:text-danger focus-visible:opacity-100 group-focus-within:opacity-100 group-hover:opacity-100"
        onClick={(e) => {
          e.stopPropagation();
          onDelete?.(note.id);
        }}
      >
        <TrashIcon className="h-4 w-4" />
      </button>
    </div>
  );
}
