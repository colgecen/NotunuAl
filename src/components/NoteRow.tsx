import type { Note } from '../types';
import { tr } from '../i18n/tr';
import { formatNoteDate } from '../services/textUtils';
import { TrashIcon } from './icons';

interface Props {
  note: Note;
  selected?: boolean;
  variant?: 'rows' | 'home';
  onClick?: (id: string) => void;
  onDelete?: (id: string) => void;
}

export default function NoteRow({
  note,
  selected,
  variant = 'rows',
  onClick,
  onDelete,
}: Props) {
  const snippet = note.bodyText.replace(/\s+/g, ' ').trim();
  const title = note.title || tr.untitled;
  const date = formatNoteDate(note.date);
  const home = variant === 'home';

  return (
    <div
      data-id={note.id}
      className={`group relative flex h-full w-full items-center gap-2 border-b border-line pr-1.5 transition-colors duration-100 ${
        selected ? 'bg-selection' : 'hover:bg-surface'
      }`}
    >
      {selected ? (
        <span aria-hidden="true" className="absolute inset-y-2 left-0 w-[3px] rounded-full bg-accent" />
      ) : null}
      <button
        type="button"
        aria-current={selected ? 'true' : undefined}
        aria-label={tr.openNote(title)}
        onClick={() => onClick?.(note.id)}
        className={`flex min-w-0 flex-1 text-left ${
          home ? 'items-baseline gap-3 py-2 pl-4' : 'flex-col py-2 pl-5'
        }`}
      >
        {home ? (
          <>
            <span className="flex min-w-0 shrink-0 items-baseline gap-2 sm:max-w-[46%]">
              <span
                className="truncate text-[13px] font-bold tracking-[-0.012em]"
                style={{ color: note.titleColor ?? undefined }}
              >
                {title}
              </span>
              {date ? (
                <span className="shrink-0 text-[11px] tabular-nums text-muted">{date}</span>
              ) : null}
            </span>
            <span className="ml-auto min-w-0 flex-1 truncate text-right text-[12px] text-muted">
              {snippet}
            </span>
          </>
        ) : (
          <>
            <span className="flex w-full min-w-0 items-baseline gap-2">
              <span
                className="truncate text-[13px] font-bold tracking-[-0.012em]"
                style={{ color: note.titleColor ?? undefined }}
              >
                {title}
              </span>
              {date ? (
                <span className="ml-auto shrink-0 pl-2 text-[11px] tabular-nums text-muted">
                  {date}
                </span>
              ) : null}
            </span>
            <span className="mt-0.5 block w-full truncate text-[12px] text-muted">{snippet}</span>
          </>
        )}
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
