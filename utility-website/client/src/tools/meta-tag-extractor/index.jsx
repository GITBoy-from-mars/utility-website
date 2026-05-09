import React, { useState } from 'react';
import ToolPageWrapper from '../../components/common/ToolPageWrapper';
import { Icon } from '../../assets/icons/icons';
import meta from './meta';
import '../loan-amortization/LoanAmortization.css';
const MetaTagExtractor = () => {
  const [url, setUrl] = useState('');
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const extract = async () => {
    if (!url) return; setLoading(true); setError(''); setResults(null);
    try {
      const res = await fetch('/api/tools/meta-tag-extractor/extract', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ url }) });
      if (!res.ok) throw new Error('Failed');
      setResults(await res.json());
    } catch (e) { setError(e.message); } finally { setLoading(false); }
  };
  return (
    <ToolPageWrapper meta={meta}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div style={{ display: 'flex', gap: 8 }}><input type="text" value={url} onChange={e => setUrl(e.target.value)} onKeyDown={e => e.key === 'Enter' && extract()} className="calc-input" placeholder="https://example.com" style={{ flex: 1 }} /><button onClick={extract} disabled={loading} className="btn btn-primary"><Icon name="Search" size={18} />{loading ? 'Extracting...' : 'Extract'}</button></div>
        {error && <p style={{ color: 'var(--error)' }}>{error}</p>}
        {results && (<>
          {results.title && <div className="calc-results" style={{ gridTemplateColumns: '1fr' }}><div className="calc-result-card calc-result-primary"><span className="calc-result-label">Page Title</span><span className="calc-result-value" style={{ fontSize: '1rem' }}>{results.title}</span></div></div>}
          {results.description && <div style={{ padding: 12, background: 'var(--neutral-50)', borderRadius: 'var(--radius-sm)', fontSize: '0.875rem' }}><strong>Description:</strong> {results.description}</div>}
          {results.tags && results.tags.length > 0 && (
            <div className="amort-table-wrap"><table className="amort-table"><thead><tr><th style={{ textAlign: 'left' }}>Property</th><th style={{ textAlign: 'left' }}>Content</th></tr></thead>
              <tbody>{results.tags.map((t, i) => <tr key={i}><td style={{ textAlign: 'left', fontWeight: 600, fontSize: '0.813rem' }}>{t.property || t.name || t.httpEquiv || '—'}</td><td style={{ textAlign: 'left', fontSize: '0.813rem', wordBreak: 'break-all' }}>{t.content || '—'}</td></tr>)}</tbody>
            </table></div>
          )}
        </>)}
      </div>
    </ToolPageWrapper>
  );
};
export default MetaTagExtractor;
