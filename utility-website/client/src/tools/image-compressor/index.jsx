import React, { useState } from 'react';
import ToolPageWrapper from '../../components/common/ToolPageWrapper';
import FileUploader from '../../components/common/FileUploader';
import BatchProgress from '../../components/common/BatchProgress';
import { Icon } from '../../assets/icons/icons';
import meta from './meta';
import '../pdf-to-word/PdfToWord.css';
import '../image-converter/ImageConverter.css';

const ImageCompressor = () => {
  const [files, setFiles] = useState([]);
  const [quality, setQuality] = useState(75);
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
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/tools/image-compressor/compress`, { method: 'POST', body: fd });
        if (!res.ok) throw new Error('Failed');
        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a'); a.href = url;
        a.download = `compressed-${files[i].name}`; a.click();
        URL.revokeObjectURL(url); nr[i] = { status: 'done' };
      } catch (e) { nr[i] = { status: 'error', message: e.message }; }
      setResults([...nr]);
    }
    setProcessing(false);
  };

  return (
    <ToolPageWrapper meta={meta}>
      <div className="converter-tool">
        <FileUploader accept="image/*" multiple maxSizeMB={50} onFilesSelected={setFiles} label="Drop images here" sublabel="PNG, JPG, WebP supported" />
        {files.length > 0 && (
          <>
            <div className="imgconv-options" style={{ gridTemplateColumns: '1fr' }}>
              <div className="form-group">
                <label>Quality: {quality}%</label>
                <input type="range" min="10" max="100" value={quality} onChange={e => setQuality(Number(e.target.value))} className="imgconv-range" />
              </div>
            </div>
            <button onClick={handleProcess} disabled={processing} className="btn btn-primary btn-lg converter-btn">
              <Icon name="Compress" size={20} />{processing ? 'Compressing...' : `Compress ${files.length} Image${files.length > 1 ? 's' : ''}`}
            </button>
          </>
        )}
        <BatchProgress files={files} results={results} processing={processing} />
      </div>
    </ToolPageWrapper>
  );
};
export default ImageCompressor;
