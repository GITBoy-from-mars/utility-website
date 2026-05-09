import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Icon } from '../../assets/icons/icons';
import { getToolsByCategory, getToolBySlug, getAllTools } from '../../tools/_registry';
import categories from '../../config/categories';
import siteConfig from '../../config/siteConfig';
import './Header.css';

const Header = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const servicesRef = useRef(null);
  const location = useLocation();

  useEffect(() => {
    setMobileOpen(false);
    setServicesOpen(false);
  }, [location]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (servicesRef.current && !servicesRef.current.contains(e.target)) {
        setServicesOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Detect if on a tool page and get related tools
  const currentToolInfo = useMemo(() => {
    const match = location.pathname.match(/^\/tools\/(.+)/);
    if (!match) return null;
    const slug = match[1];
    const tool = getToolBySlug(slug);
    if (!tool) return null;
    const cat = categories.find(c => c.id === tool.category);
    const relatedTools = getToolsByCategory(tool.category).filter(t => t.slug !== slug).slice(0, 8);
    return { tool, category: cat, relatedTools };
  }, [location.pathname]);

  return (
    <>
      <header className="header" id="main-header">
        <div className="header-inner container-lg">
          <Link to="/" className="header-logo" aria-label="Home">
            <div className="header-logo-icon">U</div>
            <span className="header-logo-text">{siteConfig.name}</span>
          </Link>

          <nav className="header-nav" role="navigation" aria-label="Main navigation">
            <div className="header-nav-item" ref={servicesRef}>
              <button
                className={`header-nav-link header-services-btn ${servicesOpen ? 'active' : ''}`}
                onClick={() => setServicesOpen(!servicesOpen)}
                aria-expanded={servicesOpen}
              >
                All Tools
                <Icon name="ChevronDown" size={16} className={`header-chevron ${servicesOpen ? 'header-chevron--open' : ''}`} />
              </button>
              {servicesOpen && (
                <div className="header-mega-menu">
                  <div className="header-mega-scroll">
                    <div className="header-mega-inner">
                      {categories.map((cat) => {
                        const tools = getToolsByCategory(cat.id);
                        if (tools.length === 0) return null;
                        return (
                          <div key={cat.id} className="header-mega-col">
                            <h3 className="header-mega-cat" style={{ color: cat.color }}>
                              <Icon name={cat.iconKey} size={14} />
                              {cat.name}
                              <span className="header-mega-count">{tools.length}</span>
                            </h3>
                            <ul className="header-mega-list">
                              {tools.map((tool) => (
                                <li key={tool.slug}>
                                  <Link to={tool.path} className="header-mega-link">
                                    <Icon name={tool.icon} size={14} />
                                    {tool.name}
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
            </div>
            <Link to="/about" className="header-nav-link">About</Link>
            <Link to="/contact" className="header-nav-link">Contact</Link>
          </nav>

          <button
            className="header-mobile-btn"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
            aria-expanded={mobileOpen}
          >
            <Icon name={mobileOpen ? 'X' : 'Menu'} size={24} />
          </button>
        </div>

        {/* Dynamic Related Tools Bar — shown on tool pages */}
        {currentToolInfo && (
          <div className="header-related">
            <div className="header-related-inner container-lg">
              <span className="header-related-label" style={{ color: currentToolInfo.category?.color }}>
                <Icon name={currentToolInfo.category?.iconKey || 'Zap'} size={14} />
                {currentToolInfo.category?.name}:
              </span>
              <div className="header-related-tools">
                {currentToolInfo.relatedTools.map(t => (
                  <Link key={t.slug} to={t.path} className="header-related-link">{t.name}</Link>
                ))}
              </div>
            </div>
          </div>
        )}

        {mobileOpen && (
          <div className="header-mobile-menu">
            <div className="header-mobile-inner">
              {categories.map((cat) => {
                const tools = getToolsByCategory(cat.id);
                if (tools.length === 0) return null;
                return (
                  <div key={cat.id} className="header-mobile-section">
                    <h4 className="header-mobile-cat" style={{ color: cat.color }}>{cat.name}</h4>
                    {tools.map((tool) => (
                      <Link key={tool.slug} to={tool.path} className="header-mobile-link">
                        <Icon name={tool.icon} size={16} />
                        {tool.name}
                      </Link>
                    ))}
                  </div>
                );
              })}
              <div className="header-mobile-pages">
                <Link to="/about" className="header-mobile-link">About Us</Link>
                <Link to="/contact" className="header-mobile-link">Contact</Link>
                <Link to="/privacy-policy" className="header-mobile-link">Privacy Policy</Link>
                <Link to="/data-storage" className="header-mobile-link">Data Storage</Link>
              </div>
            </div>
          </div>
        )}
      </header>
    </>
  );
};

export default Header;
