import React, { useState, useRef, useCallback } from 'react';
import ToolPageWrapper from '../../components/common/ToolPageWrapper';
import meta from './meta';
import './QrCodeGenerator.css';

const QrCodeGenerator = () => {
  const [text, setText] = useState('');
  const [size, setSize] = useState(256);
  const [color, setColor] = useState('#000000');
  const [bgColor, setBgColor] = useState('#FFFFFF');
  const [qrUrl, setQrUrl] = useState('');
  const [generating, setGenerating] = useState(false);
  const canvasRef = useRef(null);

  const generate = useCallback(async () => {
    if (!text.trim()) return;
    setGenerating(true);
    try {
      const QRCode = (await import('qrcode')).default;
      const url = await QRCode.toDataURL(text, {
        width: size,
        margin: 2,
        color: { dark: color, light: bgColor },
        errorCorrectionLevel: 'H',
      });
      setQrUrl(url);
    } catch (err) {
      console.error('QR generation failed:', err);
    }
    setGenerating(false);
  }, [text, size, color, bgColor]);

  const download = () => {
    if (!qrUrl) return;
    const a = document.createElement('a');
    a.href = qrUrl;
    a.download = `qr-code-${Date.now()}.png`;
    a.click();
  };

  return (
    <ToolPageWrapper meta={meta}>
      <div className="qr-tool">
        <div className="qr-input-section">
          <div className="form-group">
            <label htmlFor="qr-text">Content</label>
            <textarea
              id="qr-text"
              rows="3"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Enter URL, text, email, phone number..."
              className="qr-textarea"
            />
          </div>
          <div className="qr-options">
            <div className="form-group">
              <label htmlFor="qr-size">Size (px)</label>
              <select id="qr-size" value={size} onChange={(e) => setSize(Number(e.target.value))} className="qr-select">
                <option value={128}>128 x 128</option>
                <option value={256}>256 x 256</option>
                <option value={512}>512 x 512</option>
                <option value={1024}>1024 x 1024</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="qr-color">QR Color</label>
              <div className="qr-color-wrap">
                <input id="qr-color" type="color" value={color} onChange={(e) => setColor(e.target.value)} />
                <span>{color}</span>
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="qr-bg">Background</label>
              <div className="qr-color-wrap">
                <input id="qr-bg" type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)} />
                <span>{bgColor}</span>
              </div>
            </div>
          </div>
          <button onClick={generate} disabled={!text.trim() || generating} className="btn btn-primary btn-lg" style={{ width: '100%' }}>
            {generating ? 'Generating...' : 'Generate QR Code'}
          </button>
        </div>

        {qrUrl && (
          <div className="qr-result">
            <div className="qr-preview">
              <img src={qrUrl} alt="Generated QR Code" ref={canvasRef} />
            </div>
            <button onClick={download} className="btn btn-primary">Download PNG</button>
          </div>
        )}
      </div>
    </ToolPageWrapper>
  );
};

export default QrCodeGenerator;
