import React, { useState } from 'react';
import SEOHead from '../../components/common/SEOHead';
import { Icon } from '../../assets/icons/icons';
import siteConfig from '../../config/siteConfig';
import './Contact.css';

const Contact = () => {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <>
      <SEOHead title="Contact Us — Get in Touch" description="Have questions, feedback, or a partnership inquiry? Contact the UtiliTools team. We respond within 24-48 hours." slug="/contact" />
      <main className="contact-page">
        <section className="contact-hero"><div className="container"><h1>Contact Us</h1><p className="contact-hero-sub">Have questions, feedback, or a partnership inquiry? We would love to hear from you.</p></div></section>
        <section className="contact-content container">
          <div className="contact-grid">
            <div className="contact-info">
              <div className="contact-info-card">
                <Icon name="Mail" size={22} className="contact-info-icon" />
                <div><h3>Email Us</h3><p>{siteConfig.contact.email}</p></div>
              </div>
              <div className="contact-info-card">
                <Icon name="MapPin" size={22} className="contact-info-icon" />
                <div><h3>Office</h3><p>{siteConfig.company.address}</p></div>
              </div>
              <div className="contact-info-card">
                <Icon name="Zap" size={22} className="contact-info-icon" />
                <div><h3>Support</h3><p>{siteConfig.contact.supportEmail}</p></div>
              </div>
            </div>
            <div className="contact-form-wrap">
              {submitted ? (
                <div className="contact-success">
                  <Icon name="Check" size={32} className="contact-success-icon" />
                  <h3>Message Sent</h3>
                  <p>Thank you for reaching out. We will get back to you within 24-48 hours.</p>
                  <button className="btn btn-secondary" onClick={() => { setSubmitted(false); setForm({ name: '', email: '', subject: '', message: '' }); }}>Send Another</button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="contact-form">
                  <div className="form-row">
                    <div className="form-group"><label htmlFor="contact-name">Full Name</label><input id="contact-name" type="text" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Your name" /></div>
                    <div className="form-group"><label htmlFor="contact-email">Email</label><input id="contact-email" type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="you@example.com" /></div>
                  </div>
                  <div className="form-group"><label htmlFor="contact-subject">Subject</label><input id="contact-subject" type="text" required value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} placeholder="How can we help?" /></div>
                  <div className="form-group"><label htmlFor="contact-message">Message</label><textarea id="contact-message" rows="5" required value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} placeholder="Tell us more..." /></div>
                  <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%' }}>Send Message</button>
                </form>
              )}
            </div>
          </div>
        </section>
      </main>
    </>
  );
};

export default Contact;
