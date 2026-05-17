import React, { useState, useRef, useCallback, useEffect } from 'react';
import ToolPageWrapper from '../../components/common/ToolPageWrapper';
import meta from './meta';
import AnalysisModal from './AnalysisModal';
import ResultsPanel from './ResultsPanel';
import * as Stats from './statsEngine';
import * as XLSX from 'xlsx';
import './StatisticsCalculator.css';

const colLabel = i => { let s=''; while(i>=0){s=String.fromCharCode(65+(i%26))+s;i=Math.floor(i/26)-1;} return s; };

const StatisticsCalculator = () => {
  const [rows, setRows] = useState(100);
  const [cols, setCols] = useState(100);
  const [grid, setGrid] = useState(() => Array(100).fill(null).map(()=>Array(100).fill('')));
  const [results, setResults] = useState([]);
  const [activeCell, setActiveCell] = useState({ r: 0, c: 0 });
  const [modal, setModal] = useState(null);
  const [addR, setAddR] = useState(10);
  const [addC, setAddC] = useState(10);
  const [fillStart, setFillStart] = useState(null);
  const [fillEnd, setFillEnd] = useState(null);
  const fileRef = useRef(null);
  const gridRef = useRef(null);

  // Focus active cell input
  useEffect(() => {
    const input = gridRef.current?.querySelector(`[data-r="${activeCell.r}"][data-c="${activeCell.c}"]`);
    if (input) input.focus();
  }, [activeCell]);

  const updateCell = useCallback((r, c, v) => {
    setGrid(prev => { const g=[...prev]; g[r]=[...g[r]]; g[r][c]=v; return g; });
  }, []);

  const addRows = () => { const n=Number(addR)||10; setGrid(p=>[...p,...Array(n).fill(null).map(()=>Array(cols).fill(''))]); setRows(r=>r+n); };
  const addCols = () => { const n=Number(addC)||10; setGrid(p=>p.map(r=>[...r,...Array(n).fill('')])); setCols(c=>c+n); };

  // ---- Keyboard Navigation ----
  const handleKeyDown = (e, r, c) => {
    const nav = { ArrowUp: [-1,0], ArrowDown: [1,0], ArrowLeft: [0,-1], ArrowRight: [0,1] };
    if (nav[e.key]) {
      e.preventDefault();
      const [dr, dc] = nav[e.key];
      const nr = Math.max(0, Math.min(rows-1, r+dr));
      const nc = Math.max(0, Math.min(cols-1, c+dc));
      setActiveCell({ r: nr, c: nc });
    } else if (e.key === 'Enter') {
      e.preventDefault();
      setActiveCell({ r: Math.min(rows-1, r+1), c });
    } else if (e.key === 'Tab') {
      e.preventDefault();
      if (e.shiftKey) setActiveCell({ r, c: Math.max(0, c-1) });
      else setActiveCell({ r, c: Math.min(cols-1, c+1) });
    }
  };

  // ---- Excel Import (1st sheet only) ----
  const importExcel = (e) => {
    const file = e.target.files?.[0]; if(!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const wb = XLSX.read(new Uint8Array(ev.target.result), { type:'array' });
      const ws = wb.Sheets[wb.SheetNames[0]]; // Only first sheet
      const data = XLSX.utils.sheet_to_json(ws, { header:1 });
      const fR = data.length, fC = Math.max(...data.map(r=>(r||[]).length), 0);
      const newR = Math.max(rows, fR), newC = Math.max(cols, fC);
      const newGrid = Array(newR).fill(null).map((_, ri) => {
        const row = Array(newC).fill('');
        if (data[ri]) data[ri].forEach((v, ci) => { row[ci] = v ?? ''; });
        return row;
      });
      setGrid(newGrid); setRows(newR); setCols(newC);
    };
    reader.readAsArrayBuffer(file);
    e.target.value = '';
  };

  // ---- Drag-Fill ----
  const handleFillMouseDown = (e, r, c) => {
    e.preventDefault();
    setFillStart({ r, c });
    setFillEnd({ r, c });
    const onMove = (me) => {
      const el = document.elementFromPoint(me.clientX, me.clientY);
      if (el?.dataset?.r != null) setFillEnd({ r: Number(el.dataset.r), c });
    };
    const onUp = () => {
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onUp);
      setFillStart(null); setFillEnd(null);
      // Apply fill
      const startR = r, endR = Number(document.elementFromPoint(window._lastFillX || 0, window._lastFillY || 0)?.dataset?.r || r);
      if (endR > startR) {
        const val = grid[startR][c];
        setGrid(prev => {
          const g = prev.map(row => [...row]);
          for (let i = startR + 1; i <= Math.min(endR, rows - 1); i++) g[i][c] = val;
          return g;
        });
      }
    };
    document.addEventListener('mousemove', (me) => { window._lastFillX = me.clientX; window._lastFillY = me.clientY; onMove(me); });
    document.addEventListener('mouseup', onUp);
  };

  // ---- Get columns with data ----
  const getDataCols = () => {
    const result = [];
    for (let c = 0; c < cols; c++) {
      const vals = grid.map(r => r[c]).filter(v => v !== '' && v != null);
      if (vals.length > 0) {
        const header = colLabel(c);
        result.push({ index: c, header, count: vals.length });
      }
    }
    return result;
  };

  const getColNums = (ci) => grid.map(r => r[ci]).filter(v => v !== '' && v != null).map(Number).filter(v => !isNaN(v));
  const getColVals = (ci) => grid.map(r => r[ci]).filter(v => v !== '' && v != null).map(String);

  // ---- Run Analysis ----
  const runAnalysis = (params) => {
    const { type, selCols, controlCols, testValue, testVar, groupVar, groupVal1, groupVal2, depVar, indepVars, factorVar } = params;

    if (type === 'descriptive') {
      const data = selCols.map(ci => {
        const nums = getColNums(ci);
        const s = nums.length > 0 ? Stats.descriptiveStats(nums) : null;
        return s ? { label: colLabel(ci), ...s } : { label: colLabel(ci), n: 0, mean: null, stdDev: null, median: null, min: null, max: null, skewness: null, kurtosis: null };
      });
      setResults(prev => [{ title: 'Descriptive Statistics', type: 'descriptive', data }, ...prev]);
    }

    else if (type === 'pearson-corr' || type === 'spearman-corr') {
      const fn = type === 'pearson-corr' ? Stats.pearsonR : Stats.spearmanR;
      const labels = selCols.map(ci => colLabel(ci));
      const colData = selCols.map(ci => getColNums(ci));
      const matrix = selCols.map((_, i) => selCols.map((_, j) => {
        if (i === j) return { r: 1, p: 0, n: colData[i].length };
        const n = Math.min(colData[i].length, colData[j].length);
        const x = colData[i].slice(0, n), y = colData[j].slice(0, n);
        return fn(x, y);
      }));
      const title = type === 'pearson-corr' ? 'Correlations (Pearson)' : 'Correlations (Spearman)';
      setResults(prev => [{ title, type: 'correlation-matrix', data: { labels, matrix } }, ...prev]);
    }

    else if (type === 'partial-corr') {
      const labels = selCols.map(ci => colLabel(ci));
      const controlLabels = controlCols.map(ci => colLabel(ci));
      const allCols = [...new Set([...selCols, ...controlCols])];
      const n = Math.min(...allCols.map(ci => getColNums(ci).length));
      const colData = selCols.map(ci => getColNums(ci).slice(0, n));
      const ctrlData = controlCols.map(ci => getColNums(ci).slice(0, n));
      const matrix = selCols.map((_, i) => selCols.map((_, j) => {
        if (i === j) return { r: 1, p: 0, n };
        return Stats.partialCorr(colData[i], colData[j], ctrlData);
      }));
      setResults(prev => [{ title: 'Partial Correlations', type: 'partial-matrix', data: { labels, matrix, controlLabels } }, ...prev]);
    }

    else if (type === 'distance-corr') {
      const colData = selCols.map(ci => getColNums(ci));
      const n = Math.min(...colData.map(c => c.length));
      const trimmed = colData.map(c => c.slice(0, n));
      const dist = Stats.distanceMatrix(trimmed);
      setResults(prev => [{ title: 'Euclidean Distance Matrix', type: 'distance', data: { dist } }, ...prev]);
    }

    else if (type === 'one-sample-t') {
      const data = selCols.map(ci => {
        const nums = getColNums(ci);
        const res = Stats.oneSampleT(nums, testValue);
        return res ? { label: colLabel(ci), ...res } : null;
      }).filter(Boolean);
      setResults(prev => [{ title: 'One-Sample T-Test', type: 'one-sample-t', data }, ...prev]);
    }

    else if (type === 'independent-t') {
      const tv = Number(testVar), gv = Number(groupVar);
      const testNums = grid.map(r => r[tv]);
      const groupVals = grid.map(r => String(r[gv]).trim());
      const g1 = [], g2 = [];
      for (let i = 0; i < testNums.length; i++) {
        const num = Number(testNums[i]);
        if (isNaN(num) || testNums[i] === '') continue;
        if (groupVals[i] === String(groupVal1).trim()) g1.push(num);
        else if (groupVals[i] === String(groupVal2).trim()) g2.push(num);
      }
      const res = Stats.independentT(g1, g2);
      if (res) setResults(prev => [{ title: `Independent Samples T-Test (${colLabel(tv)} by ${colLabel(gv)})`, type: 'independent-t', data: res }, ...prev]);
    }

    else if (type === 'anova') {
      const dv = Number(depVar), fv = Number(factorVar);
      const depNums = grid.map(r => r[dv]);
      const factorVals = grid.map(r => String(r[fv]).trim());
      const groupMap = {};
      for (let i = 0; i < depNums.length; i++) {
        const num = Number(depNums[i]);
        if (isNaN(num) || depNums[i] === '' || !factorVals[i]) continue;
        if (!groupMap[factorVals[i]]) groupMap[factorVals[i]] = [];
        groupMap[factorVals[i]].push(num);
      }
      const labels = Object.keys(groupMap).sort();
      const groups = labels.map(l => groupMap[l]);
      if (groups.length >= 2) {
        const res = Stats.oneWayAnova(groups, labels);
        if (res) setResults(prev => [{ title: `One-Way ANOVA (${colLabel(dv)} by ${colLabel(fv)})`, type: 'anova', data: res }, ...prev]);
      }
    }

    else if (type === 'regression') {
      const dv = Number(depVar);
      const ivs = indepVars.map(Number);
      const y = getColNums(dv);
      const n = Math.min(y.length, ...ivs.map(ci => getColNums(ci).length));
      const yTrim = y.slice(0, n);
      const xTrim = ivs.map(ci => getColNums(ci).slice(0, n));
      const res = Stats.linearRegression(yTrim, xTrim, colLabel(dv), ivs.map(ci => colLabel(ci)));
      if (res) setResults(prev => [{ title: `Regression (DV: ${colLabel(dv)})`, type: 'regression', data: res }, ...prev]);
    }

    setModal(null);
  };

  // ---- Export Results to Excel (SPSS format) ----
  const exportResults = () => {
    if (!results.length) { alert('No results to export. Run an analysis first.'); return; }
    const wb = XLSX.utils.book_new();
    const grouped = {};
    results.forEach(r => {
      const key = r.type;
      if (!grouped[key]) grouped[key] = [];
      grouped[key].push(r);
    });

    Object.entries(grouped).forEach(([type, items]) => {
      const sheetData = [];
      items.forEach((item, idx) => {
        if (idx > 0) sheetData.push([]);
        sheetData.push([item.title]);
        if (type === 'descriptive') {
          sheetData.push(['Variable','N','Mean','Std.Dev','Median','Min','Max','Skewness','Kurtosis']);
          item.data.forEach(d => sheetData.push([d.label, d.n, d.mean, d.stdDev, d.median, d.min, d.max, d.skewness, d.kurtosis]));
        } else if (type === 'correlation-matrix') {
          const { labels, matrix } = item.data;
          sheetData.push(['','', ...labels]);
          labels.forEach((l, i) => {
            sheetData.push([l, 'r', ...matrix[i].map(c => c.r)]);
            sheetData.push(['', 'Sig.', ...matrix[i].map((c,j) => i===j ? '' : c.p)]);
            sheetData.push(['', 'N', ...matrix[i].map(c => c.n)]);
          });
        } else if (type === 'one-sample-t') {
          sheetData.push(['Variable','N','Mean','Std.Dev','t','df','Sig.','Mean Diff']);
          item.data.forEach(d => sheetData.push([d.label, d.n, d.mean, d.stdDev, d.t, d.df, d.p, d.meanDiff]));
        } else if (type === 'independent-t') {
          const d = item.data;
          sheetData.push(['t','df','Sig.','Mean Diff','Std.Error Diff']);
          sheetData.push([d.t, d.df, d.p, d.meanDiff, d.se]);
        } else if (type === 'anova') {
          const d = item.data;
          sheetData.push(['Source','Sum of Sq.','df','Mean Sq.','F','Sig.']);
          sheetData.push(['Between', d.ssB, d.dfB, d.msB, d.f, d.p]);
          sheetData.push(['Within', d.ssW, d.dfW, d.msW]);
          sheetData.push(['Total', d.ssT, d.dfT]);
        } else if (type === 'regression') {
          const d = item.data;
          sheetData.push(['R','R²','Adj.R²','Std.Error','F','Sig.']);
          sheetData.push([d.r, d.r2, d.adjR2, d.se, d.fStat, d.fP]);
          sheetData.push([]);
          sheetData.push(['Variable','B','Std.Error','t','Sig.']);
          d.coefficients.forEach(c => sheetData.push([c.label, c.b, c.se, c.t, c.p]));
        } else {
          sheetData.push(['(See application for detailed output)']);
        }
      });
      const name = type.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()).slice(0, 31);
      XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(sheetData), name);
    });
    XLSX.writeFile(wb, 'spss_statistics_output.xlsx');
  };

  // Visible rows for virtual scrolling (render max 200 at a time for performance)
  const visibleRows = Math.min(rows, 200);

  return (
    <ToolPageWrapper meta={meta}>
      {/* Toolbar */}
      <div className="stats-toolbar">
        <button onClick={() => fileRef.current?.click()}>📂 Import Excel</button>
        <input ref={fileRef} type="file" accept=".xlsx,.xls" onChange={importExcel} style={{display:'none'}} />
        <div className="sep"/>
        <label>Rows:</label><input type="number" value={addR} onChange={e=>setAddR(e.target.value)} min={1}/>
        <button onClick={addRows}>+ Add</button>
        <label>Cols:</label><input type="number" value={addC} onChange={e=>setAddC(e.target.value)} min={1}/>
        <button onClick={addCols}>+ Add</button>
        <div className="sep"/>
        <select value="" onChange={e => { if (e.target.value) setModal(e.target.value); e.target.selectedIndex = 0; }}>
          <option value="" disabled>▾ Analyze</option>
          <optgroup label="Descriptive">
            <option value="descriptive">Descriptive Statistics</option>
          </optgroup>
          <optgroup label="Correlate">
            <option value="pearson-corr">Bivariate — Pearson</option>
            <option value="spearman-corr">Bivariate — Spearman</option>
            <option value="partial-corr">Partial Correlation</option>
            <option value="distance-corr">Distances (Euclidean)</option>
          </optgroup>
          <optgroup label="Compare Means">
            <option value="one-sample-t">One-Sample T-Test</option>
            <option value="independent-t">Independent Samples T-Test</option>
            <option value="anova">One-Way ANOVA</option>
          </optgroup>
          <optgroup label="Regression">
            <option value="regression">Linear Regression</option>
          </optgroup>
        </select>
        <button onClick={exportResults}>Export Output</button>
        <span style={{marginLeft:'auto',fontSize:11,color:'#999'}}>{rows}×{cols}</span>
      </div>

      <div className="stats-wrap">
        {/* Spreadsheet Grid */}
        <div className="stats-grid-area" ref={gridRef}>
          <div style={{overflow:'auto',maxHeight:580}}>
            <table>
              <thead>
                <tr>
                  <th style={{minWidth:36}}></th>
                  {Array(cols).fill(0).map((_,c) => <th key={c}>{colLabel(c)}</th>)}
                </tr>
              </thead>
              <tbody>
                {grid.slice(0, visibleRows).map((row, ri) => (
                  <tr key={ri}>
                    <td className="row-hdr">{ri+1}</td>
                    {row.slice(0, cols).map((v, ci) => (
                      <td key={ci}
                        className={activeCell.r === ri && activeCell.c === ci ? 'active-cell' : ''}
                        onClick={() => setActiveCell({r:ri,c:ci})}>
                        <input
                          data-r={ri} data-c={ci}
                          value={v}
                          onChange={e => updateCell(ri, ci, e.target.value)}
                          onKeyDown={e => handleKeyDown(e, ri, ci)}
                          onFocus={() => setActiveCell({r:ri,c:ci})}
                        />
                        {activeCell.r === ri && activeCell.c === ci && (
                          <div className="fill-handle" onMouseDown={e => handleFillMouseDown(e, ri, ci)} />
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Results Panel */}
        <ResultsPanel results={results} onClear={() => setResults([])} />
      </div>

      {/* Analysis Modal */}
      {modal && (
        <AnalysisModal
          testType={modal}
          dataCols={getDataCols()}
          onRun={runAnalysis}
          onClose={() => setModal(null)}
        />
      )}
    </ToolPageWrapper>
  );
};

export default StatisticsCalculator;
