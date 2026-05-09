import React from 'react';
import { Link } from 'react-router-dom';
import SEOHead from './SEOHead';
import ToolFAQ from './ToolFAQ';
import ToolHowTo from './ToolHowTo';
import { Icon } from '../../assets/icons/icons';
import { getToolsByCategory } from '../../tools/_registry';
import { getToolFAQs, getToolHowTo } from '../../data/toolContent';
import './ToolPageWrapper.css';

const ToolPageWrapper = ({ meta, children }) => {
  const relatedTools = getToolsByCategory(meta.category)
    .filter((t) => t.slug !== meta.slug)
    .slice(0, 4);

  const faqs = meta.faqs || getToolFAQs(meta.slug);
  const howTo = meta.howTo || getToolHowTo(meta.slug);

  // JSON-LD structured data for SEO
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: meta.name,
    description: meta.description,
    url: `${window.location.origin}/tools/${meta.slug}`,
    applicationCategory: 'UtilityApplication',
    operatingSystem: 'Any',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    ...(faqs && faqs.length > 0 ? {
      mainEntity: faqs.map(f => ({
        '@type': 'Question',
        name: f.q,
        acceptedAnswer: { '@type': 'Answer', text: f.a },
      })),
    } : {}),
  };

  return (
    <>
      <SEOHead
        title={`${meta.name} — Free Online Tool`}
        description={meta.description}
        slug={`/tools/${meta.slug}`}
        keywords={meta.keywords?.join(', ')}
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <main className="tool-page">
        <nav className="tool-breadcrumb container" aria-label="Breadcrumb">
          <Link to="/">Home</Link>
          <span className="tool-breadcrumb-sep">/</span>
          <Link to="/#tools">Tools</Link>
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
