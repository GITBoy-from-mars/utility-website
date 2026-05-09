import React, { useState, useEffect, useRef, useCallback } from 'react';
import ToolPageWrapper from '../../components/common/ToolPageWrapper';
import meta from './meta';
import '../emi-calculator/EmiCalculator.css';
const TEXTS = [
  'The quick brown fox jumps over the lazy dog. Practice makes perfect when you type every day. Speed and accuracy go hand in hand for professional typists.',
  'Programming is the art of telling computers what to do. Every line of code should be written with clarity and purpose. Good code is its own best documentation.',
  'Technology has transformed the way we communicate and work. From smartphones to artificial intelligence, innovation drives progress in every industry worldwide.',
  'Success is not final and failure is not fatal. It is the courage to continue that counts. Every expert was once a beginner who never gave up trying.',
];
const TypingSpeedTest = () => {
  const [textIdx, setTextIdx] = useState(0);
  const [input, setInput] = useState('');
  const [started, setStarted] = useState(false);
  const [finished, setFinished] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [elapsed, setElapsed] = useState(0);
  const timerRef = useRef(null);
  const inputRef = useRef(null);
  const targetText = TEXTS[textIdx];

  const reset = useCallback(() => {
    setInput(''); setStarted(false); setFinished(false); setStartTime(null); setElapsed(0);
    clearInterval(timerRef.current);
    setTextIdx(Math.floor(Math.random() * TEXTS.length));
    setTimeout(() => inputRef.current?.focus(), 100);
  }, []);

  useEffect(() => { return () => clearInterval(timerRef.current); }, []);

  const handleChange = (e) => {
    const val = e.target.value;
    if (!started) {
      setStarted(true);
      setStartTime(Date.now());
      timerRef.current = setInterval(() => setElapsed(Date.now()), 100);
    }
    setInput(val);
    if (val.length >= targetText.length) {
      setFinished(true);
      clearInterval(timerRef.current);
      setElapsed(Date.now());
    }
  };

  const seconds = started ? Math.max(1, ((finished ? elapsed : Date.now()) - startTime) / 1000) : 0;
  const words = input.trim().split(/\s+/).filter(Boolean).length;
  const wpm = seconds > 0 ? Math.round((words / seconds) * 60) : 0;
  const correct = input.split('').filter((c, i) => c === targetText[i]).length;
  const accuracy = input.length > 0 ? Math.round((correct / input.length) * 100) : 100;

  return (
    <ToolPageWrapper meta={meta}>
      <div className="calc-tool">
        {!finished && (
          <div style={{ padding: '20px 24px', background: 'var(--neutral-50)', borderRadius: 10, border: '1px solid var(--neutral-200)', fontSize: '1.125rem', lineHeight: 1.9, fontFamily: 'Georgia, serif', userSelect: 'none' }}>
            {targetText.split('').map((c, i) => {
              let color = 'var(--neutral-400)';
              if (i < input.length) color = input[i] === c ? '#10B981' : '#EF4444';
              const bg = i < input.length && input[i] !== c ? '#FEF2F2' : 'transparent';
              const underline = i === input.length ? '2px solid var(--primary-500)' : 'none';
              return <span key={i} style={{ color, background: bg, borderBottom: underline }}>{c}</span>;
            })}
          </div>
        )}
        {!finished && (
          <textarea ref={inputRef} value={input} onChange={handleChange} autoFocus rows={3} placeholder={started ? '' : '⌨️ Start typing above text here...'} style={{ width: '100%', padding: 16, border: '2px solid var(--primary-200)', borderRadius: 8, fontSize: '1rem', fontFamily: 'monospace', outline: 'none', resize: 'none' }} />
        )}
        <div className="calc-results" style={{ gridTemplateColumns: 'repeat(4,1fr)' }}>
          <div className="calc-result-card calc-result-primary"><span className="calc-result-label">WPM</span><span className="calc-result-value">{wpm}</span></div>
          <div className="calc-result-card"><span className="calc-result-label">Accuracy</span><span className="calc-result-value">{accuracy}%</span></div>
          <div className="calc-result-card"><span className="calc-result-label">Time</span><span className="calc-result-value">{Math.round(seconds)}s</span></div>
          <div className="calc-result-card"><span className="calc-result-label">Characters</span><span className="calc-result-value">{input.length}/{targetText.length}</span></div>
        </div>
        {finished && (
          <div style={{ textAlign: 'center' }}>
            <p style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: 12 }}>
              {wpm >= 80 ? '🏆 Excellent!' : wpm >= 50 ? '👏 Great job!' : wpm >= 30 ? '👍 Not bad!' : '💪 Keep practicing!'}
            </p>
            <button onClick={reset} className="btn btn-primary btn-lg">Try Again</button>
          </div>
        )}
        {!finished && started && <button onClick={reset} className="btn btn-ghost btn-sm" style={{ alignSelf: 'center' }}>Reset</button>}
      </div>
    </ToolPageWrapper>
  );
};
export default TypingSpeedTest;
