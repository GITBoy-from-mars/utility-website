import React from 'react';
import SEOHead from '../../components/common/SEOHead';
import { Icon } from '../../assets/icons/icons';
import siteConfig from '../../config/siteConfig';
import './About.css';

const About = () => (
  <>
    <SEOHead title="About Us — Our Mission & Values" description={`Learn about ${siteConfig.name} — 100+ free online utility tools built with privacy and speed in mind. No sign-up required.`} slug="/about" />
    <main className="about-page">
      <section className="about-hero">
        <div className="container">
          <h1>About {siteConfig.name}</h1>
          <p className="about-hero-sub">We believe powerful tools should be free, private, and accessible to everyone.</p>
        </div>
      </section>
      <section className="about-content container">
        <div className="about-grid">
          <div className="about-text">
            <h2>Our Mission</h2>
            <p>{siteConfig.name} was created with a simple goal: provide professionals, students, and everyday users with reliable utility tools — without paywalls, sign-ups, or privacy compromises.</p>
            <p>Every tool on our platform is designed to be fast, accurate, and easy to use. We process your files securely and delete them automatically — because your data belongs to you.</p>
            <h2>What Sets Us Apart</h2>
            <ul className="about-features">
              <li><Icon name="Shield" size={20} /><div><strong>Privacy First</strong><span>Files are auto-deleted within 10 minutes. We never access or store your data.</span></div></li>
              <li><Icon name="Zap" size={20} /><div><strong>Lightning Fast</strong><span>Optimized processing engines deliver results in seconds, not minutes.</span></div></li>
              <li><Icon name="Globe" size={20} /><div><strong>No Barriers</strong><span>No sign-up, no email verification, no limits on basic usage. Just tools that work.</span></div></li>
              <li><Icon name="Code" size={20} /><div><strong>Professional Grade</strong><span>Built with enterprise-quality libraries trusted by millions of developers worldwide.</span></div></li>
            </ul>
          </div>
          <div className="about-stats-panel">
            <div className="about-stat-card">
              <span className="about-stat-num">24+</span>
              <span className="about-stat-label">Free Tools</span>
            </div>
            <div className="about-stat-card">
              <span className="about-stat-num">6</span>
              <span className="about-stat-label">Categories</span>
            </div>
            <div className="about-stat-card">
              <span className="about-stat-num">100%</span>
              <span className="about-stat-label">Private</span>
            </div>
            <div className="about-stat-card">
              <span className="about-stat-num">0</span>
              <span className="about-stat-label">Sign-ups Required</span>
            </div>
          </div>
        </div>
      </section>
    </main>
  </>
);

export default About;
