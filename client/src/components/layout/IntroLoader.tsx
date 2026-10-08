import { useEffect, useState } from 'react';
import { AnimatePresence, animate, motion, useMotionValue, useReducedMotion, useTransform } from 'framer-motion';
import { useIntro } from '../../context/Intro';
import { ease } from '../../lib/motion';

const TOTAL = 5; // seconds, as requested — logo sequence before the site opens
const STATUS = ['Calibrating detector', 'Warming generator', 'Loading image chain', 'System ready'];

/**
 * Opening sequence, staged like an exposure:
 *  crop marks draw → scan line sweeps and exposes the logo → readout counts
 *  to 100 → the panel lifts away to reveal the page.
 */
export default function IntroLoader() {
  const { done, finish } = useIntro();
  const reduce = useReducedMotion();
  const progress = useMotionValue(0);
  const pct = useTransform(progress, v => String(Math.round(v)).padStart(3, '0'));
  const bar = useTransform(progress, v => `${v}%`);
  const [status, setStatus] = useState(0);

  useEffect(() => {
    if (done) return;
    document.body.style.overflow = 'hidden';
    const duration = reduce ? 1 : TOTAL - 0.9; // leave time for the exit lift
    const ctrl = animate(progress, 100, { duration, ease: [0.45, 0, 0.2, 1] });
    const unsub = progress.on('change', v => setStatus(Math.min(STATUS.length - 1, Math.floor(v / 26))));
    const timer = window.setTimeout(finish, duration * 1000 + 150);
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') finish(); };
    window.addEventListener('keydown', onKey);
    return () => { ctrl.stop(); unsub(); window.clearTimeout(timer); window.removeEventListener('keydown', onKey); document.body.style.overflow = ''; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [done]);

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          key="intro"
          role="status"
          aria-label="Loading Edusoft Healthcare"
          className="fixed inset-0 z-[100] flex items-center justify-center bg-[#05080D] text-white"
          exit={reduce ? { opacity: 0 } : { clipPath: 'inset(0% 0% 100% 0%)' }}
          transition={{ duration: 0.8, ease: ease.inOut }}
        >
          {/* detector grid */}
          <div aria-hidden className="absolute inset-0 opacity-[0.05] [background-image:linear-gradient(white_1px,transparent_1px),linear-gradient(90deg,white_1px,transparent_1px)] [background-size:64px_64px]" />
          <div aria-hidden className="absolute inset-0 bg-[radial-gradient(40%_40%_at_50%_50%,rgb(64_120_190/0.28),transparent_70%)]" />

          {/* frame + crop marks */}
          <motion.div aria-hidden className="absolute inset-[6%] rounded-xl border border-white/10"
            initial={{ opacity: 0, scale: 1.04 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1, ease: ease.out }} />
          {['left-[6%] top-[6%] border-l border-t', 'right-[6%] top-[6%] border-r border-t', 'bottom-[6%] left-[6%] border-b border-l', 'bottom-[6%] right-[6%] border-b border-r'].map((c, i) => (
            <motion.span key={c} aria-hidden className={`absolute h-6 w-6 border-white/60 ${c}`}
              initial={{ opacity: 0, scale: 0.4 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6, delay: 0.1 + i * 0.08, ease: ease.out }} />
          ))}

          {/* readouts */}
          <motion.div aria-hidden className="dicom absolute left-[8%] top-[8%] text-white/55" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
            EDUSOFT HEALTHCARE<br />Medical imaging technology
          </motion.div>
          <motion.div aria-hidden className="dicom absolute right-[8%] top-[8%] text-right text-white/55" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
            kV 40–150 · mA 10–1000<br />Bharosemand Medical Co.
          </motion.div>
          <motion.div aria-hidden className="dicom absolute bottom-[8%] left-[8%] text-white/55" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}>
            <AnimatePresence mode="wait">
              <motion.span key={status} className="block" initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} transition={{ duration: 0.25 }}>
                {STATUS[status]}
              </motion.span>
            </AnimatePresence>
          </motion.div>

          {/* logo exposure */}
          <div className="relative flex flex-col items-center">
            <div className="relative overflow-hidden px-2 py-3">
              {/* latent image (faint) */}
              <img src="/media/s/logo-303.webp" alt="" aria-hidden className="h-12 w-auto opacity-[0.08] brightness-0 invert sm:h-16" />
              {/* exposed image */}
              <motion.img
                src="/media/s/logo-303.webp" alt="Edusoft Healthcare"
                className="absolute inset-0 m-auto h-12 w-auto brightness-0 invert sm:h-16"
                initial={{ clipPath: 'inset(0% 100% 0% 0%)', filter: 'brightness(0) invert(1) drop-shadow(0 0 0px rgba(150,200,255,0))' }}
                animate={{ clipPath: 'inset(0% 0% 0% 0%)', filter: 'brightness(0) invert(1) drop-shadow(0 0 18px rgba(150,200,255,0.55))' }}
                transition={{ duration: reduce ? 0.3 : 2.2, delay: reduce ? 0 : 0.8, ease: ease.inOut }}
              />
              {/* scan line */}
              {!reduce && (
                <motion.span aria-hidden className="absolute inset-y-0 w-px bg-sky-100 shadow-[0_0_24px_6px_rgba(150,200,255,0.6)]"
                  initial={{ left: '0%', opacity: 0 }} animate={{ left: ['0%', '100%'], opacity: [0, 1, 1, 0] }}
                  transition={{ duration: 2.2, delay: 0.8, ease: ease.inOut, times: [0, 0.08, 0.9, 1] }} />
              )}
            </div>

            <motion.p className="mt-6 font-mono text-[11px] uppercase tracking-[0.32em] text-white/50"
              initial={{ opacity: 0, letterSpacing: '0.6em' }} animate={{ opacity: 1, letterSpacing: '0.32em' }} transition={{ duration: 1.4, delay: 1.6, ease: ease.out }}>
              Clarity at every point of care
            </motion.p>

            {/* progress */}
            <div className="mt-10 flex w-56 items-center gap-4 sm:w-72">
              <div className="relative h-px flex-1 overflow-hidden bg-white/15">
                <motion.span className="absolute inset-y-0 left-0 bg-white" style={{ width: bar }} />
              </div>
              <motion.span className="w-9 text-right font-mono text-[11px] tabular-nums text-white/70">{pct}</motion.span>
            </div>
          </div>

        </motion.div>
      )}
    </AnimatePresence>
  );
}
