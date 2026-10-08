import type { ReactNode } from 'react';
import { cn } from '../../lib/utils';

/** Technical section label: "01 — Product ecosystem". */
export default function Eyebrow({ index, children, className, dot }: { index?: string; children: ReactNode; className?: string; dot?: boolean }) {
  return (
    <p className={cn('eyebrow', className)}>
      {dot && <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-signal animate-dot-pulse" />}
      {index && <span className="eyebrow-index">{index}</span>}
      {index && <span aria-hidden className="h-px w-6 bg-current opacity-40" />}
      <span>{children}</span>
    </p>
  );
}
