import { render, screen } from '@testing-library/react';
import ConfirmDialog from './ConfirmDialog';

describe('ConfirmDialog', () => {
  it('kapanınca odağı önceki öğeye geri verir', () => {
    const trigger = document.createElement('button');
    trigger.textContent = 'Tetik';
    document.body.appendChild(trigger);
    trigger.focus();

    const onCancel = () => {};
    const { rerender } = render(
      <ConfirmDialog open text="Silinsin mi?" onConfirm={() => {}} onCancel={onCancel} />,
    );
    expect(screen.getByRole('alertdialog')).toBeInTheDocument();

    rerender(
      <ConfirmDialog
        open={false}
        text="Silinsin mi?"
        onConfirm={() => {}}
        onCancel={onCancel}
      />,
    );
    expect(trigger).toHaveFocus();
    trigger.remove();
  });
});
