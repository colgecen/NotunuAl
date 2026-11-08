import { useSettingsStore } from '../store/settingsStore';
import { tr } from '../i18n/tr';
import type { ViewMode } from '../types';

export default function ViewModeSwitch() {
  const viewMode = useSettingsStore((s) => s.viewMode);
  const setViewMode = useSettingsStore((s) => s.setViewMode);
  const modes: ViewMode[] = ['rows', 'icons', 'home'];
  return (
    <div className="flex gap-1 p-1 border-b border-line" role="group" aria-label="Görünüm modu">
      {modes.map((m) => (
        <button
          key={m}
          type="button"
          aria-pressed={viewMode === m}
          aria-label={tr.viewMode[m]}
          className={`px-2 py-1 text-sm rounded ${viewMode === m ? 'bg-paper text-fg' : 'text-muted'}`}
          onClick={() => setViewMode(m)}
        >
          {tr.viewMode[m]}
        </button>
      ))}
    </div>
  );
}