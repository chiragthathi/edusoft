const ORIGIN = 'https://edusofthealth.com';

/**
 * Per-route head tags. React 19 hoists <title>, <meta> and <link> rendered
 * anywhere in the tree into <head>, and removes them on unmount.
 */
export default function Seo({ title, description, path, image, jsonLd, noindex }: {
  title: string;
  description?: string;
  path?: string;
  image?: string | null;
  jsonLd?: Record<string, unknown> | Record<string, unknown>[];
  noindex?: boolean;
}) {
  const full = title.includes('Edusoft') ? title : `${title} | Edusoft Healthcare`;
  const url = path != null ? ORIGIN + path : undefined;
  const img = image ? (image.startsWith('http') ? image : ORIGIN + image) : undefined;
  return (
    <>
      <title>{full}</title>
      {description && <meta name="description" content={description} />}
      {url && <link rel="canonical" href={url} />}
      <meta property="og:title" content={full} />
      {description && <meta property="og:description" content={description} />}
      {url && <meta property="og:url" content={url} />}
      {img && <meta property="og:image" content={img} />}
      {noindex && <meta name="robots" content="noindex" />}
      {jsonLd && <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>}
    </>
  );
}
