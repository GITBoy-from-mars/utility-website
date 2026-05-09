import React, { useState, useRef, useEffect } from 'react';
import ToolPageWrapper from '../../components/common/ToolPageWrapper';
import { Icon } from '../../assets/icons/icons';
import meta from './meta';
const WebcamRecorder = () => {
  const [recording, setRecording] = useState(false);
  const [videoUrl, setVideoUrl] = useState(null);
  const [duration, setDuration] = useState(0);
  const [streamActive, setStreamActive] = useState(false);
  const videoRef = useRef(null);
  const recorderRef = useRef(null);
  const chunksRef = useRef([]);
  const streamRef = useRef(null);
  const timerRef = useRef(null);
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      streamRef.current = stream;
      if (videoRef.current) videoRef.current.srcObject = stream;
      setStreamActive(true);
    } catch (e) { alert('Camera access denied'); }
  };
  const startRec = () => {
    chunksRef.current = [];
    const mr = new MediaRecorder(streamRef.current, { mimeType: 'video/webm' });
    mr.ondataavailable = e => { if (e.data.size > 0) chunksRef.current.push(e.data); };
    mr.onstop = () => { setVideoUrl(URL.createObjectURL(new Blob(chunksRef.current, { type: 'video/webm' }))); clearInterval(timerRef.current); };
    mr.start(100);
    recorderRef.current = mr;
    setRecording(true); setDuration(0); setVideoUrl(null);
    timerRef.current = setInterval(() => setDuration(d => d + 1), 1000);
  };
  const stopRec = () => { recorderRef.current?.stop(); setRecording(false); };
  const stopCamera = () => { streamRef.current?.getTracks().forEach(t => t.stop()); setStreamActive(false); };
  useEffect(() => { return () => { clearInterval(timerRef.current); streamRef.current?.getTracks().forEach(t => t.stop()); }; }, []);
  const download = () => { const a = document.createElement('a'); a.href = videoUrl; a.download = 'webcam-recording.webm'; a.click(); };
  return (
    <ToolPageWrapper meta={meta}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
        <div style={{ width: '100%', maxWidth: 600, aspectRatio: '16/9', background: '#000', borderRadius: 12, overflow: 'hidden', position: 'relative' }}>
          <video ref={videoRef} autoPlay muted playsInline style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          {recording && <div style={{ position: 'absolute', top: 12, right: 12, background: '#EF4444', color: '#fff', padding: '4px 12px', borderRadius: 20, fontSize: '0.813rem', fontWeight: 700 }}>🔴 {Math.floor(duration / 60).toString().padStart(2, '0')}:{(duration % 60).toString().padStart(2, '0')}</div>}
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          {!streamActive && <button onClick={startCamera} className="btn btn-primary"><Icon name="Zap" size={18} />Open Camera</button>}
          {streamActive && !recording && <button onClick={startRec} className="btn btn-primary">⏺️ Record</button>}
          {recording && <button onClick={stopRec} className="btn" style={{ background: '#EF4444', color: '#fff' }}>⬛ Stop</button>}
          {streamActive && <button onClick={stopCamera} className="btn btn-ghost">Close Camera</button>}
        </div>
        {videoUrl && (<>
          <video src={videoUrl} controls style={{ width: '100%', maxWidth: 600, borderRadius: 12 }} />
          <button onClick={download} className="btn btn-primary"><Icon name="Download" size={18} />Download</button>
        </>)}
      </div>
    </ToolPageWrapper>
  );
};
export default WebcamRecorder;
