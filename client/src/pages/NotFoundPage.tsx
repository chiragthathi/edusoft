import { useTranslation } from 'react-i18next';
import { useHeaderTone } from '../context/HeaderTone';
import Seo from '../components/ui/Seo';
import Button from '../components/ui/Button';
import { MaskLines, Reveal } from '../components/motion/Reveal';

/** 404 — framed like an empty detector exposure. */
export default function NotFoundPage() {
  const { t } = useTranslation();
  useHeaderTone('ink');
  return (
    <section data-tone="ink" className="relative grid min-h-[100svh] place-items-center overflow-hidden bg-bg pt-[var(--header-h)]">
      <Seo title="Page not found" noindex />
      <div aria-hidden className="absolute inset-[8%] rounded-xl border border-white/10" />
      <div aria-hidden className="dicom absolute left-[10%] top-[calc(8%+var(--header-h))] text-white/40">NO SIGNAL<br />EXPOSURE 0 mAs</div>
      <div aria-hidden className="dicom absolute bottom-[10%] right-[10%] text-right text-white/40">ERR 404<br />edusofthealth.com</div>
      <div className="container-x relative text-center">
        <p aria-hidden className="font-display text-[clamp(6rem,4rem+12vw,14rem)] font-medium leading-none tracking-[-0.06em] text-fg/10">404</p>
        <MaskLines as="h1" immediate className="mx-auto -mt-6 max-w-2xl font-display text-display-md font-medium sm:-mt-10">
          <span>{t('common.not_found_title')}</span>
        </MaskLines>
        <Reveal delay={0.2}>
          <p className="mx-auto mt-5 max-w-md text-muted">{t('common.not_found_body')}</p>
          <div className="mt-9 flex flex-wrap justify-center gap-3">
            <Button to="/portfolio" arrow>{t('nav.all_products')}</Button>
            <Button to="/" variant="secondary">{t('common.return_home')}</Button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
