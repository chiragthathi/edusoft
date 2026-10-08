import { lazy, Suspense, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ThemeProvider } from './context/ThemeContext';
import { HeaderToneProvider } from './context/HeaderTone';
import { CompareProvider } from './context/Compare';
import { IntroProvider } from './context/Intro';
import IntroLoader from './components/layout/IntroLoader';
import { BackToTop } from './components/motion/Interactive';
import { useTranslation } from 'react-i18next';
import SiteHeader from './components/layout/SiteHeader';
import SiteFooter from './components/layout/SiteFooter';
import { ease, page } from './lib/motion';

// Route-level code splitting: each page ships as its own chunk.
const HomePage = lazy(() => import('./pages/HomePage'));
const PortfolioPage = lazy(() => import('./pages/PortfolioPage'));
const ProductDetailPage = lazy(() => import('./pages/ProductDetailPage'));
const ComparePage = lazy(() => import('./pages/ComparePage'));
const ServicesPage = lazy(() => import('./pages/ServicesPage'));
const AboutPage = lazy(() => import('./pages/AboutPage'));
const SupportPage = lazy(() => import('./pages/SupportPage'));
const NewsPage = lazy(() => import('./pages/NewsPage'));
const NewsArticlePage = lazy(() => import('./pages/NewsArticlePage'));
const CareersPage = lazy(() => import('./pages/CareersPage'));
const JobDetailPage = lazy(() => import('./pages/JobDetailPage'));
const ContactPage = lazy(() => import('./pages/ContactPage'));
const LegalPage = lazy(() => import('./pages/LegalPage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));

/** Thin progress line while a route chunk loads. */
function RouteFallback() {
  return (
    <div className="fixed inset-x-0 top-0 z-50 h-0.5 overflow-hidden" role="progressbar" aria-label="Loading">
      <div className="h-full w-1/3 animate-[shimmer_1.1s_infinite] bg-brand" style={{ transform: 'translateX(-100%)' }} />
    </div>
  );
}

/** After a page mounts: jump to #hash targets, otherwise start at the top. */
function useHashScroll() {
  const { hash } = useLocation();
  useEffect(() => {
    if (!hash) return;
    const id = decodeURIComponent(hash.slice(1));
    // Wait a frame for async sections to render.
    const timer = window.setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 120);
    return () => window.clearTimeout(timer);
  }, [hash]);
}

/**
 * Route curtain: an ink panel sweeps up over the outgoing page (exit) and
 * lifts off the incoming one (enter). Driven by the parent route variants.
 */
function Curtain() {
  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[60] flex items-center justify-center bg-[#05080D]"
      variants={{
        initial: { clipPath: 'inset(0% 0% 0% 0%)' },
        enter: { clipPath: 'inset(0% 0% 100% 0%)', transition: { duration: 0.65, ease: ease.inOut, delay: 0.05 } },
        exit: { clipPath: ['inset(100% 0% 0% 0%)', 'inset(0% 0% 0% 0%)'], transition: { duration: 0.45, ease: ease.inOut } },
      }}
    >
      <img src="/media/s/logo-303.webp" alt="" className="h-7 w-auto opacity-70 brightness-0 invert" />
    </motion.div>
  );
}

function AnimatedRoutes() {
  const location = useLocation();
  const reduce = useReducedMotion();
  useHashScroll();

  return (
    <AnimatePresence mode="wait" initial={false} onExitComplete={() => { if (!window.location.hash) window.scrollTo(0, 0); }}>
      <motion.div
        key={location.pathname}
        variants={reduce ? undefined : page}
        initial="initial"
        animate="enter"
        exit="exit"
      >
        {!reduce && <Curtain />}
        <Suspense fallback={<RouteFallback />}>
          <Routes location={location}>
            <Route path="/" element={<HomePage />} />
            <Route path="/portfolio" element={<PortfolioPage />} />
            <Route path="/portfolio/compare" element={<ComparePage />} />
            <Route path="/portfolio/:slug" element={<ProductDetailPage />} />
            <Route path="/services" element={<ServicesPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/support" element={<SupportPage />} />
            <Route path="/news" element={<NewsPage />} />
            <Route path="/news/:slug" element={<NewsArticlePage />} />
            <Route path="/careers" element={<CareersPage />} />
            <Route path="/careers/:slug" element={<JobDetailPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/privacy" element={<LegalPage doc="privacy" />} />
            <Route path="/terms" element={<LegalPage doc="terms" />} />
            <Route path="/cookies" element={<LegalPage doc="cookies" />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Suspense>
      </motion.div>
    </AnimatePresence>
  );
}

function FloatingControls() {
  const { t } = useTranslation();
  return <BackToTop label={t('footer.back_to_top')} />;
}

export default function App() {
  const { t } = useTranslation();
  return (
    <ThemeProvider>
      <IntroProvider>
      <IntroLoader />
      <BrowserRouter>
        <HeaderToneProvider>
          <CompareProvider>
          <div className="flex min-h-dvh flex-col">
            {/* Keyboard-only: invisible until focused with Tab */}
            <a href="#main-content" className="skip-link">{t('common.skip_to_content')}</a>
            <SiteHeader />
            <main id="main-content" tabIndex={-1} className="flex-1 outline-none">
              <AnimatedRoutes />
            </main>
            <SiteFooter />
            <FloatingControls />
          </div>
          </CompareProvider>
        </HeaderToneProvider>
      </BrowserRouter>
      </IntroProvider>
    </ThemeProvider>
  );
}
