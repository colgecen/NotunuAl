import { tr } from '../i18n/tr';

import type { Ref } from 'react';

interface Props {
  value: string;
  onChange: (v: string) => void;
  inputRef?: Ref<HTMLInputElement>;
}

export default function SearchBar({ value, onChange, inputRef }: Props) {
  return (
    <input
      ref={inputRef}
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={tr.searchPlaceholder}
      aria-label={tr.searchPlaceholder}
      className="flex-1 mx-2 px-3 py-1 rounded border border-line bg-paper text-fg"
    />
  );
}