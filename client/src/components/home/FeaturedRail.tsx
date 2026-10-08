import { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import type { ProductSummary } from '../../lib/types';
import SectionHeader from '../ui/SectionHeader';
import Button from '../ui/Button';
import ProductCard from '../product/ProductCard';

/**
 * Horizontal flagship gallery. Native horizontal scroll with snap (touch,
 * trackpad, shift+wheel); pointer-drag on desktop; arrow buttons for
 * keyboard/mouse. Vertical page scroll is never captured.
 */
export default function FeaturedRail({ products }: { products: ProductSummary[] }) {
  const { t } = useTranslation();
  const rail = useRef<HTMLUListElement>(null);
  const drag = useRef<{ x: number; left: number; moved: boolean } | null>(null);
  const [edges, setEdges] = useState({ start: true, end: false });

  const measure = useCallback(() => {
    const el = rail.current; if (!el) return;
    setEdges({ start: el.scrollLeft < 8, end: el.scrollLeft + el.clientWidth >= el.scrollWidth - 8 });
  }, []);
  useEffect(() => { measure(); }, [products, measure]);

  const step = (dir: 1 | -1) => {
    const el = rail.current; if (!el) return;
    const card = el.querySelector('li');
    el.scrollBy({ left: dir * ((card?.clientWidth ?? 320) + 16) * 2, behavior: 'smooth' });
  };

  const onPointerDown = (e: React.PointerEvent) => {
    if (e.pointerType !== 'mouse' || !rail.current) return;
    drag.current = { x: e.clientX, left: rail.current.scrollLeft, moved: false };
  };
  const onPointerMove = (e: React.PointerEvent) => {
    const d = drag.current; if (!d || !rail.current) return;
    const dx = e.clientX - d.x;
    if (Math.abs(dx) > 4) { d.moved = true; rail.current.style.scrollSnapType = 'none'; }
    rail.current.scrollLeft = d.left - dx;
  };
  const endDrag = () => {
    if (rail.current) rail.current.style.scrollSnapType = '';
    setTimeout(() => { drag.current = null; }, 0);
  };
  // Swallow the click that ends a drag so cards don't navigate.
  const onClickCapture = (e: React.MouseEvent) => { if (drag.current?.moved) { e.preventDefault(); e.stopPropagation(); } };

  return (
    <section className="section-y overflow-hidden bg-bg" aria-labelledby="featured-title">
      <div className="container-x">
        <SectionHeader
          index="04"
          eyebrow={t('home.featured.eyebrow')}
          title={<span id="featured-title">{t('home.featured.title')}</span>}
          action={
            <div className="flex items-center gap-3 lg:justify-end">
              <button type="button" onClick={() => step(-1)} disabled={edges.start} aria-label={t('common.previous')} className="grid h-11 w-11 place-items-center rounded-full shadow-hairline transition hover:bg-fg hover:text-bg disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-fg"><ArrowLeft size={18} /></button>
              <button type="button" onClick={() => step(1)} disabled={edges.end} aria-label={t('common.next')} className="grid h-11 w-11 place-items-center rounded-full shadow-hairline transition hover:bg-fg hover:text-bg disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-fg"><ArrowRight size={18} /></button>
              <Button to="/portfolio" variant="ghost" arrow className="ml-3">{t('home.featured.all')}</Button>
            </div>
          }
        />
      </div>
      <ul
        ref={rail}
        onScroll={measure}
        onPointerDown={onPointerDown} onPointerMove={onPointerMove} onPointerUp={endDrag} onPointerLeave={endDrag}
        onClickCapture={onClickCapture}
        className="rail cursor-grab scroll-px-[var(--gutter)] px-gutter pb-2 active:cursor-grabbing lg:scroll-px-[max(var(--gutter),calc((100vw-var(--container))/2+var(--gutter)))] lg:px-[max(var(--gutter),calc((100vw-var(--container))/2+var(--gutter)))]"
        aria-label={t('home.featured.eyebrow')}
      >
        {products.map((p, i) => (
          <li key={p.slug} className="w-[78vw] shrink-0 sm:w-[46vw] lg:w-[30vw] xl:w-[24rem]">
            <ProductCard product={p} index={i} size="lg" sizes="(min-width:1280px) 384px, (min-width:1024px) 30vw, 78vw" />
          </li>
        ))}
      </ul>
    </section>
  );
}
