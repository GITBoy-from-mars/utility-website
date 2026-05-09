import React, { useState, useMemo } from 'react';
import ToolPageWrapper from '../../components/common/ToolPageWrapper';
import meta from './meta';
import '../loan-amortization/LoanAmortization.css';
const CsvViewer = () => {
  const [csv, setCsv] = useState('');
  const [search, setSearch] = useState('');
  const [sortCol, setSortCol] = useState(-1);
  const [sortAsc, setSortAsc] = useState(true);
  const handleFile = (e) => { const f = e.target.files[0]; if (!f) return; const r = new FileReader(); r.onload = ev => setCsv(ev.target.result); r.readAsText(f); };
  const parsed = useMemo(() => {
    if (!csv.trim()) return { headers: [], rows: [] };
    const lines = csv.trim().split('\n');
    const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''));
    const rows = lines.slice(1).map(l => l.split(',').map(c => c.trim().replace(/^"|"$/g, '')));
    return { headers, rows };
  }, [csv]);
  const filtered = useMemo(() => {
    let rows = parsed.rows;
    if (search) rows = rows.filter(r => r.some(c => c.toLowerCase().includes(search.toLowerCase())));
    if (sortCol >= 0) rows = [...rows].sort((a, b) => { const cmp = (a[sortCol] || '').localeCompare(b[sortCol] || '', undefined, { numeric: true }); return sortAsc ? cmp : -cmp; });
    return rows;
  }, [parsed.rows, search, sortCol, sortAsc]);
  const toggleSort = (i) => { if (sortCol === i) setSortAsc(!sortAsc); else { setSortCol(i); setSortAsc(true); } };
  return (
    <ToolPageWrapper meta={meta}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div style={{ display: 'flex', gap: 12 }}>
          <input type="file" accept=".csv,.tsv" onChange={handleFile} className="calc-input" />
          {parsed.headers.length > 0 && <input type="text" value={search} onChange={e => setSearch(e.target.value)} className="calc-input" placeholder="🔍 Search..." style={{ maxWidth: 200 }} />}
        </div>
        {!csv && <div className="form-group"><label>Or paste CSV data</label><textarea className="devtool-textarea" rows={6} value={csv} onChange={e => setCsv(e.target.value)} placeholder="name,age,city&#10;John,30,NYC&#10;Jane,25,London" style={{ fontFamily: 'monospace', fontSize: '0.813rem' }} /></div>}
        {parsed.headers.length > 0 && <>
          <p style={{ fontSize: '0.75rem', color: 'var(--neutral-400)' }}>{filtered.length} rows × {parsed.headers.length} columns</p>
          <div className="amort-table-wrap" style={{ maxHeight: 500, overflow: 'auto' }}>
            <table className="amort-table"><thead><tr>{parsed.headers.map((h, i) => <th key={i} onClick={() => toggleSort(i)} style={{ cursor: 'pointer', textAlign: 'left', userSelect: 'none' }}>{h} {sortCol === i ? (sortAsc ? '↑' : '↓') : ''}</th>)}</tr></thead>
              <tbody>{filtered.slice(0, 500).map((r, ri) => <tr key={ri}>{r.map((c, ci) => <td key={ci} style={{ textAlign: 'left', fontSize: '0.75rem' }}>{c}</td>)}</tr>)}</tbody>
            </table>
          </div>
        </>}
      </div>
    </ToolPageWrapper>
  );
};
export default CsvViewer;
