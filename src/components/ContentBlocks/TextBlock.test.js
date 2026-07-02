/* eslint-env jest */
import React from 'react';
import { render, screen } from '@testing-library/react';
import { ChakraProvider } from '@chakra-ui/react';
import { TextBlock } from './TextBlock';

const renderTextBlock = (props) =>
  render(
    <ChakraProvider>
      <TextBlock {...props} />
    </ChakraProvider>
  );

describe('TextBlock', () => {
  it('renders plain text from the content prop', () => {
    renderTextBlock({ content: 'Hello from the CMS' });
    expect(screen.getByText('Hello from the CMS')).toBeInTheDocument();
  });

  it('renders plain text from the text prop', () => {
    renderTextBlock({ text: 'Alternate text field' });
    expect(screen.getByText('Alternate text field')).toBeInTheDocument();
  });

  it('renders text from a block payload object', () => {
    renderTextBlock({
      block: {
        type: 'text',
        payload: { content: 'Payload content' }
      }
    });
    expect(screen.getByText('Payload content')).toBeInTheDocument();
  });

  it('preserves line breaks in plain text', () => {
    renderTextBlock({ content: 'Line one\nLine two' });
    expect(screen.getByText(/Line one/)).toBeInTheDocument();
    expect(screen.getByText(/Line two/)).toBeInTheDocument();
  });

  it('returns null when no content is provided', () => {
    const { container } = renderTextBlock({});
    expect(container.querySelector('.text-block')).not.toBeInTheDocument();
  });

  it('applies Space Mono font styling', () => {
    renderTextBlock({ content: 'Styled text' });
    expect(screen.getByText('Styled text')).toBeInTheDocument();
    expect(screen.getByText('Styled text').closest('.text-block')).toBeInTheDocument();
  });

  it('wraps long text within the block container', () => {
    const longText = 'A'.repeat(200);
    renderTextBlock({ content: longText });
    expect(screen.getByText(longText)).toBeInTheDocument();
  });
});
