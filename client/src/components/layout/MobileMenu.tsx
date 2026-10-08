import { useEffect, useRef, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { AnimatePresence, motion } from 'framer-motion';
import { Phone, Plus, X } from 'lucide-react';
import type { Category } from '../../lib/types';
import { cn } from '../../lib/utils';
import { ease } from '../../lib/motion';
import Logo from '../ui/Logo';
import Button from '../ui/Button';
import Picture from '../ui/Picture';
import { LANGUAGES, changeLanguage } from './LanguageSwitcher';
import { NAV } from './SiteHeader';

/**
 * Full-screen mobile navigation. Products expand into a thumbnail list of
 * categories so the ecosystem is legible on a phone, not just a link.
 */
export default function MobileMenu({ open, onClose, categories }: { open: boolean; onClose: () => void; categories: Category[] }) {
  const { t, i18n } = useTranslation();
  const [productsOpen, setProductsOpen] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'Tab' && panelRef.current) {
        // Keep focus inside the dialog.
        const f = panelRef.current.querySelectorAll<HTMLElement>('a[href], button:not([disabled])');
        const first = f[0], last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    };
    document.addEventListener('keydown', onKey);
    return () => { document.body.style.overflow = prev; document.removeEventListener('keydown', onKey); };
  }, [open, onClose]);

  const current = i18n.resolvedLanguage || 'en';

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          id="mobile-menu"
          ref={panelRef}
          role="dialog"
          aria-modal="true"
          aria-label={t('nav.mobile_nav_aria')}
          initial={{ clipPath: 'inset(0 0 100% 0)' }}
          animate={{ clipPath: 'inset(0 0 0% 0)' }}
          exit={{ clipPath: 'inset(0 0 100% 0)' }}
          transition={{ duration: 0.5, ease: ease.inOut }}
          className="fixed inset-0 z-50 flex flex-col bg-bg lg:hidden"
        >
          <div className="container-x flex h-[var(--header-h)] shrink-0 items-center justify-between">
            <Link to="/" onClick={onClose} aria-label="Edusoft Healthcare — home"><Logo className="h-7" /></Link>
            <button ref={closeRef} type="button" onClick={onClose} aria-label={t('nav.close_menu')} className="grid h-10 w-10 place-items-center rounded-full">
              <X size={22} strokeWidth={1.6} />
            </button>
          </div>

          <motion.nav
            aria-label={t('nav.mobile_nav_aria')}
            className="container-x flex-1 overflow-y-auto pb-8 pt-4"
            initial="hidden" animate="show"
            variants={{ hidden: {}, show: { transition: { staggerChildren: 0.05, delayChildren: 0.18 } } }}
          >
            <ul className="divide-y divide-line border-y border-line">
              <motion.li variants={{ hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } }}>
                <button
                  type="button"
                  onClick={() => setProductsOpen(o => !o)}
                  aria-expanded={productsOpen}
                  className="flex w-full items-center justify-between py-4 text-left font-display text-[1.75rem] tracking-tight"
                >
                  {t('nav.products')}
                  <Plus size={20} strokeWidth={1.5} className={cn('transition-transform duration-normal ease-out', productsOpen && 'rotate-45')} aria-hidden />
                </button>
                <AnimatePresence initial={false}>
                  {productsOpen && (
                    <motion.ul
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.36, ease: ease.out }}
                      className="grid grid-cols-2 gap-2 overflow-hidden pb-4"
                    >
                      {categories.map(c => (
                        <li key={c.id}>
                          <Link to={`/portfolio?category=${c.id}`} onClick={onClose} className="flex flex-col gap-2 rounded-md bg-surface p-2 shadow-hairline">
                            <div className="lightbox aspect-[4/3] rounded-sm">
                              {c.heroImage && <Picture image={c.heroImage} alt="" sizes="45vw" className="h-full w-full p-[10%]" />}
                            </div>
                            <span className="px-1 pb-1 text-[13px] font-medium leading-tight">{c.label}</span>
                          </Link>
                        </li>
                      ))}
                      <li className="col-span-2">
                        <Link to="/portfolio" onClick={onClose} className="btn btn-secondary btn-sm w-full">{t('nav.all_products')}</Link>
                      </li>
                    </motion.ul>
                  )}
                </AnimatePresence>
              </motion.li>
              {[...NAV, { key: 'nav.contact', to: '/contact' }].map(item => (
                <motion.li key={item.to} variants={{ hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } }}>
                  <NavLink
                    to={item.to}
                    onClick={onClose}
                    className={({ isActive }) => cn('block py-4 font-display text-[1.75rem] tracking-tight', isActive ? 'text-brand' : 'text-fg')}
                  >
                    {t(item.key)}
                  </NavLink>
                </motion.li>
              ))}
            </ul>

            <div className="mt-8">
              <p className="eyebrow mb-3">{t('nav.language')}</p>
              <div className="flex flex-wrap gap-2">
                {LANGUAGES.map(code => (
                  <button key={code} type="button" aria-pressed={current === code} onClick={() => changeLanguage(i18n, code)} className="chip">
                    {t(`navbar_languages.${code}`)}
                  </button>
                ))}
              </div>
            </div>
          </motion.nav>

          <div className="container-x shrink-0 space-y-3 border-t border-line py-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
            <Button to="/contact?type=quote" className="w-full" arrow>{t('nav.requestQuote')}</Button>
            <a href="tel:1800120280280" className="flex items-center justify-center gap-2 py-1 text-sm text-muted">
              <Phone size={14} aria-hidden /> {t('footer_contact.phone')}
            </a>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
