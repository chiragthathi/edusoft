import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowUpRight, Check, Plus } from 'lucide-react';
import type { ProductSummary } from '../../lib/types';
import { cn } from '../../lib/utils';
import { useCompare } from '../../context/Compare';
import Picture from '../ui/Picture';
import { TiltStage } from '../motion/Interactive';

interface Props {
  product: ProductSummary;
  index?: number;
  size?: 'md' | 'lg';
  compare?: boolean;
  sizes?: string;
  className?: string;
}

/**
 * Premium product card: lightbox stage, DICOM-style meta, one headline metric.
 * The whole card is a single link (stretched); the compare toggle sits above it.
 */
export default function ProductCard({ product, index, size = 'md', compare = false, sizes = '(min-width:1280px) 25vw, (min-width:768px) 33vw, 50vw', className }: Props) {
  const { t } = useTranslation();
  const img = product.images?.[0];
  const metric = product.highlights?.[0];

  return (
    <article data-tilt-root className={cn('group relative flex flex-col', className)}>
      <TiltStage tilt={3}>
      <div className={cn('lightbox relative w-full', size === 'lg' ? 'aspect-[4/5]' : 'aspect-square')}>
        {img ? (
          <Picture image={img} alt={product.name} sizes={sizes}
            className="h-full w-full p-[11%] transition-transform duration-slow ease-out group-hover:-translate-y-[1.5%] group-hover:scale-[1.035]" />
        ) : (
          <div className="grid h-full place-items-center p-6 text-center font-display text-lg text-ink-700">{product.name}</div>
        )}
        <div aria-hidden className="pointer-events-none absolute inset-x-3.5 top-3 flex items-start justify-between text-ink-700">
          <span className={cn('dicom truncate text-ink-700/75', compare && 'max-w-[calc(100%-6.5rem)] md:max-w-none')}>{index != null ? `${String(index + 1).padStart(2, '0')} · ` : ''}{product.categoryLabel}</span>
        </div>
        {metric && (
          <div aria-hidden className="dicom pointer-events-none absolute bottom-3 left-3.5 text-ink-700/75 opacity-0 transition-opacity duration-normal group-hover:opacity-100">
            {metric.value}{metric.unit ? ` ${metric.unit}` : ''} · {metric.label}
          </div>
        )}
        <span aria-hidden className="absolute bottom-3 right-3 grid h-8 w-8 translate-y-1 place-items-center rounded-full bg-ink-900 text-white opacity-0 transition-all duration-normal ease-out group-hover:translate-y-0 group-hover:opacity-100">
          <ArrowUpRight size={15} />
        </span>
      </div>
      </TiltStage>

      <div className="flex flex-1 flex-col pt-4">
        <h3 className={cn('font-display font-medium leading-tight tracking-tight', size === 'lg' ? 'text-xl sm:text-2xl' : 'text-[17px] sm:text-lg')}>
          <Link to={`/portfolio/${product.slug}`} className="after:absolute after:inset-0 after:content-[''] focus-visible:outline-none" aria-label={t('product_card.details_aria', { name: product.name })}>
            {product.name}
          </Link>
        </h3>
        {product.tagline && <p className="mt-1.5 line-clamp-2 text-sm text-muted">{product.tagline}</p>}
      </div>

      {compare && <CompareToggle slug={product.slug} name={product.name} />}
      {/* Visible focus ring for the stretched link */}
      <span aria-hidden className="pointer-events-none absolute -inset-1.5 rounded-lg ring-2 ring-brand opacity-0 group-has-[a:focus-visible]:opacity-100" />
    </article>
  );
}

function CompareToggle({ slug, name }: { slug: string; name: string }) {
  const { t } = useTranslation();
  const { has, toggle, full } = useCompare();
  const on = has(slug);
  return (
    <button
      type="button"
      onClick={() => toggle(slug)}
      disabled={!on && full}
      aria-pressed={on}
      aria-label={`${t('product_card.compare')} ${name}`}
      className={cn(
        'absolute right-3 top-3 z-10 flex h-7 items-center gap-1 rounded-full px-2.5 font-mono text-[10px] uppercase tracking-[0.1em] transition-all duration-fast',
        on ? 'bg-ink-900 text-white' : 'bg-white/80 text-ink-800 opacity-100 shadow-sm backdrop-blur md:opacity-0 md:group-hover:opacity-100 focus-visible:opacity-100',
        'disabled:cursor-not-allowed disabled:opacity-40',
      )}
    >
      {on ? <Check size={11} /> : <Plus size={11} />}
      {on ? t('product_card.comparing') : t('product_card.compare')}
    </button>
  );
}
