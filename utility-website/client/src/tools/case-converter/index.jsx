import React, { useState } from 'react';
import ToolPageWrapper from '../../components/common/ToolPageWrapper';
import { Icon } from '../../assets/icons/icons';
import meta from './meta';
import '../base64-encoder-decoder/Base64Tool.css';
const toTitle = s => s.replace(/\w\S*/g, t => t.charAt(0).toUpperCase() + t.substr(1).toLowerCase());
const toSentence = s => s.replace(/(^\s*\w|[.!?]\s+\w)/g, c => c.toUpperCase());
const toAlternate = s => s.split('').map((c, i) => i % 2 === 0 ? c.toLowerCase() : c.toUpperCase()).join('');
const toInverse = s => s.split('').map(c => c === c.toUpperCase() ? c.toLowerCase() : c.toUpperCase()).join('');
const CaseConverter = () => {
  const [text, setText] = useState('');
  const [result, setResult] = useState('');
  const apply = (fn) => setResult(fn(text));
  const copy = () => navigator.clipboard.writeText(result);
  return (
    <ToolPageWrapper meta={meta}>
      <div className="devtool">
        <div className="form-group"><label>Input Text</label><textarea className="devtool-textarea" rows={5} value={text} onChange={e => setText(e.target.value)} placeholder="Paste your text here..." /></div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          <button onClick={() => apply(s => s.toUpperCase())} className="btn btn-secondary btn-sm">UPPER CASE</button>
          <button onClick={() => apply(s => s.toLowerCase())} className="btn btn-secondary btn-sm">lower case</button>
          <button onClick={() => apply(toTitle)} className="btn btn-secondary btn-sm">Title Case</button>
          <button onClick={() => apply(toSentence)} className="btn btn-secondary btn-sm">Sentence case</button>
          <button onClick={() => apply(toAlternate)} className="btn btn-secondary btn-sm">aLtErNaTe</button>
          <button onClick={() => apply(toInverse)} className="btn btn-secondary btn-sm">InVeRsE</button>
        </div>
        {result && <div className="form-group"><label>Result</label><div style={{ display: 'flex', gap: 8 }}><textarea className="devtool-textarea devtool-output" rows={5} value={result} readOnly style={{ flex: 1 }} /><button onClick={copy} className="btn btn-ghost"><Icon name="File" size={18} /></button></div></div>}
      </div>
    </ToolPageWrapper>
  );
};
export default CaseConverter;
