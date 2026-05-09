import React, { useState } from 'react';
import ToolPageWrapper from '../../components/common/ToolPageWrapper';
import FileUploader from '../../components/common/FileUploader';
import BatchProgress from '../../components/common/BatchProgress';
import { Icon } from '../../assets/icons/icons';
import meta from './meta';
import '../pdf-to-word/PdfToWord.css';

const PdfCompressor = () => {
  const [files, setFiles] = useState([]);
  const [quality, setQuality] = useState('medium');
  const [results, setResults] = useState([]);
  const [processing, setProcessing] = useState(false);

  const handleProcess = async () => {
    if (!files.length) return;
    setProcessing(true);
    const nr = [];
    for (let i = 0; i < files.length; i++) {
      nr.push({ status: 'processing' }); setResults([...nr]);
      try {
        const fd = new FormData(); fd.append('file', files[i]); fd.append('quality', quality);
        const res = await fetch('/api/tools/pdf-compressor/compress', { method: 'POST', body: fd });
        if (!res.ok) throw new Error('Failed');
        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a'); a.href = url;
        a.download = files[i].name.replace('.pdf', '-compressed.pdf'); a.click();
        URL.revokeObjectURL(url); nr[i] = { status: 'done' };
      } catch (e) { nr[i] = { status: 'error', message: e.message }; }
      setResults([...nr]);
    }
    setProcessing(false);
  };

  return (
    <ToolPageWrapper meta={meta}>
      <div className="converter-tool">
        <FileUploader accept=".pdf" multiple maxSizeMB={50} onFilesSelected={setFiles} label="Drop PDF files here" />
        {files.length > 0 && (
          <>
            <div className="imgconv-options" style={{ gridTemplateColumns: '1fr' }}>
              <div className="form-group">
                <label>Compression Level</label>
                <select value={quality} onChange={e => setQuality(e.target.value)} className="qr-select">
                  <option value="low">Low (Best Quality)</option>
                  <option value="medium">Medium (Balanced)</option>
                  <option value="high">High (Smallest Size)</option>
                </select>
              </div>
            </div>
            <button onClick={handleProcess} disabled={processing} className="btn btn-primary btn-lg converter-btn">
              <Icon name="Compress" size={20} />{processing ? 'Compressing...' : `Compress ${files.length} PDF${files.length > 1 ? 's' : ''}`}
            </button>
          </>
        )}
        <BatchProgress files={files} results={results} processing={processing} />
      </div>
    </ToolPageWrapper>
  );
};
export default PdfCompressor;
