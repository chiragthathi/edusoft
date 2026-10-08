import { useTranslation } from 'react-i18next';
import { siteImage } from '../../content/storyMedia';
import { Counter, ExposureReveal, RevealGroup, RevealItem } from '../motion/Reveal';
import SectionHeader from '../ui/SectionHeader';
import Picture from '../ui/Picture';

// State installation reports published by Edusoft (HITES programme).
const STATES = [
  { state: 'Odisha', units: '76', img: 'install-odisha' as const },
  { state: 'Uttar Pradesh', units: '63', img: 'install-up' as const },
  { state: 'Meghalaya', units: '27', img: 'install-meghalaya' as const },
  { state: 'Telangana', units: '25', img: 'install-telangana' as const },
];

export default function Deployments() {
  const { t } = useTranslation();
  const countries = t('home.presence.countries', { returnObjects: true }) as string[];

  return (
    <section className="section-y bg-surface" aria-labelledby="presence-title">
      <div className="container-x">
        <SectionHeader index="08" eyebrow={t('home.presence.eyebrow')} title={<span id="presence-title">{t('home.presence.title')}</span>} />

        <div className="grid gap-3 lg:grid-cols-12">
          {/* Programme feature */}
          <div className="flex flex-col justify-between rounded-lg bg-bg p-7 shadow-hairline sm:p-10 lg:col-span-5">
            <div>
              <p className="eyebrow">{t('home.presence.hites_title')}</p>
              <p className="mt-8 font-display text-[clamp(4.5rem,3rem+5vw,8rem)] font-normal leading-none tracking-[-0.05em]">
                <Counter value="300" />
              </p>
              <p className="mt-6 max-w-sm text-muted">{t('home.presence.hites_body')}</p>
            </div>
            <div className="mt-10">
              <p className="eyebrow mb-4">{t('home.presence.reach')}</p>
              <ul className="flex flex-wrap gap-2">
                {countries.map(c => <li key={c} className="chip h-8 px-3 text-xs">{c}</li>)}
              </ul>
            </div>
          </div>

          {/* Field reports */}
          <RevealGroup as="ul" className="grid gap-3 sm:grid-cols-2 lg:col-span-7">
            {STATES.map((s, i) => (
              <RevealItem as="li" key={s.state} className="group relative overflow-hidden rounded-lg bg-bg shadow-hairline">
                <ExposureReveal delay={i * 0.12} className="aspect-[2/1] overflow-hidden">
                  <Picture image={siteImage(s.img)} alt={`${s.state} — ${s.units} ${t('home.presence.units')}`} fit="cover" sizes="(min-width:1024px) 28vw, (min-width:640px) 48vw, 95vw"
                    className="h-full w-full" imgClassName="transition-transform duration-slow ease-out group-hover:scale-[1.04]" />
                </ExposureReveal>
                <div className="flex items-baseline justify-between p-5">
                  <span className="font-display text-lg">{s.state}</span>
                  <span className="flex items-baseline gap-2">
                    <Counter value={s.units} className="font-display text-3xl tracking-tight" />
                    <span className="dicom">{t('home.presence.units')}</span>
                  </span>
                </div>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>

      </div>
    </section>
  );
}
