import React, { useState, useEffect, useCallback } from 'react';
import ToolPageWrapper from '../../components/common/ToolPageWrapper';
import { Icon } from '../../assets/icons/icons';
import meta from './meta';
import '../emi-calculator/EmiCalculator.css';

const WhatsMyIp = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchIP = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      // Primary: ipinfo.io (reliable, free tier)
      const res = await fetch('https://ipinfo.io/json?token=', { signal: AbortSignal.timeout(5000) });
      if (res.ok) {
        const d = await res.json();
        const [lat, lon] = (d.loc || ',').split(',');
        setData({
          ip: d.ip,
          city: d.city,
          region: d.region,
          country_name: d.country,
          org: d.org,
          timezone: d.timezone,
          postal: d.postal,
          lat, lon,
        });
        setLoading(false);
        return;
      }
    } catch {}

    try {
      // Fallback 1: ipapi.co
      const res = await fetch('https://ipapi.co/json/', { signal: AbortSignal.timeout(5000) });
      if (res.ok) {
        const d = await res.json();
        if (d.ip) { setData(d); setLoading(false); return; }
      }
    } catch {}

    try {
      // Fallback 2: just IP
      const res = await fetch('https://api.ipify.org?format=json', { signal: AbortSignal.timeout(5000) });
      if (res.ok) {
        const d = await res.json();
        setData({ ip: d.ip });
        setLoading(false);
        return;
      }
    } catch {}

    try {
      // Fallback 3: api64
      const res = await fetch('https://api64.ipify.org?format=json', { signal: AbortSignal.timeout(5000) });
      if (res.ok) {
        const d = await res.json();
        setData({ ip: d.ip });
        setLoading(false);
        return;
      }
    } catch {}

    setError('Could not detect your IP address. Please check your internet connection.');
    setLoading(false);
  }, []);

  useEffect(() => { fetchIP(); }, [fetchIP]);

  if (loading) return (
    <ToolPageWrapper meta={meta}>
      <div style={{ textAlign: 'center', padding: 60 }}>
        <div className="spinner" style={{ width: 40, height: 40, border: '3px solid var(--neutral-200)', borderTopColor: 'var(--primary-500)', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 16px' }} />
        <p style={{ color: 'var(--neutral-400)' }}>Detecting your IP address...</p>
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      </div>
    </ToolPageWrapper>
  );

  return (
    <ToolPageWrapper meta={meta}>
      <div className="calc-tool">
        {error && <p style={{ color: 'var(--error)', textAlign: 'center', padding: 20 }}>{error}</p>}
        {data && (<>
          <div className="calc-results" style={{ gridTemplateColumns: '1fr' }}>
            <div className="calc-result-card calc-result-primary">
              <span className="calc-result-label">Your Public IP Address</span>
              <span className="calc-result-value" style={{ fontSize: '1.75rem', fontFamily: 'monospace', letterSpacing: '1px' }}>{data.ip || 'Unknown'}</span>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginTop: 12 }}>
            <button onClick={() => navigator.clipboard.writeText(data.ip)} className="btn btn-ghost btn-sm"><Icon name="File" size={14} />Copy IP</button>
            <button onClick={fetchIP} className="btn btn-ghost btn-sm"><Icon name="Zap" size={14} />Refresh</button>
          </div>
          {data.city && (
            <div className="calc-results" style={{ gridTemplateColumns: 'repeat(3,1fr)', marginTop: 16 }}>
              <div className="calc-result-card"><span className="calc-result-label">City</span><span className="calc-result-value">{data.city}</span></div>
              <div className="calc-result-card"><span className="calc-result-label">Region</span><span className="calc-result-value">{data.region}</span></div>
              <div className="calc-result-card"><span className="calc-result-label">Country</span><span className="calc-result-value">{data.country_name}</span></div>
              <div className="calc-result-card"><span className="calc-result-label">ISP / Org</span><span className="calc-result-value" style={{ fontSize: '0.75rem' }}>{data.org || 'N/A'}</span></div>
              <div className="calc-result-card"><span className="calc-result-label">Timezone</span><span className="calc-result-value">{data.timezone || 'N/A'}</span></div>
              <div className="calc-result-card"><span className="calc-result-label">Postal Code</span><span className="calc-result-value">{data.postal || 'N/A'}</span></div>
            </div>
          )}
        </>)}
      </div>
    </ToolPageWrapper>
  );
};
export default WhatsMyIp;
