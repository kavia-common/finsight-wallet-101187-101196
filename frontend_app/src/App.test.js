import { render, screen } from '@testing-library/react';
import AppWithProviders from './App';

test('renders brand title', () => {
  render(<AppWithProviders />);
  const title = screen.getByText(/Finsight Wallet/i);
  expect(title).toBeInTheDocument();
});
