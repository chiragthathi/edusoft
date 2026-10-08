/** Responsive image entry produced by scripts/build_media.py */
export interface MediaImage {
  src: string;            // base path, e.g. /media/p/eray-gold-100/00
  widths: number[];       // generated widths, ascending
  w: number;
  h: number;
  bg: 'alpha' | 'white' | 'photo';
  kind: string;           // studio | angle | detail | in-use | motion | packaging | screen | logo …
  lqip?: string | null;   // tiny blurred WebP data URI (primary image only)
}

export interface Highlight { value: string; unit?: string; label: string }
export interface SpecGroup { title: string; rows: [string, string][] }
export interface Download { name: string; file: string }

export interface ProductSummary {
  id: string;
  slug: string;
  name: string;
  series?: string;
  category: string;
  categoryLabel: string;
  tagline?: string;
  shortDescription: string;
  highlights: Highlight[];
  featured: boolean;
  downloads: Download[];
  image: string | null;
  images: MediaImage[];
}

export interface Category {
  id: string;
  label: string;
  group: string;
  tagline: string;
  description: string;
  count: number;
  heroSlug: string;
  heroImage: MediaImage | null;
}

export interface ProductDetail extends ProductSummary {
  overview: string;
  keyFeatures: string[];
  applications: string[];
  specGroups: SpecGroup[];
  specifications: Record<string, string>;
  sourceUrl?: string;
  spin: { frames: number[]; label: string } | null;
  gallery: string[];
  categoryMeta: Omit<Category, 'count' | 'heroImage'> | null;
  relatedProducts: ProductSummary[];
  siblings: ProductSummary[];
  canonicalSlug: string;
}

export interface NewsItem {
  id: string; slug: string; title: string; excerpt: string; body?: string;
  date: string; category: string; author?: string; image: string; tags?: string[];
}

export interface Job {
  id: string; slug: string; title: string; department: string; location: string;
  type: string; experience: string; posted: string; description?: string;
  responsibilities?: string[]; requirements?: string[]; applyUrl?: string;
}

export interface Office {
  id: string; name: string; address: string; city: string; country: string;
  postalCode?: string; phone?: string; tollFree?: string; email?: string; mapUrl?: string;
  coords?: [number, number]; type: string;
}

export interface Faq { id: string; category: string; question: string; answer: string }
