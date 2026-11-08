import { useEffect, useRef } from 'react';
import TopBar from './components/TopBar';
import NoteList from './components/NoteList';
import NoteGrid from './components/NoteGrid';
import ViewModeSwitch from './components/ViewModeSwitch';
import { useSettingsStore } from './store/settingsStore';
import { useNotesStore } from './store/notesStore';
import { useUIStore } from './store/uiStore';
import { useShortcuts } from './shortcuts/useShortcuts';

export default function App() {
  const searchRef = useRef<HTMLInputElement>(null);
  const notes = useNotesStore((s) => s.notes);
  const load = useNotesStore((s) => s.load);
  const search = useUIStore((s) => s.search);
  const setSearch = useUIStore((s) => s.setSearch);
  const setResults = useUIStore((s) => s.setResults);
  const registerSearchRef = useUIStore((s) => s.registerSearchRef);
  const screen = useUIStore((s) => s.screen);
  const results = useUIStore((s) => s.results);
  const selectedIndex = useUIStore((s) => s.selectedIndex);
  const openNote = useUIStore((s) => s.openNote);
  const openNewNote = useUIStore((s) => s.openNewNote);
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

  if (screen === 'editor') {
    return <div className="p-4">Editör yakında</div>;
  }

  return (
    <div className="h-full flex flex-col">
      <TopBar
        searchValue={search}
        onSearchChange={setSearch}
        onNewNote={openNewNote}
        searchRef={searchRef}
      />
      <main className="flex-1 overflow-hidden flex flex-col">
        <ViewModeSwitch />
        {viewMode === 'icons' ? (
          <NoteGrid
            notes={results}
            selectedIndex={selectedIndex}
            onOpen={openNote}
            onNewNote={openNewNote}
          />
        ) : (
          <NoteList
            notes={results}
            selectedIndex={selectedIndex}
            onOpen={openNote}
            onNewNote={openNewNote}
          />
        )}
      </main>
    </div>
  );
}