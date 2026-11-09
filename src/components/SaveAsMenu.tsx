import { useState } from 'react';
import { tr } from '../i18n/tr';
import type { ExportFormat } from '../services/export';
import { ChevronDownIcon } from './icons';

interface Props {
  onSelect: (format: ExportFormat) => void;
}

const FORMATS: ExportFormat[] = ['xlsx', 'docx', 'pptx', 'pdf', 'txt'];

const LABELS: Record<ExportFormat, string> = {
  xlsx: tr.export.excel,
  docx: tr.export.word,
  pptx: tr.export.powerpoint,
  pdf: tr.export.pdf,
  txt: tr.export.text,
};

export default function SaveAsMenu({ onSelect }: Props) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button
        type="button"
        aria-label={tr.saveAs}
        aria-haspopup="menu"
        aria-expanded={open}
        className="btn gap-1"
        onClick={() => setOpen((v) => !v)}
        onKeyDown={(e) => {
          if (e.key === 'Escape') setOpen(false);
        }}
      >
        {tr.saveAs}
        <ChevronDownIcon
          className={`h-3.5 w-3.5 transition-transform ${open ? 'rotate-180' : ''}`}
        />
      </button>
      {open ? (
        <div
          role="menu"
          aria-label={tr.saveAs}
          className="absolute left-0 top-full z-30 mt-1 w-52 overflow-hidden rounded-card border border-line bg-paper py-1 shadow-float"
        >
          {FORMATS.map((fmt) => (
            <button
              key={fmt}
              type="button"
              role="menuitem"
              className="block w-full px-3 py-1.5 text-left text-sm text-fg transition-colors hover:bg-hover"
              onClick={() => {
                setOpen(false);
                onSelect(fmt);
              }}
            >
              {LABELS[fmt]}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
