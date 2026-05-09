import React, { useState, useEffect } from 'react';
import ToolPageWrapper from '../../components/common/ToolPageWrapper';
import meta from './meta';
const ROWS = [
  ['Escape','F1','F2','F3','F4','F5','F6','F7','F8','F9','F10','F11','F12'],
  ['`','1','2','3','4','5','6','7','8','9','0','-','=','Backspace'],
  ['Tab','q','w','e','r','t','y','u','i','o','p','[',']','\\'],
  ['CapsLock','a','s','d','f','g','h','j','k','l',';',"'",'Enter'],
  ['Shift','z','x','c','v','b','n','m',',','.','/','Shift'],
  ['Control','Meta','Alt','Space','Alt','Control','ArrowLeft','ArrowUp','ArrowDown','ArrowRight'],
];
const LABELS = { Escape: 'Esc', Backspace: '⌫', Tab: '⇥', CapsLock: 'Caps', Enter: '⏎', Shift: '⇧', Control: 'Ctrl', Meta: '⊞', Alt: 'Alt', Space: '␣', ArrowLeft: '←', ArrowUp: '↑', ArrowDown: '↓', ArrowRight: '→' };
const KeyboardTester = () => {
  const [pressed, setPressed] = useState(new Set());
  const [lastKey, setLastKey] = useState(null);
  const [history, setHistory] = useState([]);
  useEffect(() => {
    const down = (e) => { e.preventDefault(); const k = e.key; setPressed(p => new Set(p).add(k)); setLastKey({ key: k, code: e.code, keyCode: e.keyCode }); setHistory(h => [k, ...h].slice(0, 20)); };
    const up = (e) => { setPressed(p => { const s = new Set(p); s.delete(e.key); return s; }); };
    window.addEventListener('keydown', down); window.addEventListener('keyup', up);
    return () => { window.removeEventListener('keydown', down); window.removeEventListener('keyup', up); };
  }, []);
  const isActive = (key) => pressed.has(key) || pressed.has(key.toLowerCase()) || pressed.has(key.toUpperCase());
  return (
    <ToolPageWrapper meta={meta}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16, alignItems: 'center' }}>
        <p style={{ fontSize: '0.875rem', color: 'var(--neutral-500)' }}>Press any key to test it. Active keys light up green.</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4, maxWidth: 800 }}>
          {ROWS.map((row, ri) => (
            <div key={ri} style={{ display: 'flex', gap: 4, justifyContent: 'center' }}>
              {row.map((key, ki) => {
                const active = isActive(key);
                const wide = ['Backspace','Tab','CapsLock','Enter','Shift','Control','Meta','Alt'].includes(key);
                const space = key === 'Space';
                return (
                  <div key={ki} style={{ minWidth: space ? 200 : wide ? 70 : 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 6, fontSize: '0.688rem', fontWeight: 700, border: `2px solid ${active ? '#10B981' : 'var(--neutral-300)'}`, background: active ? '#ECFDF5' : 'var(--neutral-50)', color: active ? '#059669' : 'var(--neutral-600)', transition: 'all 0.1s ease', cursor: 'default', userSelect: 'none' }}>
                    {LABELS[key] || key.toUpperCase()}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
        {lastKey && (
          <div style={{ display: 'flex', gap: 16, fontSize: '0.813rem', padding: '12px 20px', background: 'var(--neutral-50)', borderRadius: 8, border: '1px solid var(--neutral-200)' }}>
            <span><strong>Key:</strong> {lastKey.key}</span>
            <span><strong>Code:</strong> {lastKey.code}</span>
            <span><strong>KeyCode:</strong> {lastKey.keyCode}</span>
          </div>
        )}
      </div>
    </ToolPageWrapper>
  );
};
export default KeyboardTester;
