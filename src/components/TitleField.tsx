import { tr } from '../i18n/tr';
import { FONT_DISPLAY, FONT_STACKS } from '../theme/fonts';
import type { FontKey } from '../types';
import { CalendarIcon } from './icons';

interface Props {
  title: string;
  titleColor: string | null;
  titleFont: FontKey | null;
  date: string | null;
  words: number;
  onTitleChange: (value: string) => void;
  onTitleColorChange: (value: string | null) => void;
  onTitleFontChange: (value: FontKey | null) => void;
  onDateChange: (value: string | null) => void;
}

export default function TitleField({
  title,
  titleColor,
  titleFont,
  date,
  words,
  onTitleChange,
  onTitleColorChange,
  onTitleFontChange,
  onDateChange,
}: Props) {
  return (
    <div className="shrink-0 border-b border-line bg-paper">
      <div className="col">
        <div className="mx-auto w-full max-w-3xl px-6 pb-3 pt-4 sm:px-11">
          <input
            autoFocus
            type="text"
            aria-label={tr.titlePlaceholder}
            placeholder={tr.titlePlaceholder}
            value={title}
            onChange={(e) => onTitleChange(e.target.value)}
            className="title-input"
            style={{
              color: titleColor ?? undefined,
              fontFamily: titleFont ? FONT_STACKS[titleFont] : undefined,
            }}
          />
          <div
            className="mt-2.5 flex flex-wrap items-center gap-x-4 gap-y-2"
            role="group"
            aria-label={tr.titleToolsLabel}
          >
            <div className="toolbar-group">
              <span className="caption">{tr.titleFont}</span>
              <select
                aria-label={tr.titleFont}
                className="field h-7 text-[12px]"
                value={titleFont ?? ''}
                onChange={(e) => onTitleFontChange((e.target.value || null) as FontKey | null)}
              >
                <option value="">{tr.titleFontTheme}</option>
                {(Object.keys(FONT_DISPLAY) as FontKey[]).map((f) => (
                  <option key={f} value={f}>
                    {FONT_DISPLAY[f]}
                  </option>
                ))}
              </select>
            </div>
            <div className="toolbar-group">
              <span className="caption">{tr.titleColor}</span>
              <input
                type="color"
                aria-label={tr.titleColorPicker}
                title={tr.titleColorPicker}
                value={titleColor ?? '#000000'}
                onChange={(e) => onTitleColorChange(e.target.value)}
                className="swatch !h-6"
              />
              <button
                type="button"
                className="btn-ghost !h-6 !px-1.5 text-[11px]"
                onClick={() => onTitleColorChange(null)}
              >
                {tr.clear}
              </button>
            </div>
            <div className="ml-auto flex flex-wrap items-center gap-2">
              {date ? (
                <>
                  <CalendarIcon className="h-3.5 w-3.5 text-muted" />
                  <input
                    type="date"
                    aria-label={tr.dateLabel}
                    value={date}
                    onChange={(e) => onDateChange(e.target.value || null)}
                    className="field h-7 text-[11.5px]"
                  />
                  <button
                    type="button"
                    className="btn-ghost !h-6 !px-1.5 text-[11px]"
                    onClick={() => onDateChange(null)}
                  >
                    {tr.removeDate}
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  className="btn-ghost !h-6 !px-1.5 text-[11px]"
                  onClick={() => onDateChange(new Date().toISOString().slice(0, 10))}
                >
                  <CalendarIcon className="h-3.5 w-3.5" />
                  {tr.addDate}
                </button>
              )}
              <span className="text-[11px] tabular-nums text-muted">{tr.wordCount(words)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
