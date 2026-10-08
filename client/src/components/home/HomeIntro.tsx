import { useTranslation } from 'react-i18next';
import { Counter, Reveal, RevealGroup, RevealItem } from '../motion/Reveal';
import Eyebrow from '../ui/Eyebrow';

// Figures as published on edusofthealth.com.
const STATS = [
  { value: '4,200+', key: 'installations' },
  { value: '28+', key: 'years' },
  { value: '13', key: 'branches' },
  { value: '100+', key: 'people' },
  { value: '19+', key: 'awards' },
];

export default function HomeIntro() {
  const { t } = useTranslation();
  return (
    <section className="section-y relative bg-bg" aria-labelledby="intro-title">
      <div className="container-x">
        <div className="grid gap-10 lg:grid-cols-12">
          <Reveal className="lg:col-span-3"><Eyebrow index="01">{t('home.intro.eyebrow')}</Eyebrow></Reveal>
          <div className="lg:col-span-9">
            <Reveal>
              <p id="intro-title" className="font-display text-display-md font-normal leading-[1.14] tracking-[-0.03em] text-fg">
                {t('home.intro.statement')}{' '}
                <span className="text-muted">{t('home.intro.statement_em')}</span>
              </p>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="mt-8 max-w-2xl text-muted">{t('home.intro.body')}</p>
            </Reveal>
          </div>
        </div>

        <RevealGroup as="ul" className="mt-20 grid grid-cols-2 border-t border-line sm:grid-cols-3 lg:mt-28 lg:grid-cols-5">
          {STATS.map((s, i) => (
            <RevealItem as="li" key={s.key}
              className={`border-b border-line py-8 pr-4 lg:border-b-0 ${i > 0 ? 'lg:border-l lg:pl-8' : ''} ${i % 2 === 1 ? 'border-l pl-6 sm:border-l-0 sm:pl-0' : ''}`}>
              <Counter value={s.value} className="block font-display text-[clamp(2.5rem,1.6rem+2.4vw,3.75rem)] font-normal leading-none tracking-[-0.04em]" />
              <span className="mt-3 block font-mono text-[11px] uppercase tracking-[0.12em] text-muted">{t(`home.intro.stats.${s.key}`)}</span>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
