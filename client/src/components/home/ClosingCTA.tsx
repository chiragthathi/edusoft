import { useTranslation } from 'react-i18next';
import { HERO_PRODUCTS } from '../../content/heroProducts';
import { MaskLines, Parallax, Reveal } from '../motion/Reveal';
import Button from '../ui/Button';
import Picture from '../ui/Picture';

/** Final frame of a page: one statement, two actions, the C-Arm under light. */
export default function ClosingCTA({ title, body }: { title?: string; body?: string }) {
  const { t } = useTranslation();
  const product = HERO_PRODUCTS[2];
  return (
    <section data-tone="ink" className="relative isolate overflow-hidden bg-bg" aria-labelledby="cta-title">
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(50%_60%_at_78%_60%,rgb(64_120_190/0.3),transparent_70%)]" />
      <div className="container-x grid items-center gap-10 py-24 sm:py-32 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <MaskLines className="font-display text-display-xl font-medium">
            <span id="cta-title">{title ?? t('home.cta.title')}</span>
          </MaskLines>
          <Reveal delay={0.15}>
            <p className="lede mt-6 max-w-lg">{body ?? t('home.cta.body')}</p>
            <div className="mt-10 flex flex-wrap gap-3">
              <Button to="/contact?type=quote" size="lg" arrow>{t('home.cta.primary')}</Button>
              <Button to="/contact?type=sales" size="lg" variant="secondary">{t('home.cta.secondary')}</Button>
            </div>
          </Reveal>
        </div>
        <Parallax amount={40} className="lg:col-span-5">
          <Picture image={product.image} alt={product.name} sizes="(min-width:1024px) 36vw, 80vw" className="mx-auto aspect-[3/2] w-full max-w-lg drop-shadow-[0_40px_50px_rgb(0,0,0,0.6)]" />
        </Parallax>
      </div>
    </section>
  );
}
