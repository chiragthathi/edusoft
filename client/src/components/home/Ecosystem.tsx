import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowUpRight } from 'lucide-react';
import type { Category } from '../../lib/types';
import { cn } from '../../lib/utils';
import { RevealGroup, RevealItem } from '../motion/Reveal';
import SectionHeader from '../ui/SectionHeader';
import Picture from '../ui/Picture';
import { TiltStage } from '../motion/Interactive';

/**
 * Product ecosystem as an index: the four X-ray families get large stages,
 * digital/output/specialty families follow as a compact second tier.
 */
export default function Ecosystem({ categories }: { categories: Category[] }) {
  const { t } = useTranslation();
  const primary = categories.filter(c => c.group === 'imaging');
  const secondary = categories.filter(c => c.group !== 'imaging');

  return (
    <section className="section-y bg-surface" aria-labelledby="eco-title">
      <div className="container-x">
        <SectionHeader index="02" eyebrow={t('home.ecosystem.eyebrow')} title={<span id="eco-title">{t('home.ecosystem.title')}</span>} sub={t('home.ecosystem.sub')} />

        <RevealGroup as="ul" className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {primary.map((c, i) => (
            <RevealItem as="li" key={c.id}>
              <CategoryTile category={c} index={i} large />
            </RevealItem>
          ))}
        </RevealGroup>

        <RevealGroup as="ul" className="mt-3 grid grid-cols-2 gap-3 md:grid-cols-4 xl:grid-cols-7">
          {secondary.map((c, i) => (
            <RevealItem as="li" key={c.id}>
              <CategoryTile category={c} index={primary.length + i} />
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}

function CategoryTile({ category: c, index, large }: { category: Category; index: number; large?: boolean }) {
  const { t } = useTranslation();
  return (
    <Link to={`/portfolio?category=${c.id}`} className="group flex h-full flex-col" aria-label={`${t('home.ecosystem.explore')} ${c.label}`}>
      <TiltStage tilt={large ? 4 : 3}>
      <div className={cn('lightbox relative', large ? 'aspect-[4/5]' : 'aspect-square')}>
        {c.heroImage && (
          <Picture image={c.heroImage} alt="" sizes={large ? '(min-width:1024px) 24vw, 50vw' : '(min-width:1280px) 13vw, 45vw'}
            className={cn('h-full w-full transition-transform duration-slow ease-out group-hover:scale-[1.05]', large ? 'p-[14%]' : 'p-[16%]')} />
        )}
        <span aria-hidden className="dicom absolute left-3.5 top-3 text-ink-700/70">{String(index + 1).padStart(2, '0')}</span>
        <span aria-hidden className="dicom absolute right-3.5 top-3 text-ink-700/70">{t('home.ecosystem.products_count', { count: c.count })}</span>
        <span aria-hidden className="absolute bottom-3 right-3 grid h-8 w-8 place-items-center rounded-full bg-ink-900 text-white opacity-0 transition-all duration-normal ease-out group-hover:opacity-100">
          <ArrowUpRight size={15} />
        </span>
      </div>
      </TiltStage>
      <div className="pt-4">
        <h3 className={cn('font-display font-medium tracking-tight', large ? 'text-xl' : 'text-[15px] leading-tight')}>{c.label}</h3>
        {large && <p className="mt-1.5 text-sm text-muted">{c.tagline}</p>}
      </div>
    </Link>
  );
}
