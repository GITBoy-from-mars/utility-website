import React, { useState } from 'react';
import ToolPageWrapper from '../../components/common/ToolPageWrapper';
import { Icon } from '../../assets/icons/icons';
import meta from './meta';
const extractId = (url) => { const m = url.match(/(?:youtu\.be\/|v=|\/embed\/|\/v\/|\/e\/|watch\?v=)([^&?\s#]+)/); return m ? m[1] : null; };
const qualities = [
  { label: 'Max Resolution', suffix: 'maxresdefault' },
  { label: 'Standard (SD)', suffix: 'sddefault' },
  { label: 'High Quality', suffix: 'hqdefault' },
  { label: 'Medium Quality', suffix: 'mqdefault' },
  { label: 'Default', suffix: 'default' },
];
const YtThumbnailDownloader = () => {
  const [url, setUrl] = useState('');
  const [videoId, setVideoId] = useState(null);
  const [error, setError] = useState('');
  const extract = () => {
    const id = extractId(url);
    if (id) { setVideoId(id); setError(''); } else { setError('Invalid YouTube URL'); setVideoId(null); }
  };
  return (
    <ToolPageWrapper meta={meta}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div style={{ display: 'flex', gap: 8 }}><input type="text" value={url} onChange={e => setUrl(e.target.value)} onKeyDown={e => e.key === 'Enter' && extract()} className="calc-input" placeholder="Paste YouTube URL..." style={{ flex: 1 }} /><button onClick={extract} className="btn btn-primary"><Icon name="Search" size={18} />Get</button></div>
        {error && <p style={{ color: 'var(--error)', fontSize: '0.875rem' }}>{error}</p>}
        {videoId && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
            {qualities.map(q => (
              <div key={q.suffix} style={{ border: '1px solid var(--neutral-200)', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
                <img src={`https://img.youtube.com/vi/${videoId}/${q.suffix}.jpg`} alt={q.label} style={{ width: '100%', display: 'block' }} onError={e => { e.target.style.display = 'none'; }} />
                <div style={{ padding: '10px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.813rem', fontWeight: 600 }}>{q.label}</span>
                  <a href={`https://img.youtube.com/vi/${videoId}/${q.suffix}.jpg`} download target="_blank" rel="noreferrer" className="btn btn-ghost btn-sm"><Icon name="Download" size={14} /></a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </ToolPageWrapper>
  );
};
export default YtThumbnailDownloader;
