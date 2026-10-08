import { useEffect, useRef, useState, type ReactNode } from 'react';
import { AnimatePresence, motion, useMotionTemplate, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform } from 'framer-motion';
import { ArrowUp } from 'lucide-react';
import { cn } from '../../lib/utils';

/** True on devices with a fine pointer that can hover (desktop mice / trackpads). */
function useFinePointer() {
  const [fine, setFine] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(hover: hover) and (pointer: fine)');
    setFine(mq.matches);
    const on = () => setFine(mq.matches);
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, []);
  return fine;
}

/**
 * Magnetic hover: the child leans toward the cursor on a spring and settles
 * back on leave. Used on primary calls to action only.
 */
export function Magnetic({ children, strength = 0.28, className }: { children: ReactNode; strength?: number; className?: string }) {
  const reduce = useReducedMotion();
  const fine = useFinePointer();
  const ref = useRef<HTMLSpanElement>(null);
  const x = useSpring(0, { stiffness: 220, damping: 18, mass: 0.4 });
  const y = useSpring(0, { stiffness: 220, damping: 18, mass: 0.4 });
  if (reduce || !fine) return <span className={cn('inline-flex', className)}>{children}</span>;
  return (
    <motion.span
      ref={ref}
      className={cn('inline-flex', className)}
      style={{ x, y }}
      onPointerMove={e => {
        const r = ref.current!.getBoundingClientRect();
        x.set((e.clientX - (r.left + r.width / 2)) * strength);
        y.set((e.clientY - (r.top + r.height / 2)) * strength);
      }}
      onPointerLeave={() => { x.set(0); y.set(0); }}
    >
      {children}
    </motion.span>
  );
}

/**
 * 3D stage: the surface tilts toward the pointer (max `tilt` degrees) and a
 * soft light follows the cursor — like sliding a film under a viewer lamp.
 */
export function TiltStage({ children, className, tilt = 4, light = true, radius = 'rounded-lg' }: { children: ReactNode; className?: string; tilt?: number; light?: boolean; radius?: string }) {
  const reduce = useReducedMotion();
  const fine = useFinePointer();
  const ref = useRef<HTMLDivElement>(null);
  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const sx = useSpring(px, { stiffness: 140, damping: 20 });
  const sy = useSpring(py, { stiffness: 140, damping: 20 });
  const rotateY = useTransform(sx, [0, 1], [-tilt, tilt]);
  const rotateX = useTransform(sy, [0, 1], [tilt, -tilt]);
  const lx = useTransform(sx, v => `${v * 100}%`);
  const ly = useTransform(sy, v => `${v * 100}%`);
  const glow = useMotionTemplate`radial-gradient(420px circle at ${lx} ${ly}, rgb(255 255 255 / 0.35), transparent 60%)`;
  const [hover, setHover] = useState(false);
  const outer = useRef<HTMLDivElement>(null);

  // Track the pointer on the nearest [data-tilt-root] (e.g. a whole card whose
  // stretched link sits above the stage), falling back to the stage itself.
  useEffect(() => {
    if (reduce || !fine) return;
    const host = (outer.current?.closest('[data-tilt-root]') as HTMLElement | null) ?? outer.current;
    if (!host) return;
    const move = (e: PointerEvent) => {
      const r = ref.current!.getBoundingClientRect();
      px.set(Math.min(1, Math.max(0, (e.clientX - r.left) / r.width)));
      py.set(Math.min(1, Math.max(0, (e.clientY - r.top) / r.height)));
    };
    const enter = () => setHover(true);
    const leave = () => { setHover(false); px.set(0.5); py.set(0.5); };
    host.addEventListener('pointermove', move);
    host.addEventListener('pointerenter', enter);
    host.addEventListener('pointerleave', leave);
    return () => { host.removeEventListener('pointermove', move); host.removeEventListener('pointerenter', enter); host.removeEventListener('pointerleave', leave); };
  }, [reduce, fine, px, py]);

  if (reduce || !fine) return <div className={className}>{children}</div>;
  return (
    <div ref={outer} className={cn('[perspective:1400px]', className)}>
      <motion.div
        ref={ref}
        className={cn('relative h-full w-full [transform-style:preserve-3d]', radius)}
        style={{ rotateX, rotateY }}
      >
        {children}
        {light && (
          <motion.div aria-hidden className="pointer-events-none absolute inset-0 rounded-[inherit] mix-blend-soft-light"
            style={{ background: glow }} animate={{ opacity: hover ? 1 : 0 }} transition={{ duration: 0.4 }} />
        )}
      </motion.div>
    </div>
  );
}

/** Hairline reading-progress indicator (used in the header). */
export function ScrollProgress({ className }: { className?: string }) {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 160, damping: 30, mass: 0.3 });
  return <motion.div aria-hidden className={cn('h-px origin-left bg-brand', className)} style={{ scaleX }} />;
}

/**
 * Floating back-to-top. Appears after the first screen; the ring shows how far
 * down the page you are.
 */
export function BackToTop({ label }: { label: string }) {
  const { scrollY, scrollYProgress } = useScroll();
  const [show, setShow] = useState(false);
  const dash = useTransform(scrollYProgress, v => `${v * 125.6} 125.6`);
  useEffect(() => scrollY.on('change', v => setShow(v > window.innerHeight * 0.9)), [scrollY]);
  return (
    <AnimatePresence>
      {show && (
        <motion.button
          type="button"
          aria-label={label}
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          initial={{ opacity: 0, scale: 0.6, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.6, y: 16 }}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.94 }}
          transition={{ type: 'spring', stiffness: 320, damping: 22 }}
          className="fixed bottom-5 right-5 z-30 grid h-12 w-12 place-items-center rounded-full bg-fg text-bg shadow-float sm:bottom-7 sm:right-7"
        >
          <svg aria-hidden viewBox="0 0 48 48" className="absolute inset-0 h-full w-full -rotate-90">
            <circle cx="24" cy="24" r="20" fill="none" stroke="currentColor" strokeOpacity="0.2" strokeWidth="1.5" />
            <motion.circle cx="24" cy="24" r="20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" style={{ strokeDasharray: dash }} />
          </svg>
          <ArrowUp size={16} strokeWidth={1.8} />
        </motion.button>
      )}
    </AnimatePresence>
  );
}

/** Infinite horizontal band; pauses on hover; static for reduced motion. */
export function Marquee({ children, className, speed = 40 }: { children: ReactNode; className?: string; speed?: number }) {
  const reduce = useReducedMotion();
  return (
    <div className={cn('group relative flex overflow-hidden mask-fade-x', className)}>
      {[0, 1].map(k => (
        <div key={k} aria-hidden={k === 1} className={cn('flex shrink-0 items-center', !reduce && 'animate-marquee group-hover:[animation-play-state:paused]')}
          style={{ animationDuration: `${speed}s` }}>
          {children}
        </div>
      ))}
    </div>
  );
}
