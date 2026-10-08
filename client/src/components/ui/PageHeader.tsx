import type { ReactNode } from 'react';
import { MaskLines, Reveal } from '../motion/Reveal';
import Eyebrow from './Eyebrow';

/** Standard light page opener: eyebrow · display headline · lede · optional aside. */
export default function PageHeader({ eyebrow, title, titleEm, sub, aside, children }: {
  eyebrow: ReactNode; title: string; titleEm?: string; sub?: ReactNode; aside?: ReactNode; children?: ReactNode;
}) {
  return (
    <header className="bg-bg pt-[calc(var(--header-h)+3.5rem)] sm:pt-[calc(var(--header-h)+5rem)]">
      <div className="container-x grid gap-10 pb-12 lg:grid-cols-12 lg:items-end lg:pb-16">
        <div className="lg:col-span-7">
          <Reveal><Eyebrow dot>{eyebrow}</Eyebrow></Reveal>
          <MaskLines as="h1" immediate className="mt-5 font-display text-display-lg font-medium">
            <span>{title}</span>
            {titleEm && <span className="text-muted">{titleEm}</span>}
          </MaskLines>
          {sub && <Reveal delay={0.1}><p className="lede mt-6 max-w-xl">{sub}</p></Reveal>}
        </div>
        {aside && <Reveal delay={0.2} className="lg:col-span-5">{aside}</Reveal>}
      </div>
      {children}
    </header>
  );
}
