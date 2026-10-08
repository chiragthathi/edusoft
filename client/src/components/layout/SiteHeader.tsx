import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown, Menu, Moon, Sun } from 'lucide-react';
import { cn } from '../../lib/utils';
import { ease } from '../../lib/motion';
import { productsApi } from '../../lib/api';
import { useAsync } from '../../lib/useAsync';
import { useTheme } from '../../context/ThemeContext';
import { useHeaderToneValue } from '../../context/HeaderTone';
import Logo from '../ui/Logo';
import Button from '../ui/Button';
import LanguageSwitcher from './LanguageSwitcher';
import MegaMenu from './MegaMenu';
import MobileMenu from './MobileMenu';
import { ScrollProgress } from '../motion/Interactive';

export const NAV = [
  { key: 'nav.services', to: '/services' },
  { key: 'nav.about', to: '/about' },
  { key: 'nav.news', to: '/news' },
  { key: 'nav.careers', to: '/careers' },
  { key: 'nav.support', to: '/support' },
];

export default function SiteHeader() {
  const { t } = useTranslation();
  const { theme, toggleTheme } = useTheme();
  const tone = useHeaderToneValue();
  const { pathname, search } = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [mega, setMega] = useState(false);
  const [mobile, setMobile] = useState(false);
  const closeTimer = useRef<number | undefined>(undefined);
  const panelRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  // Catalogue for the mega menu (cached, shared with pages).
  const { data } = useAsync(() => Promise.all([productsApi.getCategories(), productsApi.getAll()]), []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close menus on navigation.
  useEffect(() => { setMega(false); setMobile(false); }, [pathname, search]);

  useEffect(() => {
    if (!mega) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') { setMega(false); triggerRef.current?.focus(); } };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [mega]);

  const openMega = () => { window.clearTimeout(closeTimer.current); setMega(true); };
  const scheduleClose = () => { closeTimer.current = window.setTimeout(() => setMega(false), 160); };

  const solid = scrolled || mega;
  const inkTone = tone === 'ink' && !solid;
  const productsActive = pathname.startsWith('/portfolio');

  return (
    <>
      <header
        data-tone={inkTone ? 'ink' : undefined}
        className={cn(
          'fixed inset-x-0 top-0 z-40 transition-[background-color,box-shadow,backdrop-filter] duration-normal ease-out',
          solid ? 'bg-bg/80 shadow-[0_1px_0_rgb(var(--line)/var(--line-a))] backdrop-blur-xl backdrop-saturate-150' : 'bg-transparent',
        )}
        onMouseLeave={mega ? scheduleClose : undefined}
      >
        <div className="container-x flex h-[var(--header-h)] items-center gap-6">
          <Link to="/" aria-label="Edusoft Healthcare — home" className="shrink-0 rounded-sm">
            <Logo tone={inkTone ? 'light' : 'auto'} className="h-7 sm:h-8" />
          </Link>

          <nav aria-label={t('nav.main_nav_aria')} className="ml-6 hidden flex-1 lg:block">
            <ul className="flex items-center gap-1 text-[14px]">
              <li onMouseEnter={openMega}>
                <button
                  ref={triggerRef}
                  type="button"
                  aria-expanded={mega}
                  aria-controls="mega-panel"
                  onClick={() => setMega(m => !m)}
                  className={cn('group flex h-9 items-center gap-1 rounded-full px-3.5 transition-colors', productsActive || mega ? 'text-fg' : 'text-fg/70 hover:text-fg')}
                >
                  {t('nav.products')}
                  <ChevronDown size={14} strokeWidth={1.75} aria-hidden className={cn('transition-transform duration-normal ease-out', mega && 'rotate-180')} />
                </button>
              </li>
              {NAV.map(item => (
                <li key={item.to} onMouseEnter={mega ? scheduleClose : undefined}>
                  <NavLink
                    to={item.to}
                    className={({ isActive }) => cn(
                      'relative flex h-9 items-center rounded-full px-3.5 transition-colors',
                      isActive ? 'text-fg' : 'text-fg/70 hover:text-fg',
                    )}
                  >
                    {({ isActive }) => (
                      <>
                        {t(item.key)}
                        {isActive && <motion.span layoutId="nav-indicator" className="absolute inset-x-3.5 -bottom-px h-px bg-fg" transition={{ duration: 0.4, ease: ease.out }} />}
                      </>
                    )}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>

          <div className="ml-auto flex items-center gap-1 sm:gap-2">
            <LanguageSwitcher className="hidden sm:block" />
            <button
              type="button"
              onClick={toggleTheme}
              aria-label={theme === 'dark' ? t('nav.theme_light') : t('nav.theme_dark')}
              className="grid h-9 w-9 place-items-center rounded-full opacity-80 transition-opacity hover:opacity-100"
            >
              {theme === 'dark' ? <Sun size={16} strokeWidth={1.6} /> : <Moon size={16} strokeWidth={1.6} />}
            </button>
            <NavLink to="/contact" className="hidden h-9 items-center px-3 text-[14px] text-fg/70 transition-colors hover:text-fg xl:flex">
              {t('nav.contact')}
            </NavLink>
            <Button to="/contact?type=quote" size="sm" variant={inkTone ? 'solid' : 'primary'} className="hidden md:inline-flex">
              {t('nav.requestQuote')}
            </Button>
            <button
              type="button"
              onClick={() => setMobile(true)}
              aria-label={t('nav.open_menu')}
              aria-expanded={mobile}
              aria-controls="mobile-menu"
              className="grid h-10 w-10 place-items-center rounded-full lg:hidden"
            >
              <Menu size={20} strokeWidth={1.6} />
            </button>
          </div>
        </div>

        {solid && !mega && <ScrollProgress className="absolute inset-x-0 bottom-0" />}

        <AnimatePresence>
          {mega && data && (
            <motion.div
              id="mega-panel"
              ref={panelRef}
              onMouseEnter={openMega}
              initial={{ opacity: 0, clipPath: 'inset(0 0 100% 0)' }}
              animate={{ opacity: 1, clipPath: 'inset(0 0 0% 0)' }}
              exit={{ opacity: 0, clipPath: 'inset(0 0 100% 0)' }}
              transition={{ duration: 0.38, ease: ease.out }}
              className="absolute inset-x-0 top-full hidden border-t border-line bg-bg/95 shadow-float backdrop-blur-xl lg:block"
            >
              <MegaMenu categories={data[0]} products={data[1]} onNavigate={() => setMega(false)} />
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Dim page behind the open mega menu */}
      <AnimatePresence>
        {mega && (
          <motion.div
            aria-hidden
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={() => setMega(false)}
            className="fixed inset-0 z-30 hidden bg-ink-950/25 backdrop-blur-[2px] lg:block"
          />
        )}
      </AnimatePresence>

      <MobileMenu open={mobile} onClose={() => setMobile(false)} categories={data?.[0] ?? []} />
    </>
  );
}
