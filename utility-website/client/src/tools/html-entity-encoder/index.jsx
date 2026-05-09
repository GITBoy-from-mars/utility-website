import React, { useState } from 'react';
import ToolPageWrapper from '../../components/common/ToolPageWrapper';
import { Icon } from '../../assets/icons/icons';
import meta from './meta';
import '../base64-encoder-decoder/Base64Tool.css';
const encode = t => t.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');
const decode = t => { const el = document.createElement('textarea'); el.innerHTML = t; return el.value; };
const HtmlEntityEncoder = () => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState('encode');
  return (
    <ToolPageWrapper meta={meta}>
      <div className="devtool">
        <div className="devtool-toggle"><button className={`pms-mode-btn ${mode === 'encode' ? 'active' : ''}`} onClick={() => setMode('encode')}>Encode</button><button className={`pms-mode-btn ${mode === 'decode' ? 'active' : ''}`} onClick={() => setMode('decode')}>Decode</button></div>
        <div className="form-group"><label>Input</label><textarea className="devtool-textarea" rows={5} value={input} onChange={e => setInput(e.target.value)} placeholder={mode === 'encode' ? '<div class="test">' : '&lt;div&gt;'} /></div>
        <button onClick={() => setOutput(mode === 'encode' ? encode(input) : decode(input))} disabled={!input} className="btn btn-primary"><Icon name="ArrowsExchange" size={18} />{mode === 'encode' ? 'Encode' : 'Decode'}</button>
        {output && <div className="form-group"><label>Result</label><textarea className="devtool-textarea devtool-output" rows={5} value={output} readOnly /></div>}
      </div>
    </ToolPageWrapper>
  );
};
export default HtmlEntityEncoder;
