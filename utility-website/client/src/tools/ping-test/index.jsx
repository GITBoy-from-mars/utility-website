import React, { useState } from 'react';
import ToolPageWrapper from '../../components/common/ToolPageWrapper';
import { Icon } from '../../assets/icons/icons';
import meta from './meta';
import '../emi-calculator/EmiCalculator.css';
const PingTest = () => {
  const [host, setHost] = useState('');
  const [results, setResults] = useState([]);
  const [pinging, setPinging] = useState(false);
  const ping = async () => {
    if (!host) return; setPinging(true);
    try {
      const res = await fetch('/api/tools/ping-test/ping', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ host }) });
      const data = await res.json();
      setResults(prev => [data, ...prev.slice(0, 9)]);
    } catch { setResults(prev => [{ host, status: 'error', message: 'Request failed' }, ...prev.slice(0, 9)]); }
    setPinging(false);
  };
  return (
    <ToolPageWrapper meta={meta}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div style={{ display: 'flex', gap: 8 }}><input type="text" value={host} onChange={e => setHost(e.target.value)} onKeyDown={e => e.key === 'Enter' && ping()} className="calc-input" placeholder="google.com or 8.8.8.8" style={{ flex: 1 }} /><button onClick={ping} disabled={pinging} className="btn btn-primary">{pinging ? 'Pinging...' : '🏓 Ping'}</button></div>
        {results.length > 0 && results.map((r, i) => (
          <div key={i} className="calc-results" style={{ gridTemplateColumns: 'repeat(3,1fr)' }}>
            <div className="calc-result-card"><span className="calc-result-label">Host</span><span className="calc-result-value" style={{ fontSize: '0.875rem' }}>{r.host}</span></div>
            <div className="calc-result-card"><span className="calc-result-label">Status</span><span className="calc-result-value" style={{ color: r.status === 'ok' ? '#10B981' : '#EF4444' }}>{r.status === 'ok' ? '✓ Reachable' : '✗ Unreachable'}</span></div>
            <div className="calc-result-card"><span className="calc-result-label">Response Time</span><span className="calc-result-value">{r.time ? `${r.time}ms` : 'N/A'}</span></div>
          </div>
        ))}
      </div>
    </ToolPageWrapper>
  );
};
export default PingTest;
