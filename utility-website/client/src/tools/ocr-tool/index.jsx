import React, { useState } from 'react';
import ToolPageWrapper from '../../components/common/ToolPageWrapper';
import FileUploader from '../../components/common/FileUploader';
import { Icon } from '../../assets/icons/icons';
import meta from './meta';
import './OcrTool.css';

const OcrTool = () => {
  const [files, setFiles] = useState([]);
  const [text, setText] = useState('');
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');

  const handleProcess = async () => {
    if (!files.length) return;
    setProcessing(true); setError(''); setText('');
    try {
      const fd = new FormData(); fd.append('file', files[0]);
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/tools/ocr-tool/extract`, { method: 'POST', body: fd });
      if (!res.ok) throw new Error('OCR failed');
      const data = await res.json();
      setText(data.text);
    } catch (e) { setError(e.message); }
    setProcessing(false);
  };

  const copyText = () => { navigator.clipboard.writeText(text); };
  const downloadText = () => {
    const blob = new Blob([text], { type: 'text/plain' });
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob);
    a.download = 'extracted-text.txt'; a.click();
  };

  return (
    <ToolPageWrapper meta={meta}>
      <div className="converter-tool">
        <FileUploader accept=".pdf,.png,.jpg,.jpeg,.bmp,.tiff,.webp" multiple={false} maxSizeMB={20} onFilesSelected={setFiles} label="Drop an image or PDF here" sublabel="Supports PNG, JPG, PDF, BMP, TIFF, WebP" />
        {files.length > 0 && (
          <button onClick={handleProcess} disabled={processing} className="btn btn-primary btn-lg converter-btn">
            <Icon name="Ocr" size={20} />{processing ? 'Extracting text...' : 'Extract Text'}
          </button>
        )}
        {error && <p style={{ color: 'var(--error)' }}>{error}</p>}
        {text && (
          <div className="ocr-result">
            <div className="ocr-result-header">
              <span>Extracted Text</span>
              <div className="ocr-actions">
                <button onClick={copyText} className="btn btn-ghost btn-sm"><Icon name="File" size={14} />Copy</button>
                <button onClick={downloadText} className="btn btn-ghost btn-sm"><Icon name="Download" size={14} />Download .txt</button>
              </div>
            </div>
            <textarea className="ocr-textarea" value={text} onChange={e => setText(e.target.value)} rows={12} />
          </div>
        )}
      </div>
    </ToolPageWrapper>
  );
};
export default OcrTool;
