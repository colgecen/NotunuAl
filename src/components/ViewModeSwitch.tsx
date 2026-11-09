import { useSettingsStore } from '../store/settingsStore';
import { tr } from '../i18n/tr';
import type { ViewMode } from '../types';
import { GridIcon, HomeIcon, RowsIcon } from './icons';

const MODES: { mode: ViewMode; icon: typeof RowsIcon }[] = [
  { mode: 'rows', icon: RowsIcon },
  { mode: 'icons', icon: GridIcon },
  { mode: 'home', icon: HomeIcon },
];

export default function ViewModeSwitch() {
  const viewMode = useSettingsStore((s) => s.viewMode);
  const setViewMode = useSettingsStore((s) => s.setViewMode);
  return (
    <div
      className="inline-flex items-center gap-0.5 rounded-lg border border-line bg-surface p-0.5"
      role="group"
      aria-label={tr.viewModeLabel}
    >
      {MODES.map(({ mode, icon: Icon }) => (
        <button
          key={mode}
          type="button"
          aria-pressed={viewMode === mode}
          aria-label={tr.viewMode[mode]}
          data-pressed={viewMode === mode}
          className="btn-toggle gap-1.5 px-2.5"
          onClick={() => setViewMode(mode)}
        >
          <Icon className="h-3.5 w-3.5" />
          {tr.viewMode[mode]}
        </button>
      ))}
    </div>
  );
}
