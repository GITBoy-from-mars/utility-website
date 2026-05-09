import React, { useState } from 'react';
import ToolPageWrapper from '../../components/common/ToolPageWrapper';
import { Icon } from '../../assets/icons/icons';
import meta from './meta';
import '../base64-encoder-decoder/Base64Tool.css';
const JsonFormatter = () => {
  const [input, setInput] = useState('{"name":"John","age":30,"city":"New York","hobbies":["reading","coding"]}');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [indent, setIndent] = useState(2);
  const format = () => { try { setOutput(JSON.stringify(JSON.parse(input), null, indent)); setError(''); } catch (e) { setError(e.message); setOutput(''); } };
  const minify = () => { try { setOutput(JSON.stringify(JSON.parse(input))); setError(''); } catch (e) { setError(e.message); setOutput(''); } };
  const validate = () => { try { JSON.parse(input); setError(''); setOutput('✅ Valid JSON'); } catch (e) { setError('❌ ' + e.message); setOutput(''); } };
  return (
    <ToolPageWrapper meta={meta}>
      <div className="devtool">
        <div className="form-group"><label>Input JSON</label><textarea className="devtool-textarea" rows={10} value={input} onChange={e => setInput(e.target.value)} style={{ fontFamily: 'monospace', fontSize: '0.813rem' }} placeholder='{"key": "value"}' /></div>
        <div className="devtool-actions">
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}><label style={{ fontSize: '0.75rem' }}>Indent:</label><select value={indent} onChange={e => setIndent(+e.target.value)} style={{ padding: '4px 8px', border: '1px solid var(--neutral-200)', borderRadius: 4, fontSize: '0.75rem' }}><option value={2}>2 spaces</option><option value={4}>4 spaces</option><option value={1}>Tab</option></select></div>
          <button onClick={format} className="btn btn-primary btn-sm"><Icon name="Code" size={14} />Format</button>
          <button onClick={minify} className="btn btn-secondary btn-sm">Minify</button>
          <button onClick={validate} className="btn btn-ghost btn-sm">Validate</button>
          {output && <button onClick={() => navigator.clipboard.writeText(output)} className="btn btn-ghost btn-sm"><Icon name="File" size={14} />Copy</button>}
        </div>
        {error && <p style={{ color: '#EF4444', fontSize: '0.813rem', padding: '8px 12px', background: '#FEF2F2', borderRadius: 6 }}>{error}</p>}
        {output && <div className="form-group"><label>Output</label><textarea className="devtool-textarea devtool-output" rows={12} value={output} readOnly style={{ fontFamily: 'monospace', fontSize: '0.813rem' }} /></div>}
      </div>
    </ToolPageWrapper>
  );
};
export default JsonFormatter;
