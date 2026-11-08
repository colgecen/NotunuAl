import { useRef, useState } from 'react';
import TopBar from './components/TopBar';
import { tr } from './i18n/tr';

export default function App() {
  const [search, setSearch] = useState('');
  const searchRef = useRef<HTMLInputElement>(null);

  return (
    <div className="h-full flex flex-col">
      <TopBar
        searchValue={search}
        onSearchChange={setSearch}
        onNewNote={() => {}}
        searchRef={searchRef}
      />
      <main className="flex-1 p-4">
        <span className="text-xl font-bold">{tr.appTitle}</span>
      </main>
    </div>
  );
}