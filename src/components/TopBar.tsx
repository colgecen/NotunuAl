import { tr } from '../i18n/tr';
import type { Ref } from 'react';
import NewNoteButton from './NewNoteButton';
import SearchBar from './SearchBar';
import ThemeToggle from './ThemeToggle';

interface Props {
  searchValue: string;
  onSearchChange: (v: string) => void;
  onNewNote: () => void;
  searchRef?: Ref<HTMLInputElement>;
}

export default function TopBar({ searchValue, onSearchChange, onNewNote, searchRef }: Props) {
  return (
    <header className="flex items-center gap-2 p-2 border-b border-line">
      <NewNoteButton onClick={onNewNote} />
      <SearchBar value={searchValue} onChange={onSearchChange} inputRef={searchRef} />
      <ThemeToggle />
      <span className="sr-only">{tr.appTitle}</span>
    </header>
  );
}