import { useState } from 'react';
import { tr } from '../i18n/tr';

export type ExportFormat = 'xlsx' | 'docx' | 'pptx' | 'pdf' | 'txt';

interface Props {
  onSelect: (format: ExportFormat) => void;
}

export default function SaveAsMenu({ onSelect }: Props) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button
        type="button"
        aria-label={tr.saveAs}
        aria-expanded={open}
        className="px-3 py-1 rounded border border-line text-fg text-sm"
        onClick={() => setOpen((v) => !v)}
      >
        {tr.saveAs}
      </button>
      {open ? (
        <div role="menu" className="absolute left-0 top-full mt-1 z-30 bg-paper text-fg border border-line rounded shadow-lg">
          {(['xlsx', 'docx', 'pptx', 'pdf', 'txt'] as ExportFormat[]).map((fmt) => (
            <button
              key={fmt}
              type="button"
              role="menuitem"
              className="block w-full text-left px-3 py-1 hover:bg-bg"
              onClick={() => {
                setOpen(false);
                onSelect(fmt);
              }}
            >
              {{ xlsx: tr.export.excel, docx: tr.export.word, pptx: tr.export.powerpoint, pdf: tr.export.pdf, txt: tr.export.text }[fmt]}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}