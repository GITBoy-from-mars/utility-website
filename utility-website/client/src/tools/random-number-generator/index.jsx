import React, { useState } from 'react';
import ToolPageWrapper from '../../components/common/ToolPageWrapper';
import { Icon } from '../../assets/icons/icons';
import meta from './meta';
import '../base64-encoder-decoder/Base64Tool.css';
const RandomNumberGenerator = () => {
  const [mode, setMode] = useState('number');
  const [min, setMin] = useState(1);
  const [max, setMax] = useState(100);
  const [count, setCount] = useState(5);
  const [strLen, setStrLen] = useState(10);
  const [results, setResults] = useState([]);
  const generate = () => {
    if (mode === 'number') {
      setResults(Array.from({ length: count }, () => Math.floor(Math.random() * (max - min + 1)) + min));
    } else {
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      setResults(Array.from({ length: count }, () => Array.from({ length: strLen }, () => chars[Math.floor(Math.random() * chars.length)]).join('')));
    }
  };
  return (
    <ToolPageWrapper meta={meta}>
      <div className="devtool">
        <div className="devtool-toggle"><button className={`pms-mode-btn ${mode === 'number' ? 'active' : ''}`} onClick={() => setMode('number')}>Numbers</button><button className={`pms-mode-btn ${mode === 'string' ? 'active' : ''}`} onClick={() => setMode('string')}>Strings</button></div>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          {mode === 'number' && <><div className="form-group" style={{ flex: 1 }}><label>Min</label><input type="number" value={min} onChange={e => setMin(+e.target.value)} className="calc-input" /></div><div className="form-group" style={{ flex: 1 }}><label>Max</label><input type="number" value={max} onChange={e => setMax(+e.target.value)} className="calc-input" /></div></>}
          {mode === 'string' && <div className="form-group" style={{ flex: 1 }}><label>String Length</label><input type="number" value={strLen} onChange={e => setStrLen(+e.target.value)} className="calc-input" /></div>}
          <div className="form-group" style={{ flex: 1 }}><label>Count</label><input type="number" min="1" max="1000" value={count} onChange={e => setCount(+e.target.value)} className="calc-input" /></div>
        </div>
        <div className="devtool-actions"><button onClick={generate} className="btn btn-primary"><Icon name="Zap" size={18} />Generate</button><button onClick={() => navigator.clipboard.writeText(results.join('\n'))} disabled={!results.length} className="btn btn-ghost"><Icon name="File" size={18} />Copy</button></div>
        {results.length > 0 && <textarea className="devtool-textarea devtool-output" rows={Math.min(10, results.length + 1)} value={results.join('\n')} readOnly />}
      </div>
    </ToolPageWrapper>
  );
};
export default RandomNumberGenerator;
