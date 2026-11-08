import { useEffect, useRef } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import type { Note } from '../types';
import NoteRow from './NoteRow';
import { tr } from '../i18n/tr';

interface Props {
  notes: Note[];
  selectedIndex?: number;
  onOpen?: (id: string) => void;
  onDelete?: (id: string) => void;
  onNewNote?: () => void;
}

const ROW_HEIGHT = 41;

export default function NoteList({ notes, selectedIndex = -1, onOpen, onDelete, onNewNote }: Props) {
  const parentRef = useRef<HTMLDivElement>(null);
  // TanStack Virtual'ın API'si tasarım gereği memoize edilemez; React Compiler kuralı burada geçersiz.
  // eslint-disable-next-line react-hooks/incompatible-library
  const virtualizer = useVirtualizer({
    count: notes.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => ROW_HEIGHT,
    overscan: 8,
    // jsdom'da ölçüm yok; gerçek tarayıcıda ResizeObserver devralır.
    initialRect: { width: 800, height: 600 },
  });

  useEffect(() => {
    if (selectedIndex >= 0 && selectedIndex < notes.length) {
      virtualizer.scrollToIndex(selectedIndex, { align: 'auto' });
    }
  }, [selectedIndex, notes.length, virtualizer]);

  if (notes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center text-muted p-6">
        <p className="mb-4">{tr.emptyState}</p>
        <button type="button" onClick={onNewNote} className="px-3 py-2 rounded border border-line text-fg">
          {tr.newNote}
        </button>
      </div>
    );
  }

  const items = virtualizer.getVirtualItems();

  return (
    <div
      ref={parentRef}
      role="listbox"
      aria-label={tr.appTitle}
      aria-activedescendant={selectedIndex >= 0 ? `note-${notes[selectedIndex]?.id}` : undefined}
      className="overflow-y-auto h-full"
    >
      <div style={{ height: virtualizer.getTotalSize(), position: 'relative', width: '100%' }}>
        {items.map((item) => {
          const note = notes[item.index];
          if (!note) return null;
          return (
            <div
              key={note.id}
              id={`note-${note.id}`}
              role="option"
              aria-selected={item.index === selectedIndex}
              aria-setsize={notes.length}
              aria-posinset={item.index + 1}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: item.size,
                transform: `translateY(${item.start}px)`,
              }}
            >
              <NoteRow
                note={note}
                selected={item.index === selectedIndex}
                onClick={onOpen}
                onDelete={onDelete}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
