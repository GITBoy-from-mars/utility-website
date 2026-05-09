import React, { useState } from 'react';
import ToolPageWrapper from '../../components/common/ToolPageWrapper';
import { Icon } from '../../assets/icons/icons';
import meta from './meta';
import '../base64-encoder-decoder/Base64Tool.css';
const UuidBulkGenerator = () => {
  const [count, setCount] = useState(100);
  const [format, setFormat] = useState('lowercase');
  const [prefix, setPrefix] = useState('');
  const [list, setList] = useState([]);
  const generate = () => {
    const uuids = Array.from({ length: Math.min(count, 5000) }, () => {
      let id = crypto.randomUUID();
      if (format === 'uppercase') id = id.toUpperCase();
      else if (format === 'no-hyphens') id = id.replace(/-/g, '');
      return prefix ? `${prefix}${id}` : id;
    });
    setList(uuids);
  };
  const download = () => { const b = new Blob([list.join('\n')], { type: 'text/plain' }); const a = document.createElement('a'); a.href = URL.createObjectURL(b); a.download = 'uuids.txt'; a.click(); };
  return (
    <ToolPageWrapper meta={meta}>
      <div className="devtool">
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <div className="form-group" style={{ flex: 1 }}><label>Count (max 5000)</label><input type="number" min="1" max="5000" value={count} onChange={e => setCount(+e.target.value)} className="calc-input" /></div>
          <div className="form-group" style={{ flex: 1 }}><label>Format</label><select value={format} onChange={e => setFormat(e.target.value)} className="qr-select"><option value="lowercase">lowercase</option><option value="uppercase">UPPERCASE</option><option value="no-hyphens">No hyphens</option></select></div>
          <div className="form-group" style={{ flex: 1 }}><label>Prefix (optional)</label><input value={prefix} onChange={e => setPrefix(e.target.value)} className="calc-input" placeholder="e.g., user_" /></div>
        </div>
        <div className="devtool-actions"><button onClick={generate} className="btn btn-primary"><Icon name="Zap" size={18} />Generate {count}</button>{list.length > 0 && <button onClick={download} className="btn btn-secondary"><Icon name="Download" size={18} />Download</button>}{list.length > 0 && <button onClick={() => navigator.clipboard.writeText(list.join('\n'))} className="btn btn-ghost"><Icon name="File" size={18} />Copy</button>}</div>
        {list.length > 0 && <><p style={{ fontSize: '0.813rem', color: 'var(--neutral-500)' }}>{list.length} UUIDs generated</p><textarea className="devtool-textarea devtool-output" rows={12} value={list.join('\n')} readOnly style={{ fontFamily: 'monospace' }} /></>}
      </div>
    </ToolPageWrapper>
  );
};
export default UuidBulkGenerator;
