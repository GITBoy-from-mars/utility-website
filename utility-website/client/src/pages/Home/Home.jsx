import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import SEOHead from '../../components/common/SEOHead';
import SkeletonLoader from '../../components/common/SkeletonLoader';
import HeroSection from '../../components/home/HeroSection';
import { Icon } from '../../assets/icons/icons';
import { getToolsByCategory, searchTools, getAllTools } from '../../tools/_registry';
import categories from '../../config/categories';
import siteConfig from '../../config/siteConfig';
import './Home.css';

const SITE_URL = 'https://utility-website-9xn.pages.dev';

const Home = () => {
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const allTools = getAllTools();
  const filteredTools = search ? searchTools(search) : null;

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 400);
    return () => clearTimeout(timer);
  }, []);

  /* Organization + WebSite + SearchAction structured data */
  const orgSchema = {
    '@context': 'https://schema.org', '@type': 'Organization',
    name: siteConfig.name, url: SITE_URL,
    logo: `${SITE_URL}/favicon.svg`,
    contactPoint: { '@type': 'ContactPoint', email: siteConfig.contact?.email, contactType: 'customer service' },
  };
  const siteSchema = {
    '@context': 'https://schema.org', '@type': 'WebSite',
    name: siteConfig.name, url: SITE_URL,
    description: siteConfig.description,
    potentialAction: {
      '@type': 'SearchAction',
      target: { '@type': 'EntryPoint', urlTemplate: `${SITE_URL}/?q={search_term_string}` },
      'query-input': 'required name=search_term_string',
    },
  };
  const collectionSchema = {
    '@context': 'https://schema.org', '@type': 'CollectionPage',
    name: `${siteConfig.name} — Free Online Tools`,
    description: siteConfig.description,
    url: SITE_URL,
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: allTools.length,
      itemListElement: allTools.slice(0, 20).map((t, i) => ({
        '@type': 'ListItem', position: i + 1,
        url: `${SITE_URL}/tools/${t.slug}`, name: t.name,
      })),
    },
  };

  if (loading) return <SkeletonLoader type="page" count={8} />;

  return (
    <>
      <SEOHead
        title={`${siteConfig.name} — Free Online Utility Tools | Convert, Compress & Edit`}
        description={`${allTools.length}+ free online tools: convert PDFs, compress images, edit documents, generate QR codes & more. No sign-up required, 100% private.`}
        keywords="free online tools, pdf converter, image compressor, file converter, utility tools, no signup"
      />
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(orgSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(siteSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(collectionSchema)}</script>
      </Helmet>

      <main className="home">
        <HeroSection search={search} setSearch={setSearch} />

        {filteredTools && (
          <section className="home-search-results section container" id="search-results" aria-label="Search Results">
            <h2 className="section-title">Search Results</h2>
            <p className="section-subtitle">{filteredTools.length} tool{filteredTools.length !== 1 ? 's' : ''} found for &ldquo;{search}&rdquo;</p>
            {filteredTools.length > 0 ? (
              <div className="home-tools-grid">
                {filteredTools.map((tool) => (
                  <Link key={tool.slug} to={tool.path} className="home-tool-card card" id={`tool-${tool.slug}`}>
                    <div className="home-tool-icon"><Icon name={tool.icon} size={24} /></div>
                    <div className="home-tool-info">
                      <h3 className="home-tool-name">{tool.name}</h3>
                      <p className="home-tool-desc">{tool.description}</p>
                    </div>
                    <Icon name="ArrowRight" size={18} className="home-tool-arrow" />
                  </Link>
                ))}
              </div>
            ) : (
              <p className="home-no-results">No tools match your search. Try a different keyword.</p>
            )}
          </section>
        )}

        {!filteredTools && (
          <section className="home-categories" id="tools" aria-label="All Tools">
            {categories.map((cat) => {
              const tools = getToolsByCategory(cat.id);
              if (tools.length === 0) return null;
              return (
                <div key={cat.id} className="home-category section">
                  <div className="container">
                    <div className="home-cat-header">
                      <div className="home-cat-icon" style={{ color: cat.color }}><Icon name={cat.iconKey} size={24} /></div>
                      <div>
                        <h2 className="section-title">{cat.name}</h2>
                        <p className="section-subtitle" style={{ marginBottom: 0 }}>{cat.description}</p>
                      </div>
                    </div>
                    <div className="home-tools-grid">
                      {tools.map((tool) => (
                        <Link key={tool.slug} to={tool.path} className="home-tool-card card" id={`tool-${tool.slug}`}>
                          <div className="home-tool-icon" style={{ color: cat.color, background: `${cat.color}12` }}>
                            <Icon name={tool.icon} size={24} />
                          </div>
                          <div className="home-tool-info">
                            <h3 className="home-tool-name">{tool.name}</h3>
                            <p className="home-tool-desc">{tool.description}</p>
                          </div>
                          <Icon name="ArrowRight" size={18} className="home-tool-arrow" />
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </section>
        )}

        <section className="home-trust section" aria-label="Why Trust Us">
          <div className="container">
            <h2 className="section-title" style={{ textAlign: 'center' }}>Why Millions Trust {siteConfig.name}</h2>
            <p className="section-subtitle" style={{ textAlign: 'center' }}>Built with privacy, speed, and reliability at the core</p>
            <div className="home-trust-grid">
              <article className="home-trust-card">
                <div className="home-trust-icon"><Icon name="Shield" size={28} /></div>
                <h3>Privacy First</h3>
                <p>Your files are never stored permanently. All uploads are automatically deleted within 10 minutes.</p>
              </article>
              <article className="home-trust-card">
                <div className="home-trust-icon"><Icon name="Zap" size={28} /></div>
                <h3>Lightning Fast</h3>
                <p>Powered by optimized processing engines for the fastest conversion and compression speeds.</p>
              </article>
              <article className="home-trust-card">
                <div className="home-trust-icon"><Icon name="Globe" size={28} /></div>
                <h3>No Sign-up Required</h3>
                <p>Start using any tool immediately. No account creation, no email verification, no friction.</p>
              </article>
            </div>
          </div>
        </section>
      </main>
    </>
  );
};

export default Home;
