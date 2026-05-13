import React from 'react';
import { Link } from 'react-router-dom';
import { Icon } from '../../assets/icons/icons';
import { getToolsByCategory, getAllTools } from '../../tools/_registry';
import categories from '../../config/categories';
import siteConfig from '../../config/siteConfig';
import './Footer.css';

const Footer = () => {
  const year = new Date().getFullYear();
  const allTools = getAllTools();
  const popularTools = allTools.slice(0, 8);

  return (
    <footer className="footer" id="main-footer">
      <div className="footer-accent" />

      <div className="footer-main container-lg">
        {/* Brand Column */}
        <div className="footer-brand">
          <Link to="/" className="footer-logo">
            <div className="footer-logo-icon">U</div>
            <span>{siteConfig.name}</span>
          </Link>
          <p className="footer-tagline">
            Your all-in-one toolkit for file conversion, compression, editing, and more.
            100% free, no sign-up required, and your files stay private.
          </p>
          <div className="footer-stats">
            <div className="footer-stat-item">
              <span className="footer-stat-num">{allTools.length}+</span>
              <span className="footer-stat-text">Tools</span>
            </div>
            <div className="footer-stat-divider" />
            <div className="footer-stat-item">
              <span className="footer-stat-num">{categories.length}</span>
              <span className="footer-stat-text">Categories</span>
            </div>
            <div className="footer-stat-divider" />
            <div className="footer-stat-item">
              <span className="footer-stat-num">100%</span>
              <span className="footer-stat-text">Free</span>
            </div>
          </div>
          <div className="footer-social">
            <a href={siteConfig.social?.twitter || '#'} aria-label="Twitter" className="footer-social-link" target="_blank" rel="noopener">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
            </a>
            <a href={siteConfig.social?.linkedin || '#'} aria-label="LinkedIn" className="footer-social-link" target="_blank" rel="noopener">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
            </a>
            <a href={siteConfig.social?.github || '#'} aria-label="GitHub" className="footer-social-link" target="_blank" rel="noopener">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>
            </a>
          </div>
        </div>

        {/* Popular Tools */}
        <div className="footer-col">
          <h4 className="footer-col-title">Popular Tools</h4>
          <ul className="footer-links">
            {popularTools.map((tool) => (
              <li key={tool.slug}>
                <Link to={tool.path} className="footer-link">{tool.name}</Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Categories — fixed to link to actual tool pages */}
        <div className="footer-col">
          <h4 className="footer-col-title">Categories</h4>
          <ul className="footer-links">
            {categories.slice(0, 10).map(cat => {
              const firstTool = getToolsByCategory(cat.id)[0];
              return (
                <li key={cat.id}>
                  <Link to={firstTool ? firstTool.path : '/'} className="footer-link">{cat.name}</Link>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Quick Links */}
        <div className="footer-col">
          <h4 className="footer-col-title">Quick Links</h4>
          <ul className="footer-links">
            <li><Link to="/tools/pdf-merger-splitter" className="footer-link">Merge PDFs</Link></li>
            <li><Link to="/tools/image-compressor" className="footer-link">Compress Images</Link></li>
            <li><Link to="/tools/word-to-pdf" className="footer-link">Word to PDF</Link></li>
            <li><Link to="/tools/qr-code-generator" className="footer-link">QR Generator</Link></li>
            <li><Link to="/tools/invoice-generator" className="footer-link">Invoice Generator</Link></li>
            <li><Link to="/tools/password-generator" className="footer-link">Password Generator</Link></li>
          </ul>
        </div>

        {/* Company */}
        <div className="footer-col">
          <h4 className="footer-col-title">Company</h4>
          <ul className="footer-links">
            <li><Link to="/about" className="footer-link">About Us</Link></li>
            <li><Link to="/contact" className="footer-link">Contact Us</Link></li>
            <li><Link to="/privacy-policy" className="footer-link">Privacy Policy</Link></li>
            <li><Link to="/data-storage" className="footer-link">Data Storage Policy</Link></li>
          </ul>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="footer-bottom">
        <div className="container-lg footer-bottom-inner">
          <p className="footer-copyright">
            &copy; {year} {siteConfig.company?.name || siteConfig.name}. All rights reserved.
          </p>
          <p className="footer-made">
            Built for productivity
          </p>
          <div className="footer-bottom-links">
            <Link to="/privacy-policy">Privacy</Link>
            <span className="footer-dot">&middot;</span>
            <Link to="/data-storage">Terms</Link>
            <span className="footer-dot">&middot;</span>
            <Link to="/contact">Support</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
