import '@testing-library/jest-dom/vitest';
import 'fake-indexeddb/auto';
import { afterEach, beforeEach } from 'vitest';
import { cleanup } from '@testing-library/react';
import { db } from '../src/services/db';
import { useNotesStore } from '../src/store/notesStore';
import { useUIStore } from '../src/store/uiStore';
import { useSettingsStore } from '../src/store/settingsStore';

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
  useSettingsStore.setState({ theme: 'light', viewMode: 'rows', bodyFontSize: 16, bodyFont: 'arial' });
});

afterEach(() => {
  cleanup();
});

if (!Element.prototype.scrollIntoView) {
  Element.prototype.scrollIntoView = () => {};
}

if (!URL.createObjectURL) {
  URL.createObjectURL = () => 'blob:mock';
}
if (!URL.revokeObjectURL) {
  URL.revokeObjectURL = () => {};
}

// jsdom has no layout; give virtualized lists a viewport measurement.
Object.defineProperty(HTMLElement.prototype, 'clientWidth', {
  configurable: true,
  get: () => 800,
});
Object.defineProperty(HTMLElement.prototype, 'clientHeight', {
  configurable: true,
  get: () => 600,
});
Element.prototype.getBoundingClientRect = function getBoundingClientRect() {
  return {
    width: 800,
    height: 600,
    top: 0,
    left: 0,
    bottom: 600,
    right: 800,
    x: 0,
    y: 0,
    toJSON: () => ({}),
  } as DOMRect;
};

if (!('ResizeObserver' in globalThis)) {
  class ResizeObserverMock {
    private readonly cb: ResizeObserverCallback;
    constructor(cb: ResizeObserverCallback) {
      this.cb = cb;
    }
    observe(target: Element) {
      this.cb(
        [
          {
            target,
            contentRect: { width: 800, height: 600, top: 0, left: 0, bottom: 600, right: 800, x: 0, y: 0 },
          } as ResizeObserverEntry,
        ],
        this as unknown as ResizeObserver,
      );
    }
    unobserve() {}
    disconnect() {}
  }
  (globalThis as unknown as Record<string, unknown>).ResizeObserver = ResizeObserverMock;
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