import { tr } from '../i18n/tr';

interface Props {
  onClick: () => void;
}

export default function NewNoteButton({ onClick }: Props) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={tr.newNote}
      className="px-3 py-1 rounded border border-line bg-paper text-fg font-semibold"
    >
      {tr.newNote}
    </button>
  );
}