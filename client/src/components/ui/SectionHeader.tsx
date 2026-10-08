import type { ReactNode } from 'react';
import { cn } from '../../lib/utils';
import { MaskLines, Reveal } from '../motion/Reveal';
import Eyebrow from './Eyebrow';

/** Editorial section header: eyebrow · masked headline · optional lede and action. */
export default function SectionHeader({ index, eyebrow, title, sub, action, align = 'split', className, as = 'h2' }: {
  index?: string;
  eyebrow: ReactNode;
  title: ReactNode;
  sub?: ReactNode;
  action?: ReactNode;
  align?: 'split' | 'stack' | 'center';
  className?: string;
  as?: 'h1' | 'h2';
}) {
  return (
    <header className={cn(
      'mb-12 grid gap-6 sm:mb-16',
      align === 'split' && 'lg:grid-cols-12 lg:items-end',
      align === 'center' && 'mx-auto max-w-3xl text-center justify-items-center',
      className,
    )}>
      <div className={cn(align === 'split' && 'lg:col-span-7')}>
        <Reveal><Eyebrow index={index}>{eyebrow}</Eyebrow></Reveal>
        <MaskLines as={as} className="mt-5 type-h1">{title}</MaskLines>
      </div>
      {(sub || action) && (
        <Reveal delay={0.15} className={cn('flex flex-col gap-6', align === 'split' && 'lg:col-span-4 lg:col-start-9', align === 'center' && 'items-center')}>
          {sub && <p className="lede max-w-prose">{sub}</p>}
          {action}
        </Reveal>
      )}
    </header>
  );
}
