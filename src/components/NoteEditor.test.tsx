import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import NoteEditor from './NoteEditor';
import { getNote, listNotes, saveNote, createNote } from '../services/noteRepo';

describe('NoteEditor', () => {
  it('does not persist an empty new note on close', async () => {
    render(<NoteEditor noteId={null} onClose={() => {}} />);
    fireEvent.click(screen.getByRole('button', { name: 'Geri' }));
    await waitFor(async () => expect(await listNotes()).toHaveLength(0));
  });

  it('persists a note with title on close', async () => {
    render(<NoteEditor noteId={null} onClose={() => {}} />);
    fireEvent.change(await screen.findByRole('textbox', { name: 'Başlık' }), { target: { value: 'Toplantı' } });
    fireEvent.click(screen.getByRole('button', { name: 'Geri' }));
    await waitFor(async () => {
      const notes = await listNotes();
      expect(notes.some((n) => n.title === 'Toplantı')).toBe(true);
    });
  });

  it('autosaves dirty note after debounce', async () => {
    render(<NoteEditor noteId={null} onClose={() => {}} />);
    fireEvent.change(screen.getByRole('textbox', { name: 'Başlık' }), { target: { value: 'Otomatik' } });
    expect(screen.getByLabelText('Kaydedilmemiş değişiklik')).toBeInTheDocument();
    await waitFor(
      async () => {
        const notes = await listNotes();
        expect(notes.some((n) => n.title === 'Otomatik')).toBe(true);
      },
      { timeout: 2000 },
    );
  });

  it('deletes an existing note when emptied on close', async () => {
    const note = createNote({ title: 'Dolu' });
    await saveNote(note);
    render(<NoteEditor noteId={note.id} onClose={() => {}} />);
    fireEvent.change(await screen.findByRole('textbox', { name: 'Başlık' }), { target: { value: '' } });
    fireEvent.click(screen.getByRole('button', { name: 'Geri' }));
    await waitFor(async () => expect(await getNote(note.id)).toBeUndefined());
  });

  it('adds and removes date', async () => {
    render(<NoteEditor noteId={null} onClose={() => {}} />);
    fireEvent.click(screen.getByRole('button', { name: 'Tarih ekle' }));
    expect(screen.getByLabelText('Tarih')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Tarihi kaldır' }));
    expect(screen.getByRole('button', { name: 'Tarih ekle' })).toBeInTheDocument();
  });

  it('saves title color', async () => {
    render(<NoteEditor noteId={null} onClose={() => {}} />);
    fireEvent.change(await screen.findByRole('textbox', { name: 'Başlık' }), { target: { value: 'Renk' } });
    fireEvent.change(screen.getByLabelText('Başlık rengi seç'), { target: { value: '#ff0000' } });
    fireEvent.click(screen.getByRole('button', { name: 'Geri' }));
    await waitFor(async () => {
      const notes = await listNotes();
      expect(notes.find((n) => n.title === 'Renk')?.titleColor).toBe('#ff0000');
    });
  });
});