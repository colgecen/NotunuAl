import { useEffect } from 'react';
import { useSettingsStore } from './store/settingsStore';
import ThemeToggle from './components/ThemeToggle';

export default function App() {
  const toggleTheme = useSettingsStore((s) => s.toggleTheme);
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && (e.key === 'k' || e.key === 'K')) {
        e.preventDefault();
        toggleTheme();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [toggleTheme]);
  return (
    <div className="p-4">
      <div className="flex items-center justify-between">
        <span className="text-xl font-bold">NotunuAl!</span>
        <ThemeToggle />
      </div>
    </div>
  );
}