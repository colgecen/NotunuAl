import { useEffect, useRef } from 'react';
import type { Note } from '../types';
import { tr } from '../i18n/tr';

interface Props {
  note: Note;
  selected?: boolean;
  onClick?: (id: string) => void;
  onDelete?: (id: string) => void;
}

export default function NoteRow({ note, selected, onClick, onDelete }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const snippet = note.bodyText.replace(/\s+/g, ' ').trim();
  useEffect(() => {
    if (selected) {
      ref.current?.scrollIntoView({ block: 'nearest' });
    }
  }, [selected]);
  return (
    <div
      ref={ref}
      data-id={note.id}
      className={`w-full flex items-center gap-2 px-3 py-2 border-b border-line ${
        selected ? 'bg-paper' : ''
      }`}
    >
      <button
        type="button"
        onClick={() => onClick?.(note.id)}
        className="flex-1 min-w-0 flex items-baseline gap-4 text-left"
      >
        <span className="font-bold shrink-0" style={{ color: note.titleColor ?? undefined }}>
          {note.title}
        </span>
        <span className="flex-1 min-w-0 text-right text-xs text-muted truncate">{snippet}</span>
      </button>
      <button
        type="button"
        aria-label={`${tr.delete}: ${note.title}`}
        className="text-xs text-red-500 shrink-0"
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