import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { AnimatePresence, motion } from 'framer-motion';
import { Search, X } from 'lucide-react';
import { productsApi } from '../lib/api';
import { useAsync } from '../lib/useAsync';
import type { Category, ProductSummary } from '../lib/types';
import { cn } from '../lib/utils';
import { ease } from '../lib/motion';
import Seo from '../components/ui/Seo';
import Eyebrow from '../components/ui/Eyebrow';
import Button from '../components/ui/Button';
import { MaskLines, Reveal } from '../components/motion/Reveal';
import ProductCard from '../components/product/ProductCard';
import CompareTray from '../components/product/CompareTray';

const GROUPS = ['imaging', 'digital', 'output', 'specialty'] as const;

function useDebounced<T>(value: T, ms = 200) {
  const [v, setV] = useState(value);
  useEffect(() => { const id = setTimeout(() => setV(value), ms); return () => clearTimeout(id); }, [value, ms]);
  return v;
}

export default function PortfolioPage() {
  const { t } = useTranslation();
  const [params, setParams] = useSearchParams();
  const active = params.get('category') || 'all';
  const [query, setQuery] = useState(params.get('q') ?? '');
  const q = useDebounced(query.trim());

  // Keep ?q= in the URL (shareable searches) without adding history entries.
  useEffect(() => {
    const next = new URLSearchParams(params);
    if (q) next.set('q', q); else next.delete('q');
    if (next.toString() !== params.toString()) setParams(next, { replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q]);

  const { data: categories } = useAsync(() => productsApi.getCategories(), []);
  const { data: all } = useAsync(() => productsApi.getAll(), []);
  const { data: results, loading } = useAsync(
    () => productsApi.getAll({ category: active === 'all' ? undefined : active, search: q || undefined }),
    [active, q],
  );

  const cat = categories?.find(c => c.id === active);
  const total = all?.length ?? 0;

  const setCategory = (id: string) => {
    const next = new URLSearchParams(params);
    if (id === 'all') next.delete('category'); else next.set('category', id);
    setParams(next);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // "All" without a search reads as a catalogue grouped by family.
  const grouped = useMemo(() => {
    if (!results || !categories || active !== 'all' || q) return null;
    return categories.map(c => ({ c, items: results.filter(p => p.category === c.id) })).filter(g => g.items.length);
  }, [results, categories, active, q]);

  const title = cat ? cat.label : t('portfolio_page.title');

  return (
    <>
      <Seo
        title={cat ? `${cat.label} — Products` : 'Products — Medical Imaging Systems'}
        description={cat ? cat.description : 'Handheld, mobile and fixed X-ray, surgical C-Arms, DR detectors, CR systems, medical printers, films, software and accessories from Edusoft Healthcare.'}
        path={cat ? `/portfolio?category=${cat.id}` : '/portfolio'}
      />

      {/* Header */}
      <header className="bg-bg pt-[calc(var(--header-h)+3.5rem)] sm:pt-[calc(var(--header-h)+5rem)]">
        <div className="container-x grid gap-10 pb-12 lg:grid-cols-12 lg:items-end lg:pb-16">
          <div className="lg:col-span-7">
            <Reveal><Eyebrow>{t('portfolio_page.eyebrow')}{cat ? ` / ${cat.label}` : ''}</Eyebrow></Reveal>
            <MaskLines as="h1" immediate className="mt-5 font-display text-display-lg font-medium" key={title}>
              <span>{title}</span>
              {!cat && <span className="text-muted">{t('portfolio_page.title_em')}</span>}
            </MaskLines>
            <Reveal delay={0.1}>
              <p className="lede mt-6 max-w-xl">{cat ? cat.description : t('portfolio_page.subtitle', { count: total })}</p>
            </Reveal>
          </div>
          <Reveal delay={0.2} className="lg:col-span-5">
            <div className="relative">
              <Search size={18} aria-hidden className="pointer-events-none absolute left-5 top-1/2 -translate-y-1/2 text-muted" />
              <input
                type="search"
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder={t('portfolio_page.search_placeholder')}
                aria-label={t('portfolio_page.search_products_aria')}
                className="control h-14 rounded-full pl-12 pr-12 text-base"
              />
              {query && (
                <button type="button" onClick={() => setQuery('')} aria-label={t('portfolio_page.clear_search_aria')}
                  className="absolute right-3 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-full text-muted hover:bg-fg/10 hover:text-fg">
                  <X size={16} />
                </button>
              )}
            </div>
          </Reveal>
        </div>
      </header>

      {/* Mobile / tablet category bar */}
      <div className="sticky top-[var(--header-h)] z-20 border-y border-line bg-bg/85 backdrop-blur-xl lg:hidden">
        <div role="group" aria-label={t('portfolio_page.filter_category_aria')} className="no-scrollbar container-x flex gap-2 overflow-x-auto py-3">
          <button type="button" className="chip shrink-0" aria-pressed={active === 'all'} onClick={() => setCategory('all')}>{t('portfolio_page.filter_all')}</button>
          {categories?.map(c => (
            <button key={c.id} type="button" className="chip shrink-0" aria-pressed={active === c.id} onClick={() => setCategory(c.id)}>{c.label}</button>
          ))}
        </div>
      </div>

      <div className="container-x grid gap-10 pb-section pt-10 lg:grid-cols-12 lg:pt-4">
        {/* Desktop category rail */}
        <aside className="hidden lg:col-span-3 lg:block">
          <nav aria-label={t('portfolio_page.filter_category_aria')} className="sticky top-[calc(var(--header-h)+1.5rem)] space-y-7 border-t border-line pt-6">
            <RailLink active={active === 'all'} onClick={() => setCategory('all')} label={t('portfolio_page.filter_all')} count={total} />
            {GROUPS.map(g => {
              const cats = categories?.filter(c => c.group === g) ?? [];
              if (!cats.length) return null;
              return (
                <div key={g}>
                  <p className="eyebrow mb-2">{t(`nav.groups.${g}`)}</p>
                  <ul>
                    {cats.map(c => (
                      <li key={c.id}><RailLink active={active === c.id} onClick={() => setCategory(c.id)} label={c.label} count={c.count} /></li>
                    ))}
                  </ul>
                </div>
              );
            })}
            <div className="rounded-lg bg-surface p-5 shadow-hairline">
              <p className="font-medium">{t('portfolio_page.need_help')}</p>
              <p className="mt-1 text-sm text-muted">{t('portfolio_page.need_help_body')}</p>
              <Button to="/contact?type=sales" size="sm" variant="secondary" arrow className="mt-4">{t('portfolio_page.need_help_cta')}</Button>
            </div>
          </nav>
        </aside>

        {/* Results */}
        <section className="lg:col-span-9" aria-live="polite" aria-busy={loading}>
          <div className="mb-6 flex items-center justify-between border-t border-line pt-6">
            <p className="dicom">{t('portfolio_page.results', { count: results?.length ?? 0 })}</p>
            <p className="dicom hidden sm:block">{t('portfolio_page.compare_hint')}</p>
          </div>

          {!results ? (
            <SkeletonGrid />
          ) : results.length === 0 ? (
            <div className="grid place-items-center rounded-lg bg-surface px-6 py-24 text-center shadow-hairline">
              <Search size={28} className="text-subtle" aria-hidden />
              <p className="mt-4 text-lg">{t('portfolio_page.no_results')}</p>
              <Button onClick={() => { setQuery(''); setCategory('all'); }} variant="secondary" size="sm" className="mt-6">{t('portfolio_page.clear_filters')}</Button>
            </div>
          ) : grouped ? (
            <div className="space-y-24">
              {grouped.map(({ c, items }) => <FamilyBlock key={c.id} category={c} items={items} onSelect={() => setCategory(c.id)} />)}
            </div>
          ) : (
            <Grid items={results} />
          )}
        </section>
      </div>

      <CompareTray products={all ?? []} />
    </>
  );
}

function RailLink({ active, onClick, label, count }: { active: boolean; onClick: () => void; label: string; count: number }) {
  return (
    <button type="button" onClick={onClick} aria-current={active ? 'true' : undefined}
      className={cn('group -mx-2 flex w-full items-center justify-between rounded-sm px-2 py-1.5 text-left text-[15px] transition-colors', active ? 'text-fg' : 'text-muted hover:text-fg')}>
      <span className="flex items-center gap-2.5">
        <span aria-hidden className={cn('h-1.5 w-1.5 rounded-full transition-all duration-normal', active ? 'bg-brand' : 'scale-0 bg-transparent')} />
        {label}
      </span>
      <span className="font-mono text-[10px] tabular-nums text-subtle">{String(count).padStart(2, '0')}</span>
    </button>
  );
}

function Grid({ items }: { items: ProductSummary[] }) {
  return (
    <motion.ul layout className="grid grid-cols-2 gap-x-3 gap-y-10 sm:gap-x-5 md:grid-cols-3">
      <AnimatePresence initial={false}>
        {items.map((p, i) => (
          <motion.li key={p.slug} layout initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, transition: { duration: 0.18 } }}
            transition={{ duration: 0.45, ease: ease.out, delay: Math.min(i, 8) * 0.03, layout: { duration: 0.35, ease: ease.out } }}>
            <ProductCard product={p} index={i} compare />
          </motion.li>
        ))}
      </AnimatePresence>
    </motion.ul>
  );
}

function FamilyBlock({ category, items, onSelect }: { category: Category; items: ProductSummary[]; onSelect: () => void }) {
  const { t } = useTranslation();
  return (
    <section aria-labelledby={`fam-${category.id}`}>
      <Reveal className="mb-8 grid gap-3 sm:grid-cols-[1fr_auto] sm:items-end">
        <div>
          <h2 id={`fam-${category.id}`} className="font-display text-display-sm font-medium">{category.label}</h2>
          <p className="mt-2 max-w-xl text-muted">{category.tagline}</p>
        </div>
        <Link to={`/portfolio?category=${category.id}`} onClick={onSelect} className="link self-start text-sm sm:self-auto">
          {t('nav.view_all_in', { category: category.label })}
        </Link>
      </Reveal>
      <Grid items={items} />
    </section>
  );
}

function SkeletonGrid() {
  return (
    <div className="grid grid-cols-2 gap-x-3 gap-y-10 sm:gap-x-5 md:grid-cols-3" aria-hidden>
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i}>
          <div className="skeleton aspect-square rounded-lg" />
          <div className="skeleton mt-4 h-5 w-2/3" />
          <div className="skeleton mt-2 h-4 w-1/2" />
        </div>
      ))}
    </div>
  );
}
