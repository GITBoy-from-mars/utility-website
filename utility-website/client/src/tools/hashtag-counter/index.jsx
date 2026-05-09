import React, { useState, useMemo } from 'react';
import ToolPageWrapper from '../../components/common/ToolPageWrapper';
import { Icon } from '../../assets/icons/icons';
import meta from './meta';
import '../base64-encoder-decoder/Base64Tool.css';
const HashtagCounter = () => {
  const [input, setInput] = useState('');
  const tags = useMemo(() => {
    const matches = input.match(/#[\w]+/g) || [];
    const freq = {};
    matches.forEach(t => { freq[t] = (freq[t] || 0) + 1; });
    return Object.entries(freq).sort((a, b) => b[1] - a[1]);
  }, [input]);
  return (
    <ToolPageWrapper meta={meta}>
      <div className="devtool">
        <div className="form-group"><label>Paste text with hashtags</label><textarea className="devtool-textarea" rows={6} value={input} onChange={e => setInput(e.target.value)} placeholder="Loving the sunset today! #travel #photography #nature #beautiful #sunset #travel" /></div>
        {tags.length > 0 && (<>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <p style={{ fontSize: '0.875rem', color: 'var(--neutral-500)' }}>{tags.length} unique hashtag{tags.length !== 1 ? 's' : ''} found</p>
            <button onClick={() => navigator.clipboard.writeText(tags.map(t => t[0]).join(' '))} className="btn btn-ghost btn-sm"><Icon name="File" size={14} />Copy All</button>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>{tags.map(([tag, count]) => <span key={tag} style={{ padding: '6px 12px', background: 'var(--primary-50)', color: 'var(--primary-700)', borderRadius: 'var(--radius-sm)', fontSize: '0.813rem', fontWeight: 600 }}>{tag} <span style={{ opacity: 0.6 }}>×{count}</span></span>)}</div>
        </>)}
      </div>
    </ToolPageWrapper>
  );
};
export default HashtagCounter;
