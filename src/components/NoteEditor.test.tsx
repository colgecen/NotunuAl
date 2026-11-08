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
    fireEvent.change(screen.getByRole('textbox', { name: 'Başlık' }), { target: { value: 'Toplantı' } });
    fireEvent.click(screen.getByRole('button', { name: 'Geri' }));
    await waitFor(async () => {
      const notes = await listNotes();
      expect(notes.some((n) => n.title === 'Toplantı')).toBe(true);
    });
  });

  it('deletes an existing note when emptied on close', async () => {
    const note = createNote({ title: 'Dolu', bodyText: 'içerik' });
    await saveNote(note);
    render(<NoteEditor noteId={note.id} onClose={() => {}} />);
    fireEvent.change(screen.getByRole('textbox', { name: 'Başlık' }), { target: { value: '' } });
    fireEvent.change(screen.getByRole('textbox', { name: 'Notunuzu yazın...' }), { target: { value: '' } });
    fireEvent.click(screen.getByRole('button', { name: 'Geri' }));
    await waitFor(async () => expect(await getNote(note.id)).toBeUndefined());
  });

  it('saves title color', async () => {
    render(<NoteEditor noteId={null} onClose={() => {}} />);
    fireEvent.change(screen.getByRole('textbox', { name: 'Başlık' }), { target: { value: 'Renk' } });
    fireEvent.change(screen.getByLabelText('Başlık rengi seç'), { target: { value: '#ff0000' } });
    fireEvent.click(screen.getByRole('button', { name: 'Geri' }));
    await waitFor(async () => {
      const notes = await listNotes();
      expect(notes.find((n) => n.title === 'Renk')?.titleColor).toBe('#ff0000');
    });
  });
});