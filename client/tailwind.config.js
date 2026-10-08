/**
 * Tailwind is a thin mapping layer over the CSS custom properties defined in
 * src/styles/tokens.css — the tokens are the source of truth. Colours resolve
 * through `rgb(var(--token) / <alpha-value>)` so every utility supports
 * opacity modifiers and re-themes automatically (light / dark / ink tone).
 *
 * @type {import('tailwindcss').Config}
 */
const v = (name) => `rgb(var(--${name}) / <alpha-value>)`;

export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    screens: {
      xs: '400px',
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      '2xl': '1536px',
    },
    extend: {
      colors: {
        bg: v('bg'),
        surface: v('surface'),
        'surface-2': v('surface-2'),
        raised: v('raised'),
        fg: v('fg'),
        muted: v('muted'),
        subtle: v('subtle'),
        line: 'rgb(var(--line) / var(--line-a))',
        'line-strong': 'rgb(var(--line-strong) / var(--line-strong-a))',
        brand: v('brand'),
        'brand-strong': v('brand-strong'),
        'brand-soft': v('brand-soft'),
        'on-brand': v('on-brand'),
        signal: v('signal'),
        danger: v('danger'),
        success: v('success'),
        ink: {
          950: '#05080D',
          900: '#0A0F17',
          850: '#0E141E',
          800: '#131B27',
          700: '#1D2735',
          600: '#2B3748',
        },
        porcelain: {
          50: '#FBFBFA',
          100: '#F4F5F3',
          200: '#E9EBE8',
          300: '#D9DDDA',
        },
      },
      fontFamily: {
        sans: ['var(--font-body)'],
        display: ['var(--font-display)'],
        mono: ['var(--font-mono)'],
        // legacy alias used by untouched markup
        heading: ['var(--font-display)'],
      },
      fontSize: {
        // Fluid display scale (min @360px → max @1440px)
        'display-2xl': ['clamp(3rem, 1.6rem + 6.2vw, 7.25rem)', { lineHeight: '0.95', letterSpacing: '-0.045em' }],
        'display-xl': ['clamp(2.5rem, 1.5rem + 4.4vw, 5.5rem)', { lineHeight: '0.98', letterSpacing: '-0.04em' }],
        'display-lg': ['clamp(2.1rem, 1.45rem + 2.9vw, 4rem)', { lineHeight: '1.02', letterSpacing: '-0.035em' }],
        'display-md': ['clamp(1.75rem, 1.35rem + 1.8vw, 2.75rem)', { lineHeight: '1.08', letterSpacing: '-0.03em' }],
        'display-sm': ['clamp(1.375rem, 1.2rem + 0.8vw, 1.875rem)', { lineHeight: '1.15', letterSpacing: '-0.02em' }],
        lede: ['clamp(1.0625rem, 0.98rem + 0.4vw, 1.3125rem)', { lineHeight: '1.55', letterSpacing: '-0.011em' }],
        eyebrow: ['0.6875rem', { lineHeight: '1', letterSpacing: '0.14em' }],
      },
      spacing: {
        '4.5': '1.125rem',
        '18': '4.5rem',
        '22': '5.5rem',
        '30': '7.5rem',
        '34': '8.5rem',
        '42': '10.5rem',
        section: 'var(--space-section)',
        gutter: 'var(--gutter)',
      },
      maxWidth: {
        container: 'var(--container)',
        prose: '38rem',
        wide: '96rem',
      },
      borderRadius: {
        xs: 'var(--radius-xs)',
        sm: 'var(--radius-sm)',
        md: 'var(--radius-md)',
        lg: 'var(--radius-lg)',
        xl: 'var(--radius-xl)',
      },
      boxShadow: {
        hairline: '0 0 0 1px rgb(var(--line) / var(--line-a))',
        lift: 'var(--shadow-lift)',
        float: 'var(--shadow-float)',
        glow: 'var(--shadow-glow)',
      },
      transitionTimingFunction: {
        out: 'var(--ease-out)',
        'in-out': 'var(--ease-in-out)',
        spring: 'var(--ease-spring)',
      },
      transitionDuration: {
        fast: 'var(--motion-fast)',
        normal: 'var(--motion-normal)',
        slow: 'var(--motion-slow)',
      },
      keyframes: {
        'scan-y': { '0%': { transform: 'translateY(-100%)' }, '100%': { transform: 'translateY(100%)' } },
        pulse: { '0%, 100%': { opacity: '1' }, '50%': { opacity: '.35' } },
        marquee: { '0%': { transform: 'translateX(0)' }, '100%': { transform: 'translateX(-100%)' } },
        shimmer: { '100%': { transform: 'translateX(100%)' } },
      },
      animation: {
        'scan-y': 'scan-y 5.5s var(--ease-in-out) infinite',
        'dot-pulse': 'pulse 2.4s ease-in-out infinite',
        marquee: 'marquee 40s linear infinite',
        shimmer: 'shimmer 1.6s infinite',
      },
    },
  },
  plugins: [],
};
