import React, { useState, useEffect } from 'react';
import ToolPageWrapper from '../../components/common/ToolPageWrapper';
import { Icon } from '../../assets/icons/icons';
import meta from './meta';
const COLS = ['To Do', 'In Progress', 'Done'];
const COLORS = { 'To Do': '#3B82F6', 'In Progress': '#F59E0B', 'Done': '#10B981' };
const uid = () => Math.random().toString(36).slice(2, 8);
const load = () => { try { return JSON.parse(localStorage.getItem('kanban_data')) || { 'To Do': [{ id: uid(), text: 'Sample task' }], 'In Progress': [], 'Done': [] }; } catch { return { 'To Do': [], 'In Progress': [], 'Done': [] }; } };
const KanbanBoard = () => {
  const [data, setData] = useState(load);
  const [dragItem, setDragItem] = useState(null);
  const [dragCol, setDragCol] = useState(null);
  const [newTask, setNewTask] = useState('');
  const [addingTo, setAddingTo] = useState(null);
  useEffect(() => { localStorage.setItem('kanban_data', JSON.stringify(data)); }, [data]);
  const addTask = (col) => {
    if (!newTask.trim()) return;
    setData(d => ({ ...d, [col]: [...d[col], { id: uid(), text: newTask.trim() }] }));
    setNewTask(''); setAddingTo(null);
  };
  const removeTask = (col, id) => setData(d => ({ ...d, [col]: d[col].filter(t => t.id !== id) }));
  const onDragStart = (col, item) => { setDragItem(item); setDragCol(col); };
  const onDrop = (targetCol) => {
    if (!dragItem || dragCol === targetCol) { setDragItem(null); return; }
    setData(d => ({ ...d, [dragCol]: d[dragCol].filter(t => t.id !== dragItem.id), [targetCol]: [...d[targetCol], dragItem] }));
    setDragItem(null); setDragCol(null);
  };
  return (
    <ToolPageWrapper meta={meta}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16, minHeight: 400 }}>
        {COLS.map(col => (
          <div key={col} onDragOver={e => e.preventDefault()} onDrop={() => onDrop(col)} style={{ background: 'var(--neutral-50)', borderRadius: 12, padding: 16, border: '1px solid var(--neutral-200)', display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <h3 style={{ fontSize: '0.875rem', fontWeight: 700, color: COLORS[col] }}>{col}</h3>
              <span style={{ fontSize: '0.688rem', background: COLORS[col] + '18', color: COLORS[col], padding: '2px 8px', borderRadius: 10, fontWeight: 700 }}>{data[col].length}</span>
            </div>
            {data[col].map(task => (
              <div key={task.id} draggable onDragStart={() => onDragStart(col, task)} style={{ background: '#fff', padding: '10px 12px', borderRadius: 8, border: '1px solid var(--neutral-200)', cursor: 'grab', fontSize: '0.813rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
                <span>{task.text}</span>
                <button onClick={() => removeTask(col, task.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--neutral-400)', fontSize: '0.75rem' }}>✕</button>
              </div>
            ))}
            {addingTo === col ? (
              <div style={{ display: 'flex', gap: 4 }}><input autoFocus value={newTask} onChange={e => setNewTask(e.target.value)} onKeyDown={e => e.key === 'Enter' && addTask(col)} placeholder="Task name..." style={{ flex: 1, padding: '6px 8px', border: '1px solid var(--neutral-300)', borderRadius: 6, fontSize: '0.75rem' }} /><button onClick={() => addTask(col)} style={{ background: COLORS[col], color: '#fff', border: 'none', borderRadius: 6, padding: '4px 10px', cursor: 'pointer', fontSize: '0.75rem' }}>Add</button></div>
            ) : (
              <button onClick={() => { setAddingTo(col); setNewTask(''); }} style={{ width: '100%', padding: '8px', background: 'transparent', border: '1px dashed var(--neutral-300)', borderRadius: 8, cursor: 'pointer', fontSize: '0.75rem', color: 'var(--neutral-400)' }}>+ Add task</button>
            )}
          </div>
        ))}
      </div>
      <p style={{ fontSize: '0.75rem', color: 'var(--neutral-400)', marginTop: 12, textAlign: 'center' }}>💡 Drag tasks between columns. Data saved in browser localStorage.</p>
    </ToolPageWrapper>
  );
};
export default KanbanBoard;
