import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, X } from 'lucide-react';
import { productsApi } from '../lib/api';
import { useAsync } from '../lib/useAsync';
import type { ProductDetail } from '../lib/types';
import { cn } from '../lib/utils';
import { useCompare } from '../context/Compare';
import Seo from '../components/ui/Seo';
import Eyebrow from '../components/ui/Eyebrow';
import Button from '../components/ui/Button';
import Lightbox from '../components/ui/Lightbox';
import { MaskLines } from '../components/motion/Reveal';

/**
 * Side-by-side comparison of up to three products. Rows are the union of
 * every published spec label; missing values show an em dash (never guessed).
 */
export default function ComparePage() {
  const { t } = useTranslation();
  const [params, setParams] = useSearchParams();
  const { items: queued, remove } = useCompare();
  const slugs = (params.get('items') || queued.join(',')).split(',').filter(Boolean).slice(0, 3);
  const key = slugs.join(',');
  const { data } = useAsync(() => Promise.all(slugs.map(s => productsApi.getBySlug(s).catch(() => null))), [key]);
  const products = (data ?? []).filter(Boolean) as ProductDetail[];
  const [diffOnly, setDiffOnly] = useState(false);

  // Keep URL shareable.
  useEffect(() => {
    if (!params.get('items') && queued.length) setParams({ items: queued.join(',') }, { replace: true });
  }, [params, queued, setParams]);

  const groups = useMemo(() => {
    const order: string[] = [];
    const rows = new Map<string, string[]>();
    products.forEach(p => p.specGroups.forEach(g => {
      if (!rows.has(g.title)) { rows.set(g.title, []); order.push(g.title); }
      const list = rows.get(g.title)!;
      g.rows.forEach(([k]) => { if (!list.includes(k)) list.push(k); });
    }));
    const lookup = (p: ProductDetail, g: string, k: string) => p.specGroups.find(x => x.title === g)?.rows.find(([kk]) => kk === k)?.[1];
    return order.map(g => ({
      title: g,
      rows: rows.get(g)!.map(k => ({ k, values: products.map(p => lookup(p, g, k)) })),
    }));
  }, [products]);

  const dropItem = (slug: string) => {
    remove(slug);
    const next = slugs.filter(s => s !== slug);
    setParams(next.length ? { items: next.join(',') } : {}, { replace: true });
  };

  const cols = `minmax(9rem,1.1fr) repeat(${Math.max(products.length, 1)}, minmax(12rem,1fr))`;

  return (
    <>
      <Seo title={t('compare_page.title')} path="/portfolio/compare" noindex />
      <section className="bg-bg pb-section pt-[calc(var(--header-h)+3.5rem)]">
        <div className="container-x">
          <Link to="/portfolio" className="inline-flex items-center gap-2 text-sm text-muted hover:text-fg"><ArrowLeft size={15} /> {t('compare_page.back')}</Link>
          <div className="mt-8 flex flex-wrap items-end justify-between gap-6">
            <div>
              <Eyebrow>{t('portfolio_page.eyebrow')}</Eyebrow>
              <MaskLines as="h1" immediate className="mt-5 font-display text-display-lg font-medium"><span>{t('compare_page.title')}</span></MaskLines>
            </div>
            {products.length > 1 && (
              <label className="flex cursor-pointer items-center gap-3 text-sm">
                <input type="checkbox" checked={diffOnly} onChange={e => setDiffOnly(e.target.checked)} className="h-4 w-4 accent-[rgb(var(--brand))]" />
                {t('compare_page.only_diff')}
              </label>
            )}
          </div>

          {slugs.length === 0 ? (
            <div className="mt-12 rounded-lg bg-surface p-10 text-center shadow-hairline">
              <p className="text-lede">{t('compare_page.empty')}</p>
              <Button to="/portfolio" className="mt-6" arrow>{t('compare_page.back')}</Button>
            </div>
          ) : (
            <div className="-mx-gutter mt-12 overflow-x-auto px-gutter">
              <div className="min-w-max">
                {/* Product heads */}
                <div className="sticky top-[var(--header-h)] z-10 grid gap-4 bg-bg/90 pb-4 pt-2 backdrop-blur-xl" style={{ gridTemplateColumns: cols }}>
                  <div />
                  {products.map(p => (
                    <div key={p.slug} className="relative">
                      <Lightbox image={p.images[0]} alt={p.name} sizes="240px" className="aspect-[4/3]" />
                      <button type="button" onClick={() => dropItem(p.slug)} aria-label={`${t('compare_page.remove')} ${p.name}`}
                        className="absolute right-2 top-2 grid h-7 w-7 place-items-center rounded-full bg-white/85 text-ink-900 backdrop-blur hover:bg-white"><X size={14} /></button>
                      <Link to={`/portfolio/${p.slug}`} className="mt-3 block font-display text-lg leading-tight hover:text-brand">{p.name}</Link>
                      <p className="dicom mt-1">{p.categoryLabel}</p>
                    </div>
                  ))}
                </div>

                {groups.map(g => {
                  const rows = diffOnly ? g.rows.filter(r => new Set(r.values.map(v => v ?? '—')).size > 1) : g.rows;
                  if (!rows.length) return null;
                  return (
                    <section key={g.title} className="mt-10">
                      <h2 className="eyebrow mb-3">{g.title}</h2>
                      <div role="table" aria-label={g.title} className="border-t border-line">
                        {rows.map(r => {
                          const differs = new Set(r.values.map(v => v ?? '—')).size > 1;
                          return (
                            <div role="row" key={r.k} className="grid gap-4 border-b border-line py-3 text-[14px]" style={{ gridTemplateColumns: cols }}>
                              <div role="rowheader" className="text-muted">{r.k}</div>
                              {r.values.map((v, i) => (
                                <div role="cell" key={i} className={cn('tabular-nums', v ? 'text-fg' : 'text-subtle', differs && v && 'font-medium')}>{v ?? t('compare_page.not_listed')}</div>
                              ))}
                            </div>
                          );
                        })}
                      </div>
                    </section>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
