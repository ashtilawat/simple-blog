import { prepareHtmlBlockContent, sanitizeHtml } from './sanitizeHtml';

describe('sanitizeHtml', () => {
  it('preserves safe markup', () => {
    const input = '<h2>Title</h2><p>Paragraph</p>';
    const result = sanitizeHtml(input);

    expect(result).toContain('<h2');
    expect(result).toContain('Title');
    expect(result).toContain('<p');
    expect(result).toContain('Paragraph');
  });

  it('removes script tags and event handlers', () => {
    const input = '<p onclick="alert(1)">Click</p><script>alert("xss")</script>';
    const result = sanitizeHtml(input);

    expect(result).not.toContain('<script');
    expect(result).not.toContain('onclick');
    expect(result).toContain('Click');
  });

  it('adds safe link attributes to anchors', () => {
    const result = sanitizeHtml('<a href="https://example.com">Link</a>');

    expect(result).toContain('target="_blank"');
    expect(result).toContain('rel="noopener noreferrer"');
  });
});

describe('prepareHtmlBlockContent', () => {
  it('marks safe HTML as renderable', () => {
    const { sanitized, renderable } = prepareHtmlBlockContent('<p>Hello</p>');

    expect(renderable).toBe(true);
    expect(sanitized).toContain('Hello');
  });

  it('marks empty or script-only HTML as not renderable', () => {
    expect(prepareHtmlBlockContent('').renderable).toBe(false);
    expect(prepareHtmlBlockContent("<script>alert('x')</script>").renderable).toBe(false);
  });
});
