import { parseVideoUrl } from './parseVideoUrl';

describe('parseVideoUrl', () => {
  it('parses youtube.com watch URLs', () => {
    expect(parseVideoUrl('https://www.youtube.com/watch?v=dQw4w9WgXcQ')).toEqual({
      type: 'youtube',
      embedUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
    });
  });

  it('parses youtu.be URLs', () => {
    expect(parseVideoUrl('https://youtu.be/dQw4w9WgXcQ')).toEqual({
      type: 'youtube',
      embedUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
    });
  });

  it('parses youtube embed URLs', () => {
    expect(parseVideoUrl('https://www.youtube.com/embed/dQw4w9WgXcQ')).toEqual({
      type: 'youtube',
      embedUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
    });
  });

  it('parses youtube shorts URLs', () => {
    expect(parseVideoUrl('https://www.youtube.com/shorts/dQw4w9WgXcQ')).toEqual({
      type: 'youtube',
      embedUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
    });
  });

  it('parses vimeo.com URLs', () => {
    expect(parseVideoUrl('https://vimeo.com/123456789')).toEqual({
      type: 'vimeo',
      embedUrl: 'https://player.vimeo.com/video/123456789'
    });
  });

  it('parses player.vimeo.com URLs', () => {
    expect(parseVideoUrl('https://player.vimeo.com/video/123456789')).toEqual({
      type: 'vimeo',
      embedUrl: 'https://player.vimeo.com/video/123456789'
    });
  });

  it('parses direct mp4 URLs', () => {
    expect(parseVideoUrl('https://example.com/media/sample.mp4')).toEqual({
      type: 'mp4',
      src: 'https://example.com/media/sample.mp4'
    });
  });

  it('parses direct mp4 URLs with query params', () => {
    expect(parseVideoUrl('https://example.com/media/sample.mp4?token=abc')).toEqual({
      type: 'mp4',
      src: 'https://example.com/media/sample.mp4?token=abc'
    });
  });

  it('returns null for invalid URLs', () => {
    expect(parseVideoUrl('not-a-url')).toBeNull();
    expect(parseVideoUrl('')).toBeNull();
    expect(parseVideoUrl(null)).toBeNull();
    expect(parseVideoUrl('https://example.com/video.html')).toBeNull();
    expect(parseVideoUrl('https://www.youtube.com/watch?v=short')).toBeNull();
    expect(parseVideoUrl('javascript:alert(1)')).toBeNull();
  });
});
