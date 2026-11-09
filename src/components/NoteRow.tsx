import type { Note } from '../types';
import { tr } from '../i18n/tr';

interface Props {
  note: Note;
  selected?: boolean;
  spacious?: boolean;
  onClick?: (id: string) => void;
  onDelete?: (id: string) => void;
}

export default function NoteRow({
  note,
  selected,
  spacious,
  onClick,
  onDelete,
}: Props) {
  const snippet = note.bodyText.replace(/\s+/g, ' ').trim();
  const title = note.title || tr.untitled;
  return (
    <div
      data-id={note.id}
      className={`w-full h-full flex items-center gap-2 border-b border-line ${
        spacious ? 'px-5 py-3' : 'px-3 py-2'
      } ${selected ? 'bg-paper ring-1 ring-inset ring-accent' : ''}`}
    >
      <button
        type="button"
        aria-current={selected ? 'true' : undefined}
        aria-label={tr.openNote(title)}
        onClick={() => onClick?.(note.id)}
        className="flex-1 min-w-0 flex items-baseline gap-4 text-left"
      >
        <span className="font-bold shrink-0" style={{ color: note.titleColor ?? undefined }}>
          {title}
        </span>
        <span className="flex-1 min-w-0 text-right text-xs text-muted truncate">{snippet}</span>
      </button>
      <button
        type="button"
        aria-label={tr.deleteNote(title)}
        className="text-xs text-danger shrink-0 underline"
        onClick={(e) => {
          e.stopPropagation();
          onDelete?.(note.id);
        }}
      >
        {tr.delete}
      </button>
    </div>
  );
}
