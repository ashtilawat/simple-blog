import React from 'react';
import { render, screen } from '@testing-library/react';
import { ChakraProvider } from '@chakra-ui/react';
import { VideoBlock } from './VideoBlock';

const renderWithChakra = (ui) =>
  render(<ChakraProvider>{ui}</ChakraProvider>);

describe('VideoBlock', () => {
  it('renders a YouTube iframe embed for valid YouTube URLs', () => {
    renderWithChakra(
      <VideoBlock url="https://www.youtube.com/watch?v=dQw4w9WgXcQ" />
    );

    const iframe = screen.getByTitle('youtube video player');
    expect(iframe).toBeInTheDocument();
    expect(iframe).toHaveAttribute(
      'src',
      'https://www.youtube.com/embed/dQw4w9WgXcQ'
    );
  });

  it('renders a Vimeo iframe embed for valid Vimeo URLs', () => {
    renderWithChakra(<VideoBlock url="https://vimeo.com/123456789" />);

    const iframe = screen.getByTitle('vimeo video player');
    expect(iframe).toBeInTheDocument();
    expect(iframe).toHaveAttribute(
      'src',
      'https://player.vimeo.com/video/123456789'
    );
  });

  it('renders a native video element for direct mp4 URLs', () => {
    renderWithChakra(
      <VideoBlock url="https://example.com/media/sample.mp4" />
    );

    const video = screen.getByTestId('native-video');
    expect(video).toBeInTheDocument();
    expect(video).toHaveAttribute('controls');
  });

  it('shows fallback for invalid URLs', () => {
    renderWithChakra(<VideoBlock url="https://example.com/not-a-video" />);

    expect(screen.getByTestId('video-fallback')).toBeInTheDocument();
    expect(screen.getByText('Video unavailable')).toBeInTheDocument();
  });

  it('accepts block payload URLs', () => {
    renderWithChakra(
      <VideoBlock block={{ type: 'video', url: 'https://youtu.be/dQw4w9WgXcQ' }} />
    );

    expect(screen.getByTitle('youtube video player')).toBeInTheDocument();
  });

  it('keeps responsive container styles on embeds', () => {
    renderWithChakra(
      <VideoBlock url="https://www.youtube.com/watch?v=dQw4w9WgXcQ" />
    );

    const iframe = screen.getByTitle('youtube video player');
    expect(iframe).toHaveStyle({ width: '100%' });
  });
});
