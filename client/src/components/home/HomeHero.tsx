import { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { AnimatePresence, motion, useInView, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { HERO_PRODUCTS } from '../../content/heroProducts';
import { cn } from '../../lib/utils';
import { ease } from '../../lib/motion';
import { MaskLines } from '../motion/Reveal';
import Picture from '../ui/Picture';
import Button from '../ui/Button';
import Eyebrow from '../ui/Eyebrow';
import { useIntro } from '../../context/Intro';
import { TiltStage } from '../motion/Interactive';

const CYCLE_MS = 6500;

/** Faint detector-panel grid + registration crosshair, drawn in SVG. */
function DetectorGrid() {
  return (
    <svg aria-hidden className="absolute inset-0 h-full w-full text-white/[0.045]" preserveAspectRatio="none">
      <defs>
        <pattern id="det" width="64" height="64" patternUnits="userSpaceOnUse">
          <path d="M64 0H0V64" fill="none" stroke="currentColor" strokeWidth="1" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#det)" />
    </svg>
  );
}

export default function HomeHero() {
  const { t } = useTranslation();
  const reduce = useReducedMotion();
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [cycleKey, setCycleKey] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);
  const product = HERO_PRODUCTS[active];
  const { done: introDone } = useIntro();
  const heroInView = useInView(sectionRef, { amount: 0.25 });
  const [tabVisible, setTabVisible] = useState(true);
  const running = !reduce && !paused && introDone && heroInView && tabVisible;
  useEffect(() => {
    const on = () => setTabVisible(document.visibilityState === 'visible');
    document.addEventListener('visibilitychange', on);
    return () => document.removeEventListener('visibilitychange', on);
  }, []);

  // Scroll-away: stage recedes as the next section arrives (no scroll-jacking).
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end start'] });
  const stageY = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const stageOpacity = useTransform(scrollYProgress, [0, 1], [1, 0.5]);
  const textY = useTransform(scrollYProgress, [0, 1], [0, -60]);

  const select = useCallback((i: number) => { setActive(i); setCycleKey(k => k + 1); }, []);

  useEffect(() => {
    if (!running) return;
    const id = window.setTimeout(() => select((active + 1) % HERO_PRODUCTS.length), CYCLE_MS);
    return () => window.clearTimeout(id);
  }, [active, running, select, cycleKey]);

  return (
    <section
      ref={sectionRef}
      data-tone="ink"
      aria-label={t('hero.eyebrow')}
      className="relative isolate flex min-h-[100svh] flex-col overflow-hidden bg-bg pt-[var(--header-h)]"
    >
      {/* Atmosphere: grid, spotlight, grain, horizon line */}
      <DetectorGrid />
      <motion.div aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_55%_at_70%_45%,rgb(64_120_190/0.28),transparent_70%)]"
        animate={reduce ? undefined : { x: [0, -30, 10, 0], y: [0, 20, -10, 0] }} transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }} />
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(35%_40%_at_70%_50%,rgb(220_232_245/0.10),transparent_70%)]" />
      <div aria-hidden className="grain pointer-events-none absolute inset-0 opacity-[0.05] mix-blend-screen" />
      <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-bg to-transparent" />

      <div className="container-x relative grid flex-1 items-center gap-10 py-10 lg:grid-cols-12 lg:gap-6 lg:py-0">
        {/* Copy */}
        <motion.div style={reduce ? undefined : { y: textY }} className="relative z-10 lg:col-span-6">
          <motion.div initial={{ opacity: 0 }} animate={introDone ? { opacity: 1 } : undefined} transition={{ duration: 0.8, delay: 0.1 }}>
            <Eyebrow dot>{t('hero.eyebrow')}</Eyebrow>
          </motion.div>
          <MaskLines as="h1" immediate play={introDone} delay={0.15} className="mt-6 font-display text-[clamp(2.75rem,1rem+4.4vw,4.25rem)] font-medium leading-[0.98] tracking-[-0.045em] text-fg">
            <span>{t('hero.line1')}</span>
            <span className="text-fg/55">{t('hero.line2')}</span>
          </MaskLines>
          <motion.p
            initial={{ opacity: 0, y: 16 }} animate={introDone ? { opacity: 1, y: 0 } : undefined} transition={{ duration: 0.8, delay: 0.65, ease: ease.out }}
            className="mt-7 max-w-[34rem] text-lede text-muted"
          >
            {t('hero.sub')}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 16 }} animate={introDone ? { opacity: 1, y: 0 } : undefined} transition={{ duration: 0.8, delay: 0.8, ease: ease.out }}
            className="mt-9 flex flex-wrap gap-3"
          >
            <Button to="/portfolio" size="lg" arrow magnetic>{t('hero.cta_primary')}</Button>
            <Button to="/contact?type=quote" size="lg" variant="secondary" magnetic>{t('hero.cta_secondary')}</Button>
          </motion.div>
        </motion.div>

        {/* Product stage */}
        <motion.div
          style={reduce ? undefined : { y: stageY, opacity: stageOpacity }}
          className="relative lg:col-span-6"
          onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}
          onFocusCapture={() => setPaused(true)} onBlurCapture={() => setPaused(false)}
        >
          <TiltStage tilt={5} light={false} className="mx-auto w-full max-w-[44rem]">
          <motion.div className="relative aspect-[5/4] w-full [transform-style:preserve-3d]" initial={{ opacity: 0, scale: 0.96 }} animate={introDone ? { opacity: 1, scale: 1 } : undefined} transition={{ duration: 1.2, delay: 0.3, ease: ease.out }}>
            {/* Stage frame + crop marks */}
            <div aria-hidden className="absolute inset-[4%] rounded-lg border border-white/[0.07]" />
            {['left-[4%] top-[4%] border-l border-t', 'right-[4%] top-[4%] border-r border-t', 'bottom-[4%] left-[4%] border-b border-l', 'bottom-[4%] right-[4%] border-b border-r'].map(c => (
              <span key={c} aria-hidden className={cn('absolute h-5 w-5 border-white/40', c)} />
            ))}
            {/* Floor glow */}
            <div aria-hidden className="absolute inset-x-[18%] bottom-[14%] h-[10%] rounded-[50%] bg-[radial-gradient(closest-side,rgb(150_190_240/0.35),transparent)] blur-md" />

            {/* All products stay mounted (and preloaded); only the active one is shown.
                Nothing mounts/unmounts on change, so a throttled background tab
                can never leave the stage on a half-finished, invisible layer. */}
            {HERO_PRODUCTS.map((p, i) => {
              const on = i === active;
              return (
                <motion.div
                  key={p.slug}
                  aria-hidden={!on}
                  className={cn('absolute inset-[12%] flex items-center justify-center', on ? 'z-[2]' : 'pointer-events-none z-[1]')}
                  initial={false}
                  animate={reduce
                    ? { opacity: on ? 1 : 0 }
                    : on
                      ? { opacity: 1, clipPath: ['inset(0% 0% 100% 0%)', 'inset(0% 0% 0% 0%)'], filter: ['brightness(1.8) blur(0px)', 'brightness(1) blur(0px)'], scale: 1 }
                      : { opacity: 0, clipPath: 'inset(0% 0% 0% 0%)', filter: 'brightness(1) blur(6px)', scale: 0.97 }}
                  transition={on
                    ? { duration: 1.1, ease: ease.inOut }
                    : { duration: 0.6, ease: ease.inOut }}
                  style={{ translateZ: 60 }}
                >
                  <Link to={`/portfolio/${p.slug}`} tabIndex={on ? 0 : -1} className="group relative block h-full w-full" aria-label={`${t('hero.view')}: ${p.name}`}>
                    <Picture image={p.image} alt={p.name} priority={i === 0} sizes="(min-width:1024px) 40vw, 80vw"
                      className="h-full w-full drop-shadow-[0_30px_40px_rgb(0,0,0,0.55)]" />
                  </Link>
                </motion.div>
              );
            })}

            {/* Exposure scan line on change */}
            {!reduce && (
              <motion.span
                key={`scan-${cycleKey}-${active}`}
                aria-hidden
                className="pointer-events-none absolute inset-x-[4%] z-10 h-px bg-gradient-to-r from-transparent via-sky-100 to-transparent shadow-[0_0_24px_6px_rgb(150,200,255,0.45)]"
                initial={{ top: '12%', opacity: 0 }}
                animate={{ top: ['12%', '88%'], opacity: [0, 1, 1, 0] }}
                transition={{ duration: 1.1, ease: ease.inOut, times: [0, 0.1, 0.85, 1] }}
              />
            )}

            {/* DICOM readouts */}
            <AnimatePresence mode="wait" initial={false}>
              <motion.div key={product.slug} aria-hidden className="dicom pointer-events-none absolute inset-[6.5%] text-white/60 [transform:translateZ(25px)]"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5, delay: 0.35 }}>
                <div className="absolute left-0 top-0">{product.readout.tl.map(l => <div key={l}>{l}</div>)}</div>
                <div className="absolute right-0 top-0 text-right">{product.readout.tr.map(l => <div key={l}>{l}</div>)}</div>
                <div className="absolute bottom-0 left-0">{product.readout.bl.map(l => <div key={l}>{l}</div>)}</div>
                <div className="absolute bottom-0 right-0 text-right">{product.readout.br.map(l => <div key={l}>{l}</div>)}</div>
              </motion.div>
            </AnimatePresence>
          </motion.div>
          </TiltStage>

          {/* Selector */}
          <div role="tablist" aria-label={t('hero.select')} className="mx-auto mt-2 grid max-w-[44rem] grid-cols-4 gap-2 px-[4%]">
            {HERO_PRODUCTS.map((p, i) => (
              <button
                key={p.slug}
                role="tab"
                aria-selected={i === active}
                onClick={() => select(i)}
                className="group flex flex-col gap-2.5 pt-3 text-left"
              >
                <span className="relative h-px w-full overflow-hidden bg-white/15">
                  {i === active && (
                    <motion.span
                      key={`bar-${cycleKey}`}
                      className="absolute inset-y-0 left-0 bg-white"
                      initial={{ width: running ? '0%' : '100%' }}
                      animate={{ width: '100%' }}
                      transition={{ duration: running ? CYCLE_MS / 1000 : 0, ease: 'linear' }}
                    />
                  )}
                </span>
                <span className={cn('font-mono text-[10px] uppercase tracking-[0.14em] transition-colors', i === active ? 'text-white' : 'text-white/40 group-hover:text-white/70')}>
                  {String(i + 1).padStart(2, '0')} {t(`hero.slots.${p.slot}`)}
                </span>
              </button>
            ))}
          </div>
          <Link to={`/portfolio/${product.slug}`} className="mx-auto mt-5 hidden max-w-[44rem] items-center gap-1.5 px-[4%] text-sm text-white/70 transition-colors hover:text-white lg:flex">
            <span className="dicom text-white/40">{t('hero.showing')}</span>
            <span>{product.name}</span>
            <ArrowUpRight size={14} aria-hidden />
          </Link>
        </motion.div>
      </div>

      {/* Scroll cue */}
      <div aria-hidden className="container-x relative hidden pb-8 lg:block">
        <div className="flex items-center gap-3 text-white/35">
          <span className="relative h-10 w-px overflow-hidden bg-white/15">
            <span className="absolute inset-x-0 top-0 h-1/2 animate-scan-y bg-white/70" />
          </span>
          <span className="dicom text-white/40">{t('hero.scroll')}</span>
        </div>
      </div>
    </section>
  );
}
