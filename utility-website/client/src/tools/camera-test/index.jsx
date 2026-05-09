import React, { useState, useRef, useEffect } from 'react';
import ToolPageWrapper from '../../components/common/ToolPageWrapper';
import meta from './meta';
const CameraTest = () => {
  const [active, setActive] = useState(false);
  const [devices, setDevices] = useState([]);
  const [selected, setSelected] = useState('');
  const [info, setInfo] = useState(null);
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  useEffect(() => { navigator.mediaDevices?.enumerateDevices().then(d => setDevices(d.filter(d => d.kind === 'videoinput'))); }, []);
  const start = async () => {
    try {
      const constraints = { video: selected ? { deviceId: { exact: selected } } : true };
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;
      if (videoRef.current) videoRef.current.srcObject = stream;
      const track = stream.getVideoTracks()[0];
      const settings = track.getSettings();
      setInfo({ name: track.label, width: settings.width, height: settings.height, fps: settings.frameRate });
      setActive(true);
    } catch { alert('Camera access denied'); }
  };
  const stop = () => { streamRef.current?.getTracks().forEach(t => t.stop()); setActive(false); setInfo(null); };
  useEffect(() => { return () => streamRef.current?.getTracks().forEach(t => t.stop()); }, []);
  return (
    <ToolPageWrapper meta={meta}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
        {devices.length > 0 && <div className="form-group" style={{ width: '100%', maxWidth: 400 }}><label>Select Camera</label><select value={selected} onChange={e => setSelected(e.target.value)} className="calc-input"><option value="">Default</option>{devices.map(d => <option key={d.deviceId} value={d.deviceId}>{d.label || `Camera ${d.deviceId.slice(0, 8)}`}</option>)}</select></div>}
        <div style={{ width: '100%', maxWidth: 600, aspectRatio: '16/9', background: '#000', borderRadius: 12, overflow: 'hidden' }}><video ref={videoRef} autoPlay muted playsInline style={{ width: '100%', height: '100%', objectFit: 'cover' }} /></div>
        {info && <div className="calc-results" style={{ gridTemplateColumns: 'repeat(3,1fr)' }}>
          <div className="calc-result-card"><span className="calc-result-label">Resolution</span><span className="calc-result-value">{info.width}×{info.height}</span></div>
          <div className="calc-result-card"><span className="calc-result-label">Frame Rate</span><span className="calc-result-value">{Math.round(info.fps)} fps</span></div>
          <div className="calc-result-card"><span className="calc-result-label">Camera</span><span className="calc-result-value" style={{ fontSize: '0.688rem' }}>{info.name}</span></div>
        </div>}
        <button onClick={active ? stop : start} className="btn btn-primary btn-lg">{active ? '⬛ Stop Camera' : '📷 Start Camera Test'}</button>
        {active && <p style={{ color: '#10B981', fontWeight: 600 }}>✅ Camera is working!</p>}
      </div>
    </ToolPageWrapper>
  );
};
export default CameraTest;
