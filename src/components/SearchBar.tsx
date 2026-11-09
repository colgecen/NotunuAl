import type { Ref } from 'react';
import { tr } from '../i18n/tr';
import { CloseIcon, SearchIcon } from './icons';

interface Props {
  value: string;
  onChange: (v: string) => void;
  inputRef?: Ref<HTMLInputElement>;
}

export default function SearchBar({ value, onChange, inputRef }: Props) {
  return (
    <div className="relative flex-1">
      <SearchIcon className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={tr.searchPlaceholder}
        aria-label={tr.searchPlaceholder}
        spellCheck={false}
        className="field w-full pl-8 pr-8"
      />
      {value ? (
        <button
          type="button"
          aria-label={tr.clearSearch}
          onClick={() => onChange('')}
          className="btn-icon absolute right-1.5 top-1/2 h-6 w-6 -translate-y-1/2"
        >
          <CloseIcon className="h-3.5 w-3.5" />
        </button>
      ) : (
        <span
          aria-hidden="true"
          title={tr.shortcutHint('.')}
          className="kbd pointer-events-none absolute right-2 top-1/2 -translate-y-1/2"
        >
          .
        </span>
      )}
    </div>
  );
}
