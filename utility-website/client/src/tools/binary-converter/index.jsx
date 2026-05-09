import React, { useState } from 'react';
import ToolPageWrapper from '../../components/common/ToolPageWrapper';
import { Icon } from '../../assets/icons/icons';
import meta from './meta';
import '../base64-encoder-decoder/Base64Tool.css';

const BinaryConverter = () => {
  const [dec, setDec] = useState('42');
  const [bin, setBin] = useState('101010');
  const [oct, setOct] = useState('52');
  const [hex, setHex] = useState('2a');
  const [copied, setCopied] = useState('');

  const updateAll = (val, base) => {
    try {
      const n = parseInt(val, base);
      if (isNaN(n) || n < 0) return;
      setDec(n.toString(10));
      setBin(n.toString(2));
      setOct(n.toString(8));
      setHex(n.toString(16).toUpperCase());
    } catch {}
  };

  const copy = (val, label) => {
    navigator.clipboard.writeText(val);
    setCopied(label);
    setTimeout(() => setCopied(''), 1500);
  };

  const clear = () => { setDec(''); setBin(''); setOct(''); setHex(''); };

  const fields = [
    { label: 'Decimal (Base 10)', value: dec, setter: setDec, base: 10, placeholder: 'e.g. 42' },
    { label: 'Binary (Base 2)', value: bin, setter: setBin, base: 2, placeholder: 'e.g. 101010' },
    { label: 'Octal (Base 8)', value: oct, setter: setOct, base: 8, placeholder: 'e.g. 52' },
    { label: 'Hexadecimal (Base 16)', value: hex, setter: setHex, base: 16, placeholder: 'e.g. 2A' },
  ];

  return (
    <ToolPageWrapper meta={meta}>
      <div className="devtool">
        <div className="devtool-actions" style={{ marginBottom: 16 }}>
          <button onClick={clear} className="btn btn-ghost btn-sm"><Icon name="X" size={14} />Clear All</button>
        </div>
        {fields.map(f => (
          <div key={f.label} className="form-group">
            <label>{f.label}</label>
            <div style={{ display: 'flex', gap: 8 }}>
              <input
                className="devtool-textarea"
                style={{ minHeight: 'auto', padding: '12px 16px', flex: 1, fontFamily: 'monospace', fontSize: '1rem', fontWeight: 600 }}
                value={f.value}
                onChange={e => { f.setter(e.target.value); updateAll(e.target.value, f.base); }}
                placeholder={f.placeholder}
              />
              <button
                onClick={() => copy(f.value, f.label)}
                className="btn btn-ghost"
                style={{ minWidth: 44 }}
                title="Copy"
              >
                {copied === f.label ? <Icon name="Check" size={18} /> : <Icon name="File" size={18} />}
              </button>
            </div>
          </div>
        ))}
        <p style={{ fontSize: '0.75rem', color: 'var(--neutral-400)', marginTop: 8 }}>
          💡 Type in any field — all others update instantly. Click the copy icon to copy a value.
        </p>
      </div>
    </ToolPageWrapper>
  );
};
export default BinaryConverter;
