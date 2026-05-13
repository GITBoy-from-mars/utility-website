import React, { useState, useRef } from 'react';
import ToolPageWrapper from '../../components/common/ToolPageWrapper';
import { Icon } from '../../assets/icons/icons';
import meta from './meta';

const TEMPLATES = [
  { id: 'modern', name: 'Modern', bg: '#1E293B', text: '#F8FAFC', accent: '#3B82F6' },
  { id: 'clean', name: 'Clean', bg: '#FFFFFF', text: '#1E293B', accent: '#10B981' },
  { id: 'bold', name: 'Bold', bg: '#7C3AED', text: '#FFFFFF', accent: '#F59E0B' },
  { id: 'minimal', name: 'Minimal', bg: '#FAFAF9', text: '#292524', accent: '#0EA5E9' },
  { id: 'dark', name: 'Dark Pro', bg: '#0F172A', text: '#E2E8F0', accent: '#F97316' },
  { id: 'gradient', name: 'Gradient', bg: 'linear-gradient(135deg,#667eea,#764ba2)', text: '#FFFFFF', accent: '#FCD34D' },
];

const BusinessCardGenerator = () => {
  const [name, setName] = useState('John Smith');
  const [title, setTitle] = useState('Senior Developer');
  const [company, setCompany] = useState('Tech Solutions Inc.');
  const [email, setEmail] = useState('john@techsolutions.com');
  const [phone, setPhone] = useState('+91 98765 43210');
  const [website, setWebsite] = useState('www.techsolutions.com');
  const [address, setAddress] = useState('123 Business Park, City');
  const [templateId, setTemplateId] = useState('modern');
  const cardRef = useRef(null);

  const t = TEMPLATES.find(tp => tp.id === templateId) || TEMPLATES[0];
  const isGradient = t.bg.includes('gradient');

  const downloadCard = async () => {
    try {
      const { default: html2canvas } = await import('html2canvas');
      const canvas = await html2canvas(cardRef.current, { scale: 3, backgroundColor: null, useCORS: true, logging: false });
      const a = document.createElement('a');
      a.href = canvas.toDataURL('image/png');
      a.download = 'business-card.png';
      a.click();
    } catch {
      alert('Failed to export. Please try again.');
    }
  };

  const printCard = () => {
    const win = window.open('', '_blank');
    win.document.write(`<html><head><title>Business Card</title><style>
      *{margin:0;padding:0;box-sizing:border-box;font-family:'Segoe UI',sans-serif}
      body{display:flex;justify-content:center;align-items:center;min-height:100vh;background:#f5f5f5}
      @media print{body{background:#fff}}
    </style></head><body>`);
    win.document.write(cardRef.current.outerHTML);
    win.document.write('</body></html>');
    win.document.close();
    setTimeout(() => { win.print(); win.close(); }, 500);
  };

  return (
    <ToolPageWrapper meta={meta}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <h3 style={{ fontSize: '0.938rem', fontWeight: 700 }}>Card Details</h3>
          <div className="form-group"><label>Full Name</label><input value={name} onChange={e => setName(e.target.value)} className="calc-input" /></div>
          <div className="form-group"><label>Job Title</label><input value={title} onChange={e => setTitle(e.target.value)} className="calc-input" /></div>
          <div className="form-group"><label>Company</label><input value={company} onChange={e => setCompany(e.target.value)} className="calc-input" /></div>
          <div className="form-group"><label>Email</label><input value={email} onChange={e => setEmail(e.target.value)} className="calc-input" /></div>
          <div className="form-group"><label>Phone</label><input value={phone} onChange={e => setPhone(e.target.value)} className="calc-input" /></div>
          <div className="form-group"><label>Website</label><input value={website} onChange={e => setWebsite(e.target.value)} className="calc-input" /></div>
          <div className="form-group"><label>Address</label><input value={address} onChange={e => setAddress(e.target.value)} className="calc-input" /></div>
          <hr />
          <h3 style={{ fontSize: '0.938rem', fontWeight: 700 }}>Template</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
            {TEMPLATES.map(tp => (
              <button key={tp.id} onClick={() => setTemplateId(tp.id)}
                style={{
                  padding: '10px 8px', borderRadius: 8, border: templateId === tp.id ? `2px solid ${tp.accent}` : '1px solid var(--neutral-200)',
                  background: tp.bg.includes('gradient') ? tp.bg : tp.bg, color: tp.text, fontSize: '0.688rem', fontWeight: 700, cursor: 'pointer', textAlign: 'center',
                }}>
                {tp.name}
              </button>
            ))}
          </div>
          <hr />
          <button onClick={downloadCard} className="btn btn-primary" style={{ width: '100%' }}><Icon name="Download" size={18} />Download as PNG</button>
          <button onClick={printCard} className="btn btn-ghost" style={{ width: '100%' }}>Print Card</button>
        </div>

        {/* Card Preview */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16 }}>
          <p style={{ fontSize: '0.75rem', color: 'var(--neutral-400)' }}>Standard size: 3.5" x 2"</p>
          <div ref={cardRef}
            style={{
              width: 350, height: 200, borderRadius: 12, padding: 24,
              background: t.bg, color: t.text, position: 'relative', overflow: 'hidden',
              boxShadow: '0 8px 32px rgba(0,0,0,0.15)', fontFamily: "'Segoe UI', sans-serif",
              display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
            }}>
            {/* Accent bar */}
            <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: 4, background: t.accent }} />

            <div>
              <h2 style={{ fontSize: '1.125rem', fontWeight: 800, letterSpacing: '-0.3px', marginBottom: 2 }}>{name}</h2>
              <p style={{ fontSize: '0.688rem', opacity: 0.7, fontWeight: 500 }}>{title}</p>
              <p style={{ fontSize: '0.75rem', fontWeight: 700, color: t.accent, marginTop: 2 }}>{company}</p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 3, fontSize: '0.625rem', opacity: 0.8 }}>
              {email && <span>{email}</span>}
              {phone && <span>{phone}</span>}
              {website && <span>{website}</span>}
              {address && <span>{address}</span>}
            </div>

            {/* Decorative circle */}
            <div style={{ position: 'absolute', bottom: -20, right: -20, width: 80, height: 80, borderRadius: '50%', background: t.accent, opacity: 0.1 }} />
          </div>
        </div>
      </div>
    </ToolPageWrapper>
  );
};
export default BusinessCardGenerator;
