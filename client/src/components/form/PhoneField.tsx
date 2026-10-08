import { forwardRef, useEffect, useId, useMemo, useRef, useState, type InputHTMLAttributes } from 'react';
import { useTranslation } from 'react-i18next';
import { AnimatePresence, motion } from 'framer-motion';
import { Check, ChevronDown, Search } from 'lucide-react';
import { COUNTRIES, countryFromNumber } from '../../content/countries';
import { cn } from '../../lib/utils';
import { ease } from '../../lib/motion';

export const dialOf = (iso: string) => COUNTRIES.find(c => c[0] === iso)?.[1] ?? '';

interface Props extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  label: string;
  optionalLabel?: string;
  country: string;
  onCountryChange: (iso: string) => void;
  onChange?: InputHTMLAttributes<HTMLInputElement>['onChange'];
}

/**
 * Phone input with a searchable country picker (ARIA combobox + listbox).
 * Typing an international number ("+44 …") selects the matching country.
 */
const PhoneField = forwardRef<HTMLInputElement, Props>(function PhoneField(
  { label, optionalLabel, country, onCountryChange, onChange, className, ...input }, ref,
) {
  const { t, i18n } = useTranslation();
  const id = useId();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [hi, setHi] = useState(0);
  const root = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  const names = useMemo(() => {
    let dn: Intl.DisplayNames | null = null;
    try { dn = new Intl.DisplayNames([i18n.resolvedLanguage || 'en'], { type: 'region' }); } catch { /* old browser */ }
    return new Map(COUNTRIES.map(([iso]) => [iso, dn?.of(iso) ?? iso]));
  }, [i18n.resolvedLanguage]);

  const options = useMemo(() => {
    const q = query.trim().toLowerCase().replace(/^\+/, '');
    const all = COUNTRIES.map(([iso, dial]) => ({ iso, dial, name: names.get(iso)! }));
    if (!q) return all;
    return all.filter(o => o.name.toLowerCase().includes(q) || o.iso.toLowerCase() === q || o.dial.slice(1).startsWith(q));
  }, [query, names]);

  useEffect(() => {
    if (!open) return;
    setHi(Math.max(0, options.findIndex(o => o.iso === country)));
    searchRef.current?.focus();
    const onDown = (e: MouseEvent) => { if (!root.current?.contains(e.target as Node)) setOpen(false); };
    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  useEffect(() => { listRef.current?.children[hi]?.scrollIntoView({ block: 'nearest' }); }, [hi]);

  const choose = (iso: string) => { onCountryChange(iso); setOpen(false); setQuery(''); };

  const onSearchKey = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); setHi(h => Math.min(options.length - 1, h + 1)); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setHi(h => Math.max(0, h - 1)); }
    else if (e.key === 'Enter') { e.preventDefault(); if (options[hi]) choose(options[hi].iso); }
    else if (e.key === 'Escape') { e.preventDefault(); setOpen(false); }
  };

  const listId = `${id}-list`;

  return (
    <div className={cn('field', className)} ref={root}>
      <label htmlFor={`${id}-num`} className="field-label flex justify-between">
        <span>{label}</span>{optionalLabel && <span className="text-xs font-normal text-subtle">{optionalLabel}</span>}
      </label>
      <div className="relative flex rounded-sm bg-surface shadow-[inset_0_0_0_1px_rgb(var(--line-strong)/var(--line-strong-a))] transition-shadow focus-within:shadow-[inset_0_0_0_1.5px_rgb(var(--brand)),0_0_0_4px_rgb(var(--brand)/0.14)]">
        <button
          type="button"
          onClick={() => setOpen(o => !o)}
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-controls={listId}
          aria-label={`${t('phone_codes.label')}: ${names.get(country)} ${dialOf(country)}`}
          className="flex shrink-0 items-center gap-2 border-r border-line pl-3.5 pr-3 text-sm transition-colors hover:bg-fg/[0.04]"
        >
          <span className="grid h-5 min-w-[1.75rem] place-items-center rounded-[3px] bg-fg/[0.08] px-1 font-mono text-[10px] font-medium tracking-wider">{country}</span>
          <span className="font-mono tabular-nums">{dialOf(country)}</span>
          <ChevronDown size={14} aria-hidden className={cn('text-muted transition-transform duration-normal', open && 'rotate-180')} />
        </button>
        <input
          {...input}
          ref={ref}
          id={`${id}-num`}
          type="tel"
          inputMode="tel"
          autoComplete="tel-national"
          onChange={e => {
            const iso = countryFromNumber(e.target.value);
            if (iso && iso !== country) onCountryChange(iso);
            onChange?.(e);
          }}
          className="min-h-[3.125rem] min-w-0 flex-1 bg-transparent px-4 text-[15px] outline-none placeholder:text-subtle"
        />

        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, y: -6, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -4, scale: 0.98 }}
              transition={{ duration: 0.2, ease: ease.out }}
              className="absolute left-0 top-full z-40 mt-2 w-[min(22rem,calc(100vw-2rem))] origin-top-left overflow-hidden rounded-md bg-raised shadow-float ring-1 ring-line"
            >
              <div className="relative border-b border-line">
                <Search size={15} aria-hidden className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
                <input
                  ref={searchRef}
                  role="combobox"
                  aria-expanded
                  aria-controls={listId}
                  aria-activedescendant={options[hi] ? `${id}-${options[hi].iso}` : undefined}
                  aria-autocomplete="list"
                  value={query}
                  onChange={e => { setQuery(e.target.value); setHi(0); }}
                  onKeyDown={onSearchKey}
                  placeholder={t('phone_codes.search')}
                  className="h-11 w-full bg-transparent pl-10 pr-3 text-sm outline-none placeholder:text-subtle"
                />
              </div>
              <ul ref={listRef} id={listId} role="listbox" aria-label={t('phone_codes.label')} className="max-h-64 overflow-y-auto py-1">
                {options.map((o, i) => (
                  <li
                    key={o.iso}
                    id={`${id}-${o.iso}`}
                    role="option"
                    aria-selected={o.iso === country}
                    onMouseEnter={() => setHi(i)}
                    onMouseDown={e => { e.preventDefault(); choose(o.iso); }}
                    className={cn('flex cursor-pointer items-center gap-3 px-3.5 py-2 text-sm', i === hi && 'bg-fg/[0.06]')}
                  >
                    <span className="grid h-5 min-w-[1.75rem] place-items-center rounded-[3px] bg-fg/[0.08] px-1 font-mono text-[10px] font-medium tracking-wider">{o.iso}</span>
                    <span className="flex-1 truncate">{o.name}</span>
                    <span className="font-mono text-xs tabular-nums text-muted">{o.dial}</span>
                    {o.iso === country && <Check size={14} className="text-brand" aria-hidden />}
                  </li>
                ))}
                {options.length === 0 && <li className="px-3.5 py-3 text-sm text-muted">—</li>}
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
});

export default PhoneField;
