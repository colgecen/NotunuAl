import 'fake-indexeddb/auto';
import { render, screen } from '@testing-library/react';
import TopBar from './TopBar';

describe('TopBar', () => {
  it('renders new note button, search and theme toggle', () => {
    render(<TopBar searchValue="" onSearchChange={() => {}} onNewNote={() => {}} />);
    expect(screen.getByRole('button', { name: '+ Yeni Ekle' })).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: 'Ara...' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Tema değiştir' })).toBeInTheDocument();
  });
});