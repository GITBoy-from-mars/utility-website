import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import SEOHead from '../../components/common/SEOHead';
import SkeletonLoader from '../../components/common/SkeletonLoader';
import HeroSection from '../../components/home/HeroSection';
import { Icon } from '../../assets/icons/icons';
import { getToolsByCategory, searchTools, getAllTools } from '../../tools/_registry';
import categories from '../../config/categories';
import siteConfig from '../../config/siteConfig';
import './Home.css';

const Home = () => {
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const allTools = getAllTools();
  const filteredTools = search ? searchTools(search) : null;

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 400);
    return () => clearTimeout(timer);
  }, []);

  if (loading) return <SkeletonLoader type="page" count={8} />;

  return (
    <>
      <SEOHead />
      <main className="home">
        {/* Hero — Separate component for easy customization */}
        <HeroSection search={search} setSearch={setSearch} />

        {/* Search Results */}
        {filteredTools && (
          <section className="home-search-results section container" id="search-results">
            <h2 className="section-title">Search Results</h2>
            <p className="section-subtitle">{filteredTools.length} tool{filteredTools.length !== 1 ? 's' : ''} found for &ldquo;{search}&rdquo;</p>
            {filteredTools.length > 0 ? (
              <div className="home-tools-grid">
                {filteredTools.map((tool) => (
                  <Link key={tool.slug} to={tool.path} className="home-tool-card card" id={`tool-${tool.slug}`}>
                    <div className="home-tool-icon">
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
            ) : (
              <p className="home-no-results">No tools match your search. Try a different keyword.</p>
            )}
          </section>
        )}

        {/* Category Sections */}
        {!filteredTools && (
          <section className="home-categories" id="tools">
            {categories.map((cat) => {
              const tools = getToolsByCategory(cat.id);
              if (tools.length === 0) return null;
              return (
                <div key={cat.id} className="home-category section">
                  <div className="container">
                    <div className="home-cat-header">
                      <div className="home-cat-icon" style={{ color: cat.color }}>
                        <Icon name={cat.iconKey} size={24} />
                      </div>
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

        {/* Trust Section */}
        <section className="home-trust section">
          <div className="container">
            <h2 className="section-title" style={{ textAlign: 'center' }}>Why Millions Trust {siteConfig.name}</h2>
            <p className="section-subtitle" style={{ textAlign: 'center' }}>Built with privacy, speed, and reliability at the core</p>
            <div className="home-trust-grid">
              <div className="home-trust-card">
                <div className="home-trust-icon"><Icon name="Shield" size={28} /></div>
                <h3>Privacy First</h3>
                <p>Your files are never stored permanently. All uploads are automatically deleted within 10 minutes.</p>
              </div>
              <div className="home-trust-card">
                <div className="home-trust-icon"><Icon name="Zap" size={28} /></div>
                <h3>Lightning Fast</h3>
                <p>Powered by optimized processing engines for the fastest conversion and compression speeds.</p>
              </div>
              <div className="home-trust-card">
                <div className="home-trust-icon"><Icon name="Globe" size={28} /></div>
                <h3>No Sign-up Required</h3>
                <p>Start using any tool immediately. No account creation, no email verification, no friction.</p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
};

export default Home;
