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
import { FONT_STACKS } from '../theme/fonts';
import { tr } from '../i18n/tr';
import EditorHeader from './EditorHeader';
import EditorToolbar from './EditorToolbar';
import TitleField from './TitleField';
import { CalendarIcon } from './icons';
import type { ExportFormat } from '../services/export';
import { cleanFileName } from '../services/export/txt';
import type { FontKey } from '../types';

interface Props {
  noteId: string | null;
  onClose: () => void;
  onDelete?: (id: string) => void;
}

const NOTICE_MS = 4000;

export default function NoteEditor({ noteId, onClose, onDelete }: Props) {
  const [note, setNote] = useState<Note>(() => createNote({ id: noteId ?? undefined }));
  const [loaded, setLoaded] = useState(!noteId);
  const [dirty, setDirty] = useState(false);
  const [savedFlash, setSavedFlash] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
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

  const updateNote = useCallback(
    (patch: Partial<Note>) => {
      const next = { ...latestNote.current, ...patch };
      setNote(next);
      markDirty(next);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  const editor = useEditor({
    extensions: [StarterKit, TextStyleKit, Highlight.configure({ multicolor: true })],
    content: note.body,
    editorProps: {
      attributes: {
        class: 'tiptap',
        'aria-label': tr.editorLabel,
        'aria-multiline': 'true',
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
          'aria-label': tr.editorLabel,
          'aria-multiline': 'true',
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

  useEffect(() => {
    if (!notice) return;
    const id = window.setTimeout(() => {
      if (mountedRef.current) setNotice(null);
    }, NOTICE_MS);
    return () => window.clearTimeout(id);
  }, [notice]);

  const exportSave = async (fmt: ExportFormat) => {
    await flushSave();
    const current = latestNote.current;
    try {
      const { EXPORT_EXTENSIONS, exportNote } = await import('../services/export');
      const { saveBytes } = await import('../services/fileService');
      const bytes = await exportNote(current, fmt);
      const name = `${cleanFileName(current.title)}.${EXPORT_EXTENSIONS[fmt]}`;
      const outcome = await saveBytes(name, bytes, fmt);
      if (outcome.status === 'saved') setNotice(tr.exportSaved);
      else if (outcome.status === 'error') setNotice(`${tr.exportError}: ${outcome.message ?? ''}`);
    } catch (err) {
      const detail = err instanceof Error ? err.message : String(err);
      setNotice(`${tr.exportError}: ${detail}`);
    }
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

  const handleFontChange = (font: FontKey) => {
    useSettingsStore.getState().setBodyFont(font);
    editor?.chain().focus().setFontFamily(FONT_STACKS[font]).run();
  };

  const handleFontSizeChange = (size: number) => {
    setBodyFontSize(size);
    editor?.chain().focus().setFontSize(`${size}px`).run();
  };

  if (!loaded) return <div className="p-4 text-sm text-muted">{tr.appTitle}</div>;

  const words = note.bodyText.trim() ? note.bodyText.trim().split(/\s+/).length : 0;

  return (
    <div className="flex h-full flex-col">
      <EditorHeader
        dirty={dirty}
        savedFlash={savedFlash}
        notice={notice}
        onSave={() => void flushSave()}
        onSelectFormat={(fmt) => void exportSave(fmt)}
        onBack={() => void handleClose()}
        onDelete={() => onDelete?.(latestNote.current.id)}
      />
      <div className="shrink-0 border-b border-line bg-paper">
        <TitleField
          title={note.title}
          titleColor={note.titleColor}
          titleFont={note.titleFont}
          onTitleChange={(title) => updateNote({ title })}
          onTitleColorChange={(titleColor) => updateNote({ titleColor })}
          onTitleFontChange={(titleFont) => updateNote({ titleFont })}
        />
        <EditorToolbar
          editor={editor}
          bodyFont={bodyFont}
          bodyFontSize={bodyFontSize}
          onFontChange={handleFontChange}
          onFontSizeChange={handleFontSizeChange}
        />
        <div className="border-t border-line bg-surface" role="group" aria-label={tr.noteMetaLabel}>
          <div className="col flex flex-wrap items-center gap-2 py-1.5">
            {note.date ? (
              <>
                <CalendarIcon className="h-4 w-4 text-muted" />
                <input
                  type="date"
                  aria-label={tr.dateLabel}
                  value={note.date}
                  onChange={(e) => updateNote({ date: e.target.value || null })}
                  className="field"
                />
                <button
                  type="button"
                  className="btn-ghost"
                  onClick={() => updateNote({ date: null })}
                >
                  {tr.removeDate}
                </button>
              </>
            ) : (
              <button
                type="button"
                className="btn-ghost"
                onClick={() => updateNote({ date: new Date().toISOString().slice(0, 10) })}
              >
                <CalendarIcon className="h-4 w-4" />
                {tr.addDate}
              </button>
            )}
            <p className="ml-auto text-xs tabular-nums text-muted">{tr.wordCount(words)}</p>
          </div>
        </div>
      </div>

      <div className="scroll-slim min-h-0 flex-1 overflow-y-auto py-4">
        <div className="col">
          <div className="min-h-full rounded-card border border-line bg-paper shadow-panel">
            <EditorContent editor={editor} />
          </div>
        </div>
      </div>
    </div>
  );
}
