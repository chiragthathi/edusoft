import { useTranslation } from 'react-i18next';
import { Phone } from 'lucide-react';
import { siteImage } from '../content/storyMedia';
import Seo from '../components/ui/Seo';
import Eyebrow from '../components/ui/Eyebrow';
import Picture from '../components/ui/Picture';
import SectionHeader from '../components/ui/SectionHeader';
import { ExposureReveal, MaskLines, Reveal, RevealGroup, RevealItem } from '../components/motion/Reveal';
import ServiceBand from '../components/home/ServiceBand';
import RequestForm from '../components/form/RequestForm';

export default function ServicesPage() {
  const { t } = useTranslation();
  const items = t('services_page.items', { returnObjects: true }) as { t: string; d: string }[];

  return (
    <>
      <Seo title="Service & Support — Installation, Training, AMC & CMC" description="Edusoft installs, trains and maintains your imaging systems: warranty, AMC & CMC for up to 10 years, remote support on 1800-120-280-280, and financing." path="/services" />

      {/* Hero */}
      <section className="bg-bg pt-[calc(var(--header-h)+3.5rem)] sm:pt-[calc(var(--header-h)+5rem)]">
        <div className="container-x grid gap-12 pb-16 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-6">
            <Reveal><Eyebrow dot>{t('services_page.eyebrow')}</Eyebrow></Reveal>
            <MaskLines as="h1" immediate className="mt-5 font-display text-display-xl font-medium">
              <span>{t('services_page.title')}</span>
              <span className="text-muted">{t('services_page.title_em')}</span>
            </MaskLines>
            <Reveal delay={0.1}><p className="lede mt-6 max-w-lg">{t('services_page.sub')}</p></Reveal>
          </div>
          <div className="lg:col-span-6">
            <ExposureReveal immediate delay={0.2} className="overflow-hidden rounded-xl">
              <Picture image={siteImage('radiologist')} alt="" fit="cover" priority sizes="(min-width:1024px) 50vw, 100vw" className="aspect-[16/10] w-full" />
            </ExposureReveal>
          </div>
        </div>
      </section>

      {/* Offer */}
      <section className="section-y bg-surface" aria-labelledby="offer-title">
        <div className="container-x">
          <SectionHeader index="01" eyebrow={t('services_page.offer_title')} title={<span id="offer-title">{t('home.service.title')}</span>} />
          <RevealGroup as="ul" className="grid gap-px overflow-hidden rounded-lg bg-line sm:grid-cols-2 lg:grid-cols-4">
            {items.map((it, i) => (
              <RevealItem as="li" key={it.t} className="flex min-h-[15rem] flex-col bg-surface p-7">
                <span className="dicom">{String(i + 1).padStart(2, '0')}</span>
                <h3 className="mt-auto pt-10 font-display text-xl">{it.t}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted">{it.d}</p>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      <ServiceBand index="02" cta={false} />

      {/* Request */}
      <section id="request" className="section-y scroll-mt-24 bg-bg" aria-labelledby="request-title">
        <div className="container-x grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <Reveal><Eyebrow index="03">{t('services_page.eyebrow')}</Eyebrow></Reveal>
            <h2 id="request-title" className="mt-5 font-display text-display-md font-medium">{t('services_page.request_title')}</h2>
            <p className="lede mt-5 max-w-md">{t('services_page.request_body')}</p>
            <a href="tel:1800120280280" className="group mt-10 flex items-center gap-5 rounded-lg bg-surface p-6 shadow-hairline transition-shadow hover:shadow-lift">
              <span className="grid h-12 w-12 place-items-center rounded-full bg-brand text-white"><Phone size={18} /></span>
              <span>
                <span className="dicom block">{t('services_page.toll_free')}</span>
                <span className="font-display text-2xl tabular-nums tracking-tight">1800-120-280-280</span>
              </span>
            </a>
          </div>
          <div className="rounded-xl bg-surface p-6 shadow-hairline sm:p-10 lg:col-span-7">
            <RequestForm type="service" />
          </div>
        </div>
      </section>
    </>
  );
}
