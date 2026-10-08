import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { cn } from '../../lib/utils';
import { Magnetic } from '../motion/Interactive';

type Variant = 'primary' | 'solid' | 'secondary' | 'ghost';
type Size = 'sm' | 'md' | 'lg';

// Literal class names so Tailwind's content scanner keeps them (no `btn-${x}`).
const VARIANT: Record<Variant, string> = { primary: 'btn-primary', solid: 'btn-solid', secondary: 'btn-secondary', ghost: 'btn-ghost' };
const SIZE: Record<Size, string> = { sm: 'btn-sm', md: '', lg: 'btn-lg' };

interface Props {
  to?: string;
  href?: string;
  children: ReactNode;
  variant?: Variant;
  size?: Size;
  arrow?: boolean | 'external';
  className?: string;
  onClick?: () => void;
  type?: 'button' | 'submit';
  disabled?: boolean;
  'aria-label'?: string;
  /** Lean toward the cursor (primary CTAs only). */
  magnetic?: boolean;
}

/** One button component for links, external links and buttons. */
export default function Button({ magnetic, ...props }: Props) {
  const el = <ButtonInner {...props} />;
  return magnetic ? <Magnetic>{el}</Magnetic> : el;
}

function ButtonInner({ to, href, children, variant = 'primary', size = 'md', arrow, className, ...rest }: Omit<Props, 'magnetic'>) {
  const cls = cn('btn', VARIANT[variant], SIZE[size], className);
  const Icon = arrow === 'external' ? ArrowUpRight : ArrowRight;
  const inner = (
    <>
      <span>{children}</span>
      {arrow && <Icon aria-hidden size={size === 'sm' ? 14 : 16} strokeWidth={1.75} className="btn-arrow" />}
    </>
  );
  if (to) return <Link to={to} className={cls} aria-label={rest['aria-label']}>{inner}</Link>;
  if (href) {
    const external = /^https?:/.test(href);
    return <a href={href} className={cls} aria-label={rest['aria-label']} {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>{inner}</a>;
  }
  return <button type={rest.type ?? 'button'} onClick={rest.onClick} disabled={rest.disabled} aria-label={rest['aria-label']} className={cls}>{inner}</button>;
}
