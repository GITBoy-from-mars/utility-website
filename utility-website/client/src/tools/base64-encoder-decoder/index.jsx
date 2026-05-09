import React, { useState } from 'react';
import ToolPageWrapper from '../../components/common/ToolPageWrapper';
import { Icon } from '../../assets/icons/icons';
import meta from './meta';
import './Base64Tool.css';

const Base64Tool = () => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState('encode');
  const [error, setError] = useState('');

  const process = () => {
    setError('');
    try {
      if (mode === 'encode') { setOutput(btoa(unescape(encodeURIComponent(input)))); }
      else { setOutput(decodeURIComponent(escape(atob(input)))); }
    } catch (e) { setError('Invalid input for ' + mode + 'ing'); setOutput(''); }
  };

  const swap = () => { setMode(mode === 'encode' ? 'decode' : 'encode'); setInput(output); setOutput(''); setError(''); };

  return (
    <ToolPageWrapper meta={meta}>
      <div className="devtool">
        <div className="devtool-toggle">
          <button className={`pms-mode-btn ${mode === 'encode' ? 'active' : ''}`} onClick={() => { setMode('encode'); setOutput(''); }}>Encode</button>
          <button className={`pms-mode-btn ${mode === 'decode' ? 'active' : ''}`} onClick={() => { setMode('decode'); setOutput(''); }}>Decode</button>
        </div>
        <div className="form-group"><label>{mode === 'encode' ? 'Plain Text' : 'Base64 String'}</label>
          <textarea className="devtool-textarea" rows={6} value={input} onChange={e => setInput(e.target.value)} placeholder={mode === 'encode' ? 'Enter text to encode...' : 'Enter Base64 to decode...'} />
        </div>
        <div className="devtool-actions">
          <button onClick={process} disabled={!input} className="btn btn-primary"><Icon name="ArrowsExchange" size={18} />{mode === 'encode' ? 'Encode' : 'Decode'}</button>
          <button onClick={swap} disabled={!output} className="btn btn-secondary"><Icon name="ArrowsExchange" size={18} />Swap</button>
          <button onClick={() => navigator.clipboard.writeText(output)} disabled={!output} className="btn btn-ghost"><Icon name="File" size={18} />Copy</button>
        </div>
        {error && <p style={{ color: 'var(--error)', fontSize: '0.875rem' }}>{error}</p>}
        {output && (
          <div className="form-group"><label>Result</label>
            <textarea className="devtool-textarea devtool-output" rows={6} value={output} readOnly />
          </div>
        )}
      </div>
    </ToolPageWrapper>
  );
};
export default Base64Tool;
