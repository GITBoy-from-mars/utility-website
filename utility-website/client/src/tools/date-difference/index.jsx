import React, { useState, useMemo } from 'react';
import ToolPageWrapper from '../../components/common/ToolPageWrapper';
import meta from './meta';
import '../emi-calculator/EmiCalculator.css';
const DateDifference = () => {
  const [d1, setD1] = useState(new Date().toISOString().split('T')[0]);
  const [d2, setD2] = useState(new Date(Date.now() + 100 * 86400000).toISOString().split('T')[0]);
  const r = useMemo(() => {
    const a = new Date(d1), b = new Date(d2);
    const ms = Math.abs(b - a);
    const days = Math.floor(ms / 86400000);
    const weeks = Math.floor(days / 7);
    const hours = Math.floor(ms / 3600000);
    const minutes = Math.floor(ms / 60000);
    const months = Math.round(days / 30.44);
    const years = (days / 365.25).toFixed(2);
    return { days, weeks, hours, minutes, months, years };
  }, [d1, d2]);
  return (
    <ToolPageWrapper meta={meta}>
      <div className="calc-tool">
        <div className="calc-inputs"><div className="calc-row">
          <div className="form-group" style={{ flex: 1 }}><label>Start Date</label><input type="date" value={d1} onChange={e => setD1(e.target.value)} className="calc-input" /></div>
          <div className="form-group" style={{ flex: 1 }}><label>End Date</label><input type="date" value={d2} onChange={e => setD2(e.target.value)} className="calc-input" /></div>
        </div></div>
        <div className="calc-results" style={{ gridTemplateColumns: 'repeat(3,1fr)' }}>
          <div className="calc-result-card calc-result-primary"><span className="calc-result-label">Days</span><span className="calc-result-value">{r.days.toLocaleString()}</span></div>
          <div className="calc-result-card"><span className="calc-result-label">Weeks</span><span className="calc-result-value">{r.weeks.toLocaleString()}</span></div>
          <div className="calc-result-card"><span className="calc-result-label">Months</span><span className="calc-result-value">{r.months}</span></div>
          <div className="calc-result-card"><span className="calc-result-label">Years</span><span className="calc-result-value">{r.years}</span></div>
          <div className="calc-result-card"><span className="calc-result-label">Hours</span><span className="calc-result-value">{r.hours.toLocaleString()}</span></div>
          <div className="calc-result-card"><span className="calc-result-label">Minutes</span><span className="calc-result-value">{r.minutes.toLocaleString()}</span></div>
        </div>
      </div>
    </ToolPageWrapper>
  );
};
export default DateDifference;
