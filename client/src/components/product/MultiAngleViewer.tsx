import { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useInView, useReducedMotion } from 'framer-motion';
import { MoveHorizontal } from 'lucide-react';
import type { MediaImage } from '../../lib/types';
import { cn } from '../../lib/utils';

/**
 * Frame-sequence product viewer (360° / multi-angle).
 *
 * - Pointer drag + touch swipe, with inertia after release
 * - Keyboard: ←/→ step, Home/End (ARIA slider semantics)
 * - Progressive loading: frame 0 eagerly; the rest decode in the background
 *   once the viewer is near the viewport, so N frames never block the page
 * - Works for 4 real angles today and 36/72-frame turntable sets later
 *   (see docs/360_SYSTEM.md). Pass real photography only.
 */
export default function MultiAngleViewer({ frames, alt, label, className, pixelsPerFrame }: {
  frames: MediaImage[];
  alt: string;
  label: string;
  className?: string;
  pixelsPerFrame?: number;
}) {
  const { t } = useTranslation();
  const reduce = useReducedMotion();
  const n = frames.length;
  const root = useRef<HTMLDivElement>(null);
  const inView = useInView(root, { margin: '200px 0px' });
  const [index, setIndex] = useState(0);
  const [loaded, setLoaded] = useState<boolean[]>(() => frames.map((_, i) => i === 0));
  const [hinted, setHinted] = useState(false);
  const pos = useRef(0);              // continuous position in frames
  const vel = useRef(0);              // frames per ms
  const drag = useRef<{ x: number; t: number; start: number } | null>(null);
  const raf = useRef(0);
  const ppf = pixelsPerFrame ?? (n <= 8 ? 90 : 12); // few frames → longer drag per step

  const frameUrl = (f: MediaImage, w = 640) => {
    const width = f.widths.find(x => x >= w) ?? f.widths[f.widths.length - 1];
    return `${f.src}-${width}.webp`;
  };

  // Progressive preload once near the viewport.
  useEffect(() => {
    if (!inView) return;
    let cancelled = false;
    frames.forEach((f, i) => {
      if (i === 0) return;
      const img = new Image();
      img.decoding = 'async';
      img.src = frameUrl(f);
      img.decode().catch(() => {}).finally(() => {
        if (!cancelled) setLoaded(l => { const c = [...l]; c[i] = true; return c; });
      });
    });
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView]);

  const show = useCallback((p: number) => {
    pos.current = p;
    const i = ((Math.round(p) % n) + n) % n;
    setIndex(i);
  }, [n]);

  // One gentle rotation to signal interactivity.
  useEffect(() => {
    if (!inView || hinted || reduce || n < 2 || !loaded.every(Boolean)) return;
    setHinted(true);
    let step = 0;
    const id = window.setInterval(() => {
      step += 1;
      show(step);
      if (step >= n) window.clearInterval(id);
    }, n <= 8 ? 420 : 45);
    return () => window.clearInterval(id);
  }, [inView, hinted, reduce, n, loaded, show]);

  const glide = useCallback(() => {
    cancelAnimationFrame(raf.current);
    let last = performance.now();
    const tick = (now: number) => {
      const dt = now - last; last = now;
      vel.current *= Math.pow(0.992, dt);          // friction
      if (Math.abs(vel.current) < 0.0006) { show(Math.round(pos.current)); return; }
      show(pos.current + vel.current * dt);
      raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
  }, [show]);

  useEffect(() => () => cancelAnimationFrame(raf.current), []);

  const onPointerDown = (e: React.PointerEvent) => {
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
    cancelAnimationFrame(raf.current);
    drag.current = { x: e.clientX, t: performance.now(), start: pos.current };
    vel.current = 0;
  };
  const onPointerMove = (e: React.PointerEvent) => {
    const d = drag.current; if (!d) return;
    const now = performance.now();
    const next = d.start - (e.clientX - d.x) / ppf;
    const dt = Math.max(1, now - d.t);
    vel.current = (next - pos.current) / dt;
    d.t = now;
    show(next);
  };
  const onPointerUp = () => {
    if (!drag.current) return;
    drag.current = null;
    if (!reduce) glide(); else show(Math.round(pos.current));
  };

  const onKey = (e: React.KeyboardEvent) => {
    const map: Record<string, number> = { ArrowRight: 1, ArrowLeft: -1 };
    if (e.key in map) { e.preventDefault(); show(Math.round(pos.current) + map[e.key]); }
    if (e.key === 'Home') { e.preventDefault(); show(0); }
    if (e.key === 'End') { e.preventDefault(); show(n - 1); }
  };

  const ready = loaded.filter(Boolean).length;

  return (
    <div ref={root} className={cn('lightbox relative select-none', className)}>
      <div
        role="slider"
        tabIndex={0}
        aria-label={label}
        aria-valuemin={1}
        aria-valuemax={n}
        aria-valuenow={index + 1}
        aria-valuetext={t('product_detail.image_of', { n: index + 1, total: n })}
        onKeyDown={onKey}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        className="absolute inset-0 cursor-grab touch-pan-y active:cursor-grabbing"
      >
        {frames.map((f, i) => (
          // All frames stacked; only the current one is visible → no reflow while rotating.
          <img
            key={f.src}
            src={i === 0 || loaded[i] || inView ? frameUrl(f, 960) : undefined}
            alt={i === 0 ? alt : ''}
            aria-hidden={i !== index}
            draggable={false}
            width={f.w}
            height={f.h}
            loading={i === 0 ? 'eager' : 'lazy'}
            className={cn('absolute inset-0 h-full w-full object-contain p-[9%]', i === index ? 'opacity-100' : 'opacity-0')}
          />
        ))}
      </div>

      {/* Angle scale — like a gantry position readout */}
      <div aria-hidden className="pointer-events-none absolute inset-x-[12%] bottom-5 flex items-center gap-1">
        {frames.map((_, i) => (
          <span key={i} className={cn('h-[3px] flex-1 rounded-full transition-colors duration-fast', i === index ? 'bg-ink-800' : 'bg-ink-800/15')} />
        ))}
      </div>
      <div aria-hidden className="dicom pointer-events-none absolute left-4 top-3.5 text-ink-700/80">
        {label} · {String(index + 1).padStart(2, '0')}/{String(n).padStart(2, '0')}
      </div>
      <div aria-hidden className="pointer-events-none absolute right-4 top-3 flex items-center gap-1.5 rounded-full bg-white/70 px-2.5 py-1 font-mono text-[10px] text-ink-800 backdrop-blur">
        <MoveHorizontal size={12} /> {t('product_detail.viewer_hint')}
        {ready < n && <span className="text-ink-700/60">· {Math.round((ready / n) * 100)}%</span>}
      </div>
    </div>
  );
}
