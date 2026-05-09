import React, { useState, useMemo } from 'react';
import ToolPageWrapper from '../../components/common/ToolPageWrapper';
import meta from './meta';
import '../emi-calculator/EmiCalculator.css';

const oldSlabs = [[250000,0],[500000,0.05],[1000000,0.2],[Infinity,0.3]];
const newSlabs = [[300000,0],[700000,0.05],[1000000,0.1],[1200000,0.15],[1500000,0.2],[Infinity,0.3]];

function calcTax(income, slabs) {
  let tax = 0, prev = 0;
  for (const [limit, rate] of slabs) {
    if (income <= prev) break;
    const taxable = Math.min(income, limit) - prev;
    tax += taxable * rate;
    prev = limit;
  }
  return tax;
}

const SalaryTaxCalculator = () => {
  const [salary, setSalary] = useState(1200000);
  const [ded80c, setDed80c] = useState(150000);
  const [stdDed, setStdDed] = useState(75000);

  const result = useMemo(() => {
    const oldTaxable = Math.max(0, salary - ded80c - stdDed);
    const newTaxable = Math.max(0, salary - stdDed);
    const oldTax = calcTax(oldTaxable, oldSlabs);
    const newTax = calcTax(newTaxable, newSlabs);
    const oldCess = oldTax * 0.04;
    const newCess = newTax * 0.04;
    return { oldTax: oldTax + oldCess, newTax: newTax + newCess, oldTaxable, newTaxable, better: (oldTax + oldCess) <= (newTax + newCess) ? 'Old' : 'New' };
  }, [salary, ded80c, stdDed]);

  const fmt = n => '₹' + Math.round(n).toLocaleString('en-IN');

  return (
    <ToolPageWrapper meta={meta}>
      <div className="calc-tool">
        <div className="calc-inputs">
          <div className="form-group"><label>Annual Salary (CTC)</label><input type="number" value={salary} onChange={e => setSalary(+e.target.value)} className="calc-input" /></div>
          <div className="form-group"><label>Section 80C Deductions (Old Regime)</label><input type="number" value={ded80c} onChange={e => setDed80c(+e.target.value)} className="calc-input" /></div>
          <div className="form-group"><label>Standard Deduction</label><input type="number" value={stdDed} onChange={e => setStdDed(+e.target.value)} className="calc-input" /></div>
        </div>
        <div className="calc-results" style={{ gridTemplateColumns: 'repeat(3,1fr)' }}>
          <div className="calc-result-card"><span className="calc-result-label">Old Regime Tax</span><span className="calc-result-value">{fmt(result.oldTax)}</span></div>
          <div className="calc-result-card"><span className="calc-result-label">New Regime Tax</span><span className="calc-result-value">{fmt(result.newTax)}</span></div>
          <div className="calc-result-card calc-result-primary"><span className="calc-result-label">Better Option</span><span className="calc-result-value">{result.better} Regime</span></div>
        </div>
        <div className="calc-results" style={{ gridTemplateColumns: '1fr 1fr' }}>
          <div className="calc-result-card"><span className="calc-result-label">Monthly Take-Home (Old)</span><span className="calc-result-value">{fmt((salary - result.oldTax) / 12)}</span></div>
          <div className="calc-result-card"><span className="calc-result-label">Monthly Take-Home (New)</span><span className="calc-result-value">{fmt((salary - result.newTax) / 12)}</span></div>
        </div>
      </div>
    </ToolPageWrapper>
  );
};
export default SalaryTaxCalculator;
