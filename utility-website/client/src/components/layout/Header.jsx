import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Icon } from '../../assets/icons/icons';
import { getToolsByCategory, getToolBySlug, getAllTools, searchTools } from '../../tools/_registry';
import categories from '../../config/categories';
import siteConfig from '../../config/siteConfig';
import './Header.css';

const Header = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const servicesRef = useRef(null);
  const searchInputRef = useRef(null);
  const searchRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => { setMobileOpen(false); setServicesOpen(false); setSearchOpen(false); setSearchQuery(''); }, [location]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (servicesRef.current && !servicesRef.current.contains(e.target)) setServicesOpen(false);
      if (searchRef.current && !searchRef.current.contains(e.target) && !e.target.closest('.header-search-btn')) setSearchOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => { if (searchOpen && searchInputRef.current) searchInputRef.current.focus(); }, [searchOpen]);

  // Keyboard shortcut: Ctrl+K or / to open search
  useEffect(() => {
    const handler = (e) => {
      if ((e.ctrlKey && e.key === 'k') || (e.key === '/' && !['INPUT','TEXTAREA','SELECT'].includes(e.target.tagName))) {
        e.preventDefault(); setSearchOpen(true);
      }
      if (e.key === 'Escape') setSearchOpen(false);
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, []);

  const searchResults = useMemo(() => searchQuery.trim() ? searchTools(searchQuery).slice(0, 8) : [], [searchQuery]);

  const currentToolInfo = useMemo(() => {
    const match = location.pathname.match(/^\/tools\/(.+)/);
    if (!match) return null;
    const slug = match[1]; const tool = getToolBySlug(slug);
    if (!tool) return null;
    const cat = categories.find(c => c.id === tool.category);
    const relatedTools = getToolsByCategory(tool.category).filter(t => t.slug !== slug).slice(0, 8);
    return { tool, category: cat, relatedTools };
  }, [location.pathname]);

  const handleSearchSelect = (path) => { navigate(path); setSearchOpen(false); setSearchQuery(''); };

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
              <button className={`header-nav-link header-services-btn ${servicesOpen ? 'active' : ''}`} onClick={() => setServicesOpen(!servicesOpen)} aria-expanded={servicesOpen}>
                All Tools <Icon name="ChevronDown" size={16} className={`header-chevron ${servicesOpen ? 'header-chevron--open' : ''}`} />
              </button>
              {servicesOpen && (
                <div className="header-mega-menu"><div className="header-mega-scroll"><div className="header-mega-inner">
                  {categories.map((cat) => { const tools = getToolsByCategory(cat.id); if (!tools.length) return null; return (
                    <div key={cat.id} className="header-mega-col"><h3 className="header-mega-cat" style={{ color: cat.color }}><Icon name={cat.iconKey} size={14} />{cat.name}<span className="header-mega-count">{tools.length}</span></h3>
                      <ul className="header-mega-list">{tools.map((tool) => <li key={tool.slug}><Link to={tool.path} className="header-mega-link"><Icon name={tool.icon} size={14} />{tool.name}</Link></li>)}</ul></div>
                  ); })}
                </div></div></div>
              )}
            </div>
            <Link to="/blog" className="header-nav-link">Blog</Link>
            <Link to="/about" className="header-nav-link">About</Link>
            <Link to="/contact" className="header-nav-link">Contact</Link>
          </nav>

          {/* Search button */}
          <button className="header-search-btn" onClick={() => setSearchOpen(!searchOpen)} aria-label="Search tools" title="Search (Ctrl+K)">
            <Icon name="Search" size={18} />
          </button>

          <button className="header-mobile-btn" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Toggle menu" aria-expanded={mobileOpen}>
            <Icon name={mobileOpen ? 'X' : 'Menu'} size={24} />
          </button>
        </div>

        {/* Search Overlay */}
        {searchOpen && (
          <div className="header-search-overlay">
            <div className="header-search-box" ref={searchRef}>
              <div className="header-search-input-wrap">
                <Icon name="Search" size={18} />
                <input ref={searchInputRef} type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search tools..." className="header-search-input"
                  onKeyDown={e => { if (e.key === 'Enter' && searchResults.length) handleSearchSelect(searchResults[0].path); if (e.key === 'Escape') setSearchOpen(false); }} />
                <kbd className="header-search-kbd">ESC</kbd>
              </div>
              {searchResults.length > 0 && (
                <div className="header-search-results">
                  {searchResults.map(tool => (
                    <button key={tool.slug} className="header-search-result" onClick={() => handleSearchSelect(tool.path)}>
                      <Icon name={tool.icon} size={16} />
                      <div><div className="header-search-result-name">{tool.name}</div><div className="header-search-result-desc">{tool.description}</div></div>
                    </button>
                  ))}
                </div>
              )}
              {searchQuery && !searchResults.length && <div className="header-search-empty">No tools found for "{searchQuery}"</div>}
            </div>
          </div>
        )}

        {currentToolInfo && (
          <div className="header-related"><div className="header-related-inner container-lg">
            <span className="header-related-label" style={{ color: currentToolInfo.category?.color }}><Icon name={currentToolInfo.category?.iconKey || 'Zap'} size={14} />{currentToolInfo.category?.name}:</span>
            <div className="header-related-tools">{currentToolInfo.relatedTools.map(t => <Link key={t.slug} to={t.path} className="header-related-link">{t.name}</Link>)}</div>
          </div></div>
        )}

        {mobileOpen && (
          <div className="header-mobile-menu"><div className="header-mobile-inner">
            {/* Mobile search */}
            <div style={{ marginBottom: 16 }}>
              <div className="header-search-input-wrap" style={{ background: 'var(--neutral-100)', borderRadius: 8, padding: '8px 12px' }}>
                <Icon name="Search" size={16} />
                <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search tools..." style={{ border: 'none', background: 'transparent', flex: 1, fontSize: '0.875rem', outline: 'none' }} />
              </div>
              {searchQuery && searchResults.length > 0 && <div style={{ marginTop: 8 }}>{searchResults.slice(0, 5).map(tool => (
                <Link key={tool.slug} to={tool.path} className="header-mobile-link"><Icon name={tool.icon} size={16} />{tool.name}</Link>
              ))}</div>}
            </div>
            {categories.map((cat) => { const tools = getToolsByCategory(cat.id); if (!tools.length) return null; return (
              <div key={cat.id} className="header-mobile-section"><h4 className="header-mobile-cat" style={{ color: cat.color }}>{cat.name}</h4>
                {tools.map((tool) => <Link key={tool.slug} to={tool.path} className="header-mobile-link"><Icon name={tool.icon} size={16} />{tool.name}</Link>)}
              </div>
            ); })}
            <div className="header-mobile-pages">
              <Link to="/blog" className="header-mobile-link">Blog</Link>
              <Link to="/about" className="header-mobile-link">About Us</Link>
              <Link to="/contact" className="header-mobile-link">Contact</Link>
              <Link to="/privacy-policy" className="header-mobile-link">Privacy Policy</Link>
            </div>
          </div></div>
        )}
      </header>
    </>
  );
};

export default Header;
