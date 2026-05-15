import React, { useRef, useState, useEffect, useCallback } from 'react';
import ToolPageWrapper from '../../components/common/ToolPageWrapper';
import { Icon } from '../../assets/icons/icons';
import meta from './meta';

const COLORS = ['#1e1e1e','#e03131','#2f9e44','#1971c2','#f08c00','#7048e8','#e64980','#0c8599','#ffffff'];
const BG_COLORS = ['transparent','#ffc9c9','#b2f2bb','#a5d8ff','#ffec99','#d0bfff','#fcc2d7','#99e9f2'];
const SIZES = [1, 2, 4, 8];
const TOOLS = [
  { id:'select', label:'Select', key:'V', icon:'↖' },
  { id:'pan', label:'Pan', key:'H', icon:'✋' },
  { id:'pen', label:'Pen', key:'P', icon:'✏' },
  { id:'line', label:'Line', key:'L', icon:'╲' },
  { id:'arrow', label:'Arrow', key:'A', icon:'→' },
  { id:'rect', label:'Rectangle', key:'R', icon:'□' },
  { id:'ellipse', label:'Ellipse', key:'O', icon:'○' },
  { id:'diamond', label:'Diamond', key:'D', icon:'◇' },
  { id:'text', label:'Text', key:'T', icon:'A' },
  { id:'eraser', label:'Eraser', key:'E', icon:'⌫' },
];
const FILL = ['none','solid','hatch'];
const STROKE_STYLE = ['solid','dashed'];
const uid = () => Math.random().toString(36).slice(2,8);

