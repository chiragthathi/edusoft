/**
 * Motion tokens (mirrors --motion-* / --ease-* in tokens.css).
 * One vocabulary for every animated surface — documented in docs/MOTION_SYSTEM.md.
 */
import type { Transition, Variants } from 'framer-motion';

export const ease = {
  out: [0.16, 1, 0.3, 1] as const,        // arrivals, reveals
  inOut: [0.65, 0, 0.35, 1] as const,     // state changes, page transitions
  spring: [0.34, 1.56, 0.64, 1] as const, // micro feedback only
};

export const dur = { fast: 0.18, normal: 0.36, slow: 0.72, cinematic: 1.2 };

export const t = {
  reveal: { duration: dur.slow, ease: ease.out } satisfies Transition,
  state: { duration: dur.normal, ease: ease.inOut } satisfies Transition,
  cinematic: { duration: dur.cinematic, ease: ease.out } satisfies Transition,
};

/** Standard section reveal: 24px rise + fade. */
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: t.reveal },
};

/** Parent that staggers children using `fadeUp`. */
export const stagger = (gap = 0.08, delay = 0): Variants => ({
  hidden: {},
  show: { transition: { staggerChildren: gap, delayChildren: delay } },
});

/** Headline line mask: each line slides up from behind a clip. */
export const lineUp: Variants = {
  hidden: { y: '105%' },
  show: { y: '0%', transition: { duration: dur.slow + 0.2, ease: ease.out } },
};

/** Route transition. */
export const page: Variants = {
  initial: { opacity: 1 },
  enter: { opacity: 1, transition: { duration: 0.7 } },
  // Hold the old page while the curtain covers it.
  exit: { opacity: 1, transition: { duration: 0.45 } },
};

export const viewportOnce = { once: true, margin: '0px 0px -12% 0px' } as const;
