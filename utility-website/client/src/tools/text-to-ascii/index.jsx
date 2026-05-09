import React, { useState } from 'react';
import ToolPageWrapper from '../../components/common/ToolPageWrapper';
import { Icon } from '../../assets/icons/icons';
import meta from './meta';
import '../base64-encoder-decoder/Base64Tool.css';
const TextToAscii = () => {
  const [input, setInput] = useState('');
  const [mode, setMode] = useState('toAscii');
  const output = mode === 'toAscii' ? input.split('').map(c => c.charCodeAt(0)).join(' ') : input.split(/\s+/).filter(Boolean).map(n => String.fromCharCode(+n)).join('');
  return (
    <ToolPageWrapper meta={meta}>
      <div className="devtool">
        <div className="devtool-toggle"><button className={`pms-mode-btn ${mode === 'toAscii' ? 'active' : ''}`} onClick={() => { setMode('toAscii'); setInput(''); }}>Text → ASCII</button><button className={`pms-mode-btn ${mode === 'toText' ? 'active' : ''}`} onClick={() => { setMode('toText'); setInput(''); }}>ASCII → Text</button></div>
        <div className="form-group"><label>{mode === 'toAscii' ? 'Text' : 'ASCII Codes (space-separated)'}</label><textarea className="devtool-textarea" rows={4} value={input} onChange={e => setInput(e.target.value)} placeholder={mode === 'toAscii' ? 'Hello World' : '72 101 108 108 111'} /></div>
        <div className="form-group"><label>Result</label><div style={{ display: 'flex', gap: 8 }}><textarea className="devtool-textarea devtool-output" rows={4} value={output} readOnly style={{ flex: 1 }} /><button onClick={() => navigator.clipboard.writeText(output)} className="btn btn-ghost"><Icon name="File" size={18} /></button></div></div>
      </div>
    </ToolPageWrapper>
  );
};
export default TextToAscii;
