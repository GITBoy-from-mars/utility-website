import React, { useState, useEffect, useRef } from 'react';
import ToolPageWrapper from '../../components/common/ToolPageWrapper';
import meta from './meta';
const playBell = () => { try { const ctx = new AudioContext(); [523, 659, 784].forEach((f, i) => { const o = ctx.createOscillator(), g = ctx.createGain(); o.frequency.value = f; o.type = 'sine'; g.gain.setValueAtTime(0.15, ctx.currentTime + i * 0.2); g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.2 + 0.4); o.connect(g); g.connect(ctx.destination); o.start(ctx.currentTime + i * 0.2); o.stop(ctx.currentTime + i * 0.2 + 0.4); }); setTimeout(() => ctx.close(), 2000); } catch {} };
const StudyTimer = () => {
  const [workMin, setWorkMin] = useState(25);
  const [breakMin, setBreakMin] = useState(5);
  const [seconds, setSeconds] = useState(25 * 60);
  const [running, setRunning] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const [sessions, setSessions] = useState(0);
  const timerRef = useRef(null);
  useEffect(() => { if (!running) return; timerRef.current = setInterval(() => setSeconds(s => { if (s <= 1) { playBell(); return 0; } return s - 1; }), 1000); return () => clearInterval(timerRef.current); }, [running]);
  useEffect(() => { if (seconds === 0 && running) { setRunning(false); if (!isBreak) { setSessions(s => s + 1); setIsBreak(true); setSeconds(breakMin * 60); } else { setIsBreak(false); setSeconds(workMin * 60); } } }, [seconds, running, isBreak, workMin, breakMin]);
  const reset = () => { setRunning(false); setIsBreak(false); setSeconds(workMin * 60); };
  const pct = isBreak ? ((breakMin * 60 - seconds) / (breakMin * 60)) * 100 : ((workMin * 60 - seconds) / (workMin * 60)) * 100;
  const min = Math.floor(seconds / 60), sec = seconds % 60;
  return (
    <ToolPageWrapper meta={meta}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24, padding: 30 }}>
        <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
          <div className="form-group" style={{ width: 100 }}><label style={{ fontSize: '0.688rem' }}>Work (min)</label><input type="number" value={workMin} onChange={e => { setWorkMin(+e.target.value); if (!running && !isBreak) setSeconds(+e.target.value * 60); }} className="calc-input" style={{ textAlign: 'center' }} disabled={running} /></div>
          <div className="form-group" style={{ width: 100 }}><label style={{ fontSize: '0.688rem' }}>Break (min)</label><input type="number" value={breakMin} onChange={e => { setBreakMin(+e.target.value); if (!running && isBreak) setSeconds(+e.target.value * 60); }} className="calc-input" style={{ textAlign: 'center' }} disabled={running} /></div>
        </div>
        <div style={{ width: 220, height: 220, borderRadius: '50%', background: `conic-gradient(${isBreak ? '#10B981' : '#3B82F6'} ${pct}%, var(--neutral-100) ${pct}%)`, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.3s' }}>
          <div style={{ width: 190, height: 190, borderRadius: '50%', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
            <span style={{ fontSize: '0.688rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, color: isBreak ? '#10B981' : '#3B82F6' }}>{isBreak ? '☕ Break' : '📚 Focus'}</span>
            <span style={{ fontSize: '3rem', fontWeight: 800, fontFamily: 'monospace', color: 'var(--neutral-800)' }}>{min.toString().padStart(2, '0')}:{sec.toString().padStart(2, '0')}</span>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={() => setRunning(!running)} className="btn btn-primary btn-lg" style={{ minWidth: 140 }}>{running ? '⏸ Pause' : '▶️ Start'}</button>
          <button onClick={reset} className="btn btn-ghost btn-lg">🔄 Reset</button>
        </div>
        <p style={{ fontSize: '0.875rem', color: 'var(--neutral-400)' }}>Sessions completed: <strong>{sessions}</strong></p>
      </div>
    </ToolPageWrapper>
  );
};
export default StudyTimer;
