import React, { useState, useEffect } from 'react';
import ToolPageWrapper from '../../components/common/ToolPageWrapper';
import meta from './meta';
import '../checklist-generator/Checklist.css';
const KEY = 'utilitools_goals';
const GoalTracker = () => {
  const [goals, setGoals] = useState([]);
  const [newGoal, setNewGoal] = useState('');
  const [newTarget, setNewTarget] = useState('');
  useEffect(() => { try { const d = JSON.parse(localStorage.getItem(KEY)); if (d) setGoals(d); } catch {} }, []);
  useEffect(() => { localStorage.setItem(KEY, JSON.stringify(goals)); }, [goals]);
  const add = () => { if (newGoal.trim()) { setGoals([...goals, { name: newGoal.trim(), target: newTarget || '2026-12-31', progress: 0 }]); setNewGoal(''); setNewTarget(''); } };
  const update = (i, val) => { const c = [...goals]; c[i] = { ...c[i], progress: Math.min(100, Math.max(0, +val)) }; setGoals(c); };
  const remove = i => setGoals(goals.filter((_, idx) => idx !== i));
  return (
    <ToolPageWrapper meta={meta}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <input className="calc-input" value={newGoal} onChange={e => setNewGoal(e.target.value)} placeholder="Goal name..." style={{ flex: 2 }} />
          <input type="date" className="calc-input" value={newTarget} onChange={e => setNewTarget(e.target.value)} style={{ flex: 1 }} />
          <button onClick={add} className="btn btn-primary">Add Goal</button>
        </div>
        {goals.map((g, i) => (
          <div key={i} style={{ padding: 16, border: '1px solid var(--neutral-200)', borderRadius: 'var(--radius-md)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <strong style={{ fontSize: '0.938rem' }}>{g.name}</strong>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <small style={{ color: 'var(--neutral-400)' }}>Due: {g.target}</small>
                <button onClick={() => remove(i)} className="checklist-remove">×</button>
              </div>
            </div>
            <div className="checklist-progress" style={{ height: 20, marginBottom: 8 }}><div className="checklist-progress-bar" style={{ width: `${g.progress}%`, background: g.progress >= 100 ? '#10B981' : 'var(--primary-500)' }} /><span>{g.progress}%</span></div>
            <input type="range" min="0" max="100" value={g.progress} onChange={e => update(i, e.target.value)} className="imgconv-range" style={{ width: '100%' }} />
          </div>
        ))}
        {goals.length === 0 && <p style={{ textAlign: 'center', color: 'var(--neutral-400)', padding: 40 }}>Add your first goal to start tracking!</p>}
      </div>
    </ToolPageWrapper>
  );
};
export default GoalTracker;
