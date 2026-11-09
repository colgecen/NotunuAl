import { useEffect, useRef, useState } from 'react';
import ConfirmDialog from './components/ConfirmDialog';
import { tr } from './i18n/tr';
import TopBar from './components/TopBar';
import NoteList from './components/NoteList';
import NoteGrid from './components/NoteGrid';
import ViewModeSwitch from './components/ViewModeSwitch';
import NoteEditor from './components/NoteEditor';
import { useSettingsStore } from './store/settingsStore';
import { useNotesStore } from './store/notesStore';
import { useUIStore } from './store/uiStore';
import { useShortcuts } from './shortcuts/useShortcuts';

export default function App() {
  const searchRef = useRef<HTMLInputElement>(null);
  const notes = useNotesStore((s) => s.notes);
  const load = useNotesStore((s) => s.load);
  const remove = useNotesStore((s) => s.remove);
  const closeEditor = useUIStore((s) => s.closeEditor);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);
  const search = useUIStore((s) => s.search);
  const setSearch = useUIStore((s) => s.setSearch);
  const setResults = useUIStore((s) => s.setResults);
  const registerSearchRef = useUIStore((s) => s.registerSearchRef);
  const screen = useUIStore((s) => s.screen);
  const results = useUIStore((s) => s.results);
  const selectedIndex = useUIStore((s) => s.selectedIndex);
  const openNote = useUIStore((s) => s.openNote);
  const openNewNote = useUIStore((s) => s.openNewNote);
  const activeNoteId = useUIStore((s) => s.activeNoteId);
  const session = useUIStore((s) => s.session);
  const viewMode = useSettingsStore((s) => s.viewMode);

  useShortcuts();

  useEffect(() => {
    registerSearchRef(searchRef);
    return () => registerSearchRef(null);
  }, [registerSearchRef]);

  useEffect(() => {
    void load();
  }, [load]);

  useEffect(() => {
    setResults(notes);
  }, [notes, setResults]);

  useEffect(() => {
    if (screen === 'list') void load();
  }, [screen, load]);

  const requestDelete = (id: string) => setPendingDeleteId(id);
  const confirmDelete = async () => {
    const id = pendingDeleteId;
    setPendingDeleteId(null);
    if (!id) return;
    await remove(id);
    if (screen === 'editor') closeEditor();
    await load();
  };
  const cancelDelete = () => setPendingDeleteId(null);

  if (screen === 'editor') {
    return (
      <>
        <NoteEditor
          key={session}
          noteId={activeNoteId}
          onClose={() => {
            void load().finally(() => closeEditor());
          }}
          onDelete={requestDelete}
        />
        <ConfirmDialog
          open={pendingDeleteId !== null}
          text={tr.deleteConfirm}
          onConfirm={() => void confirmDelete()}
          onCancel={cancelDelete}
        />
      </>
    );
  }

  return (
    <>
      <div className="flex h-full flex-col">
        <TopBar
          searchValue={search}
          onSearchChange={setSearch}
          onNewNote={openNewNote}
          searchRef={searchRef}
          resultCount={results.length}
        >
          <ViewModeSwitch />
        </TopBar>
        <main className="min-h-0 flex-1">
          <div className="col flex h-full flex-col py-4">
            <div className="card flex min-h-0 flex-1 flex-col overflow-hidden shadow-panel">
              {viewMode === 'icons' ? (
                <NoteGrid
                  notes={results}
                  selectedIndex={selectedIndex}
                  searching={search.trim() !== ''}
                  onOpen={openNote}
                  onDelete={requestDelete}
                  onNewNote={openNewNote}
                />
              ) : (
                <NoteList
                  notes={results}
                  selectedIndex={selectedIndex}
                  spacious={viewMode === 'home'}
                  searching={search.trim() !== ''}
                  onOpen={openNote}
                  onDelete={requestDelete}
                  onNewNote={openNewNote}
                />
              )}
            </div>
          </div>
        </main>
      </div>
      <ConfirmDialog
        open={pendingDeleteId !== null}
        text={tr.deleteConfirm}
        onConfirm={() => void confirmDelete()}
        onCancel={cancelDelete}
      />
    </>
  );
}
