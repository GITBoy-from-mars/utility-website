import React, { useState } from 'react';
import ToolPageWrapper from '../../components/common/ToolPageWrapper';
import FileUploader from '../../components/common/FileUploader';
import BatchProgress from '../../components/common/BatchProgress';
import { Icon } from '../../assets/icons/icons';
import meta from './meta';
import './ImageConverter.css';

const formats = ['png', 'jpg', 'webp', 'gif', 'bmp', 'tiff'];

const ImageConverter = () => {
  const [files, setFiles] = useState([]);
  const [targetFormat, setTargetFormat] = useState('png');
  const [quality, setQuality] = useState(90);
  const [results, setResults] = useState([]);
  const [processing, setProcessing] = useState(false);

  const handleProcess = async () => {
    if (files.length === 0) return;
    setProcessing(true);
    const newResults = [];
    for (let i = 0; i < files.length; i++) {
      newResults.push({ status: 'processing' });
      setResults([...newResults]);
      try {
        const formData = new FormData();
        formData.append('file', files[i]);
        formData.append('format', targetFormat);
        formData.append('quality', quality);
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/tools/image-converter/convert`, { method: 'POST', body: formData });
        if (!res.ok) throw new Error('Conversion failed');
        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        const baseName = files[i].name.replace(/\.[^.]+$/, '');
        a.download = `${baseName}.${targetFormat}`;
        a.click();
        URL.revokeObjectURL(url);
        newResults[i] = { status: 'done' };
      } catch (err) {
        newResults[i] = { status: 'error', message: err.message };
      }
      setResults([...newResults]);
    }
    setProcessing(false);
  };

  return (
    <ToolPageWrapper meta={meta}>
      <div className="converter-tool">
        <FileUploader accept="image/*" multiple={true} maxSizeMB={50} onFilesSelected={setFiles} label="Drop images here or click to browse" sublabel="PNG, JPG, WebP, GIF, BMP, TIFF supported" />
        {files.length > 0 && (
          <>
            <div className="imgconv-options">
              <div className="form-group">
                <label htmlFor="target-format">Convert to</label>
                <select id="target-format" value={targetFormat} onChange={(e) => setTargetFormat(e.target.value)} className="qr-select">
                  {formats.map((f) => <option key={f} value={f}>{f.toUpperCase()}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="img-quality">Quality: {quality}%</label>
                <input id="img-quality" type="range" min="10" max="100" value={quality} onChange={(e) => setQuality(Number(e.target.value))} className="imgconv-range" />
              </div>
            </div>
            <button onClick={handleProcess} disabled={processing} className="btn btn-primary btn-lg converter-btn">
              <Icon name="ArrowsExchange" size={20} />
              {processing ? 'Converting...' : `Convert ${files.length} Image${files.length > 1 ? 's' : ''} to ${targetFormat.toUpperCase()}`}
            </button>
          </>
        )}
        <BatchProgress files={files} results={results} processing={processing} />
      </div>
    </ToolPageWrapper>
  );
};

export default ImageConverter;
