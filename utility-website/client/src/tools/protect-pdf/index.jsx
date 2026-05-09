import React, { useState } from 'react';
import ToolPageWrapper from '../../components/common/ToolPageWrapper';
import FileUploader from '../../components/common/FileUploader';
import { Icon } from '../../assets/icons/icons';
import meta from './meta';
const ProtectPdf = () => {
  const [file, setFile] = useState(null);
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const process = async () => {
    if (!file || !password) return;
    setLoading(true); setError('');
    try {
      const fd = new FormData(); fd.append('file', file); fd.append('password', password);
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/tools/protect-pdf/protect`, { method: 'POST', body: fd });
      if (!res.ok) throw new Error('Failed to protect PDF');
      const blob = await res.blob();
      const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = `protected_${file.name}`; a.click();
    } catch (e) { setError(e.message); } finally { setLoading(false); }
  };
  return (
    <ToolPageWrapper meta={meta}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <FileUploader accept=".pdf" multiple={false} onFilesSelected={files => setFile(files[0])} label="Upload PDF to protect" />
        {file && <div className="form-group"><label>Set Password</label><input type="password" value={password} onChange={e => setPassword(e.target.value)} className="calc-input" placeholder="Enter a strong password" /></div>}
        {file && password && <button onClick={process} disabled={loading} className="btn btn-primary"><Icon name="Shield" size={18} />{loading ? 'Protecting...' : 'Protect PDF'}</button>}
        {error && <p style={{ color: 'var(--error)' }}>{error}</p>}
      </div>
    </ToolPageWrapper>
  );
};
export default ProtectPdf;
