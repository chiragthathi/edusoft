/**
 * Catalog service — joins products.json, categories.json and the generated
 * media-manifest.json (client/scripts/build_media.py) into API-ready shapes.
 *
 * Backward compatibility: every product still exposes the original fields
 * (image, gallery, categoryLabel, specifications, clinicalUseCases, downloads)
 * so older clients keep working, alongside the richer v2 fields.
 */
const path = require('path');
const fs = require('fs');

const DATA = path.join(__dirname, '..', 'data');
const read = (f) => JSON.parse(fs.readFileSync(path.join(DATA, f), 'utf8'));

const products = read('products.json');
const categories = read('categories.json').sort((a, b) => a.order - b.order);
let manifest = { products: {}, site: {} };
try { manifest = read('media-manifest.json'); } catch {
  console.warn('[catalog] media-manifest.json missing — run `python scripts/build_media.py` in client/');
}

const categoryById = new Map(categories.map(c => [c.id, c]));
const bySlug = new Map(products.map(p => [p.slug, p]));
const aliases = new Map();
for (const p of products) for (const s of p.legacySlugs || []) aliases.set(s, p.slug);

/** Largest generated WebP for a manifest entry — used for legacy `image` fields and OG tags. */
const bestUrl = (m) => m ? `${m.src}-${m.widths[m.widths.length - 1]}.webp` : null;

function imagesFor(slug) {
  return (manifest.products[slug] || []).map(({ lqip, ...m }) => (lqip ? { ...m, lqip } : m));
}

function summarize(p) {
  const images = imagesFor(p.slug);
  const cat = categoryById.get(p.category);
  return {
    id: p.id,
    slug: p.slug,
    name: p.name,
    series: p.series,
    category: p.category,
    categoryLabel: cat ? cat.label : p.category,
    tagline: p.tagline,
    shortDescription: p.shortDescription,
    highlights: p.highlights || [],
    featured: !!p.featured,
    downloads: p.downloads || [],
    image: bestUrl(images[0]),
    images: images.slice(0, 1),
  };
}

function detail(p) {
  const images = imagesFor(p.slug);
  const cat = categoryById.get(p.category);
  const specGroups = p.specGroups || [];
  // Legacy flat spec map (first occurrence wins) for older consumers.
  const specifications = {};
  for (const g of specGroups) for (const [k, v] of g.rows) if (!(k in specifications)) specifications[k] = v;
  return {
    ...summarize(p),
    overview: p.overview,
    keyFeatures: p.keyFeatures || [],
    applications: p.applications || [],
    clinicalUseCases: p.applications || [],
    specGroups,
    specifications,
    downloads: p.downloads || [],
    sourceUrl: p.sourceUrl,
    spin: p.spin || null,
    images,
    gallery: images.map(bestUrl),
    category: p.category,
    categoryMeta: cat || null,
    relatedProducts: (p.relatedProducts || []).map(s => bySlug.get(s)).filter(Boolean).map(summarize),
    siblings: products.filter(o => o.category === p.category && o.slug !== p.slug).map(summarize),
  };
}

function haystack(p) {
  const cat = categoryById.get(p.category);
  return [
    p.name, p.series, p.tagline, p.shortDescription, cat && cat.label,
    ...(p.keyFeatures || []), ...(p.applications || []),
    ...(p.specGroups || []).flatMap(g => g.rows.flat()),
  ].filter(Boolean).join(' ').toLowerCase();
}

module.exports = {
  categories: () => categories.map(c => {
    const count = products.filter(p => p.category === c.id).length;
    const heroImg = (manifest.products[c.hero] || [])[0];
    return { id: c.id, label: c.label, group: c.group, tagline: c.tagline, description: c.description, count, heroSlug: c.hero, heroImage: heroImg ? { ...heroImg, lqip: undefined } : null };
  }),
  list({ category, search, featured } = {}) {
    let result = products;
    if (category && category !== 'all') result = result.filter(p => p.category === category);
    if (featured) result = result.filter(p => p.featured);
    if (search) {
      const terms = String(search).toLowerCase().split(/\s+/).filter(Boolean);
      result = result.filter(p => { const h = haystack(p); return terms.every(t => h.includes(t)); });
    }
    const order = new Map(categories.map((c, i) => [c.id, i]));
    return [...result].sort((a, b) => order.get(a.category) - order.get(b.category)).map(summarize);
  },
  /** Returns { product, canonicalSlug } — canonicalSlug differs when a legacy slug was requested. */
  find(slug) {
    const canonical = bySlug.has(slug) ? slug : aliases.get(slug);
    if (!canonical) return null;
    return { product: detail(bySlug.get(canonical)), canonicalSlug: canonical };
  },
  site: () => manifest.site,
  allSlugs: () => products.map(p => p.slug),
};
