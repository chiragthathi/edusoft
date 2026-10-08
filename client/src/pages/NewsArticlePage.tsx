import { Link, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft } from 'lucide-react';
import { newsApi } from '../lib/api';
import { useAsync } from '../lib/useAsync';
import { formatDate } from '../lib/utils';
import Seo from '../components/ui/Seo';
import NewsCard from '../components/news/NewsCard';
import { ExposureReveal, MaskLines, Reveal } from '../components/motion/Reveal';
import NotFoundPage from './NotFoundPage';

export default function NewsArticlePage() {
  const { slug = '' } = useParams();
  const { t, i18n } = useTranslation();
  const { data: a, error } = useAsync(() => newsApi.getBySlug(slug, i18n.resolvedLanguage), [slug, i18n.resolvedLanguage]);

  if (error) return <NotFoundPage />;
  if (!a) return <div className="container-x min-h-screen pt-40" aria-busy="true"><div className="skeleton h-12 w-2/3" /><div className="skeleton mt-6 aspect-[16/8]" /></div>;

  const url = encodeURIComponent(`https://edusofthealth.com/news/${a.slug}`);
  const title = encodeURIComponent(a.title);
  const minutes = Math.max(1, Math.round((a.body ?? '').split(/\s+/).length / 220));

  return (
    <>
      <Seo title={a.title} description={a.excerpt} path={`/news/${a.slug}`} image={a.image}
        jsonLd={{ '@context': 'https://schema.org', '@type': 'NewsArticle', headline: a.title, datePublished: a.date, author: { '@type': 'Organization', name: a.author || 'Edusoft Healthcare' }, image: [a.image], publisher: { '@type': 'Organization', name: 'Edusoft Healthcare Limited' } }} />

      <article className="bg-bg pb-section pt-[calc(var(--header-h)+3rem)]">
        <div className="container-x">
          <Link to="/news" className="inline-flex items-center gap-2 text-sm text-muted hover:text-fg"><ArrowLeft size={15} /> {t('news_article.back')}</Link>
          <header className="mx-auto mt-10 max-w-3xl">
            <p className="dicom flex flex-wrap gap-3">
              <time dateTime={a.date}>{formatDate(a.date, i18n.resolvedLanguage)}</time><span aria-hidden>·</span>
              <span>{a.category}</span><span aria-hidden>·</span><span>{minutes} {t('common.minutes')}</span>
            </p>
            <MaskLines as="h1" immediate className="mt-5 font-display text-display-lg font-medium"><span>{a.title}</span></MaskLines>
            <Reveal delay={0.1}><p className="lede mt-6">{a.excerpt}</p></Reveal>
          </header>
          <ExposureReveal immediate delay={0.2} className="mx-auto mt-12 max-w-5xl overflow-hidden rounded-xl">
            <img src={a.image} alt="" className="aspect-[16/8] w-full object-cover" />
          </ExposureReveal>

          <div className="mx-auto mt-14 max-w-3xl">
            <div className="space-y-6 text-[17px] leading-[1.75] text-fg/90">
              {(a.body ?? '').split('\n\n').map((para, i) => <p key={i}>{para}</p>)}
            </div>

            {a.tags && a.tags.length > 0 && (
              <ul className="mt-12 flex flex-wrap gap-2 border-t border-line pt-8">{a.tags.map(tag => <li key={tag} className="chip h-8 text-xs">{tag}</li>)}</ul>
            )}

            <div className="mt-8 flex items-center gap-3 border-t border-line pt-8">
              <span className="eyebrow mr-2">{t('news_article.share')}</span>
              <a href={`https://twitter.com/intent/tweet?url=${url}&text=${title}`} target="_blank" rel="noopener noreferrer" aria-label={t('news_article.share_x')} className="btn btn-secondary btn-sm">{t('common.share_twitter')}</a>
              <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${url}`} target="_blank" rel="noopener noreferrer" aria-label={t('news_article.share_linkedin')} className="btn btn-secondary btn-sm">{t('common.share_linkedin')}</a>
            </div>
          </div>

          {a.related?.length > 0 && (
            <section className="mx-auto mt-24 max-w-5xl border-t border-line pt-12" aria-labelledby="related-title">
              <h2 id="related-title" className="eyebrow mb-8">{t('news_article.related')}</h2>
              <div className="grid gap-8 sm:grid-cols-2">{a.related.map(r => <NewsCard key={r.id} article={r} />)}</div>
            </section>
          )}
        </div>
      </article>
    </>
  );
}
