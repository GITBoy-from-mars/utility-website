import React, { useState, useMemo } from 'react';
import ToolPageWrapper from '../../components/common/ToolPageWrapper';
import meta from './meta';
import '../emi-calculator/EmiCalculator.css';

const ProfitMarginCalculator = () => {
  const [cost, setCost] = useState(500);
  const [revenue, setRevenue] = useState(800);

  const r = useMemo(() => {
    const profit = revenue - cost;
    const margin = revenue ? (profit / revenue) * 100 : 0;
    const markup = cost ? (profit / cost) * 100 : 0;
    return { profit, margin, markup };
  }, [cost, revenue]);

  const fmt = n => n.toLocaleString(undefined, { maximumFractionDigits: 2 });

  return (
    <ToolPageWrapper meta={meta}>
      <div className="calc-tool">
        <div className="calc-inputs">
          <div className="form-group"><label>Cost Price</label><input type="number" value={cost} onChange={e => setCost(+e.target.value)} className="calc-input" /></div>
          <div className="form-group"><label>Selling Price / Revenue</label><input type="number" value={revenue} onChange={e => setRevenue(+e.target.value)} className="calc-input" /></div>
        </div>
        <div className="calc-results" style={{ gridTemplateColumns: 'repeat(3,1fr)' }}>
          <div className="calc-result-card calc-result-primary"><span className="calc-result-label">Profit</span><span className="calc-result-value">₹{fmt(r.profit)}</span></div>
          <div className="calc-result-card"><span className="calc-result-label">Profit Margin</span><span className="calc-result-value">{fmt(r.margin)}%</span></div>
          <div className="calc-result-card"><span className="calc-result-label">Markup</span><span className="calc-result-value">{fmt(r.markup)}%</span></div>
        </div>
      </div>
    </ToolPageWrapper>
  );
};
export default ProfitMarginCalculator;
