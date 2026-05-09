import React, { useState } from 'react';
import ToolPageWrapper from '../../components/common/ToolPageWrapper';
import { Icon } from '../../assets/icons/icons';
import meta from './meta';
import '../base64-encoder-decoder/Base64Tool.css';
const MORSE = {'A':'.-','B':'-...','C':'-.-.','D':'-..','E':'.','F':'..-.','G':'--.','H':'....','I':'..','J':'.---','K':'-.-','L':'.-..','M':'--','N':'-.','O':'---','P':'.--.','Q':'--.-','R':'.-.','S':'...','T':'-','U':'..-','V':'...-','W':'.--','X':'-..-','Y':'-.--','Z':'--..','0':'-----','1':'.----','2':'..---','3':'...--','4':'....-','5':'.....','6':'-....','7':'--...','8':'---..','9':'----.','.':'.-.-.-',',':'--..--','?':'..--..','/':'-..-.','!':'-.-.--'};
const RMORSE = Object.fromEntries(Object.entries(MORSE).map(([k,v]) => [v, k]));
const textToMorse = t => t.toUpperCase().split('').map(c => c === ' ' ? '/' : MORSE[c] || '').filter(Boolean).join(' ');
const morseToText = m => m.split(' / ').map(w => w.split(' ').map(c => RMORSE[c] || '').join('')).join(' ');
const playMorse = (morse) => {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    let t = ctx.currentTime + 0.1;
    const unit = 0.08;
    morse.split('').forEach(c => {
      if (c === '.' || c === '-') {
        const osc = ctx.createOscillator(); const g = ctx.createGain();
        osc.frequency.value = 600; osc.type = 'sine';
        g.gain.setValueAtTime(0.2, t);
        osc.connect(g); g.connect(ctx.destination);
        const dur = c === '.' ? unit : unit * 3;
        osc.start(t); osc.stop(t + dur); t += dur + unit;
      } else if (c === ' ') { t += unit * 2; }
      else if (c === '/') { t += unit * 4; }
    });
    setTimeout(() => ctx.close(), (t - ctx.currentTime + 1) * 1000);
  } catch {}
};
const MorseCodeConverter = () => {
  const [mode, setMode] = useState('toMorse');
  const [input, setInput] = useState('HELLO WORLD');
  const output = mode === 'toMorse' ? textToMorse(input) : morseToText(input);
  return (
    <ToolPageWrapper meta={meta}>
      <div className="devtool">
        <div className="devtool-toggle"><button className={`pms-mode-btn ${mode === 'toMorse' ? 'active' : ''}`} onClick={() => { setMode('toMorse'); setInput('HELLO WORLD'); }}>Text → Morse</button><button className={`pms-mode-btn ${mode === 'fromMorse' ? 'active' : ''}`} onClick={() => { setMode('fromMorse'); setInput('.... . .-.. .-.. --- / .-- --- .-. .-.. -..'); }}>Morse → Text</button></div>
        <div className="form-group"><label>{mode === 'toMorse' ? 'Text' : 'Morse Code'}</label><textarea className="devtool-textarea" rows={3} value={input} onChange={e => setInput(e.target.value)} style={{ fontFamily: 'monospace' }} /></div>
        <div className="form-group"><label>Result</label><div style={{ display: 'flex', gap: 8 }}><textarea className="devtool-textarea devtool-output" rows={3} value={output} readOnly style={{ flex: 1, fontFamily: 'monospace', fontSize: mode === 'toMorse' ? '1.25rem' : '1rem', letterSpacing: mode === 'toMorse' ? '2px' : 'normal' }} /><div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}><button onClick={() => navigator.clipboard.writeText(output)} className="btn btn-ghost" title="Copy"><Icon name="File" size={18} /></button><button onClick={() => playMorse(mode === 'toMorse' ? output : textToMorse(output))} className="btn btn-ghost" title="Play audio">🔊</button></div></div></div>
        <div style={{ fontSize: '0.75rem', color: 'var(--neutral-400)', padding: '8px 12px', background: 'var(--neutral-50)', borderRadius: 6 }}>💡 Dot = short beep · Dash = long beep · Space = letter gap · Slash (/) = word gap</div>
      </div>
    </ToolPageWrapper>
  );
};
export default MorseCodeConverter;
