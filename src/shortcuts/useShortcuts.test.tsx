import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import App from '../App';
import { useNotesStore } from '../store/notesStore';
import { useUIStore } from '../store/uiStore';
import { saveNote } from '../services/noteRepo';

beforeEach(async () => {
  useUIStore.setState({ screen: 'list', search: '', results: [], selectedIndex: 0 });
  useNotesStore.setState({ notes: [] });
});

const makeNote = (id: string, title: string, updatedAt: number) => ({
  id,
  title,
  titleColor: null,
  titleFont: null,
  body: { type: 'doc' as const },
  bodyText: title,
  date: null,
  createdAt: updatedAt,
  updatedAt,
});

describe('shortcuts', () => {
  it('focuses search when "." pressed outside input', async () => {
    render(<App />);
    fireEvent.keyDown(window, { key: '.', code: 'Period' });
    await waitFor(() => expect(document.activeElement).toBe(screen.getByRole('textbox', { name: 'Ara...' })));
  });

  it('types "." inside search input', async () => {
    render(<App />);
    const input = screen.getByRole('textbox', { name: 'Ara...' });
    input.focus();
    fireEvent.keyDown(input, { key: '.', code: 'Period' });
    fireEvent.change(input, { target: { value: '.' } });
    expect((input as HTMLInputElement).value).toBe('.');
  });

  it('arrow keys move selection and Enter opens note', async () => {
    await saveNote(makeNote('a', 'A', 3));
    await saveNote(makeNote('b', 'B', 2));
    await saveNote(makeNote('c', 'C', 1));
    render(<App />);
    await waitFor(() => expect(useUIStore.getState().results.length).toBe(3));
    expect(useUIStore.getState().selectedIndex).toBe(0);
    fireEvent.keyDown(window, { key: 'ArrowDown' });
    fireEvent.keyDown(window, { key: 'ArrowDown' });
    fireEvent.keyDown(window, { key: 'ArrowUp' });
    expect(useUIStore.getState().selectedIndex).toBe(1);
    fireEvent.keyDown(window, { key: 'Enter' });
    expect(useUIStore.getState().activeNoteId).toBe('b');
  });

  it('clears search on Esc when query present', async () => {
    await saveNote(makeNote('a', 'A', 1));
    render(<App />);
    const input = screen.getByRole('textbox', { name: 'Ara...' });
    fireEvent.change(input, { target: { value: 'a' } });
    expect(useUIStore.getState().search).toBe('a');
    fireEvent.keyDown(window, { key: 'Escape' });
    expect(useUIStore.getState().search).toBe('');
  });
});