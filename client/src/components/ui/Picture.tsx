import { useState } from 'react';
import { cn } from '../../lib/utils';
import type { MediaImage } from '../../lib/types';

interface PictureProps {
  image: Pick<MediaImage, 'src' | 'widths' | 'w' | 'h'> & Partial<Pick<MediaImage, 'bg' | 'lqip'>>;
  alt: string;
  /** CSS `sizes` — describe the rendered width so the browser picks the right file. */
  sizes?: string;
  className?: string;
  imgClassName?: string;
  fit?: 'contain' | 'cover';
  priority?: boolean;
  /** Multiply-blend white backgrounds into a light stage (auto for bg === 'white'). */
  blend?: boolean;
}

/**
 * Responsive <picture>: AVIF → WebP, srcset across generated widths, lazy by
 * default, intrinsic size set to prevent layout shift, optional LQIP blur.
 */
export default function Picture({ image, alt, sizes = '100vw', className, imgClassName, fit = 'contain', priority, blend }: PictureProps) {
  const [loaded, setLoaded] = useState(false);
  const set = (fmt: string) => image.widths.map(w => `${image.src}-${w}.${fmt} ${w}w`).join(', ');
  const fallback = `${image.src}-${image.widths[image.widths.length - 1]}.webp`;
  const multiply = blend ?? image.bg === 'white';

  return (
    <picture className={cn('relative block', className)}>
      <source type="image/avif" srcSet={set('avif')} sizes={sizes} />
      <source type="image/webp" srcSet={set('webp')} sizes={sizes} />
      {image.lqip && !loaded && (
        <img src={image.lqip} alt="" aria-hidden className={cn('absolute inset-0 h-full w-full scale-105 blur-xl', fit === 'cover' ? 'object-cover' : 'object-contain', multiply && 'on-white')} />
      )}
      <img
        src={fallback}
        alt={alt}
        width={image.w}
        height={image.h}
        loading={priority ? 'eager' : 'lazy'}
        decoding={priority ? 'sync' : 'async'}
        {...(priority ? { fetchPriority: 'high' as const } : {})}
        onLoad={() => setLoaded(true)}
        className={cn(
          'relative h-full w-full transition-opacity duration-slow ease-out',
          fit === 'cover' ? 'object-cover' : 'object-contain',
          multiply && 'on-white',
          image.lqip && !loaded ? 'opacity-0' : 'opacity-100',
          imgClassName,
        )}
      />
    </picture>
  );
}
