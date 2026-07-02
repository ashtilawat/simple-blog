import { useCallback, useEffect, useState } from 'react';
import { fetchContentItemById } from '../services/contentService';
import { getContentFetchErrorMessage } from '../services/contentErrors';

export function useContentItem(id) {
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadItem = useCallback(async () => {
    if (!id) {
      setItem(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await fetchContentItemById(id);
      setItem(data);
    } catch (err) {
      setError(getContentFetchErrorMessage(err));
      setItem(null);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadItem();
  }, [loadItem]);

  return { item, loading, error, reload: loadItem };
}
