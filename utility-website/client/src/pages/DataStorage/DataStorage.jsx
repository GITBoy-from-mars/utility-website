import React from 'react';
import SEOHead from '../../components/common/SEOHead';
import siteConfig from '../../config/siteConfig';
import '../PrivacyPolicy/PrivacyPolicy.css';

const DataStorage = () => (
  <>
    <SEOHead title="Data Storage Policy" description={`How ${siteConfig.name} handles your uploaded files and data.`} slug="/data-storage" />
    <main className="legal-page">
      <div className="legal-hero"><div className="container"><h1>Data Storage Policy</h1><p>Transparency about how we handle your files</p></div></div>
      <article className="legal-content container">
        <section><h2>1. Our Commitment</h2><p>At {siteConfig.name}, we believe your files are yours alone. We have designed our infrastructure around a zero-retention philosophy.</p></section>
        <section><h2>2. File Upload Process</h2><p>When you upload a file:</p><ul><li>The file is transmitted via encrypted HTTPS connection</li><li>It is stored temporarily in an isolated, secure environment</li><li>Processing begins immediately upon upload</li><li>The processed result is made available for download</li></ul></section>
        <section><h2>3. Automatic Deletion</h2><p>All uploaded and processed files are <strong>automatically and permanently deleted within 10 minutes</strong> of upload. This includes:</p><ul><li>Original uploaded files</li><li>Processed output files</li><li>Any temporary files created during processing</li></ul></section>
        <section><h2>4. No Backups</h2><p>We do not create backups of user-uploaded files. Once deleted, files cannot be recovered by anyone — including our team.</p></section>
        <section><h2>5. Server Security</h2><p>Our servers use industry-standard security practices including encrypted storage, access controls, and regular security audits.</p></section>
        <section><h2>6. Questions</h2><p>For any concerns about data storage, contact us at <a href={`mailto:${siteConfig.contact.email}`}>{siteConfig.contact.email}</a>.</p></section>
      </article>
    </main>
  </>
);

export default DataStorage;
