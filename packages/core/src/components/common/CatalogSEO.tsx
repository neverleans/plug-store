import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Product } from '@/types';
import { useSiteConfig } from '@/contexts/SiteConfigContext';

export interface CatalogSEOProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  product?: Product;
}

/**
 * CatalogSEO
 * 
 * Auto-generates OpenGraph, Twitter Cards, Meta description,
 * and Schema.org JSON-LD e-commerce structured data for Google Search.
 */
export const CatalogSEO: React.FC<CatalogSEOProps> = ({
  title,
  description,
  image,
  url,
  product,
}) => {
  const { config } = useSiteConfig();

  const siteTitle = title
    ? `${title} | ${config.companyName || 'PlugStore'}`
    : `${config.companyName || 'PlugStore'} — ${config.tagline || 'Catalog'}`;

  const metaDesc =
    description ||
    product?.description ||
    config.footerText ||
    'Explore our catalog with custom products and fast checkout.';

  const shareImage = image || product?.images?.[0] || config.logoDataUrl || '';
  const currentUrl = url || (typeof window !== 'undefined' ? window.location.href : '');

  // Schema.org JSON-LD structured data for Google rich snippets
  const schemaData = product
    ? {
        '@context': 'https://schema.org/',
        '@type': 'Product',
        name: product.name,
        image: product.images,
        description: product.description,
        sku: product.id,
        offers: {
          '@type': 'Offer',
          url: currentUrl,
          priceCurrency: config.currency || 'BRL',
          price: product.price,
          availability: product.inStock
            ? 'https://schema.org/InStock'
            : 'https://schema.org/OutOfStock',
        },
        aggregateRating: product.rating
          ? {
              '@type': 'AggregateRating',
              ratingValue: product.rating,
              reviewCount: product.reviewCount || 1,
            }
          : undefined,
      }
    : {
        '@context': 'https://schema.org/',
        '@type': 'Organization',
        name: config.companyName || 'PlugStore',
        url: currentUrl,
        logo: config.logoDataUrl,
      };

  return (
    <Helmet>
      {/* Standard Meta Tags */}
      <title>{siteTitle}</title>
      <meta name="description" content={metaDesc} />

      {/* OpenGraph Tags (WhatsApp, Facebook, LinkedIn) */}
      <meta property="og:type" content={product ? 'product' : 'website'} />
      <meta property="og:title" content={siteTitle} />
      <meta property="og:description" content={metaDesc} />
      {shareImage && <meta property="og:image" content={shareImage} />}
      {currentUrl && <meta property="og:url" content={currentUrl} />}
      <meta property="og:site_name" content={config.companyName || 'PlugStore'} />

      {/* Twitter Card Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={siteTitle} />
      <meta name="twitter:description" content={metaDesc} />
      {shareImage && <meta name="twitter:image" content={shareImage} />}

      {/* Structured JSON-LD for Google Rich Results */}
      <script type="application/ld+json">{JSON.stringify(schemaData)}</script>
    </Helmet>
  );
};

export default CatalogSEO;
