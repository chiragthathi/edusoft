import type { MediaImage } from '../lib/types';
import site from './siteMedia.json';

/** Hand-picked processed images used in editorial sections (see media-manifest.json). */
const m = (src: string, w: number, h: number, widths: number[], bg: MediaImage['bg']): MediaImage => ({ src, w, h, widths, bg, kind: 'studio' });

export const STORY = {
  generate: m('/media/p/eray-50kw-motorized-mobile/00', 405, 398, [320, 405], 'white'),
  capture: m('/media/p/eray-gold-100/01', 407, 496, [320, 407], 'alpha'),
  process: m('/media/p/pacs-ris/00', 500, 500, [320, 500], 'photo'),
  deliver: m('/media/p/trimax-tx65/00', 780, 1276, [320, 640, 780], 'white'),
  mobileInUse: m('/media/p/eray-40kw-digital-mobile/03', 500, 500, [320, 500], 'photo'),
  mobileInUse2: m('/media/p/eray-40kw-digital-mobile/04', 500, 500, [320, 500], 'photo'),
  cArmMotion: m('/media/p/eray-smart-5c-premium-pro/02', 1190, 1271, [320, 640, 960], 'white'),
  handheldKit: m('/media/p/eray-smart-5hs/01', 1560, 1163, [320, 640, 960], 'white'),
  vision: m('/media/p/ai-optics-vision-screener/02', 1000, 1000, [320, 640, 960], 'white'),
  drInUse: m('/media/p/trimax-dr/01', 720, 720, [320, 640, 720], 'white'),
};

type SiteKey = keyof typeof site;
/** Layout imagery (banners, team, partner logos) from siteMedia.json. */
export const siteImage = (key: SiteKey): MediaImage => ({ ...(site[key] as Omit<MediaImage, 'kind'>), kind: 'site' });
