import { useEffect, useRef, useState } from 'react';
import TopBar from './components/TopBar';
import NoteList from './components/NoteList';
import { useNotesStore } from './store/notesStore';

export default function App() {
  const [search, setSearch] = useState('');
  const searchRef = useRef<HTMLInputElement>(null);
  const { notes, load, create } = useNotesStore();
  useEffect(() => {
    void load();
  }, [load]);

  const handleNew = async () => {
    await create();
  };

  return (
    <div className="h-full flex flex-col">
      <TopBar
        searchValue={search}
        onSearchChange={setSearch}
        onNewNote={() => void handleNew()}
        searchRef={searchRef}
      />
      <main className="flex-1 overflow-hidden">
        <NoteList notes={notes} onOpen={() => {}} onNewNote={() => void handleNew()} />
      </main>
    </div>
  );
}