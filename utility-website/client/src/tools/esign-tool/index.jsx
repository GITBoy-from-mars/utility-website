import React, { useState, useRef, useEffect } from 'react';
import ToolPageWrapper from '../../components/common/ToolPageWrapper';
import FileUploader from '../../components/common/FileUploader';
import { Icon } from '../../assets/icons/icons';
import meta from './meta';
import './EsignTool.css';

const EsignTool = () => {
  const [files, setFiles] = useState([]);
  const [signatureData, setSignatureData] = useState('');
  const [page, setPage] = useState(1);
  const [posX, setPosX] = useState(50);
  const [posY, setPosY] = useState(80);
  const [processing, setProcessing] = useState(false);
  const [done, setDone] = useState(false);
  const canvasRef = useRef(null);
  const drawing = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = '#1E293B';
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
  }, []);

  const getPos = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    return { x: clientX - rect.left, y: clientY - rect.top };
  };

  const startDraw = (e) => { e.preventDefault(); drawing.current = true; const { x, y } = getPos(e); canvasRef.current.getContext('2d').beginPath(); canvasRef.current.getContext('2d').moveTo(x, y); };
  const draw = (e) => { if (!drawing.current) return; e.preventDefault(); const { x, y } = getPos(e); const ctx = canvasRef.current.getContext('2d'); ctx.lineTo(x, y); ctx.stroke(); };
  const stopDraw = () => { drawing.current = false; setSignatureData(canvasRef.current.toDataURL('image/png')); };

  const clearSig = () => {
    const ctx = canvasRef.current.getContext('2d');
    ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    setSignatureData('');
  };

  const handleProcess = async () => {
    if (!files.length || !signatureData) return;
    setProcessing(true); setDone(false);
    try {
      const fd = new FormData(); fd.append('file', files[0]);
      fd.append('signature', signatureData); fd.append('page', page);
      fd.append('posX', posX); fd.append('posY', posY);
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/tools/esign-tool/sign`, { method: 'POST', body: fd });
      if (!res.ok) throw new Error('Failed');
      const blob = await res.blob();
      const a = document.createElement('a'); a.href = URL.createObjectURL(blob);
      a.download = files[0].name.replace('.pdf', '-signed.pdf'); a.click(); setDone(true);
    } catch (e) { console.error(e); }
    setProcessing(false);
  };

  return (
    <ToolPageWrapper meta={meta}>
      <div className="converter-tool">
        <FileUploader accept=".pdf" multiple={false} maxSizeMB={50} onFilesSelected={setFiles} label="Drop a PDF to sign" />
        <div className="esign-section">
          <h3 className="esign-label">Draw Your Signature</h3>
          <canvas ref={canvasRef} width={500} height={150} className="esign-canvas"
            onMouseDown={startDraw} onMouseMove={draw} onMouseUp={stopDraw} onMouseLeave={stopDraw}
            onTouchStart={startDraw} onTouchMove={draw} onTouchEnd={stopDraw} />
          <button onClick={clearSig} className="btn btn-ghost btn-sm">Clear Signature</button>
        </div>
        {files.length > 0 && signatureData && (
          <>
            <div className="imgconv-options">
              <div className="form-group"><label>Page Number</label><input type="number" min="1" value={page} onChange={e => setPage(Number(e.target.value))} className="qr-textarea" style={{ minHeight: 'auto', padding: '10px 14px' }} /></div>
              <div className="form-group"><label>X Position: {posX}%</label><input type="range" min="0" max="100" value={posX} onChange={e => setPosX(Number(e.target.value))} className="imgconv-range" /></div>
              <div className="form-group"><label>Y Position: {posY}%</label><input type="range" min="0" max="100" value={posY} onChange={e => setPosY(Number(e.target.value))} className="imgconv-range" /></div>
            </div>
            <button onClick={handleProcess} disabled={processing} className="btn btn-primary btn-lg converter-btn">
              <Icon name="Signature" size={20} />{processing ? 'Signing...' : 'Apply Signature to PDF'}
            </button>
          </>
        )}
        {done && <div className="badge badge-success" style={{ padding: '12px 20px', fontSize: '0.875rem' }}>Signed PDF downloaded!</div>}
      </div>
    </ToolPageWrapper>
  );
};
export default EsignTool;
