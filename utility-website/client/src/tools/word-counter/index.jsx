import React, { useState } from 'react';
import ToolPageWrapper from '../../components/common/ToolPageWrapper';
import meta from './meta';
import '../emi-calculator/EmiCalculator.css';
const WordCounter = () => {
  const [text, setText] = useState('');
  const words = text.trim() ? text.trim().split(/\s+/).length : 0;
  const chars = text.length;
  const charsNoSpace = text.replace(/\s/g, '').length;
  const sentences = text.split(/[.!?]+/).filter(s => s.trim()).length;
  const paragraphs = text.split(/\n\s*\n/).filter(p => p.trim()).length || (text.trim() ? 1 : 0);
  const readTime = Math.max(1, Math.ceil(words / 200));
  const speakTime = Math.max(1, Math.ceil(words / 130));
  return (
    <ToolPageWrapper meta={meta}>
      <div className="calc-tool">
        <div className="form-group"><label>Type or paste your text</label><textarea className="devtool-textarea" rows={10} value={text} onChange={e => setText(e.target.value)} placeholder="Start typing or paste your text here..." style={{ fontSize: '1rem', lineHeight: 1.7 }} /></div>
        <div className="calc-results" style={{ gridTemplateColumns: 'repeat(3,1fr)' }}>
          <div className="calc-result-card calc-result-primary"><span className="calc-result-label">Words</span><span className="calc-result-value">{words.toLocaleString()}</span></div>
          <div className="calc-result-card"><span className="calc-result-label">Characters</span><span className="calc-result-value">{chars.toLocaleString()}</span></div>
          <div className="calc-result-card"><span className="calc-result-label">Characters (no spaces)</span><span className="calc-result-value">{charsNoSpace.toLocaleString()}</span></div>
          <div className="calc-result-card"><span className="calc-result-label">Sentences</span><span className="calc-result-value">{sentences}</span></div>
          <div className="calc-result-card"><span className="calc-result-label">Paragraphs</span><span className="calc-result-value">{paragraphs}</span></div>
          <div className="calc-result-card"><span className="calc-result-label">Reading Time</span><span className="calc-result-value">~{readTime} min</span></div>
        </div>
      </div>
    </ToolPageWrapper>
  );
};
export default WordCounter;
