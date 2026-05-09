import React, { useState, useMemo } from 'react';
import ToolPageWrapper from '../../components/common/ToolPageWrapper';
import meta from './meta';
import '../emi-calculator/EmiCalculator.css';

const gstRates = [3, 5, 12, 18, 28];

const GstCalculator = () => {
  const [amount, setAmount] = useState(10000);
  const [rate, setRate] = useState(18);
  const [mode, setMode] = useState('exclusive');

  const result = useMemo(() => {
    if (mode === 'exclusive') {
      const gst = amount * (rate / 100);
      return { base: amount, gst, cgst: gst / 2, sgst: gst / 2, total: amount + gst };
    } else {
      const base = amount / (1 + rate / 100);
      const gst = amount - base;
      return { base, gst, cgst: gst / 2, sgst: gst / 2, total: amount };
    }
  }, [amount, rate, mode]);

  const fmt = (n) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 2 }).format(n);

  return (
    <ToolPageWrapper meta={meta}>
      <div className="calc-tool">
        <div className="calc-inputs">
          <div className="pms-mode-toggle" style={{ background: 'var(--neutral-100)', borderRadius: 'var(--radius-md)', padding: 4, display: 'flex', gap: 4 }}>
            <button className={`pms-mode-btn ${mode === 'exclusive' ? 'active' : ''}`} onClick={() => setMode('exclusive')}>GST Exclusive</button>
            <button className={`pms-mode-btn ${mode === 'inclusive' ? 'active' : ''}`} onClick={() => setMode('inclusive')}>GST Inclusive</button>
          </div>
          <div className="form-group"><label>{mode === 'exclusive' ? 'Amount (Before GST)' : 'Amount (Including GST)'}</label><input type="number" value={amount} onChange={e => setAmount(Number(e.target.value))} className="calc-input" /></div>
          <div className="form-group"><label>GST Rate</label>
            <div style={{ display: 'flex', gap: 8 }}>{gstRates.map(r => (
              <button key={r} onClick={() => setRate(r)} className={`btn ${rate === r ? 'btn-primary' : 'btn-secondary'} btn-sm`}>{r}%</button>
            ))}</div>
          </div>
        </div>
        <div className="calc-results" style={{ gridTemplateColumns: 'repeat(2,1fr)' }}>
          <div className="calc-result-card"><span className="calc-result-label">Base Amount</span><span className="calc-result-value">{fmt(result.base)}</span></div>
          <div className="calc-result-card calc-result-primary"><span className="calc-result-label">Total Amount</span><span className="calc-result-value">{fmt(result.total)}</span></div>
          <div className="calc-result-card"><span className="calc-result-label">CGST ({rate / 2}%)</span><span className="calc-result-value">{fmt(result.cgst)}</span></div>
          <div className="calc-result-card"><span className="calc-result-label">SGST ({rate / 2}%)</span><span className="calc-result-value">{fmt(result.sgst)}</span></div>
        </div>
      </div>
    </ToolPageWrapper>
  );
};
export default GstCalculator;
