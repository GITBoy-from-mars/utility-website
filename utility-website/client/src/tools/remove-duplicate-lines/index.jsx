import React, { useState } from 'react';
import ToolPageWrapper from '../../components/common/ToolPageWrapper';
import { Icon } from '../../assets/icons/icons';
import meta from './meta';
import '../base64-encoder-decoder/Base64Tool.css';
const RemoveDuplicateLines = () => {
  const [text, setText] = useState('');
  const [caseSensitive, setCaseSensitive] = useState(true);
  const [trimLines, setTrimLines] = useState(true);
  const lines = text.split('\n');
  const process = () => {
    const seen = new Set();
    return lines.filter(line => {
      const l = trimLines ? line.trim() : line;
      const key = caseSensitive ? l : l.toLowerCase();
      if (key === '' || seen.has(key)) return false;
      seen.add(key);
      return true;
    }).join('\n');
  };
  const result = text ? process() : '';
  const removed = lines.length - result.split('\n').filter(Boolean).length;
  return (
    <ToolPageWrapper meta={meta}>
      <div className="devtool">
        <div className="form-group"><label>Input Text (one item per line)</label><textarea className="devtool-textarea" rows={8} value={text} onChange={e => setText(e.target.value)} placeholder="Line 1\nLine 2\nLine 1\nLine 3" /></div>
        <div style={{ display: 'flex', gap: 16, fontSize: '0.813rem' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: 4 }}><input type="checkbox" checked={caseSensitive} onChange={e => setCaseSensitive(e.target.checked)} /> Case sensitive</label>
          <label style={{ display: 'flex', alignItems: 'center', gap: 4 }}><input type="checkbox" checked={trimLines} onChange={e => setTrimLines(e.target.checked)} /> Trim whitespace</label>
        </div>
        {text && <p style={{ fontSize: '0.75rem', color: 'var(--neutral-400)' }}>{removed} duplicate{removed !== 1 ? 's' : ''} removed</p>}
        {result && <div className="form-group"><label>Result</label><div style={{ display: 'flex', gap: 8 }}><textarea className="devtool-textarea devtool-output" rows={8} value={result} readOnly style={{ flex: 1 }} /><button onClick={() => navigator.clipboard.writeText(result)} className="btn btn-ghost"><Icon name="File" size={18} /></button></div></div>}
      </div>
    </ToolPageWrapper>
  );
};
export default RemoveDuplicateLines;
