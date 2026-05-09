import React, { useState } from 'react';
import ToolPageWrapper from '../../components/common/ToolPageWrapper';
import FileUploader from '../../components/common/FileUploader';
import BatchProgress from '../../components/common/BatchProgress';
import { Icon } from '../../assets/icons/icons';
import meta from './meta';
import '../pdf-to-word/PdfToWord.css';

const BackgroundRemover = () => {
  const [files, setFiles] = useState([]);
  const [results, setResults] = useState([]);
  const [processing, setProcessing] = useState(false);
  const [preview, setPreview] = useState('');

  const handleProcess = async () => {
    if (!files.length) return;
    setProcessing(true);
    const nr = [];
    for (let i = 0; i < files.length; i++) {
      nr.push({ status: 'processing' }); setResults([...nr]);
      try {
        const fd = new FormData(); fd.append('file', files[i]);
        const res = await fetch('/api/tools/background-remover/remove', { method: 'POST', body: fd });
        if (!res.ok) throw new Error('Failed');
        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        if (i === 0) setPreview(url);
        const a = document.createElement('a'); a.href = url;
        a.download = files[i].name.replace(/\.[^.]+$/, '-nobg.png'); a.click();
        nr[i] = { status: 'done' };
      } catch (e) { nr[i] = { status: 'error', message: e.message }; }
      setResults([...nr]);
    }
    setProcessing(false);
  };

  return (
    <ToolPageWrapper meta={meta}>
      <div className="converter-tool">
        <FileUploader accept="image/*" multiple maxSizeMB={20} onFilesSelected={setFiles} label="Drop images here" sublabel="AI-powered background removal" />
        {files.length > 0 && (
          <button onClick={handleProcess} disabled={processing} className="btn btn-primary btn-lg converter-btn">
            <Icon name="BgRemove" size={20} />{processing ? 'Removing backgrounds...' : `Remove Background from ${files.length} Image${files.length > 1 ? 's' : ''}`}
          </button>
        )}
        <BatchProgress files={files} results={results} processing={processing} />
        {preview && <div style={{ textAlign: 'center', padding: 20, background: 'repeating-conic-gradient(#e2e8f0 0% 25%, transparent 0% 50%) 50% / 20px 20px', borderRadius: 'var(--radius-md)' }}><img src={preview} alt="Result" style={{ maxWidth: '100%', maxHeight: 400 }} /></div>}
      </div>
    </ToolPageWrapper>
  );
};
export default BackgroundRemover;
