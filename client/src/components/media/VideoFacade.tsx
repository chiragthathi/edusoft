import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Play } from 'lucide-react';
import { cn } from '../../lib/utils';

/**
 * Click-to-load YouTube (privacy-enhanced domain). Nothing from YouTube —
 * no iframe, script or cookie — loads until the visitor presses play.
 * Poster is YouTube's own thumbnail (hqdefault always exists).
 */
export default function VideoFacade({ id, title, className }: { id: string; title: string; className?: string }) {
  const { t } = useTranslation();
  const [on, setOn] = useState(false);
  return (
    <div className={cn('relative aspect-video overflow-hidden rounded-xl bg-ink-900', className)}>
      {on ? (
        <iframe
          className="absolute inset-0 h-full w-full"
          src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0&modestbranding=1`}
          title={title}
          allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      ) : (
        <button type="button" onClick={() => setOn(true)} className="group absolute inset-0 h-full w-full" aria-label={`${t('common.watch_video')}: ${title}`}>
          <img src={`https://i.ytimg.com/vi/${id}/hqdefault.jpg`} alt="" loading="lazy" className="h-full w-full object-cover opacity-70 transition-[opacity,transform] duration-slow ease-out group-hover:scale-[1.03] group-hover:opacity-85" />
          <span aria-hidden className="absolute inset-0 bg-gradient-to-t from-ink-950/80 via-ink-950/10 to-transparent" />
          <span className="absolute left-6 top-6 grid h-16 w-16 place-items-center rounded-full bg-white text-ink-950 shadow-float transition-transform duration-normal ease-spring group-hover:scale-110 sm:left-8 sm:top-8">
            <Play size={22} className="translate-x-0.5" fill="currentColor" />
          </span>
          <span className="absolute bottom-6 left-6 right-6 text-left text-white sm:bottom-8 sm:left-8">
            <span className="block font-display text-2xl">{title}</span>
            <span className="dicom mt-1 block text-white/60">{t('common.video_consent')}</span>
          </span>
        </button>
      )}
    </div>
  );
}
