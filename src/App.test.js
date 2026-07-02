import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { ChakraProvider } from '@chakra-ui/react';
import { useAuth0 } from '@auth0/auth0-react';
import App from './App';

jest.mock('@auth0/auth0-react');

jest.mock('./hooks/useContentItems', () => ({
  useContentItems: () => ({
    items: [
      { id: 'article-1', title: 'First Article', blocks: [] },
      { id: 'article-2', title: 'Second Article', blocks: [] }
    ],
    loading: false,
    error: null,
    reload: jest.fn()
  })
}));

jest.mock('./hooks/useContentItem', () => ({
  useContentItem: (id) => ({
    item:
      id === 'article-1'
        ? { id: 'article-1', title: 'First Article', blocks: [] }
        : null,
    loading: false,
    error: id === 'article-1' ? null : 'Not found',
    reload: jest.fn()
  })
}));

function renderApp(initialRoute = '/content') {
  return render(
    <ChakraProvider>
      <MemoryRouter initialEntries={[initialRoute]}>
        <App />
      </MemoryRouter>
    </ChakraProvider>
  );
}

describe('App shell auth integration', () => {
  beforeEach(() => {
    useAuth0.mockReturnValue({
      isAuthenticated: false,
      loginWithRedirect: jest.fn(),
      logout: jest.fn()
    });
  });

  it('shows Login in the header on the content list route', () => {
    renderApp('/content');

    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
    expect(screen.getByText('First Article')).toBeInTheDocument();
  });

  it('shows Log Out in the header when authenticated on the detail route', () => {
    useAuth0.mockReturnValue({
      isAuthenticated: true,
      loginWithRedirect: jest.fn(),
      logout: jest.fn()
    });

    renderApp('/content/article-1');

    expect(screen.getByRole('button', { name: /log out/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'First Article' })).toBeInTheDocument();
  });

  it('keeps authenticated state while navigating from list to detail', async () => {
    useAuth0.mockReturnValue({
      isAuthenticated: true,
      loginWithRedirect: jest.fn(),
      logout: jest.fn()
    });

    renderApp('/content');

    expect(screen.getByRole('button', { name: /log out/i })).toBeInTheDocument();

    await userEvent.click(screen.getByRole('link', { name: 'First Article' }));

    expect(screen.getByRole('heading', { name: 'First Article' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /log out/i })).toBeInTheDocument();
  });

  it('calls loginWithRedirect when Login is clicked', async () => {
    const loginWithRedirect = jest.fn();

    useAuth0.mockReturnValue({
      isAuthenticated: false,
      loginWithRedirect,
      logout: jest.fn()
    });

    renderApp('/content');

    await userEvent.click(screen.getByRole('button', { name: /login/i }));

    expect(loginWithRedirect).toHaveBeenCalledTimes(1);
  });

  it('calls logout when Log Out is clicked on the jobs route', async () => {
    const logout = jest.fn();

    useAuth0.mockReturnValue({
      isAuthenticated: true,
      loginWithRedirect: jest.fn(),
      logout
    });

    renderApp('/jobs');

    await userEvent.click(screen.getByRole('button', { name: /log out/i }));

    expect(logout).toHaveBeenCalledWith({ returnTo: window.location.origin });
  });

  it('keeps header and footer visible during content loading', () => {
    renderApp('/content');

    expect(screen.getAllByText(/BOOTCAMP1ST/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/All Rights Reserved/i)).toBeInTheDocument();
    expect(screen.getByText('First Article')).toBeInTheDocument();
  });
});
