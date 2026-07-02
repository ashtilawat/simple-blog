import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { ChakraProvider } from '@chakra-ui/react';
import { DynamicContentList } from './DynamicContentList';
import { useContentItems } from '../../hooks/useContentItems';

jest.mock('../../hooks/useContentItems');

const renderWithChakra = (ui) => render(<ChakraProvider>{ui}</ChakraProvider>);

describe('DynamicContentList', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('shows a loading indicator while content is fetching', () => {
    useContentItems.mockReturnValue({
      items: [],
      loading: true,
      error: null,
      retry: jest.fn()
    });

    renderWithChakra(<DynamicContentList />);

    expect(screen.getByText('Loading content...')).toBeInTheDocument();
  });

  it('shows an error message and retry action when fetch fails', () => {
    const retry = jest.fn();
    useContentItems.mockReturnValue({
      items: [],
      loading: false,
      error: 'Failed to fetch content from Airtable.',
      retry
    });

    renderWithChakra(<DynamicContentList />);

    expect(screen.getByText('Unable to load content')).toBeInTheDocument();
    expect(screen.getByText('Failed to fetch content from Airtable.')).toBeInTheDocument();
    screen.getByRole('button', { name: 'Retry' }).click();
    expect(retry).toHaveBeenCalledTimes(1);
  });

  it('renders fetched content item titles', async () => {
    useContentItems.mockReturnValue({
      items: [
        {
          id: 'rec1',
          title: 'Launch Update',
          slug: 'launch-update',
          blocks: [{ id: 'blk1', type: 'text', order: 1, payload: { text: 'Hello' } }]
        }
      ],
      loading: false,
      error: null,
      retry: jest.fn()
    });

    renderWithChakra(<DynamicContentList />);

    await waitFor(() => {
      expect(screen.getByText('Launch Update')).toBeInTheDocument();
    });
    expect(screen.getByText('1 block')).toBeInTheDocument();
  });
});
