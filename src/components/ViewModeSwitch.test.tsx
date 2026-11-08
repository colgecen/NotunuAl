import { render, screen, fireEvent } from '@testing-library/react';
import ViewModeSwitch from './ViewModeSwitch';
import { useSettingsStore } from '../store/settingsStore';
import { loadSettings } from '../services/settingsService';

describe('ViewModeSwitch', () => {
  it('changes and persists view mode', () => {
    useSettingsStore.getState().setViewMode('rows');
    render(<ViewModeSwitch />);
    fireEvent.click(screen.getByRole('button', { name: 'Simge simge' }));
    expect(useSettingsStore.getState().viewMode).toBe('icons');
    expect(loadSettings().viewMode).toBe('icons');
  });
});