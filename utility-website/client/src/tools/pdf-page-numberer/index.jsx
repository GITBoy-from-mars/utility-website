import React, { useState } from 'react';
import ToolPageWrapper from '../../components/common/ToolPageWrapper';
import FileUploader from '../../components/common/FileUploader';
import { Icon } from '../../assets/icons/icons';
import meta from './meta';
const PdfPageNumberer = () => {
  const [files, setFiles] = useState([]);
  const [position, setPosition] = useState('bottom-center');
  const [processing, setProcessing] = useState(false);
  const process = async () => {
    if (!files.length) return;
    setProcessing(true);
    try {
      const fd = new FormData();
      fd.append('file', files[0]);
      fd.append('position', position);
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/tools/pdf-page-numberer/number`, { method: 'POST', body: fd });
      if (!res.ok) throw new Error('Failed');
      const blob = await res.blob();
      const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'numbered.pdf'; a.click();
    } catch (e) { alert(e.message); } finally { setProcessing(false); }
  };
  return (
    <ToolPageWrapper meta={meta}>
      <FileUploader accept=".pdf" maxFiles={1} onFilesSelected={setFiles} multiple={false} label="Upload PDF" />
      <div style={{ marginTop: 16 }} className="form-group"><label>Position</label>
        <select value={position} onChange={e => setPosition(e.target.value)} className="qr-select"><option value="bottom-center">Bottom Center</option><option value="bottom-right">Bottom Right</option><option value="top-center">Top Center</option><option value="top-right">Top Right</option></select>
      </div>
      <button onClick={process} disabled={!files.length || processing} className="btn btn-primary" style={{ marginTop: 12 }}><Icon name="Download" size={18} />{processing ? 'Processing...' : 'Add Page Numbers'}</button>
    </ToolPageWrapper>
  );
};
export default PdfPageNumberer;
