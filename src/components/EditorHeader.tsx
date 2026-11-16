import { tr } from '../i18n/tr';
import type { ExportFormat } from '../services/export';
import SaveAsMenu from './SaveAsMenu';
import { ArrowLeftIcon, CheckIcon, TrashIcon } from './icons';

interface Props {
  dirty: boolean;
  savedFlash: boolean;
  notice: string | null;
  onSave: () => void;
  onSelectFormat: (fmt: ExportFormat) => void;
  onBack: () => void;
  onDelete?: () => void;
}

export default function EditorHeader({
  dirty,
  savedFlash,
  notice,
  onSave,
  onSelectFormat,
  onBack,
  onDelete,
}: Props) {
  return (
    <div
      className="shrink-0 border-b border-line bg-chrome"
      role="group"
      aria-label={tr.noteActionsLabel}
    >
      <div className="col flex min-h-[52px] flex-wrap items-center gap-2 py-2">
        <button type="button" aria-label={tr.back} className="btn-ghost" onClick={onBack}>
          <ArrowLeftIcon className="h-3.5 w-3.5" />
          {tr.back}
        </button>
        <span className="sep" aria-hidden="true" />
        <button
          type="button"
          aria-label={tr.save}
          title={tr.shortcutHint('Ctrl+S')}
          className="btn-primary"
          onClick={onSave}
        >
          {tr.save}
        </button>
        <SaveAsMenu onSelect={onSelectFormat} />
        <div className="ml-auto flex min-w-0 items-center gap-2">
          {notice ? (
            <span role="status" className="max-w-[220px] truncate text-[11px] text-muted">
              {notice}
            </span>
          ) : null}
          {savedFlash ? (
            <span className="pill">
              <CheckIcon className="h-3 w-3" />
              {tr.saved}
            </span>
          ) : null}
          {dirty ? (
            <span aria-label={tr.unsavedChanges} title={tr.unsavedChanges} className="pill">
              <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-accent" />
              {tr.unsavedChanges}
            </span>
          ) : null}
          <button
            type="button"
            aria-label={tr.delete}
            className="btn-danger"
            onClick={() => onDelete?.()}
          >
            <TrashIcon className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">{tr.delete}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
