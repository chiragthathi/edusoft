import { useTranslation } from 'react-i18next';
import { MapPin } from 'lucide-react';
import { officesApi } from '../lib/api';
import { useAsync } from '../lib/useAsync';
import { useHeaderTone } from '../context/HeaderTone';
import { HERO_PRODUCTS } from '../content/heroProducts';
import { STORY, siteImage } from '../content/storyMedia';
import Seo from '../components/ui/Seo';
import Eyebrow from '../components/ui/Eyebrow';
import Picture from '../components/ui/Picture';
import Lightbox from '../components/ui/Lightbox';
import SectionHeader from '../components/ui/SectionHeader';
import VideoFacade from '../components/media/VideoFacade';
import Voices from '../components/home/Voices';
import ClosingCTA from '../components/home/ClosingCTA';
import { Counter, ExposureReveal, MaskLines, Parallax, Reveal, RevealGroup, RevealItem } from '../components/motion/Reveal';

// Published company figures (edusofthealth.com/about-us.php).
const FACTS = [
  { v: '28+', k: 'home.intro.stats.years' },
  { v: '392+', k: 'gov' },
  { v: '3,106+', k: 'pvt' },
  { v: '13', k: 'home.intro.stats.branches' },
];

export default function AboutPage() {
  const { t } = useTranslation();
  useHeaderTone('ink');
  const { data: offices } = useAsync(() => officesApi.getAll(), []);
  const values = t('about_page.values', { returnObjects: true }) as { t: string; d: string }[];
  const certs = t('about_page.certs', { returnObjects: true }) as { k: string; d: string }[];
  const label = (k: string) => (k === 'gov' ? t('about_page.gov_hospitals') : k === 'pvt' ? t('about_page.pvt_hospitals') : t(k));

  return (
    <>
      <Seo title="About Edusoft Healthcare — Bharosemand Medical Co." description="Edusoft Healthcare Limited: 28+ years in radiology, Made-in-India X-ray manufacturing, installations in 392+ government and 3,106+ private hospitals, certified to BIS, NABL, AERB, CDSCO and ISO." path="/about" />

      {/* Hero */}
      <section data-tone="ink" className="relative isolate overflow-hidden bg-bg pt-[calc(var(--header-h)+4rem)] sm:pt-[calc(var(--header-h)+6rem)]">
        <div aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(50%_55%_at_80%_30%,rgb(64_120_190/0.22),transparent_70%)]" />
        <div className="container-x relative">
          <Reveal><Eyebrow dot>{t('about_page.eyebrow')}</Eyebrow></Reveal>
          <MaskLines as="h1" immediate className="mt-6 max-w-5xl font-display text-display-xl font-medium">
            <span>{t('about_page.title')}</span>
            <span className="text-muted">{t('about_page.title_em')}</span>
          </MaskLines>
          <Reveal delay={0.15}><p className="lede mt-8 max-w-2xl">{t('about_page.sub')}</p></Reveal>

          <RevealGroup as="dl" className="mt-20 grid grid-cols-2 border-t border-line lg:grid-cols-4" delay={0.2}>
            {FACTS.map((f, i) => (
              <RevealItem key={f.k} className={`py-8 ${i % 2 ? 'border-l border-line pl-6' : 'pr-6'} lg:border-l lg:pl-8 lg:first:border-l-0 lg:first:pl-0`}>
                <dt className="dicom">{label(f.k)}</dt>
                <dd className="mt-3 font-display text-[clamp(2.5rem,1.8rem+2vw,3.75rem)] leading-none tracking-[-0.04em]"><Counter value={f.v} /></dd>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      {/* Who we are */}
      <section className="section-y bg-bg" aria-labelledby="story-title">
        <div className="container-x grid gap-12 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-6">
            <Reveal><Eyebrow index="01">{t('about_page.story_eyebrow')}</Eyebrow></Reveal>
            <MaskLines className="mt-5 font-display text-display-md font-medium"><span id="story-title">{t('about_page.story_title')}</span></MaskLines>
            <Reveal delay={0.1}>
              <p className="mt-6 text-lede text-fg">{t('about_page.story_body')}</p>
              <p className="mt-5 text-muted">{t('about_page.story_body2')}</p>
            </Reveal>
          </div>
          <div className="lg:col-span-5 lg:col-start-8">
            <ExposureReveal className="overflow-hidden rounded-xl">
              <Picture image={siteImage('clinicians')} alt={t('about_page.facility_alt')} fit="cover" sizes="(min-width:1024px) 40vw, 100vw" className="aspect-[4/5] w-full" />
            </ExposureReveal>
          </div>
        </div>
      </section>

      {/* Beliefs */}
      <section className="section-y bg-surface" aria-labelledby="values-title">
        <div className="container-x">
          <SectionHeader index="02" eyebrow={t('about_page.values_eyebrow')} title={<span id="values-title">{t('about_page.values_title')}</span>} />
          <RevealGroup as="ul" className="grid gap-px overflow-hidden rounded-lg bg-line sm:grid-cols-2 lg:grid-cols-3">
            {values.map((v, i) => (
              <RevealItem as="li" key={v.t} className="bg-surface p-8">
                <span className="dicom">{String(i + 1).padStart(2, '0')}</span>
                <h3 className="mt-10 font-display text-2xl">{v.t}</h3>
                <p className="mt-3 text-muted">{v.d}</p>
              </RevealItem>
            ))}
          </RevealGroup>

          <div className="mt-20 grid gap-12 border-t border-line pt-16 lg:grid-cols-2">
            {(['vision', 'mission'] as const).map(k => (
              <Reveal key={k}>
                <p className="eyebrow">{t(`about_page.${k}_label`)}</p>
                <p className="mt-6 font-display text-display-sm font-normal leading-[1.3]">{t(`about_page.${k}`)}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Manufacturing & partners */}
      <section data-tone="ink" className="section-y relative overflow-hidden bg-bg" aria-labelledby="make-title">
        <div className="container-x grid gap-14 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-5">
            <Reveal><Eyebrow index="03">{t('about_page.make_eyebrow')}</Eyebrow></Reveal>
            <MaskLines className="mt-5 font-display text-display-md font-medium"><span id="make-title">{t('about_page.make_title')}</span></MaskLines>
            <Reveal delay={0.1}><p className="lede mt-6">{t('about_page.make_body')}</p></Reveal>
            <Reveal delay={0.2} className="mt-10">
              <p className="eyebrow mb-4">{t('about_page.partners')}</p>
              <ul className="flex flex-wrap items-center gap-3">
                {(['partner-iray', 'partner-lanmage', 'partner-poskom'] as const).map(k => (
                  <li key={k} className="grid h-14 w-28 place-items-center rounded-sm bg-white px-3">
                    <Picture image={siteImage(k)} alt="" sizes="112px" className="h-full w-full" blend />
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
          <div className="grid grid-cols-2 gap-3 lg:col-span-7">
            <Parallax amount={30} className="row-span-2">
              <Lightbox image={STORY.cArmMotion} alt="ERAY Smart 5C — range of motion" sizes="(min-width:1024px) 28vw, 48vw" className="h-full min-h-[18rem]" pad="p-[8%]" annotations={{ tl: 'ERAY Smart 5C', br: t('about_page.range_motion') }} />
            </Parallax>
            <Lightbox image={HERO_PRODUCTS[3].image} alt={HERO_PRODUCTS[3].name} sizes="(min-width:1024px) 28vw, 48vw" className="aspect-square" annotations={{ tl: '80 kW', br: t('footer.made_in_india') }} />
            <Lightbox image={STORY.generate} alt="50 kW mobile" sizes="(min-width:1024px) 28vw, 48vw" className="aspect-square" annotations={{ tl: '50 kW mobile', br: t('footer.made_in_india') }} />
          </div>
        </div>
      </section>

      {/* Compliance */}
      <section id="compliance" className="section-y scroll-mt-24 bg-bg" aria-labelledby="compliance-title">
        <div className="container-x">
          <SectionHeader index="04" eyebrow={t('about_page.compliance_eyebrow')} title={<span id="compliance-title">{t('about_page.compliance_title')}</span>} sub={t('about_page.compliance_body')} />
          <RevealGroup as="ul" className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
            {certs.map(c => (
              <RevealItem as="li" key={c.k} className="reg-marks flex aspect-square flex-col justify-between rounded-lg bg-surface p-5 shadow-hairline">
                <span className="font-display text-3xl font-medium tracking-tight">{c.k}</span>
                <span className="text-xs leading-snug text-muted">{c.d}</span>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      {/* People + film */}
      <section className="section-y bg-surface" aria-labelledby="people-title">
        <div className="container-x grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <Reveal><Eyebrow index="05">{t('about_page.people_eyebrow')}</Eyebrow></Reveal>
            <h2 id="people-title" className="mt-5 font-display text-display-sm font-medium">{t('about_page.people_title')}</h2>
            <Reveal delay={0.1}><p className="mt-5 text-muted">{t('about_page.people_body')}</p></Reveal>
            <Reveal delay={0.2} className="mt-8 overflow-hidden rounded-lg">
              <Picture image={siteImage('team')} alt="" fit="cover" sizes="(min-width:1024px) 30vw, 100vw" className="aspect-[4/3] w-full" />
            </Reveal>
          </div>
          <Reveal className="lg:col-span-8">
            <VideoFacade id="Jwscr6x4Yw0" title={t('about_page.video_title')} />
          </Reveal>
        </div>
      </section>

      <Voices index="06" />

      {/* Offices */}
      <section id="offices" className="section-y scroll-mt-24 border-t border-line bg-bg" aria-labelledby="offices-title">
        <div className="container-x">
          <SectionHeader index="07" eyebrow={t('about_page.offices_eyebrow')} title={<span id="offices-title">{t('about_page.offices_title')}</span>} />
          <div className="grid gap-3 md:grid-cols-2">
            {offices?.map(o => (
              <address key={o.id} className="not-italic rounded-lg bg-surface p-8 shadow-hairline">
                <p className="dicom flex items-center gap-2"><MapPin size={12} aria-hidden />{o.type === 'headquarters' ? 'HQ' : o.country}</p>
                <p className="mt-6 font-display text-2xl">{o.name}</p>
                <p className="mt-3 leading-relaxed text-muted">{o.address}<br />{o.city}{o.postalCode ? ` ${o.postalCode}` : ''}, {o.country}</p>
                <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm">
                  {o.phone && <a href={`tel:${o.phone.replace(/[^+\d]/g, '')}`} className="link">{o.phone}</a>}
                  {o.tollFree && <a href="tel:1800120280280" className="link">{o.tollFree}</a>}
                  {o.email && <a href={`mailto:${o.email}`} className="link">{o.email}</a>}
                </div>
              </address>
            ))}
          </div>
          <Reveal className="mt-24 max-w-4xl">
            <p className="font-display text-display-md font-normal leading-[1.15]">{t('about_page.future_title')}</p>
            <p className="lede mt-6 max-w-2xl">{t('about_page.future_body')}</p>
          </Reveal>
        </div>
      </section>

      <ClosingCTA />
    </>
  );
}
