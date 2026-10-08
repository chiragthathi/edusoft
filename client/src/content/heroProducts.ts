import type { MediaImage } from '../lib/types';

/**
 * Hero line-up. Transparent cut-outs only (they sit on the dark stage).
 * Readouts are published specifications for each product.
 */
export interface HeroProduct {
  slot: 'handheld' | 'mobile' | 'carm' | 'room';
  slug: string;
  name: string;
  image: MediaImage;
  readout: { tl: string[]; tr: string[]; bl: string[]; br: string[] };
}

const img = (src: string, w: number, h: number, widths: number[]): MediaImage =>
  ({ src, w, h, widths, bg: 'alpha', kind: 'studio' });

export const HERO_PRODUCTS: HeroProduct[] = [
  {
    slot: 'handheld',
    slug: 'eray-smart-6hs',
    name: 'ERAY SMART 6HS',
    image: img('/media/p/eray-smart-6hs/01', 560, 458, [320, 560]),
    readout: { tl: ['ERAY SMART 6HS', 'Handheld X-ray'], tr: ['50–90 kV', '2–10 mA'], bl: ['3.5 kg', '~150 exp / charge'], br: ['SID 100 cm', 'Field 43 × 43 cm'] },
  },
  {
    slot: 'mobile',
    slug: 'eray-smart-t-series',
    name: 'ERAY SMART 4T / 5T / 6T',
    image: img('/media/p/eray-smart-t-series/00', 373, 539, [320, 373]),
    readout: { tl: ['ERAY SMART 4T · 5T · 6T', 'Mobile X-ray'], tr: ['40–125 kV', '0.1–320 mAs'], bl: ['3.5 · 5 · 6 kW', 'HF generator'], br: ['Detector 14 × 17″', '200+ APRs'] },
  },
  {
    slot: 'carm',
    slug: 'eray-smart-5c-gold',
    name: 'ERAY Smart 5C ERAY Gold',
    image: img('/media/p/eray-smart-5c-gold/01', 525, 347, [320, 525]),
    readout: { tl: ['ERAY Smart 5C · ERAY Gold', 'Surgical C-Arm'], tr: ['40–125 kV', 'Pulse fluoroscopy'], bl: ['5 kW HF', 'a-Si / CsI FPD'], br: ['SID 980 mm', 'DICOM 3.0'] },
  },
  {
    slot: 'room',
    slug: 'eray-ceiling-suspended-dr',
    name: 'Ceiling Suspended DR',
    image: img('/media/p/eray-ceiling-suspended-dr/00', 494, 324, [320, 494]),
    readout: { tl: ['ERAY RAD 1000S', 'Ceiling-suspended DR'], tr: ['40–150 kV', '10–1000 mA'], bl: ['80 kW', 'Canon tube · 300 kHU'], br: ['Detector 17 × 17″', '5-axis auto-positioning'] },
  },
];
