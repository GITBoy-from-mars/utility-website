import React, { useState, useRef, useCallback } from 'react';
import ToolPageWrapper from '../../components/common/ToolPageWrapper';
import meta from './meta';
import * as XLSX from 'xlsx';
import './StatisticsCalculator.css';

const colLabel = i => { let s=''; while(i>=0){s=String.fromCharCode(65+(i%26))+s;i=Math.floor(i/26)-1;} return s; };

/* ---- Pure JS Stats Functions ---- */
const toNums = arr => arr.map(Number).filter(v => !isNaN(v) && v !== '');
const calcMean = nums => nums.length ? +(nums.reduce((a,b)=>a+b,0)/nums.length).toFixed(4) : null;
const calcMedian = nums => { if(!nums.length) return null; const s=[...nums].sort((a,b)=>a-b); const m=Math.floor(s.length/2); return s.length%2 ? +s[m].toFixed(4) : +((s[m-1]+s[m])/2).toFixed(4); };
const calcMode = nums => { if(!nums.length) return null; const freq={}; nums.forEach(v=>{freq[v]=(freq[v]||0)+1;}); const max=Math.max(...Object.values(freq)); const modes=Object.keys(freq).filter(k=>freq[k]===max).map(Number); return modes; };
const calcCorrelation = (x,y) => { const n=Math.min(x.length,y.length); if(n<2)return null; const mx=calcMean(x.slice(0,n)),my=calcMean(y.slice(0,n)); let num=0,dx=0,dy=0; for(let i=0;i<n;i++){const a=x[i]-mx,b=y[i]-my;num+=a*b;dx+=a*a;dy+=b*b;} return dx&&dy? +(num/Math.sqrt(dx*dy)).toFixed(4):null; };

