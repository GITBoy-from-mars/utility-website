import React, { useState, useMemo } from 'react';
import ToolPageWrapper from '../../components/common/ToolPageWrapper';
import { Icon } from '../../assets/icons/icons';
import meta from './meta';

const LandingPageGenerator = () => {
  const [brand, setBrand] = useState('MyBrand');
  const [headline, setHeadline] = useState('Build Something Amazing');
  const [subtext, setSubtext] = useState('The fastest way to launch your next project. Simple, powerful, and free.');
  const [ctaText, setCtaText] = useState('Get Started');
  const [ctaUrl, setCtaUrl] = useState('#');
  const [primaryColor, setPrimaryColor] = useState('#3B82F6');
  const [features, setFeatures] = useState([
    { title: 'Fast', desc: 'Lightning quick performance' },
    { title: 'Secure', desc: 'Enterprise-grade security' },
    { title: 'Scalable', desc: 'Grows with your business' },
  ]);
  const [showFeatures, setShowFeatures] = useState(true);
  const [showFooter, setShowFooter] = useState(true);

  const addFeature = () => setFeatures([...features, { title: '', desc: '' }]);
  const updateFeature = (i, f, v) => { const c = [...features]; c[i] = { ...c[i], [f]: v }; setFeatures(c); };
  const removeFeature = i => setFeatures(features.filter((_, idx) => idx !== i));

  const html = useMemo(() => {
    const featuresHtml = showFeatures ? `
    <section style="padding:60px 20px;max-width:900px;margin:0 auto">
      <h2 style="text-align:center;font-size:28px;margin-bottom:40px;color:#1a1a2e">Features</h2>
      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(250px,1fr));gap:24px">
        ${features.map(f => `<div style="padding:24px;background:#f8f9fa;border-radius:12px;text-align:center">
          <h3 style="font-size:18px;margin-bottom:8px;color:${primaryColor}">${f.title}</h3>
          <p style="color:#666;font-size:14px">${f.desc}</p>
        </div>`).join('\n        ')}
      </div>
    </section>` : '';

    const footerHtml = showFooter ? `
    <footer style="background:#1a1a2e;color:#94a3b8;text-align:center;padding:24px 20px;font-size:13px">
      &copy; ${new Date().getFullYear()} ${brand}. All rights reserved.
    </footer>` : '';

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${brand} - ${headline}</title>
  <style>
    * { margin:0; padding:0; box-sizing:border-box; font-family:'Segoe UI',sans-serif; }
    body { color:#1a1a2e; }
  </style>
</head>
<body>
  <header style="display:flex;justify-content:space-between;align-items:center;padding:16px 24px;border-bottom:1px solid #eee">
    <div style="font-weight:800;font-size:20px;color:${primaryColor}">${brand}</div>
    <nav style="display:flex;gap:20px;font-size:14px">
      <a href="#" style="color:#555;text-decoration:none">Features</a>
      <a href="#" style="color:#555;text-decoration:none">Pricing</a>
      <a href="#" style="color:#555;text-decoration:none">Contact</a>
    </nav>
  </header>

  <section style="text-align:center;padding:80px 20px;background:linear-gradient(135deg,${primaryColor}10,${primaryColor}05)">
    <h1 style="font-size:48px;font-weight:800;margin-bottom:16px;color:#1a1a2e">${headline}</h1>
    <p style="font-size:18px;color:#666;max-width:560px;margin:0 auto 32px">${subtext}</p>
    <a href="${ctaUrl}" style="display:inline-block;padding:14px 32px;background:${primaryColor};color:#fff;border-radius:8px;font-weight:700;font-size:16px;text-decoration:none">${ctaText}</a>
  </section>
${featuresHtml}
${footerHtml}
</body>
</html>`;
  }, [brand, headline, subtext, ctaText, ctaUrl, primaryColor, features, showFeatures, showFooter]);

  return (
    <ToolPageWrapper meta={meta}>
      <div style={{ display: 'grid', gridTemplateColumns: '340px 1fr', gap: 20 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <h3 style={{ fontSize: '0.938rem', fontWeight: 700 }}>Page Settings</h3>
          <div className="form-group"><label>Brand Name</label><input value={brand} onChange={e => setBrand(e.target.value)} className="calc-input" /></div>
          <div className="form-group"><label>Headline</label><input value={headline} onChange={e => setHeadline(e.target.value)} className="calc-input" /></div>
          <div className="form-group"><label>Sub-text</label><textarea value={subtext} onChange={e => setSubtext(e.target.value)} className="devtool-textarea" rows={2} /></div>
          <div style={{ display: 'flex', gap: 8 }}>
            <div className="form-group" style={{ flex: 1 }}><label>CTA Text</label><input value={ctaText} onChange={e => setCtaText(e.target.value)} className="calc-input" /></div>
            <div className="form-group" style={{ flex: 1 }}><label>CTA URL</label><input value={ctaUrl} onChange={e => setCtaUrl(e.target.value)} className="calc-input" /></div>
          </div>
          <div className="form-group"><label>Primary Color</label><input type="color" value={primaryColor} onChange={e => setPrimaryColor(e.target.value)} style={{ width: 48, height: 32, border: 'none', cursor: 'pointer' }} /></div>
          <div style={{ display: 'flex', gap: 12 }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.813rem', cursor: 'pointer' }}><input type="checkbox" checked={showFeatures} onChange={e => setShowFeatures(e.target.checked)} />Features</label>
            <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.813rem', cursor: 'pointer' }}><input type="checkbox" checked={showFooter} onChange={e => setShowFooter(e.target.checked)} />Footer</label>
          </div>
          <hr />
          {showFeatures && (<>
            <h4 style={{ fontSize: '0.875rem', fontWeight: 700 }}>Features</h4>
            {features.map((f, i) => (
              <div key={i} style={{ display: 'flex', gap: 6, alignItems: 'end' }}>
                <div className="form-group" style={{ flex: 1 }}><label>{i === 0 ? 'Title' : ''}</label><input value={f.title} onChange={e => updateFeature(i, 'title', e.target.value)} className="calc-input" /></div>
                <div className="form-group" style={{ flex: 2 }}><label>{i === 0 ? 'Description' : ''}</label><input value={f.desc} onChange={e => updateFeature(i, 'desc', e.target.value)} className="calc-input" /></div>
                <button onClick={() => removeFeature(i)} className="btn btn-ghost btn-sm" style={{ color: 'var(--error)', marginBottom: 2 }}><Icon name="X" size={14} /></button>
              </div>
            ))}
            <button onClick={addFeature} className="btn btn-ghost btn-sm">+ Add Feature</button>
          </>)}
          <hr />
          <button onClick={() => navigator.clipboard.writeText(html)} className="btn btn-primary btn-lg" style={{ width: '100%' }}><Icon name="File" size={18} />Copy HTML Code</button>
          <button onClick={() => { const b = new Blob([html], { type: 'text/html' }); const a = document.createElement('a'); a.href = URL.createObjectURL(b); a.download = 'landing-page.html'; a.click(); }} className="btn btn-ghost" style={{ width: '100%' }}><Icon name="Download" size={18} />Download HTML</button>
        </div>

        {/* Preview */}
        <div style={{ border: '1px solid var(--neutral-200)', borderRadius: 12, overflow: 'hidden', minHeight: 500 }}>
          <iframe srcDoc={html} style={{ width: '100%', height: '100%', minHeight: 500, border: 'none' }} title="Preview" />
        </div>
      </div>
    </ToolPageWrapper>
  );
};
export default LandingPageGenerator;
