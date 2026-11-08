import { useSettingsStore } from '../store/settingsStore';

export default function ThemeToggle() {
  const theme = useSettingsStore((s) => s.theme);
  const toggleTheme = useSettingsStore((s) => s.toggleTheme);
  return (
    <button
      type="button"
      aria-label="Tema değiştir"
      onClick={toggleTheme}
      className="rounded px-2 py-1 border border-line text-fg"
    >
      {theme === 'light' ? '☀' : '☾'}
    </button>
  );
}