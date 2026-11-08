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

  it('shows empty state when no notes', () => {
    render(<NoteList notes={[]} onNewNote={() => {}} />);
    expect(screen.getByText(/Henüz not yok/i)).toBeInTheDocument();
  });
});