import { cn } from '../../lib/utils';

/**
 * Official Edusoft raster logo (from edusofthealth.com). `tone="light"` renders
 * it solid white for dark surfaces; `auto` follows the current theme.
 */
export default function Logo({ tone = 'auto', className }: { tone?: 'auto' | 'dark' | 'light'; className?: string }) {
  return (
    <img
      src="/media/s/logo-303.webp"
      alt="Edusoft Healthcare"
      width={303}
      height={71}
      className={cn(
        'h-8 w-auto select-none transition-[filter] duration-normal',
        tone === 'light' && 'brightness-0 invert',
        tone === 'auto' && 'dark:brightness-0 dark:invert',
        className,
      )}
      draggable={false}
    />
  );
}
