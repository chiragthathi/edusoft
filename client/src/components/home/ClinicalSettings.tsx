import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { AnimatePresence, motion, useInView, useReducedMotion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import type { ProductSummary } from '../../lib/types';
import { cn } from '../../lib/utils';
import { ease } from '../../lib/motion';
import SectionHeader from '../ui/SectionHeader';
import Lightbox from '../ui/Lightbox';
import Picture from '../ui/Picture';
import { TiltStage } from '../motion/Interactive';

interface Setting { id: string; title: string; body: string; products: string[] }

const INTERVAL = 6; // seconds per care setting

/**
 * Care settings → the systems built for them. Auto-advances on a visible
 * timer while on screen; pauses on hover/focus; accessible tabs with roving focus.
 */
export default function ClinicalSettings({ products }: { products: ProductSummary[] }) {
  const { t } = useTranslation();
  const reduce = useReducedMotion();
  const settings = t('home.settings.items', { returnObjects: true }) as Setting[];
  const [active, setActive] = useState(0);
  const [cycle, setCycle] = useState(0);        // restarts the timer on manual choice
  const [hold, setHold] = useState(false);
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { margin: '-20% 0px -20% 0px' });
  const running = inView && !hold && !reduce;

  const s = settings[active];
  const list = s.products.map(slug => products.find(p => p.slug === slug)).filter(Boolean) as ProductSummary[];
  const lead = list[0];

  const go = (i: number) => { setActive((i + settings.length) % settings.length); setCycle(c => c + 1); };

  useEffect(() => {
    if (!running) return;
    const id = window.setTimeout(() => go(active + 1), INTERVAL * 1000);
    return () => window.clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, running, cycle]);

  const onKey = (e: React.KeyboardEvent) => {
    const step = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[e.key];
    if (!step) return;
    e.preventDefault();
    const next = (active + step + settings.length) % settings.length;
    go(next);
    document.getElementById(`setting-tab-${next}`)?.focus();
  };

  /** Timer fill — restarts on each change; frozen while paused. */
  const Timer = ({ className }: { className: string }) => (
    <motion.span
      key={`${active}-${cycle}`}
      aria-hidden
      className={className}
      initial={{ scaleX: 0 }}
      animate={{ scaleX: running ? 1 : 0 }}
      transition={{ duration: running ? INTERVAL : 0.3, ease: 'linear' }}
      style={{ originX: 0 }}
    />
  );

  return (
    <section ref={ref} className="section-y bg-surface" aria-labelledby="settings-title"
      onMouseEnter={() => setHold(true)} onMouseLeave={() => setHold(false)}
      onFocusCapture={() => setHold(true)} onBlurCapture={() => setHold(false)}>
      <div className="container-x">
        <SectionHeader index="05" eyebrow={t('home.settings.eyebrow')} title={<span id="settings-title">{t('home.settings.title')}</span>} />

        <div className="grid gap-10 lg:grid-cols-12">
          {/* Tabs */}
          <div role="tablist" aria-orientation="vertical" onKeyDown={onKey}
            className="no-scrollbar -mx-gutter flex gap-2 overflow-x-auto px-gutter lg:col-span-4 lg:mx-0 lg:flex-col lg:gap-0 lg:overflow-visible lg:px-0">
            {settings.map((st, i) => {
              const on = i === active;
              return (
                <button
                  key={st.id}
                  id={`setting-tab-${i}`}
                  role="tab"
                  aria-selected={on}
                  aria-controls="setting-panel"
                  tabIndex={on ? 0 : -1}
                  onClick={() => go(i)}
                  className={cn(
                    'group relative shrink-0 overflow-hidden text-left transition-colors duration-normal',
                    // mobile pill
                    'h-10 rounded-full px-4 text-[13px] font-medium shadow-[inset_0_0_0_1px_rgb(var(--line-strong)/var(--line-strong-a))]',
                    on ? 'text-fg' : 'text-muted hover:text-fg',
                    // desktop row
                    'lg:h-auto lg:rounded-none lg:px-0 lg:py-6 lg:shadow-none lg:border-b lg:border-line',
                  )}
                >
                  {/* mobile: timer fill inside the active pill */}
                  {on && <Timer className="absolute inset-0 bg-brand/15 lg:hidden" />}
                  <span className="relative flex items-center gap-5 lg:pl-5">
                    {/* desktop: active bar */}
                    <motion.span aria-hidden className="absolute -left-px top-1/2 hidden h-8 w-[2px] -translate-y-1/2 rounded-full bg-brand lg:block"
                      initial={false} animate={{ scaleY: on ? 1 : 0, opacity: on ? 1 : 0 }} transition={{ duration: 0.4, ease: ease.out }} />
                    <span className={cn('hidden font-mono text-[11px] tabular-nums transition-colors lg:inline', on ? 'text-brand' : 'text-subtle')}>
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span className={cn('lg:font-display lg:text-[1.375rem] lg:tracking-tight lg:transition-transform lg:duration-normal lg:ease-out', on ? 'lg:translate-x-1' : 'lg:group-hover:translate-x-1')}>
                      {st.title}
                    </span>
                  </span>
                  {/* desktop: timer line under the active row */}
                  {on && <Timer className="absolute inset-x-0 -bottom-px hidden h-px bg-fg lg:block" />}
                </button>
              );
            })}
          </div>

          {/* Panel */}
          <div id="setting-panel" role="tabpanel" aria-labelledby={`setting-tab-${active}`} className="lg:col-span-8">
            <AnimatePresence mode="wait">
              <motion.div key={s.id}
                initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.985, filter: 'blur(6px)' }}
                animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                exit={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.99, filter: 'blur(4px)' }}
                transition={{ duration: 0.5, ease: ease.out }}
                className="grid gap-6 md:grid-cols-5">
                <TiltStage className="md:col-span-3">
                  <Lightbox image={lead?.images[0]} alt={lead?.name ?? s.title} sizes="(min-width:1024px) 40vw, 90vw" className="aspect-[4/3.4]"
                    annotations={lead ? { tl: s.title, br: lead.name } : undefined} />
                </TiltStage>
                <div className="flex flex-col md:col-span-2">
                  <p className="text-lede text-fg">{s.body}</p>
                  <motion.ul className="mt-8 divide-y divide-line border-y border-line md:mt-auto"
                    initial="hidden" animate="show" variants={{ hidden: {}, show: { transition: { staggerChildren: 0.07, delayChildren: 0.15 } } }}>
                    {list.map(p => (
                      <motion.li key={p.slug} variants={{ hidden: { opacity: 0, x: 12 }, show: { opacity: 1, x: 0, transition: { duration: 0.45, ease: ease.out } } }}>
                        <Link to={`/portfolio/${p.slug}`} className="group flex items-center gap-4 py-3.5">
                          <span className="lightbox h-14 w-14 shrink-0 rounded-sm transition-transform duration-normal ease-out group-hover:scale-105">
                            {p.images[0] && <Picture image={p.images[0]} alt="" sizes="56px" className="h-full w-full p-1.5" />}
                          </span>
                          <span className="min-w-0 flex-1">
                            <span className="block truncate text-[15px] font-medium">{p.name}</span>
                            <span className="block truncate text-xs text-muted">{p.categoryLabel}</span>
                          </span>
                          <ArrowUpRight size={16} className="text-muted transition-transform duration-fast group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-fg" aria-hidden />
                        </Link>
                      </motion.li>
                    ))}
                  </motion.ul>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
