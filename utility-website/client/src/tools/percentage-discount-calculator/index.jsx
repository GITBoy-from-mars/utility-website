import React, { useState } from 'react';
import ToolPageWrapper from '../../components/common/ToolPageWrapper';
import meta from './meta';
import '../emi-calculator/EmiCalculator.css';

const PercentageCalculator = () => {
  const [mode, setMode] = useState('discount');
  const [price, setPrice] = useState(1000);
  const [percent, setPercent] = useState(20);
  const [valA, setValA] = useState(50);
  const [valB, setValB] = useState(200);

  const fmt = (n) => new Intl.NumberFormat('en-IN', { maximumFractionDigits: 2 }).format(n);

  return (
    <ToolPageWrapper meta={meta}>
      <div className="calc-tool">
        <div className="pms-mode-toggle" style={{ background: 'var(--neutral-100)', borderRadius: 'var(--radius-md)', padding: 4, display: 'flex', gap: 4, flexWrap: 'wrap' }}>
          <button className={`pms-mode-btn ${mode === 'discount' ? 'active' : ''}`} onClick={() => setMode('discount')}>Discount</button>
          <button className={`pms-mode-btn ${mode === 'whatpercent' ? 'active' : ''}`} onClick={() => setMode('whatpercent')}>What %?</button>
          <button className={`pms-mode-btn ${mode === 'percentof' ? 'active' : ''}`} onClick={() => setMode('percentof')}>% of Value</button>
          <button className={`pms-mode-btn ${mode === 'change' ? 'active' : ''}`} onClick={() => setMode('change')}>% Change</button>
        </div>
        <div className="calc-inputs">
          {mode === 'discount' && (<>
            <div className="form-group"><label>Original Price</label><input type="number" value={price} onChange={e => setPrice(Number(e.target.value))} className="calc-input" /></div>
            <div className="form-group"><label>Discount %</label><input type="number" value={percent} onChange={e => setPercent(Number(e.target.value))} className="calc-input" /></div>
          </>)}
          {mode === 'whatpercent' && (<>
            <div className="form-group"><label>Value</label><input type="number" value={valA} onChange={e => setValA(Number(e.target.value))} className="calc-input" /></div>
            <div className="form-group"><label>Total</label><input type="number" value={valB} onChange={e => setValB(Number(e.target.value))} className="calc-input" /></div>
          </>)}
          {mode === 'percentof' && (<>
            <div className="form-group"><label>Percentage</label><input type="number" value={percent} onChange={e => setPercent(Number(e.target.value))} className="calc-input" /></div>
            <div className="form-group"><label>Of Value</label><input type="number" value={price} onChange={e => setPrice(Number(e.target.value))} className="calc-input" /></div>
          </>)}
          {mode === 'change' && (<>
            <div className="form-group"><label>Old Value</label><input type="number" value={valA} onChange={e => setValA(Number(e.target.value))} className="calc-input" /></div>
            <div className="form-group"><label>New Value</label><input type="number" value={valB} onChange={e => setValB(Number(e.target.value))} className="calc-input" /></div>
          </>)}
        </div>
        <div className="calc-results" style={{ gridTemplateColumns: mode === 'discount' ? 'repeat(3,1fr)' : 'repeat(2,1fr)' }}>
          {mode === 'discount' && (<>
            <div className="calc-result-card"><span className="calc-result-label">Discount</span><span className="calc-result-value">{fmt(price * percent / 100)}</span></div>
            <div className="calc-result-card calc-result-primary"><span className="calc-result-label">Final Price</span><span className="calc-result-value">{fmt(price - price * percent / 100)}</span></div>
            <div className="calc-result-card"><span className="calc-result-label">You Save</span><span className="calc-result-value">{percent}%</span></div>
          </>)}
          {mode === 'whatpercent' && (<>
            <div className="calc-result-card calc-result-primary"><span className="calc-result-label">Result</span><span className="calc-result-value">{fmt(valB ? (valA / valB) * 100 : 0)}%</span></div>
            <div className="calc-result-card"><span className="calc-result-label">Fraction</span><span className="calc-result-value">{valA} / {valB}</span></div>
          </>)}
          {mode === 'percentof' && (<>
            <div className="calc-result-card calc-result-primary"><span className="calc-result-label">Result</span><span className="calc-result-value">{fmt(price * percent / 100)}</span></div>
            <div className="calc-result-card"><span className="calc-result-label">Formula</span><span className="calc-result-value">{percent}% of {fmt(price)}</span></div>
          </>)}
          {mode === 'change' && (<>
            <div className="calc-result-card calc-result-primary"><span className="calc-result-label">% Change</span><span className="calc-result-value">{valA ? fmt(((valB - valA) / valA) * 100) : 0}%</span></div>
            <div className="calc-result-card"><span className="calc-result-label">Difference</span><span className="calc-result-value">{fmt(valB - valA)}</span></div>
          </>)}
        </div>
      </div>
    </ToolPageWrapper>
  );
};
export default PercentageCalculator;
