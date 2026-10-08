import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { ArrowRight, Check } from 'lucide-react';
import { contactApi, productsApi } from '../../lib/api';
import { useAsync } from '../../lib/useAsync';
import Logo from '../ui/Logo';

const SOCIAL = [
  { label: 'LinkedIn', href: 'https://www.linkedin.com/company/edusoft-healthcare', d: 'M20.45 20.45h-3.55v-5.57c0-1.33-.03-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.36V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13zM7.12 20.45H3.56V9h3.56v11.45z' },
  { label: 'YouTube', href: 'https://www.youtube.com/@edusofthealthcare4809', d: 'M23.5 6.19a3.02 3.02 0 0 0-2.12-2.14C19.5 3.55 12 3.55 12 3.55s-7.5 0-9.38.5A3.02 3.02 0 0 0 .5 6.19C0 8.07 0 12 0 12s0 3.93.5 5.81a3.02 3.02 0 0 0 2.12 2.14c1.87.5 9.38.5 9.38.5s7.5 0 9.38-.5a3.02 3.02 0 0 0 2.12-2.14C24 15.93 24 12 24 12s0-3.93-.5-5.81zM9.55 15.57V8.43L15.82 12l-6.27 3.57z' },
  { label: 'X', href: 'https://twitter.com/Edusoft_Health', d: 'M18.24 2.25h3.31l-7.23 8.26 8.5 11.24h-6.65l-5.21-6.82-5.97 6.82H1.68l7.73-8.84L1.25 2.25H8.1l4.71 6.23 5.43-6.23zm-1.16 17.52h1.83L7.08 4.13H5.12l11.96 15.64z' },
  { label: 'Instagram', href: 'https://www.instagram.com/edusoft_healthcare/', d: 'M12 2.16c3.2 0 3.58.01 4.85.07 3.25.15 4.77 1.69 4.92 4.92.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.15 3.23-1.66 4.77-4.92 4.92-1.27.06-1.64.07-4.85.07s-3.58-.01-4.85-.07c-3.26-.15-4.77-1.7-4.92-4.92C2.17 15.58 2.16 15.2 2.16 12s.01-3.58.07-4.85C2.38 3.92 3.9 2.38 7.15 2.23 8.42 2.17 8.8 2.16 12 2.16zM12 0C8.74 0 8.33.01 7.05.07 2.7.27.27 2.69.07 7.05.01 8.33 0 8.74 0 12s.01 3.67.07 4.95c.2 4.36 2.62 6.78 6.98 6.98C8.33 23.99 8.74 24 12 24s3.67-.01 4.95-.07c4.35-.2 6.78-2.62 6.98-6.98.06-1.28.07-1.69.07-4.95s-.01-3.67-.07-4.95c-.2-4.35-2.62-6.78-6.98-6.98C15.67.01 15.26 0 12 0zm0 5.84a6.16 6.16 0 1 0 0 12.32 6.16 6.16 0 0 0 0-12.32zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.4-11.85a1.44 1.44 0 1 0 0 2.88 1.44 1.44 0 0 0 0-2.88z' },
  { label: 'Facebook', href: 'https://www.facebook.com/edusofthealth', d: 'M24 12.07C24 5.41 18.63 0 12 0S0 5.4 0 12.07C0 18.1 4.39 23.1 10.13 24v-8.44H7.08v-3.49h3.04V9.41c0-3.02 1.8-4.7 4.54-4.7 1.31 0 2.68.24 2.68.24v2.97h-1.5c-1.5 0-1.96.93-1.96 1.89v2.26h3.33l-.53 3.5h-2.8V24C19.62 23.1 24 18.1 24 12.07z' },
];

function Newsletter() {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [state, setState] = useState<'idle' | 'busy' | 'done' | 'error'>('idle');
  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setState('error'); return; }
    setState('busy');
    try { await contactApi.submit({ email, type: 'newsletter', subject: 'Newsletter' }); setState('done'); }
    catch { setState('error'); }
  };
  if (state === 'done') {
    return <p role="status" className="flex items-center gap-2 text-sm text-fg"><Check size={16} className="text-signal" /> {t('footer.newsletter_thanks')}</p>;
  }
  return (
    <form onSubmit={submit} noValidate className="relative max-w-sm">
      <label htmlFor="newsletter" className="sr-only">{t('footer.newsletter_placeholder')}</label>
      <input
        id="newsletter" type="email" autoComplete="email" value={email}
        onChange={e => { setEmail(e.target.value); if (state === 'error') setState('idle'); }}
        placeholder={t('footer.newsletter_placeholder')}
        aria-invalid={state === 'error'}
        className="control h-12 rounded-full pr-14"
      />
      <button type="submit" disabled={state === 'busy'} aria-label={t('footer.newsletter_cta')}
        className="absolute right-1.5 top-1.5 grid h-9 w-9 place-items-center rounded-full bg-fg text-bg transition-transform hover:scale-105 disabled:opacity-50">
        <ArrowRight size={16} />
      </button>
      {state === 'error' && <p className="field-error mt-2">{t('common.email_required')}</p>}
    </form>
  );
}

