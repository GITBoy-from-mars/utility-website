import React from 'react';
import { Helmet } from 'react-helmet-async';
import siteConfig from '../../config/siteConfig';

const SEOHead = ({ title, description, slug = '', keywords = '', toolMeta = null }) => {
  const fullTitle = title || `${siteConfig.name} — ${siteConfig.tagline}`;
  const metaDesc = description || siteConfig.description;
  const canonicalUrl = `${siteConfig.url}${slug}`;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={metaDesc} />
      {keywords && <meta name="keywords" content={keywords} />}
      <link rel="canonical" href={canonicalUrl} />

      {/* Open Graph */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={metaDesc} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={siteConfig.name} />
      <meta property="og:locale" content="en_US" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={metaDesc} />

      {/* Robots */}
      <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large" />

      {/* Additional SEO */}
      <meta name="author" content={siteConfig.company?.name || siteConfig.name} />
      <meta name="generator" content={siteConfig.name} />
      <meta httpEquiv="content-language" content="en" />
    </Helmet>
  );
};

export default SEOHead;
