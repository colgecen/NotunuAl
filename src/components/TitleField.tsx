import { tr } from '../i18n/tr';
import { FONT_DISPLAY, FONT_STACKS } from '../theme/fonts';
import type { FontKey } from '../types';

interface Props {
  title: string;
  titleColor: string | null;
  titleFont: FontKey | null;
  onTitleChange: (value: string) => void;
  onTitleColorChange: (value: string | null) => void;
  onTitleFontChange: (value: FontKey | null) => void;
}

export default function TitleField({
  title,
  titleColor,
  titleFont,
  onTitleChange,
  onTitleColorChange,
  onTitleFontChange,
}: Props) {
  return (
    <div className="col pb-2 pt-3">
      <input
        autoFocus
        type="text"
        aria-label={tr.titlePlaceholder}
        placeholder={tr.titlePlaceholder}
        value={title}
        onChange={(e) => onTitleChange(e.target.value)}
        className="w-full bg-transparent text-2xl font-bold leading-snug outline-none placeholder:font-normal placeholder:text-muted"
        style={{
          color: titleColor ?? undefined,
          fontFamily: titleFont ? FONT_STACKS[titleFont] : undefined,
        }}
      />
      <div
        className="mt-1.5 flex flex-wrap items-center gap-2"
        role="group"
        aria-label={tr.titleToolsLabel}
      >
        <span className="caption">{tr.titleFont}</span>
        <select
          aria-label={tr.titleFont}
          className="field"
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
        <span className="sep" aria-hidden="true" />
        <span className="caption">{tr.titleColor}</span>
        <input
          type="color"
          aria-label={tr.titleColorPicker}
          title={tr.titleColorPicker}
          value={titleColor ?? '#000000'}
          onChange={(e) => onTitleColorChange(e.target.value)}
          className="swatch"
        />
        <button type="button" className="btn-ghost" onClick={() => onTitleColorChange(null)}>
          {tr.clear}
        </button>
      </div>
    </div>
  );
}
