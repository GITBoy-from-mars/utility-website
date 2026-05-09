import React, { useState, useMemo } from 'react';
import ToolPageWrapper from '../../components/common/ToolPageWrapper';
import meta from './meta';
import '../emi-calculator/EmiCalculator.css';
const BreakEvenCalculator = () => {
  const [fixed, setFixed] = useState(100000);
  const [varCost, setVarCost] = useState(200);
  const [price, setPrice] = useState(500);
  const r = useMemo(() => {
    const contribution = price - varCost;
    const units = contribution > 0 ? Math.ceil(fixed / contribution) : Infinity;
    const revenue = units * price;
    const margin = price > 0 ? ((contribution / price) * 100) : 0;
    return { units, revenue, contribution, margin };
  }, [fixed, varCost, price]);
  const fmt = n => n === Infinity ? '∞' : n.toLocaleString(undefined, { maximumFractionDigits: 0 });
  return (
    <ToolPageWrapper meta={meta}>
      <div className="calc-tool">
        <div className="calc-inputs">
          <div className="form-group"><label>Total Fixed Costs</label><input type="number" value={fixed} onChange={e => setFixed(+e.target.value)} className="calc-input" /></div>
          <div className="form-group"><label>Variable Cost Per Unit</label><input type="number" value={varCost} onChange={e => setVarCost(+e.target.value)} className="calc-input" /></div>
          <div className="form-group"><label>Selling Price Per Unit</label><input type="number" value={price} onChange={e => setPrice(+e.target.value)} className="calc-input" /></div>
        </div>
        <div className="calc-results" style={{ gridTemplateColumns: 'repeat(2,1fr)' }}>
          <div className="calc-result-card calc-result-primary"><span className="calc-result-label">Break-Even Units</span><span className="calc-result-value">{fmt(r.units)}</span></div>
          <div className="calc-result-card"><span className="calc-result-label">Break-Even Revenue</span><span className="calc-result-value">₹{fmt(r.revenue)}</span></div>
          <div className="calc-result-card"><span className="calc-result-label">Contribution/Unit</span><span className="calc-result-value">₹{fmt(r.contribution)}</span></div>
          <div className="calc-result-card"><span className="calc-result-label">Contribution Margin</span><span className="calc-result-value">{r.margin.toFixed(1)}%</span></div>
        </div>
      </div>
    </ToolPageWrapper>
  );
};
export default BreakEvenCalculator;
