import React, { useState } from 'react';
import ToolPageWrapper from '../../components/common/ToolPageWrapper';
import { Icon } from '../../assets/icons/icons';
import meta from './meta';
const YtTimestampGenerator = () => {
  const [url, setUrl] = useState('');
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const totalSec = hours * 3600 + minutes * 60 + seconds;
  const cleanUrl = url.split('&t=')[0].split('?t=')[0];
  const sep = cleanUrl.includes('?') ? '&' : '?';
  const result = cleanUrl ? `${cleanUrl}${sep}t=${totalSec}s` : '';
  return (
    <ToolPageWrapper meta={meta}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div className="form-group"><label>YouTube URL</label><input type="text" value={url} onChange={e => setUrl(e.target.value)} className="calc-input" placeholder="https://www.youtube.com/watch?v=..." /></div>
        <div style={{ display: 'flex', gap: 12 }}>
          <div className="form-group" style={{ flex: 1 }}><label>Hours</label><input type="number" min="0" value={hours} onChange={e => setHours(+e.target.value)} className="calc-input" /></div>
          <div className="form-group" style={{ flex: 1 }}><label>Minutes</label><input type="number" min="0" max="59" value={minutes} onChange={e => setMinutes(+e.target.value)} className="calc-input" /></div>
          <div className="form-group" style={{ flex: 1 }}><label>Seconds</label><input type="number" min="0" max="59" value={seconds} onChange={e => setSeconds(+e.target.value)} className="calc-input" /></div>
        </div>
        {result && <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <input type="text" value={result} readOnly className="devtool-textarea" style={{ flex: 1, padding: '12px 14px', minHeight: 'auto', fontFamily: 'monospace' }} />
          <button onClick={() => navigator.clipboard.writeText(result)} className="btn btn-primary"><Icon name="File" size={18} />Copy</button>
        </div>}
      </div>
    </ToolPageWrapper>
  );
};
export default YtTimestampGenerator;
