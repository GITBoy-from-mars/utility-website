import React, { useState } from 'react';
import ToolPageWrapper from '../../components/common/ToolPageWrapper';
import { Icon } from '../../assets/icons/icons';
import meta from './meta';
import '../loan-amortization/LoanAmortization.css';
const BrokenLinkChecker = () => {
  const [url, setUrl] = useState('');
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const check = async () => {
    if (!url) return; setLoading(true); setError(''); setResults(null);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/tools/broken-link-checker/check`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ url }) });
      if (!res.ok) throw new Error('Failed');
      setResults(await res.json());
    } catch (e) { setError(e.message); } finally { setLoading(false); }
  };
  const broken = results?.links?.filter(l => l.status >= 400 || l.status === 0) || [];
  const ok = results?.links?.filter(l => l.status >= 200 && l.status < 400) || [];
  return (
    <ToolPageWrapper meta={meta}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div style={{ display: 'flex', gap: 8 }}><input type="text" value={url} onChange={e => setUrl(e.target.value)} onKeyDown={e => e.key === 'Enter' && check()} className="calc-input" placeholder="https://example.com" style={{ flex: 1 }} /><button onClick={check} disabled={loading} className="btn btn-primary"><Icon name="Search" size={18} />{loading ? 'Checking...' : 'Check Links'}</button></div>
        {loading && <p style={{ textAlign: 'center', color: 'var(--neutral-400)', padding: 20 }}>Scanning page for links... This may take a moment.</p>}
        {error && <p style={{ color: 'var(--error)' }}>{error}</p>}
        {results && (<>
          <div className="calc-results" style={{ gridTemplateColumns: 'repeat(3,1fr)' }}>
            <div className="calc-result-card"><span className="calc-result-label">Total Links</span><span className="calc-result-value">{results.links?.length || 0}</span></div>
            <div className="calc-result-card" style={{ borderColor: '#10B981' }}><span className="calc-result-label">Working</span><span className="calc-result-value" style={{ color: '#10B981' }}>{ok.length}</span></div>
            <div className="calc-result-card" style={{ borderColor: '#EF4444' }}><span className="calc-result-label">Broken</span><span className="calc-result-value" style={{ color: '#EF4444' }}>{broken.length}</span></div>
          </div>
          {broken.length > 0 && <><h4 style={{ color: '#EF4444', fontSize: '0.875rem' }}>❌ Broken Links</h4>
            <div className="amort-table-wrap"><table className="amort-table"><thead><tr><th style={{ textAlign: 'left' }}>URL</th><th>Status</th></tr></thead>
              <tbody>{broken.map((l, i) => <tr key={i}><td style={{ textAlign: 'left', fontSize: '0.75rem', wordBreak: 'break-all', color: '#EF4444' }}>{l.url}</td><td style={{ fontWeight: 700, color: '#EF4444' }}>{l.status || 'Error'}</td></tr>)}</tbody>
            </table></div></>}
          {ok.length > 0 && <><h4 style={{ color: '#10B981', fontSize: '0.875rem' }}>✅ Working Links ({ok.length})</h4>
            <div className="amort-table-wrap" style={{ maxHeight: 300, overflow: 'auto' }}><table className="amort-table">
              <tbody>{ok.slice(0, 50).map((l, i) => <tr key={i}><td style={{ textAlign: 'left', fontSize: '0.75rem', wordBreak: 'break-all' }}>{l.url}</td><td style={{ fontWeight: 600, color: '#10B981' }}>{l.status}</td></tr>)}</tbody>
            </table></div></>}
        </>)}
      </div>
    </ToolPageWrapper>
  );
};
export default BrokenLinkChecker;
