import { render, screen } from '@testing-library/react';
import { ChakraProvider } from '@chakra-ui/react';
import { HtmlBlock } from './HtmlBlock';

function renderHtmlBlock(props) {
  return render(
    <ChakraProvider>
      <HtmlBlock {...props} />
    </ChakraProvider>
  );
}

describe('HtmlBlock', () => {
  it('renders safe HTML markup', () => {
    renderHtmlBlock({
      html: '<h2>Section Title</h2><p>Hello <a href="https://example.com">world</a></p>'
    });

    expect(screen.getByRole('heading', { level: 2, name: 'Section Title' })).toBeInTheDocument();
    expect(screen.getByText('Hello')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'world' })).toHaveAttribute('href', 'https://example.com');
  });

  it('strips script tags and does not execute unsafe scripts (AC-004)', () => {
    const alertMock = jest.spyOn(window, 'alert').mockImplementation(() => {});

    renderHtmlBlock({
      html: "<p>Safe</p><script>alert('xss')</script>"
    });

    expect(screen.getByText('Safe')).toBeInTheDocument();
    expect(document.querySelector('script')).not.toBeInTheDocument();
    expect(alertMock).not.toHaveBeenCalled();

    alertMock.mockRestore();
  });

  it('shows fallback for empty HTML content (AC-010)', () => {
    renderHtmlBlock({ html: '   ' });

    expect(screen.getByRole('alert')).toHaveTextContent('Content unavailable');
  });

  it('shows fallback when HTML is script-only and nothing renderable remains (AC-010)', () => {
    renderHtmlBlock({
      html: "<script>alert('xss')</script>"
    });

    expect(screen.getByRole('alert')).toHaveTextContent('Content unavailable');
    expect(document.querySelector('script')).not.toBeInTheDocument();
  });

  it('shows fallback when HTML contains only forbidden markup (AC-010)', () => {
    renderHtmlBlock({
      html: '<style>body{display:none}</style><iframe src="https://evil.example"></iframe>'
    });

    expect(screen.getByRole('alert')).toHaveTextContent('Content unavailable');
  });

  it('supports a custom fallback message', () => {
    renderHtmlBlock({
      html: '',
      fallbackMessage: 'HTML block could not be displayed'
    });

    expect(screen.getByRole('alert')).toHaveTextContent('HTML block could not be displayed');
  });
});
