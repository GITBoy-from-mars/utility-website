import React, { useState } from 'react';
import ToolPageWrapper from '../../components/common/ToolPageWrapper';
import { Icon } from '../../assets/icons/icons';
import meta from './meta';
const mapStr = (s, upper, lower, digits) => s.split('').map(c => {
  const code = c.charCodeAt(0);
  if (code >= 65 && code <= 90 && upper) return String.fromCodePoint(upper + code - 65);
  if (code >= 97 && code <= 122 && lower) return String.fromCodePoint(lower + code - 97);
  if (code >= 48 && code <= 57 && digits) return String.fromCodePoint(digits + code - 48);
  return c;
}).join('');
const STYLES = [
  { name: '𝗕𝗼𝗹𝗱', fn: s => mapStr(s, 0x1D5D4, 0x1D5EE, 0x1D7EC) },
  { name: '𝘐𝘵𝘢𝘭𝘪𝘤', fn: s => mapStr(s, 0x1D608, 0x1D622, null) },
  { name: '𝘽𝙤𝙡𝙙 𝙄𝙩𝙖𝙡𝙞𝙘', fn: s => mapStr(s, 0x1D63C, 0x1D656, null) },
  { name: '𝙼𝚘𝚗𝚘𝚜𝚙𝚊𝚌𝚎', fn: s => mapStr(s, 0x1D670, 0x1D68A, 0x1D7F6) },
  { name: '𝒮𝒸𝓇𝒾𝓅𝓉', fn: s => mapStr(s, 0x1D49C, 0x1D4B6, null) },
  { name: '𝓑𝓸𝓵𝓭 𝓢𝓬𝓻𝓲𝓹𝓽', fn: s => mapStr(s, 0x1D4D0, 0x1D4EA, null) },
  { name: '𝔉𝔯𝔞𝔨𝔱𝔲𝔯', fn: s => mapStr(s, 0x1D504, 0x1D51E, null) },
  { name: 'Ⓒⓘⓡⓒⓛⓔⓓ', fn: s => mapStr(s, 0x24B6, 0x24D0, 0x2460) },
  { name: 'Sᴍᴀʟʟ Cᴀᴘs', fn: s => { const SC = 'ᴀʙᴄᴅᴇꜰɢʜɪᴊᴋʟᴍɴᴏᴘǫʀꜱᴛᴜᴠᴡxʏᴢ'; return s.split('').map(c => { const i = c.charCodeAt(0); return i >= 97 && i <= 122 ? SC[i - 97] : c; }).join(''); }},
  { name: 'U̲n̲d̲e̲r̲l̲i̲n̲e̲', fn: s => s.split('').map(c => c + '\u0332').join('') },
  { name: 'S̶t̶r̶i̶k̶e̶', fn: s => s.split('').map(c => c + '\u0336').join('') },
  { name: '🅱🅻🅾🅲🅺', fn: s => s.toUpperCase().split('').map(c => { const code = c.charCodeAt(0); return code >= 65 && code <= 90 ? String.fromCodePoint(0x1F170 + code - 65) : c; }).join('') },
];
const FancyFontGenerator = () => {
  const [text, setText] = useState('Hello World');
  const [copied, setCopied] = useState(-1);
  const copy = (val, i) => { navigator.clipboard.writeText(val); setCopied(i); setTimeout(() => setCopied(-1), 1500); };
  return (
    <ToolPageWrapper meta={meta}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div className="form-group"><label>Enter your text</label><input type="text" value={text} onChange={e => setText(e.target.value)} className="calc-input" placeholder="Type something..." style={{ fontSize: '1.125rem' }} /></div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {STYLES.map((style, i) => {
            const result = style.fn(text);
            return (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', background: 'var(--neutral-50)', borderRadius: 8, border: '1px solid var(--neutral-200)' }}>
                <span style={{ fontSize: '0.688rem', fontWeight: 700, color: 'var(--neutral-400)', width: 100, flexShrink: 0 }}>{style.name}</span>
                <span style={{ flex: 1, fontSize: '1rem', wordBreak: 'break-all' }}>{result}</span>
                <button onClick={() => copy(result, i)} className="btn btn-ghost btn-sm" style={{ flexShrink: 0 }}>
                  {copied === i ? <Icon name="Check" size={14} /> : <Icon name="File" size={14} />}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </ToolPageWrapper>
  );
};
export default FancyFontGenerator;
