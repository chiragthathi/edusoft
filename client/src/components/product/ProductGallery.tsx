import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { MediaImage } from '../../lib/types';
import { cn } from '../../lib/utils';
import { ease } from '../../lib/motion';
import Picture from '../ui/Picture';

/** Stage + thumbnails. Swipe on touch, arrows on keyboard, crossfade between frames. */
export default function ProductGallery({ images, name }: { images: MediaImage[]; name: string }) {
  const { t } = useTranslation();
  const reduce = useReducedMotion();
  const [i, setI] = useState(0);
  const [dir, setDir] = useState(1);
  const touch = useRef<number | null>(null);
  const n = images.length;
  const go = (next: number) => { setDir(next > i ? 1 : -1); setI((next + n) % n); };
  const img = images[i];
  const photo = img.bg === 'photo';

  return (
    <div>
      <div
        className={cn('relative aspect-[4/3] overflow-hidden', photo ? 'rounded-lg bg-surface-2' : 'lightbox')}
        onKeyDown={e => { if (e.key === 'ArrowRight') go(i + 1); if (e.key === 'ArrowLeft') go(i - 1); }}
        onTouchStart={e => { touch.current = e.touches[0].clientX; }}
        onTouchEnd={e => {
          if (touch.current == null) return;
          const dx = e.changedTouches[0].clientX - touch.current;
          if (Math.abs(dx) > 40) go(i + (dx < 0 ? 1 : -1));
          touch.current = null;
        }}
        tabIndex={n > 1 ? 0 : -1}
        role="group"
        aria-roledescription="carousel"
        aria-label={`${name} — ${t('product_detail.image_of', { n: i + 1, total: n })}`}
      >
        <AnimatePresence initial={false} custom={dir} mode="popLayout">
          <motion.div
            key={img.src}
            custom={dir}
            initial={reduce ? { opacity: 0 } : { opacity: 0, x: dir * 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, x: dir * -40 }}
            transition={{ duration: 0.5, ease: ease.out }}
            className="absolute inset-0"
          >
            <Picture image={img} alt={`${name} — ${t(`media_kind.${img.kind}`, { defaultValue: '' })}`} fit={photo ? 'cover' : 'contain'} priority={i === 0}
              sizes="(min-width:1024px) 58vw, 100vw" className={cn('h-full w-full', !photo && 'p-[8%]')} />
          </motion.div>
        </AnimatePresence>
        <div aria-hidden className={cn('dicom pointer-events-none absolute left-4 top-3.5', photo ? 'text-white/80' : 'text-ink-700/80')}>
          {t(`media_kind.${img.kind}`, { defaultValue: img.kind })} · {String(i + 1).padStart(2, '0')}/{String(n).padStart(2, '0')}
        </div>
        {n > 1 && (
          <div className="absolute bottom-4 right-4 flex gap-2">
            <button type="button" onClick={() => go(i - 1)} aria-label={t('product_detail.prev_image')} className="grid h-10 w-10 place-items-center rounded-full bg-white/85 text-ink-900 shadow-sm backdrop-blur transition hover:bg-white"><ChevronLeft size={18} /></button>
            <button type="button" onClick={() => go(i + 1)} aria-label={t('product_detail.next_image')} className="grid h-10 w-10 place-items-center rounded-full bg-white/85 text-ink-900 shadow-sm backdrop-blur transition hover:bg-white"><ChevronRight size={18} /></button>
          </div>
        )}
      </div>

      {n > 1 && (
        <ul className="no-scrollbar mt-3 flex gap-2 overflow-x-auto">
          {images.map((m, k) => (
            <li key={m.src} className="shrink-0">
              <button type="button" onClick={() => go(k)} aria-label={t('product_detail.image_of', { n: k + 1, total: n })} aria-current={k === i}
                className={cn('lightbox block h-16 w-20 rounded-sm transition-[box-shadow,opacity] duration-fast sm:h-20 sm:w-24', k === i ? 'ring-2 ring-fg' : 'opacity-60 hover:opacity-100')}>
                <Picture image={m} alt="" sizes="96px" fit={m.bg === 'photo' ? 'cover' : 'contain'} className={cn('h-full w-full', m.bg !== 'photo' && 'p-1.5')} />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
