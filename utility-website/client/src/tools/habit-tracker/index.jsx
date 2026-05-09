import React, { useState, useEffect } from 'react';
import ToolPageWrapper from '../../components/common/ToolPageWrapper';
import meta from './meta';
import './HabitTracker.css';
const KEY = 'utilitools_habits';
const today = () => new Date().toISOString().split('T')[0];
const last7 = () => Array.from({ length: 7 }, (_, i) => { const d = new Date(); d.setDate(d.getDate() - (6 - i)); return d.toISOString().split('T')[0]; });
const HabitTracker = () => {
  const [habits, setHabits] = useState([]);
  const [newHabit, setNewHabit] = useState('');
  useEffect(() => { try { const d = JSON.parse(localStorage.getItem(KEY)); if (d) setHabits(d); } catch {} }, []);
  useEffect(() => { localStorage.setItem(KEY, JSON.stringify(habits)); }, [habits]);
  const add = () => { if (newHabit.trim()) { setHabits([...habits, { name: newHabit.trim(), days: {} }]); setNewHabit(''); } };
  const toggle = (i, day) => { const c = [...habits]; c[i] = { ...c[i], days: { ...c[i].days, [day]: !c[i].days[day] } }; setHabits(c); };
  const remove = i => setHabits(habits.filter((_, idx) => idx !== i));
  const days = last7();
  const streak = (h) => { let s = 0; const d = new Date(); while (true) { const key = d.toISOString().split('T')[0]; if (!h.days[key]) break; s++; d.setDate(d.getDate() - 1); } return s; };
  return (
    <ToolPageWrapper meta={meta}>
      <div className="habit-tool">
        <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}><input className="calc-input" value={newHabit} onChange={e => setNewHabit(e.target.value)} onKeyDown={e => e.key === 'Enter' && add()} placeholder="Add new habit..." style={{ flex: 1 }} /><button onClick={add} className="btn btn-primary">Add</button></div>
        {habits.length > 0 && (
          <div className="habit-grid">
            <div className="habit-header"><div className="habit-name-col">Habit</div>{days.map(d => <div key={d} className="habit-day-col">{new Date(d).toLocaleDateString('en', { weekday: 'short' })}</div>)}<div className="habit-day-col">🔥</div></div>
            {habits.map((h, i) => (
              <div key={i} className="habit-row">
                <div className="habit-name-col"><span>{h.name}</span><button onClick={() => remove(i)} className="checklist-remove" title="Remove">×</button></div>
                {days.map(d => <div key={d} className="habit-day-col"><button className={`habit-check ${h.days[d] ? 'checked' : ''}`} onClick={() => toggle(i, d)}>{h.days[d] ? '✓' : ''}</button></div>)}
                <div className="habit-day-col"><span className="habit-streak">{streak(h)}</span></div>
              </div>
            ))}
          </div>
        )}
        {habits.length === 0 && <p style={{ textAlign: 'center', color: 'var(--neutral-400)', padding: 40 }}>Add your first habit to start tracking!</p>}
      </div>
    </ToolPageWrapper>
  );
};
export default HabitTracker;
