import React, { useState, useMemo } from 'react';
import ToolPageWrapper from '../../components/common/ToolPageWrapper';
import { Icon } from '../../assets/icons/icons';
import meta from './meta';
import '../base64-encoder-decoder/Base64Tool.css';
const RegexTester = () => {
  const [pattern, setPattern] = useState('\\b\\w+@\\w+\\.\\w+\\b');
  const [flags, setFlags] = useState('gi');
  const [testStr, setTestStr] = useState('Contact us at info@example.com or support@test.org for help.');
  const [error, setError] = useState('');
  const matches = useMemo(() => {
    if (!pattern) return [];
    try {
      const re = new RegExp(pattern, flags);
      setError('');
      const results = [];
      let m;
      if (flags.includes('g')) {
        while ((m = re.exec(testStr)) !== null) {
          results.push({ match: m[0], index: m.index, groups: m.slice(1) });
          if (!m[0]) break; // prevent infinite loop on zero-length matches
        }
      } else {
        m = re.exec(testStr);
        if (m) results.push({ match: m[0], index: m.index, groups: m.slice(1) });
      }
      return results;
    } catch (e) { setError(e.message); return []; }
  }, [pattern, flags, testStr]);
  // Build highlighted string
  const highlighted = useMemo(() => {
    if (!matches.length) return testStr;
    let html = '';
    let lastIdx = 0;
    matches.forEach(m => {
      html += testStr.slice(lastIdx, m.index);
      html += `<mark style="background:#FDE68A;padding:1px 2px;border-radius:2px">${testStr.slice(m.index, m.index + m.match.length)}</mark>`;
      lastIdx = m.index + m.match.length;
    });
    html += testStr.slice(lastIdx);
    return html;
  }, [matches, testStr]);
  return (
    <ToolPageWrapper meta={meta}>
      <div className="devtool">
        <div style={{ display: 'flex', gap: 8 }}>
          <div className="form-group" style={{ flex: 1 }}><label>Pattern</label><input className="devtool-textarea" style={{ minHeight: 'auto', padding: '10px 14px', fontFamily: 'monospace' }} value={pattern} onChange={e => setPattern(e.target.value)} placeholder="\\d+" /></div>
          <div className="form-group" style={{ width: 80 }}><label>Flags</label><input className="devtool-textarea" style={{ minHeight: 'auto', padding: '10px 14px', fontFamily: 'monospace', textAlign: 'center' }} value={flags} onChange={e => setFlags(e.target.value)} placeholder="gi" /></div>
        </div>
        {error && <p style={{ color: '#EF4444', fontSize: '0.813rem' }}>{error}</p>}
        <div className="form-group"><label>Test String</label><textarea className="devtool-textarea" rows={4} value={testStr} onChange={e => setTestStr(e.target.value)} style={{ fontFamily: 'monospace', fontSize: '0.875rem' }} /></div>
        <div className="form-group"><label>Matches ({matches.length})</label><div style={{ padding: '12px 16px', background: 'var(--neutral-50)', borderRadius: 8, fontSize: '0.875rem', fontFamily: 'monospace', lineHeight: 1.8, wordBreak: 'break-word', border: '1px solid var(--neutral-200)' }} dangerouslySetInnerHTML={{ __html: highlighted }} /></div>
        {matches.length > 0 && <div style={{ fontSize: '0.75rem', display: 'flex', flexDirection: 'column', gap: 4 }}>
          {matches.map((m, i) => <div key={i} style={{ padding: '4px 8px', background: '#FFFBEB', borderRadius: 4, fontFamily: 'monospace' }}>Match {i + 1}: <strong>"{m.match}"</strong> at index {m.index}{m.groups.length > 0 && ` — Groups: ${m.groups.map((g, j) => `$${j + 1}="${g}"`).join(', ')}`}</div>)}
        </div>}
      </div>
    </ToolPageWrapper>
  );
};
export default RegexTester;
