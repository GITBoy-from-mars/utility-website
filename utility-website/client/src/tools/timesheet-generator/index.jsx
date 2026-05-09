import React, { useState } from 'react';
import ToolPageWrapper from '../../components/common/ToolPageWrapper';
import { Icon } from '../../assets/icons/icons';
import meta from './meta';
import '../loan-amortization/LoanAmortization.css';
const days = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'];
const TimesheetGenerator = () => {
  const [name, setName] = useState('');
  const [week, setWeek] = useState(new Date().toISOString().split('T')[0]);
  const [rows, setRows] = useState(days.map(d => ({ day: d, start: '09:00', end: '17:00', break: 1, notes: '' })));
  const update = (i, f, v) => { const c = [...rows]; c[i] = { ...c[i], [f]: v }; setRows(c); };
  const calcHours = (r) => { const [sh, sm] = r.start.split(':').map(Number); const [eh, em] = r.end.split(':').map(Number); return Math.max(0, (eh + em / 60) - (sh + sm / 60) - r.break); };
  const total = rows.reduce((s, r) => s + calcHours(r), 0);
  const download = () => {
    const header = 'Day,Start,End,Break(hrs),Hours Worked,Notes';
    const csv = rows.map(r => `${r.day},${r.start},${r.end},${r.break},${calcHours(r).toFixed(1)},${r.notes}`).join('\n');
    const footer = `\nTotal,,,${total.toFixed(1)},`;
    const blob = new Blob([`Timesheet - ${name || 'Employee'} - Week of ${week}\n${header}\n${csv}${footer}`], { type: 'text/csv' });
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = `timesheet-${week}.csv`; a.click();
  };
  return (
    <ToolPageWrapper meta={meta}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div style={{ display: 'flex', gap: 12 }}><div className="form-group" style={{ flex: 2 }}><label>Employee Name</label><input value={name} onChange={e => setName(e.target.value)} className="calc-input" /></div><div className="form-group" style={{ flex: 1 }}><label>Week Starting</label><input type="date" value={week} onChange={e => setWeek(e.target.value)} className="calc-input" /></div></div>
        <div className="amort-table-wrap"><table className="amort-table">
          <thead><tr><th style={{ textAlign: 'left' }}>Day</th><th>Start</th><th>End</th><th>Break(h)</th><th>Hours</th><th style={{ textAlign: 'left' }}>Notes</th></tr></thead>
          <tbody>{rows.map((r, i) => <tr key={i}><td style={{ textAlign: 'left', fontWeight: 600 }}>{r.day}</td>
            <td><input type="time" value={r.start} onChange={e => update(i, 'start', e.target.value)} style={{ border: 'none', textAlign: 'center', fontSize: '0.813rem' }} /></td>
            <td><input type="time" value={r.end} onChange={e => update(i, 'end', e.target.value)} style={{ border: 'none', textAlign: 'center', fontSize: '0.813rem' }} /></td>
            <td><input type="number" step="0.5" min="0" value={r.break} onChange={e => update(i, 'break', +e.target.value)} style={{ width: 50, border: 'none', textAlign: 'center', fontSize: '0.813rem' }} /></td>
            <td style={{ fontWeight: 700 }}>{calcHours(r).toFixed(1)}</td>
            <td><input value={r.notes} onChange={e => update(i, 'notes', e.target.value)} style={{ width: '100%', border: 'none', fontSize: '0.813rem' }} /></td>
          </tr>)}</tbody>
          <tfoot><tr><td colSpan={4} style={{ textAlign: 'right', fontWeight: 700 }}>Total Hours</td><td style={{ fontWeight: 900, color: 'var(--primary-600)' }}>{total.toFixed(1)}</td><td /></tr></tfoot>
        </table></div>
        <button onClick={download} className="btn btn-primary"><Icon name="Download" size={18} />Download CSV</button>
      </div>
    </ToolPageWrapper>
  );
};
export default TimesheetGenerator;
