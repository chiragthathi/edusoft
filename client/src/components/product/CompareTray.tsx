import { useTranslation } from 'react-i18next';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import type { ProductSummary } from '../../lib/types';
import { useCompare, COMPARE_MAX } from '../../context/Compare';
import { ease } from '../../lib/motion';
import Button from '../ui/Button';
import Picture from '../ui/Picture';

/** Floating tray listing products queued for comparison. */
export default function CompareTray({ products }: { products: ProductSummary[] }) {
  const { t } = useTranslation();
  const { items, remove, clear } = useCompare();
  const picked = items.map(s => products.find(p => p.slug === s)).filter(Boolean) as ProductSummary[];

  return (
    <AnimatePresence>
      {picked.length > 0 && (
        <motion.div
          role="region"
          aria-label={t('portfolio_page.compare_tray')}
          initial={{ y: 120, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 120, opacity: 0 }}
          transition={{ duration: 0.45, ease: ease.out }}
          className="fixed inset-x-0 bottom-4 z-30 px-gutter pb-[env(safe-area-inset-bottom)]"
        >
          <div data-tone="ink" className="mx-auto flex max-w-3xl items-center gap-3 rounded-full bg-bg/95 p-2 pl-5 shadow-float ring-1 ring-line backdrop-blur-xl">
            <span className="dicom hidden shrink-0 sm:block">{t('portfolio_page.compare_tray')} {picked.length}/{COMPARE_MAX}</span>
            <ul className="flex min-w-0 flex-1 gap-2 overflow-x-auto no-scrollbar">
              {picked.map(p => (
                <li key={p.slug} className="flex shrink-0 items-center gap-2 rounded-full bg-fg/[0.07] py-1 pl-1 pr-2">
                  <span className="lightbox h-8 w-8 rounded-full">{p.images[0] && <Picture image={p.images[0]} alt="" sizes="32px" className="h-full w-full p-1" />}</span>
                  <span className="max-w-[9rem] truncate text-xs">{p.name}</span>
                  <button type="button" onClick={() => remove(p.slug)} aria-label={`${t('compare_page.remove')} ${p.name}`} className="grid h-5 w-5 place-items-center rounded-full text-muted hover:bg-fg/10 hover:text-fg">
                    <X size={12} />
                  </button>
                </li>
              ))}
            </ul>
            <button type="button" onClick={clear} className="hidden shrink-0 px-2 text-xs text-muted hover:text-fg sm:block">{t('portfolio_page.compare_clear')}</button>
            <Button to={`/portfolio/compare?items=${picked.map(p => p.slug).join(',')}`} size="sm" variant="solid" arrow className="shrink-0" disabled={picked.length < 2}>
              {t('portfolio_page.compare_go')}
            </Button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
