import { render, screen } from '@testing-library/react';
import NoteList from './NoteList';
import type { Note } from '../types';

const notes: Note[] = [
  {
    id: '1',
    title: 'Toplantı',
    titleColor: '#ff0000',
    titleFont: null,
    body: { type: 'doc' },
    bodyText: 'önemli notlar uzun metin kırpılacak',
    date: null,
    createdAt: 2,
    updatedAt: 3,
  },
  {
    id: '2',
    title: 'Alışveriş',
    titleColor: null,
    titleFont: null,
    body: { type: 'doc' },
    bodyText: 'süt ekmek',
    date: null,
    createdAt: 1,
    updatedAt: 1,
  },
];

describe('NoteList', () => {
  it('renders bold title and snippet', () => {
    render(<NoteList notes={notes} />);
    const title = screen.getByText('Toplantı');
    expect(title).toBeInTheDocument();
    expect(title.className).toContain('font-bold');
    expect(screen.getByText('önemli notlar uzun metin kırpılacak')).toBeInTheDocument();
  });

  it('applies title color', () => {
    render(<NoteList notes={notes} />);
    const title = screen.getByText('Toplantı');
    expect(title).toHaveStyle({ color: 'rgb(255, 0, 0)' });
  });

  it('shows the date in a readable Turkish format', () => {
    render(<NoteList notes={[{ ...notes[1], date: '2026-11-16' }]} />);
    expect(screen.getByText('16 Kas 2026')).toBeInTheDocument();
  });

  it('renders the home variant with the snippet on the right', () => {
    render(<NoteList notes={notes} variant="home" />);
    expect(screen.getByText('süt ekmek')).toBeInTheDocument();
  });

  it('shows empty state when no notes', () => {
    render(<NoteList notes={[]} onNewNote={() => {}} />);
    expect(screen.getByText(/Henüz not yok/i)).toBeInTheDocument();
  });
});