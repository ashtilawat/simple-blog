/**
 * QA smoke test: existing app shell still renders with chatbot integrated (AC-13).
 */
import '@testing-library/jest-dom';
import React from 'react';
import { render, screen } from '@testing-library/react';
import { ChakraProvider } from '@chakra-ui/react';
import App from './App';

jest.mock('@auth0/auth0-react', () => ({
  useAuth0: () => ({
    isAuthenticated: false,
    loginWithRedirect: jest.fn(),
    logout: jest.fn()
  }),
  Auth0Provider: ({ children }) => <div>{children}</div>
}));

const setupMatchMedia = () => {
  window.matchMedia = jest.fn().mockImplementation((query) => ({
    matches: query.includes('1300px') || query.includes('900px'),
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn()
  }));
};

beforeEach(() => {
  setupMatchMedia();
  Element.prototype.scrollIntoView = jest.fn();
});

describe('App regression smoke test', () => {
  test('AC-13: header, job listings, footer, and chatbot coexist on main page', () => {
    render(
      <ChakraProvider>
        <App />
      </ChakraProvider>
    );

    expect(screen.getByText('BOOTCAMP1ST')).toBeInTheDocument();
    expect(screen.getByText('Login')).toBeInTheDocument();
    expect(screen.getAllByText('Frontend Engineer').length).toBeGreaterThan(0);
    expect(screen.getByText(/All Rights Reserved/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /open chatbot/i })).toBeInTheDocument();
  });
});
