import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import React from 'react';
import App from './App';
import { store } from './redux/Store';

jest.mock('react-router-dom', () => ({
  BrowserRouter: ({ children }) => <>{children}</>,
  Routes: ({ children }) => <>{children}</>,
  Route: ({ element }) => element,
  Link: ({ children, ...props }) => <a {...props}>{children}</a>,
  Outlet: () => null,
  useNavigate: () => jest.fn(),
  useParams: () => ({ postId: '000000000000000000000000' }),
}), { virtual: true });

jest.mock('axios', () => ({
  defaults: {},
  get: jest.fn(() => Promise.resolve({ data: [] })),
  post: jest.fn(() => Promise.resolve({ data: {} })),
  patch: jest.fn(() => Promise.resolve({ data: {} })),
}), { virtual: true });

jest.mock('./pages/Home.jsx', () => () => <h1>Authentic Art</h1>);

test('renders the TrueCanvas home page', () => {
  render(<Provider store={store}><App /></Provider>);
  const linkElement = screen.getByText(/Authentic Art/i);
  expect(linkElement).toBeInTheDocument();
});
