import React, { useState } from 'react';
import ToolPageWrapper from '../../components/common/ToolPageWrapper';
import FileUploader from '../../components/common/FileUploader';
import { Icon } from '../../assets/icons/icons';
import meta from './meta';
const UnlockPdf = () => {
  const [files, setFiles] = useState([]);
  const [password, setPassword] = useState('');
  const [processing, setProcessing] = useState(false);
  const process = async () => {
    if (!files.length) return; setProcessing(true);
    try {
      const fd = new FormData(); fd.append('file', files[0]); fd.append('password', password);
      const res = await fetch('/api/tools/unlock-pdf/unlock', { method: 'POST', body: fd });
      if (!res.ok) { const d = await res.json(); throw new Error(d.error || 'Failed'); }
      const blob = await res.blob();
      const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'unlocked.pdf'; a.click();
    } catch (e) { alert(e.message); } finally { setProcessing(false); }
  };
  return (
    <ToolPageWrapper meta={meta}><FileUploader accept=".pdf" maxFiles={1} onFilesSelected={setFiles} multiple={false} label="Upload Protected PDF" />
      <div className="form-group" style={{ marginTop: 16 }}><label>Password (if required)</label><input type="password" value={password} onChange={e => setPassword(e.target.value)} className="calc-input" placeholder="Enter PDF password" /></div>
      <button onClick={process} disabled={!files.length || processing} className="btn btn-primary" style={{ marginTop: 12 }}><Icon name="Download" size={18} />{processing ? 'Unlocking...' : 'Unlock PDF'}</button>
    </ToolPageWrapper>
  );
};
export default UnlockPdf;
