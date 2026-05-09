import React, { useState } from 'react';
import ToolPageWrapper from '../../components/common/ToolPageWrapper';
import FileUploader from '../../components/common/FileUploader';
import { Icon } from '../../assets/icons/icons';
import meta from './meta';
import '../ocr-tool/OcrTool.css';

const ImageToText = () => {
  const [files, setFiles] = useState([]);
  const [text, setText] = useState('');
  const [processing, setProcessing] = useState(false);

  const handleProcess = async () => {
    if (!files.length) return;
    setProcessing(true); setText('');
    try {
      const fd = new FormData(); fd.append('file', files[0]);
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/tools/image-to-text/extract`, { method: 'POST', body: fd });
      if (!res.ok) throw new Error('Failed');
      const data = await res.json();
      setText(data.text);
    } catch (e) { setText('Error: ' + e.message); }
    setProcessing(false);
  };

  return (
    <ToolPageWrapper meta={meta}>
      <div className="converter-tool">
        <FileUploader accept="image/*" multiple={false} maxSizeMB={20} onFilesSelected={setFiles} label="Drop an image here" sublabel="PNG, JPG, WebP, BMP, TIFF" />
        {files.length > 0 && (
          <button onClick={handleProcess} disabled={processing} className="btn btn-primary btn-lg converter-btn">
            <Icon name="Ocr" size={20} />{processing ? 'Extracting...' : 'Extract Text'}
          </button>
        )}
        {text && (
          <div className="ocr-result">
            <div className="ocr-result-header"><span>Extracted Text</span>
              <button onClick={() => navigator.clipboard.writeText(text)} className="btn btn-ghost btn-sm"><Icon name="File" size={14} />Copy</button>
            </div>
            <textarea className="ocr-textarea" value={text} onChange={e => setText(e.target.value)} rows={10} />
          </div>
        )}
      </div>
    </ToolPageWrapper>
  );
};
export default ImageToText;
