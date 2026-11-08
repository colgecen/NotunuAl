import { useCallback, useEffect, useRef, useState } from 'react';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Highlight from '@tiptap/extension-highlight';
import { TextStyleKit } from '@tiptap/extension-text-style';
import type { Note } from '../types';
import { createNote, getNote, saveNote, deleteNote } from '../services/noteRepo';
import { extractBodyText } from '../services/textUtils';
import { useNotesStore } from '../store/notesStore';
import { useUIStore } from '../store/uiStore';
import { useSettingsStore } from '../store/settingsStore';
import { FONT_DISPLAY, FONT_STACKS } from '../theme/fonts';
import { tr } from '../i18n/tr';
import SaveAsMenu, { type ExportFormat } from './SaveAsMenu';
import type { FontKey } from '../types';

interface Props {
  noteId: string | null;
  onClose: () => void;
  onDelete?: (id: string) => void;
}

export default function NoteEditor({ noteId, onClose, onDelete }: Props) {
  const [note, setNote] = useState<Note>(() => createNote({ id: noteId ?? undefined }));
  const [loaded, setLoaded] = useState(!noteId);
  const [dirty, setDirty] = useState(false);
  const [savedFlash, setSavedFlash] = useState(false);
  const titleRef = useRef<HTMLInputElement>(null);
  const latestNote = useRef(note);
  const dirtyRef = useRef(false);
  const timerRef = useRef<number | null>(null);
  const mountedRef = useRef(true);
  const refresh = useNotesStore((s) => s.load);
  const registerSaveHandler = useUIStore((s) => s.registerSaveHandler);
  const bodyFontSize = useSettingsStore((s) => s.bodyFontSize);
  const bodyFont = useSettingsStore((s) => s.bodyFont);
  const setBodyFontSize = useSettingsStore((s) => s.setBodyFontSize);

  function clearTimer() {
    if (timerRef.current) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }

  const doPersist = useCallback(
    async (next: Note) => {
      const saved = await saveNote(next);
      if (mountedRef.current) {
        latestNote.current = saved;
        dirtyRef.current = false;
        setNote(saved);
        setDirty(false);
        setSavedFlash(true);
        window.setTimeout(() => {
          if (mountedRef.current) setSavedFlash(false);
        }, 1200);
      }
      await refresh();
      return saved;
    },
    [refresh],
  );

  const flushSave = useCallback(() => {
    clearTimer();
    const next = latestNote.current;
    const empty = !next.title.trim() && !extractBodyText(next.body).trim();
    if (!dirtyRef.current || empty) return Promise.resolve(next);
    return doPersist(next);
  }, [doPersist]);

  const flushSaveRef = useRef(flushSave);
  useEffect(() => {
    flushSaveRef.current = flushSave;
  }, [flushSave]);

  function markDirty(next: Note) {
    latestNote.current = next;
    dirtyRef.current = true;
    setDirty(true);
    clearTimer();
    timerRef.current = window.setTimeout(() => {
      void flushSave();
    }, 800);
  }

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
      const next = { ...latestNote.current, body, bodyText: extractBodyText(body) };
      setNote(next);
      markDirty(next);
    },
  });

  useEffect(() => {
    if (!noteId) return;
    let cancelled = false;
    void getNote(noteId).then((found) => {
      if (cancelled) return;
      const next = found ?? createNote({ id: noteId });
      clearTimer();
      latestNote.current = next;
      dirtyRef.current = false;
      setNote(next);
      setDirty(false);
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

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    registerSaveHandler(async () => {
      await flushSaveRef.current();
    });
    return () => registerSaveHandler(null);
  }, [registerSaveHandler]);

  useEffect(() => {
    return () => {
      clearTimer();
    };
  }, []);

  const exportSave = async (fmt: ExportFormat) => {
    // T14 wires native save dialog.
    void fmt;
    void latestNote;
  };

  const handleClose = async () => {
    clearTimer();
    const next = latestNote.current;
    const empty = !next.title.trim() && !extractBodyText(next.body).trim();
    const existed = (await getNote(next.id)) !== undefined;
    if (empty) {
      if (existed) await deleteNote(next.id);
    } else if (dirtyRef.current) {
      await doPersist(next);
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
        <button type="button" aria-label={tr.save} className="px-3 py-1 rounded border border-line text-fg" onClick={() => void flushSave()}>
          {tr.save}
        </button>
        <SaveAsMenu onSelect={(fmt: ExportFormat) => void exportSave(fmt)} />
        <button type="button" aria-label={tr.back} className="px-3 py-1 rounded border border-line text-fg" onClick={() => void handleClose()}>
          {tr.back}
        </button>
        <button
          type="button"
          aria-label={tr.delete}
          className="px-3 py-1 rounded border border-line text-red-500"
          onClick={() => onDelete?.(latestNote.current.id)}
        >
          {tr.delete}
        </button>
        {dirty ? <span aria-label="Kaydedilmemiş değişiklik" className="ml-1">{tr.dirty}</span> : null}
        {savedFlash ? <span className="text-xs text-muted ml-2">{tr.saved}</span> : null}
      </div>

      <input
        ref={titleRef}
        autoFocus
        type="text"
        aria-label={tr.titlePlaceholder}
        placeholder={tr.titlePlaceholder}
        value={note.title}
        onChange={(e) => {
          const next = { ...note, title: e.target.value };
          setNote(next);
          markDirty(next);
        }}
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
            onChange={(e) => {
              const next = { ...note, titleFont: (e.target.value || null) as FontKey | null };
              setNote(next);
              markDirty(next);
            }}
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
            onChange={(e) => {
              const next = { ...note, titleColor: e.target.value };
              setNote(next);
              markDirty(next);
            }}
            className="h-6 w-10 ml-1"
          />
          <button
            type="button"
            className="underline ml-1"
            onClick={() => {
              const next = { ...note, titleColor: null };
              setNote(next);
              markDirty(next);
            }}
          >
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
              onChange={(e) => {
                const next = { ...note, date: e.target.value || null };
                setNote(next);
                markDirty(next);
              }}
              className="p-1 rounded border border-line bg-paper text-fg"
            />
            <button
              type="button"
              className="underline text-sm"
              onClick={() => {
                const next = { ...note, date: null };
                setNote(next);
                markDirty(next);
              }}
            >
              {tr.removeDate}
            </button>
          </>
        ) : (
          <button
            type="button"
            className="text-sm underline"
            onClick={() => {
              const next = { ...note, date: new Date().toISOString().slice(0, 10) };
              setNote(next);
              markDirty(next);
            }}
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