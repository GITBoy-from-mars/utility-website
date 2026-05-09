import React, { useState } from 'react';
import ToolPageWrapper from '../../components/common/ToolPageWrapper';
import { Icon } from '../../assets/icons/icons';
import meta from './meta';
import '../base64-encoder-decoder/Base64Tool.css';
const SitemapGenerator = () => {
  const [urls, setUrls] = useState('https://example.com/\nhttps://example.com/about\nhttps://example.com/contact');
  const [freq, setFreq] = useState('weekly');
  const [priority, setPriority] = useState('0.8');
  const [output, setOutput] = useState('');
  const generate = () => {
    const lines = urls.split('\n').map(u => u.trim()).filter(Boolean);
    const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${lines.map(u => `  <url>\n    <loc>${u}</loc>\n    <changefreq>${freq}</changefreq>\n    <priority>${priority}</priority>\n  </url>`).join('\n')}\n</urlset>`;
    setOutput(xml);
  };
  const download = () => { const b = new Blob([output], { type: 'text/xml' }); const a = document.createElement('a'); a.href = URL.createObjectURL(b); a.download = 'sitemap.xml'; a.click(); };
  return (
    <ToolPageWrapper meta={meta}>
      <div className="devtool">
        <div className="form-group"><label>URLs (one per line)</label><textarea className="devtool-textarea" rows={6} value={urls} onChange={e => setUrls(e.target.value)} /></div>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <div className="form-group" style={{ flex: 1 }}><label>Change Frequency</label><select value={freq} onChange={e => setFreq(e.target.value)} className="qr-select">{['always','hourly','daily','weekly','monthly','yearly','never'].map(f => <option key={f} value={f}>{f}</option>)}</select></div>
          <div className="form-group" style={{ flex: 1 }}><label>Priority</label><select value={priority} onChange={e => setPriority(e.target.value)} className="qr-select">{['1.0','0.9','0.8','0.7','0.6','0.5','0.4','0.3','0.2','0.1'].map(p => <option key={p} value={p}>{p}</option>)}</select></div>
        </div>
        <div className="devtool-actions"><button onClick={generate} className="btn btn-primary"><Icon name="Zap" size={18} />Generate</button>{output && <button onClick={download} className="btn btn-secondary"><Icon name="Download" size={18} />Download</button>}</div>
        {output && <textarea className="devtool-textarea devtool-output" rows={12} value={output} readOnly />}
      </div>
    </ToolPageWrapper>
  );
};
export default SitemapGenerator;
