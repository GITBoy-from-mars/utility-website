import React, { useState } from 'react';
import ToolPageWrapper from '../../components/common/ToolPageWrapper';
import meta from './meta';
const YesNoDecision = () => {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState(null);
  const [deciding, setDeciding] = useState(false);
  const decide = () => {
    setDeciding(true);
    setTimeout(() => { setAnswer(Math.random() < 0.5 ? 'YES' : 'NO'); setDeciding(false); }, 800);
  };
  return (
    <ToolPageWrapper meta={meta}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24, padding: '24px 0' }}>
        <div className="form-group" style={{ width: '100%', maxWidth: 500 }}><label>Your Question (optional)</label><input type="text" value={question} onChange={e => setQuestion(e.target.value)} className="calc-input" placeholder="Should I do it?" /></div>
        <button onClick={decide} disabled={deciding} className="btn btn-primary btn-lg" style={{ minWidth: 200 }}>{deciding ? '🤔 Thinking...' : '🎱 Decide!'}</button>
        {answer && !deciding && (
          <div style={{ padding: '40px 60px', borderRadius: 'var(--radius-lg)', background: answer === 'YES' ? '#ECFDF5' : '#FEF2F2', border: `2px solid ${answer === 'YES' ? '#10B981' : '#EF4444'}`, textAlign: 'center' }}>
            <div style={{ fontSize: '3rem', fontWeight: 900, color: answer === 'YES' ? '#10B981' : '#EF4444' }}>{answer}</div>
            {question && <p style={{ marginTop: 8, color: 'var(--neutral-500)', fontSize: '0.875rem' }}>{question}</p>}
          </div>
        )}
      </div>
    </ToolPageWrapper>
  );
};
export default YesNoDecision;
