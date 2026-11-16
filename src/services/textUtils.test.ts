import { describe, expect, it } from 'vitest';
import { formatNoteDate } from './textUtils';

describe('formatNoteDate', () => {
  it('formatlar ISO tarihi listede okunur biçime çevirir', () => {
    expect(formatNoteDate('2026-11-16')).toBe('16 Kas 2026');
    expect(formatNoteDate('2026-01-03')).toBe('3 Oca 2026');
  });

  it('geçersiz veya boş değeri olduğu gibi bırakır', () => {
    expect(formatNoteDate('16.11.2026')).toBe('16.11.2026');
    expect(formatNoteDate('2026-13-01')).toBe('2026-13-01');
    expect(formatNoteDate(null)).toBe('');
    expect(formatNoteDate(undefined)).toBe('');
  });
});
