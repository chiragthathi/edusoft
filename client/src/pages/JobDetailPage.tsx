import { Link, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft } from 'lucide-react';
import { jobsApi } from '../lib/api';
import { useAsync } from '../lib/useAsync';
import { formatDate } from '../lib/utils';
import Seo from '../components/ui/Seo';
import Button from '../components/ui/Button';
import { MaskLines, Reveal } from '../components/motion/Reveal';
import NotFoundPage from './NotFoundPage';

export default function JobDetailPage() {
  const { slug = '' } = useParams();
  const { t, i18n } = useTranslation();
  const { data: job, error } = useAsync(() => jobsApi.getBySlug(slug), [slug]);

  if (error) return <NotFoundPage />;
  if (!job) return <div className="container-x min-h-screen pt-40" aria-busy="true"><div className="skeleton h-12 w-1/2" /></div>;

  const applyHref = !job.applyUrl || job.applyUrl === '#' ? `mailto:hr@edusofthealth.com?subject=${encodeURIComponent(`Application — ${job.title}`)}` : job.applyUrl;
  const facts = [
    [t('job_detail.department'), job.department],
    [t('job_detail.location'), job.location],
    [t('job_detail.type'), job.type],
    [t('job_detail.experience'), job.experience],
  ];

  return (
    <>
      <Seo title={`${job.title} — Careers`} description={job.description?.slice(0, 155)} path={`/careers/${job.slug}`}
        jsonLd={{ '@context': 'https://schema.org', '@type': 'JobPosting', title: job.title, description: job.description, datePosted: job.posted, employmentType: job.type, hiringOrganization: { '@type': 'Organization', name: 'Edusoft Healthcare Limited', sameAs: 'https://edusofthealth.com' }, jobLocation: { '@type': 'Place', address: job.location } }} />
      <article className="bg-bg pb-section pt-[calc(var(--header-h)+3rem)]">
        <div className="container-x">
          <Link to="/careers#roles" className="inline-flex items-center gap-2 text-sm text-muted hover:text-fg"><ArrowLeft size={15} /> {t('job_detail.back')}</Link>
          <div className="mt-10 grid gap-12 lg:grid-cols-12">
            <div className="lg:col-span-8">
              <p className="dicom">{t('careers_page.posted_on')} {formatDate(job.posted, i18n.resolvedLanguage)}</p>
              <MaskLines as="h1" immediate className="mt-4 font-display text-display-lg font-medium"><span>{job.title}</span></MaskLines>
              <Reveal delay={0.1} className="mt-12 space-y-12">
                <section>
                  <h2 className="eyebrow mb-4">{t('job_detail.about_role')}</h2>
                  <p className="text-lede text-fg">{job.description}</p>
                </section>
                {[['responsibilities', job.responsibilities], ['requirements', job.requirements]].map(([k, items]) => (
                  (items as string[] | undefined)?.length ? (
                    <section key={k as string}>
                      <h2 className="eyebrow mb-4">{t(`job_detail.${k}`)}</h2>
                      <ol className="border-t border-line">
                        {(items as string[]).map((r, i) => (
                          <li key={i} className="flex gap-5 border-b border-line py-4"><span className="font-mono text-[11px] text-brand">{String(i + 1).padStart(2, '0')}</span><span>{r}</span></li>
                        ))}
                      </ol>
                    </section>
                  ) : null
                ))}
              </Reveal>
            </div>
            <aside className="lg:col-span-4">
              <div className="sticky top-[calc(var(--header-h)+2rem)] rounded-xl bg-surface p-7 shadow-hairline">
                <dl className="divide-y divide-line">
                  {facts.map(([k, v]) => <div key={k} className="flex justify-between gap-4 py-3 text-sm"><dt className="text-muted">{k}</dt><dd className="text-right">{v}</dd></div>)}
                </dl>
                <p className="mt-6 font-display text-xl">{t('job_detail.apply_title')}</p>
                <p className="mt-2 text-sm text-muted">{t('job_detail.apply_body')}</p>
                <Button href={applyHref} className="mt-6 w-full" arrow>{t('careers_page.apply_now')}</Button>
                <p className="mt-4 text-xs text-subtle">{t('job_detail.apply_email_note')} <a href="mailto:hr@edusofthealth.com" className="underline">hr@edusofthealth.com</a></p>
              </div>
            </aside>
          </div>
        </div>
      </article>
    </>
  );
}
