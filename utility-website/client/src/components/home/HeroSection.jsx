import React, { useRef } from 'react';
import { Icon } from '../../assets/icons/icons';
import { getAllTools } from '../../tools/_registry';
import siteConfig from '../../config/siteConfig';

const HeroSection = ({ search, setSearch }) => {
  const allTools = getAllTools();
  const searchRef = useRef(null);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && search.trim()) {
      // Scroll to search results section
      const el = document.getElementById('search-results');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  return (
    <section className="home-hero">
      <div className="home-hero-bg" />
      <div className="container">
        <div className="home-hero-badge badge badge-primary">
          <Icon name="Zap" size={12} /> Free &amp; Private — No Sign-up Needed
        </div>
        <h1 className="home-hero-title">
          All the tools you need,<br />
          <span className="home-hero-highlight">in one place.</span>
        </h1>
        <p className="home-hero-subtitle">
          Convert, compress, edit, and transform your files — all for free.
          Your files stay private and are automatically deleted.
        </p>
        <div className="home-search-wrap" ref={searchRef}>
          <Icon name="Search" size={20} className="home-search-icon" />
          <input
            type="text"
            className="home-search-input"
            placeholder="Search tools... (e.g., PDF, image, calculator)"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={handleKeyDown}
            id="tool-search"
            aria-label="Search tools"
          />
          {search && (
            <button className="home-search-clear" onClick={() => setSearch('')} aria-label="Clear search">
              <Icon name="X" size={16} />
            </button>
          )}
        </div>
        <div className="home-hero-stats">
          <div className="home-stat">
            <span className="home-stat-num">{allTools.length}+</span>
            <span className="home-stat-label">Free Tools</span>
          </div>
          <div className="home-stat-divider" />
          <div className="home-stat">
            <Icon name="Shield" size={18} className="home-stat-icon" />
            <span className="home-stat-label">100% Private</span>
          </div>
          <div className="home-stat-divider" />
          <div className="home-stat">
            <Icon name="Zap" size={18} className="home-stat-icon" />
            <span className="home-stat-label">Fast Processing</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
