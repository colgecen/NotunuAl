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
  openNote: (id) => set({ activeNoteId: id, screen: 'editor' }),
  openNewNote: () => set({ activeNoteId: null, screen: 'editor' }),
  closeEditor: () => set({ screen: 'list', activeNoteId: null }),
  saveHandler: null,
  registerSaveHandler: (handler) => set({ saveHandler: handler }),
  save: async () => {
    await get().saveHandler?.();
  },
  focusSearch: () => get().searchInputRef?.current?.focus(),
  registerSearchRef: (ref) => set({ searchInputRef: ref }),
}));