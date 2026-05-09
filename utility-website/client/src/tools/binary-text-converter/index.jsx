import React, { useState } from 'react';
import ToolPageWrapper from '../../components/common/ToolPageWrapper';
import { Icon } from '../../assets/icons/icons';
import meta from './meta';
import '../base64-encoder-decoder/Base64Tool.css';
const textToBin = t => t.split('').map(c => c.charCodeAt(0).toString(2).padStart(8, '0')).join(' ');
const binToText = b => b.trim().split(/\s+/).map(c => String.fromCharCode(parseInt(c, 2))).join('');
const BinaryTextConverter = () => {
  const [input, setInput] = useState('');
  const [mode, setMode] = useState('toBinary');
  const output = mode === 'toBinary' ? textToBin(input) : binToText(input);
  return (
    <ToolPageWrapper meta={meta}>
      <div className="devtool">
        <div className="devtool-toggle"><button className={`pms-mode-btn ${mode === 'toBinary' ? 'active' : ''}`} onClick={() => { setMode('toBinary'); setInput(''); }}>Text → Binary</button><button className={`pms-mode-btn ${mode === 'toText' ? 'active' : ''}`} onClick={() => { setMode('toText'); setInput(''); }}>Binary → Text</button></div>
        <div className="form-group"><label>{mode === 'toBinary' ? 'Text' : 'Binary (space-separated bytes)'}</label><textarea className="devtool-textarea" rows={4} value={input} onChange={e => setInput(e.target.value)} placeholder={mode === 'toBinary' ? 'Hello' : '01001000 01100101 01101100 01101100 01101111'} /></div>
        <div className="form-group"><label>Result</label><div style={{ display: 'flex', gap: 8 }}><textarea className="devtool-textarea devtool-output" rows={4} value={output} readOnly style={{ flex: 1, fontFamily: 'monospace' }} /><button onClick={() => navigator.clipboard.writeText(output)} className="btn btn-ghost"><Icon name="File" size={18} /></button></div></div>
      </div>
    </ToolPageWrapper>
  );
};
export default BinaryTextConverter;
