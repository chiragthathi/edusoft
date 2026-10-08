import { useEffect, useMemo } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { ArrowUpRight, ChevronRight, FileText } from 'lucide-react';
import { productsApi } from '../lib/api';
import { useAsync } from '../lib/useAsync';
import { ease } from '../lib/motion';
import { useHeaderTone } from '../context/HeaderTone';
import Seo from '../components/ui/Seo';
import Button from '../components/ui/Button';
import Eyebrow from '../components/ui/Eyebrow';
import Lightbox from '../components/ui/Lightbox';
import LocalNav from '../components/ui/LocalNav';
import SectionHeader from '../components/ui/SectionHeader';
import { Counter, ExposureReveal, MaskLines, Reveal, RevealGroup, RevealItem } from '../components/motion/Reveal';
import ProductCard from '../components/product/ProductCard';
import ProductGallery from '../components/product/ProductGallery';
import MultiAngleViewer from '../components/product/MultiAngleViewer';
import SpecTable from '../components/product/SpecTable';
import ClosingCTA from '../components/home/ClosingCTA';
import NotFoundPage from './NotFoundPage';
import { TiltStage } from '../components/motion/Interactive';

export default function ProductDetailPage() {
  const { slug = '' } = useParams();
  const { t } = useTranslation();
  const navigate = useNavigate();
  useHeaderTone('ink');
  const { data: p, error, loading } = useAsync(() => productsApi.getBySlug(slug), [slug]);

  // Legacy slugs (e.g. /portfolio/fpd-c-arm) resolve to their canonical page.
  useEffect(() => {
    if (p && p.canonicalSlug && p.canonicalSlug !== slug) navigate(`/portfolio/${p.canonicalSlug}`, { replace: true });
  }, [p, slug, navigate]);

  const sections = useMemo(() => {
    if (!p) return [];
    return [
      { id: 'overview', label: t('product_detail.overview') },
      p.images.length > 1 && { id: 'gallery', label: t('product_detail.gallery') },
      p.keyFeatures.length > 0 && { id: 'features', label: t('product_detail.key_features') },
      { id: 'specifications', label: t('product_detail.specifications') },
      p.downloads.length > 0 && { id: 'downloads', label: t('product_detail.downloads') },
    ].filter(Boolean) as { id: string; label: string }[];
  }, [p, t]);

  if (error) return <NotFoundPage />;
  if (loading || !p) return <DetailSkeleton />;

  const quoteHref = `/contact?type=quote&product=${p.slug}`;
  const hero = p.images[0];
  const spinFrames = p.spin ? p.spin.frames.map(i => p.images[i]).filter(Boolean) : null;
  const galleryImages = spinFrames ? p.images.filter((_, i) => !p.spin!.frames.includes(i)) : p.images;
  const firstSpec = p.specGroups[0]?.rows.slice(0, 2).map(([k, v]) => `${k}: ${v}`) ?? [];

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: p.name,
    description: p.shortDescription,
    image: p.gallery.map(g => `https://edusofthealth.com${g}`),
    category: p.categoryLabel,
    brand: { '@type': 'Brand', name: p.series?.split(' ')[0] || 'Edusoft' },
    manufacturer: { '@type': 'Organization', name: 'Edusoft Healthcare Limited' },
    url: `https://edusofthealth.com/portfolio/${p.slug}`,
    additionalProperty: p.specGroups.flatMap(g => g.rows).slice(0, 20).map(([name, value]) => ({ '@type': 'PropertyValue', name, value })),
  };

  return (
    <>
      <Seo title={`${p.name} — ${p.categoryLabel}`} description={p.shortDescription} path={`/portfolio/${p.slug}`} image={p.image} jsonLd={jsonLd} />

      {/* ── Hero ── */}
      <section data-tone="ink" className="relative isolate overflow-hidden bg-bg pt-[var(--header-h)]" aria-labelledby="product-title">
        <div aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(55%_60%_at_72%_50%,rgb(64_120_190/0.25),transparent_70%)]" />
        <div aria-hidden className="grain pointer-events-none absolute inset-0 opacity-[0.04] mix-blend-screen" />
        <div className="container-x relative grid gap-10 pb-16 pt-8 lg:grid-cols-12 lg:gap-12 lg:pb-24 lg:pt-14">
          <div className="flex flex-col lg:col-span-5">
            <nav aria-label={t('product_detail.breadcrumb_aria')} className="flex flex-wrap items-center gap-1.5 text-xs text-muted">
              <Link to="/" className="hover:text-fg">{t('product_detail.home')}</Link><ChevronRight size={12} aria-hidden />
              <Link to="/portfolio" className="hover:text-fg">{t('product_detail.portfolio')}</Link><ChevronRight size={12} aria-hidden />
              <Link to={`/portfolio?category=${p.category}`} className="hover:text-fg">{p.categoryLabel}</Link>
            </nav>
            <div className="mt-10 lg:mt-auto">
              <Eyebrow dot>{p.series || p.categoryLabel}</Eyebrow>
              <MaskLines as="h1" immediate delay={0.1} className="mt-5 font-display text-display-lg font-medium">
                <span id="product-title">{p.name}</span>
              </MaskLines>
              {p.tagline && (
                <motion.p initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.4, ease: ease.out }}
                  className="mt-4 font-display text-display-sm font-normal text-muted">{p.tagline}</motion.p>
              )}
              <motion.p initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.5, ease: ease.out }}
                className="mt-6 max-w-md text-muted">{p.shortDescription}</motion.p>
              <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.6, ease: ease.out }}
                className="mt-8 flex flex-wrap gap-3">
                <Button to={quoteHref} size="lg" arrow>{t('product_detail.request_quote')}</Button>
                {p.downloads[0] && <Button href={p.downloads[0].file} size="lg" variant="secondary" arrow="external">{t('product_detail.download_brochure')}</Button>}
              </motion.div>
            </div>
          </div>

          <div className="lg:col-span-7">
            <ExposureReveal immediate delay={0.2}>
              <TiltStage tilt={3}>
              <Lightbox image={hero} alt={p.name} priority sizes="(min-width:1024px) 55vw, 100vw" className="aspect-[5/4]" pad="p-[10%]"
                annotations={{
                  tl: <>{p.name}<br />{p.categoryLabel}</>,
                  tr: firstSpec.length ? <>{firstSpec.map(s => <div key={s}>{s}</div>)}</> : undefined,
                  bl: <>Edusoft Healthcare</>,
                  br: <>{String(p.images.length).padStart(2, '0')} · {t('product_detail.gallery')}</>,
                }} />
              </TiltStage>
            </ExposureReveal>
          </div>
        </div>

        {/* Highlights band */}
        {p.highlights.length > 0 && (
          <div className="border-t border-line">
            <dl className="container-x grid grid-cols-1 divide-y divide-line sm:grid-cols-3 sm:divide-x sm:divide-y-0">
              {p.highlights.map(h => (
                <div key={h.label} className="py-7 sm:px-8 sm:first:pl-0">
                  <dt className="dicom order-2">{h.label}</dt>
                  <dd className="mt-2 flex items-baseline gap-1.5 font-display">
                    <Counter value={h.value} className="text-[clamp(2.25rem,1.6rem+1.8vw,3.25rem)] font-normal leading-none tracking-[-0.04em]" />
                    {h.unit && <span className="text-xl text-muted">{h.unit}</span>}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        )}
      </section>

      <LocalNav items={sections} label={t('product_detail.local_nav')} action={<Button to={quoteHref} size="sm">{t('product_detail.request_quote')}</Button>} />

      {/* ── Overview ── */}
      <section id="overview" className="section-y scroll-mt-32 bg-bg">
        <div className="container-x grid gap-12 lg:grid-cols-12">
          <Reveal className="lg:col-span-3"><Eyebrow index="01">{t('product_detail.overview')}</Eyebrow></Reveal>
          <div className="lg:col-span-9">
            <Reveal><p className="font-display text-display-sm font-normal leading-[1.35] text-fg">{p.overview}</p></Reveal>
            {p.applications.length > 0 && (
              <Reveal delay={0.1} className="mt-12">
                <p className="eyebrow mb-4">{t('product_detail.applications')}</p>
                <ul className="flex flex-wrap gap-2">
                  {p.applications.map(a => <li key={a} className="chip">{a}</li>)}
                </ul>
              </Reveal>
            )}
          </div>
        </div>
      </section>

      {/* ── Viewer / gallery ── */}
      {(spinFrames || galleryImages.length > 1) && (
        <section id="gallery" className="scroll-mt-32 bg-surface py-16 sm:py-24">
          <div className="container-x grid gap-10 lg:grid-cols-12">
            <div className="lg:col-span-3">
              <Reveal><Eyebrow index="02">{t('product_detail.gallery')}</Eyebrow></Reveal>
              {spinFrames && <Reveal delay={0.1}><p className="mt-5 max-w-xs text-sm text-muted">{p.spin!.label} · {t('product_detail.viewer_hint')}</p></Reveal>}
            </div>
            <div className="space-y-6 lg:col-span-9">
              {spinFrames && spinFrames.length > 1 && (
                <MultiAngleViewer frames={spinFrames} alt={p.name} label={`${p.name} · ${p.spin!.label}`} className="aspect-[4/3]" />
              )}
              {galleryImages.length > 1 && <ProductGallery images={galleryImages} name={p.name} />}
            </div>
          </div>
        </section>
      )}

      {/* ── Features ── */}
      {p.keyFeatures.length > 0 && (
        <section id="features" className="section-y scroll-mt-32 bg-bg">
          <div className="container-x">
            <SectionHeader index="03" eyebrow={t('product_detail.key_features')} title={p.tagline || p.name} />
            <RevealGroup as="ol" className="grid gap-px overflow-hidden rounded-lg bg-line sm:grid-cols-2 lg:grid-cols-3">
              {p.keyFeatures.map((f, i) => (
                <RevealItem as="li" key={f} className="flex gap-5 bg-bg p-6 sm:p-7">
                  <span className="font-mono text-[11px] text-brand">{String(i + 1).padStart(2, '0')}</span>
                  <p className="text-[15px] leading-relaxed">{f}</p>
                </RevealItem>
              ))}
            </RevealGroup>
          </div>
        </section>
      )}

      {/* ── Specifications ── */}
      <section id="specifications" className="section-y scroll-mt-32 bg-surface">
        <div className="container-x grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <div className="lg:sticky lg:top-[calc(var(--header-h)+5rem)]">
              <Reveal><Eyebrow index="04">{t('product_detail.specifications')}</Eyebrow></Reveal>
              <h2 className="mt-5 font-display text-display-md font-medium">{p.name}</h2>
              <p className="mt-5 text-sm text-muted">{t('product_detail.spec_note')}</p>
              <Lightbox image={hero} alt="" sizes="30vw" className="mt-8 hidden aspect-square lg:block" />
            </div>
          </div>
          <div className="lg:col-span-8">
            {p.specGroups.length > 0 ? <SpecTable groups={p.specGroups} /> : (
              <div className="rounded-lg bg-bg p-8 shadow-hairline">
                <p className="text-lede">{t('product_detail.no_specs')}</p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <Button to={quoteHref} arrow>{t('product_detail.request_quote')}</Button>
                  {p.downloads[0] && <Button href={p.downloads[0].file} variant="secondary" arrow="external">{t('product_detail.download_brochure')}</Button>}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── Downloads ── */}
      {p.downloads.length > 0 && (
        <section id="downloads" className="scroll-mt-32 bg-bg py-16 sm:py-24">
          <div className="container-x grid gap-8 lg:grid-cols-12">
            <Reveal className="lg:col-span-3"><Eyebrow index="05">{t('product_detail.downloads')}</Eyebrow></Reveal>
            <ul className="grid gap-3 sm:grid-cols-2 lg:col-span-9">
              {p.downloads.map(d => (
                <li key={d.file}>
                  <a href={d.file} target="_blank" rel="noopener noreferrer"
                    className="group flex items-center gap-5 rounded-lg bg-surface p-5 shadow-hairline transition-shadow hover:shadow-lift">
                    <span className="grid h-12 w-12 shrink-0 place-items-center rounded-sm bg-fg/[0.06]"><FileText size={20} strokeWidth={1.5} aria-hidden /></span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate font-medium">{d.name}</span>
                      <span className="dicom">{t('product_detail.pdf')} · edusofthealth.com</span>
                    </span>
                    <ArrowUpRight size={18} aria-hidden className="text-muted transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-fg" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* ── Service promise ── */}
      <section className="bg-bg pb-16 sm:pb-24">
        <div className="container-x">
          <div data-tone="ink" className="grid gap-8 rounded-xl bg-bg p-8 sm:p-12 lg:grid-cols-12 lg:items-center">
            <p className="font-display text-display-sm lg:col-span-6">{t('product_detail.service_title')}</p>
            <p className="text-muted lg:col-span-4">{t('product_detail.service_body')}</p>
            <div className="lg:col-span-2 lg:text-right"><Button to="/services" variant="solid" size="sm" arrow>{t('product_detail.service_cta')}</Button></div>
          </div>
        </div>
      </section>

      {/* ── Related ── */}
      {(p.siblings.length > 0 || p.relatedProducts.length > 0) && (
        <section className="section-y border-t border-line bg-surface">
          <div className="container-x">
            <SectionHeader eyebrow={p.siblings.length ? t('product_detail.family', { category: p.categoryLabel }) : t('product_detail.related')}
              title={t('product_detail.related')}
              action={<Button to={`/portfolio?category=${p.category}`} variant="ghost" arrow>{t('nav.view_all_in', { category: p.categoryLabel })}</Button>} />
            <RevealGroup as="ul" className="grid grid-cols-2 gap-x-3 gap-y-10 sm:gap-x-5 md:grid-cols-4">
              {[...p.siblings, ...p.relatedProducts.filter(r => !p.siblings.some(s => s.slug === r.slug))].slice(0, 4).map((r, i) => (
                <RevealItem as="li" key={r.slug}><ProductCard product={r} index={i} compare /></RevealItem>
              ))}
            </RevealGroup>
          </div>
        </section>
      )}

      <ClosingCTA title={t('product_detail.quote_title', { name: p.name })} body={t('product_detail.quote_body')} />
    </>
  );
}

function DetailSkeleton() {
  return (
    <div data-tone="ink" className="min-h-[100svh] bg-bg pt-[var(--header-h)]" aria-busy="true">
      <div className="container-x grid gap-10 pt-16 lg:grid-cols-12">
        <div className="space-y-5 lg:col-span-5 lg:pt-40">
          <div className="skeleton h-3 w-32" />
          <div className="skeleton h-16 w-4/5" />
          <div className="skeleton h-6 w-3/5" />
        </div>
        <div className="skeleton aspect-[5/4] rounded-lg lg:col-span-7" />
      </div>
    </div>
  );
}
