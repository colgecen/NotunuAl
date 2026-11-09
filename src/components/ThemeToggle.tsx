import { useSettingsStore } from '../store/settingsStore';
import { tr } from '../i18n/tr';
import { MoonIcon, SunIcon } from './icons';

export default function ThemeToggle() {
  const theme = useSettingsStore((s) => s.theme);
  const toggleTheme = useSettingsStore((s) => s.toggleTheme);
  return (
    <button
      type="button"
      aria-label={tr.themeToggle}
      title={`${tr.themeToggle} — ${tr.shortcutHint('Ctrl+K')}`}
      aria-pressed={theme === 'dark'}
      onClick={toggleTheme}
      className="btn-icon shrink-0 border-line"
    >
      {theme === 'light' ? <SunIcon className="h-4 w-4" /> : <MoonIcon className="h-4 w-4" />}
    </button>
  );
}
