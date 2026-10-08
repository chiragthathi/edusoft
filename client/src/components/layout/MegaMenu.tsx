import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import type { Category, ProductSummary } from '../../lib/types';
import { cn } from '../../lib/utils';
import { ease } from '../../lib/motion';
import Lightbox from '../ui/Lightbox';

const GROUPS = ['imaging', 'digital', 'output', 'specialty'] as const;

export default function MegaMenu({ categories, products, onNavigate }: {
  categories: Category[];
  products: ProductSummary[];
  onNavigate: () => void;
}) {
  const { t } = useTranslation();
  const [active, setActive] = useState(categories[0]?.id);
  const cat = categories.find(c => c.id === active) ?? categories[0];
  const inCat = useMemo(() => products.filter(p => p.category === cat?.id), [products, cat]);

  if (!cat) return null;

  return (
    <div className="container-x grid grid-cols-12 gap-8 py-8">
      {/* Category index */}
      <nav aria-label={t('nav.products_menu')} className="col-span-7 grid grid-cols-2 gap-x-8 gap-y-7 xl:col-span-6">
        {GROUPS.map(g => {
          const cats = categories.filter(c => c.group === g);
          if (!cats.length) return null;
          return (
            <div key={g}>
              <p className="eyebrow mb-3">{t(`nav.groups.${g}`)}</p>
              <ul className="space-y-0.5">
                {cats.map(c => (
                  <li key={c.id}>
                    <Link
                      to={`/portfolio?category=${c.id}`}
                      onClick={onNavigate}
                      onMouseEnter={() => setActive(c.id)}
                      onFocus={() => setActive(c.id)}
                      className={cn(
                        'group -mx-3 flex items-center justify-between rounded-sm px-3 py-2 text-[15px] transition-colors duration-fast',
                        active === c.id ? 'bg-fg/[0.05] text-fg' : 'text-muted hover:text-fg',
                      )}
                    >
                      <span>{c.label}</span>
                      <span className="font-mono text-[10px] tabular-nums text-subtle">{String(c.count).padStart(2, '0')}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </nav>

      {/* Live preview */}
      <div className="col-span-5 xl:col-span-6">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={cat.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.28, ease: ease.out }}
            className="grid h-full grid-cols-1 gap-6 xl:grid-cols-[1.1fr_1fr]"
          >
            <Lightbox
              image={cat.heroImage}
              alt={cat.label}
              sizes="320px"
              className="aspect-[4/3] xl:aspect-auto xl:h-full"
              annotations={{ tl: cat.label, br: `${String(cat.count).padStart(2, '0')} · SYSTEMS` }}
            />
            <div className="flex flex-col">
              <p className="font-display text-xl leading-snug">{cat.tagline}</p>
              <ul className="mt-4 space-y-1">
                {inCat.slice(0, 5).map(p => (
                  <li key={p.slug}>
                    <Link to={`/portfolio/${p.slug}`} onClick={onNavigate} className="group flex items-baseline justify-between gap-3 py-1 text-sm text-muted transition-colors hover:text-fg">
                      <span className="truncate">{p.name}</span>
                      <ArrowRight size={13} className="shrink-0 -translate-x-1 opacity-0 transition-all duration-fast group-hover:translate-x-0 group-hover:opacity-100" aria-hidden />
                    </Link>
                  </li>
                ))}
              </ul>
              <Link to={`/portfolio?category=${cat.id}`} onClick={onNavigate} className="link mt-auto self-start pt-4 text-sm font-medium">
                {t('nav.view_all_in', { category: cat.label })}
              </Link>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
