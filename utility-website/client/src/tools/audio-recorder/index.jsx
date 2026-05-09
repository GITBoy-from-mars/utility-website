import React, { useState, useRef, useEffect } from 'react';
import ToolPageWrapper from '../../components/common/ToolPageWrapper';
import { Icon } from '../../assets/icons/icons';
import meta from './meta';
const AudioRecorder = () => {
  const [recording, setRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState(null);
  const [duration, setDuration] = useState(0);
  const recorderRef = useRef(null);
  const chunksRef = useRef([]);
  const timerRef = useRef(null);
  const start = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      chunksRef.current = [];
      const mr = new MediaRecorder(stream);
      mr.ondataavailable = e => { if (e.data.size > 0) chunksRef.current.push(e.data); };
      mr.onstop = () => { setAudioUrl(URL.createObjectURL(new Blob(chunksRef.current, { type: 'audio/webm' }))); stream.getTracks().forEach(t => t.stop()); clearInterval(timerRef.current); };
      mr.start(100);
      recorderRef.current = mr;
      setRecording(true); setAudioUrl(null); setDuration(0);
      timerRef.current = setInterval(() => setDuration(d => d + 1), 1000);
    } catch { alert('Microphone access denied'); }
  };
  const stop = () => { recorderRef.current?.stop(); setRecording(false); };
  useEffect(() => { return () => clearInterval(timerRef.current); }, []);
  const download = () => { const a = document.createElement('a'); a.href = audioUrl; a.download = 'audio-recording.webm'; a.click(); };
  const fmt = s => `${Math.floor(s / 60).toString().padStart(2, '0')}:${(s % 60).toString().padStart(2, '0')}`;
  return (
    <ToolPageWrapper meta={meta}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20, padding: 40 }}>
        <div style={{ width: 120, height: 120, borderRadius: '50%', background: recording ? 'linear-gradient(135deg,#EF4444,#F97316)' : 'linear-gradient(135deg,#3B82F6,#8B5CF6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem', cursor: 'pointer', transition: 'all 0.3s ease', boxShadow: recording ? '0 0 40px rgba(239,68,68,0.3)' : '0 4px 20px rgba(59,130,246,0.2)', animation: recording ? 'pulse 1.5s infinite' : 'none' }} onClick={recording ? stop : start}>
          {recording ? '⬛' : '🎤'}
        </div>
        <p style={{ fontSize: '2rem', fontWeight: 800, fontFamily: 'monospace', color: recording ? '#EF4444' : 'var(--neutral-400)' }}>{fmt(duration)}</p>
        <button onClick={recording ? stop : start} className="btn btn-primary btn-lg">{recording ? 'Stop Recording' : 'Start Recording'}</button>
        {audioUrl && (<><audio src={audioUrl} controls style={{ width: '100%', maxWidth: 400 }} /><button onClick={download} className="btn btn-secondary"><Icon name="Download" size={18} />Download Audio</button></>)}
        <style>{`@keyframes pulse{0%,100%{transform:scale(1)}50%{transform:scale(1.05)}}`}</style>
      </div>
    </ToolPageWrapper>
  );
};
export default AudioRecorder;
