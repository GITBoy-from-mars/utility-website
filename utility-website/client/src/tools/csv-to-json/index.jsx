import React, { useState, useMemo } from 'react';
import ToolPageWrapper from '../../components/common/ToolPageWrapper';
import { Icon } from '../../assets/icons/icons';
import meta from './meta';
import '../base64-encoder-decoder/Base64Tool.css';
const CsvToJson = () => {
  const [csv, setCsv] = useState('name,age,city\nAlice,30,NYC\nBob,25,London\nCharlie,35,Tokyo');
  const [delimiter, setDelimiter] = useState(',');
  const [hasHeader, setHasHeader] = useState(true);
  const json = useMemo(() => {
    try {
      const rows = csv.trim().split('\n').map(r => r.split(delimiter));
      if (rows.length === 0) return '';
      if (hasHeader) {
        const headers = rows[0].map(h => h.trim());
        const data = rows.slice(1).map(r => {
          const obj = {};
          headers.forEach((h, i) => { obj[h] = r[i]?.trim() ?? ''; });
          return obj;
        });
        return JSON.stringify(data, null, 2);
      }
      return JSON.stringify(rows, null, 2);
    } catch { return ''; }
  }, [csv, delimiter, hasHeader]);
  return (
    <ToolPageWrapper meta={meta}>
      <div className="devtool">
        <div style={{ display: 'flex', gap: 12, alignItems: 'end' }}>
          <div className="form-group" style={{ width: 100 }}><label>Delimiter</label><select value={delimiter} onChange={e => setDelimiter(e.target.value)} className="qr-select"><option value=",">,  (comma)</option><option value="	">Tab</option><option value=";">; (semicolon)</option><option value="|">| (pipe)</option></select></div>
          <label style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.813rem', paddingBottom: 8 }}><input type="checkbox" checked={hasHeader} onChange={e => setHasHeader(e.target.checked)} /> First row is header</label>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <div className="form-group"><label>CSV Input</label><textarea className="devtool-textarea" rows={12} value={csv} onChange={e => setCsv(e.target.value)} style={{ fontFamily: 'monospace', fontSize: '0.813rem' }} /></div>
          <div className="form-group"><label>JSON Output</label><div style={{ position: 'relative' }}><textarea className="devtool-textarea devtool-output" rows={12} value={json} readOnly style={{ fontFamily: 'monospace', fontSize: '0.813rem' }} /><button onClick={() => navigator.clipboard.writeText(json)} className="btn btn-ghost btn-sm" style={{ position: 'absolute', top: 8, right: 8 }}><Icon name="File" size={14} /></button></div></div>
        </div>
      </div>
    </ToolPageWrapper>
  );
};
export default CsvToJson;
