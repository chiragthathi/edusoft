import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import type { NewsItem } from '../../lib/types';
import { cn, formatDate } from '../../lib/utils';

/** Editorial news card: cropped image, mono dateline, headline. Whole card links. */
export default function NewsCard({ article, large, className }: { article: NewsItem; large?: boolean; className?: string }) {
  const { i18n } = useTranslation();
  return (
    <article className={cn('group relative flex flex-col', className)}>
      <div className={cn('overflow-hidden rounded-lg bg-surface-2', large ? 'aspect-[16/10]' : 'aspect-[3/2]')}>
        <img src={article.image} alt="" loading="lazy" decoding="async"
          className="h-full w-full object-cover grayscale-[30%] transition-[transform,filter] duration-slow ease-out group-hover:scale-[1.04] group-hover:grayscale-0" />
      </div>
      <p className="dicom mt-5 flex gap-3">
        <time dateTime={article.date}>{formatDate(article.date, i18n.resolvedLanguage)}</time>
        <span aria-hidden>·</span>
        <span>{article.category}</span>
      </p>
      <h3 className={cn('mt-3 font-display font-medium leading-snug tracking-tight', large ? 'text-display-sm' : 'text-lg')}>
        <Link to={`/news/${article.slug}`} className="bg-[linear-gradient(currentColor,currentColor)] bg-[length:0_1px] bg-left-bottom bg-no-repeat transition-[background-size] duration-normal ease-out after:absolute after:inset-0 group-hover:bg-[length:100%_1px]">
          {article.title}
        </Link>
      </h3>
      {large && <p className="mt-3 line-clamp-3 text-muted">{article.excerpt}</p>}
    </article>
  );
}
