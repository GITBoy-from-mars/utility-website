import React from 'react';
import { Helmet } from 'react-helmet-async';
import siteConfig from '../../config/siteConfig';

const SITE_URL = 'https://utility-website-9xn.pages.dev';
const DEFAULT_OG_IMAGE = `${SITE_URL}/og-default.png`;

const SEOHead = ({ title, description, slug = '', keywords = '', image = '', type = 'website', noindex = false }) => {
  const fullTitle = title
    ? (title.includes(siteConfig.name) ? title : `${title} | ${siteConfig.name}`)
    : `${siteConfig.name} — ${siteConfig.tagline}`;
  const metaDesc = description || siteConfig.description;
  const canonicalUrl = `${SITE_URL}${slug}`;
  const ogImage = image || DEFAULT_OG_IMAGE;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={metaDesc} />
      {keywords && <meta name="keywords" content={keywords} />}
      <link rel="canonical" href={canonicalUrl} />

      {/* Robots */}
      <meta name="robots" content={noindex ? 'noindex, nofollow' : 'index, follow, max-snippet:-1, max-image-preview:large'} />

      {/* Open Graph */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={metaDesc} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content={siteConfig.name} />
      <meta property="og:locale" content="en_US" />
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content={fullTitle} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={metaDesc} />
      <meta name="twitter:image" content={ogImage} />

      {/* Additional */}
      <meta name="author" content={siteConfig.company?.name || siteConfig.name} />
      <meta httpEquiv="content-language" content="en" />
    </Helmet>
  );
};

export default SEOHead;
