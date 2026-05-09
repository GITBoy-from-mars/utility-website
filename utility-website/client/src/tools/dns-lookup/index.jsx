import React, { useState } from 'react';
import ToolPageWrapper from '../../components/common/ToolPageWrapper';
import { Icon } from '../../assets/icons/icons';
import meta from './meta';
import '../loan-amortization/LoanAmortization.css';
const DnsLookup = () => {
  const [domain, setDomain] = useState('');
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const lookup = async () => {
    if (!domain) return; setLoading(true); setError(''); setResults(null);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/tools/dns-lookup/lookup`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ domain }) });
      if (!res.ok) throw new Error('Lookup failed');
      setResults(await res.json());
    } catch (e) { setError(e.message); } finally { setLoading(false); }
  };
  return (
    <ToolPageWrapper meta={meta}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div style={{ display: 'flex', gap: 8 }}><input type="text" value={domain} onChange={e => setDomain(e.target.value)} onKeyDown={e => e.key === 'Enter' && lookup()} className="calc-input" placeholder="example.com" style={{ flex: 1 }} /><button onClick={lookup} disabled={loading} className="btn btn-primary"><Icon name="Search" size={18} />{loading ? 'Looking up...' : 'Lookup'}</button></div>
        {error && <p style={{ color: 'var(--error)', fontSize: '0.875rem' }}>{error}</p>}
        {results && Object.entries(results).map(([type, records]) => (
          records && records.length > 0 && <div key={type}>
            <h4 style={{ fontSize: '0.875rem', color: 'var(--neutral-500)', marginBottom: 4 }}>{type} Records</h4>
            <div className="amort-table-wrap"><table className="amort-table"><tbody>{records.map((r, i) => <tr key={i}><td style={{ textAlign: 'left', fontFamily: 'monospace', fontSize: '0.813rem' }}>{typeof r === 'object' ? JSON.stringify(r) : r}</td></tr>)}</tbody></table></div>
          </div>
        ))}
      </div>
    </ToolPageWrapper>
  );
};
export default DnsLookup;
