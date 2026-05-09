import React from 'react';
import SEOHead from '../../components/common/SEOHead';
import siteConfig from '../../config/siteConfig';
import './PrivacyPolicy.css';

const PrivacyPolicy = () => (
  <>
    <SEOHead title="Privacy Policy" description={`Privacy policy for ${siteConfig.name}. Learn how we protect your data.`} slug="/privacy-policy" />
    <main className="legal-page">
      <div className="legal-hero"><div className="container"><h1>Privacy Policy</h1><p>Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p></div></div>
      <article className="legal-content container">
        <section><h2>1. Introduction</h2><p>{siteConfig.name} (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;) is committed to protecting your privacy. This Privacy Policy explains how we handle information when you use our website and tools.</p></section>
        <section><h2>2. Information We Do Not Collect</h2><p>We do not require user accounts, logins, or personal information to use our tools. We do not use tracking cookies or third-party analytics by default.</p></section>
        <section><h2>3. File Processing</h2><p>When you upload files for processing:</p><ul><li>Files are processed on our secure servers</li><li>Files are automatically and permanently deleted within 10 minutes of upload</li><li>We do not read, copy, or share your file contents</li><li>Processing is done in isolated, temporary environments</li></ul></section>
        <section><h2>4. Data Storage</h2><p>We employ a strict no-storage policy. Your uploaded files exist only temporarily during processing. We maintain no backups or copies of user-uploaded content.</p></section>
        <section><h2>5. Third-Party Services</h2><p>Some tools may use third-party APIs for specific functionality (e.g., currency exchange rates). These services receive only the minimum data necessary and are bound by their own privacy policies.</p></section>
        <section><h2>6. Security</h2><p>We use industry-standard security measures including HTTPS encryption, isolated file processing, and automatic file deletion to protect your data.</p></section>
        <section><h2>7. Changes to This Policy</h2><p>We may update this Privacy Policy from time to time. Changes will be posted on this page with an updated revision date.</p></section>
        <section><h2>8. Contact Us</h2><p>If you have questions about this Privacy Policy, contact us at <a href={`mailto:${siteConfig.contact.email}`}>{siteConfig.contact.email}</a>.</p></section>
      </article>
    </main>
  </>
);

export default PrivacyPolicy;
