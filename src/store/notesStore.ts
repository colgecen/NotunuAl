import { create } from 'zustand';
import type { Note } from '../types';
import { createNote, deleteNote, listNotes, saveNote } from '../services/noteRepo';

interface NotesState {
  notes: Note[];
  loaded: boolean;
  load: () => Promise<void>;
  create: (partial?: Partial<Note>) => Promise<Note>;
  save: (note: Note) => Promise<void>;
  remove: (id: string) => Promise<void>;
}

export const useNotesStore = create<NotesState>((set, get) => ({
  notes: [],
  loaded: false,
  load: async () => {
    const notes = await listNotes();
    set({ notes, loaded: true });
  },
  create: async (partial) => {
    const note = createNote(partial);
    await saveNote(note);
    set({ notes: [note, ...get().notes] });
    return note;
  },
  save: async (note) => {
    await saveNote(note);
    const notes = await listNotes();
    set({ notes });
  },
  remove: async (id) => {
    await deleteNote(id);
    set({ notes: get().notes.filter((n) => n.id !== id) });
  },
}));