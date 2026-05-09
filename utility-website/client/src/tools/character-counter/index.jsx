import React, { useState } from 'react';
import ToolPageWrapper from '../../components/common/ToolPageWrapper';
import meta from './meta';
import '../emi-calculator/EmiCalculator.css';
const CharacterCounter = () => {
  const [text, setText] = useState('');
  const [limit, setLimit] = useState(280);
  const total = text.length;
  const letters = (text.match(/[a-zA-Z]/g) || []).length;
  const digits = (text.match(/\d/g) || []).length;
  const spaces = (text.match(/\s/g) || []).length;
  const special = total - letters - digits - spaces;
  const pct = limit > 0 ? Math.min(100, (total / limit) * 100) : 0;
  return (
    <ToolPageWrapper meta={meta}>
      <div className="calc-tool">
        <div className="form-group">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <label>Your Text</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.75rem' }}>
              <span style={{ color: 'var(--neutral-400)' }}>Limit:</span>
              <input type="number" value={limit} onChange={e => setLimit(+e.target.value)} style={{ width: 60, padding: '2px 6px', border: '1px solid var(--neutral-200)', borderRadius: 4, fontSize: '0.75rem' }} />
            </div>
          </div>
          <textarea className="devtool-textarea" rows={6} value={text} onChange={e => setText(e.target.value)} placeholder="Type or paste text..." style={{ fontSize: '1rem' }} />
          {limit > 0 && <div style={{ height: 4, borderRadius: 2, background: 'var(--neutral-200)', marginTop: 8 }}><div style={{ height: '100%', borderRadius: 2, width: `${pct}%`, background: pct > 90 ? '#EF4444' : pct > 70 ? '#F59E0B' : '#10B981', transition: 'width 0.2s' }} /></div>}
          {limit > 0 && <p style={{ fontSize: '0.75rem', color: total > limit ? '#EF4444' : 'var(--neutral-400)', marginTop: 4 }}>{total}/{limit} characters</p>}
        </div>
        <div className="calc-results" style={{ gridTemplateColumns: 'repeat(5,1fr)' }}>
          <div className="calc-result-card calc-result-primary"><span className="calc-result-label">Total</span><span className="calc-result-value">{total}</span></div>
          <div className="calc-result-card"><span className="calc-result-label">Letters</span><span className="calc-result-value">{letters}</span></div>
          <div className="calc-result-card"><span className="calc-result-label">Digits</span><span className="calc-result-value">{digits}</span></div>
          <div className="calc-result-card"><span className="calc-result-label">Spaces</span><span className="calc-result-value">{spaces}</span></div>
          <div className="calc-result-card"><span className="calc-result-label">Special</span><span className="calc-result-value">{special}</span></div>
        </div>
      </div>
    </ToolPageWrapper>
  );
};
export default CharacterCounter;
