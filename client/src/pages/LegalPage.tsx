import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { LEGAL } from '../content/legal';
import { cn } from '../lib/utils';
import Seo from '../components/ui/Seo';
import PageHeader from '../components/ui/PageHeader';

const DOCS = ['privacy', 'terms', 'cookies'] as const;
const PATHS = { privacy: '/privacy', terms: '/terms', cookies: '/cookies' };

export default function LegalPage({ doc }: { doc: 'privacy' | 'terms' | 'cookies' }) {
  const { t } = useTranslation();
  const d = LEGAL[doc];
  const slug = (h: string) => h.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

  return (
    <>
      <Seo title={d.title} description={d.intro[0].slice(0, 155)} path={PATHS[doc]} />
      <PageHeader eyebrow={t('legal.updated')} title={d.title} />
      <div className="container-x grid gap-12 pb-section lg:grid-cols-12">
        <aside className="lg:col-span-3">
          <nav aria-label="Legal" className="sticky top-[calc(var(--header-h)+2rem)] space-y-6 border-t border-line pt-6 text-sm">
            <ul className="space-y-1">
              {DOCS.map(k => (
                <li key={k}><Link to={PATHS[k]} aria-current={k === doc ? 'page' : undefined} className={cn('block py-1', k === doc ? 'text-fg' : 'text-muted hover:text-fg')}>{t(`legal.${k}`)}</Link></li>
              ))}
            </ul>
            <ul className="hidden space-y-1 border-t border-line pt-6 lg:block">
              {d.sections.map(s => <li key={s.h}><a href={`#${slug(s.h)}`} className="block py-0.5 text-subtle hover:text-fg">{s.h}</a></li>)}
            </ul>
          </nav>
        </aside>
        <article className="max-w-prose space-y-5 text-[16px] leading-relaxed text-muted lg:col-span-8 lg:col-start-5">
          {d.intro.map((p, i) => <p key={i} className={i === 0 ? 'text-lede text-fg' : ''}>{p}</p>)}
          {d.sections.map(s => (
            <section key={s.h} id={slug(s.h)} className="scroll-mt-28 border-t border-line pt-8">
              <h2 className="mb-4 font-display text-xl text-fg">{s.h}</h2>
              <div className="space-y-4">
                {s.p?.map((p, i) => <p key={i}>{p}</p>)}
                {s.list && <ul className="list-disc space-y-2 pl-5 marker:text-subtle">{s.list.map((l, i) => <li key={i}>{l}</li>)}</ul>}
              </div>
            </section>
          ))}
        </article>
      </div>
    </>
  );
}
