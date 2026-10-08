import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';
import { ease } from '../../lib/motion';

/** Sticky in-page navigation with scroll-spy. */
export default function LocalNav({ items, label, action }: { items: { id: string; label: string }[]; label: string; action?: React.ReactNode }) {
  const [active, setActive] = useState(items[0]?.id);

  useEffect(() => {
    const obs = new IntersectionObserver(entries => {
      const visible = entries.filter(e => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
      if (visible[0]) setActive(visible[0].target.id);
    }, { rootMargin: '-30% 0px -60% 0px' });
    items.forEach(i => { const el = document.getElementById(i.id); if (el) obs.observe(el); });
    return () => obs.disconnect();
  }, [items]);

  return (
    <div className="sticky top-[var(--header-h)] z-20 border-b border-line bg-bg/85 backdrop-blur-xl">
      <div className="container-x flex h-14 items-center gap-6">
        <nav aria-label={label} className="no-scrollbar -mx-2 flex flex-1 gap-1 overflow-x-auto">
          {items.map(i => (
            <a key={i.id} href={`#${i.id}`} aria-current={active === i.id ? 'location' : undefined}
              className={cn('relative shrink-0 rounded-full px-3 py-1.5 text-sm transition-colors', active === i.id ? 'text-fg' : 'text-muted hover:text-fg')}>
              {active === i.id && <motion.span layoutId="localnav" className="absolute inset-0 rounded-full bg-fg/[0.07]" transition={{ duration: 0.35, ease: ease.out }} />}
              <span className="relative">{i.label}</span>
            </a>
          ))}
        </nav>
        {action && <div className="hidden shrink-0 sm:block">{action}</div>}
      </div>
    </div>
  );
}
