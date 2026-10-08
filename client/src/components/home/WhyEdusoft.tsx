import { useTranslation } from 'react-i18next';
import { MaskLines, Reveal, RevealGroup, RevealItem } from '../motion/Reveal';
import Eyebrow from '../ui/Eyebrow';
import { Marquee } from '../motion/Interactive';

const MARKS = ['BIS', 'NABL', 'AERB', 'CDSCO', 'ISO', 'GeM'];

export default function WhyEdusoft() {
  const { t } = useTranslation();
  const items = t('home.why.items', { returnObjects: true }) as { t: string; d: string }[];

  return (
    <section className="relative bg-bg pt-section" aria-labelledby="why-title">
      <div className="container-x">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <Reveal><Eyebrow index="07">{t('home.why.eyebrow')}</Eyebrow></Reveal>
            <MaskLines className="mt-5 font-display text-display-lg font-medium">
              <span id="why-title">{t('home.why.title')}</span>
            </MaskLines>
            <Reveal delay={0.1}><p className="lede mt-6 max-w-md">{t('home.why.sub')}</p></Reveal>
          </div>
          <RevealGroup as="ul" className="grid gap-px overflow-hidden rounded-lg bg-line sm:grid-cols-2 lg:col-span-7">
            {items.map((it, i) => (
              <RevealItem as="li" key={it.t} className="bg-bg p-7 sm:p-8">
                <p className="dicom">{String(i + 1).padStart(2, '0')}</p>
                <h3 className="mt-6 font-display text-xl">{it.t}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{it.d}</p>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </div>
      <div className="mt-20 border-y border-line py-7 sm:mt-28">
        <Marquee speed={45}>
          {[...MARKS, ...(t('home.why.band', { returnObjects: true }) as string[])].map(m => (
            <span key={m} className="flex items-center gap-10 pr-10 font-display text-[clamp(1.75rem,1.2rem+2vw,3rem)] font-medium tracking-tight text-fg/35 transition-colors hover:text-fg">
              {m}<span aria-hidden className="h-2 w-2 rounded-full bg-brand/70" />
            </span>
          ))}
        </Marquee>
      </div>
    </section>
  );
}
