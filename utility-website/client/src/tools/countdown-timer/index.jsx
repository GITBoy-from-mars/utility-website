import React, { useState, useEffect, useRef, useMemo } from 'react';
import ToolPageWrapper from '../../components/common/ToolPageWrapper';
import meta from './meta';
import './CountdownTimer.css';

// Generate a gentle notification tone using Web Audio API
const playCompletionSound = () => {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.15);
      gain.gain.setValueAtTime(0.15, ctx.currentTime + i * 0.15);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.15 + 0.5);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(ctx.currentTime + i * 0.15);
      osc.stop(ctx.currentTime + i * 0.15 + 0.5);
    });
    // Close context after sounds finish
    setTimeout(() => ctx.close(), 2000);
  } catch {}
};

const CountdownTimer = () => {
  const [target, setTarget] = useState('');
  const [label, setLabel] = useState('');
  const [diff, setDiff] = useState(null);
  const [soundPlayed, setSoundPlayed] = useState(false);
  const [copied, setCopied] = useState(false);
  const timerRef = useRef(null);

  // Check if opened via shared link — makes it read-only
  const isShared = useMemo(() => {
    const params = new URLSearchParams(window.location.search);
    return !!params.get('t');
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('t')) setTarget(params.get('t'));
    if (params.get('l')) setLabel(decodeURIComponent(params.get('l')));
  }, []);

  useEffect(() => {
    if (!target) { setDiff(null); return; }
    setSoundPlayed(false);
    const tick = () => {
      const ms = new Date(target) - Date.now();
      if (ms <= 0) {
        setDiff({ d: 0, h: 0, m: 0, s: 0, done: true });
        clearInterval(timerRef.current);
        return;
      }
      setDiff({
        d: Math.floor(ms / 86400000),
        h: Math.floor((ms % 86400000) / 3600000),
        m: Math.floor((ms % 3600000) / 60000),
        s: Math.floor((ms % 60000) / 1000),
        done: false,
      });
    };
    tick();
    timerRef.current = setInterval(tick, 1000);
    return () => clearInterval(timerRef.current);
  }, [target]);

  // Play sound when timer completes
  useEffect(() => {
    if (diff?.done && !soundPlayed) {
      playCompletionSound();
      setSoundPlayed(true);
      // Also try browser notification
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification(label ? `⏰ ${label} — Time's Up!` : "⏰ Countdown Complete!");
      }
    }
  }, [diff?.done, soundPlayed, label]);

  const shareUrl = () => {
    const url = `${window.location.origin}${window.location.pathname}?t=${encodeURIComponent(target)}&l=${encodeURIComponent(label)}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <ToolPageWrapper meta={meta}>
      <div className="countdown-tool">
        {isShared && (
          <div className="countdown-shared-badge">
            🔗 Shared countdown — view only
          </div>
        )}
        <div className="calc-inputs">
          <div className="form-group">
            <label>Event Name</label>
            <input
              type="text"
              value={label}
              onChange={e => setLabel(e.target.value)}
              className="calc-input"
              placeholder="My Birthday"
              disabled={isShared}
              style={isShared ? { opacity: 0.7, cursor: 'not-allowed' } : {}}
            />
          </div>
          <div className="form-group">
            <label>Target Date & Time</label>
            <input
              type="datetime-local"
              value={target}
              onChange={e => setTarget(e.target.value)}
              className="calc-input"
              disabled={isShared}
              style={isShared ? { opacity: 0.7, cursor: 'not-allowed' } : {}}
            />
          </div>
        </div>

        {diff && !diff.done && (
          <div className="countdown-display">
            {label && <div className="countdown-label">{label}</div>}
            <div className="countdown-units">
              <div className="countdown-unit"><span className="countdown-num">{diff.d}</span><span className="countdown-lbl">Days</span></div>
              <div className="countdown-sep">:</div>
              <div className="countdown-unit"><span className="countdown-num">{String(diff.h).padStart(2, '0')}</span><span className="countdown-lbl">Hours</span></div>
              <div className="countdown-sep">:</div>
              <div className="countdown-unit"><span className="countdown-num">{String(diff.m).padStart(2, '0')}</span><span className="countdown-lbl">Minutes</span></div>
              <div className="countdown-sep">:</div>
              <div className="countdown-unit"><span className="countdown-num">{String(diff.s).padStart(2, '0')}</span><span className="countdown-lbl">Seconds</span></div>
            </div>
          </div>
        )}

        {diff && diff.done && (
          <div className="countdown-display countdown-done">
            <div className="countdown-label" style={{ color: 'var(--primary-600)', fontSize: '2rem' }}>
              🎉 Time's Up!
            </div>
            {label && <p style={{ color: 'var(--neutral-500)', marginTop: 8 }}>{label} has arrived!</p>}
          </div>
        )}

        {target && !isShared && (
          <button onClick={shareUrl} className="btn btn-secondary" style={{ alignSelf: 'center' }}>
            {copied ? '✅ Link Copied!' : '📋 Copy Shareable Link'}
          </button>
        )}
      </div>
    </ToolPageWrapper>
  );
};
export default CountdownTimer;
