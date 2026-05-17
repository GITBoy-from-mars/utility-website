import React, { useState, useRef } from 'react';
import ToolPageWrapper from '../../components/common/ToolPageWrapper';
import meta from './meta';
import * as XLSX from 'xlsx';
import './SPSSConverter.css';

const SPSSConverter = () => {
  const [data, setData] = useState(null);       // raw 2D array
  const [headers, setHeaders] = useState([]);     // column names
  const [colInfo, setColInfo] = useState([]);     // [{col, uniques, mapping:{val:num}}]
  const [expanded, setExpanded] = useState({});   // which columns are expanded
  const [done, setDone] = useState(false);
  const fileRef = useRef(null);

  /* ---- Upload & Parse ---- */
  const handleUpload = (e) => {
    const file = e.target.files?.[0]; if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const wb = XLSX.read(new Uint8Array(ev.target.result), { type: 'array' });
      const ws = wb.Sheets[wb.SheetNames[0]];
      const raw = XLSX.utils.sheet_to_json(ws, { header: 1 });
      if (!raw.length) { alert('No data found in the file'); return; }

      const hdrs = raw[0].map((h, i) => (h != null ? String(h) : `Column ${i + 1}`));
      const rows = raw.slice(1);

      // Build column info with unique values + default alphabetical mapping
      const info = hdrs.map((col, ci) => {
        const vals = rows.map(r => r[ci]).filter(v => v != null && String(v).trim() !== '');
        const uniqueVals = [...new Set(vals.map(v => String(v).trim()))].sort();
        const mapping = {};
        uniqueVals.forEach((v, i) => { mapping[v] = i + 1; });
        return { col, index: ci, uniques: uniqueVals, mapping };
      });

      setHeaders(hdrs);
      setData(rows);
      setColInfo(info);
      setDone(false);
      setExpanded({});
    };
    reader.readAsArrayBuffer(file);
    e.target.value = '';
  };

  /* ---- Update a single mapping value ---- */
  const updateMapping = (colIdx, val, num) => {
    setColInfo(prev => {
      const n = [...prev];
      n[colIdx] = { ...n[colIdx], mapping: { ...n[colIdx].mapping, [val]: Number(num) || 0 } };
      return n;
    });
  };

  /* ---- Convert & Download ---- */
  const convert = () => {
    if (!data || !headers.length) return;

    // Build converted data
    const converted = data.map(row => {
      return headers.map((_, ci) => {
        const cellVal = row[ci] != null ? String(row[ci]).trim() : '';
        if (cellVal === '') return '';
        const info = colInfo[ci];
        if (info && info.mapping[cellVal] !== undefined) return info.mapping[cellVal];
        // If not in mapping (shouldn't happen), try to parse as number
        const num = Number(cellVal);
        return isNaN(num) ? cellVal : num;
      });
    });

    // Build notation sheet data — one row per unique value per column
    const notationRows = [['Column (Variable)', 'Original Value', 'Numeric Code']];
    colInfo.forEach(info => {
      if (info.uniques.length === 0) return;
      info.uniques.forEach(val => {
        notationRows.push([info.col, val, info.mapping[val]]);
      });
    });

    // Create workbook with 2 sheets
    const wb = XLSX.utils.book_new();
    const convertedSheet = XLSX.utils.aoa_to_sheet([headers, ...converted]);
    XLSX.utils.book_append_sheet(wb, convertedSheet, 'Converted Data');
    const notationSheet = XLSX.utils.aoa_to_sheet(notationRows);
    XLSX.utils.book_append_sheet(wb, notationSheet, 'Notation');

    XLSX.writeFile(wb, 'spss_converted_data.xlsx');
    setDone(true);
  };

  /* ---- Reset ---- */
  const reset = () => { setData(null); setHeaders([]); setColInfo([]); setDone(false); setExpanded({}); };

  const toggleExpand = (i) => setExpanded(prev => ({ ...prev, [i]: !prev[i] }));

  const totalRows = data ? data.length : 0;
  const totalCols = headers.length;
  const textCols = colInfo.filter(c => c.uniques.length > 0 && c.uniques.some(v => isNaN(Number(v)))).length;

  return (
    <ToolPageWrapper meta={meta}>
      {!data ? (
        /* Upload Zone */
        <div className="spss-upload" onClick={() => fileRef.current?.click()}>
          <div style={{ fontSize: 48 }}>📊</div>
          <h3>Upload Excel File (.xlsx)</h3>
          <p>Upload your survey or categorical data to convert text values to numeric codes</p>
          <input ref={fileRef} type="file" accept=".xlsx,.xls" onChange={handleUpload} />
        </div>
      ) : (
        /* Dashboard */
        <div className="spss-dashboard">
          <div className="spss-summary">
            <div className="spss-stat"><div className="num">{totalRows}</div><div className="lbl">Total Rows</div></div>
            <div className="spss-stat"><div className="num">{totalCols}</div><div className="lbl">Total Variables</div></div>
            <div className="spss-stat"><div className="num">{textCols}</div><div className="lbl">Text Columns</div></div>
          </div>

          <p style={{ fontSize: 13, color: '#666', marginBottom: 12 }}>
            Click any column to expand and customize the value → number mapping. Default: alphabetical order (A→1, B→2, ...).
          </p>

          <div className="spss-columns">
            {colInfo.map((info, ci) => (
              <div key={ci} className="spss-col-card">
                <div className="spss-col-header" onClick={() => toggleExpand(ci)}>
                  <h4>{expanded[ci] ? '▼' : '▶'} {info.col}</h4>
                  <span className="badge">{info.uniques.length} unique value{info.uniques.length !== 1 ? 's' : ''}</span>
                </div>
                {expanded[ci] && (
                  <div className="spss-col-body">
                    {info.uniques.length === 0 ? (
                      <p style={{ color: '#999', fontSize: 12 }}>No data in this column</p>
                    ) : (
                      info.uniques.map((val, vi) => (
                        <div key={vi} className="spss-mapping-row">
                          <div className="val">{val}</div>
                          <span className="arrow">→</span>
                          <input
                            type="number"
                            value={info.mapping[val]}
                            onChange={e => updateMapping(ci, val, e.target.value)}
                            min={0}
                          />
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="spss-actions">
            <button className="primary" onClick={convert}>🔄 Convert & Download Excel</button>
            <button className="secondary" onClick={reset}>↩ Upload Different File</button>
          </div>

          {done && (
            <div className="spss-progress">
              ✅ Conversion complete! Your file has been downloaded with 2 sheets: <strong>Converted Data</strong> + <strong>Notation</strong> (mapping reference).
            </div>
          )}
        </div>
      )}
    </ToolPageWrapper>
  );
};

export default SPSSConverter;
