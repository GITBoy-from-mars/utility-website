import React, { useState, useCallback } from 'react';
import ToolPageWrapper from '../../components/common/ToolPageWrapper';
import { Icon } from '../../assets/icons/icons';
import meta from './meta';
import '../base64-encoder-decoder/Base64Tool.css';
const PasswordGenerator = () => {
  const [length, setLength] = useState(16);
  const [upper, setUpper] = useState(true);
  const [lower, setLower] = useState(true);
  const [numbers, setNumbers] = useState(true);
  const [symbols, setSymbols] = useState(true);
  const [password, setPassword] = useState('');
  const [copied, setCopied] = useState(false);
  const generate = useCallback(() => {
    let chars = '';
    if (upper) chars += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (lower) chars += 'abcdefghijklmnopqrstuvwxyz';
    if (numbers) chars += '0123456789';
    if (symbols) chars += '!@#$%^&*()_+-=[]{}|;:,.<>?';
    if (!chars) { setPassword('Select at least one character type'); return; }
    const arr = new Uint32Array(length);
    crypto.getRandomValues(arr);
    setPassword(Array.from(arr, v => chars[v % chars.length]).join(''));
    setCopied(false);
  }, [length, upper, lower, numbers, symbols]);
  const copy = () => { navigator.clipboard.writeText(password); setCopied(true); setTimeout(() => setCopied(false), 2000); };
  const strength = () => {
    let s = 0;
    if (upper) s += 26; if (lower) s += 26; if (numbers) s += 10; if (symbols) s += 26;
    const entropy = length * Math.log2(s || 1);
    if (entropy >= 80) return { label: 'Very Strong', color: '#10B981' };
    if (entropy >= 60) return { label: 'Strong', color: '#3B82F6' };
    if (entropy >= 40) return { label: 'Medium', color: '#F59E0B' };
    return { label: 'Weak', color: '#EF4444' };
  };
  const st = strength();
  return (
    <ToolPageWrapper meta={meta}>
      <div className="devtool">
        <div className="calc-inputs" style={{ gap: 16 }}>
          <div className="form-group"><label>Length: {length}</label><input type="range" min="4" max="128" value={length} onChange={e => setLength(+e.target.value)} className="imgconv-range" /></div>
          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
            <label style={{ display: 'flex', gap: 6, alignItems: 'center', fontSize: '0.875rem', cursor: 'pointer' }}><input type="checkbox" checked={upper} onChange={e => setUpper(e.target.checked)} />Uppercase</label>
            <label style={{ display: 'flex', gap: 6, alignItems: 'center', fontSize: '0.875rem', cursor: 'pointer' }}><input type="checkbox" checked={lower} onChange={e => setLower(e.target.checked)} />Lowercase</label>
            <label style={{ display: 'flex', gap: 6, alignItems: 'center', fontSize: '0.875rem', cursor: 'pointer' }}><input type="checkbox" checked={numbers} onChange={e => setNumbers(e.target.checked)} />Numbers</label>
            <label style={{ display: 'flex', gap: 6, alignItems: 'center', fontSize: '0.875rem', cursor: 'pointer' }}><input type="checkbox" checked={symbols} onChange={e => setSymbols(e.target.checked)} />Symbols</label>
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}><span style={{ fontSize: '0.813rem', fontWeight: 600 }}>Strength:</span><span style={{ color: st.color, fontWeight: 700, fontSize: '0.875rem' }}>{st.label}</span></div>
        </div>
        <button onClick={generate} className="btn btn-primary btn-lg" style={{ width: '100%' }}>Generate Password</button>
        {password && (
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <input type="text" value={password} readOnly className="devtool-textarea" style={{ fontFamily: 'monospace', padding: '14px 16px', flex: 1 }} />
            <button onClick={copy} className="btn btn-secondary"><Icon name={copied ? 'Check' : 'File'} size={18} />{copied ? 'Copied' : 'Copy'}</button>
          </div>
        )}
      </div>
    </ToolPageWrapper>
  );
};
export default PasswordGenerator;
