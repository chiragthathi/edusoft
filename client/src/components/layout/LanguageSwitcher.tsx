import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Check, Globe } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { cn } from '../../lib/utils';
import { ease } from '../../lib/motion';

export const LANGUAGES = ['en', 'ja', 'fr', 'zh', 'ko'] as const;

export function changeLanguage(i18n: { changeLanguage: (l: string) => unknown }, code: string) {
  i18n.changeLanguage(code);
  try { localStorage.setItem('edusoft_lang', code); } catch { /* storage unavailable */ }
  document.documentElement.lang = code;
}

export default function LanguageSwitcher({ className }: { className?: string }) {
  const { t, i18n } = useTranslation();
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const items = useRef<(HTMLButtonElement | null)[]>([]);
  const current = (i18n.resolvedLanguage || 'en') as (typeof LANGUAGES)[number];

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => { if (!root.current?.contains(e.target as Node)) setOpen(false); };
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    items.current[LANGUAGES.indexOf(current)]?.focus();
    return () => { document.removeEventListener('mousedown', onDown); document.removeEventListener('keydown', onKey); };
  }, [open, current]);

  const onListKey = (e: React.KeyboardEvent) => {
    const i = items.current.findIndex(el => el === document.activeElement);
    if (e.key === 'ArrowDown') { e.preventDefault(); items.current[(i + 1) % LANGUAGES.length]?.focus(); }
    if (e.key === 'ArrowUp') { e.preventDefault(); items.current[(i - 1 + LANGUAGES.length) % LANGUAGES.length]?.focus(); }
  };

  return (
    <div ref={root} className={cn('relative', className)}>
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={`${t('nav.language')}: ${t(`navbar_languages.${current}`)}`}
        className="flex h-9 items-center gap-1.5 rounded-full px-2.5 font-mono text-[11px] uppercase tracking-[0.1em] opacity-80 transition-opacity hover:opacity-100"
      >
        <Globe size={15} strokeWidth={1.6} aria-hidden />
        {current}
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            role="menu"
            onKeyDown={onListKey}
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.98 }}
            transition={{ duration: 0.2, ease: ease.out }}
            className="absolute right-0 top-full z-50 mt-2 w-44 origin-top-right overflow-hidden rounded-md bg-raised p-1.5 text-fg shadow-float ring-1 ring-line"
          >
            {LANGUAGES.map((code, i) => (
              <button
                key={code}
                ref={el => { items.current[i] = el; }}
                role="menuitemradio"
                aria-checked={current === code}
                onClick={() => { changeLanguage(i18n, code); setOpen(false); }}
                className="flex w-full items-center justify-between rounded-sm px-3 py-2 text-left text-sm transition-colors hover:bg-fg/[0.05] focus-visible:bg-fg/[0.05]"
              >
                <span>{t(`navbar_languages.${code}`)}</span>
                {current === code && <Check size={14} className="text-brand" aria-hidden />}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
