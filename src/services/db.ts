import Dexie, { type Table } from 'dexie';
import type { Note } from '../types';

export class NotunuAlDb extends Dexie {
  notes!: Table<Note, string>;

  constructor() {
    super('notunual');
    this.version(1).stores({
      notes: 'id, updatedAt, createdAt, title',
    });
  }
}

export const db = new NotunuAlDb();