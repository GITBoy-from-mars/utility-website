import React, { useState } from 'react';
import ToolPageWrapper from '../../components/common/ToolPageWrapper';
import { Icon } from '../../assets/icons/icons';
import meta from './meta';
import '../base64-encoder-decoder/Base64Tool.css';
const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=';
const RandomPasswordList = () => {
  const [count, setCount] = useState(20);
  const [length, setLength] = useState(16);
  const [list, setList] = useState([]);
  const generate = () => {
    const arr = new Uint32Array(count * length);
    crypto.getRandomValues(arr);
    const passwords = [];
    for (let i = 0; i < count; i++) {
      let pw = '';
      for (let j = 0; j < length; j++) pw += chars[arr[i * length + j] % chars.length];
      passwords.push(pw);
    }
    setList(passwords);
  };
  const download = () => { const b = new Blob([list.join('\n')], { type: 'text/plain' }); const a = document.createElement('a'); a.href = URL.createObjectURL(b); a.download = 'passwords.txt'; a.click(); };
  return (
    <ToolPageWrapper meta={meta}>
      <div className="devtool">
        <div style={{ display: 'flex', gap: 12 }}>
          <div className="form-group" style={{ flex: 1 }}><label>Count</label><input type="number" min="1" max="500" value={count} onChange={e => setCount(+e.target.value)} className="calc-input" /></div>
          <div className="form-group" style={{ flex: 1 }}><label>Length</label><input type="number" min="4" max="128" value={length} onChange={e => setLength(+e.target.value)} className="calc-input" /></div>
        </div>
        <div className="devtool-actions"><button onClick={generate} className="btn btn-primary"><Icon name="Zap" size={18} />Generate</button>{list.length > 0 && <button onClick={download} className="btn btn-secondary"><Icon name="Download" size={18} />Download</button>}{list.length > 0 && <button onClick={() => navigator.clipboard.writeText(list.join('\n'))} className="btn btn-ghost"><Icon name="File" size={18} />Copy</button>}</div>
        {list.length > 0 && <textarea className="devtool-textarea devtool-output" rows={Math.min(15, list.length + 1)} value={list.join('\n')} readOnly style={{ fontFamily: 'monospace' }} />}
      </div>
    </ToolPageWrapper>
  );
};
export default RandomPasswordList;
