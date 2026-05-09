import React, { useState, useMemo } from 'react';
import ToolPageWrapper from '../../components/common/ToolPageWrapper';
import meta from './meta';
import '../base64-encoder-decoder/Base64Tool.css';
const TextDiffChecker = () => {
  const [textA, setTextA] = useState('Hello World\nThis is line 2\nLine 3 here');
  const [textB, setTextB] = useState('Hello World\nThis is modified line 2\nLine 3 here\nNew line 4');
  const diff = useMemo(() => {
    const a = textA.split('\n'), b = textB.split('\n');
    const maxLen = Math.max(a.length, b.length);
    const lines = [];
    for (let i = 0; i < maxLen; i++) {
      const la = a[i] ?? null, lb = b[i] ?? null;
      if (la === lb) lines.push({ type: 'same', a: la, b: lb, num: i + 1 });
      else if (la === null) lines.push({ type: 'added', a: '', b: lb, num: i + 1 });
      else if (lb === null) lines.push({ type: 'removed', a: la, b: '', num: i + 1 });
      else lines.push({ type: 'changed', a: la, b: lb, num: i + 1 });
    }
    return lines;
  }, [textA, textB]);
  const changed = diff.filter(d => d.type !== 'same').length;
  return (
    <ToolPageWrapper meta={meta}>
      <div className="devtool">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <div className="form-group"><label>Original Text</label><textarea className="devtool-textarea" rows={8} value={textA} onChange={e => setTextA(e.target.value)} style={{ fontFamily: 'monospace', fontSize: '0.813rem' }} /></div>
          <div className="form-group"><label>Modified Text</label><textarea className="devtool-textarea" rows={8} value={textB} onChange={e => setTextB(e.target.value)} style={{ fontFamily: 'monospace', fontSize: '0.813rem' }} /></div>
        </div>
        <p style={{ fontSize: '0.813rem', color: 'var(--neutral-500)' }}>{changed} difference{changed !== 1 ? 's' : ''} found</p>
        <div style={{ borderRadius: 8, overflow: 'hidden', border: '1px solid var(--neutral-200)' }}>
          {diff.map((d, i) => (
            <div key={i} style={{ display: 'grid', gridTemplateColumns: '40px 1fr 1fr', fontSize: '0.75rem', fontFamily: 'monospace', background: d.type === 'same' ? 'transparent' : d.type === 'added' ? '#ECFDF5' : d.type === 'removed' ? '#FEF2F2' : '#FFFBEB', borderBottom: '1px solid var(--neutral-100)' }}>
              <span style={{ padding: '4px 8px', color: 'var(--neutral-400)', textAlign: 'right', borderRight: '1px solid var(--neutral-200)' }}>{d.num}</span>
              <span style={{ padding: '4px 8px', background: d.type === 'removed' || d.type === 'changed' ? 'rgba(239,68,68,0.08)' : 'transparent', color: d.type === 'removed' ? '#DC2626' : 'inherit' }}>{d.a}</span>
              <span style={{ padding: '4px 8px', borderLeft: '1px solid var(--neutral-200)', background: d.type === 'added' || d.type === 'changed' ? 'rgba(16,185,129,0.08)' : 'transparent', color: d.type === 'added' ? '#059669' : d.type === 'changed' ? '#D97706' : 'inherit' }}>{d.b}</span>
            </div>
          ))}
        </div>
      </div>
    </ToolPageWrapper>
  );
};
export default TextDiffChecker;
