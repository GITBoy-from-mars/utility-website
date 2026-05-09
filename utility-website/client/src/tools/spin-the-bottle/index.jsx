import React, { useState } from 'react';
import ToolPageWrapper from '../../components/common/ToolPageWrapper';
import meta from './meta';
const SpinTheBottle = () => {
  const [players, setPlayers] = useState('Alice\nBob\nCharlie\nDiana\nEve\nFrank');
  const [rotation, setRotation] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [selected, setSelected] = useState(null);
  const names = players.split('\n').map(s => s.trim()).filter(Boolean);
  const spin = () => {
    if (names.length < 2 || spinning) return;
    setSpinning(true); setSelected(null);
    const extra = 720 + Math.random() * 1080;
    const newRot = rotation + extra;
    setRotation(newRot);
    setTimeout(() => {
      const idx = Math.floor(Math.random() * names.length);
      setSelected(names[idx]);
      setSpinning(false);
    }, 3000);
  };
  return (
    <ToolPageWrapper meta={meta}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24, padding: '20px' }}>
        <div style={{ position: 'relative', width: 280, height: 280 }}>
          {/* Player circle */}
          {names.map((name, i) => {
            const angle = (i / names.length) * 2 * Math.PI - Math.PI / 2;
            const x = 140 + 120 * Math.cos(angle);
            const y = 140 + 120 * Math.sin(angle);
            return (<div key={i} style={{ position: 'absolute', left: x - 24, top: y - 16, background: selected === name ? '#10B981' : '#3B82F6', color: '#fff', padding: '6px 12px', borderRadius: 20, fontSize: '0.75rem', fontWeight: 700, whiteSpace: 'nowrap', transform: selected === name ? 'scale(1.2)' : 'scale(1)', transition: 'all 0.3s ease', boxShadow: selected === name ? '0 0 20px rgba(16,185,129,0.5)' : 'none' }}>{name}</div>);
          })}
          {/* Bottle */}
          <div style={{ position: 'absolute', left: '50%', top: '50%', transform: `translate(-50%, -50%) rotate(${rotation}deg)`, transition: spinning ? 'transform 3s cubic-bezier(0.17,0.67,0.12,0.99)' : 'none', fontSize: '3rem', cursor: 'pointer' }} onClick={spin}>🍾</div>
        </div>
        {selected && <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#10B981', animation: 'fadeSlideIn 0.3s ease' }}>🎯 {selected}!</div>}
        <button onClick={spin} disabled={spinning || names.length < 2} className="btn btn-primary btn-lg" style={{ minWidth: 200 }}>{spinning ? '🍾 Spinning...' : '🍾 Spin the Bottle!'}</button>
        <div className="form-group" style={{ width: '100%', maxWidth: 400 }}><label>Players (one per line)</label><textarea className="devtool-textarea" rows={4} value={players} onChange={e => setPlayers(e.target.value)} /></div>
        <style>{`@keyframes fadeSlideIn{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}`}</style>
      </div>
    </ToolPageWrapper>
  );
};
export default SpinTheBottle;
