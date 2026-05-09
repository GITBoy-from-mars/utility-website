import React, { useState, useMemo } from 'react';
import ToolPageWrapper from '../../components/common/ToolPageWrapper';
import meta from './meta';
import './EmiCalculator.css';

const EmiCalculator = () => {
  const [principal, setPrincipal] = useState(1000000);
  const [rate, setRate] = useState(8.5);
  const [tenure, setTenure] = useState(20);
  const [tenureType, setTenureType] = useState('years');

  const result = useMemo(() => {
    const months = tenureType === 'years' ? tenure * 12 : tenure;
    const r = rate / 100 / 12;
    if (r === 0) return { emi: principal / months, totalInterest: 0, totalPayment: principal, months };
    const emi = principal * r * Math.pow(1 + r, months) / (Math.pow(1 + r, months) - 1);
    const totalPayment = emi * months;
    const totalInterest = totalPayment - principal;
    return { emi, totalInterest, totalPayment, months };
  }, [principal, rate, tenure, tenureType]);

  const fmt = (n) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n);

  return (
    <ToolPageWrapper meta={meta}>
      <div className="calc-tool">
        <div className="calc-inputs">
          <div className="form-group"><label>Loan Amount</label><input type="number" value={principal} onChange={e => setPrincipal(Number(e.target.value))} className="calc-input" /></div>
          <div className="form-group"><label>Interest Rate (% per annum)</label><input type="number" step="0.1" value={rate} onChange={e => setRate(Number(e.target.value))} className="calc-input" /></div>
          <div className="calc-row">
            <div className="form-group" style={{ flex: 1 }}><label>Loan Tenure</label><input type="number" value={tenure} onChange={e => setTenure(Number(e.target.value))} className="calc-input" /></div>
            <div className="form-group"><label>&nbsp;</label><select value={tenureType} onChange={e => setTenureType(e.target.value)} className="calc-select"><option value="years">Years</option><option value="months">Months</option></select></div>
          </div>
        </div>
        <div className="calc-results">
          <div className="calc-result-card calc-result-primary"><span className="calc-result-label">Monthly EMI</span><span className="calc-result-value">{fmt(result.emi)}</span></div>
          <div className="calc-result-card"><span className="calc-result-label">Total Interest</span><span className="calc-result-value">{fmt(result.totalInterest)}</span></div>
          <div className="calc-result-card"><span className="calc-result-label">Total Payment</span><span className="calc-result-value">{fmt(result.totalPayment)}</span></div>
        </div>
        <div className="calc-breakdown">
          <div className="calc-bar"><div className="calc-bar-principal" style={{ width: `${(principal / result.totalPayment) * 100}%` }} /><div className="calc-bar-interest" /></div>
          <div className="calc-bar-legend"><span><i style={{ background: 'var(--primary-500)' }} />Principal ({((principal / result.totalPayment) * 100).toFixed(1)}%)</span><span><i style={{ background: 'var(--warning)' }} />Interest ({((result.totalInterest / result.totalPayment) * 100).toFixed(1)}%)</span></div>
        </div>
      </div>
    </ToolPageWrapper>
  );
};
export default EmiCalculator;
