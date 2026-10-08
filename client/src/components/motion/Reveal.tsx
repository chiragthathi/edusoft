import { Children, cloneElement, isValidElement, useEffect, useRef, useState, type ReactNode } from 'react';
import { motion, useInView, useReducedMotion, useScroll, useSpring, useTransform, type MotionValue } from 'framer-motion';
import { cn } from '../../lib/utils';
import { fadeUp, lineUp, stagger, viewportOnce, ease, t } from '../../lib/motion';

type Tag = 'div' | 'section' | 'ul' | 'ol' | 'li' | 'dl' | 'article' | 'header' | 'p' | 'span' | 'figure';

/** Fade-up on first entry into the viewport. */
export function Reveal({ children, className, delay = 0, as = 'div' }: { children: ReactNode; className?: string; delay?: number; as?: Tag }) {
  const reduce = useReducedMotion();
  const M = motion[as];
  if (reduce) return <M className={className}>{children}</M>;
  return (
    <M className={className} initial="hidden" whileInView="show" viewport={viewportOnce}
      variants={{ hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0, transition: { ...t.reveal, delay } } }}>
      {children}
    </M>
  );
}

/** Parent that reveals `RevealItem` children in sequence. */
export function RevealGroup({ children, className, gap = 0.08, delay = 0, as = 'div' }: { children: ReactNode; className?: string; gap?: number; delay?: number; as?: Tag }) {
  const reduce = useReducedMotion();
  const M = motion[as];
  if (reduce) return <M className={className}>{children}</M>;
  return (
    <M className={className} initial="hidden" whileInView="show" viewport={viewportOnce} variants={stagger(gap, delay)}>
      {children}
    </M>
  );
}

export function RevealItem({ children, className, as = 'div' }: { children: ReactNode; className?: string; as?: Tag }) {
  const M = motion[as];
  return <M className={className} variants={fadeUp}>{children}</M>;
}

/** Split a line (string or single-level element) into masked, animated words. */
function wordsOf(line: ReactNode, keyBase: string): ReactNode {
  const animateWords = (text: string) => text.split(/(\s+)/).map((w, i) =>
    /^\s+$/.test(w) ? w : (
      <span key={`${keyBase}-${i}`} className="inline-block overflow-hidden pb-[0.1em] -mb-[0.1em] align-top">
        <motion.span className="inline-block will-change-transform" variants={wordUp}>{w}</motion.span>
      </span>
    ));
  if (typeof line === 'string') return animateWords(line);
  if (isValidElement<{ children?: ReactNode; className?: string }>(line) && typeof line.props.children === 'string') {
    return cloneElement(line, {}, animateWords(line.props.children));
  }
  return <motion.span className="inline-block" variants={lineUp}>{line}</motion.span>;
}

const wordUp = {
  hidden: { y: '110%', opacity: 0, filter: 'blur(8px)' },
  show: { y: '0%', opacity: 1, filter: 'blur(0px)', transition: { duration: 0.9, ease: ease.out } },
};

/**
 * Headline reveal: each line is a row; each word rises from behind its own
 * mask while de-blurring, staggered across the headline.
 * `play` lets a caller hold the animation (e.g. until the intro finishes).
 */
export function MaskLines({ children, className, delay = 0, as = 'h2', immediate = false, play = true }: {
  children: ReactNode; className?: string; delay?: number; as?: 'h1' | 'h2' | 'h3' | 'p'; immediate?: boolean; play?: boolean;
}) {
  const reduce = useReducedMotion();
  const M = motion[as];
  const lines = Children.toArray(children);
  if (reduce) return <M className={className}>{lines.map((l, i) => <span key={i} className="block">{l}</span>)}</M>;
  const trigger = immediate ? { animate: play ? 'show' : 'hidden' } : { whileInView: 'show', viewport: viewportOnce };
  return (
    <M className={className} initial="hidden" {...trigger} variants={stagger(0.045, delay)}>
      {lines.map((line, i) => <span key={i} className="block">{wordsOf(line, `l${i}`)}</span>)}
    </M>
  );
}

/**
 * Exposure reveal — the Edusoft signature. A clip wipes top→bottom while a
 * thin luminous scan line leads the edge, like an X-ray exposure sweep.
 * Use on hero/key imagery only (never on every image).
 */
export function ExposureReveal({ children, className, delay = 0, immediate = false, play = true }: { children: ReactNode; className?: string; delay?: number; immediate?: boolean; play?: boolean }) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, viewportOnce);
  const run = (immediate || inView) && play;
  if (reduce) return <div className={className}>{children}</div>;
  return (
    <div ref={ref} className={cn('relative', className)}>
      <motion.div
        initial={{ clipPath: 'inset(0% 0% 100% 0%)' }}
        animate={run ? { clipPath: 'inset(0% 0% 0% 0%)' } : undefined}
        transition={{ duration: 1.25, ease: ease.inOut, delay }}
        className="h-full w-full"
      >
        {children}
      </motion.div>
      <motion.span
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 z-10 h-px bg-gradient-to-r from-transparent via-white to-transparent shadow-[0_0_18px_4px_rgb(160,205,255,0.55)]"
        initial={{ top: '0%', opacity: 0 }}
        animate={run ? { top: ['0%', '100%'], opacity: [0, 1, 1, 0] } : undefined}
        transition={{ duration: 1.25, ease: ease.inOut, delay, times: [0, 0.1, 0.85, 1] }}
      />
    </div>
  );
}

/** Scroll-linked vertical drift. `amount` in px across the element's pass. */
export function Parallax({ children, className, amount = 60 }: { children: ReactNode; className?: string; amount?: number }) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], [amount, -amount]);
  return (
    <div ref={ref} className={className}>
      <motion.div style={reduce ? undefined : { y }} className="h-full w-full will-change-transform">{children}</motion.div>
    </div>
  );
}

/** Smooth 0→1 progress of an element through the viewport. */
export function useSectionProgress(offset: ['start end' | 'start start' | 'start center', 'end start' | 'end end' | 'end center'] = ['start end', 'end start']) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset });
  const smooth = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.4 }) as MotionValue<number>;
  return { ref, progress: smooth };
}

/**
 * Count-up number. Parses leading digits (commas allowed) and preserves any
 * prefix/suffix, e.g. "4,200+", "28+", "~150", "3.5".
 */
export function Counter({ value, className, duration = 1.6 }: { value: string; className?: string; duration?: number }) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '0px 0px -10% 0px' });
  const match = value.match(/^([^\d]*)([\d,]*\.?\d+)(.*)$/);
  const [shown, setShown] = useState(match && !reduce ? match[1] + '0' + match[3] : value);

  useEffect(() => {
    if (!match || reduce || !inView) { if (inView || reduce) setShown(value); return; }
    const [, pre, num, post] = match;
    const target = parseFloat(num.replace(/,/g, ''));
    const decimals = (num.split('.')[1] || '').length;
    const useComma = num.includes(',');
    let raf = 0; const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / (duration * 1000));
      const eased = 1 - Math.pow(1 - p, 4);
      const n = target * eased;
      const txt = decimals ? n.toFixed(decimals) : Math.round(n).toLocaleString(useComma ? 'en-US' : undefined, { useGrouping: useComma });
      setShown(pre + txt + post);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView, value, reduce]);

  return <span ref={ref} className={cn('tabular', className)} aria-label={value}>{shown}</span>;
}