const StatisticsCalculator = () => {
  const [rows, setRows] = useState(100);
  const [cols, setCols] = useState(100);
  const [grid, setGrid] = useState(() => Array(100).fill(null).map(()=>Array(100).fill('')));
  const [results, setResults] = useState([]);
  const [showModal, setShowModal] = useState(null); // {type:'mean'|'median'|'mode'|'correlation'}
  const [selCols, setSelCols] = useState([]);
  const [addR, setAddR] = useState(10);
  const [addC, setAddC] = useState(10);
  const fileRef = useRef(null);

  const updateCell = useCallback((r,c,v) => {
    setGrid(prev => { const g=[...prev]; g[r]=[...g[r]]; g[r][c]=v; return g; });
  }, []);

  const addRows = () => { const n=Number(addR)||10; setGrid(p=>[...p,...Array(n).fill(null).map(()=>Array(cols).fill(''))]); setRows(r=>r+n); };
  const addCols = () => { const n=Number(addC)||10; setGrid(p=>p.map(r=>[...r,...Array(n).fill('')])); setCols(c=>c+n); };

  const importExcel = (e) => {
    const file = e.target.files?.[0]; if(!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const wb = XLSX.read(new Uint8Array(ev.target.result), {type:'array'});
      const ws = wb.Sheets[wb.SheetNames[0]];
      const data = XLSX.utils.sheet_to_json(ws, {header:1});
      const fR = data.length, fC = Math.max(...data.map(r=>(r||[]).length),0);
      const newR = Math.max(rows, fR), newC = Math.max(cols, fC);
      const newGrid = Array(newR).fill(null).map((_,ri) => {
        const row = Array(newC).fill('');
        if(data[ri]) data[ri].forEach((v,ci) => { row[ci] = v ?? ''; });
        return row;
      });
      setGrid(newGrid); setRows(newR); setCols(newC);
    };
    reader.readAsArrayBuffer(file);
    e.target.value = '';
  };

  const getColData = (ci) => grid.map(r => r[ci]).filter(v => v !== '' && v !== null && v !== undefined);

  const runAnalysis = () => {
    if(!showModal || !selCols.length) return;
    const type = showModal;
    const newResults = [];
    if(type === 'correlation') {
      if(selCols.length < 2) { alert('Select at least 2 columns for correlation'); return; }
      const header = ['', ...selCols.map(c=>colLabel(c))];
      const matrix = selCols.map(i => {
        const xi = toNums(getColData(i));
        return selCols.map(j => { const yj = toNums(getColData(j)); return calcCorrelation(xi,yj); });
      });
      newResults.push({ type:'Correlation Matrix', header, matrix, cols: selCols.map(c=>colLabel(c)) });
    } else {
      selCols.forEach(ci => {
        const nums = toNums(getColData(ci));
        const label = colLabel(ci);
        const r = { col: label, n: nums.length, missing: getColData(ci).length - nums.length };
        if(type==='mean') r.value = calcMean(nums);
        else if(type==='median') r.value = calcMedian(nums);
        else if(type==='mode') r.value = calcMode(nums);
        r.type = type.charAt(0).toUpperCase()+type.slice(1);
        newResults.push(r);
      });
    }
    setResults(prev => [...newResults, ...prev]);
    setShowModal(null); setSelCols([]);
  };

  const exportResults = () => {
    if(!results.length) { alert('No results to export'); return; }
    const wb = XLSX.utils.book_new();
    const data = [['Type','Column','Value','N','Missing']];
    results.forEach(r => {
      if(r.matrix) { /* skip correlation matrices in simple export */ } 
      else data.push([r.type, r.col, Array.isArray(r.value)?r.value.join(', '):r.value, r.n, r.missing]);
    });
    XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(data), 'Results');
    XLSX.writeFile(wb, 'statistics_results.xlsx');
  };

  return (
    <ToolPageWrapper meta={meta}>
      {/* Toolbar */}
      <div className="stats-toolbar">
        <button onClick={()=>fileRef.current?.click()}>📂 Import Excel</button>
        <input ref={fileRef} type="file" accept=".xlsx,.xls" onChange={importExcel} style={{display:'none'}} />
        <div className="sep"/>
        <label>Rows:</label><input type="number" value={addR} onChange={e=>setAddR(e.target.value)} min={1}/>
        <button onClick={addRows}>+ Add Rows</button>
        <label>Cols:</label><input type="number" value={addC} onChange={e=>setAddC(e.target.value)} min={1}/>
        <button onClick={addCols}>+ Add Cols</button>
        <div className="sep"/>
        <select defaultValue="" onChange={e=>{if(e.target.value){setShowModal(e.target.value);setSelCols([]);}e.target.value='';}}>
          <option value="" disabled>▾ Analysis</option>
          <option value="mean">Mean</option>
          <option value="median">Median</option>
          <option value="mode">Mode</option>
          <option value="correlation">Correlation</option>
        </select>
        <button onClick={exportResults}>📥 Export Results</button>
        <span style={{marginLeft:'auto',fontSize:11,color:'#999'}}>{rows}×{cols} grid</span>
      </div>

      <div className="stats-wrap">
        {/* Spreadsheet Grid */}
        <div className="stats-grid-area">
          <div style={{overflow:'auto',maxHeight:560}}>
            <table>
              <thead><tr><th style={{minWidth:36}}></th>{Array(cols).fill(0).map((_,c)=><th key={c}>{colLabel(c)}</th>)}</tr></thead>
              <tbody>
                {grid.slice(0,rows).map((row,ri) => (
                  <tr key={ri}>
                    <td className="row-hdr">{ri+1}</td>
                    {row.slice(0,cols).map((v,ci) => (
                      <td key={ci}><input value={v} onChange={e=>updateCell(ri,ci,e.target.value)} /></td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Results Panel */}
        <div className="stats-results">
          <h3>📊 Results</h3>
          {results.length === 0 && <p style={{color:'#999',fontSize:12}}>Run an analysis to see results here.</p>}
          {results.map((r,i) => r.matrix ? (
            <div key={i} className="stats-result-block" style={{overflowX:'auto'}}>
              <strong>Correlation Matrix</strong>
              <table style={{width:'100%',marginTop:8,fontSize:11,borderCollapse:'collapse'}}>
                <thead><tr><th></th>{r.cols.map(c=><th key={c} style={{padding:'3px 6px',background:'#f0f4f8'}}>{c}</th>)}</tr></thead>
                <tbody>{r.matrix.map((row,ri)=>(
                  <tr key={ri}><td style={{fontWeight:600,padding:'3px 6px',background:'#f7f8fa'}}>{r.cols[ri]}</td>
                    {row.map((v,ci)=><td key={ci} style={{padding:'3px 6px',textAlign:'center',background:v===1?'#e8f5e9':Math.abs(v)>.7?'#fff3e0':'transparent'}}>{v??'—'}</td>)}
                  </tr>
                ))}</tbody>
              </table>
            </div>
          ) : (
            <div key={i} className="stats-result-block">
              <strong>{r.type} — Column {r.col}</strong><br/>
              <strong>Value:</strong> {Array.isArray(r.value)?r.value.join(', '):(r.value??'N/A')}<br/>
              <strong>N:</strong> {r.n} {r.missing>0 && <span style={{color:'#e65100'}}>({r.missing} missing)</span>}
            </div>
          ))}
        </div>
      </div>

      {/* Column Selection Modal */}
      {showModal && (
        <div className="stats-col-modal" onClick={()=>setShowModal(null)}>
          <div className="stats-col-modal-box" onClick={e=>e.stopPropagation()}>
            <h3>Select Columns for {showModal.charAt(0).toUpperCase()+showModal.slice(1)}</h3>
            <div style={{maxHeight:300,overflowY:'auto'}}>
              {Array(cols).fill(0).map((_,ci) => {
                const hasData = grid.some(r=>r[ci]!==''&&r[ci]!==null);
                if(!hasData) return null;
                return <label key={ci}><input type="checkbox" checked={selCols.includes(ci)} onChange={e=>{
                  setSelCols(prev=>e.target.checked?[...prev,ci]:prev.filter(x=>x!==ci));
                }}/> Column {colLabel(ci)}</label>;
              })}
            </div>
            <div className="actions">
              <button onClick={()=>setShowModal(null)}>Cancel</button>
              <button className="primary" onClick={runAnalysis}>Run Analysis</button>
            </div>
          </div>
        </div>
      )}
    </ToolPageWrapper>
  );
};
export default StatisticsCalculator;
