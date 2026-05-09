import React, { useState } from 'react';
import ToolPageWrapper from '../../components/common/ToolPageWrapper';
import FileUploader from '../../components/common/FileUploader';
import BatchProgress from '../../components/common/BatchProgress';
import { Icon } from '../../assets/icons/icons';
import meta from './meta';
import '../pdf-to-word/PdfToWord.css';
import '../image-converter/ImageConverter.css';

const PdfWatermark = () => {
  const [files, setFiles] = useState([]);
  const [text, setText] = useState('CONFIDENTIAL');
  const [opacity, setOpacity] = useState(30);
  const [fontSize, setFontSize] = useState(48);
  const [results, setResults] = useState([]);
  const [processing, setProcessing] = useState(false);

  const handleProcess = async () => {
    if (!files.length) return;
    setProcessing(true);
    const nr = [];
    for (let i = 0; i < files.length; i++) {
      nr.push({ status: 'processing' }); setResults([...nr]);
      try {
        const fd = new FormData(); fd.append('file', files[i]);
        fd.append('text', text); fd.append('opacity', opacity); fd.append('fontSize', fontSize);
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/tools/pdf-watermark/apply`, { method: 'POST', body: fd });
        if (!res.ok) throw new Error('Failed');
        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a'); a.href = url;
        a.download = files[i].name.replace('.pdf', '-watermarked.pdf'); a.click();
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
            <div className="imgconv-options">
              <div className="form-group"><label>Watermark Text</label><input type="text" value={text} onChange={e => setText(e.target.value)} className="qr-textarea" style={{ minHeight: 'auto', padding: '12px 16px' }} /></div>
              <div className="form-group"><label>Font Size: {fontSize}px</label><input type="range" min="12" max="120" value={fontSize} onChange={e => setFontSize(Number(e.target.value))} className="imgconv-range" /></div>
              <div className="form-group" style={{ gridColumn: '1/-1' }}><label>Opacity: {opacity}%</label><input type="range" min="5" max="100" value={opacity} onChange={e => setOpacity(Number(e.target.value))} className="imgconv-range" /></div>
            </div>
            <button onClick={handleProcess} disabled={processing} className="btn btn-primary btn-lg converter-btn">
              <Icon name="Watermark" size={20} />{processing ? 'Applying...' : `Apply Watermark to ${files.length} PDF${files.length > 1 ? 's' : ''}`}
            </button>
          </>
        )}
        <BatchProgress files={files} results={results} processing={processing} />
      </div>
    </ToolPageWrapper>
  );
};
export default PdfWatermark;
