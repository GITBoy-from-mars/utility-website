import React, { useRef, useState, useEffect } from 'react';
import ToolPageWrapper from '../../components/common/ToolPageWrapper';
import { Icon } from '../../assets/icons/icons';
import meta from './meta';

const COLORS = ['#1a1a2e','#EF4444','#3B82F6','#10B981','#F59E0B','#8B5CF6','#EC4899','#0EA5E9'];
const SIZES = [2, 4, 8, 14];

const OnlineWhiteboard = () => {
  const canvasRef = useRef(null);
  const [drawing, setDrawing] = useState(false);
  const [color, setColor] = useState('#1a1a2e');
  const [lineWidth, setLineWidth] = useState(4);
  const [eraser, setEraser] = useState(false);
  const [history, setHistory] = useState([]);
  const lastPos = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }, []);

  const getPos = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    return { x: clientX - rect.left, y: clientY - rect.top };
  };

  const startDraw = (e) => {
    e.preventDefault();
    setDrawing(true);
    lastPos.current = getPos(e);
    // Save state for undo
    const canvas = canvasRef.current;
    setHistory(h => [...h, canvas.toDataURL()]);
  };

  const draw = (e) => {
    if (!drawing) return;
    e.preventDefault();
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const pos = getPos(e);
    ctx.beginPath();
    ctx.moveTo(lastPos.current.x, lastPos.current.y);
    ctx.lineTo(pos.x, pos.y);
    ctx.strokeStyle = eraser ? '#ffffff' : color;
    ctx.lineWidth = eraser ? lineWidth * 4 : lineWidth;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.stroke();
    lastPos.current = pos;
  };

  const endDraw = () => setDrawing(false);

  const clear = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    setHistory(h => [...h, canvas.toDataURL()]);
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  };

  const undo = () => {
    if (history.length === 0) return;
    const prev = history[history.length - 1];
    setHistory(h => h.slice(0, -1));
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const img = new Image();
    img.onload = () => { ctx.clearRect(0, 0, canvas.width, canvas.height); ctx.drawImage(img, 0, 0); };
    img.src = prev;
  };

  const download = () => {
    const a = document.createElement('a');
    a.href = canvasRef.current.toDataURL('image/png');
    a.download = 'whiteboard.png';
    a.click();
  };

  return (
    <ToolPageWrapper meta={meta}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {/* Toolbar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap', padding: '10px 16px', background: 'var(--neutral-50)', borderRadius: 10, border: '1px solid var(--neutral-200)' }}>
          <div style={{ display: 'flex', gap: 4 }}>
            {COLORS.map(c => (
              <button key={c} onClick={() => { setColor(c); setEraser(false); }}
                style={{ width: 24, height: 24, borderRadius: '50%', background: c, border: color === c && !eraser ? '3px solid var(--neutral-800)' : '2px solid var(--neutral-200)', cursor: 'pointer', padding: 0 }} />
            ))}
          </div>
          <div style={{ width: 1, height: 24, background: 'var(--neutral-200)' }} />
          <div style={{ display: 'flex', gap: 4 }}>
            {SIZES.map(s => (
              <button key={s} onClick={() => setLineWidth(s)}
                style={{ width: 28, height: 28, borderRadius: 6, border: lineWidth === s ? '2px solid var(--primary-500)' : '1px solid var(--neutral-200)', background: lineWidth === s ? 'var(--primary-50)' : '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ width: s + 2, height: s + 2, borderRadius: '50%', background: '#333' }} />
              </button>
            ))}
          </div>
          <div style={{ width: 1, height: 24, background: 'var(--neutral-200)' }} />
          <button onClick={() => setEraser(!eraser)} className={`btn btn-sm ${eraser ? 'btn-primary' : 'btn-ghost'}`}>Eraser</button>
          <button onClick={undo} className="btn btn-ghost btn-sm" disabled={history.length === 0}>Undo</button>
          <button onClick={clear} className="btn btn-ghost btn-sm">Clear</button>
          <button onClick={download} className="btn btn-ghost btn-sm"><Icon name="Download" size={14} />Save PNG</button>
        </div>

        {/* Canvas */}
        <canvas ref={canvasRef}
          onMouseDown={startDraw} onMouseMove={draw} onMouseUp={endDraw} onMouseLeave={endDraw}
          onTouchStart={startDraw} onTouchMove={draw} onTouchEnd={endDraw}
          style={{ width: '100%', height: 500, border: '1px solid var(--neutral-200)', borderRadius: 12, cursor: eraser ? 'crosshair' : 'default', touchAction: 'none', background: '#fff' }} />
      </div>
    </ToolPageWrapper>
  );
};
export default OnlineWhiteboard;
