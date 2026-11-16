import { describe, expect, it } from 'vitest';
import { en } from './en';
import { tr } from './tr';

function shape(value: unknown): unknown {
  if (typeof value === 'function') return 'function';
  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value).map(([key, child]) => [key, shape(child)]),
    );
  }
  return typeof value;
}

describe('English screenshot locale', () => {
  it('covers the same keys as the Turkish UI', () => {
    expect(shape(en)).toEqual(shape(tr));
  });

  it('produces English strings for the screenshot pipeline', () => {
    expect(en.newNote).toBe('+ New Note');
    expect(en.openNote('Weekly plan')).toBe('Open Weekly plan');
    expect(en.noteCount(5)).toBe('5 notes');
  });
});
