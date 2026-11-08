import { useEffect, useRef, useState } from 'react';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Highlight from '@tiptap/extension-highlight';
import { TextStyleKit } from '@tiptap/extension-text-style';
import type { Note } from '../types';
import { createNote, getNote, saveNote, deleteNote } from '../services/noteRepo';
import { extractBodyText } from '../services/textUtils';
import { useNotesStore } from '../store/notesStore';
import { useSettingsStore } from '../store/settingsStore';
import { FONT_DISPLAY, FONT_STACKS } from '../theme/fonts';
import { tr } from '../i18n/tr';
import type { FontKey } from '../types';

interface Props {
  noteId: string | null;
  onClose: () => void;
}

export default function NoteEditor({ noteId, onClose }: Props) {
  const [note, setNote] = useState<Note>(() => createNote({ id: noteId ?? undefined }));
  const [loaded, setLoaded] = useState(!noteId);
  const [savedFlash, setSavedFlash] = useState(false);
  const titleRef = useRef<HTMLInputElement>(null);
  const refresh = useNotesStore((s) => s.load);
  const bodyFontSize = useSettingsStore((s) => s.bodyFontSize);
  const bodyFont = useSettingsStore((s) => s.bodyFont);
  const setBodyFontSize = useSettingsStore((s) => s.setBodyFontSize);

  const editor = useEditor({
    extensions: [
      StarterKit,
      TextStyleKit,
      Highlight.configure({ multicolor: true }),
    ],
    content: note.body,
    editorProps: {
      attributes: {
        class: 'tiptap',
        style: `font-family:${FONT_STACKS[bodyFont]}; font-size:${bodyFontSize}px; min-height:200px;`,
      },
    },
    onUpdate: ({ editor: ed }) => {
      const body = ed.getJSON();
      setNote((prev) => ({ ...prev, body, bodyText: extractBodyText(body) }));
    },
  });

  useEffect(() => {
    if (!noteId) return;
    let cancelled = false;
    void getNote(noteId).then((found) => {
      if (cancelled) return;
      const next = found ?? createNote({ id: noteId });
      setNote(next);
      if (editor) editor.commands.setContent(next.body);
      setLoaded(true);
    });
    return () => {
      cancelled = true;
    };
  }, [noteId, editor]);

  useEffect(() => {
    if (!editor || !loaded) return;
    editor.setOptions({
      editorProps: {
        attributes: {
          class: 'tiptap',
          style: `font-family:${FONT_STACKS[bodyFont]}; font-size:${bodyFontSize}px; min-height:200px;`,
        },
      },
    });
  }, [editor, bodyFont, bodyFontSize, loaded]);

  const persist = async (next: Note) => {
    const saved = await saveNote(next);
    setNote(saved);
    await refresh();
    setSavedFlash(true);
    setTimeout(() => setSavedFlash(false), 1200);
  };

  const handleClose = async () => {
    const empty = !note.title.trim() && !extractBodyText(note.body).trim();
    const existed = (await getNote(note.id)) !== undefined;
    if (empty) {
      if (existed) await deleteNote(note.id);
    } else {
      await persist(note);
    }
    onClose();
  };

  const toggleBold = () => editor?.chain().focus().toggleBold().run();
  const toggleItalic = () => editor?.chain().focus().toggleItalic().run();
  const setColor = (color: string) => editor?.chain().focus().setColor(color).run();
  const setHighlight = (color: string) =>
    editor?.chain().focus().toggleHighlight({ color }).run();
  const setFontFamily = (font: FontKey) =>
    editor?.chain().focus().setFontFamily(FONT_STACKS[font]).run();
  const setFontSize = (size: number) => {
    setBodyFontSize(size);
    editor?.chain().focus().setFontSize(`${size}px`).run();
  };

  if (!loaded) return <div className="p-4">{tr.appTitle}</div>;

  return (
    <div className="h-full flex flex-col p-4 gap-2 overflow-auto">
      <div className="flex gap-2 items-center">
        <button type="button" aria-label={tr.save} className="px-3 py-1 rounded border border-line text-fg" onClick={() => void persist(note)}>
          {tr.save}
        </button>
        <button type="button" aria-label={tr.saveAs} className="px-3 py-1 rounded border border-line text-fg text-sm" onClick={() => {}}>
          {tr.saveAs}
        </button>
        <button type="button" aria-label={tr.back} className="px-3 py-1 rounded border border-line text-fg" onClick={() => void handleClose()}>
          {tr.back}
        </button>
        <button type="button" aria-label={tr.delete} className="px-3 py-1 rounded border border-line text-red-500" onClick={() => {}}>
          {tr.delete}
        </button>
        {savedFlash ? <span className="text-xs text-muted ml-2">{tr.saved}</span> : null}
      </div>

      <input
        ref={titleRef}
        autoFocus
        type="text"
        aria-label={tr.titlePlaceholder}
        placeholder={tr.titlePlaceholder}
        value={note.title}
        onChange={(e) => setNote({ ...note, title: e.target.value })}
        className="text-2xl font-bold bg-transparent border-b-2 border-line pb-1 outline-none"
        style={{ color: note.titleColor ?? undefined, fontFamily: note.titleFont ? FONT_STACKS[note.titleFont] : undefined }}
      />
      <div className="flex flex-wrap items-center gap-2 text-sm text-muted">
        <label>
          {tr.titlePlaceholder} {tr.formats.arial}
          <select
            aria-label="Başlık yazı tipi"
            className="ml-1 p-1 rounded border border-line bg-paper text-fg"
            value={note.titleFont ?? ''}
            onChange={(e) =>
              setNote({ ...note, titleFont: (e.target.value || null) as FontKey | null })
            }
          >
            <option value="">Tema</option>
            {(Object.keys(FONT_DISPLAY) as FontKey[]).map((f) => (
              <option key={f} value={f}>
                {FONT_DISPLAY[f]}
              </option>
            ))}
          </select>
        </label>
        <label>
          {tr.titlePlaceholder} rengi
          <input
            type="color"
            aria-label="Başlık rengi seç"
            value={note.titleColor ?? '#000000'}
            onChange={(e) => setNote({ ...note, titleColor: e.target.value })}
            className="h-6 w-10 ml-1"
          />
          <button type="button" className="underline ml-1" onClick={() => setNote({ ...note, titleColor: null })}>
            Temizle
          </button>
        </label>
      </div>

      <div className="flex flex-wrap items-center gap-2 p-2 border border-line rounded bg-paper text-sm">
        <button type="button" aria-label="Kalın" className="font-bold px-2 border border-line rounded" onClick={toggleBold}>
          B
        </button>
        <button type="button" aria-label="İtalik" className="italic px-2 border border-line rounded" onClick={toggleItalic}>
          I
        </button>
        <label className="flex items-center gap-1">
          Renk
          <input
            type="color"
            aria-label="Yazı rengi"
            defaultValue="#000000"
            onChange={(e) => setColor(e.target.value)}
            className="h-6 w-10"
          />
        </label>
        <label className="flex items-center gap-1">
          Fosfor
          <input
            type="color"
            aria-label="Vurgu rengi"
            defaultValue="#fff200"
            onChange={(e) => setHighlight(e.target.value)}
            className="h-6 w-10"
          />
          <button type="button" className="underline" onClick={() => editor?.chain().focus().unsetHighlight().run()}>
            Temizle
          </button>
        </label>
        <label className="flex items-center gap-1">
          Yazı tipi
          <select
            aria-label="Yazı tipi"
            className="p-1 rounded border border-line bg-paper text-fg"
            value={bodyFont}
            onChange={(e) => {
              const font = e.target.value as FontKey;
              useSettingsStore.getState().setBodyFont(font);
              setFontFamily(font);
            }}
          >
            {(Object.keys(FONT_DISPLAY) as FontKey[]).map((f) => (
              <option key={f} value={f}>
                {FONT_DISPLAY[f]}
              </option>
            ))}
          </select>
        </label>
        <label className="flex items-center gap-1">
          Boyut
          <button type="button" aria-label="Yazı boyutu küçült" className="px-1 border border-line rounded" onClick={() => setFontSize(Math.max(12, bodyFontSize - 1))}>
            A-
          </button>
          <input
            type="range"
            min={12}
            max={32}
            value={bodyFontSize}
            aria-label="Açıklama yazı boyutu"
            onChange={(e) => setFontSize(Number(e.target.value))}
          />
          <button type="button" aria-label="Yazı boyutu büyüt" className="px-1 border border-line rounded" onClick={() => setFontSize(Math.min(32, bodyFontSize + 1))}>
            A+
          </button>
          <span>{bodyFontSize}px</span>
        </label>
      </div>

      <div className="flex items-center gap-2">
        {note.date ? (
          <>
            <input
              type="date"
              aria-label="Tarih"
              value={note.date}
              onChange={(e) => setNote({ ...note, date: e.target.value || null })}
              className="p-1 rounded border border-line bg-paper text-fg"
            />
            <button type="button" className="underline text-sm" onClick={() => setNote({ ...note, date: null })}>
              {tr.removeDate}
            </button>
          </>
        ) : (
          <button
            type="button"
            className="text-sm underline"
            onClick={() => setNote({ ...note, date: new Date().toISOString().slice(0, 10) })}
          >
            {tr.addDate}
          </button>
        )}
      </div>

      <div className="flex-1 min-h-0 border border-line rounded bg-paper overflow-auto">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}