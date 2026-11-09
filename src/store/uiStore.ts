import type { RefObject } from 'react';
import { create } from 'zustand';
import { searchService } from '../services/searchService';
import type { Note } from '../types';

export type Screen = 'list' | 'editor';

interface UIState {
  screen: Screen;
  search: string;
  results: Note[];
  selectedIndex: number;
  activeNoteId: string | null;
  session: number;
  setSearch: (query: string) => void;
  setResults: (notes: Note[]) => void;
  moveSelection: (delta: number) => void;
  selectIndex: (idx: number) => void;
  openNote: (id: string) => void;
  openNewNote: () => void;
  closeEditor: () => void;
  saveHandler: (() => Promise<void>) | null;
  registerSaveHandler: (handler: (() => Promise<void>) | null) => void;
  save: () => Promise<void>;
  saveAndClose: () => Promise<void>;
  newNote: () => Promise<void>;
  focusSearch: () => void;
  searchInputRef: RefObject<HTMLInputElement | null> | null;
  registerSearchRef: (ref: RefObject<HTMLInputElement | null> | null) => void;
}

export const useUIStore = create<UIState>((set, get) => ({
  screen: 'list',
  search: '',
  results: [],
  selectedIndex: 0,
  activeNoteId: null,
  session: 0,
  searchInputRef: null,
  setSearch: (query) => {
    const results = searchService.search(query);
    set({ search: query, results, selectedIndex: 0 });
  },
  setResults: (notes) => {
    searchService.setNotes(notes);
    const results = get().search ? searchService.search(get().search) : notes;
    set({ results, selectedIndex: 0 });
  },
  moveSelection: (delta) => {
    const { results, selectedIndex } = get();
    if (results.length === 0) return;
    const next = Math.min(Math.max(0, selectedIndex + delta), results.length - 1);
    set({ selectedIndex: next });
  },
  selectIndex: (idx) => set({ selectedIndex: idx }),
  openNote: (id) =>
    set((state) => ({ activeNoteId: id, screen: 'editor', session: state.session + 1 })),
  openNewNote: () =>
    set((state) => ({ activeNoteId: null, screen: 'editor', session: state.session + 1 })),
  closeEditor: () => set({ screen: 'list', activeNoteId: null }),
  saveHandler: null,
  registerSaveHandler: (handler) => set({ saveHandler: handler }),
  save: async () => {
    await get().saveHandler?.();
  },
  saveAndClose: async () => {
    await get().saveHandler?.();
    set({ screen: 'list', activeNoteId: null });
  },
  newNote: async () => {
    if (get().screen === 'editor') await get().saveHandler?.();
    set((state) => ({ screen: 'editor', activeNoteId: null, session: state.session + 1 }));
  },
  focusSearch: () => get().searchInputRef?.current?.focus(),
  registerSearchRef: (ref) => set({ searchInputRef: ref }),
}));