import { db } from './db';
import type { Note } from '../types';
import { extractBodyText } from './textUtils';
export { extractBodyText };

export function emptyBody(): Note['body'] {
  return { type: 'doc', content: [{ type: 'paragraph' }] };
}

export function createNote(partial: Partial<Note> = {}): Note {
  const now = Date.now();
  const body = partial.body ?? emptyBody();
  const note: Note = {
    id: partial.id ?? crypto.randomUUID(),
    title: partial.title ?? '',
    titleColor: partial.titleColor ?? null,
    titleFont: partial.titleFont ?? null,
    body,
    bodyText: partial.bodyText ?? extractBodyText(body),
    date: partial.date ?? null,
    createdAt: partial.createdAt ?? now,
    updatedAt: partial.updatedAt ?? now,
  };
  return note;
}

export async function getNote(id: string): Promise<Note | undefined> {
  return db.notes.get(id);
}

export async function saveNote(note: Note): Promise<Note> {
  const updated: Note = { ...note, bodyText: extractBodyText(note.body), updatedAt: Date.now() };
  await db.notes.put(updated);
  return updated;
}

export async function upsertNote(note: Note): Promise<Note> {
  await db.notes.put(note);
  return note;
}

export async function updateNote(id: string, patch: Partial<Note>): Promise<Note | undefined> {
  const existing = await db.notes.get(id);
  if (!existing) return undefined;
  const body = patch.body ?? existing.body;
  const updated: Note = {
    ...existing,
    ...patch,
    body,
    bodyText: patch.bodyText ?? extractBodyText(body),
    updatedAt: Date.now(),
  };
  await db.notes.put(updated);
  return updated;
}

export async function deleteNote(id: string): Promise<void> {
  await db.notes.delete(id);
}

export async function listNotes(): Promise<Note[]> {
  const all = await db.notes.toArray();
  return all.sort((a, b) => b.updatedAt - a.updatedAt);
}

export function deriveBodyText(doc: Note['body']): string {
  return extractBodyText(doc);
}