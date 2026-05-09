import React, { useState } from 'react';
import ToolPageWrapper from '../../components/common/ToolPageWrapper';
import meta from './meta';
import './DiceRoller.css';
const dieFaces = { 4: 'D4', 6: 'D6', 8: 'D8', 10: 'D10', 12: 'D12', 20: 'D20', 100: 'D100' };
const DiceRoller = () => {
  const [sides, setSides] = useState(6);
  const [count, setCount] = useState(2);
  const [results, setResults] = useState([]);
  const [rolling, setRolling] = useState(false);
  const [history, setHistory] = useState([]);
  const roll = () => {
    setRolling(true);
    setTimeout(() => {
      const vals = Array.from({ length: count }, () => Math.floor(Math.random() * sides) + 1);
      setResults(vals);
      setHistory(h => [{ dice: `${count}${dieFaces[sides] || 'D' + sides}`, values: vals, total: vals.reduce((a, b) => a + b, 0), time: new Date().toLocaleTimeString() }, ...h.slice(0, 19)]);
      setRolling(false);
    }, 400);
  };
  const total = results.reduce((a, b) => a + b, 0);
  return (
    <ToolPageWrapper meta={meta}>
      <div className="dice-tool">
        <div className="dice-controls">
          <div className="form-group"><label>Dice Type</label><div className="dice-type-grid">{Object.entries(dieFaces).map(([s, label]) => <button key={s} className={`dice-type-btn ${+s === sides ? 'active' : ''}`} onClick={() => setSides(+s)}>{label}</button>)}</div></div>
          <div className="form-group"><label>Number of Dice: {count}</label><input type="range" min="1" max="10" value={count} onChange={e => setCount(+e.target.value)} className="imgconv-range" /></div>
          <button onClick={roll} disabled={rolling} className="btn btn-primary btn-lg" style={{ width: '100%' }}>{rolling ? '🎲 Rolling...' : `🎲 Roll ${count}${dieFaces[sides] || 'D' + sides}`}</button>
        </div>
        {results.length > 0 && (
          <div className="dice-results">
            <div className="dice-faces">{results.map((v, i) => <div key={i} className={`dice-face ${rolling ? 'rolling' : ''}`}>{v}</div>)}</div>
            <div className="dice-total">Total: <strong>{total}</strong></div>
          </div>
        )}
        {history.length > 0 && (
          <div className="dice-history"><h4>History</h4>{history.map((h, i) => <div key={i} className="dice-history-row"><span className="dice-history-time">{h.time}</span><span>{h.dice}</span><span>[{h.values.join(', ')}]</span><strong>= {h.total}</strong></div>)}</div>
        )}
      </div>
    </ToolPageWrapper>
  );
};
export default DiceRoller;
