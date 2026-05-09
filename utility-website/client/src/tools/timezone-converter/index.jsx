import React, { useState, useMemo } from 'react';
import ToolPageWrapper from '../../components/common/ToolPageWrapper';
import meta from './meta';
import '../emi-calculator/EmiCalculator.css';
const zones = ['America/New_York','America/Chicago','America/Denver','America/Los_Angeles','Europe/London','Europe/Paris','Europe/Berlin','Asia/Dubai','Asia/Kolkata','Asia/Shanghai','Asia/Tokyo','Australia/Sydney','Pacific/Auckland','America/Sao_Paulo','Africa/Cairo'];
const TimeZoneConverter = () => {
  const [from, setFrom] = useState('Asia/Kolkata');
  const [to, setTo] = useState('America/New_York');
  const [dt, setDt] = useState(new Date().toISOString().slice(0, 16));
  const converted = useMemo(() => {
    try {
      const d = new Date(dt);
      return d.toLocaleString('en-US', { timeZone: to, dateStyle: 'full', timeStyle: 'long' });
    } catch { return 'Invalid'; }
  }, [dt, to]);
  return (
    <ToolPageWrapper meta={meta}>
      <div className="calc-tool">
        <div className="calc-inputs">
          <div className="form-group"><label>Date & Time</label><input type="datetime-local" value={dt} onChange={e => setDt(e.target.value)} className="calc-input" /></div>
          <div className="calc-row">
            <div className="form-group" style={{ flex: 1 }}><label>From</label><select value={from} onChange={e => setFrom(e.target.value)} className="calc-select" style={{ width: '100%' }}>{zones.map(z => <option key={z} value={z}>{z.replace(/_/g, ' ')}</option>)}</select></div>
            <div className="form-group" style={{ flex: 1 }}><label>To</label><select value={to} onChange={e => setTo(e.target.value)} className="calc-select" style={{ width: '100%' }}>{zones.map(z => <option key={z} value={z}>{z.replace(/_/g, ' ')}</option>)}</select></div>
          </div>
        </div>
        <div className="calc-results" style={{ gridTemplateColumns: '1fr' }}>
          <div className="calc-result-card calc-result-primary"><span className="calc-result-label">Converted Time</span><span className="calc-result-value" style={{ fontSize: '1.1rem' }}>{converted}</span></div>
        </div>
      </div>
    </ToolPageWrapper>
  );
};
export default TimeZoneConverter;
