import { Helmet } from 'react-helmet-async';

interface SEOHeadProps {
  title: string;
  description?: string;
  canonical?: string;
  image?: string;
  url?: string;
  jsonLd?: Record<string, unknown>;
}

const SEOHead = ({ title, description, canonical, image, url, jsonLd }: SEOHeadProps) => {
  const abs = (u?: string) => {
    if (!u) return undefined;
    if (/^https?:/i.test(u)) return u;
    try { return new URL(u, window.location.origin).toString(); } catch { return u; }
  };
  const absImage = abs(image);
  const absUrl = abs(url) || (typeof window !== 'undefined' ? window.location.href : undefined);

  return (
    <Helmet>
      <title>{title}</title>
      {description && <meta name="description" content={description} />}
      {canonical && <link rel="canonical" href={canonical} />}
      <meta property="og:title" content={title} />
      {description && <meta property="og:description" content={description} />}
      <meta property="og:type" content="website" />
      {absUrl && <meta property="og:url" content={absUrl} />}
      {absImage && <meta property="og:image" content={absImage} />}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      {description && <meta name="twitter:description" content={description} />}
      {absImage && <meta name="twitter:image" content={absImage} />}
      {jsonLd && (
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      )}
    </Helmet>
  );
};

export default SEOHead;
