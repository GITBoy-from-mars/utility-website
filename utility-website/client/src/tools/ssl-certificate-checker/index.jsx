import React, { useState } from 'react';
import ToolPageWrapper from '../../components/common/ToolPageWrapper';
import { Icon } from '../../assets/icons/icons';
import meta from './meta';
import '../emi-calculator/EmiCalculator.css';
const SslChecker = () => {
  const [domain, setDomain] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const check = async () => {
    if (!domain) return; setLoading(true); setError(''); setResult(null);
    try {
      const res = await fetch('/api/tools/ssl-certificate-checker/check', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ domain }) });
      if (!res.ok) throw new Error('Check failed');
      setResult(await res.json());
    } catch (e) { setError(e.message); } finally { setLoading(false); }
  };
  return (
    <ToolPageWrapper meta={meta}>
      <div className="calc-tool">
        <div style={{ display: 'flex', gap: 8 }}><input type="text" value={domain} onChange={e => setDomain(e.target.value)} onKeyDown={e => e.key === 'Enter' && check()} className="calc-input" placeholder="example.com" style={{ flex: 1 }} /><button onClick={check} disabled={loading} className="btn btn-primary"><Icon name="Shield" size={18} />{loading ? 'Checking...' : 'Check SSL'}</button></div>
        {error && <p style={{ color: 'var(--error)' }}>{error}</p>}
        {result && (
          <div className="calc-results" style={{ gridTemplateColumns: 'repeat(2,1fr)' }}>
            <div className="calc-result-card calc-result-primary"><span className="calc-result-label">Status</span><span className="calc-result-value" style={{ color: result.valid ? '#10B981' : '#EF4444' }}>{result.valid ? '✅ Valid' : '❌ Invalid'}</span></div>
            <div className="calc-result-card"><span className="calc-result-label">Issuer</span><span className="calc-result-value" style={{ fontSize: '0.75rem' }}>{result.issuer || 'N/A'}</span></div>
            <div className="calc-result-card"><span className="calc-result-label">Valid From</span><span className="calc-result-value" style={{ fontSize: '0.75rem' }}>{result.validFrom || 'N/A'}</span></div>
            <div className="calc-result-card"><span className="calc-result-label">Expires</span><span className="calc-result-value" style={{ fontSize: '0.75rem', color: result.daysLeft < 30 ? '#EF4444' : '#10B981' }}>{result.validTo || 'N/A'}{result.daysLeft != null && ` (${result.daysLeft} days)`}</span></div>
          </div>
        )}
      </div>
    </ToolPageWrapper>
  );
};
export default SslChecker;
