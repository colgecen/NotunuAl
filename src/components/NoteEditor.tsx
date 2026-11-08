import { useEffect, useRef, useState } from 'react';
import type { Note } from '../types';
import { createNote, getNote, saveNote, deleteNote } from '../services/noteRepo';
import { extractBodyText } from '../services/textUtils';
import { useNotesStore } from '../store/notesStore';
import { tr } from '../i18n/tr';

interface Props {
  noteId: string | null;
  onClose: () => void;
}

export default function NoteEditor({ noteId, onClose }: Props) {
  const [note, setNote] = useState<Note>(() => createNote({ id: noteId ?? undefined }));
  const titleRef = useRef<HTMLInputElement>(null);
  const [savedFlash, setSavedFlash] = useState(false);
  const refresh = useNotesStore((s) => s.load);

  useEffect(() => {
    if (!noteId) return;
    let cancelled = false;
    void getNote(noteId).then((found) => {
      if (!cancelled) {
        setNote(found ?? createNote({ id: noteId }));
      }
    });
    return () => {
      cancelled = true;
    };
  }, [noteId]);

  const isPersisted = async (id: string) => (await getNote(id)) !== undefined;

  const persist = async (next: Note) => {
    const saved = await saveNote(next);
    setNote(saved);
    await refresh();
    setSavedFlash(true);
    setTimeout(() => setSavedFlash(false), 1200);
    return saved;
  };

  const handleClose = async () => {
    const empty = !note.title.trim() && !extractBodyText(note.body).trim();
    const existed = await isPersisted(note.id);
    if (empty) {
      if (existed) await deleteNote(note.id);
    } else {
      await persist(note);
    }
    onClose();
  };

  return (
    <div className="h-full flex flex-col p-4 gap-3">
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
        style={{ color: note.titleColor ?? undefined }}
      />
      <label className="flex items-center gap-2 text-sm text-muted">
        Başlık rengi
        <input
          type="color"
          aria-label="Başlık rengi seç"
          value={note.titleColor ?? '#000000'}
          onChange={(e) => setNote({ ...note, titleColor: e.target.value })}
          className="h-6 w-10"
        />
        <button
          type="button"
          className="text-xs underline"
          onClick={() => setNote({ ...note, titleColor: null })}
        >
          Temizle
        </button>
      </label>
      <textarea
        aria-label={tr.bodyPlaceholder}
        placeholder={tr.bodyPlaceholder}
        value={extractBodyText(note.body)}
        onChange={(e) =>
          setNote({ ...note, body: { type: 'doc', content: [{ type: 'paragraph', content: e.target.value ? [{ type: 'text', text: e.target.value }] : undefined }] }, bodyText: e.target.value })
        }
        className="flex-1 p-3 rounded border border-line bg-paper text-fg resize-none outline-none"
      />
    </div>
  );
}