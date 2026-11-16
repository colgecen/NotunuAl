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
    <div className="segmented" role="group" aria-label={tr.viewModeLabel}>
      {MODES.map(({ mode, icon: Icon }) => (
        <button
          key={mode}
          type="button"
          aria-pressed={viewMode === mode}
          aria-label={tr.viewMode[mode]}
          title={tr.viewMode[mode]}
          data-pressed={viewMode === mode}
          className="segment"
          onClick={() => setViewMode(mode)}
        >
          <Icon className="h-3.5 w-3.5" />
          <span className="hidden md:inline">{tr.viewMode[mode]}</span>
        </button>
      ))}
    </div>
  );
}
