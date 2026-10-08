import { useEffect, useRef, useState, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { AnimatePresence, motion, useInView } from 'framer-motion';
import { STORY } from '../../content/storyMedia';
import { cn } from '../../lib/utils';
import { ease } from '../../lib/motion';
import SectionHeader from '../ui/SectionHeader';
import Eyebrow from '../ui/Eyebrow';
import Lightbox from '../ui/Lightbox';
import Picture from '../ui/Picture';

interface Step { k: string; title: string; body: string; stat: string; statLabel: string }

const MEDIA = [STORY.generate, STORY.capture, STORY.process, STORY.deliver];
const CAPTIONS: [ReactNode, ReactNode][] = [
  ['50 kW Motorized Mobile', 'HF 270 kHz · 300 kHU'],
  ['ERAY Gold 100', '100 μm · 4.2k × 4.2k · IP56'],
  ['PACS · DICOM 3.0', 'Edusoft IAS'],
  ['TRIMAX TX65', '650 ppi · 160 films/h'],
];

/**
 * Sticky storytelling for the image chain. The left column stays pinned and
 * crossfades copy as each media panel on the right crosses the viewport
 * centre. Native scrolling only — nothing is hijacked.
 */
export default function TechStory() {
  const { t } = useTranslation();
  const steps = t('home.tech.steps', { returnObjects: true }) as Step[];
  const [active, setActive] = useState(0);

  return (
    <section data-tone="ink" className="section-y relative bg-bg" aria-label={t('home.tech.title')}>
      <div aria-hidden className="grain pointer-events-none absolute inset-0 opacity-[0.04] mix-blend-screen" />
      <div className="container-x relative">
        <div className="lg:hidden">
          <SectionHeader index="03" eyebrow={t('home.tech.eyebrow')} title={t('home.tech.title')} sub={t('home.tech.sub')} />
        </div>

        <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
          {/* Pinned narrative (desktop): headline, progress and copy travel together */}
          <div className="hidden lg:col-span-5 lg:block">
            <div className="sticky top-[calc(var(--header-h)+3rem)]">
              <Eyebrow index="03">{t('home.tech.eyebrow')}</Eyebrow>
              <h2 id="tech-title" className="mt-5 font-display text-display-md font-medium">{t('home.tech.title')}</h2>
              <ol className="mb-10 mt-10 flex gap-2" aria-hidden>
                {steps.map((s, i) => (
                  <li key={s.k} className="flex-1">
                    <span className="block h-px bg-white/15">
                      <motion.span className="block h-px bg-white" animate={{ width: i <= active ? '100%' : '0%' }} transition={{ duration: 0.6, ease: ease.out }} />
                    </span>
                    <span className={cn('mt-3 block font-mono text-[10px] uppercase tracking-[0.14em] transition-colors', i === active ? 'text-white' : 'text-white/35')}>
                      {String(i + 1).padStart(2, '0')} {s.k}
                    </span>
                  </li>
                ))}
              </ol>
              <div className="relative min-h-[19rem]">
                <AnimatePresence mode="wait">
                  <motion.div key={active} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.45, ease: ease.out }}>
                    <h3 className="font-display text-display-sm text-fg">{steps[active]?.title}</h3>
                    <p className="mt-5 max-w-md text-lede text-muted">{steps[active]?.body}</p>
                    <div className="mt-10 flex items-baseline gap-4 border-t border-line pt-6">
                      <span className="font-display text-[3.5rem] font-normal leading-none tracking-[-0.04em]">{steps[active]?.stat}</span>
                      <span className="dicom">{steps[active]?.statLabel}</span>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* Media panels */}
          <div className="space-y-6 lg:col-span-7 lg:space-y-[18vh] lg:py-[8vh]">
            {steps.map((s, i) => (
              <Panel key={s.k} index={i} step={s} onActive={() => setActive(i)} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Panel({ index, step, onActive }: { index: number; step: Step; onActive: () => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: '-45% 0px -45% 0px' });
  useEffect(() => { if (inView) onActive(); }, [inView, onActive]);
  const img = MEDIA[index];
  const [c1, c2] = CAPTIONS[index];

  return (
    <div ref={ref}>
      {img.bg === 'photo' ? (
        <div className="reg-marks relative aspect-[5/4] overflow-hidden rounded-lg bg-surface ring-1 ring-line">
          <Picture image={img} alt={typeof c1 === 'string' ? c1 : ''} fit="cover" sizes="(min-width:1024px) 55vw, 100vw" className="h-full w-full" imgClassName="opacity-90" />
          <div className="dicom absolute bottom-4 left-4 text-white/80">{c1}<br />{c2}</div>
        </div>
      ) : (
        <Lightbox image={img} alt={typeof c1 === 'string' ? c1 : ''} sizes="(min-width:1024px) 55vw, 100vw" className="aspect-[5/4]" pad="p-[12%]" annotations={{ tl: <>{c1}</>, br: <>{c2}</> }} />
      )}
      {/* Mobile copy under each panel */}
      <div className="mt-6 lg:hidden">
        <p className="dicom text-white/60">{String(index + 1).padStart(2, '0')} · {step.k}</p>
        <h3 className="mt-3 font-display text-display-sm">{step.title}</h3>
        <p className="mt-3 text-muted">{step.body}</p>
        <p className="mt-5 flex items-baseline gap-3 border-t border-line pt-4">
          <span className="font-display text-3xl tracking-tight">{step.stat}</span>
          <span className="dicom">{step.statLabel}</span>
        </p>
      </div>
    </div>
  );
}
