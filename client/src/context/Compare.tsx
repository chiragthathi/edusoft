import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react';

export const COMPARE_MAX = 3;
const KEY = 'edusoft_compare';

interface CompareCtx {
  items: string[];
  toggle: (slug: string) => void;
  remove: (slug: string) => void;
  clear: () => void;
  has: (slug: string) => boolean;
  full: boolean;
}

const Ctx = createContext<CompareCtx | null>(null);

export function CompareProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<string[]>(() => {
    try { return JSON.parse(sessionStorage.getItem(KEY) || '[]').slice(0, COMPARE_MAX); } catch { return []; }
  });
  useEffect(() => { try { sessionStorage.setItem(KEY, JSON.stringify(items)); } catch { /* ignore */ } }, [items]);

  const toggle = useCallback((slug: string) => setItems(cur =>
    cur.includes(slug) ? cur.filter(s => s !== slug) : cur.length >= COMPARE_MAX ? cur : [...cur, slug]), []);
  const remove = useCallback((slug: string) => setItems(cur => cur.filter(s => s !== slug)), []);
  const clear = useCallback(() => setItems([]), []);

  return (
    <Ctx.Provider value={{ items, toggle, remove, clear, has: s => items.includes(s), full: items.length >= COMPARE_MAX }}>
      {children}
    </Ctx.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useCompare() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useCompare must be used inside <CompareProvider>');
  return ctx;
}
