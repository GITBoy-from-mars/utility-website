import React, { useState, useMemo } from 'react';
import ToolPageWrapper from '../../components/common/ToolPageWrapper';
import meta from './meta';
import '../emi-calculator/EmiCalculator.css';
import '../loan-amortization/LoanAmortization.css';
const CompoundInterestCalc = () => {
  const [principal, setPrincipal] = useState(100000);
  const [rate, setRate] = useState(8);
  const [years, setYears] = useState(10);
  const [compounding, setCompounding] = useState(12);
  const result = useMemo(() => {
    const r = rate / 100;
    const n = compounding;
    const amount = principal * Math.pow(1 + r / n, n * years);
    const interest = amount - principal;
    const breakdown = [];
    for (let y = 1; y <= years; y++) {
      const amt = principal * Math.pow(1 + r / n, n * y);
      breakdown.push({ year: y, amount: amt, interest: amt - principal });
    }
    return { amount, interest, breakdown };
  }, [principal, rate, years, compounding]);
  const fmt = n => '₹' + n.toLocaleString('en-IN', { maximumFractionDigits: 0 });
  return (
    <ToolPageWrapper meta={meta}>
      <div className="calc-tool">
        <div className="calc-inputs">
          <div className="form-group"><label>Principal Amount (₹)</label><input type="number" value={principal} onChange={e => setPrincipal(+e.target.value)} className="calc-input" /></div>
          <div className="form-group"><label>Annual Interest Rate (%)</label><input type="number" value={rate} onChange={e => setRate(+e.target.value)} className="calc-input" step="0.1" /></div>
          <div className="form-group"><label>Time Period (Years)</label><input type="number" value={years} onChange={e => setYears(+e.target.value)} className="calc-input" /></div>
          <div className="form-group"><label>Compounding Frequency</label><select value={compounding} onChange={e => setCompounding(+e.target.value)} className="calc-input"><option value={1}>Annually</option><option value={2}>Semi-Annually</option><option value={4}>Quarterly</option><option value={12}>Monthly</option><option value={365}>Daily</option></select></div>
        </div>
        <div className="calc-results" style={{ gridTemplateColumns: 'repeat(3,1fr)' }}>
          <div className="calc-result-card calc-result-primary"><span className="calc-result-label">Total Amount</span><span className="calc-result-value">{fmt(result.amount)}</span></div>
          <div className="calc-result-card"><span className="calc-result-label">Total Interest</span><span className="calc-result-value" style={{ color: '#10B981' }}>{fmt(result.interest)}</span></div>
          <div className="calc-result-card"><span className="calc-result-label">Growth</span><span className="calc-result-value" style={{ color: '#10B981' }}>{((result.amount / principal - 1) * 100).toFixed(1)}%</span></div>
        </div>
        <div className="amort-table-wrap"><table className="amort-table"><thead><tr><th>Year</th><th>Total Value</th><th>Interest Earned</th></tr></thead>
          <tbody>{result.breakdown.map(r => <tr key={r.year}><td>{r.year}</td><td>{fmt(r.amount)}</td><td style={{ color: '#10B981' }}>{fmt(r.interest)}</td></tr>)}</tbody>
        </table></div>
      </div>
    </ToolPageWrapper>
  );
};
export default CompoundInterestCalc;
