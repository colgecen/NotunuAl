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
    <div className="border-b border-line bg-surface" role="group" aria-label={tr.noteActionsLabel}>
      <div className="col flex flex-wrap items-center gap-2 py-2">
        <button type="button" aria-label={tr.back} className="btn-ghost" onClick={onBack}>
          <ArrowLeftIcon className="h-4 w-4" />
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
        <div className="ml-auto flex items-center gap-2">
          {notice ? (
            <span role="status" className="text-xs text-muted">
              {notice}
            </span>
          ) : null}
          {savedFlash ? (
            <span className="inline-flex items-center gap-1 rounded-full border border-line bg-paper px-2 py-0.5 text-xs text-muted">
              <CheckIcon className="h-3.5 w-3.5" />
              {tr.saved}
            </span>
          ) : null}
          {dirty ? (
            <span
              aria-label={tr.unsavedChanges}
              title={tr.unsavedChanges}
              className="inline-flex items-center gap-1 rounded-full border border-line bg-paper px-2 py-0.5 text-xs text-muted"
            >
              <span aria-hidden="true">{tr.dirty}</span>
              {tr.unsavedChanges}
            </span>
          ) : null}
          <button
            type="button"
            aria-label={tr.delete}
            className="btn-danger"
            onClick={() => onDelete?.()}
          >
            <TrashIcon className="h-4 w-4" />
            {tr.delete}
          </button>
        </div>
      </div>
    </div>
  );
}
