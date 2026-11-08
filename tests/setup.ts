import '@testing-library/jest-dom/vitest';
import 'fake-indexeddb/auto';
import { beforeEach } from 'vitest';
import { db } from '../src/services/db';
import { useNotesStore } from '../src/store/notesStore';
import { useUIStore } from '../src/store/uiStore';

beforeEach(async () => {
  await db.notes.clear();
  localStorage.clear();
  useNotesStore.setState({ notes: [], loaded: false });
  useUIStore.setState({
    screen: 'list',
    search: '',
    results: [],
    selectedIndex: 0,
    activeNoteId: null,
    searchInputRef: null,
  });
});

if (!Element.prototype.scrollIntoView) {
  Element.prototype.scrollIntoView = () => {};
}

// Provide a default matchMedia for jsdom.
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  }),
});