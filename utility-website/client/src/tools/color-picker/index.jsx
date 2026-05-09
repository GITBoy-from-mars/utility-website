import React, { useState, useMemo } from 'react';
import ToolPageWrapper from '../../components/common/ToolPageWrapper';
import { Icon } from '../../assets/icons/icons';
import meta from './meta';
import '../base64-encoder-decoder/Base64Tool.css';
const hexToRgb = h => { const r = parseInt(h.slice(1, 3), 16), g = parseInt(h.slice(3, 5), 16), b = parseInt(h.slice(5, 7), 16); return { r, g, b }; };
const rgbToHsl = ({ r, g, b }) => { r /= 255; g /= 255; b /= 255; const max = Math.max(r, g, b), min = Math.min(r, g, b); let h, s, l = (max + min) / 2; if (max === min) { h = s = 0; } else { const d = max - min; s = l > 0.5 ? d / (2 - max - min) : d / (max + min); switch (max) { case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break; case g: h = ((b - r) / d + 2) / 6; break; default: h = ((r - g) / d + 4) / 6; } } return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) }; };
const ColorPicker = () => {
  const [hex, setHex] = useState('#3B82F6');
  const rgb = useMemo(() => hexToRgb(hex), [hex]);
  const hsl = useMemo(() => rgbToHsl(rgb), [rgb]);
  const copy = t => { navigator.clipboard.writeText(t); };
  return (
    <ToolPageWrapper meta={meta}>
      <div className="devtool">
        <div style={{ display: 'flex', gap: 20, alignItems: 'start', flexWrap: 'wrap' }}>
          <div style={{ width: 200, height: 200, borderRadius: 'var(--radius-lg)', background: hex, border: '2px solid var(--neutral-200)', flexShrink: 0 }} />
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div className="form-group"><label>Color Picker</label><input type="color" value={hex} onChange={e => setHex(e.target.value)} style={{ width: '100%', height: 48, cursor: 'pointer', border: '1.5px solid var(--neutral-200)', borderRadius: 'var(--radius-md)' }} /></div>
            <div className="form-group"><label>HEX</label><div style={{ display: 'flex', gap: 8 }}><input type="text" value={hex} onChange={e => { if (/^#[0-9A-Fa-f]{0,6}$/.test(e.target.value)) setHex(e.target.value); }} className="devtool-textarea" style={{ flex: 1, padding: '10px 14px', minHeight: 'auto' }} /><button onClick={() => copy(hex)} className="btn btn-ghost btn-sm"><Icon name="File" size={14} /></button></div></div>
            <div className="form-group"><label>RGB</label><div style={{ display: 'flex', gap: 8 }}><input type="text" value={`rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`} readOnly className="devtool-textarea devtool-output" style={{ flex: 1, padding: '10px 14px', minHeight: 'auto' }} /><button onClick={() => copy(`rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`)} className="btn btn-ghost btn-sm"><Icon name="File" size={14} /></button></div></div>
            <div className="form-group"><label>HSL</label><div style={{ display: 'flex', gap: 8 }}><input type="text" value={`hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`} readOnly className="devtool-textarea devtool-output" style={{ flex: 1, padding: '10px 14px', minHeight: 'auto' }} /><button onClick={() => copy(`hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`)} className="btn btn-ghost btn-sm"><Icon name="File" size={14} /></button></div></div>
          </div>
        </div>
      </div>
    </ToolPageWrapper>
  );
};
export default ColorPicker;
