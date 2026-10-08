import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AnimatePresence, motion, useInView, useReducedMotion } from 'framer-motion';
import { ArrowLeft, ArrowRight, Pause } from 'lucide-react';
import { TESTIMONIALS } from '../../content/testimonials';
import { cn } from '../../lib/utils';
import { ease } from '../../lib/motion';
import { Reveal } from '../motion/Reveal';
import Eyebrow from '../ui/Eyebrow';

const INTERVAL = 7; // seconds per statement

const initials = (who: string) => who.replace(/^Dr\.?\s*/i, '').split(/[\s,]+/).filter(w => /^[A-Z]/.test(w)).slice(0, 2).map(w => w[0]).join('');

/**
 * Customer statements (real, as published) on an auto-advancing timer with
 * story-style progress bars. Runs only while visible; pauses on hover/focus.
 */
export default function Voices({ index = '09' }: { index?: string }) {
  const { t } = useTranslation();
  const reduce = useReducedMotion();
  const [i, setI] = useState(0);
  const [dir, setDir] = useState(1);
  const [cycle, setCycle] = useState(0);
  const [hold, setHold] = useState(false);
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { margin: '-15% 0px -15% 0px' });
  const running = inView && !hold && !reduce;
  const n = TESTIMONIALS.length;
  const q = TESTIMONIALS[i];

  const go = (next: number, d = next > i ? 1 : -1) => { setDir(d); setI((next + n) % n); setCycle(c => c + 1); };

  useEffect(() => {
    if (!running) return;
    const id = window.setTimeout(() => go(i + 1, 1), INTERVAL * 1000);
    return () => window.clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i, running, cycle]);

  const words = q.quote.split(' ');

  return (
    <section ref={ref} className="section-y relative overflow-hidden bg-bg" aria-labelledby="voices-title" aria-roledescription="carousel"
      onMouseEnter={() => setHold(true)} onMouseLeave={() => setHold(false)} onFocusCapture={() => setHold(true)} onBlurCapture={() => setHold(false)}>
      <div className="container-x grid gap-10 lg:grid-cols-12">
        <div className="flex flex-col justify-between gap-8 lg:col-span-3">
          <div>
            <Reveal><Eyebrow index={index}>{t('home.voices.eyebrow')}</Eyebrow></Reveal>
            <h2 id="voices-title" className="mt-5 font-display text-display-sm font-medium">{t('home.voices.title')}</h2>
          </div>
          <div className="flex items-center gap-3">
            <button type="button" onClick={() => go(i - 1, -1)} aria-label={t('common.previous')}
              className="grid h-11 w-11 place-items-center rounded-full shadow-hairline transition-colors hover:bg-fg hover:text-bg"><ArrowLeft size={17} /></button>
            <button type="button" onClick={() => go(i + 1, 1)} aria-label={t('common.next')}
              className="grid h-11 w-11 place-items-center rounded-full shadow-hairline transition-colors hover:bg-fg hover:text-bg"><ArrowRight size={17} /></button>
            <span className="dicom ml-2 tabular-nums">{String(i + 1).padStart(2, '0')} / {String(n).padStart(2, '0')}</span>
          </div>
        </div>

        <div className="lg:col-span-9">
          {/* story-style timers */}
          <div className="mb-10 flex gap-1.5" role="tablist" aria-label={t('home.voices.eyebrow')}>
            {TESTIMONIALS.map((tm, k) => (
              <button key={tm.who} role="tab" aria-selected={k === i} aria-label={tm.who} onClick={() => go(k)} className="group flex-1 py-2">
                <span className="relative block h-[2px] overflow-hidden rounded-full bg-fg/12 transition-colors group-hover:bg-fg/25">
                  {k < i && <span className="absolute inset-0 bg-fg/60" />}
                  {k === i && (
                    <motion.span key={cycle} className="absolute inset-0 origin-left bg-fg"
                      initial={{ scaleX: 0 }} animate={{ scaleX: running ? 1 : 0.02 }}
                      transition={{ duration: running ? INTERVAL : 0.3, ease: 'linear' }} />
                  )}
                </span>
              </button>
            ))}
          </div>

          <div className="relative min-h-[19rem] sm:min-h-[16rem]" aria-live="polite">
            <span aria-hidden className="pointer-events-none absolute -left-2 -top-10 font-display text-[9rem] leading-none text-brand/15 sm:-left-6 sm:-top-14 sm:text-[12rem]">“</span>
            <AnimatePresence mode="wait" custom={dir}>
              <motion.figure key={i} className="relative"
                initial="hidden" animate="show" exit="exit"
                variants={{
                  hidden: {},
                  show: { transition: { staggerChildren: reduce ? 0 : 0.018 } },
                  exit: { opacity: 0, x: dir * -24, filter: 'blur(4px)', transition: { duration: 0.35, ease: ease.inOut } },
                }}>
                <blockquote className="font-display text-display-sm font-normal leading-[1.32] tracking-[-0.02em] text-fg">
                  {words.map((w, k) => (
                    <motion.span key={k} className="inline-block"
                      variants={{ hidden: { opacity: 0, y: 10, filter: 'blur(6px)' }, show: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.5, ease: ease.out } } }}>
                      {w}&nbsp;
                    </motion.span>
                  ))}
                </blockquote>
                <motion.figcaption className="mt-10 flex items-center gap-4"
                  variants={{ hidden: { opacity: 0, y: 8 }, show: { opacity: 1, y: 0, transition: { duration: 0.5, delay: 0.3, ease: ease.out } } }}>
                  <span aria-hidden className="grid h-11 w-11 place-items-center rounded-full bg-fg text-[13px] font-medium text-bg">{initials(q.who)}</span>
                  <span>
                    <span className="block font-medium">{q.who}</span>
                    <span className="dicom">{q.product}</span>
                  </span>
                </motion.figcaption>
              </motion.figure>
            </AnimatePresence>
          </div>
          <p aria-hidden className={cn('dicom mt-6 flex items-center gap-1.5 transition-opacity', hold && inView ? 'opacity-100' : 'opacity-0')}>
            <Pause size={11} /> {t('common.paused')}
          </p>
        </div>
      </div>
    </section>
  );
}
