import React, { useState } from 'react';
import ToolPageWrapper from '../../components/common/ToolPageWrapper';
import meta from './meta';
import './PriorityMatrix.css';
const quads = [
  { id: 'do', title: 'Do First', subtitle: 'Urgent & Important', color: '#EF4444', bg: '#FEF2F2' },
  { id: 'schedule', title: 'Schedule', subtitle: 'Important, Not Urgent', color: '#3B82F6', bg: '#EFF6FF' },
  { id: 'delegate', title: 'Delegate', subtitle: 'Urgent, Not Important', color: '#F59E0B', bg: '#FFFBEB' },
  { id: 'eliminate', title: 'Eliminate', subtitle: 'Not Urgent, Not Important', color: '#6B7280', bg: '#F9FAFB' },
];
const PriorityMatrix = () => {
  const [tasks, setTasks] = useState({ do: [], schedule: [], delegate: [], eliminate: [] });
  const [inputs, setInputs] = useState({ do: '', schedule: '', delegate: '', eliminate: '' });
  const add = (qid) => { if (inputs[qid].trim()) { setTasks({ ...tasks, [qid]: [...tasks[qid], inputs[qid].trim()] }); setInputs({ ...inputs, [qid]: '' }); } };
  const remove = (qid, i) => { const c = { ...tasks }; c[qid] = c[qid].filter((_, idx) => idx !== i); setTasks(c); };
  return (
    <ToolPageWrapper meta={meta}>
      <div className="matrix-grid">
        {quads.map(q => (
          <div key={q.id} className="matrix-quad" style={{ background: q.bg, borderColor: q.color }}>
            <div className="matrix-quad-header" style={{ color: q.color }}><strong>{q.title}</strong><small>{q.subtitle}</small></div>
            <div className="matrix-items">{tasks[q.id].map((t, i) => <div key={i} className="matrix-item"><span>{t}</span><button onClick={() => remove(q.id, i)} className="checklist-remove">×</button></div>)}</div>
            <div style={{ display: 'flex', gap: 6, marginTop: 'auto' }}><input className="calc-input" style={{ fontSize: '0.813rem', padding: '8px 10px' }} value={inputs[q.id]} onChange={e => setInputs({ ...inputs, [q.id]: e.target.value })} onKeyDown={e => e.key === 'Enter' && add(q.id)} placeholder="Add task..." /><button onClick={() => add(q.id)} className="btn btn-ghost btn-sm" style={{ color: q.color }}>+</button></div>
          </div>
        ))}
      </div>
    </ToolPageWrapper>
  );
};
export default PriorityMatrix;
