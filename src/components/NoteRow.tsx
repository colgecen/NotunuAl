import { useEffect, useRef } from 'react';
import type { Note } from '../types';

interface Props {
  note: Note;
  selected?: boolean;
  onClick?: (id: string) => void;
}

export default function NoteRow({ note, selected, onClick }: Props) {
  const ref = useRef<HTMLButtonElement>(null);
  const snippet = note.bodyText.replace(/\s+/g, ' ').trim();
  useEffect(() => {
    if (selected) {
      ref.current?.scrollIntoView({ block: 'nearest' });
    }
  }, [selected]);
  return (
    <button
      ref={ref}
      type="button"
      data-id={note.id}
      onClick={() => onClick?.(note.id)}
      className={`w-full flex items-baseline gap-4 px-3 py-2 text-left border-b border-line ${
        selected ? 'bg-paper' : ''
      }`}
    >
      <span className="font-bold shrink-0" style={{ color: note.titleColor ?? undefined }}>
        {note.title}
      </span>
      <span className="flex-1 min-w-0 text-right text-xs text-muted truncate">{snippet}</span>
    </button>
  );
}