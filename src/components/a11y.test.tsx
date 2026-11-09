import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import axe from 'axe-core';
import App from '../App';
import { createNote, saveNote } from '../services/noteRepo';
import { useSettingsStore } from '../store/settingsStore';

async function expectNoViolations(container: HTMLElement) {
  const results = await axe.run(container, {
    rules: {
      // jsdom renkleri hesaplayamadığı için kontrast kuralını devre dışı bırak;
      // kontrast değerleri ayrı bir birim testinde doğrulanır.
      'color-contrast': { enabled: false },
    },
  });
  expect(results.violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.html.slice(0, 80)).join(' | ')}`)).toEqual([]);
}

describe('accessibility', () => {
  it('list screen has no axe violations in light theme', async () => {
    useSettingsStore.getState().setTheme('light');
    await saveNote(createNote({ title: 'Erişilebilirlik', bodyText: 'içerik' }));
    const { container } = render(<App />);
    await screen.findByRole('listitem');
    await expectNoViolations(container);
  });

  it('list screen has no axe violations in dark theme', async () => {
    useSettingsStore.getState().setTheme('dark');
    await saveNote(createNote({ title: 'Karanlık', bodyText: 'içerik' }));
    const { container } = render(<App />);
    await screen.findByRole('listitem');
    await expectNoViolations(container);
  });

  it('editor screen has no axe violations', async () => {
    await saveNote(createNote({ title: 'Düzenleme', bodyText: 'metin' }));
    const { container } = render(<App />);
    await screen.findByRole('listitem');
    fireEvent.click(screen.getByRole('button', { name: 'Düzenleme notunu aç' }));
    await waitFor(() => expect(screen.getByRole('textbox', { name: 'Başlık' })).toBeVisible());
    await expectNoViolations(container);
  });

  it('confirm dialog has no axe violations and closes with Escape', async () => {
    await saveNote(createNote({ title: 'Dialog', bodyText: 'metin' }));
    const { container } = render(<App />);
    await screen.findByRole('listitem');
    fireEvent.click(screen.getByRole('button', { name: 'Dialog notunu sil' }));
    expect(await screen.findByRole('alertdialog')).toBeInTheDocument();
    await expectNoViolations(container);
    fireEvent.keyDown(screen.getByRole('alertdialog'), { key: 'Escape' });
    await waitFor(() => expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument());
  });
});
