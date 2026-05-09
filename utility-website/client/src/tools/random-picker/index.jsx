import React, { useState } from 'react';
import ToolPageWrapper from '../../components/common/ToolPageWrapper';
import meta from './meta';
import '../base64-encoder-decoder/Base64Tool.css';
const RandomPicker = () => {
  const [input, setInput] = useState('Pizza\nBurger\nSushi\nPasta\nTacos');
  const [count, setCount] = useState(1);
  const [result, setResult] = useState([]);
  const [animate, setAnimate] = useState(false);
  const pick = () => {
    const items = input.split('\n').map(s => s.trim()).filter(Boolean);
    if (!items.length) return;
    setAnimate(true);
    setTimeout(() => {
      const shuffled = [...items].sort(() => Math.random() - 0.5);
      setResult(shuffled.slice(0, Math.min(count, items.length)));
      setAnimate(false);
    }, 500);
  };
  return (
    <ToolPageWrapper meta={meta}>
      <div className="devtool">
        <div className="form-group"><label>Items (one per line)</label><textarea className="devtool-textarea" rows={6} value={input} onChange={e => setInput(e.target.value)} /></div>
        <div style={{ display: 'flex', gap: 12, alignItems: 'end' }}>
          <div className="form-group" style={{ flex: 1 }}><label>Pick count</label><input type="number" min="1" max="50" value={count} onChange={e => setCount(+e.target.value)} className="calc-input" /></div>
          <button onClick={pick} className="btn btn-primary btn-lg" disabled={animate}>{animate ? 'Picking...' : '🎯 Pick Random'}</button>
        </div>
        {result.length > 0 && <div style={{ padding: 24, background: 'var(--primary-50)', borderRadius: 'var(--radius-lg)', textAlign: 'center' }}><p style={{ fontSize: '0.75rem', color: 'var(--neutral-500)', marginBottom: 8 }}>Selected:</p>{result.map((r, i) => <div key={i} style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--primary-600)' }}>{r}</div>)}</div>}
      </div>
    </ToolPageWrapper>
  );
};
export default RandomPicker;
