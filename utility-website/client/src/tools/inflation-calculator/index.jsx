import React, { useState, useMemo } from 'react';
import ToolPageWrapper from '../../components/common/ToolPageWrapper';
import meta from './meta';
import '../emi-calculator/EmiCalculator.css';
const InflationCalc = () => {
  const [amount, setAmount] = useState(100000);
  const [rate, setRate] = useState(6);
  const [years, setYears] = useState(10);
  const futureValue = useMemo(() => amount * Math.pow(1 + rate / 100, years), [amount, rate, years]);
  const presentValue = useMemo(() => amount / Math.pow(1 + rate / 100, years), [amount, rate, years]);
  const fmt = n => '₹' + n.toLocaleString('en-IN', { maximumFractionDigits: 0 });
  return (
    <ToolPageWrapper meta={meta}>
      <div className="calc-tool">
        <div className="calc-inputs">
          <div className="form-group"><label>Amount (₹)</label><input type="number" value={amount} onChange={e => setAmount(+e.target.value)} className="calc-input" /></div>
          <div className="form-group"><label>Inflation Rate (%)</label><input type="number" value={rate} onChange={e => setRate(+e.target.value)} className="calc-input" step="0.5" /></div>
          <div className="form-group"><label>Years</label><input type="number" value={years} onChange={e => setYears(+e.target.value)} className="calc-input" /></div>
        </div>
        <div className="calc-results" style={{ gridTemplateColumns: 'repeat(2,1fr)' }}>
          <div className="calc-result-card calc-result-primary"><span className="calc-result-label">Future Cost of {fmt(amount)} today</span><span className="calc-result-value">{fmt(futureValue)}</span></div>
          <div className="calc-result-card"><span className="calc-result-label">Today's value of {fmt(amount)} in {years} years</span><span className="calc-result-value" style={{ color: '#EF4444' }}>{fmt(presentValue)}</span></div>
        </div>
        <p style={{ fontSize: '0.813rem', color: 'var(--neutral-500)', textAlign: 'center' }}>Purchasing power lost: <strong style={{ color: '#EF4444' }}>{((1 - presentValue / amount) * 100).toFixed(1)}%</strong> over {years} years at {rate}% inflation</p>
      </div>
    </ToolPageWrapper>
  );
};
export default InflationCalc;
