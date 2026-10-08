import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

/**
 * Pages whose first section is a dark "ink" hero call `useHeaderTone('ink')`
 * so the transparent header renders light text until the user scrolls.
 */
type Tone = 'ink' | 'light';
const Ctx = createContext<{ tone: Tone; setTone: (t: Tone) => void }>({ tone: 'light', setTone: () => {} });

export function HeaderToneProvider({ children }: { children: ReactNode }) {
  const [tone, setTone] = useState<Tone>('light');
  return <Ctx.Provider value={{ tone, setTone }}>{children}</Ctx.Provider>;
}

export function useHeaderTone(tone: Tone) {
  const { setTone } = useContext(Ctx);
  useEffect(() => {
    setTone(tone);
    return () => setTone('light');
  }, [tone, setTone]);
}

export const useHeaderToneValue = () => useContext(Ctx).tone;
