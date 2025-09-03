import { useCallback, useState } from 'react';

// PUBLIC_INTERFACE
export function useApi(fn) {
  /** Wrap an API function to provide loading and error state */
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const call = useCallback(async (...args) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fn(...args);
      return res;
    } catch (e) {
      setError(e);
      throw e;
    } finally {
      setLoading(false);
    }
  }, [fn]);

  return { call, loading, error };
}
