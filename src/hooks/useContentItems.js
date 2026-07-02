import { useCallback, useEffect, useState } from 'react';
import { fetchPublishedContentItems } from '../services/contentService';
import { getContentFetchErrorMessage } from '../services/contentErrors';

/**
 * @typedef {import('../content/types').ContentItem} ContentItem
 */

/**
 * Fetches published content items on mount with loading and error state.
 * @returns {{
 *   items: ContentItem[],
 *   loading: boolean,
 *   error: string | null,
 *   retry: () => Promise<void>
 * }}
 */
export function useContentItems() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await fetchPublishedContentItems();
      setItems(result);
    } catch (fetchError) {
      setItems([]);
      setError(getContentFetchErrorMessage(fetchError));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return { items, loading, error, retry: load };
}
