import React, { useState } from 'react';
import ToolPageWrapper from '../../components/common/ToolPageWrapper';
import FileUploader from '../../components/common/FileUploader';
import { Icon } from '../../assets/icons/icons';
import meta from './meta';
import './PdfMergerSplitter.css';

const PdfMergerSplitter = () => {
  const [mode, setMode] = useState('merge');
  const [files, setFiles] = useState([]);
  const [splitPages, setSplitPages] = useState('');
  const [processing, setProcessing] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');

  const handleProcess = async () => {
    if (!files.length) return;
    setProcessing(true); setError(''); setDone(false);
    try {
      const fd = new FormData();
      files.forEach(f => fd.append('files', f));
      fd.append('mode', mode);
      if (mode === 'split') fd.append('pages', splitPages);
      const res = await fetch('/api/tools/pdf-merger-splitter/process', { method: 'POST', body: fd });
      if (!res.ok) throw new Error('Processing failed');
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a'); a.href = url;
      a.download = mode === 'merge' ? 'merged.pdf' : 'split-pages.zip'; a.click();
      URL.revokeObjectURL(url); setDone(true);
    } catch (e) { setError(e.message); }
    setProcessing(false);
  };

  return (
    <ToolPageWrapper meta={meta}>
      <div className="converter-tool">
        <div className="pms-mode-toggle">
          <button className={`pms-mode-btn ${mode === 'merge' ? 'active' : ''}`} onClick={() => setMode('merge')}>Merge PDFs</button>
          <button className={`pms-mode-btn ${mode === 'split' ? 'active' : ''}`} onClick={() => setMode('split')}>Split PDF</button>
        </div>
        <FileUploader accept=".pdf" multiple={mode === 'merge'} maxSizeMB={50} onFilesSelected={setFiles}
          label={mode === 'merge' ? 'Drop multiple PDFs to merge' : 'Drop a PDF to split'}
          sublabel={mode === 'merge' ? 'Files will be merged in upload order' : 'Split into individual pages'} />
        {mode === 'split' && files.length > 0 && (
          <div className="form-group">
            <label>Page ranges (optional, e.g. 1-3, 5, 7-10)</label>
            <input type="text" value={splitPages} onChange={e => setSplitPages(e.target.value)} placeholder="Leave empty to split all pages" className="qr-textarea" style={{ minHeight: 'auto', padding: '12px 16px' }} />
          </div>
        )}
        {files.length > 0 && (
          <button onClick={handleProcess} disabled={processing} className="btn btn-primary btn-lg converter-btn">
            <Icon name="Merge" size={20} />{processing ? 'Processing...' : mode === 'merge' ? `Merge ${files.length} PDFs` : 'Split PDF'}
          </button>
        )}
        {done && <div className="badge badge-success" style={{ padding: '12px 20px', fontSize: '0.875rem' }}>Done! File downloaded.</div>}
        {error && <div style={{ color: 'var(--error)', fontSize: '0.875rem' }}>{error}</div>}
      </div>
    </ToolPageWrapper>
  );
};
export default PdfMergerSplitter;
