import React, { useState, useMemo } from 'react';
import ToolPageWrapper from '../../components/common/ToolPageWrapper';
import meta from './meta';
import '../emi-calculator/EmiCalculator.css';
const FuelCostCalculator = () => {
  const [distance, setDistance] = useState(500);
  const [mileage, setMileage] = useState(15);
  const [price, setPrice] = useState(105);
  const r = useMemo(() => {
    const litres = mileage > 0 ? distance / mileage : 0;
    const cost = litres * price;
    return { litres, cost };
  }, [distance, mileage, price]);
  return (
    <ToolPageWrapper meta={meta}>
      <div className="calc-tool">
        <div className="calc-inputs">
          <div className="form-group"><label>Distance (km)</label><input type="number" value={distance} onChange={e => setDistance(+e.target.value)} className="calc-input" /></div>
          <div className="form-group"><label>Mileage (km/l)</label><input type="number" step="0.1" value={mileage} onChange={e => setMileage(+e.target.value)} className="calc-input" /></div>
          <div className="form-group"><label>Fuel Price (₹/l)</label><input type="number" step="0.01" value={price} onChange={e => setPrice(+e.target.value)} className="calc-input" /></div>
        </div>
        <div className="calc-results">
          <div className="calc-result-card"><span className="calc-result-label">Fuel Needed</span><span className="calc-result-value">{r.litres.toFixed(2)} L</span></div>
          <div className="calc-result-card calc-result-primary"><span className="calc-result-label">Total Cost</span><span className="calc-result-value">₹{Math.round(r.cost).toLocaleString('en-IN')}</span></div>
          <div className="calc-result-card"><span className="calc-result-label">Cost/km</span><span className="calc-result-value">₹{(r.cost / (distance || 1)).toFixed(2)}</span></div>
        </div>
      </div>
    </ToolPageWrapper>
  );
};
export default FuelCostCalculator;
