import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import SaveAsMenu from './SaveAsMenu';

describe('SaveAsMenu', () => {
  it('opens and selects formats', () => {
    const selected: string[] = [];
    render(<SaveAsMenu onSelect={(f) => selected.push(f)} />);
    fireEvent.click(screen.getByRole('button', { name: 'Farklı Kaydet' }));
    expect(screen.getByRole('menuitem', { name: 'Word (.docx)' })).toBeInTheDocument();
    fireEvent.click(screen.getByRole('menuitem', { name: 'Metin belgesi (.txt)' }));
    expect(selected).toEqual(['txt']);
  });

  it('closes when clicking outside', () => {
    render(<SaveAsMenu onSelect={() => {}} />);
    fireEvent.click(screen.getByRole('button', { name: 'Farklı Kaydet' }));
    expect(screen.getByRole('menu')).toBeInTheDocument();
    fireEvent.pointerDown(document.body);
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });

  it('closes with Escape without bubbling to the editor shortcut', () => {
    const onWindowKey = vi.fn();
    window.addEventListener('keydown', onWindowKey);
    render(<SaveAsMenu onSelect={() => {}} />);
    fireEvent.click(screen.getByRole('button', { name: 'Farklı Kaydet' }));
    fireEvent.keyDown(screen.getByRole('menuitem', { name: 'PDF (.pdf)' }), { key: 'Escape' });
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
    expect(onWindowKey).not.toHaveBeenCalled();
    window.removeEventListener('keydown', onWindowKey);
  });
});