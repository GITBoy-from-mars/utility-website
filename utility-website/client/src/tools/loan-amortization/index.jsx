import React, { useState, useMemo } from 'react';
import ToolPageWrapper from '../../components/common/ToolPageWrapper';
import meta from './meta';
import '../emi-calculator/EmiCalculator.css';
import './LoanAmortization.css';
const LoanAmortization = () => {
  const [principal, setPrincipal] = useState(500000);
  const [rate, setRate] = useState(9);
  const [years, setYears] = useState(5);
  const schedule = useMemo(() => {
    const n = years * 12, r = rate / 100 / 12;
    if (r === 0) return [];
    const emi = principal * r * Math.pow(1 + r, n) / (Math.pow(1 + r, n) - 1);
    let balance = principal;
    const rows = [];
    for (let i = 1; i <= n; i++) {
      const interest = balance * r;
      const principalPaid = emi - interest;
      balance -= principalPaid;
      rows.push({ month: i, emi, interest, principalPaid, balance: Math.max(0, balance) });
    }
    return rows;
  }, [principal, rate, years]);
  const fmt = n => '₹' + Math.round(n).toLocaleString('en-IN');
  const emi = schedule[0]?.emi || 0;
  return (
    <ToolPageWrapper meta={meta}>
      <div className="calc-tool">
        <div className="calc-inputs">
          <div className="form-group"><label>Loan Amount</label><input type="number" value={principal} onChange={e => setPrincipal(+e.target.value)} className="calc-input" /></div>
          <div className="form-group"><label>Interest Rate (% p.a.)</label><input type="number" step="0.1" value={rate} onChange={e => setRate(+e.target.value)} className="calc-input" /></div>
          <div className="form-group"><label>Tenure (Years)</label><input type="number" value={years} onChange={e => setYears(+e.target.value)} className="calc-input" /></div>
        </div>
        <div className="calc-results"><div className="calc-result-card calc-result-primary"><span className="calc-result-label">Monthly EMI</span><span className="calc-result-value">{fmt(emi)}</span></div></div>
        {schedule.length > 0 && (
          <div className="amort-table-wrap"><table className="amort-table">
            <thead><tr><th>#</th><th>EMI</th><th>Interest</th><th>Principal</th><th>Balance</th></tr></thead>
            <tbody>{schedule.map(r => <tr key={r.month}><td>{r.month}</td><td>{fmt(r.emi)}</td><td>{fmt(r.interest)}</td><td>{fmt(r.principalPaid)}</td><td>{fmt(r.balance)}</td></tr>)}</tbody>
          </table></div>
        )}
      </div>
    </ToolPageWrapper>
  );
};
export default LoanAmortization;
