import React, { useState } from 'react';
import ToolPageWrapper from '../../components/common/ToolPageWrapper';
import meta from './meta';
import '../name-spinner/NameSpinner.css';
const COLORS = ['#3B82F6','#EF4444','#10B981','#F59E0B','#8B5CF6','#EC4899','#0EA5E9','#F97316','#14B8A6','#6366F1','#DC2626','#059669'];
const WheelOfFortune = () => {
  const [input, setInput] = useState('Pizza 🍕\nSushi 🍣\nBurger 🍔\nTacos 🌮\nPasta 🍝\nSalad 🥗');
  const [winner, setWinner] = useState(null);
  const [spinning, setSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const items = input.split('\n').map(s => s.trim()).filter(Boolean);
  const spin = () => {
    if (items.length < 2 || spinning) return;
    setSpinning(true); setWinner(null);
    const extra = 1440 + Math.random() * 1440;
    const newRot = rotation + extra;
    setRotation(newRot);
    setTimeout(() => {
      const segAngle = 360 / items.length;
      const normalizedDeg = ((newRot % 360) + 360) % 360;
      const pointerAngle = ((270 - normalizedDeg) % 360 + 360) % 360;
      const idx = Math.floor(pointerAngle / segAngle) % items.length;
      setWinner(items[idx]);
      setSpinning(false);
    }, 4000);
  };
  const segAngle = items.length > 0 ? 360 / items.length : 360;
  return (
    <ToolPageWrapper meta={meta}>
      <div className="spinner-tool">
        <div className="spinner-layout">
          <div className="spinner-wheel-wrap">
            <div className="spinner-pointer">▼</div>
            <svg viewBox="0 0 300 300" className="spinner-svg" style={{ transform: `rotate(${rotation}deg)`, transition: spinning ? 'transform 4s cubic-bezier(0.17,0.67,0.12,0.99)' : 'none' }}>
              {items.map((item, i) => {
                const s = (i * segAngle * Math.PI) / 180, e = ((i + 1) * segAngle * Math.PI) / 180;
                const x1 = 150 + 140 * Math.cos(s), y1 = 150 + 140 * Math.sin(s);
                const x2 = 150 + 140 * Math.cos(e), y2 = 150 + 140 * Math.sin(e);
                const mid = (s + e) / 2;
                const tx = 150 + 80 * Math.cos(mid), ty = 150 + 80 * Math.sin(mid);
                return (<g key={i}><path d={`M150,150 L${x1},${y1} A140,140 0 ${segAngle > 180 ? 1 : 0},1 ${x2},${y2} Z`} fill={COLORS[i % COLORS.length]} stroke="#fff" strokeWidth="2" /><text x={tx} y={ty} textAnchor="middle" dominantBaseline="middle" fill="#fff" fontSize={items.length > 8 ? '7' : '9'} fontWeight="700" transform={`rotate(${(i + 0.5) * segAngle}, ${tx}, ${ty})`}>{item.slice(0, 12)}</text></g>);
              })}
              <circle cx="150" cy="150" r="18" fill="#fff" stroke="#e5e7eb" strokeWidth="2" />
            </svg>
          </div>
          <div className="spinner-controls">
            <div className="form-group"><label>Options (one per line)</label><textarea className="devtool-textarea" rows={6} value={input} onChange={e => setInput(e.target.value)} /></div>
            <p style={{ fontSize: '0.75rem', color: 'var(--neutral-400)' }}>{items.length} options</p>
            <button onClick={spin} disabled={spinning || items.length < 2} className="btn btn-primary btn-lg" style={{ width: '100%' }}>{spinning ? '🎰 Spinning...' : '🎰 Spin!'}</button>
            {winner && <div className="spinner-winner">🎯 Result: <strong>{winner}</strong></div>}
          </div>
        </div>
      </div>
    </ToolPageWrapper>
  );
};
export default WheelOfFortune;
