import React, { useState, useMemo } from 'react';
import ToolPageWrapper from '../../components/common/ToolPageWrapper';
import meta from './meta';
import '../emi-calculator/EmiCalculator.css';

const SipCalculator = () => {
  const [monthly, setMonthly] = useState(10000);
  const [rate, setRate] = useState(12);
  const [years, setYears] = useState(10);

  const result = useMemo(() => {
    const n = years * 12;
    const r = rate / 100 / 12;
    const fv = monthly * ((Math.pow(1 + r, n) - 1) / r) * (1 + r);
    const invested = monthly * n;
    return { fv, invested, returns: fv - invested };
  }, [monthly, rate, years]);

  const fmt = n => '₹' + Math.round(n).toLocaleString('en-IN');

  return (
    <ToolPageWrapper meta={meta}>
      <div className="calc-tool">
        <div className="calc-inputs">
          <div className="form-group"><label>Monthly SIP Amount</label><input type="number" value={monthly} onChange={e => setMonthly(+e.target.value)} className="calc-input" /></div>
          <div className="form-group"><label>Expected Return Rate (% p.a.)</label><input type="number" step="0.5" value={rate} onChange={e => setRate(+e.target.value)} className="calc-input" /></div>
          <div className="form-group"><label>Investment Period (Years)</label><input type="number" value={years} onChange={e => setYears(+e.target.value)} className="calc-input" /></div>
        </div>
        <div className="calc-results">
          <div className="calc-result-card"><span className="calc-result-label">Total Invested</span><span className="calc-result-value">{fmt(result.invested)}</span></div>
          <div className="calc-result-card"><span className="calc-result-label">Est. Returns</span><span className="calc-result-value">{fmt(result.returns)}</span></div>
          <div className="calc-result-card calc-result-primary"><span className="calc-result-label">Total Value</span><span className="calc-result-value">{fmt(result.fv)}</span></div>
        </div>
        <div className="calc-breakdown"><div className="calc-bar"><div className="calc-bar-principal" style={{ width: `${(result.invested / result.fv) * 100}%` }} /></div>
          <div className="calc-bar-legend"><span><i style={{ background: 'var(--primary-500)' }} />Invested ({((result.invested / result.fv) * 100).toFixed(1)}%)</span><span><i style={{ background: 'var(--warning)' }} />Returns ({((result.returns / result.fv) * 100).toFixed(1)}%)</span></div>
        </div>
      </div>
    </ToolPageWrapper>
  );
};
export default SipCalculator;
