import React, { useState, useRef, useEffect } from 'react';
import ToolPageWrapper from '../../components/common/ToolPageWrapper';
import meta from './meta';
const MicTest = () => {
  const [active, setActive] = useState(false);
  const [level, setLevel] = useState(0);
  const [devices, setDevices] = useState([]);
  const [selectedDevice, setSelectedDevice] = useState('');
  const streamRef = useRef(null);
  const animRef = useRef(null);
  useEffect(() => { navigator.mediaDevices?.enumerateDevices().then(d => setDevices(d.filter(d => d.kind === 'audioinput'))); }, []);
  const start = async () => {
    try {
      const constraints = { audio: selectedDevice ? { deviceId: { exact: selectedDevice } } : true };
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;
      const ctx = new AudioContext();
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 256;
      ctx.createMediaStreamSource(stream).connect(analyser);
      const data = new Uint8Array(analyser.frequencyBinCount);
      const tick = () => { analyser.getByteFrequencyData(data); const avg = data.reduce((a, b) => a + b, 0) / data.length; setLevel(avg); animRef.current = requestAnimationFrame(tick); };
      tick();
      setActive(true);
    } catch { alert('Microphone access denied'); }
  };
  const stop = () => { streamRef.current?.getTracks().forEach(t => t.stop()); cancelAnimationFrame(animRef.current); setActive(false); setLevel(0); };
  useEffect(() => { return () => { cancelAnimationFrame(animRef.current); streamRef.current?.getTracks().forEach(t => t.stop()); }; }, []);
  const pct = Math.min(100, (level / 128) * 100);
  const color = pct > 80 ? '#EF4444' : pct > 40 ? '#F59E0B' : '#10B981';
  return (
    <ToolPageWrapper meta={meta}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20, padding: 30 }}>
        {devices.length > 0 && <div className="form-group" style={{ width: '100%', maxWidth: 400 }}><label>Select Microphone</label><select value={selectedDevice} onChange={e => setSelectedDevice(e.target.value)} className="calc-input"><option value="">Default</option>{devices.map(d => <option key={d.deviceId} value={d.deviceId}>{d.label || `Mic ${d.deviceId.slice(0, 8)}`}</option>)}</select></div>}
        <div style={{ width: 160, height: 160, borderRadius: '50%', background: `conic-gradient(${color} ${pct}%, var(--neutral-100) ${pct}%)`, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.05s' }}>
          <div style={{ width: 130, height: 130, borderRadius: '50%', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
            <span style={{ fontSize: '2.5rem' }}>🎤</span>
            <span style={{ fontSize: '0.813rem', fontWeight: 700, color }}>{Math.round(pct)}%</span>
          </div>
        </div>
        <div style={{ width: '100%', maxWidth: 400, height: 12, background: 'var(--neutral-100)', borderRadius: 6, overflow: 'hidden' }}><div style={{ width: `${pct}%`, height: '100%', background: `linear-gradient(90deg, #10B981, ${color})`, borderRadius: 6, transition: 'width 0.05s' }} /></div>
        <p style={{ fontSize: '0.875rem', color: 'var(--neutral-500)' }}>{active ? (pct > 5 ? '✅ Microphone is working!' : '⚠️ No audio detected — try speaking') : 'Click Start to test your microphone'}</p>
        <button onClick={active ? stop : start} className="btn btn-primary btn-lg">{active ? '⬛ Stop Test' : '🎤 Start Mic Test'}</button>
      </div>
    </ToolPageWrapper>
  );
};
export default MicTest;
