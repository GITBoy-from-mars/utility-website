import React, { useState } from 'react';
import ToolPageWrapper from '../../components/common/ToolPageWrapper';
import { Icon } from '../../assets/icons/icons';
import meta from './meta';
import '../base64-encoder-decoder/Base64Tool.css';
const gen = () => crypto.randomUUID();
const UuidGenerator = () => {
  const [count, setCount] = useState(5);
  const [uuids, setUuids] = useState([]);
  const [format, setFormat] = useState('lowercase');
  const generate = () => {
    const list = Array.from({ length: count }, () => {
      const id = gen();
      if (format === 'uppercase') return id.toUpperCase();
      if (format === 'no-hyphens') return id.replace(/-/g, '');
      return id;
    });
    setUuids(list);
  };
  const copyAll = () => navigator.clipboard.writeText(uuids.join('\n'));
  return (
    <ToolPageWrapper meta={meta}>
      <div className="devtool">
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'end' }}>
          <div className="form-group" style={{ flex: 1 }}><label>Count</label><input type="number" min="1" max="1000" value={count} onChange={e => setCount(Math.min(1000, +e.target.value))} className="calc-input" /></div>
          <div className="form-group" style={{ flex: 1 }}><label>Format</label><select value={format} onChange={e => setFormat(e.target.value)} className="qr-select"><option value="lowercase">lowercase</option><option value="uppercase">UPPERCASE</option><option value="no-hyphens">No Hyphens</option></select></div>
        </div>
        <div className="devtool-actions"><button onClick={generate} className="btn btn-primary"><Icon name="Zap" size={18} />Generate</button><button onClick={copyAll} disabled={!uuids.length} className="btn btn-ghost"><Icon name="File" size={18} />Copy All</button></div>
        {uuids.length > 0 && <textarea className="devtool-textarea devtool-output" rows={Math.min(15, uuids.length + 1)} value={uuids.join('\n')} readOnly />}
      </div>
    </ToolPageWrapper>
  );
};
export default UuidGenerator;
