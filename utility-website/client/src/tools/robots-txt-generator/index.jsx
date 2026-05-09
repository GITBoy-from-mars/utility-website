import React, { useState, useMemo } from 'react';
import ToolPageWrapper from '../../components/common/ToolPageWrapper';
import { Icon } from '../../assets/icons/icons';
import meta from './meta';
import '../base64-encoder-decoder/Base64Tool.css';
const RobotsTxtGenerator = () => {
  const [agents, setAgents] = useState([{ name: '*', allow: '/', disallow: '/admin/\n/private/', crawlDelay: '' }]);
  const [sitemapUrl, setSitemapUrl] = useState('https://example.com/sitemap.xml');
  const output = useMemo(() => {
    let txt = '';
    agents.forEach(a => {
      txt += `User-agent: ${a.name}\n`;
      a.allow.split('\n').filter(Boolean).forEach(p => { txt += `Allow: ${p.trim()}\n`; });
      a.disallow.split('\n').filter(Boolean).forEach(p => { txt += `Disallow: ${p.trim()}\n`; });
      if (a.crawlDelay) txt += `Crawl-delay: ${a.crawlDelay}\n`;
      txt += '\n';
    });
    if (sitemapUrl) txt += `Sitemap: ${sitemapUrl}\n`;
    return txt;
  }, [agents, sitemapUrl]);
  const updateAgent = (i, field, val) => { const copy = [...agents]; copy[i] = { ...copy[i], [field]: val }; setAgents(copy); };
  const download = () => { const b = new Blob([output], { type: 'text/plain' }); const a = document.createElement('a'); a.href = URL.createObjectURL(b); a.download = 'robots.txt'; a.click(); };
  return (
    <ToolPageWrapper meta={meta}>
      <div className="devtool">
        {agents.map((a, i) => (
          <div key={i} style={{ padding: 16, border: '1px solid var(--neutral-200)', borderRadius: 'var(--radius-md)', display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div className="form-group"><label>User-Agent</label><input className="calc-input" value={a.name} onChange={e => updateAgent(i, 'name', e.target.value)} /></div>
            <div className="form-group"><label>Allow (one per line)</label><textarea className="devtool-textarea" rows={2} value={a.allow} onChange={e => updateAgent(i, 'allow', e.target.value)} /></div>
            <div className="form-group"><label>Disallow (one per line)</label><textarea className="devtool-textarea" rows={2} value={a.disallow} onChange={e => updateAgent(i, 'disallow', e.target.value)} /></div>
          </div>
        ))}
        <div className="form-group"><label>Sitemap URL</label><input className="calc-input" value={sitemapUrl} onChange={e => setSitemapUrl(e.target.value)} /></div>
        <div className="devtool-actions"><button onClick={download} className="btn btn-primary"><Icon name="Download" size={18} />Download</button><button onClick={() => navigator.clipboard.writeText(output)} className="btn btn-ghost"><Icon name="File" size={18} />Copy</button></div>
        <textarea className="devtool-textarea devtool-output" rows={10} value={output} readOnly />
      </div>
    </ToolPageWrapper>
  );
};
export default RobotsTxtGenerator;
