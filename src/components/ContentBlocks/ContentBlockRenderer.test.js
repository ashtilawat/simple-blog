/* eslint-env jest */
import React from 'react';
import { render, screen } from '@testing-library/react';
import { ChakraProvider } from '@chakra-ui/react';
import { sortBlocksByOrder } from '../../types/content';
import {
  ContentBlockRenderer,
  ContentBlocksRenderer
} from './ContentBlockRenderer';

function renderWithChakra(ui) {
  return render(<ChakraProvider>{ui}</ChakraProvider>);
}

describe('ContentBlockRenderer', () => {
  it('renders a text block', () => {
    renderWithChakra(
      <ContentBlockRenderer
        block={{ type: 'text', payload: { text: 'Hello world' } }}
      />
    );

    expect(screen.getByText('Hello world')).toBeInTheDocument();
  });

  it('renders a fallback for unknown block types without crashing', () => {
    renderWithChakra(
      <ContentBlockRenderer block={{ type: 'unknown', payload: {} }} />
    );

    expect(screen.getByTestId('unknown-block-fallback')).toBeInTheDocument();
    expect(
      screen.getByText(/This content block type is not supported \(unknown\)/)
    ).toBeInTheDocument();
  });

  it('renders a fallback when block is missing or invalid', () => {
    renderWithChakra(<ContentBlockRenderer block={null} />);

    expect(screen.getByTestId('unknown-block-fallback')).toBeInTheDocument();
  });
});

describe('ContentBlocksRenderer', () => {
  it('renders blocks in CMS-defined order (AC-008)', () => {
    const blocks = [
      { id: '1', type: 'text', order: 0, payload: { text: 'First text block' } },
      { id: '2', type: 'video', order: 1, payload: { url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' } },
      {
        id: '3',
        type: 'html',
        order: 2,
        payload: { html: '<p>Third html block</p>' }
      }
    ];

    renderWithChakra(<ContentBlocksRenderer blocks={blocks} />);

    const renderedBlocks = screen.getByTestId('content-blocks-renderer').children;
    expect(renderedBlocks).toHaveLength(3);
    expect(renderedBlocks[0]).toHaveTextContent('First text block');
    expect(renderedBlocks[1].querySelector('iframe')).toBeTruthy();
    expect(renderedBlocks[2]).toHaveTextContent('Third html block');
  });

  it('sorts blocks by order field when provided out of sequence', () => {
    const blocks = [
      { id: 'html', type: 'html', order: 2, payload: { html: '<p>HTML section</p>' } },
      { id: 'text', type: 'text', order: 0, payload: { text: 'Text section' } },
      { id: 'video', type: 'video', order: 1, payload: { url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' } }
    ];

    renderWithChakra(<ContentBlocksRenderer blocks={blocks} />);

    const renderedBlocks = screen.getByTestId('content-blocks-renderer').children;
    expect(renderedBlocks[0]).toHaveTextContent('Text section');
    expect(renderedBlocks[1].querySelector('iframe')).toBeTruthy();
    expect(renderedBlocks[2]).toHaveTextContent('HTML section');
  });

  it('renders valid blocks alongside unknown types without crashing (AC-009)', () => {
    const blocks = [
      { id: 'text', type: 'text', order: 0, payload: { text: 'Visible text' } },
      { id: 'bad', type: 'unknown', order: 1, payload: {} },
      {
        id: 'html',
        type: 'html',
        order: 2,
        payload: { html: '<p>Still visible HTML</p>' }
      }
    ];

    renderWithChakra(<ContentBlocksRenderer blocks={blocks} />);

    expect(screen.getByText('Visible text')).toBeInTheDocument();
    expect(screen.getByTestId('unknown-block-fallback')).toBeInTheDocument();
    expect(screen.getByText('Still visible HTML')).toBeInTheDocument();
  });
});

describe('sortBlocksByOrder', () => {
  it('returns an empty array for non-array input', () => {
    expect(sortBlocksByOrder(null)).toEqual([]);
  });
});