const OnlineWhiteboard = () => {
  const canvasRef = useRef(null);
  const [tool, setTool] = useState('pen');
  const [color, setColor] = useState('#1e1e1e');
  const [bgColor, setBgColor] = useState('transparent');
  const [lw, setLw] = useState(2);
  const [fill, setFill] = useState('none');
  const [strokeStyle, setStrokeStyle] = useState('solid');
  const [opacity, setOpacity] = useState(1);
  const [elements, setElements] = useState([]);
  const [history, setHistory] = useState([]);
  const [redoStack, setRedoStack] = useState([]);
  const [drawing, setDrawing] = useState(false);
  const [curEl, setCurEl] = useState(null);
  const [selId, setSelId] = useState(null);
  const [dragOff, setDragOff] = useState(null);
  const [txtIn, setTxtIn] = useState(null);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [panning, setPanning] = useState(false);
  const panStart = useRef(null);
  const [showProps, setShowProps] = useState(true);

  const getPos = useCallback((e) => {
    const r = canvasRef.current.getBoundingClientRect();
    const cx = e.touches ? e.touches[0].clientX : e.clientX;
    const cy = e.touches ? e.touches[0].clientY : e.clientY;
    return { x: (cx - r.left - pan.x) / zoom, y: (cy - r.top - pan.y) / zoom };
  }, [zoom, pan]);

  const drawEl = useCallback((ctx, el, sel) => {
    ctx.save();
    ctx.strokeStyle = el.color;
    ctx.lineWidth = el.lw;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.globalAlpha = el.opacity ?? 1;
    ctx.setLineDash(el.dash ? [8, 4] : []);

    const doFill = () => {
      if (el.fill === 'solid') { ctx.fillStyle = (el.bg && el.bg !== 'transparent') ? el.bg : el.color + '18'; ctx.fill(); }
      else if (el.fill === 'hatch') {
        ctx.save(); ctx.clip(); ctx.strokeStyle = el.color + '30'; ctx.lineWidth = 1;
        for (let i = -600; i < 600; i += 6) { ctx.beginPath(); ctx.moveTo(i, -600); ctx.lineTo(i + 600, 0); ctx.stroke(); }
        ctx.restore();
      }
    };

    switch (el.type) {
      case 'pen': case 'eraser': {
        if (!el.pts || el.pts.length < 2) break;
        if (el.type === 'eraser') { ctx.globalCompositeOperation = 'destination-out'; ctx.lineWidth = el.lw * 4; }
        ctx.beginPath(); ctx.moveTo(el.pts[0].x, el.pts[0].y);
        // Smooth curve through points
        for (let i = 1; i < el.pts.length - 1; i++) {
          const mx = (el.pts[i].x + el.pts[i+1].x) / 2;
          const my = (el.pts[i].y + el.pts[i+1].y) / 2;
          ctx.quadraticCurveTo(el.pts[i].x, el.pts[i].y, mx, my);
        }
        ctx.lineTo(el.pts[el.pts.length-1].x, el.pts[el.pts.length-1].y);
        ctx.stroke();
        break;
      }
      case 'line': case 'arrow': {
        ctx.beginPath(); ctx.moveTo(el.x1, el.y1); ctx.lineTo(el.x2, el.y2); ctx.stroke();
        if (el.type === 'arrow') {
          const a = Math.atan2(el.y2 - el.y1, el.x2 - el.x1), h = 14;
          ctx.beginPath(); ctx.moveTo(el.x2, el.y2);
          ctx.lineTo(el.x2 - h * Math.cos(a - Math.PI / 6), el.y2 - h * Math.sin(a - Math.PI / 6));
          ctx.moveTo(el.x2, el.y2);
          ctx.lineTo(el.x2 - h * Math.cos(a + Math.PI / 6), el.y2 - h * Math.sin(a + Math.PI / 6));
          ctx.stroke();
        }
        break;
      }
      case 'rect': {
        const x = Math.min(el.x1, el.x2), y = Math.min(el.y1, el.y2);
        const w = Math.abs(el.x2 - el.x1), h = Math.abs(el.y2 - el.y1);
        ctx.beginPath(); ctx.rect(x, y, w, h); doFill(); ctx.stroke();
        break;
      }
      case 'ellipse': {
        const cx = (el.x1+el.x2)/2, cy = (el.y1+el.y2)/2;
        ctx.beginPath(); ctx.ellipse(cx, cy, Math.abs(el.x2-el.x1)/2, Math.abs(el.y2-el.y1)/2, 0, 0, Math.PI*2);
        doFill(); ctx.stroke();
        break;
      }
      case 'diamond': {
        const cx = (el.x1+el.x2)/2, cy = (el.y1+el.y2)/2;
        const hw = Math.abs(el.x2-el.x1)/2, hh = Math.abs(el.y2-el.y1)/2;
        ctx.beginPath(); ctx.moveTo(cx,cy-hh); ctx.lineTo(cx+hw,cy); ctx.lineTo(cx,cy+hh); ctx.lineTo(cx-hw,cy); ctx.closePath();
        doFill(); ctx.stroke();
        break;
      }
      case 'text': {
        ctx.font = `${el.fs || 18}px 'Segoe UI', sans-serif`;
        ctx.fillStyle = el.color;
        ctx.fillText(el.text || '', el.x1, el.y1);
        break;
      }
    }
    ctx.restore();

    if (sel) {
      ctx.save(); ctx.strokeStyle = '#3b82f6'; ctx.lineWidth = 1.5 / zoom; ctx.setLineDash([5/zoom, 3/zoom]);
      let bx, by, bw, bh;
      if (el.type === 'pen' || el.type === 'eraser') {
        const xs = el.pts.map(p=>p.x), ys = el.pts.map(p=>p.y);
        bx = Math.min(...xs)-6; by = Math.min(...ys)-6; bw = Math.max(...xs)-bx+6; bh = Math.max(...ys)-by+6;
      } else if (el.type === 'text') {
        ctx.font = `${el.fs||18}px 'Segoe UI',sans-serif`;
        bx = el.x1-4; by = el.y1-(el.fs||18); bw = ctx.measureText(el.text||'').width+8; bh = (el.fs||18)+8;
      } else {
        bx = Math.min(el.x1,el.x2)-4; by = Math.min(el.y1,el.y2)-4;
        bw = Math.abs(el.x2-el.x1)+8; bh = Math.abs(el.y2-el.y1)+8;
      }
      ctx.strokeRect(bx, by, bw, bh);
      // Resize handles
      ctx.fillStyle = '#fff'; ctx.strokeStyle = '#3b82f6'; ctx.lineWidth = 1.5/zoom; ctx.setLineDash([]);
      const hs = 5/zoom;
      [[bx,by],[bx+bw,by],[bx,by+bh],[bx+bw,by+bh]].forEach(([hx,hy]) => {
        ctx.fillRect(hx-hs/2, hy-hs/2, hs, hs);
        ctx.strokeRect(hx-hs/2, hy-hs/2, hs, hs);
      });
      ctx.restore();
    }
  }, [zoom]);

  const redraw = useCallback(() => {
    const cv = canvasRef.current; if (!cv) return;
    const ctx = cv.getContext('2d');
    ctx.setTransform(1,0,0,1,0,0);
    ctx.clearRect(0, 0, cv.width, cv.height);
    ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, cv.width, cv.height);
    // Dot grid
    ctx.fillStyle = '#ddd';
    const step = 20;
    for (let x = pan.x % (step*zoom); x < cv.width; x += step*zoom)
      for (let y = pan.y % (step*zoom); y < cv.height; y += step*zoom)
        { ctx.beginPath(); ctx.arc(x, y, 0.7, 0, Math.PI*2); ctx.fill(); }
    ctx.save(); ctx.translate(pan.x, pan.y); ctx.scale(zoom, zoom);
    const all = curEl ? [...elements, curEl] : elements;
    all.forEach(el => drawEl(ctx, el, el.id === selId));
    ctx.restore();
  }, [elements, curEl, selId, zoom, pan, drawEl]);

  useEffect(() => {
    const cv = canvasRef.current; if (!cv) return;
    cv.width = cv.offsetWidth; cv.height = cv.offsetHeight;
    const ro = new ResizeObserver(() => { cv.width = cv.offsetWidth; cv.height = cv.offsetHeight; redraw(); });
    ro.observe(cv); return () => ro.disconnect();
  }, []);
  useEffect(() => { redraw(); }, [redraw]);

  // Keyboard shortcuts
  useEffect(() => {
    const h = (e) => {
      if (['INPUT','TEXTAREA','SELECT'].includes(e.target.tagName)) return;
      const t = TOOLS.find(t2 => t2.key.toLowerCase() === e.key.toLowerCase());
      if (t) { setTool(t.id); setSelId(null); }
      if (e.key === 'Delete' || e.key === 'Backspace') { if (selId) { pushHistory(); setElements(p=>p.filter(el=>el.id!==selId)); setSelId(null); } }
      if (e.ctrlKey && e.key === 'z') { e.preventDefault(); undo(); }
      if (e.ctrlKey && e.key === 'y') { e.preventDefault(); redo(); }
    };
    document.addEventListener('keydown', h); return () => document.removeEventListener('keydown', h);
  }, [selId, elements, history]);

  const pushHistory = () => { setHistory(h => [...h, [...elements]]); setRedoStack([]); };
  const undo = () => { if (!history.length) return; setRedoStack(r => [...r, [...elements]]); setElements(history[history.length-1]); setHistory(h=>h.slice(0,-1)); };
  const redo = () => { if (!redoStack.length) return; setHistory(h => [...h, [...elements]]); setElements(redoStack[redoStack.length-1]); setRedoStack(r=>r.slice(0,-1)); };

  const hitTest = (el, pos) => {
    const m = 10;
    if (el.type === 'pen' || el.type === 'eraser') return el.pts?.some(p => Math.hypot(p.x-pos.x,p.y-pos.y) < m);
    if (el.type === 'text') return pos.x >= el.x1-m && pos.x <= el.x1+200 && pos.y >= el.y1-20 && pos.y <= el.y1+m;
    const x = Math.min(el.x1,el.x2)-m, y = Math.min(el.y1,el.y2)-m;
    return pos.x >= x && pos.x <= x+Math.abs(el.x2-el.x1)+m*2 && pos.y >= y && pos.y <= y+Math.abs(el.y2-el.y1)+m*2;
  };

  const start = (e) => {
    e.preventDefault(); const pos = getPos(e);
    if (tool === 'pan') { setPanning(true); panStart.current = { x: e.clientX - pan.x, y: e.clientY - pan.y }; return; }
    if (tool === 'select') {
      const hit = [...elements].reverse().find(el => hitTest(el, pos));
      if (hit) { setSelId(hit.id); setDragOff({ x: pos.x-(hit.x1||0), y: pos.y-(hit.y1||0) }); setDrawing(true); }
      else setSelId(null);
      return;
    }
    if (tool === 'text') { setTxtIn(pos); return; }
    setDrawing(true); pushHistory();
    const el = { id:uid(), type:tool, color, bg:bgColor, lw, fill, dash:strokeStyle==='dashed', opacity };
    if (tool === 'pen' || tool === 'eraser') el.pts = [pos];
    else { el.x1 = pos.x; el.y1 = pos.y; el.x2 = pos.x; el.y2 = pos.y; }
    setCurEl(el);
  };

  const move = (e) => {
    if (panning) { setPan({ x: e.clientX - panStart.current.x, y: e.clientY - panStart.current.y }); return; }
    if (!drawing) return; e.preventDefault(); const pos = getPos(e);
    if (tool === 'select' && selId && dragOff) {
      setElements(prev => prev.map(el => {
        if (el.id !== selId) return el;
        const dx = pos.x - dragOff.x - (el.x1||0), dy = pos.y - dragOff.y - (el.y1||0);
        if (el.type==='pen'||el.type==='eraser') return {...el, pts:el.pts.map(p=>({x:p.x+dx,y:p.y+dy}))};
        return {...el, x1:el.x1+dx, y1:el.y1+dy, x2:el.x2+dx, y2:el.y2+dy};
      }));
      const cur = elements.find(e2=>e2.id===selId);
      if (cur) setDragOff({x:pos.x-(cur.x1||0),y:pos.y-(cur.y1||0)});
      return;
    }
    if (!curEl) return;
    if (tool==='pen'||tool==='eraser') setCurEl(p=>({...p,pts:[...p.pts,pos]}));
    else setCurEl(p=>({...p,x2:pos.x,y2:pos.y}));
  };

  const end = () => { if (curEl) { setElements(p=>[...p,curEl]); setCurEl(null); } setDrawing(false); setDragOff(null); setPanning(false); };

  const addText = (text) => {
    if (!text||!txtIn) { setTxtIn(null); return; }
    pushHistory();
    setElements(p=>[...p,{id:uid(),type:'text',x1:txtIn.x,y1:txtIn.y,text,color,lw,fs:18,fill:'none',opacity}]);
    setTxtIn(null);
  };

  const download = () => { const a=document.createElement('a'); a.href=canvasRef.current.toDataURL('image/png'); a.download='whiteboard.png'; a.click(); };
  const clear = () => { pushHistory(); setElements([]); setSelId(null); };

  const handleWheel = (e) => {
    if (e.ctrlKey) { e.preventDefault(); setZoom(z=>Math.max(0.1,Math.min(5,z+(e.deltaY>0?-0.1:0.1)))); }
    else setPan(p=>({x:p.x-e.deltaX,y:p.y-e.deltaY}));
  };

  const selEl = elements.find(e2=>e2.id===selId);

  return (
    <ToolPageWrapper meta={meta}>
      <div style={{display:'flex',flexDirection:'column',gap:0,border:'1px solid #ddd',overflow:'hidden',background:'#fff'}}>
        {/* Toolbar */}
        <div style={{display:'flex',alignItems:'center',gap:4,padding:'6px 10px',background:'#f8f8f8',borderBottom:'1px solid #e5e5e5',flexWrap:'wrap',minHeight:42}}>
          {TOOLS.map(t=>(
            <button key={t.id} onClick={()=>{setTool(t.id);setSelId(null)}} title={`${t.label} (${t.key})`}
              style={{width:30,height:30,display:'flex',alignItems:'center',justifyContent:'center',border:tool===t.id?'1.5px solid #6965db':'1px solid transparent',background:tool===t.id?'#ececf4':'transparent',cursor:'pointer',fontSize:'0.75rem',color:tool===t.id?'#6965db':'#666',fontWeight:600,borderRadius:6}}>
              {t.icon}
            </button>
          ))}
          <div style={{width:1,height:22,background:'#ddd',margin:'0 4px'}}/>
          {COLORS.map(cl=>(
            <button key={cl} onClick={()=>setColor(cl)}
              style={{width:18,height:18,borderRadius:4,background:cl,border:color===cl?'2.5px solid #333':cl==='#ffffff'?'1px solid #ccc':'1.5px solid transparent',cursor:'pointer',padding:0}}/>
          ))}
          <div style={{width:1,height:22,background:'#ddd',margin:'0 4px'}}/>
          {SIZES.map(s=>(
            <button key={s} onClick={()=>setLw(s)} style={{width:24,height:24,border:lw===s?'1.5px solid #6965db':'1px solid #ddd',background:lw===s?'#ececf4':'#fff',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',borderRadius:4}}>
              <div style={{width:Math.min(s+1,8),height:Math.min(s+1,8),borderRadius:'50%',background:'#333'}}/>
            </button>
          ))}
          <div style={{width:1,height:22,background:'#ddd',margin:'0 4px'}}/>
          {FILL.map(f=>(
            <button key={f} onClick={()=>setFill(f)} title={f}
              style={{width:24,height:24,border:fill===f?'1.5px solid #6965db':'1px solid #ddd',background:fill===f?'#ececf4':'#fff',cursor:'pointer',fontSize:'0.563rem',fontWeight:700,color:'#666',borderRadius:4}}>
              {f==='none'?'∅':f==='solid'?'■':'▤'}
            </button>
          ))}
          {STROKE_STYLE.map(ss=>(
            <button key={ss} onClick={()=>setStrokeStyle(ss)} title={ss}
              style={{width:24,height:24,border:strokeStyle===ss?'1.5px solid #6965db':'1px solid #ddd',background:strokeStyle===ss?'#ececf4':'#fff',cursor:'pointer',fontSize:'0.5rem',fontWeight:700,color:'#666',borderRadius:4}}>
              {ss==='solid'?'—':'- -'}
            </button>
          ))}
          <div style={{flex:1}}/>
          <button onClick={undo} title="Undo (Ctrl+Z)" disabled={!history.length} style={{background:'none',border:'1px solid #ddd',padding:'3px 8px',cursor:'pointer',fontSize:'0.688rem',color:'#666',borderRadius:4}}>Undo</button>
          <button onClick={redo} title="Redo (Ctrl+Y)" disabled={!redoStack.length} style={{background:'none',border:'1px solid #ddd',padding:'3px 8px',cursor:'pointer',fontSize:'0.688rem',color:'#666',borderRadius:4}}>Redo</button>
          {selId&&<button onClick={()=>{pushHistory();setElements(p=>p.filter(e2=>e2.id!==selId));setSelId(null)}} style={{background:'none',border:'1px solid #fca5a5',padding:'3px 8px',cursor:'pointer',fontSize:'0.688rem',color:'#dc2626',borderRadius:4}}>Delete</button>}
          <button onClick={clear} style={{background:'none',border:'1px solid #ddd',padding:'3px 8px',cursor:'pointer',fontSize:'0.688rem',color:'#666',borderRadius:4}}>Clear</button>
          <button onClick={download} style={{background:'none',border:'1px solid #ddd',padding:'3px 8px',cursor:'pointer',fontSize:'0.688rem',color:'#666',borderRadius:4}}><Icon name="Download" size={12}/>PNG</button>
        </div>

        {/* Canvas area */}
        <div style={{position:'relative',flex:1}}>
          <canvas ref={canvasRef}
            onMouseDown={start} onMouseMove={move} onMouseUp={end} onMouseLeave={end}
            onTouchStart={start} onTouchMove={move} onTouchEnd={end}
            onWheel={handleWheel}
            style={{width:'100%',height:580,cursor:tool==='pan'?'grab':tool==='select'?(selId?'move':'default'):tool==='eraser'?'crosshair':tool==='text'?'text':'crosshair',touchAction:'none',display:'block'}}/>
          {txtIn&&(
            <input autoFocus type="text" placeholder="Type..."
              style={{position:'absolute',left:txtIn.x*zoom+pan.x,top:txtIn.y*zoom+pan.y-20,fontSize:18,border:'2px solid #6965db',padding:'2px 6px',background:'#fff',color,outline:'none',zIndex:10,borderRadius:4,minWidth:120}}
              onKeyDown={e=>{if(e.key==='Enter')addText(e.target.value);if(e.key==='Escape')setTxtIn(null)}}
              onBlur={e=>addText(e.target.value)}/>
          )}
        </div>

        {/* Status bar */}
        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'5px 10px',background:'#f8f8f8',borderTop:'1px solid #e5e5e5',fontSize:'0.625rem',color:'#999'}}>
          <div style={{display:'flex',gap:12}}>
            <span>{elements.length} elements</span>
            <span>{TOOLS.find(t2=>t2.id===tool)?.label}</span>
          </div>
          <div style={{display:'flex',alignItems:'center',gap:4}}>
            <button onClick={()=>setZoom(z=>Math.max(0.1,z-0.25))} style={{background:'none',border:'1px solid #ddd',padding:'1px 5px',cursor:'pointer',fontSize:'0.625rem',borderRadius:3}}>−</button>
            <span style={{minWidth:36,textAlign:'center'}}>{Math.round(zoom*100)}%</span>
            <button onClick={()=>setZoom(z=>Math.min(5,z+0.25))} style={{background:'none',border:'1px solid #ddd',padding:'1px 5px',cursor:'pointer',fontSize:'0.625rem',borderRadius:3}}>+</button>
            <button onClick={()=>{setZoom(1);setPan({x:0,y:0})}} style={{background:'none',border:'1px solid #ddd',padding:'1px 5px',cursor:'pointer',fontSize:'0.625rem',borderRadius:3,marginLeft:4}}>Reset</button>
          </div>
        </div>
      </div>
    </ToolPageWrapper>
  );
};
export default OnlineWhiteboard;
