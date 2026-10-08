import type { ReactNode } from 'react';
import { cn } from '../../lib/utils';
import type { MediaImage } from '../../lib/types';
import Picture from './Picture';

/**
 * The product stage: a luminous porcelain panel (film-viewer motif) that
 * makes every product photo — transparent cut-out or white-background JPEG —
 * read as the same studio. Optional DICOM-style corner annotations.
 */
export default function Lightbox({ image, alt, sizes, className, pad = 'p-[9%]', priority, annotations, children }: {
  image?: MediaImage | null;
  alt: string;
  sizes?: string;
  className?: string;
  pad?: string;
  priority?: boolean;
  annotations?: { tl?: ReactNode; tr?: ReactNode; bl?: ReactNode; br?: ReactNode };
  children?: ReactNode;
}) {
  return (
    <div className={cn('lightbox', className)}>
      {image ? (
        <Picture image={image} alt={alt} sizes={sizes} priority={priority} className={cn('h-full w-full', pad)} />
      ) : (
        <div className="grid h-full w-full place-items-center p-8 text-center font-display text-lg text-ink-700">{alt}</div>
      )}
      {annotations && (
        <div aria-hidden className="pointer-events-none absolute inset-0 p-3.5 sm:p-4 text-ink-700 [&_.dicom]:text-ink-700/80">
          {annotations.tl && <div className="dicom absolute left-3.5 top-3 sm:left-4 sm:top-3.5">{annotations.tl}</div>}
          {annotations.tr && <div className="dicom absolute right-3.5 top-3 hidden text-right sm:right-4 sm:top-3.5 sm:block">{annotations.tr}</div>}
          {annotations.bl && <div className="dicom absolute bottom-3 left-3.5 hidden sm:bottom-3.5 sm:left-4 sm:block">{annotations.bl}</div>}
          {annotations.br && <div className="dicom absolute bottom-3 right-3.5 text-right sm:bottom-3.5 sm:right-4">{annotations.br}</div>}
        </div>
      )}
      {children}
    </div>
  );
}
