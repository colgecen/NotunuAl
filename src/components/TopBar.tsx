import type { ReactNode, Ref } from 'react';
import { tr } from '../i18n/tr';
import NewNoteButton from './NewNoteButton';
import SearchBar from './SearchBar';
import ThemeToggle from './ThemeToggle';

interface Props {
  searchValue: string;
  onSearchChange: (v: string) => void;
  onNewNote: () => void;
  searchRef?: Ref<HTMLInputElement>;
  resultCount?: number;
  children?: ReactNode;
}

export default function TopBar({
  searchValue,
  onSearchChange,
  onNewNote,
  searchRef,
  resultCount = 0,
  children,
}: Props) {
  return (
    <header className="shrink-0 border-b border-line bg-paper py-2.5 shadow-panel">
      <div className="col flex items-center gap-2">
        <NewNoteButton onClick={onNewNote} />
        <SearchBar value={searchValue} onChange={onSearchChange} inputRef={searchRef} />
        <ThemeToggle />
      </div>
      <div className="col mt-2 flex flex-wrap items-center gap-2">
        <span
          aria-hidden="true"
          className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-accent text-[11px] font-bold text-accentfg"
        >
          N
        </span>
        <h1 className="text-sm font-bold tracking-tight text-fg">{tr.appTitle}</h1>
        <span className="rounded-full border border-line bg-surface px-2 py-0.5 text-[11px] text-muted">
          {tr.tagline}
        </span>
        <span className="sep" aria-hidden="true" />
        <p role="status" aria-live="polite" className="text-xs text-muted">
          {tr.searchResults(resultCount)}
        </p>
        <div className="ml-auto">{children}</div>
      </div>
    </header>
  );
}
