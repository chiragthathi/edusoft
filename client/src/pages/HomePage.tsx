import { useTranslation } from 'react-i18next';
import { useHeaderTone } from '../context/HeaderTone';
import { newsApi, productsApi } from '../lib/api';
import { useAsync } from '../lib/useAsync';
import Seo from '../components/ui/Seo';
import SectionHeader from '../components/ui/SectionHeader';
import Button from '../components/ui/Button';
import { RevealGroup, RevealItem } from '../components/motion/Reveal';
import HomeHero from '../components/home/HomeHero';
import HomeIntro from '../components/home/HomeIntro';
import Ecosystem from '../components/home/Ecosystem';
import TechStory from '../components/home/TechStory';
import FeaturedRail from '../components/home/FeaturedRail';
import ClinicalSettings from '../components/home/ClinicalSettings';
import ServiceBand from '../components/home/ServiceBand';
import WhyEdusoft from '../components/home/WhyEdusoft';
import Deployments from '../components/home/Deployments';
import Voices from '../components/home/Voices';
import ClosingCTA from '../components/home/ClosingCTA';
import NewsCard from '../components/news/NewsCard';

/**
 * Narrative: hero → who we are → ecosystem → how the technology works →
 * flagship systems → where they're used → how we support them → why trust us
 * → proof at scale → customer voices → news → call to action.
 */
export default function HomePage() {
  const { t, i18n } = useTranslation();
  useHeaderTone('ink');
  const { data: catalog } = useAsync(() => Promise.all([productsApi.getCategories(), productsApi.getAll()]), []);
  const { data: news } = useAsync(() => newsApi.getAll({ lang: i18n.resolvedLanguage }), [i18n.resolvedLanguage]);
  const [categories, products] = catalog ?? [[], []];

  return (
    <>
      <Seo
        title="Edusoft Healthcare | Medical Imaging Technology — X-Ray, C-Arm, DR & CR"
        description="Edusoft Healthcare designs, manufactures and supports medical imaging technology — handheld, mobile and fixed X-ray, surgical C-Arms, DR detectors, CR systems and medical printers."
        path="/"
      />
      <HomeHero />
      <HomeIntro />
      {categories.length > 0 && <Ecosystem categories={categories} />}
      <TechStory />
      {products.length > 0 && <FeaturedRail products={products.filter(p => p.featured)} />}
      {products.length > 0 && <ClinicalSettings products={products} />}
      <ServiceBand />
      <WhyEdusoft />
      <Deployments />
      <Voices />

      {news && news.length > 0 && (
        <section className="section-y bg-surface" aria-labelledby="news-title">
          <div className="container-x">
            <SectionHeader index="10" eyebrow={t('home.news.eyebrow')} title={<span id="news-title">{t('home.news.title')}</span>}
              action={<Button to="/news" variant="ghost" arrow>{t('home.news.all')}</Button>} />
            <RevealGroup className="grid gap-x-6 gap-y-12 md:grid-cols-3">
              {news.slice(0, 3).map(a => <RevealItem key={a.id}><NewsCard article={a} /></RevealItem>)}
            </RevealGroup>
          </div>
        </section>
      )}

      <ClosingCTA />
    </>
  );
}
