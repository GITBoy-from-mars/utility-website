import React, { useState } from 'react';
import ToolPageWrapper from '../../components/common/ToolPageWrapper';
import FileUploader from '../../components/common/FileUploader';
import { Icon } from '../../assets/icons/icons';
import meta from './meta';
const RotatePdfPages = () => {
  const [files, setFiles] = useState([]);
  const [angle, setAngle] = useState('90');
  const [pages, setPages] = useState('');
  const [processing, setProcessing] = useState(false);
  const process = async () => {
    if (!files.length) return; setProcessing(true);
    try {
      const fd = new FormData(); fd.append('file', files[0]); fd.append('angle', angle); fd.append('pages', pages);
      const res = await fetch('/api/tools/rotate-pdf-pages/rotate', { method: 'POST', body: fd });
      if (!res.ok) throw new Error('Failed');
      const blob = await res.blob();
      const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'rotated.pdf'; a.click();
    } catch (e) { alert(e.message); } finally { setProcessing(false); }
  };
  return (
    <ToolPageWrapper meta={meta}>
      <FileUploader accept=".pdf" maxFiles={1} onFilesSelected={setFiles} multiple={false} label="Upload PDF" />
      <div style={{ display: 'flex', gap: 12, marginTop: 16, flexWrap: 'wrap' }}>
        <div className="form-group" style={{ flex: 1 }}><label>Rotation Angle</label><select value={angle} onChange={e => setAngle(e.target.value)} className="qr-select"><option value="90">90° Clockwise</option><option value="180">180°</option><option value="270">270° (90° Counter-clockwise)</option></select></div>
        <div className="form-group" style={{ flex: 1 }}><label>Pages (blank = all)</label><input type="text" value={pages} onChange={e => setPages(e.target.value)} className="calc-input" placeholder="e.g., 1,3,5-8" /></div>
      </div>
      <button onClick={process} disabled={!files.length || processing} className="btn btn-primary" style={{ marginTop: 12 }}><Icon name="Download" size={18} />{processing ? 'Processing...' : 'Rotate Pages'}</button>
    </ToolPageWrapper>
  );
};
export default RotatePdfPages;
