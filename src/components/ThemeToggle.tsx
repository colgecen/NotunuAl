import { useSettingsStore } from '../store/settingsStore';
import { tr } from '../i18n/tr';

export default function ThemeToggle() {
  const theme = useSettingsStore((s) => s.theme);
  const toggleTheme = useSettingsStore((s) => s.toggleTheme);
  return (
    <button
      type="button"
      aria-label={tr.themeToggle}
      title={tr.themeToggle}
      aria-pressed={theme === 'dark'}
      onClick={toggleTheme}
      className="rounded px-2 py-1 border border-line text-fg"
    >
      <span aria-hidden="true">{theme === 'light' ? '☀' : '☾'}</span>
    </button>
  );
}
