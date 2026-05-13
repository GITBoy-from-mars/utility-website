import React, { useState, useEffect } from 'react';
import ToolPageWrapper from '../../components/common/ToolPageWrapper';
import { Icon } from '../../assets/icons/icons';
import meta from './meta';

const DEFAULT_COLORS = ['#3B82F6', '#F59E0B', '#10B981', '#8B5CF6', '#EF4444', '#EC4899', '#0EA5E9', '#F97316'];
const uid = () => Math.random().toString(36).slice(2, 8);

const defaultData = () => ({
  columns: [
    { id: uid(), name: 'To Do', color: '#3B82F6' },
    { id: uid(), name: 'In Progress', color: '#F59E0B' },
    { id: uid(), name: 'Done', color: '#10B981' },
  ],
  tasks: {},
});

const load = () => {
  try {
    const d = JSON.parse(localStorage.getItem('kanban_v2'));
    if (d && d.columns && d.tasks) return d;
  } catch {}
  const d = defaultData();
  d.tasks = { [d.columns[0].id]: [{ id: uid(), text: 'Sample task' }] };
  d.columns.forEach(c => { if (!d.tasks[c.id]) d.tasks[c.id] = []; });
  return d;
};

const KanbanBoard = () => {
  const [data, setData] = useState(load);
  const [dragItem, setDragItem] = useState(null);
  const [dragCol, setDragCol] = useState(null);
  const [newTask, setNewTask] = useState('');
  const [addingTo, setAddingTo] = useState(null);
  const [editingCol, setEditingCol] = useState(null);
  const [editColName, setEditColName] = useState('');
  const [addingColumn, setAddingColumn] = useState(false);
  const [newColName, setNewColName] = useState('');

  useEffect(() => { localStorage.setItem('kanban_v2', JSON.stringify(data)); }, [data]);

  // Column operations
  const addColumn = () => {
    if (!newColName.trim()) return;
    const id = uid();
    const color = DEFAULT_COLORS[data.columns.length % DEFAULT_COLORS.length];
    setData(d => ({
      ...d,
      columns: [...d.columns, { id, name: newColName.trim(), color }],
      tasks: { ...d.tasks, [id]: [] },
    }));
    setNewColName('');
    setAddingColumn(false);
  };

  const renameColumn = (colId) => {
    if (!editColName.trim()) { setEditingCol(null); return; }
    setData(d => ({
      ...d,
      columns: d.columns.map(c => c.id === colId ? { ...c, name: editColName.trim() } : c),
    }));
    setEditingCol(null);
  };

  const deleteColumn = (colId) => {
    if (data.columns.length <= 1) return;
    setData(d => {
      const newTasks = { ...d.tasks };
      delete newTasks[colId];
      return { columns: d.columns.filter(c => c.id !== colId), tasks: newTasks };
    });
  };

  const changeColumnColor = (colId, color) => {
    setData(d => ({
      ...d,
      columns: d.columns.map(c => c.id === colId ? { ...c, color } : c),
    }));
  };

  // Task operations
  const addTask = (colId) => {
    if (!newTask.trim()) return;
    setData(d => ({
      ...d,
      tasks: { ...d.tasks, [colId]: [...(d.tasks[colId] || []), { id: uid(), text: newTask.trim() }] },
    }));
    setNewTask('');
    setAddingTo(null);
  };

  const removeTask = (colId, taskId) => {
    setData(d => ({
      ...d,
      tasks: { ...d.tasks, [colId]: d.tasks[colId].filter(t => t.id !== taskId) },
    }));
  };

  // Drag and drop
  const onDragStart = (colId, item) => { setDragItem(item); setDragCol(colId); };
  const onDrop = (targetColId) => {
    if (!dragItem || dragCol === targetColId) { setDragItem(null); return; }
    setData(d => ({
      ...d,
      tasks: {
        ...d.tasks,
        [dragCol]: d.tasks[dragCol].filter(t => t.id !== dragItem.id),
        [targetColId]: [...(d.tasks[targetColId] || []), dragItem],
      },
    }));
    setDragItem(null);
    setDragCol(null);
  };

  const colCount = data.columns.length;

  return (
    <ToolPageWrapper meta={meta}>
      <div style={{ overflowX: 'auto', paddingBottom: 16 }}>
        <div style={{ display: 'grid', gridTemplateColumns: `repeat(${colCount}, minmax(240px, 1fr))`, gap: 12, minHeight: 400 }}>
          {data.columns.map(col => {
            const tasks = data.tasks[col.id] || [];
            return (
              <div key={col.id} onDragOver={e => e.preventDefault()} onDrop={() => onDrop(col.id)}
                style={{ background: 'var(--neutral-50)', borderRadius: 12, padding: 14, border: '1px solid var(--neutral-200)', display: 'flex', flexDirection: 'column', gap: 8 }}>
                {/* Column header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                  {editingCol === col.id ? (
                    <input autoFocus value={editColName} onChange={e => setEditColName(e.target.value)}
                      onKeyDown={e => { if (e.key === 'Enter') renameColumn(col.id); if (e.key === 'Escape') setEditingCol(null); }}
                      onBlur={() => renameColumn(col.id)}
                      style={{ fontSize: '0.875rem', fontWeight: 700, border: '1px solid var(--neutral-300)', borderRadius: 4, padding: '2px 6px', width: '100%', color: col.color }}
                    />
                  ) : (
                    <h3 onDoubleClick={() => { setEditingCol(col.id); setEditColName(col.name); }}
                      style={{ fontSize: '0.875rem', fontWeight: 700, color: col.color, cursor: 'pointer' }} title="Double-click to rename">
                      {col.name}
                    </h3>
                  )}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <span style={{ fontSize: '0.688rem', background: col.color + '18', color: col.color, padding: '2px 8px', borderRadius: 10, fontWeight: 700 }}>{tasks.length}</span>
                    {data.columns.length > 1 && (
                      <button onClick={() => deleteColumn(col.id)} title="Delete column"
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--neutral-400)', fontSize: '0.75rem', padding: '2px' }}>
                        <Icon name="X" size={12} />
                      </button>
                    )}
                  </div>
                </div>

                {/* Color picker row */}
                <div style={{ display: 'flex', gap: 3, marginBottom: 4 }}>
                  {DEFAULT_COLORS.map(c => (
                    <button key={c} onClick={() => changeColumnColor(col.id, c)}
                      style={{ width: 14, height: 14, borderRadius: '50%', background: c, border: col.color === c ? '2px solid var(--neutral-800)' : '1px solid var(--neutral-200)', cursor: 'pointer', padding: 0 }} />
                  ))}
                </div>

                {/* Tasks */}
                {tasks.map(task => (
                  <div key={task.id} draggable onDragStart={() => onDragStart(col.id, task)}
                    style={{ background: '#fff', padding: '10px 12px', borderRadius: 8, border: '1px solid var(--neutral-200)', cursor: 'grab', fontSize: '0.813rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
                    <span>{task.text}</span>
                    <button onClick={() => removeTask(col.id, task.id)}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--neutral-400)', fontSize: '0.75rem' }}>
                      <Icon name="X" size={12} />
                    </button>
                  </div>
                ))}

                {/* Add task */}
                {addingTo === col.id ? (
                  <div style={{ display: 'flex', gap: 4 }}>
                    <input autoFocus value={newTask} onChange={e => setNewTask(e.target.value)}
                      onKeyDown={e => { if (e.key === 'Enter') addTask(col.id); if (e.key === 'Escape') setAddingTo(null); }}
                      placeholder="Task name..." style={{ flex: 1, padding: '6px 8px', border: '1px solid var(--neutral-300)', borderRadius: 6, fontSize: '0.75rem' }} />
                    <button onClick={() => addTask(col.id)}
                      style={{ background: col.color, color: '#fff', border: 'none', borderRadius: 6, padding: '4px 10px', cursor: 'pointer', fontSize: '0.75rem' }}>Add</button>
                  </div>
                ) : (
                  <button onClick={() => { setAddingTo(col.id); setNewTask(''); }}
                    style={{ width: '100%', padding: '8px', background: 'transparent', border: '1px dashed var(--neutral-300)', borderRadius: 8, cursor: 'pointer', fontSize: '0.75rem', color: 'var(--neutral-400)' }}>
                    + Add task
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Add column button */}
      <div style={{ marginTop: 12, display: 'flex', gap: 8, alignItems: 'center' }}>
        {addingColumn ? (
          <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
            <input autoFocus value={newColName} onChange={e => setNewColName(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') addColumn(); if (e.key === 'Escape') setAddingColumn(false); }}
              placeholder="Column name..." style={{ padding: '6px 10px', border: '1px solid var(--neutral-300)', borderRadius: 6, fontSize: '0.813rem' }} />
            <button onClick={addColumn} className="btn btn-primary btn-sm">Add</button>
            <button onClick={() => setAddingColumn(false)} className="btn btn-ghost btn-sm">Cancel</button>
          </div>
        ) : (
          <button onClick={() => { setAddingColumn(true); setNewColName(''); }} className="btn btn-ghost btn-sm">+ Add Column</button>
        )}
      </div>

      <p style={{ fontSize: '0.75rem', color: 'var(--neutral-400)', marginTop: 12, textAlign: 'center' }}>
        Drag tasks between columns. Double-click column names to rename. Data saved in browser localStorage.
      </p>
    </ToolPageWrapper>
  );
};
export default KanbanBoard;
