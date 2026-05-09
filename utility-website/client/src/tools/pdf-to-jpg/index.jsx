import React, { useState } from 'react';
import ToolPageWrapper from '../../components/common/ToolPageWrapper';
import FileUploader from '../../components/common/FileUploader';
import { Icon } from '../../assets/icons/icons';
import meta from './meta';
const PdfToJpg = () => {
  const [file, setFile] = useState(null);
  const [format, setFormat] = useState('jpg');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const convert = async () => {
    if (!file) return;
    setLoading(true); setError('');
    try {
      const fd = new FormData(); fd.append('file', file); fd.append('format', format);
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/tools/pdf-to-jpg/convert`, { method: 'POST', body: fd });
      if (!res.ok) throw new Error('Conversion failed');
      const blob = await res.blob();
      const ext = blob.type.includes('zip') ? 'zip' : format;
      const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = `${file.name.replace('.pdf', '')}_pages.${ext}`; a.click();
    } catch (e) { setError(e.message); } finally { setLoading(false); }
  };
  return (
    <ToolPageWrapper meta={meta}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <FileUploader accept=".pdf" multiple={false} onFilesSelected={files => setFile(files[0])} label="Upload PDF to convert" />
        {file && (<>
          <div className="form-group"><label>Output Format</label><select value={format} onChange={e => setFormat(e.target.value)} className="calc-input"><option value="jpg">JPG</option><option value="png">PNG</option></select></div>
          <button onClick={convert} disabled={loading} className="btn btn-primary"><Icon name="ArrowsExchange" size={18} />{loading ? 'Converting...' : 'Convert to Images'}</button>
        </>)}
        {error && <p style={{ color: 'var(--error)' }}>{error}</p>}
      </div>
    </ToolPageWrapper>
  );
};
export default PdfToJpg;
