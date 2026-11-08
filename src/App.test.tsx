import { render, screen } from '@testing-library/react';
import App from './App';

test('renders NotunuAl!', () => {
  render(<App />);
  expect(screen.getAllByText('NotunuAl!').length).toBeGreaterThan(0);
});