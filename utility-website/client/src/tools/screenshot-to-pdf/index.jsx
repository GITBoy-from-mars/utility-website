import React, { useState } from 'react';
import ToolPageWrapper from '../../components/common/ToolPageWrapper';
import FileUploader from '../../components/common/FileUploader';
import { Icon } from '../../assets/icons/icons';
import meta from './meta';
import '../pdf-to-word/PdfToWord.css';

const ScreenshotToPdf = () => {
  const [files, setFiles] = useState([]);
  const [processing, setProcessing] = useState(false);
  const [done, setDone] = useState(false);

  const handleProcess = async () => {
    if (!files.length) return;
    setProcessing(true); setDone(false);
    try {
      const fd = new FormData();
      files.forEach(f => fd.append('files', f));
      const res = await fetch('/api/tools/screenshot-to-pdf/convert', { method: 'POST', body: fd });
      if (!res.ok) throw new Error('Failed');
      const blob = await res.blob();
      const a = document.createElement('a'); a.href = URL.createObjectURL(blob);
      a.download = 'screenshots.pdf'; a.click(); setDone(true);
    } catch (e) { console.error(e); }
    setProcessing(false);
  };

  return (
    <ToolPageWrapper meta={meta}>
      <div className="converter-tool">
        <FileUploader accept="image/*" multiple maxSizeMB={50} onFilesSelected={setFiles} label="Drop screenshots/images here" sublabel="Each image becomes a page in the PDF" />
        {files.length > 0 && (
          <button onClick={handleProcess} disabled={processing} className="btn btn-primary btn-lg converter-btn">
            <Icon name="Screenshot" size={20} />{processing ? 'Converting...' : `Convert ${files.length} Image${files.length > 1 ? 's' : ''} to PDF`}
          </button>
        )}
        {done && <div className="badge badge-success" style={{ padding: '12px 20px', fontSize: '0.875rem' }}>PDF downloaded!</div>}
      </div>
    </ToolPageWrapper>
  );
};
export default ScreenshotToPdf;
