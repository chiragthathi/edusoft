import { cloneElement, isValidElement, useId, type ReactElement, type ReactNode } from 'react';
import { AlertCircle, ChevronDown } from 'lucide-react';
import { cn } from '../../lib/utils';

/**
 * Label + control + hint + error, wired for assistive tech: the control gets
 * id, aria-invalid and aria-describedby automatically.
 */
export function Field({ label, hint, error, required, optionalLabel, children, className }: {
  label: string;
  hint?: ReactNode;
  error?: string;
  required?: boolean;
  optionalLabel?: string;
  children: ReactElement<Record<string, unknown>>;
  className?: string;
}) {
  const id = useId();
  const hintId = hint ? `${id}-hint` : undefined;
  const errId = error ? `${id}-err` : undefined;
  const control = isValidElement(children)
    ? cloneElement(children, {
        id,
        'aria-invalid': error ? true : undefined,
        'aria-describedby': [hintId, errId].filter(Boolean).join(' ') || undefined,
        'aria-required': required || undefined,
      })
    : children;

  return (
    <div className={cn('field', className)}>
      <label htmlFor={id} className="field-label flex items-baseline justify-between gap-3">
        <span>{label}{required && <span aria-hidden className="ml-0.5 text-danger">*</span>}</span>
        {!required && optionalLabel && <span className="text-xs font-normal text-subtle">{optionalLabel}</span>}
      </label>
      {control}
      {hint && !error && <p id={hintId} className="field-hint">{hint}</p>}
      {error && <p id={errId} role="alert" className="field-error"><AlertCircle size={13} aria-hidden />{error}</p>}
    </div>
  );
}

/** Native select with the design-system chevron (keeps mobile pickers). */
export function SelectControl({ className, children, ...rest }: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <div className="relative">
      <select {...rest} className={cn('control', className)}>{children}</select>
      <ChevronDown size={16} aria-hidden className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-muted" />
    </div>
  );
}
