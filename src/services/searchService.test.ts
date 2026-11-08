import { describe, expect, it } from 'vitest';
import { normalizeTr, searchService } from './searchService';
import type { Note } from '../types';

const base: Note = {
  id: '1',
  title: '',
  titleColor: null,
  titleFont: null,
  body: { type: 'doc' },
  bodyText: '',
  date: null,
  createdAt: 0,
  updatedAt: 0,
};

const notes: Note[] = [
  { ...base, id: '1', title: 'İstanbul', bodyText: 'sehir' },
  { ...base, id: '2', title: 'Işık', bodyText: 'ışık' },
  { ...base, id: '3', title: 'Ağaç', bodyText: 'orman' },
];

describe('searchService', () => {
  it('normalizes Turkish characters', () => {
    expect(normalizeTr('İ')).toBe('i');
    expect(normalizeTr('I')).toBe('i');
    expect(normalizeTr('Işık')).toBe('isik');
    expect(normalizeTr('AĞAÇ')).toBe('agac');
  });

  it('matches İ and i', () => {
    searchService.setNotes(notes);
    expect(searchService.search('istanbul').map((n) => n.id)).toContain('1');
  });

  it('returns all notes for empty query', () => {
    searchService.setNotes(notes);
    expect(searchService.search('')).toHaveLength(3);
  });

  it('returns matches for body text', () => {
    searchService.setNotes(notes);
    expect(searchService.search('orman').map((n) => n.id)).toEqual(['3']);
  });
});