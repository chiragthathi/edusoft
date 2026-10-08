import { useEffect, useState } from 'react';

interface AsyncState<T> { data: T | undefined; error: unknown; loading: boolean }

/**
 * Subscribe to a promise-returning loader keyed by `deps`.
 * Results from a superseded request are ignored, so fast filter changes
 * can never render stale data.
 */
export function useAsync<T>(load: () => Promise<T>, deps: unknown[]): AsyncState<T> {
  const [state, setState] = useState<AsyncState<T>>({ data: undefined, error: undefined, loading: true });

  useEffect(() => {
    let live = true;
    // Keep previous data visible while the next request is in flight.
    setState(s => (s.loading ? s : { ...s, loading: true }));
    load().then(
      data => { if (live) setState({ data, error: undefined, loading: false }); },
      error => { if (live) setState({ data: undefined, error, loading: false }); },
    );
    return () => { live = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return state;
}
