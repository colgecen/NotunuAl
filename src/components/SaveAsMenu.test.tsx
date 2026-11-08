import { render, screen, fireEvent } from '@testing-library/react';
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
});