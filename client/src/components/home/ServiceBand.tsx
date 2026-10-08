import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { Phone } from 'lucide-react';
import { STORY } from '../../content/storyMedia';
import { Counter, MaskLines, Reveal, RevealGroup, RevealItem } from '../motion/Reveal';
import Eyebrow from '../ui/Eyebrow';
import Button from '../ui/Button';
import Picture from '../ui/Picture';

/** Service lifecycle as a timeline whose rail draws as you scroll. */
export default function ServiceBand({ index = '06', cta = true }: { index?: string; cta?: boolean }) {
  const { t } = useTranslation();
  const reduce = useReducedMotion();
  const steps = t('home.service.steps', { returnObjects: true }) as { t: string; d: string }[];
  const ref = useRef<HTMLOListElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 85%', 'end 55%'] });
  const scaleX = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <section data-tone="ink" className="section-y relative overflow-hidden bg-bg" aria-labelledby="service-title">
      <div className="container-x relative">
        <header className="mb-16 grid gap-12 lg:mb-24 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-6">
            <Reveal><Eyebrow index={index}>{t('home.service.eyebrow')}</Eyebrow></Reveal>
            <MaskLines className="mt-5 font-display text-display-lg font-medium"><span id="service-title">{t('home.service.title')}</span></MaskLines>
            <Reveal delay={0.1}><p className="lede mt-6 max-w-md">{t('home.service.sub')}</p></Reveal>
            <Reveal delay={0.2} className="mt-9 flex flex-wrap items-center gap-4">
              {cta && <Button to="/services" variant="solid" arrow magnetic>{t('home.service.cta')}</Button>}
              <Button to="/contact?type=support" variant="secondary">{t('services_page.request_title')}</Button>
            </Reveal>
          </div>

          {/* Service facts (published figures) */}
          <RevealGroup as="dl" className="grid grid-cols-2 gap-3 lg:col-span-6" gap={0.1}>
            <RevealItem className="relative col-span-2 overflow-hidden rounded-lg bg-surface p-7 ring-1 ring-line sm:p-8">
              <div aria-hidden className="absolute inset-0 opacity-[0.06] [background-image:linear-gradient(white_1px,transparent_1px),linear-gradient(90deg,white_1px,transparent_1px)] [background-size:32px_32px]" />
              <dt className="dicom relative">{t('home.service.facts.amc')}</dt>
              <dd className="relative mt-4 flex items-baseline gap-2 font-display">
                <span className="text-muted">{t('home.service.facts.upto')}</span>
                <Counter value="10" className="text-[clamp(3.5rem,2.5rem+3vw,5.5rem)] leading-none tracking-[-0.05em]" />
                <span className="text-2xl text-muted">{t('home.service.facts.years')}</span>
              </dd>
              <p className="relative mt-3 max-w-sm text-sm text-muted">{t('home.service.facts.amc_body')}</p>
            </RevealItem>
            <RevealItem className="rounded-lg bg-surface p-6 ring-1 ring-line">
              <dt className="dicom">{t('home.service.facts.network')}</dt>
              <dd className="mt-4 font-display text-4xl tracking-tight"><Counter value="13" /></dd>
              <p className="mt-2 text-xs text-muted">{t('home.service.facts.network_body')}</p>
            </RevealItem>
            <RevealItem className="rounded-lg bg-brand p-6 text-on-brand">
              <dt className="dicom text-on-brand/70">{t('home.service.facts.line')}</dt>
              <dd className="mt-4"><a href="tel:1800120280280" className="flex items-center gap-2 font-display text-xl tabular-nums tracking-tight sm:text-2xl"><Phone size={18} aria-hidden />1800-120-280-280</a></dd>
              <p className="mt-2 text-xs text-on-brand/75">{t('home.service.facts.line_body')}</p>
            </RevealItem>
          </RevealGroup>
        </header>

        <div className="relative">
          <span aria-hidden className="absolute left-0 right-0 top-[7px] hidden h-px bg-white/12 lg:block" />
          <motion.span aria-hidden style={reduce ? undefined : { scaleX }} className="absolute left-0 right-0 top-[7px] hidden h-px origin-left bg-white lg:block" />
          <RevealGroup as="ol" className="grid gap-10 sm:grid-cols-2 lg:grid-cols-5 lg:gap-8" gap={0.1}>
            {steps.map((s, i) => (
              <RevealItem as="li" key={s.t} className="relative border-l border-line pl-6 lg:border-l-0 lg:pl-0 lg:pt-10">
                <span aria-hidden className="absolute -left-[4.5px] top-1 h-2 w-2 rounded-full bg-white ring-4 ring-bg lg:left-0 lg:top-[3px]" />
                <p className="dicom">{String(i + 1).padStart(2, '0')}</p>
                <h3 className="mt-2 font-display text-xl">{s.t}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted">{s.d}</p>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>

        {/* Product-in-use pair: the only people shots in the product library */}
        <div className="mt-20 grid grid-cols-2 gap-3 lg:mt-28 lg:grid-cols-12">
          <div className="reg-marks relative aspect-square overflow-hidden rounded-lg bg-white lg:col-span-4 lg:col-start-6">
            <Picture image={STORY.mobileInUse} alt={t('home.settings.items.0.title') as string} fit="cover" sizes="(min-width:1024px) 30vw, 48vw" className="h-full w-full" />
          </div>
          <div className="reg-marks relative aspect-square overflow-hidden rounded-lg bg-white lg:col-span-3">
            <Picture image={STORY.mobileInUse2} alt={t('home.settings.items.0.title') as string} fit="cover" sizes="(min-width:1024px) 22vw, 48vw" className="h-full w-full" />
          </div>
        </div>
      </div>
    </section>
  );
}
