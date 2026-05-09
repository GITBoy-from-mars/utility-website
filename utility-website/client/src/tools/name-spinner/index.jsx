import React, { useState, useRef } from 'react';
import ToolPageWrapper from '../../components/common/ToolPageWrapper';
import meta from './meta';
import './NameSpinner.css';

const COLORS = ['#3B82F6','#EF4444','#10B981','#F59E0B','#8B5CF6','#EC4899','#0EA5E9','#F97316','#14B8A6','#6366F1'];

const NameSpinner = () => {
  const [input, setInput] = useState('Alice\nBob\nCharlie\nDiana\nEve');
  const [winner, setWinner] = useState(null);
  const [spinning, setSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const names = input.split('\n').map(s => s.trim()).filter(Boolean);

  const spin = () => {
    if (names.length < 2 || spinning) return;
    setSpinning(true);
    setWinner(null);

    const extra = 1440 + Math.random() * 1440;
    const newRot = rotation + extra;
    setRotation(newRot);

    setTimeout(() => {
      const segAngle = 360 / names.length;
      // The pointer is at the TOP (12 o'clock = 270° in standard math coords,
      // but SVG rotates clockwise from 3 o'clock).
      // The wheel rotated newRot degrees clockwise.
      // We need to find which segment is at the top after rotation.
      const normalizedDeg = ((newRot % 360) + 360) % 360;
      // Segments are drawn starting from 0° (3 o'clock, going clockwise).
      // Pointer is at top = 270° in the original coordinate.
      // After rotating the wheel by normalizedDeg clockwise,
      // the segment at the pointer is at angle (270 - normalizedDeg) in original coords.
      const pointerAngle = ((270 - normalizedDeg) % 360 + 360) % 360;
      const idx = Math.floor(pointerAngle / segAngle) % names.length;
      setWinner(names[idx]);
      setSpinning(false);
    }, 4000);
  };

  const segAngle = names.length > 0 ? 360 / names.length : 360;

  return (
    <ToolPageWrapper meta={meta}>
      <div className="spinner-tool">
        <div className="spinner-layout">
          <div className="spinner-wheel-wrap">
            <div className="spinner-pointer">▼</div>
            <svg viewBox="0 0 300 300" className="spinner-svg" style={{ transform: `rotate(${rotation}deg)`, transition: spinning ? 'transform 4s cubic-bezier(0.17,0.67,0.12,0.99)' : 'none' }}>
              {names.map((name, i) => {
                const startAngle = (i * segAngle * Math.PI) / 180;
                const endAngle = ((i + 1) * segAngle * Math.PI) / 180;
                const x1 = 150 + 140 * Math.cos(startAngle);
                const y1 = 150 + 140 * Math.sin(startAngle);
                const x2 = 150 + 140 * Math.cos(endAngle);
                const y2 = 150 + 140 * Math.sin(endAngle);
                const large = segAngle > 180 ? 1 : 0;
                const midAngle = (startAngle + endAngle) / 2;
                const tx = 150 + 80 * Math.cos(midAngle);
                const ty = 150 + 80 * Math.sin(midAngle);
                const rotDeg = (i + 0.5) * segAngle;
                return (
                  <g key={i}>
                    <path d={`M150,150 L${x1},${y1} A140,140 0 ${large},1 ${x2},${y2} Z`} fill={COLORS[i % COLORS.length]} stroke="#fff" strokeWidth="2" />
                    <text x={tx} y={ty} textAnchor="middle" dominantBaseline="middle" fill="#fff" fontSize={names.length > 8 ? '8' : '10'} fontWeight="700" transform={`rotate(${rotDeg}, ${tx}, ${ty})`}>{name.slice(0, 12)}</text>
                  </g>
                );
              })}
              <circle cx="150" cy="150" r="20" fill="#fff" stroke="#e5e7eb" strokeWidth="2" />
              <text x="150" y="150" textAnchor="middle" dominantBaseline="middle" fontSize="10" fontWeight="800" fill="#333">GO</text>
            </svg>
          </div>
          <div className="spinner-controls">
            <div className="form-group">
              <label>Names (one per line)</label>
              <textarea className="devtool-textarea" rows={6} value={input} onChange={e => setInput(e.target.value)} />
            </div>
            <p style={{ fontSize: '0.75rem', color: 'var(--neutral-400)' }}>{names.length} participants</p>
            <button onClick={spin} disabled={spinning || names.length < 2} className="btn btn-primary btn-lg" style={{ width: '100%' }}>
              {spinning ? '🎡 Spinning...' : '🎡 Spin the Wheel!'}
            </button>
            {winner && <div className="spinner-winner">🎉 Winner: <strong>{winner}</strong></div>}
          </div>
        </div>
      </div>
    </ToolPageWrapper>
  );
};
export default NameSpinner;
