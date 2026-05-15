import React, { useRef, useState, useEffect, useCallback } from 'react';
import ToolPageWrapper from '../../components/common/ToolPageWrapper';
import { Icon } from '../../assets/icons/icons';
import meta from './meta';

const COLORS = ['#1a1a2e','#E03131','#2F9E44','#1971C2','#F08C00','#7048E8','#E64980','#0C8599'];
const SIZES = [1, 2, 4, 8];
const TOOLS = ['select','pen','line','arrow','rect','ellipse','diamond','text','eraser'];
const TOOL_LABELS = { select:'Select', pen:'Pen', line:'Line', arrow:'Arrow', rect:'Rectangle', ellipse:'Ellipse', diamond:'Diamond', text:'Text', eraser:'Eraser' };
const FILL_MODES = ['none','solid','hatch'];

const uid = () => Math.random().toString(36).slice(2,8);

const OnlineWhiteboard = () => {
  const canvasRef = useRef(null);
  const [tool, setTool] = useState('pen');
  const [color, setColor] = useState('#1a1a2e');
  const [lineWidth, setLineWidth] = useState(2);
  const [fillMode, setFillMode] = useState('none');
  const [elements, setElements] = useState([]);
  const [history, setHistory] = useState([]);
  const [drawing, setDrawing] = useState(false);
  const [currentEl, setCurrentEl] = useState(null);
  const [selectedId, setSelectedId] = useState(null);
  const [dragOffset, setDragOffset] = useState(null);
  const [textInput, setTextInput] = useState(null);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const lastPos = useRef(null);

  const getPos = useCallback((e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    return { x: (clientX - rect.left - pan.x) / zoom, y: (clientY - rect.top - pan.y) / zoom };
  }, [zoom, pan]);

  const redraw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // Background
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    // Grid dots
    ctx.fillStyle = '#E5E5E5';
    const step = 20;
    for (let x = (pan.x % (step * zoom)); x < canvas.width; x += step * zoom) {
      for (let y = (pan.y % (step * zoom)); y < canvas.height; y += step * zoom) {
        ctx.beginPath(); ctx.arc(x, y, 0.8, 0, Math.PI * 2); ctx.fill();
      }
    }
    ctx.restore();
    ctx.save();
    ctx.translate(pan.x, pan.y);
    ctx.scale(zoom, zoom);

    const allEls = currentEl ? [...elements, currentEl] : elements;
    allEls.forEach(el => drawElement(ctx, el, el.id === selectedId));
    ctx.restore();
  }, [elements, currentEl, selectedId, zoom, pan]);

  const drawElement = (ctx, el, selected) => {
    ctx.strokeStyle = el.color;
    ctx.lineWidth = el.strokeWidth;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.globalAlpha = el.opacity || 1;
    ctx.setLineDash(el.dash ? [8, 4] : []);

    const applyFill = () => {
      if (el.fill === 'solid') { ctx.fillStyle = el.color + '22'; ctx.fill(); }
      else if (el.fill === 'hatch') {
        ctx.save();
        ctx.clip();
        ctx.strokeStyle = el.color + '33';
        ctx.lineWidth = 1;
        for (let i = -500; i < 500; i += 6) {
          ctx.beginPath(); ctx.moveTo(i, -500); ctx.lineTo(i + 500, 0); ctx.stroke();
        }
        ctx.restore();
      }
    };

    switch (el.type) {
      case 'pen': {
        if (!el.points || el.points.length < 2) break;
        ctx.beginPath();
        ctx.moveTo(el.points[0].x, el.points[0].y);
        for (let i = 1; i < el.points.length; i++) ctx.lineTo(el.points[i].x, el.points[i].y);
        ctx.stroke();
        break;
      }
      case 'eraser': {
        if (!el.points || el.points.length < 2) break;
        ctx.save();
        ctx.globalCompositeOperation = 'destination-out';
        ctx.lineWidth = el.strokeWidth * 4;
        ctx.beginPath();
        ctx.moveTo(el.points[0].x, el.points[0].y);
        for (let i = 1; i < el.points.length; i++) ctx.lineTo(el.points[i].x, el.points[i].y);
        ctx.stroke();
        ctx.restore();
        break;
      }
      case 'line': case 'arrow': {
        ctx.beginPath();
        ctx.moveTo(el.x1, el.y1);
        ctx.lineTo(el.x2, el.y2);
        ctx.stroke();
        if (el.type === 'arrow') {
          const angle = Math.atan2(el.y2 - el.y1, el.x2 - el.x1);
          const headLen = 12;
          ctx.beginPath();
          ctx.moveTo(el.x2, el.y2);
          ctx.lineTo(el.x2 - headLen * Math.cos(angle - Math.PI / 6), el.y2 - headLen * Math.sin(angle - Math.PI / 6));
          ctx.moveTo(el.x2, el.y2);
          ctx.lineTo(el.x2 - headLen * Math.cos(angle + Math.PI / 6), el.y2 - headLen * Math.sin(angle + Math.PI / 6));
          ctx.stroke();
        }
        break;
      }
      case 'rect': {
        const x = Math.min(el.x1, el.x2), y = Math.min(el.y1, el.y2);
        const w = Math.abs(el.x2 - el.x1), h = Math.abs(el.y2 - el.y1);
        ctx.beginPath(); ctx.rect(x, y, w, h);
        applyFill(); ctx.stroke();
        break;
      }
      case 'ellipse': {
        const cx = (el.x1 + el.x2) / 2, cy = (el.y1 + el.y2) / 2;
        const rx = Math.abs(el.x2 - el.x1) / 2, ry = Math.abs(el.y2 - el.y1) / 2;
        ctx.beginPath(); ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
        applyFill(); ctx.stroke();
        break;
      }
      case 'diamond': {
        const cx2 = (el.x1 + el.x2) / 2, cy2 = (el.y1 + el.y2) / 2;
        const hw = Math.abs(el.x2 - el.x1) / 2, hh = Math.abs(el.y2 - el.y1) / 2;
        ctx.beginPath();
        ctx.moveTo(cx2, cy2 - hh); ctx.lineTo(cx2 + hw, cy2); ctx.lineTo(cx2, cy2 + hh); ctx.lineTo(cx2 - hw, cy2); ctx.closePath();
        applyFill(); ctx.stroke();
        break;
      }
      case 'text': {
        ctx.font = `${el.fontSize || 16}px 'Segoe UI', sans-serif`;
        ctx.fillStyle = el.color;
        ctx.fillText(el.text || '', el.x1, el.y1);
        break;
      }
    }
    ctx.setLineDash([]);
    ctx.globalAlpha = 1;

    if (selected) {
      ctx.save();
      ctx.strokeStyle = '#3B82F6';
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 4]);
      if (el.type === 'pen' || el.type === 'eraser') {
        const xs = el.points.map(p => p.x), ys = el.points.map(p => p.y);
        ctx.strokeRect(Math.min(...xs) - 4, Math.min(...ys) - 4, Math.max(...xs) - Math.min(...xs) + 8, Math.max(...ys) - Math.min(...ys) + 8);
      } else if (el.type === 'text') {
        ctx.strokeRect(el.x1 - 4, el.y1 - (el.fontSize || 16), ctx.measureText(el.text || '').width + 8, (el.fontSize || 16) + 8);
      } else {
        const x = Math.min(el.x1, el.x2) - 4, y = Math.min(el.y1, el.y2) - 4;
        ctx.strokeRect(x, y, Math.abs(el.x2 - el.x1) + 8, Math.abs(el.y2 - el.y1) + 8);
      }
      ctx.restore();
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    const ro = new ResizeObserver(() => { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight; redraw(); });
    ro.observe(canvas);
    return () => ro.disconnect();
  }, []);

  useEffect(() => { redraw(); }, [redraw]);

  const startDraw = (e) => {
    e.preventDefault();
    const pos = getPos(e);

    if (tool === 'select') {
      const hit = [...elements].reverse().find(el => hitTest(el, pos));
      if (hit) { setSelectedId(hit.id); setDragOffset({ x: pos.x - (hit.x1 || 0), y: pos.y - (hit.y1 || 0) }); setDrawing(true); }
      else setSelectedId(null);
      return;
    }
    if (tool === 'text') { setTextInput(pos); return; }

    setDrawing(true);
    setHistory(h => [...h, [...elements]]);
    const el = { id: uid(), type: tool, color, strokeWidth: lineWidth, fill: fillMode, opacity: 1 };
    if (tool === 'pen' || tool === 'eraser') { el.points = [pos]; }
    else { el.x1 = pos.x; el.y1 = pos.y; el.x2 = pos.x; el.y2 = pos.y; }
    setCurrentEl(el);
  };

  const onDraw = (e) => {
    if (!drawing) return;
    e.preventDefault();
    const pos = getPos(e);

    if (tool === 'select' && selectedId && dragOffset) {
      setElements(prev => prev.map(el => {
        if (el.id !== selectedId) return el;
        const dx = pos.x - dragOffset.x - (el.x1 || 0);
        const dy = pos.y - dragOffset.y - (el.y1 || 0);
        if (el.type === 'pen' || el.type === 'eraser') return { ...el, points: el.points.map(p => ({ x: p.x + dx, y: p.y + dy })) };
        return { ...el, x1: el.x1 + dx, y1: el.y1 + dy, x2: el.x2 + dx, y2: el.y2 + dy };
      }));
      setDragOffset({ x: pos.x - (elements.find(e2 => e2.id === selectedId)?.x1 || 0), y: pos.y - (elements.find(e2 => e2.id === selectedId)?.y1 || 0) });
      return;
    }

    if (!currentEl) return;
    if (tool === 'pen' || tool === 'eraser') {
      setCurrentEl(prev => ({ ...prev, points: [...prev.points, pos] }));
    } else {
      setCurrentEl(prev => ({ ...prev, x2: pos.x, y2: pos.y }));
    }
  };

  const endDraw = () => {
    if (currentEl) { setElements(prev => [...prev, currentEl]); setCurrentEl(null); }
    setDrawing(false); setDragOffset(null);
  };

  const hitTest = (el, pos) => {
    const margin = 8;
    if (el.type === 'pen' || el.type === 'eraser') {
      return el.points?.some(p => Math.abs(p.x - pos.x) < margin && Math.abs(p.y - pos.y) < margin);
    }
    if (el.type === 'text') {
      return pos.x >= el.x1 - margin && pos.x <= el.x1 + 200 && pos.y >= el.y1 - 20 && pos.y <= el.y1 + margin;
    }
    const x = Math.min(el.x1, el.x2) - margin, y = Math.min(el.y1, el.y2) - margin;
    const w = Math.abs(el.x2 - el.x1) + margin * 2, h = Math.abs(el.y2 - el.y1) + margin * 2;
    return pos.x >= x && pos.x <= x + w && pos.y >= y && pos.y <= y + h;
  };

  const addText = (text) => {
    if (!text || !textInput) { setTextInput(null); return; }
    setHistory(h => [...h, [...elements]]);
    setElements(prev => [...prev, { id: uid(), type: 'text', x1: textInput.x, y1: textInput.y, text, color, strokeWidth: lineWidth, fontSize: 16, fill: 'none' }]);
    setTextInput(null);
  };

  const undo = () => { if (history.length === 0) return; setElements(history[history.length - 1]); setHistory(h => h.slice(0, -1)); };
  const clear = () => { setHistory(h => [...h, [...elements]]); setElements([]); };
  const deleteSelected = () => { if (!selectedId) return; setHistory(h => [...h, [...elements]]); setElements(prev => prev.filter(e2 => e2.id !== selectedId)); setSelectedId(null); };

  const download = () => { const a = document.createElement('a'); a.href = canvasRef.current.toDataURL('image/png'); a.download = 'whiteboard.png'; a.click(); };

  const handleWheel = (e) => {
    if (e.ctrlKey) { e.preventDefault(); setZoom(z => Math.max(0.25, Math.min(4, z + (e.deltaY > 0 ? -0.1 : 0.1)))); }
    else { setPan(p => ({ x: p.x - e.deltaX, y: p.y - e.deltaY })); }
  };

  const getCursor = () => {
    if (tool === 'select') return selectedId ? 'move' : 'default';
    if (tool === 'eraser') return 'crosshair';
    if (tool === 'text') return 'text';
    return 'crosshair';
  };

  return (
    <ToolPageWrapper meta={meta}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 0, border: '1px solid var(--neutral-200)', borderRadius: 12, overflow: 'hidden', background: '#fff' }}>
        {/* Top Toolbar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 12px', background: 'var(--neutral-50)', borderBottom: '1px solid var(--neutral-200)', flexWrap: 'wrap' }}>
          {/* Tool buttons */}
          {TOOLS.map(t => (
            <button key={t} onClick={() => { setTool(t); setSelectedId(null); }} title={TOOL_LABELS[t]}
              style={{ width: 32, height: 32, borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', border: tool === t ? '2px solid var(--primary-500)' : '1px solid var(--neutral-200)', background: tool === t ? 'var(--primary-50)' : '#fff', cursor: 'pointer', fontSize: '0.688rem', fontWeight: 700, color: tool === t ? 'var(--primary-600)' : 'var(--neutral-500)' }}>
              {t === 'select' ? '↖' : t === 'pen' ? '✏' : t === 'line' ? '—' : t === 'arrow' ? '→' : t === 'rect' ? '□' : t === 'ellipse' ? '○' : t === 'diamond' ? '◇' : t === 'text' ? 'T' : '⌫'}
            </button>
          ))}

          <div style={{ width: 1, height: 24, background: 'var(--neutral-200)', margin: '0 4px' }} />

          {/* Colors */}
          {COLORS.map(c => (
            <button key={c} onClick={() => setColor(c)}
              style={{ width: 20, height: 20, borderRadius: '50%', background: c, border: color === c ? '3px solid var(--neutral-800)' : '2px solid var(--neutral-200)', cursor: 'pointer', padding: 0 }} />
          ))}

          <div style={{ width: 1, height: 24, background: 'var(--neutral-200)', margin: '0 4px' }} />

          {/* Stroke width */}
          {SIZES.map(s => (
            <button key={s} onClick={() => setLineWidth(s)}
              style={{ width: 26, height: 26, borderRadius: 4, border: lineWidth === s ? '2px solid var(--primary-500)' : '1px solid var(--neutral-200)', background: lineWidth === s ? 'var(--primary-50)' : '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ width: s + 2, height: s + 2, borderRadius: '50%', background: '#333' }} />
            </button>
          ))}

          <div style={{ width: 1, height: 24, background: 'var(--neutral-200)', margin: '0 4px' }} />

          {/* Fill mode */}
          {FILL_MODES.map(f => (
            <button key={f} onClick={() => setFillMode(f)} title={f}
              style={{ width: 26, height: 26, borderRadius: 4, border: fillMode === f ? '2px solid var(--primary-500)' : '1px solid var(--neutral-200)', background: fillMode === f ? 'var(--primary-50)' : '#fff', cursor: 'pointer', fontSize: '0.563rem', fontWeight: 700, color: 'var(--neutral-500)' }}>
              {f === 'none' ? '∅' : f === 'solid' ? '■' : '▤'}
            </button>
          ))}

          <div style={{ flex: 1 }} />

          {/* Actions */}
          <button onClick={undo} className="btn btn-ghost btn-sm" disabled={!history.length} title="Undo">Undo</button>
          {selectedId && <button onClick={deleteSelected} className="btn btn-ghost btn-sm" style={{ color: 'var(--error)' }}>Delete</button>}
          <button onClick={clear} className="btn btn-ghost btn-sm">Clear</button>
          <button onClick={download} className="btn btn-ghost btn-sm"><Icon name="Download" size={14} />PNG</button>
        </div>

        {/* Canvas */}
        <div style={{ position: 'relative' }}>
          <canvas ref={canvasRef}
            onMouseDown={startDraw} onMouseMove={onDraw} onMouseUp={endDraw} onMouseLeave={endDraw}
            onTouchStart={startDraw} onTouchMove={onDraw} onTouchEnd={endDraw}
            onWheel={handleWheel}
            style={{ width: '100%', height: 560, cursor: getCursor(), touchAction: 'none', display: 'block' }} />

          {textInput && (
            <input autoFocus type="text" placeholder="Type text..."
              style={{ position: 'absolute', left: textInput.x * zoom + pan.x, top: textInput.y * zoom + pan.y - 20, fontSize: 16, border: '1px solid var(--primary-400)', borderRadius: 4, padding: '2px 6px', background: '#fff', color: color, outline: 'none', zIndex: 10 }}
              onKeyDown={e => { if (e.key === 'Enter') addText(e.target.value); if (e.key === 'Escape') setTextInput(null); }}
              onBlur={e => addText(e.target.value)} />
          )}
        </div>

        {/* Bottom bar */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 12px', background: 'var(--neutral-50)', borderTop: '1px solid var(--neutral-200)', fontSize: '0.688rem', color: 'var(--neutral-400)' }}>
          <span>{elements.length} elements</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <button onClick={() => setZoom(z => Math.max(0.25, z - 0.25))} style={{ background: 'none', border: '1px solid var(--neutral-200)', borderRadius: 4, padding: '2px 6px', cursor: 'pointer', fontSize: '0.688rem' }}>-</button>
            <span>{Math.round(zoom * 100)}%</span>
            <button onClick={() => setZoom(z => Math.min(4, z + 0.25))} style={{ background: 'none', border: '1px solid var(--neutral-200)', borderRadius: 4, padding: '2px 6px', cursor: 'pointer', fontSize: '0.688rem' }}>+</button>
            <button onClick={() => { setZoom(1); setPan({ x: 0, y: 0 }); }} style={{ background: 'none', border: '1px solid var(--neutral-200)', borderRadius: 4, padding: '2px 6px', cursor: 'pointer', fontSize: '0.688rem' }}>Reset</button>
          </div>
        </div>
      </div>
    </ToolPageWrapper>
  );
};
export default OnlineWhiteboard;
