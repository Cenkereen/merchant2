import { render, screen } from '@testing-library/react';
import App from './App';

test('renders Merchant Login heading', () => {
  render(<App />);
  // Check that the heading "Merchant Login" exists
  const headingElement = screen.getByText(/Merchant Login/i);
  expect(headingElement).toBeInTheDocument();
});
