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
      title={tr.shortcutHint('Ctrl+N')}
      className="btn-primary shrink-0"
    >
      {tr.newNote}
    </button>
  );
}
