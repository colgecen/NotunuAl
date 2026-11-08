import Fuse from 'fuse.js';
import type { Note } from '../types';

const map: Record<string, string> = {
  ç: 'c',
  ğ: 'g',
  ı: 'i',
  ö: 'o',
  ş: 's',
  ü: 'u',
  â: 'a',
  î: 'i',
  û: 'u',
};

export function normalizeTr(value: string): string {
  const lower = value.toLocaleLowerCase('tr');
  let out = '';
  for (const ch of lower) {
    out += map[ch] ?? ch;
  }
  return out;
}

interface SearchableNote extends Note {
  nTitle: string;
  nBody: string;
}

export class SearchService {
  private fuse: Fuse<SearchableNote> | null = null;
  private notes: SearchableNote[] = [];

  setNotes(notes: Note[]) {
    this.notes = notes.map((n) => ({
      ...n,
      nTitle: normalizeTr(n.title),
      nBody: normalizeTr(n.bodyText),
    }));
    this.fuse = new Fuse(this.notes, {
      keys: [
        { name: 'nTitle', weight: 2 },
        { name: 'nBody', weight: 1 },
      ],
      includeScore: true,
      threshold: 0.4,
      ignoreLocation: true,
    });
  }

  search(query: string): Note[] {
    const q = normalizeTr(query.trim());
    if (!q) return this.notes.map(({ nTitle: _nTitle, nBody: _nBody, ...n }) => n);
    const results = this.fuse?.search(q) ?? [];
    return results.map(({ item }) => {
      const { nTitle: _nTitle, nBody: _nBody, ...note } = item;
      return note;
    });
  }
}

export const searchService = new SearchService();