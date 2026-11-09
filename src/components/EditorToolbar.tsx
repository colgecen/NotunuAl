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
      className="border-b border-line bg-paper text-sm"
      role="group"
      aria-label={tr.editorToolbarLabel}
    >
      <div className="col flex flex-wrap items-center gap-2 py-2">
        <button
          type="button"
          aria-label={tr.bold}
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
          title={tr.italic}
          data-pressed={editor?.isActive('italic') ?? false}
          className="btn-toggle italic"
          onClick={() => editor?.chain().focus().toggleItalic().run()}
        >
          I
        </button>
        <span className="sep" aria-hidden="true" />

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
        <span className="sep" aria-hidden="true" />

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
          className="btn-ghost"
          onClick={() => editor?.chain().focus().unsetHighlight().run()}
        >
          {tr.clear}
        </button>
        <span className="sep" aria-hidden="true" />

        <span className="caption">{tr.fontFamily}</span>
        <select
          aria-label={tr.fontFamily}
          className="field"
          value={bodyFont}
          onChange={(e) => onFontChange(e.target.value as FontKey)}
        >
          {(Object.keys(FONT_DISPLAY) as FontKey[]).map((f) => (
            <option key={f} value={f}>
              {FONT_DISPLAY[f]}
            </option>
          ))}
        </select>
        <span className="sep" aria-hidden="true" />

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
          className="w-28 cursor-pointer accent-accent"
        />
        <button
          type="button"
          aria-label={tr.increaseFont}
          title={tr.increaseFont}
          className="btn-toggle text-base"
          onClick={() => onFontSizeChange(Math.min(MAX_SIZE, bodyFontSize + 1))}
        >
          A+
        </button>
        <span className="text-xs tabular-nums text-muted">{bodyFontSize}px</span>
      </div>
    </div>
  );
}
