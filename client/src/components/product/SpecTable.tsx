import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AnimatePresence, motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import type { SpecGroup } from '../../lib/types';
import { cn } from '../../lib/utils';
import { ease } from '../../lib/motion';

/**
 * Grouped specifications as semantic tables. Every group starts open on
 * large screens; on phones only the first is open so the page stays scannable.
 */
export default function SpecTable({ groups }: { groups: SpecGroup[] }) {
  const { t } = useTranslation();
  const initial = typeof window !== 'undefined' && window.matchMedia('(min-width: 768px)').matches;
  const [open, setOpen] = useState<boolean[]>(() => groups.map((_, i) => initial || i === 0));
  const allOpen = open.every(Boolean);

  return (
    <div>
      <div className="mb-4 flex justify-end">
        <button type="button" onClick={() => setOpen(groups.map(() => !allOpen))} className="link text-sm text-muted">
          {allOpen ? t('product_detail.collapse_all') : t('product_detail.expand_all')}
        </button>
      </div>
      <div className="border-t border-line">
        {groups.map((g, gi) => {
          const id = `spec-${gi}`;
          return (
            <section key={g.title} className="border-b border-line" aria-labelledby={`${id}-h`}>
              <h3 id={`${id}-h`}>
                <button type="button" aria-expanded={open[gi]} aria-controls={id}
                  onClick={() => setOpen(o => o.map((v, k) => (k === gi ? !v : v)))}
                  className="flex w-full items-center justify-between gap-4 py-5 text-left">
                  <span className="flex items-baseline gap-4">
                    <span className="font-mono text-[11px] text-subtle">{String(gi + 1).padStart(2, '0')}</span>
                    <span className="font-display text-lg font-medium">{g.title}</span>
                  </span>
                  <Plus size={18} strokeWidth={1.5} aria-hidden className={cn('shrink-0 text-muted transition-transform duration-normal ease-out', open[gi] && 'rotate-45')} />
                </button>
              </h3>
              <AnimatePresence initial={false}>
                {open[gi] && (
                  <motion.div id={id} initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.4, ease: ease.out }} className="overflow-hidden">
                    <table className="mb-6 w-full text-[15px]">
                      <caption className="sr-only">{g.title}</caption>
                      <tbody>
                        {g.rows.map(([k, v]) => (
                          <tr key={k} className="border-t border-line first:border-t-0">
                            <th scope="row" className="w-[42%] py-3 pr-6 text-left align-top font-normal text-muted">{k}</th>
                            <td className="py-3 align-top tabular-nums text-fg">{v}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </motion.div>
                )}
              </AnimatePresence>
            </section>
          );
        })}
      </div>
    </div>
  );
}
