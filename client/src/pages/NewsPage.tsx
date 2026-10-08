import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { newsApi } from '../lib/api';
import { useAsync } from '../lib/useAsync';
import Seo from '../components/ui/Seo';
import PageHeader from '../components/ui/PageHeader';
import NewsCard from '../components/news/NewsCard';
import { RevealGroup, RevealItem } from '../components/motion/Reveal';

export default function NewsPage() {
  const { t, i18n } = useTranslation();
  const [cat, setCat] = useState<string | null>(null);
  const { data: news, loading } = useAsync(() => newsApi.getAll({ lang: i18n.resolvedLanguage }), [i18n.resolvedLanguage]);
  // Categories derive from the data itself — no hard-coded English list.
  const cats = useMemo(() => [...new Set((news ?? []).map(n => n.category))], [news]);
  const list = (news ?? []).filter(n => !cat || n.category === cat);
  const [lead, ...rest] = list;

  return (
    <>
      <Seo title="News & Updates" description="Product launches, deployments and company news from Edusoft Healthcare." path="/news" />
      <PageHeader eyebrow={t('news_page.eyebrow')} title={t('news_page.title')} sub={t('news_page.subtitle')} />

      <div className="sticky top-[var(--header-h)] z-20 border-y border-line bg-bg/85 backdrop-blur-xl">
        <div role="group" aria-label={t('news_page.filter_category_aria')} className="no-scrollbar container-x flex gap-2 overflow-x-auto py-3">
          <button type="button" className="chip shrink-0" aria-pressed={!cat} onClick={() => setCat(null)}>{t('news_page.filter_all')}</button>
          {cats.map(c => <button key={c} type="button" className="chip shrink-0" aria-pressed={cat === c} onClick={() => setCat(c)}>{c}</button>)}
        </div>
      </div>

      <section className="container-x pb-section pt-12" aria-busy={loading}>
        {!news ? (
          <div className="grid gap-6 lg:grid-cols-2" aria-hidden><div className="skeleton aspect-[16/10]" /><div className="skeleton aspect-[16/10]" /></div>
        ) : list.length === 0 ? (
          <p className="py-20 text-center text-muted">{t('news_page.no_articles')}</p>
        ) : (
          <>
            {lead && <div className="mb-16 max-w-4xl"><NewsCard article={lead} large /></div>}
            <RevealGroup className="grid gap-x-6 gap-y-14 border-t border-line pt-12 sm:grid-cols-2 lg:grid-cols-3">
              {rest.map(a => <RevealItem key={a.id}><NewsCard article={a} /></RevealItem>)}
            </RevealGroup>
          </>
        )}
      </section>
    </>
  );
}
