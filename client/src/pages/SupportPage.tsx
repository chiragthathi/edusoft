import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowUpRight, FileText, Mail, Phone, Plus, Search } from 'lucide-react';
import { faqsApi, productsApi } from '../lib/api';
import { useAsync } from '../lib/useAsync';
import type { Faq } from '../lib/types';
import { cn } from '../lib/utils';
import { ease } from '../lib/motion';
import Seo from '../components/ui/Seo';
import PageHeader from '../components/ui/PageHeader';
import SectionHeader from '../components/ui/SectionHeader';
import { Reveal } from '../components/motion/Reveal';
import RequestForm from '../components/form/RequestForm';

function FaqItem({ faq, open, onToggle }: { faq: Faq; open: boolean; onToggle: () => void }) {
  const id = `faq-${faq.id}`;
  return (
    <li className="border-b border-line">
      <h3>
        <button type="button" onClick={onToggle} aria-expanded={open} aria-controls={id} className="flex w-full items-start justify-between gap-6 py-5 text-left">
          <span className="text-[17px] font-medium">{faq.question}</span>
          <Plus size={18} strokeWidth={1.5} aria-hidden className={cn('mt-1 shrink-0 text-muted transition-transform duration-normal ease-out', open && 'rotate-45')} />
        </button>
      </h3>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div id={id} initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.35, ease: ease.out }} className="overflow-hidden">
            <p className="max-w-2xl pb-6 leading-relaxed text-muted">{faq.answer}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </li>
  );
}

export default function SupportPage() {
  const { t } = useTranslation();
  const [q, setQ] = useState('');
  const [open, setOpen] = useState<string | null>(null);
  const { data: faqs } = useAsync(() => faqsApi.getAll(), []);
  const { data: products } = useAsync(() => productsApi.getAll(), []);
  // Brochures are the published downloads of every product (deduplicated).
  const brochures = useMemo(() => {
    if (!products) return undefined;
    const seen = new Set<string>();
    return products.flatMap(p => p.downloads.map(dl => ({ ...dl, product: p.name, category: p.categoryLabel })))
      .filter(dl => (seen.has(dl.file) ? false : (seen.add(dl.file), true)));
  }, [products]);

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    return (faqs ?? []).filter(f => !s || f.question.toLowerCase().includes(s) || f.answer.toLowerCase().includes(s));
  }, [faqs, q]);

  return (
    <>
      <Seo title="Support — FAQ, Brochures & Service Requests" description="Edusoft Healthcare support: answers to common questions, product brochures, and service requests. Toll free 1800-120-280-280." path="/support" />
      <PageHeader
        eyebrow={t('support_page.eyebrow')}
        title={t('support_page.title')}
        sub={t('support_page.subtitle')}
        aside={
          <div className="grid gap-3 sm:grid-cols-2">
            <a href="tel:1800120280280" className="group rounded-lg bg-surface p-5 shadow-hairline transition-shadow hover:shadow-lift">
              <Phone size={16} className="text-brand" aria-hidden />
              <span className="dicom mt-6 block">{t('support_page.toll_free')}</span>
              <span className="block font-display text-xl tabular-nums">1800-120-280-280</span>
            </a>
            <a href="mailto:info@edusofthealth.com" className="group rounded-lg bg-surface p-5 shadow-hairline transition-shadow hover:shadow-lift">
              <Mail size={16} className="text-brand" aria-hidden />
              <span className="dicom mt-6 block">Email</span>
              <span className="block truncate font-display text-xl">info@edusofthealth.com</span>
            </a>
          </div>
        }
      />

      <section id="faq" className="section-y scroll-mt-24 border-t border-line bg-bg" aria-labelledby="faq-title">
        <div className="container-x grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <SectionHeader align="stack" index="01" eyebrow={t('support_page.faq_tag')} title={<span id="faq-title">{t('support_page.faq_headline')}</span>} className="mb-8" />
            <div className="relative">
              <Search size={16} aria-hidden className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
              <input type="search" value={q} onChange={e => setQ(e.target.value)} placeholder={t('support_page.faq_search')} aria-label={t('support_page.search_faqs_aria')} className="control rounded-full pl-11" />
            </div>
          </div>
          <div className="lg:col-span-8">
            <ul className="border-t border-line" aria-live="polite">
              {filtered.map(f => <FaqItem key={f.id} faq={f} open={open === f.id} onToggle={() => setOpen(o => (o === f.id ? null : f.id))} />)}
            </ul>
            {faqs && filtered.length === 0 && <p className="py-10 text-muted">{t('support_page.faq_no_results')}</p>}
          </div>
        </div>
      </section>

      <section id="docs" className="section-y scroll-mt-24 bg-surface" aria-labelledby="docs-title">
        <div className="container-x">
          <SectionHeader index="02" eyebrow={t('support_page.docs_tag')} title={<span id="docs-title">{t('support_page.docs_headline')}</span>} sub={t('support_page.docs_sub')} />
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {(brochures ?? Array.from({ length: 6 }).map(() => null)).map((b, i) => (
              <li key={b?.file ?? i}>
                {b ? (
                  <a href={b.file} target="_blank" rel="noopener noreferrer" className="group flex h-full items-center gap-4 rounded-lg bg-bg p-5 shadow-hairline transition-shadow hover:shadow-lift">
                    <span className="grid h-11 w-11 shrink-0 place-items-center rounded-sm bg-fg/[0.06]"><FileText size={18} strokeWidth={1.5} aria-hidden /></span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate font-medium">{b.name}</span>
                      <span className="dicom block truncate">{b.category} · PDF</span>
                    </span>
                    <ArrowUpRight size={16} aria-hidden className="shrink-0 text-muted transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-fg" />
                  </a>
                ) : <div className="skeleton h-[5.25rem] rounded-lg" />}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section id="request" className="section-y scroll-mt-24 bg-bg" aria-labelledby="request-title">
        <div className="container-x grid gap-12 lg:grid-cols-12">
          <Reveal className="lg:col-span-4">
            <SectionHeader align="stack" index="03" eyebrow={t('support_page.contact_tag')} title={<span id="request-title">{t('support_page.contact_headline')}</span>} className="mb-0" />
          </Reveal>
          <div className="rounded-xl bg-surface p-6 shadow-hairline sm:p-10 lg:col-span-8">
            <RequestForm type="support" />
          </div>
        </div>
      </section>
    </>
  );
}
