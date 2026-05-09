import React, { useState } from 'react';
import ToolPageWrapper from '../../components/common/ToolPageWrapper';
import meta from './meta';
import './CoinFlip.css';
const CoinFlip = () => {
  const [result, setResult] = useState(null);
  const [flipping, setFlipping] = useState(false);
  const [stats, setStats] = useState({ heads: 0, tails: 0 });
  const flip = () => {
    setFlipping(true);
    setTimeout(() => {
      const r = Math.random() < 0.5 ? 'Heads' : 'Tails';
      setResult(r);
      setStats(s => ({ ...s, [r.toLowerCase()]: s[r.toLowerCase()] + 1 }));
      setFlipping(false);
    }, 600);
  };
  const total = stats.heads + stats.tails;
  return (
    <ToolPageWrapper meta={meta}>
      <div className="coin-tool">
        <div className={`coin ${flipping ? 'flipping' : ''} ${result ? result.toLowerCase() : ''}`}>
          <div className="coin-face">{flipping ? '🪙' : result === 'Heads' ? '👑' : result === 'Tails' ? '🦅' : '🪙'}</div>
          <div className="coin-label">{flipping ? 'Flipping...' : result || 'Ready'}</div>
        </div>
        <button onClick={flip} disabled={flipping} className="btn btn-primary btn-lg" style={{ width: '100%', maxWidth: 300 }}>🪙 Flip Coin</button>
        {total > 0 && (
          <div className="coin-stats">
            <div className="coin-stat"><span>Heads</span><strong>{stats.heads}</strong><small>{((stats.heads / total) * 100).toFixed(1)}%</small></div>
            <div className="coin-stat"><span>Tails</span><strong>{stats.tails}</strong><small>{((stats.tails / total) * 100).toFixed(1)}%</small></div>
            <div className="coin-stat"><span>Total</span><strong>{total}</strong></div>
          </div>
        )}
        <button onClick={() => { setStats({ heads: 0, tails: 0 }); setResult(null); }} className="btn btn-ghost btn-sm">Reset Stats</button>
      </div>
    </ToolPageWrapper>
  );
};
export default CoinFlip;
