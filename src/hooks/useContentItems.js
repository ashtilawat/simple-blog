import { useCallback, useEffect, useState } from 'react';
import { fetchContentItems } from '../services/contentService';

export function useContentItems() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadItems = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await fetchContentItems();
      setItems(data);
    } catch (err) {
      setError(err.message || 'Unable to load content.');
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadItems();
  }, [loadItems]);

  return { items, loading, error, reload: loadItems };
}
