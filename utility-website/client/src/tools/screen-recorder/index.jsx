import React, { useState, useRef } from 'react';
import ToolPageWrapper from '../../components/common/ToolPageWrapper';
import { Icon } from '../../assets/icons/icons';
import meta from './meta';
const ScreenRecorder = () => {
  const [recording, setRecording] = useState(false);
  const [videoUrl, setVideoUrl] = useState(null);
  const [duration, setDuration] = useState(0);
  const recorderRef = useRef(null);
  const chunksRef = useRef([]);
  const timerRef = useRef(null);
  const start = async () => {
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({ video: { mediaSource: 'screen' }, audio: true });
      chunksRef.current = [];
      const mr = new MediaRecorder(stream, { mimeType: 'video/webm' });
      mr.ondataavailable = e => { if (e.data.size > 0) chunksRef.current.push(e.data); };
      mr.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'video/webm' });
        setVideoUrl(URL.createObjectURL(blob));
        stream.getTracks().forEach(t => t.stop());
        clearInterval(timerRef.current);
      };
      mr.start(100);
      recorderRef.current = mr;
      setRecording(true); setVideoUrl(null); setDuration(0);
      timerRef.current = setInterval(() => setDuration(d => d + 1), 1000);
      stream.getVideoTracks()[0].addEventListener('ended', () => mr.stop());
    } catch (e) { console.error(e); }
  };
  const stop = () => { recorderRef.current?.stop(); setRecording(false); };
  const download = () => { if (!videoUrl) return; const a = document.createElement('a'); a.href = videoUrl; a.download = 'screen-recording.webm'; a.click(); };
  const formatTime = s => `${Math.floor(s / 60).toString().padStart(2, '0')}:${(s % 60).toString().padStart(2, '0')}`;
  return (
    <ToolPageWrapper meta={meta}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20, padding: 20 }}>
        {!recording && !videoUrl && <p style={{ color: 'var(--neutral-500)', fontSize: '0.938rem' }}>Click "Start Recording" to capture your screen. No installation required.</p>}
        {recording && <div style={{ fontSize: '2rem', fontWeight: 800, color: '#EF4444', fontFamily: 'monospace' }}>🔴 {formatTime(duration)}</div>}
        <div style={{ display: 'flex', gap: 12 }}>
          {!recording ? (
            <button onClick={start} className="btn btn-primary btn-lg"><Icon name="Zap" size={18} />Start Recording</button>
          ) : (
            <button onClick={stop} className="btn btn-lg" style={{ background: '#EF4444', color: '#fff' }}>⬛ Stop Recording</button>
          )}
        </div>
        {videoUrl && (<>
          <video src={videoUrl} controls style={{ width: '100%', maxWidth: 700, borderRadius: 12, boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }} />
          <button onClick={download} className="btn btn-primary"><Icon name="Download" size={18} />Download Recording</button>
        </>)}
      </div>
    </ToolPageWrapper>
  );
};
export default ScreenRecorder;
