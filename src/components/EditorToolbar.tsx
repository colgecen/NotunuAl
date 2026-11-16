import type { Editor } from '@tiptap/core';
import { tr } from '../i18n/tr';
import { FONT_DISPLAY } from '../theme/fonts';
import type { FontKey } from '../types';
import { HighlightIcon, PaletteIcon } from './icons';

interface Props {
  editor: Editor | null;
  bodyFont: FontKey;
  bodyFontSize: number;
  onFontChange: (font: FontKey) => void;
  onFontSizeChange: (size: number) => void;
}

const MIN_SIZE = 12;
const MAX_SIZE = 32;

export default function EditorToolbar({
  editor,
  bodyFont,
  bodyFontSize,
  onFontChange,
  onFontSizeChange,
}: Props) {
  const setColor = (color: string) => editor?.chain().focus().setColor(color).run();
  const setHighlight = (color: string) => editor?.chain().focus().toggleHighlight({ color }).run();

  return (
    <div
      className="shrink-0 border-b border-line bg-paper text-sm"
      role="group"
      aria-label={tr.editorToolbarLabel}
    >
      <div className="col flex flex-wrap items-center gap-x-3 gap-y-1.5 py-1.5">
        <div className="toolbar-group">
          <button
            type="button"
            aria-label={tr.bold}
            aria-pressed={editor?.isActive('bold') ?? false}
            title={tr.bold}
            data-pressed={editor?.isActive('bold') ?? false}
            className="btn-toggle font-bold"
            onClick={() => editor?.chain().focus().toggleBold().run()}
          >
            B
          </button>
          <button
            type="button"
            aria-label={tr.italic}
            aria-pressed={editor?.isActive('italic') ?? false}
            title={tr.italic}
            data-pressed={editor?.isActive('italic') ?? false}
            className="btn-toggle italic"
            onClick={() => editor?.chain().focus().toggleItalic().run()}
          >
            I
          </button>
        </div>

        <span className="sep hidden md:block" aria-hidden="true" />

        <div className="toolbar-group">
          <span className="caption inline-flex items-center gap-1">
            <PaletteIcon className="h-3.5 w-3.5" />
            {tr.textColor}
          </span>
          <input
            type="color"
            aria-label={tr.textColor}
            title={tr.textColor}
            defaultValue="#000000"
            onChange={(e) => setColor(e.target.value)}
            className="swatch"
          />
        </div>

        <div className="toolbar-group">
          <span className="caption inline-flex items-center gap-1">
            <HighlightIcon className="h-3.5 w-3.5" />
            {tr.highlightLabel}
          </span>
          <input
            type="color"
            aria-label={tr.highlightColor}
            title={tr.highlightColor}
            defaultValue="#fff200"
            onChange={(e) => setHighlight(e.target.value)}
            className="swatch"
          />
          <button
            type="button"
            className="btn-ghost !h-6 !px-1.5 text-[11px]"
            onClick={() => editor?.chain().focus().unsetHighlight().run()}
          >
            {tr.clear}
          </button>
        </div>

        <span className="sep hidden md:block" aria-hidden="true" />

        <div className="toolbar-group">
          <span className="caption">{tr.fontFamily}</span>
          <select
            aria-label={tr.fontFamily}
            className="field h-7 text-[12px]"
            value={bodyFont}
            onChange={(e) => onFontChange(e.target.value as FontKey)}
          >
            {(Object.keys(FONT_DISPLAY) as FontKey[]).map((f) => (
              <option key={f} value={f}>
                {FONT_DISPLAY[f]}
              </option>
            ))}
          </select>
        </div>

        <span className="sep hidden md:block" aria-hidden="true" />

        <div className="toolbar-group">
          <span className="caption">{tr.fontSize}</span>
          <button
            type="button"
            aria-label={tr.decreaseFont}
            title={tr.decreaseFont}
            className="btn-toggle"
            onClick={() => onFontSizeChange(Math.max(MIN_SIZE, bodyFontSize - 1))}
          >
            A-
          </button>
          <input
            type="range"
            min={MIN_SIZE}
            max={MAX_SIZE}
            value={bodyFontSize}
            aria-label={tr.fontSize}
            onChange={(e) => onFontSizeChange(Number(e.target.value))}
            className="h-1 w-20 cursor-pointer accent-accent"
          />
          <button
            type="button"
            aria-label={tr.increaseFont}
            title={tr.increaseFont}
            className="btn-toggle text-[13px]"
            onClick={() => onFontSizeChange(Math.min(MAX_SIZE, bodyFontSize + 1))}
          >
            A+
          </button>
          <span className="w-9 text-right text-[11px] tabular-nums text-muted">
            {bodyFontSize}px
          </span>
        </div>
      </div>
    </div>
  );
}
