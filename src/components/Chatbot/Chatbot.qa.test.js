/**
 * QA acceptance tests for the author chatbot (AC-01, AC-02, AC-05, AC-06, AC-08, AC-09, AC-12).
 * Mocks /api/chat for deterministic checks without modifying application source.
 */
import '@testing-library/jest-dom';
import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { ChakraProvider } from '@chakra-ui/react';
import { Chatbot } from './Chatbot';

beforeAll(() => {
  setupMatchMedia();
  Element.prototype.scrollIntoView = jest.fn();
});

const setupMatchMedia = () => {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    configurable: true,
    value: jest.fn().mockImplementation((query) => ({
      matches: query.includes('1300px') || query.includes('900px'),
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn()
    }))
  });
};

const renderChatbot = () =>
  render(
    <ChakraProvider>
      <Chatbot />
    </ChakraProvider>
  );

describe('Chatbot QA acceptance checks', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    setupMatchMedia();
  });

  test('AC-01: chatbot entry point is visible on the page', () => {
    renderChatbot();
    expect(screen.getByRole('button', { name: /open chatbot/i })).toBeInTheDocument();
  });

  test('AC-02: opening chatbot reveals input and send controls', async () => {
    renderChatbot();

    fireEvent.click(screen.getByRole('button', { name: /open chatbot/i }));

    expect(screen.getByRole('textbox', { name: /chat message input/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /^send$/i })).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: /chat message input/i })).toHaveFocus();
  });

  test('AC-06: whitespace-only submit does not call API or add user message', async () => {
    const fetchSpy = jest.spyOn(global, 'fetch');
    renderChatbot();

    fireEvent.click(screen.getByRole('button', { name: /open chatbot/i }));
    const input = screen.getByRole('textbox', { name: /chat message input/i });

    fireEvent.change(input, { target: { value: '   ' } });
    fireEvent.submit(input.closest('form'));

    expect(fetchSpy).not.toHaveBeenCalled();
    expect(screen.queryByText('   ')).not.toBeInTheDocument();
  });

  test('AC-03/AC-08: submitting a question adds user and assistant messages with loading state', async () => {
    let resolveFetch;
    const fetchPromise = new Promise((resolve) => {
      resolveFetch = resolve;
    });

    jest.spyOn(global, 'fetch').mockReturnValue(fetchPromise);

    renderChatbot();
    fireEvent.click(screen.getByRole('button', { name: /open chatbot/i }));

    const input = screen.getByRole('textbox', { name: /chat message input/i });
    fireEvent.change(input, { target: { value: 'What is your background?' } });
    fireEvent.click(screen.getByRole('button', { name: /^send$/i }));

    expect(screen.getByText('What is your background?')).toBeInTheDocument();
    expect(screen.getByText(/thinking/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /send/i })).toBeDisabled();
    expect(screen.getByRole('textbox', { name: /chat message input/i })).toBeDisabled();

    resolveFetch({
      ok: true,
      json: async () => ({ reply: 'Alex is a full-stack developer and bootcamp instructor.' })
    });

    await waitFor(() => {
      expect(
        screen.getByText('Alex is a full-stack developer and bootcamp instructor.')
      ).toBeInTheDocument();
    });

    expect(screen.queryByText(/thinking/i)).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: /send/i })).toBeDisabled();
    expect(screen.getByRole('textbox', { name: /chat message input/i })).not.toBeDisabled();
  });

  test('AC-09: API failure shows error and allows retry', async () => {
    jest.spyOn(global, 'fetch').mockResolvedValue({
      ok: false,
      json: async () => ({ error: 'Unable to get a response right now. Please try again.' })
    });

    renderChatbot();
    fireEvent.click(screen.getByRole('button', { name: /open chatbot/i }));

    const input = screen.getByRole('textbox', { name: /chat message input/i });
    fireEvent.change(input, { target: { value: 'What is your background?' } });
    fireEvent.click(screen.getByRole('button', { name: /^send$/i }));

    await waitFor(() => {
      expect(
        screen.getByText('Unable to get a response right now. Please try again.')
      ).toBeInTheDocument();
    });

    expect(input).not.toBeDisabled();
    fireEvent.change(input, { target: { value: 'Retry question' } });
    expect(screen.getByRole('button', { name: /send/i })).not.toBeDisabled();
  });

  test('AC-05: multi-turn sends prior conversation messages to API', async () => {
    const fetchSpy = jest
      .spyOn(global, 'fetch')
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ reply: 'Alex teaches bootcamp students.' })
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ reply: 'They focus on React and Node.js mentoring.' })
      });

    renderChatbot();
    fireEvent.click(screen.getByRole('button', { name: /open chatbot/i }));

    const input = screen.getByRole('textbox', { name: /chat message input/i });
    fireEvent.change(input, { target: { value: 'What does the author teach?' } });
    fireEvent.click(screen.getByRole('button', { name: /^send$/i }));

    await waitFor(() => {
      expect(screen.getByText('Alex teaches bootcamp students.')).toBeInTheDocument();
    });

    fireEvent.change(input, { target: { value: 'Tell me more about that' } });
    fireEvent.click(screen.getByRole('button', { name: /^send$/i }));

    await waitFor(() => {
      expect(screen.getByText('They focus on React and Node.js mentoring.')).toBeInTheDocument();
    });

    const secondCallBody = JSON.parse(fetchSpy.mock.calls[1][1].body);
    expect(secondCallBody.messages).toEqual(
      expect.arrayContaining([
        { role: 'user', content: 'What does the author teach?' },
        { role: 'assistant', content: 'Alex teaches bootcamp students.' },
        { role: 'user', content: 'Tell me more about that' }
      ])
    );
  });

  test('AC-12: chat panel can be closed after opening', async () => {
    renderChatbot();

    fireEvent.click(screen.getByRole('button', { name: /open chatbot/i }));
    expect(screen.getByRole('textbox', { name: /chat message input/i })).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /close chatbot/i }));
    expect(screen.queryByRole('textbox', { name: /chat message input/i })).not.toBeInTheDocument();
  });
});
