import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import App from '../App';
import { listNotes, saveNote, createNote } from '../services/noteRepo';

describe('delete note', () => {
  it('asks confirmation and deletes on confirm', async () => {
    const note = createNote({ title: 'Silinecek' });
    await saveNote(note);
    render(<App />);
    await screen.findByText('Silinecek');
    fireEvent.click(screen.getByRole('button', { name: 'Sil: Silinecek' }));
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /^Sil$/ }));
    await waitFor(async () => expect(await listNotes()).toHaveLength(0));
  });

  it('keeps note on cancel', async () => {
    const note = createNote({ title: 'Kalsın' });
    await saveNote(note);
    render(<App />);
    await screen.findByText('Kalsın');
    fireEvent.click(screen.getByRole('button', { name: 'Sil: Kalsın' }));
    fireEvent.click(screen.getByRole('button', { name: 'İptal' }));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(await listNotes()).toHaveLength(1);
  });
});