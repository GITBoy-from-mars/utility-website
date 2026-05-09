import React from 'react';
import { Helmet } from 'react-helmet-async';
import siteConfig from '../../config/siteConfig';

const SEOHead = ({ title, description, slug = '', keywords = '' }) => {
  const fullTitle = title ? `${title} — ${siteConfig.name}` : `${siteConfig.name} — ${siteConfig.tagline}`;
  const metaDesc = description || siteConfig.description;
  const canonicalUrl = `${siteConfig.url}${slug}`;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={metaDesc} />
      {keywords && <meta name="keywords" content={keywords} />}
      <link rel="canonical" href={canonicalUrl} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={metaDesc} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:type" content="website" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={metaDesc} />
    </Helmet>
  );
};

export default SEOHead;
