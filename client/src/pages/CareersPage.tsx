import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowUpRight, Search } from 'lucide-react';
import { jobsApi } from '../lib/api';
import { useAsync } from '../lib/useAsync';
import { formatDate } from '../lib/utils';
import { siteImage } from '../content/storyMedia';
import Seo from '../components/ui/Seo';
import PageHeader from '../components/ui/PageHeader';
import Picture from '../components/ui/Picture';
import SectionHeader from '../components/ui/SectionHeader';
import { ExposureReveal, RevealGroup, RevealItem } from '../components/motion/Reveal';

export default function CareersPage() {
  const { t, i18n } = useTranslation();
  const [dept, setDept] = useState<string | null>(null);
  const [q, setQ] = useState('');
  const { data: jobs } = useAsync(() => jobsApi.getAll(), []);
  const culture = t('careers_page.culture', { returnObjects: true }) as { t: string; d: string }[];
  const depts = useMemo(() => [...new Set((jobs ?? []).map(j => j.department))], [jobs]);
  const list = (jobs ?? []).filter(j => (!dept || j.department === dept) && (!q || `${j.title} ${j.location}`.toLowerCase().includes(q.toLowerCase())));

  return (
    <>
      <Seo title="Careers — Build the Future of Medical Imaging" description="Open roles at Edusoft Healthcare across engineering, service, sales and operations." path="/careers" />
      <PageHeader eyebrow={t('careers_page.eyebrow')} title={t('careers_page.title')} titleEm={t('careers_page.title_em')} sub={t('careers_page.subtitle')}
        aside={<ExposureReveal immediate delay={0.2} className="overflow-hidden rounded-xl"><Picture image={siteImage('workspace')} alt="" fit="cover" priority sizes="(min-width:1024px) 40vw, 100vw" className="aspect-[4/3] w-full" /></ExposureReveal>} />

      <section className="section-y border-t border-line bg-surface" aria-labelledby="culture-title">
        <div className="container-x">
          <SectionHeader index="01" eyebrow={t('careers_page.culture_tag')} title={<span id="culture-title">{t('careers_page.culture_headline')}</span>} />
          <RevealGroup as="ul" className="grid gap-px overflow-hidden rounded-lg bg-line md:grid-cols-3">
            {culture.map((c, i) => (
              <RevealItem as="li" key={c.t} className="bg-surface p-8">
                <span className="dicom">{String(i + 1).padStart(2, '0')}</span>
                <h3 className="mt-10 font-display text-2xl">{c.t}</h3>
                <p className="mt-3 text-muted">{c.d}</p>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      <section id="roles" className="section-y bg-bg" aria-labelledby="roles-title">
        <div className="container-x">
          <SectionHeader index="02" eyebrow={t('careers_page.open_positions')} title={<span id="roles-title">{t('careers_page.open_positions')}</span>}
            action={
              <div className="relative w-full max-w-sm">
                <Search size={16} aria-hidden className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
                <input type="search" value={q} onChange={e => setQ(e.target.value)} placeholder={t('careers_page.search_placeholder')} aria-label={t('careers_page.search_jobs_aria')} className="control rounded-full pl-11" />
              </div>
            } />
          <div role="group" aria-label={t('careers_page.filter_dept_aria')} className="mb-8 flex flex-wrap gap-2">
            <button type="button" className="chip" aria-pressed={!dept} onClick={() => setDept(null)}>{t('careers_page.all_departments')}</button>
            {depts.map(d => <button key={d} type="button" className="chip" aria-pressed={dept === d} onClick={() => setDept(d)}>{d}</button>)}
          </div>

          <ul className="border-t border-line" aria-live="polite">
            {!jobs && Array.from({ length: 3 }).map((_, i) => <li key={i} className="border-b border-line py-7"><div className="skeleton h-6 w-1/3" /></li>)}
            {list.map(j => (
              <li key={j.id} className="border-b border-line">
                <Link to={`/careers/${j.slug}`} className="group grid items-center gap-3 py-7 md:grid-cols-12">
                  <span className="font-display text-xl md:col-span-5">{j.title}</span>
                  <span className="text-sm text-muted md:col-span-2">{j.department}</span>
                  <span className="text-sm text-muted md:col-span-2">{j.location}</span>
                  <span className="dicom md:col-span-2">{t('careers_page.posted_on')} {formatDate(j.posted, i18n.resolvedLanguage)}</span>
                  <span className="flex justify-end md:col-span-1"><ArrowUpRight size={20} aria-hidden className="text-muted transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-fg" /></span>
                </Link>
              </li>
            ))}
          </ul>
          {jobs && list.length === 0 && <p className="py-12 text-muted">{t('careers_page.no_jobs')}</p>}
        </div>
      </section>
    </>
  );
}
