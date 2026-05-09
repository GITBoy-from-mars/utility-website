import React, { useState } from 'react';
import ToolPageWrapper from '../../components/common/ToolPageWrapper';
import FileUploader from '../../components/common/FileUploader';
import { Icon } from '../../assets/icons/icons';
import meta from './meta';
import '../pdf-to-word/PdfToWord.css';
import '../image-converter/ImageConverter.css';

const VideoCompressor = () => {
  const [files, setFiles] = useState([]);
  const [quality, setQuality] = useState('medium');
  const [processing, setProcessing] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');

  const handleProcess = async () => {
    if (!files.length) return;
    setProcessing(true); setError(''); setDone(false);
    try {
      const fd = new FormData(); fd.append('file', files[0]); fd.append('quality', quality);
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/tools/video-compressor/compress`, { method: 'POST', body: fd });
      if (!res.ok) throw new Error('Compression failed');
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a'); a.href = url;
      a.download = `compressed-${files[0].name}`; a.click();
      URL.revokeObjectURL(url); setDone(true);
    } catch (e) { setError(e.message); }
    setProcessing(false);
  };

  return (
    <ToolPageWrapper meta={meta}>
      <div className="converter-tool">
        <FileUploader accept="video/*" multiple={false} maxSizeMB={200} onFilesSelected={setFiles} label="Drop a video file here" sublabel="MP4, AVI, MOV, MKV supported · Max 200MB" />
        {files.length > 0 && (
          <>
            <div className="imgconv-options" style={{ gridTemplateColumns: '1fr' }}>
              <div className="form-group">
                <label>Compression Level</label>
                <select value={quality} onChange={e => setQuality(e.target.value)} className="qr-select">
                  <option value="low">Low (Best Quality, Larger File)</option>
                  <option value="medium">Medium (Balanced)</option>
                  <option value="high">High (Smallest Size)</option>
                </select>
              </div>
            </div>
            <button onClick={handleProcess} disabled={processing} className="btn btn-primary btn-lg converter-btn">
              <Icon name="Compress" size={20} />{processing ? 'Compressing (this may take a while)...' : 'Compress Video'}
            </button>
          </>
        )}
        {done && <div className="badge badge-success" style={{ padding: '12px 20px', fontSize: '0.875rem' }}>Video compressed and downloaded successfully!</div>}
        {error && <div style={{ color: 'var(--error)', fontSize: '0.875rem' }}>{error}</div>}
      </div>
    </ToolPageWrapper>
  );
};
export default VideoCompressor;
