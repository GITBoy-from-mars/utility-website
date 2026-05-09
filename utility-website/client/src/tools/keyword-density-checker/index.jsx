import React, { useState, useMemo } from 'react';
import ToolPageWrapper from '../../components/common/ToolPageWrapper';
import meta from './meta';
import '../base64-encoder-decoder/Base64Tool.css';
import '../loan-amortization/LoanAmortization.css';
const stop = new Set(['the','a','an','is','are','was','were','be','been','being','have','has','had','do','does','did','will','would','shall','should','may','might','can','could','must','of','in','to','for','with','on','at','from','by','as','into','through','during','before','after','above','below','between','under','and','but','or','nor','not','so','yet','both','either','neither','each','every','all','any','few','more','most','other','some','such','no','only','same','than','too','very','just','because','if','when','while','although','how','what','which','who','whom','this','that','these','those','i','me','my','we','our','you','your','he','him','his','she','her','it','its','they','them','their']);
const KeywordDensityChecker = () => {
  const [text, setText] = useState('');
  const analysis = useMemo(() => {
    if (!text.trim()) return null;
    const words = text.toLowerCase().match(/[a-z]+/g) || [];
    const total = words.length;
    const freq = {};
    words.forEach(w => { if (!stop.has(w) && w.length > 2) freq[w] = (freq[w] || 0) + 1; });
    const sorted = Object.entries(freq).sort((a, b) => b[1] - a[1]).slice(0, 30);
    const chars = text.length;
    const sentences = (text.match(/[.!?]+/g) || []).length || 1;
    const paragraphs = text.split(/\n\n+/).filter(Boolean).length;
    return { sorted, total, chars, sentences, paragraphs };
  }, [text]);
  return (
    <ToolPageWrapper meta={meta}>
      <div className="devtool">
        <div className="form-group"><label>Paste your content</label><textarea className="devtool-textarea" rows={8} value={text} onChange={e => setText(e.target.value)} placeholder="Paste article or web page content here..." /></div>
        {analysis && (<>
          <div className="calc-results" style={{ gridTemplateColumns: 'repeat(4,1fr)' }}>
            <div className="calc-result-card"><span className="calc-result-label">Words</span><span className="calc-result-value">{analysis.total}</span></div>
            <div className="calc-result-card"><span className="calc-result-label">Characters</span><span className="calc-result-value">{analysis.chars}</span></div>
            <div className="calc-result-card"><span className="calc-result-label">Sentences</span><span className="calc-result-value">{analysis.sentences}</span></div>
            <div className="calc-result-card"><span className="calc-result-label">Paragraphs</span><span className="calc-result-value">{analysis.paragraphs}</span></div>
          </div>
          <div className="amort-table-wrap"><table className="amort-table"><thead><tr><th style={{ textAlign: 'left' }}>Keyword</th><th>Count</th><th>Density</th><th>Visual</th></tr></thead>
            <tbody>{analysis.sorted.map(([word, count]) => <tr key={word}><td style={{ textAlign: 'left', fontWeight: 600 }}>{word}</td><td>{count}</td><td>{((count / analysis.total) * 100).toFixed(2)}%</td><td><div style={{ width: `${Math.min(100, (count / analysis.sorted[0][1]) * 100)}%`, height: 8, background: 'var(--primary-400)', borderRadius: 4 }} /></td></tr>)}</tbody>
          </table></div>
        </>)}
      </div>
    </ToolPageWrapper>
  );
};
export default KeywordDensityChecker;
