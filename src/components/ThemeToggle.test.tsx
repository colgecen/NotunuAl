import 'fake-indexeddb/auto';
import { beforeEach, describe, expect, it } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import ThemeToggle from './ThemeToggle';
import { useSettingsStore } from '../store/settingsStore';

beforeEach(() => {
  localStorage.clear();
  document.documentElement.setAttribute('data-theme', 'light');
  useSettingsStore.getState().setTheme('light');
});

describe('ThemeToggle', () => {
  it('toggles theme and data-theme', () => {
    render(<ThemeToggle />);
    const btn = screen.getByRole('button', { name: 'Tema değiştir' });
    fireEvent.click(btn);
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
  });
});