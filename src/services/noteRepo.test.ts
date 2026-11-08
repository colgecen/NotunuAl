import 'fake-indexeddb/auto';
import { beforeEach, describe, expect, it } from 'vitest';
import { db } from './db';
import { createNote, saveNote, getNote, updateNote, deleteNote, listNotes, extractBodyText } from './noteRepo';
import { loadSettings, saveSettings } from './settingsService';

beforeEach(async () => {
  await db.notes.clear();
  localStorage.clear();
});

describe('noteRepo', () => {
  it('creates and retrieves a note', async () => {
    const note = createNote({ title: 'Merhaba' });
    await saveNote(note);
    const found = await getNote(note.id);
    expect(found?.title).toBe('Merhaba');
  });

  it('updates updatedAt ordering on save', async () => {
    const a = createNote({ title: 'A' });
    await saveNote(a);
    await new Promise((r) => setTimeout(r, 5));
    const b = createNote({ title: 'B' });
    await saveNote(b);
    const list = await listNotes();
    expect(list[0].title).toBe('B');
    expect(list[1].title).toBe('A');
  });

  it('deletes a note', async () => {
    const note = createNote({ title: 'Silinecek' });
    await saveNote(note);
    await deleteNote(note.id);
    expect(await getNote(note.id)).toBeUndefined();
  });

  it('updates a note', async () => {
    const note = createNote({ title: 'Eski' });
    await saveNote(note);
    const updated = await updateNote(note.id, { title: 'Yeni' });
    expect(updated?.title).toBe('Yeni');
    expect((await getNote(note.id))?.title).toBe('Yeni');
  });

  it('derives bodyText', () => {
    const text = extractBodyText({ type: 'doc', content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Merhaba dünya' }] }] });
    expect(text).toBe('Merhaba dünya');
  });
});

describe('settingsService', () => {
  it('returns defaults when storage empty', () => {
    expect(loadSettings().theme).toBe('light');
  });

  it('persists settings', () => {
    saveSettings({ ...loadSettings(), theme: 'dark', bodyFontSize: 20 });
    expect(loadSettings().theme).toBe('dark');
    expect(loadSettings().bodyFontSize).toBe(20);
  });

  it('falls back to defaults on corrupted JSON', () => {
    localStorage.setItem('notunual.settings.v1', '{bad json');
    expect(loadSettings().theme).toBe('light');
  });
});