import { createContext, useContext, useState, type ReactNode } from 'react';

/**
 * Tracks the opening logo sequence. Components that animate "on load"
 * (hero headline, hero product) wait for `done` so the visitor sees them.
 * The sequence plays once per browser session.
 */
const KEY = 'edusoft_intro_seen';

function alreadySeen() {
  try { return sessionStorage.getItem(KEY) === '1'; } catch { return false; }
}

const Ctx = createContext<{ done: boolean; finish: () => void }>({ done: true, finish: () => {} });

export function IntroProvider({ children }: { children: ReactNode }) {
  const [done, setDone] = useState(alreadySeen);
  const finish = () => {
    try { sessionStorage.setItem(KEY, '1'); } catch { /* storage unavailable */ }
    document.documentElement.classList.remove('intro');
    setDone(true);
  };
  return <Ctx.Provider value={{ done, finish }}>{children}</Ctx.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export const useIntro = () => useContext(Ctx);
