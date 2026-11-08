import { create } from 'zustand';
import { loadSettings, saveSettings } from '../services/settingsService';
import type { Settings, Theme, ViewMode, FontKey } from '../types';

interface SettingsState extends Settings {
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  setViewMode: (mode: ViewMode) => void;
  setBodyFontSize: (size: number) => void;
  setBodyFont: (font: FontKey) => void;
}

function applyTheme(theme: Theme) {
  if (typeof document !== 'undefined') {
    document.documentElement.setAttribute('data-theme', theme);
  }
}

const initial = loadSettings();
applyTheme(initial.theme);

export const useSettingsStore = create<SettingsState>((set, get) => ({
  ...initial,
  setTheme: (theme) => {
    applyTheme(theme);
    const next = { ...get(), theme };
    saveSettings({
      theme: next.theme,
      viewMode: next.viewMode,
      bodyFontSize: next.bodyFontSize,
      bodyFont: next.bodyFont,
    });
    set({ theme });
  },
  toggleTheme: () => {
    const next = get().theme === 'light' ? 'dark' : 'light';
    get().setTheme(next);
  },
  setViewMode: (viewMode) => {
    saveSettings({ ...get(), viewMode });
    set({ viewMode });
  },
  setBodyFontSize: (bodyFontSize) => {
    saveSettings({ ...get(), bodyFontSize });
    set({ bodyFontSize });
  },
  setBodyFont: (bodyFont) => {
    saveSettings({ ...get(), bodyFont });
    set({ bodyFont });
  },
}));