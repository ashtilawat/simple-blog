import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { ChakraProvider } from '@chakra-ui/react';
import { ContentList } from '../ContentList';
import { ContentDetail } from '../ContentDetail';

const MOCK_CONTENT_ITEMS = [
  {
    id: 'item-1',
    title: 'First Article',
    slug: 'first-article',
    blocks: [
      { type: 'text', order: 0, payload: { text: 'Intro text' } },
      {
        type: 'video',
        order: 1,
        payload: { url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' }
      },
      { type: 'html', order: 2, payload: { html: '<p>HTML body</p>' } }
    ]
  },
  {
    id: 'item-2',
    title: 'Second Article',
    slug: 'second-article',
    blocks: [{ type: 'text', order: 0, payload: { text: 'Another article' } }]
  }
];

jest.mock('../../../services/contentService', () => ({
  fetchPublishedContentItems: jest.fn()
}));

const { fetchPublishedContentItems } = require('../../../services/contentService');

function renderWithRouter(initialRoute = '/content') {
  return render(
    <ChakraProvider>
      <MemoryRouter initialEntries={[initialRoute]}>
        <Routes>
          <Route path="/content" element={<ContentList />} />
          <Route path="/content/:id" element={<ContentDetail />} />
        </Routes>
      </MemoryRouter>
    </ChakraProvider>
  );
}

describe('ContentList', () => {
  beforeEach(() => {
    fetchPublishedContentItems.mockResolvedValue(MOCK_CONTENT_ITEMS);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('displays fetched item titles', async () => {
    renderWithRouter('/content');

    expect(await screen.findByText('First Article')).toBeInTheDocument();
    expect(screen.getByText('Second Article')).toBeInTheDocument();
  });

  it('navigates to detail view when an item is selected', async () => {
    renderWithRouter('/content');

    await screen.findByText('First Article');
    fireEvent.click(screen.getByTestId('content-list-item-item-1'));

    expect(await screen.findByTestId('content-detail')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'First Article' })).toBeInTheDocument();
  });
});

describe('ContentDetail', () => {
  beforeEach(() => {
    fetchPublishedContentItems.mockResolvedValue(MOCK_CONTENT_ITEMS);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders blocks in CMS-defined order', async () => {
    renderWithRouter('/content/item-1');

    await screen.findByTestId('content-detail');

    const renderedBlocks = screen.getByTestId('content-blocks-renderer').children;
    expect(renderedBlocks).toHaveLength(3);
    expect(renderedBlocks[0]).toHaveTextContent('Intro text');
    expect(renderedBlocks[1].querySelector('iframe')).toBeTruthy();
    expect(renderedBlocks[2]).toHaveTextContent('HTML body');
  });

  it('matches the URL id after load completes', async () => {
    renderWithRouter('/content/item-2');

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'Second Article' })).toBeInTheDocument();
    });
    expect(screen.queryByRole('heading', { name: 'First Article' })).not.toBeInTheDocument();
  });
});
