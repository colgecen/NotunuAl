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
  const searching = searchValue.trim() !== '';
  const countLabel = searching ? tr.searchResults(resultCount) : tr.noteCount(resultCount);

  return (
    <header className="shrink-0">
      <div className="topbar-title">
        <div className="col flex h-11 items-center gap-2.5">
          <span className="brand-mark" aria-hidden="true">
            N
          </span>
          <h1 className="truncate text-[13px] font-semibold tracking-tight text-fg">
            {tr.appTitle}
          </h1>
          <span className="pill hidden sm:inline-flex">{tr.tagline}</span>
          <div className="ml-auto flex items-center gap-2.5">
            <p
              role="status"
              aria-live="polite"
              className="text-[11px] font-medium tabular-nums text-muted"
            >
              {countLabel}
            </p>
            <ThemeToggle />
          </div>
        </div>
      </div>
      <div className="border-b border-line bg-paper">
        <div className="col flex items-center gap-2 py-2">
          <NewNoteButton onClick={onNewNote} />
          <SearchBar value={searchValue} onChange={onSearchChange} inputRef={searchRef} />
          {children ? <div className="shrink-0">{children}</div> : null}
        </div>
      </div>
    </header>
  );
}
