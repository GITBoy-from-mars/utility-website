import React from 'react';
import { Link } from 'react-router-dom';
import SEOHead from './SEOHead';
import ToolFAQ from './ToolFAQ';
import ToolHowTo from './ToolHowTo';
import { Icon } from '../../assets/icons/icons';
import { getToolsByCategory } from '../../tools/_registry';
import { getToolFAQs, getToolHowTo } from '../../data/toolContent';
import siteConfig from '../../config/siteConfig';
import './ToolPageWrapper.css';

const ToolPageWrapper = ({ meta, children }) => {
  const relatedTools = getToolsByCategory(meta.category)
    .filter((t) => t.slug !== meta.slug)
    .slice(0, 4);

  const faqs = meta.faqs || getToolFAQs(meta.slug);
  const howTo = meta.howTo || getToolHowTo(meta.slug);

  /* Per-page SEO title format: "Tool Name - Free Online Tool | UtiliTools" */
  const seoTitle = `${meta.name} - Free Online ${meta.name.includes('Tool') ? '' : 'Tool'} | ${siteConfig.name}`;
  const seoDesc = `${meta.description}. Free, no sign-up required. Use ${meta.name} online with ${siteConfig.name}.`;
  const seoKeywords = [
    ...(meta.keywords || []),
    'free online tool',
    'no signup',
    meta.name.toLowerCase(),
    `${meta.name.toLowerCase()} online`,
    `free ${meta.name.toLowerCase()}`,
  ].join(', ');
  const toolUrl = `${siteConfig.url}/tools/${meta.slug}`;

  /* JSON-LD: WebApplication + FAQ combined schema */
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: meta.name,
    description: meta.description,
    url: toolUrl,
    applicationCategory: 'UtilityApplication',
    operatingSystem: 'Any',
    browserRequirements: 'Requires JavaScript. Requires HTML5.',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    provider: {
      '@type': 'Organization',
      name: siteConfig.company?.name || siteConfig.name,
      url: siteConfig.url,
    },
  };

  /* FAQ Schema (separate for better indexing) */
  const faqSchema = faqs && faqs.length > 0 ? {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(f => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  } : null;

  /* HowTo Schema */
  const howToSchema = howTo && howTo.length > 0 ? {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: `How to Use ${meta.name}`,
    step: howTo.map((step, i) => ({
      '@type': 'HowToStep',
      position: i + 1,
      name: step.title,
      text: step.desc,
    })),
  } : null;

  /* BreadcrumbList Schema */
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: siteConfig.url },
      { '@type': 'ListItem', position: 2, name: 'Tools', item: `${siteConfig.url}/` },
      { '@type': 'ListItem', position: 3, name: meta.name, item: toolUrl },
    ],
  };

  return (
    <>
      <SEOHead
        title={seoTitle}
        description={seoDesc}
        slug={`/tools/${meta.slug}`}
        keywords={seoKeywords}
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      {faqSchema && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />}
      {howToSchema && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }} />}

      <main className="tool-page">
        <nav className="tool-breadcrumb container" aria-label="Breadcrumb">
          <Link to="/">Home</Link>
          <span className="tool-breadcrumb-sep">/</span>
          <Link to="/">Tools</Link>
          <span className="tool-breadcrumb-sep">/</span>
          <span className="tool-breadcrumb-current">{meta.name}</span>
        </nav>

        <div className="tool-header container">
          <div className="tool-icon-wrap" style={{ background: `${meta.iconBg || 'var(--primary-50)'}` }}>
            <Icon name={meta.icon} size={28} />
          </div>
          <h1 className="tool-title">{meta.name}</h1>
          <p className="tool-description">{meta.description}</p>
          {meta.batchSupport && (
            <span className="badge badge-primary">Batch Processing Supported</span>
          )}
        </div>

        <div className="tool-content container">
          {children}

          {/* How-to Section */}
          <ToolHowTo steps={howTo} />

          {/* FAQ Section */}
          <ToolFAQ faqs={faqs} />
        </div>

        {relatedTools.length > 0 && (
          <section className="tool-related container">
            <h2 className="tool-related-title">Related Tools</h2>
            <div className="tool-related-grid">
              {relatedTools.map((tool) => (
                <Link key={tool.slug} to={tool.path} className="tool-related-card card">
                  <Icon name={tool.icon} size={22} />
                  <span>{tool.name}</span>
                  <Icon name="ArrowRight" size={16} className="tool-related-arrow" />
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>
    </>
  );
};

export default ToolPageWrapper;