export default function SiteFooter() {
  const { t } = useTranslation();
  const { data: categories } = useAsync(() => productsApi.getCategories(), []);
  const year = new Date().getFullYear();

  const company = [
    { k: 'footer.links.about', to: '/about' },
    { k: 'footer.links.services', to: '/services' },
    { k: 'footer.links.compliance', to: '/about#compliance' },
    { k: 'footer.links.news', to: '/news' },
    { k: 'footer.links.careers', to: '/careers' },
  ];
  const resources = [
    { k: 'footer.links.support', to: '/support' },
    { k: 'footer.links.faq', to: '/support#faq' },
    { k: 'footer.links.brochures', to: '/support#docs' },
    { k: 'footer.links.compare', to: '/portfolio/compare' },
    { k: 'footer.links.request_quote', to: '/contact?type=quote' },
  ];

  return (
    <footer data-tone="ink" className="relative overflow-hidden bg-bg">
      <div aria-hidden className="grain pointer-events-none absolute inset-0 opacity-[0.035] mix-blend-screen" />
      <div className="container-x relative pt-20 sm:pt-28">
        {/* Top: statement + newsletter */}
        <div className="grid gap-12 pb-16 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <Logo tone="light" className="h-8" />
            <p className="mt-8 max-w-xl font-display text-display-sm text-fg">{t('footer.tagline')}</p>
          </div>
          <div className="lg:col-span-4 lg:col-start-9">
            <p className="font-medium">{t('footer.newsletter_title')}</p>
            <p className="mb-5 mt-1 text-sm text-muted">{t('footer.newsletter_body')}</p>
            <Newsletter />
          </div>
        </div>

        {/* Link columns */}
        <div className="grid grid-cols-2 gap-x-6 gap-y-12 border-t border-line py-14 md:grid-cols-4 lg:grid-cols-12">
          <nav aria-label={t('footer.products')} className="col-span-2 md:col-span-2 lg:col-span-4">
            <p className="eyebrow mb-5">{t('footer.products')}</p>
            <ul className="grid grid-cols-2 gap-x-6 gap-y-2.5 text-sm">
              {(categories ?? []).map(c => (
                <li key={c.id}><Link to={`/portfolio?category=${c.id}`} className="text-muted transition-colors hover:text-fg">{c.label}</Link></li>
              ))}
              <li><Link to="/portfolio" className="text-fg transition-colors hover:text-brand">{t('footer.links.all_products')} →</Link></li>
            </ul>
          </nav>
          <nav aria-label={t('footer.company')} className="lg:col-span-2">
            <p className="eyebrow mb-5">{t('footer.company')}</p>
            <ul className="space-y-2.5 text-sm">
              {company.map(l => <li key={l.to}><Link to={l.to} className="text-muted transition-colors hover:text-fg">{t(l.k)}</Link></li>)}
            </ul>
          </nav>
          <nav aria-label={t('footer.resources')} className="lg:col-span-2">
            <p className="eyebrow mb-5">{t('footer.resources')}</p>
            <ul className="space-y-2.5 text-sm">
              {resources.map(l => <li key={l.to}><Link to={l.to} className="text-muted transition-colors hover:text-fg">{t(l.k)}</Link></li>)}
            </ul>
          </nav>
          <address className="col-span-2 not-italic md:col-span-4 lg:col-span-4">
            <p className="eyebrow mb-5">{t('footer.contact')}</p>
            <div className="grid gap-6 text-sm sm:grid-cols-2">
              <div className="space-y-1.5 text-muted">
                <p className="text-fg">New Delhi · HQ</p>
                <p>{t('footer_contact.address')}</p>
                <a href="tel:1800120280280" className="block text-fg hover:text-brand">{t('footer_contact.phone')}</a>
                <a href="tel:+918851248073" className="block hover:text-fg">{t('footer_contact.phone_intl')}</a>
                <a href={`mailto:${t('footer_contact.email')}`} className="block hover:text-fg">{t('footer_contact.email')}</a>
              </div>
              <div className="space-y-1.5 text-muted">
                <p className="text-fg">Chicago · USA</p>
                <p>3525 West Peterson Ave, Suite 113, Chicago, IL 60659</p>
                <a href="tel:+17733135065" className="block hover:text-fg">{t('footer_contact.phone_usa')}</a>
                <a href="mailto:edusoft.usa@edusofthealth.com" className="block hover:text-fg">edusoft.usa@edusofthealth.com</a>
              </div>
            </div>
          </address>
        </div>

        {/* Oversized wordmark — the last frame of the page */}
        <div aria-hidden className="overflow-hidden">
          <motion.p className="pointer-events-none select-none whitespace-nowrap font-display text-[19vw] font-semibold leading-[0.8] tracking-[-0.06em] text-fg/[0.06] lg:text-[16.5vw]"
            initial={{ y: '60%', opacity: 0 }} whileInView={{ y: '0%', opacity: 1 }} viewport={{ once: true, margin: '0px 0px -5% 0px' }}
            transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}>
            edusoft
          </motion.p>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col gap-6 border-t border-line py-7 text-xs text-muted md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            <span>{t('footer.copyright', { year })}</span>
            <Link to="/privacy" className="hover:text-fg">{t('footer.privacy')}</Link>
            <Link to="/terms" className="hover:text-fg">{t('footer.terms')}</Link>
            <Link to="/cookies" className="hover:text-fg">{t('footer.cookies')}</Link>
            <span className="inline-flex items-center gap-1.5"><span aria-hidden className="h-2 w-3 bg-[linear-gradient(#FF9933_33%,#fff_33%_66%,#138808_66%)]" />{t('footer.made_in_india')}</span>
          </div>
          <div className="flex items-center gap-1">
            {SOCIAL.map(s => (
              <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.label}
                className="grid h-9 w-9 place-items-center rounded-full text-muted transition-colors hover:bg-fg/10 hover:text-fg">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden><path d={s.d} /></svg>
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
