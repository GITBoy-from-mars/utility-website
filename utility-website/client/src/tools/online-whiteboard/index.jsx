import React, { useRef, useState, useEffect, useCallback } from 'react';
import ToolPageWrapper from '../../components/common/ToolPageWrapper';
import { Icon } from '../../assets/icons/icons';
import meta from './meta';

const COLORS = ['#1e1e1e','#e03131','#2f9e44','#1971c2','#f08c00','#7048e8','#e64980','#0c8599','#fff'];
const SIZES = [1,2,4,8];
const TOOLS = [
  {id:'select',key:'V',icon:'↖'},{id:'pan',key:'H',icon:'✋'},{id:'pen',key:'P',icon:'✏'},
  {id:'line',key:'L',icon:'╲'},{id:'arrow',key:'A',icon:'→'},{id:'rect',key:'R',icon:'□'},
  {id:'ellipse',key:'O',icon:'○'},{id:'diamond',key:'D',icon:'◇'},{id:'text',key:'T',icon:'A'},
  {id:'eraser',key:'E',icon:'⌫'},
];
const FILL=['none','solid','hatch'];
const uid=()=>Math.random().toString(36).slice(2,8);
const FONT='Segoe Print, Comic Sans MS, cursive';

const OnlineWhiteboard = () => {
  const cvRef=useRef(null);
  const [tool,setTool]=useState('pen');
  const [color,setColor]=useState('#1e1e1e');
  const [lw,setLw]=useState(2);
  const [fill,setFill]=useState('none');
  const [dash,setDash]=useState(false);
  const [els,setEls]=useState([]);
  const [hist,setHist]=useState([]);
  const [redo,setRedo]=useState([]);
  const [drawing,setDrawing]=useState(false);
  const [cur,setCur]=useState(null);
  const [selId,setSelId]=useState(null);
  const [dragOff,setDragOff]=useState(null);
  const [editText,setEditText]=useState(null); // {id,x,y,text,isNew}
  const [zoom,setZoom]=useState(1);
  const [pan,setPan]=useState({x:0,y:0});
  const [panning,setPanning]=useState(false);
  const [isFs,setIsFs]=useState(false);
  const panS=useRef(null);
  const wrapRef=useRef(null);

  const getPos=useCallback(e=>{
    const r=cvRef.current.getBoundingClientRect();
    const cx=e.touches?e.touches[0].clientX:e.clientX;
    const cy=e.touches?e.touches[0].clientY:e.clientY;
    return{x:(cx-r.left-pan.x)/zoom,y:(cy-r.top-pan.y)/zoom};
  },[zoom,pan]);

  const drawEl=useCallback((ctx,el,sel)=>{
    ctx.save();
    ctx.strokeStyle=el.color;ctx.lineWidth=el.lw;ctx.lineCap='round';ctx.lineJoin='round';
    ctx.globalAlpha=el.opacity||1;ctx.setLineDash(el.dash?[8,4]:[]);
    const doFill=()=>{
      if(el.fill==='solid'){ctx.fillStyle=el.color+'18';ctx.fill();}
      else if(el.fill==='hatch'){ctx.save();ctx.clip();ctx.strokeStyle=el.color+'30';ctx.lineWidth=1;
        for(let i=-600;i<600;i+=6){ctx.beginPath();ctx.moveTo(i,-600);ctx.lineTo(i+600,0);ctx.stroke();}ctx.restore();}
    };
    switch(el.type){
      case'pen':case'eraser':{
        if(!el.pts||el.pts.length<2)break;
        if(el.type==='eraser'){ctx.globalCompositeOperation='destination-out';ctx.lineWidth=el.lw*4;}
        ctx.beginPath();ctx.moveTo(el.pts[0].x,el.pts[0].y);
        for(let i=1;i<el.pts.length-1;i++){
          const mx=(el.pts[i].x+el.pts[i+1].x)/2,my=(el.pts[i].y+el.pts[i+1].y)/2;
          ctx.quadraticCurveTo(el.pts[i].x,el.pts[i].y,mx,my);
        }
        ctx.lineTo(el.pts[el.pts.length-1].x,el.pts[el.pts.length-1].y);ctx.stroke();break;
      }
      case'line':case'arrow':{
        ctx.beginPath();ctx.moveTo(el.x1,el.y1);ctx.lineTo(el.x2,el.y2);ctx.stroke();
        if(el.type==='arrow'){const a=Math.atan2(el.y2-el.y1,el.x2-el.x1),h=14;
          ctx.beginPath();ctx.moveTo(el.x2,el.y2);
          ctx.lineTo(el.x2-h*Math.cos(a-Math.PI/6),el.y2-h*Math.sin(a-Math.PI/6));
          ctx.moveTo(el.x2,el.y2);
          ctx.lineTo(el.x2-h*Math.cos(a+Math.PI/6),el.y2-h*Math.sin(a+Math.PI/6));ctx.stroke();}
        break;
      }
      case'rect':{const x=Math.min(el.x1,el.x2),y=Math.min(el.y1,el.y2);
        ctx.beginPath();ctx.rect(x,y,Math.abs(el.x2-el.x1),Math.abs(el.y2-el.y1));doFill();ctx.stroke();break;}
      case'ellipse':{ctx.beginPath();ctx.ellipse((el.x1+el.x2)/2,(el.y1+el.y2)/2,Math.abs(el.x2-el.x1)/2,Math.abs(el.y2-el.y1)/2,0,0,Math.PI*2);doFill();ctx.stroke();break;}
      case'diamond':{const cx2=(el.x1+el.x2)/2,cy2=(el.y1+el.y2)/2,hw=Math.abs(el.x2-el.x1)/2,hh=Math.abs(el.y2-el.y1)/2;
        ctx.beginPath();ctx.moveTo(cx2,cy2-hh);ctx.lineTo(cx2+hw,cy2);ctx.lineTo(cx2,cy2+hh);ctx.lineTo(cx2-hw,cy2);ctx.closePath();doFill();ctx.stroke();break;}
      case'text':{
        const lines=(el.text||'').split('\n');const fs=el.fs||20;
        ctx.font=`${fs}px ${FONT}`;ctx.fillStyle=el.color;
        lines.forEach((line,i)=>ctx.fillText(line,el.x1,el.y1+i*fs*1.3));break;
      }
    }
    ctx.restore();
    if(sel){ctx.save();ctx.strokeStyle='#6965db';ctx.lineWidth=1.5/zoom;ctx.setLineDash([5/zoom,3/zoom]);
      let bx,by,bw,bh;
      if(el.type==='pen'||el.type==='eraser'){const xs=el.pts.map(p=>p.x),ys=el.pts.map(p=>p.y);
        bx=Math.min(...xs)-6;by=Math.min(...ys)-6;bw=Math.max(...xs)-bx+6;bh=Math.max(...ys)-by+6;
      }else if(el.type==='text'){ctx.font=`${el.fs||20}px ${FONT}`;const lines=(el.text||'').split('\n');
        const mw=Math.max(...lines.map(l=>ctx.measureText(l).width));
        bx=el.x1-4;by=el.y1-(el.fs||20);bw=mw+8;bh=lines.length*(el.fs||20)*1.3+8;
      }else{bx=Math.min(el.x1,el.x2)-4;by=Math.min(el.y1,el.y2)-4;bw=Math.abs(el.x2-el.x1)+8;bh=Math.abs(el.y2-el.y1)+8;}
      ctx.strokeRect(bx,by,bw,bh);
      ctx.fillStyle='#fff';ctx.setLineDash([]);const hs=5/zoom;
      [[bx,by],[bx+bw,by],[bx,by+bh],[bx+bw,by+bh]].forEach(([hx,hy])=>{ctx.fillRect(hx-hs/2,hy-hs/2,hs,hs);ctx.strokeRect(hx-hs/2,hy-hs/2,hs,hs);});
      ctx.restore();
    }
  },[zoom]);

  const redraw=useCallback(()=>{
    const cv=cvRef.current;if(!cv)return;const ctx=cv.getContext('2d');
    ctx.setTransform(1,0,0,1,0,0);ctx.clearRect(0,0,cv.width,cv.height);
    ctx.fillStyle='#fff';ctx.fillRect(0,0,cv.width,cv.height);
    ctx.fillStyle='#ddd';const step=20;
    for(let x=pan.x%(step*zoom);x<cv.width;x+=step*zoom)
      for(let y=pan.y%(step*zoom);y<cv.height;y+=step*zoom){ctx.beginPath();ctx.arc(x,y,0.7,0,Math.PI*2);ctx.fill();}
    ctx.save();ctx.translate(pan.x,pan.y);ctx.scale(zoom,zoom);
    const all=cur?[...els,cur]:els;
    all.forEach(el=>drawEl(ctx,el,el.id===selId));
    ctx.restore();
  },[els,cur,selId,zoom,pan,drawEl]);

  useEffect(()=>{const cv=cvRef.current;if(!cv)return;cv.width=cv.offsetWidth;cv.height=cv.offsetHeight;
    const ro=new ResizeObserver(()=>{cv.width=cv.offsetWidth;cv.height=cv.offsetHeight;redraw();});
    ro.observe(cv);return()=>ro.disconnect();},[]);
  useEffect(()=>{redraw();},[redraw]);

  useEffect(()=>{const h=e=>{
    if(['INPUT','TEXTAREA','SELECT'].includes(e.target.tagName))return;
    const t2=TOOLS.find(t=>t.key.toLowerCase()===e.key.toLowerCase());
    if(t2){setTool(t2.id);setSelId(null);}
    if((e.key==='Delete'||e.key==='Backspace')&&selId){push();setEls(p=>p.filter(el=>el.id!==selId));setSelId(null);}
    if(e.ctrlKey&&e.key==='z'){e.preventDefault();doUndo();}
    if(e.ctrlKey&&e.key==='y'){e.preventDefault();doRedo();}
    if(e.key==='F11'||e.key==='f'){if(!['INPUT','TEXTAREA'].includes(e.target.tagName))toggleFs();}
  };document.addEventListener('keydown',h);return()=>document.removeEventListener('keydown',h);},[selId,els,hist]);

  const push=()=>{setHist(h=>[...h,[...els]]);setRedo([]);};
  const doUndo=()=>{if(!hist.length)return;setRedo(r=>[...r,[...els]]);setEls(hist[hist.length-1]);setHist(h=>h.slice(0,-1));};
  const doRedo=()=>{if(!redo.length)return;setHist(h=>[...h,[...els]]);setEls(redo[redo.length-1]);setRedo(r=>r.slice(0,-1));};

  const hitTest=(el,pos)=>{const m=10;
    if(el.type==='pen'||el.type==='eraser')return el.pts?.some(p=>Math.hypot(p.x-pos.x,p.y-pos.y)<m);
    if(el.type==='text'){const lines=(el.text||'').split('\n');const fs=el.fs||20;
      return pos.x>=el.x1-m&&pos.x<=el.x1+200&&pos.y>=el.y1-fs&&pos.y<=el.y1+lines.length*fs*1.3+m;}
    const x=Math.min(el.x1,el.x2)-m,y=Math.min(el.y1,el.y2)-m;
    return pos.x>=x&&pos.x<=x+Math.abs(el.x2-el.x1)+m*2&&pos.y>=y&&pos.y<=y+Math.abs(el.y2-el.y1)+m*2;
  };

  const start=e=>{e.preventDefault();const pos=getPos(e);
    if(tool==='pan'){setPanning(true);panS.current={x:e.clientX-pan.x,y:e.clientY-pan.y};return;}
    if(tool==='select'){
      const hit=[...els].reverse().find(el=>hitTest(el,pos));
      if(hit){
        if(hit.type==='text'&&selId===hit.id){
          // Double click on already selected text = edit
          setEditText({id:hit.id,x:hit.x1,y:hit.y1,text:hit.text||'',isNew:false});setSelId(null);return;
        }
        setSelId(hit.id);setDragOff({x:pos.x-(hit.x1||0),y:pos.y-(hit.y1||0)});setDrawing(true);
      } else setSelId(null);
      return;
    }
    if(tool==='text'){setEditText({id:null,x:pos.x,y:pos.y,text:'',isNew:true});return;}
    setDrawing(true);push();
    const el={id:uid(),type:tool,color,lw,fill,dash,opacity:1};
    if(tool==='pen'||tool==='eraser')el.pts=[pos];
    else{el.x1=pos.x;el.y1=pos.y;el.x2=pos.x;el.y2=pos.y;}
    setCur(el);
  };

  const move=e=>{
    if(panning){setPan({x:e.clientX-panS.current.x,y:e.clientY-panS.current.y});return;}
    if(!drawing)return;e.preventDefault();const pos=getPos(e);
    if(tool==='select'&&selId&&dragOff){
      setEls(prev=>prev.map(el=>{if(el.id!==selId)return el;
        const dx=pos.x-dragOff.x-(el.x1||0),dy=pos.y-dragOff.y-(el.y1||0);
        if(el.type==='pen'||el.type==='eraser')return{...el,pts:el.pts.map(p=>({x:p.x+dx,y:p.y+dy}))};
        return{...el,x1:el.x1+dx,y1:el.y1+dy,x2:el.x2+dx,y2:el.y2+dy};
      }));
      const c2=els.find(e2=>e2.id===selId);if(c2)setDragOff({x:pos.x-(c2.x1||0),y:pos.y-(c2.y1||0)});
      return;
    }
    if(!cur)return;
    if(tool==='pen'||tool==='eraser')setCur(p=>({...p,pts:[...p.pts,pos]}));
    else setCur(p=>({...p,x2:pos.x,y2:pos.y}));
  };

  const end=()=>{if(cur){setEls(p=>[...p,cur]);setCur(null);}setDrawing(false);setDragOff(null);setPanning(false);};

  const commitText=(text)=>{
    if(!editText)return;
    if(editText.isNew){
      if(text.trim()){push();setEls(p=>[...p,{id:uid(),type:'text',x1:editText.x,y1:editText.y,text,color,lw,fs:20,fill:'none',opacity:1}]);}
    }else{
      push();setEls(p=>p.map(el=>el.id===editText.id?{...el,text}:el));
    }
    setEditText(null);
  };

  const toggleFs=()=>{
    if(!document.fullscreenElement){wrapRef.current?.requestFullscreen?.();setIsFs(true);}
    else{document.exitFullscreen?.();setIsFs(false);}
  };
  useEffect(()=>{const h=()=>setIsFs(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange',h);return()=>document.removeEventListener('fullscreenchange',h);},[]);

  const download=()=>{const a=document.createElement('a');a.href=cvRef.current.toDataURL('image/png');a.download='whiteboard.png';a.click();};
  const clear=()=>{push();setEls([]);setSelId(null);};
  const handleWheel=e=>{if(e.ctrlKey){e.preventDefault();setZoom(z=>Math.max(0.1,Math.min(5,z+(e.deltaY>0?-0.1:0.1))));}else setPan(p=>({x:p.x-e.deltaX,y:p.y-e.deltaY}));};

  const btnStyle=(active)=>({width:30,height:30,display:'flex',alignItems:'center',justifyContent:'center',
    border:active?'1.5px solid #6965db':'1px solid transparent',background:active?'#ececf4':'transparent',
    cursor:'pointer',fontSize:'0.75rem',color:active?'#6965db':'#666',fontWeight:600,borderRadius:6});
  const smallBtn={background:'none',border:'1px solid #ddd',padding:'3px 8px',cursor:'pointer',fontSize:'0.688rem',color:'#666',borderRadius:4};

  return (
    <ToolPageWrapper meta={meta}>
      <div ref={wrapRef} style={{display:'flex',flexDirection:'column',border:'1px solid #ddd',overflow:'hidden',background:'#fff',height:isFs?'100vh':undefined}}>
        {/* Toolbar */}
        <div style={{display:'flex',alignItems:'center',gap:4,padding:'6px 10px',background:'#f8f8f8',borderBottom:'1px solid #e5e5e5',flexWrap:'wrap',minHeight:42}}>
          {TOOLS.map(t=><button key={t.id} onClick={()=>{setTool(t.id);setSelId(null);}} title={`${t.id} (${t.key})`} style={btnStyle(tool===t.id)}>{t.icon}</button>)}
          <div style={{width:1,height:22,background:'#ddd',margin:'0 4px'}}/>
          {COLORS.map(cl=><button key={cl} onClick={()=>setColor(cl)} style={{width:18,height:18,borderRadius:4,background:cl,border:color===cl?'2.5px solid #333':cl==='#fff'?'1px solid #ccc':'1.5px solid transparent',cursor:'pointer',padding:0}}/>)}
          <div style={{width:1,height:22,background:'#ddd',margin:'0 4px'}}/>
          {SIZES.map(s=><button key={s} onClick={()=>setLw(s)} style={{...btnStyle(lw===s),width:24,height:24,border:lw===s?'1.5px solid #6965db':'1px solid #ddd',background:lw===s?'#ececf4':'#fff'}}><div style={{width:Math.min(s+1,8),height:Math.min(s+1,8),borderRadius:'50%',background:'#333'}}/></button>)}
          <div style={{width:1,height:22,background:'#ddd',margin:'0 4px'}}/>
          {FILL.map(f=><button key={f} onClick={()=>setFill(f)} style={{...btnStyle(fill===f),width:24,height:24,border:fill===f?'1.5px solid #6965db':'1px solid #ddd',background:fill===f?'#ececf4':'#fff',fontSize:'0.563rem'}}>{f==='none'?'∅':f==='solid'?'■':'▤'}</button>)}
          <button onClick={()=>setDash(!dash)} style={{...btnStyle(dash),width:24,height:24,border:dash?'1.5px solid #6965db':'1px solid #ddd',background:dash?'#ececf4':'#fff',fontSize:'0.5rem'}}>{dash?'- -':'—'}</button>
          <div style={{flex:1}}/>
          <button onClick={doUndo} disabled={!hist.length} style={smallBtn} title="Ctrl+Z">Undo</button>
          <button onClick={doRedo} disabled={!redo.length} style={smallBtn} title="Ctrl+Y">Redo</button>
          {selId&&<button onClick={()=>{push();setEls(p=>p.filter(e2=>e2.id!==selId));setSelId(null);}} style={{...smallBtn,border:'1px solid #fca5a5',color:'#dc2626'}}>Delete</button>}
          <button onClick={clear} style={smallBtn}>Clear</button>
          <button onClick={download} style={smallBtn}><Icon name="Download" size={12}/>PNG</button>
          <button onClick={toggleFs} style={smallBtn} title="Fullscreen (F)">{isFs?'Exit FS':'⛶ Full'}</button>
        </div>

        <div style={{position:'relative',flex:1}}>
          <canvas ref={cvRef}
            onMouseDown={start} onMouseMove={move} onMouseUp={end} onMouseLeave={end}
            onTouchStart={start} onTouchMove={move} onTouchEnd={end}
            onWheel={handleWheel}
            style={{width:'100%',height:isFs?'calc(100vh - 74px)':580,cursor:tool==='pan'?'grab':tool==='select'?(selId?'move':'default'):tool==='text'?'text':'crosshair',touchAction:'none',display:'block'}}/>
          {editText&&(
            <textarea autoFocus value={editText.text}
              onChange={e=>setEditText(prev=>({...prev,text:e.target.value}))}
              placeholder="Type here... (Shift+Enter for new line)"
              style={{position:'absolute',left:editText.x*zoom+pan.x,top:editText.y*zoom+pan.y-24,
                fontSize:20,fontFamily:FONT,border:'2px solid #6965db',padding:'4px 8px',
                background:'#ffffffee',color,outline:'none',zIndex:10,borderRadius:4,
                minWidth:160,minHeight:32,resize:'both',lineHeight:'1.3'}}
              onKeyDown={e=>{
                if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();commitText(editText.text);}
                if(e.key==='Escape'){setEditText(null);}
              }}
              onBlur={()=>commitText(editText.text)}/>
          )}
        </div>

        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'5px 10px',background:'#f8f8f8',borderTop:'1px solid #e5e5e5',fontSize:'0.625rem',color:'#999'}}>
          <span>{els.length} elements · {TOOLS.find(t=>t.id===tool)?.id}</span>
          <div style={{display:'flex',alignItems:'center',gap:4}}>
            <button onClick={()=>setZoom(z=>Math.max(0.1,z-0.25))} style={{...smallBtn,padding:'1px 5px',fontSize:'0.625rem'}}>−</button>
            <span style={{minWidth:36,textAlign:'center'}}>{Math.round(zoom*100)}%</span>
            <button onClick={()=>setZoom(z=>Math.min(5,z+0.25))} style={{...smallBtn,padding:'1px 5px',fontSize:'0.625rem'}}>+</button>
            <button onClick={()=>{setZoom(1);setPan({x:0,y:0});}} style={{...smallBtn,padding:'1px 5px',fontSize:'0.625rem',marginLeft:4}}>Reset</button>
          </div>
        </div>
      </div>
    </ToolPageWrapper>
  );
};
export default OnlineWhiteboard;
