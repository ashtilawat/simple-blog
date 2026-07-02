import { renderHook, waitFor, act } from '@testing-library/react';
import { useContentItems } from './useContentItems';
import { fetchPublishedContentItems } from '../services/contentService';

jest.mock('../services/contentService');

describe('useContentItems', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('loads content items on mount', async () => {
    fetchPublishedContentItems.mockResolvedValue([
      {
        id: 'rec1',
        title: 'Article One',
        slug: 'article-one',
        blocks: []
      }
    ]);

    const { result } = renderHook(() => useContentItems());

    expect(result.current.loading).toBe(true);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.items).toHaveLength(1);
    expect(result.current.items[0].title).toBe('Article One');
    expect(result.current.error).toBeNull();
  });

  it('captures fetch errors and supports retry', async () => {
    fetchPublishedContentItems
      .mockRejectedValueOnce(new Error('Network unavailable'))
      .mockResolvedValueOnce([
        {
          id: 'rec2',
          title: 'Recovered Article',
          slug: 'recovered-article',
          blocks: []
        }
      ]);

    const { result } = renderHook(() => useContentItems());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBe('Network unavailable');
    expect(result.current.items).toEqual([]);

    await act(async () => {
      await result.current.retry();
    });

    await waitFor(() => {
      expect(result.current.error).toBeNull();
    });
    expect(result.current.items[0].title).toBe('Recovered Article');
  });
});
