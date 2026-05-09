import React, { useState } from 'react';
import ToolPageWrapper from '../../components/common/ToolPageWrapper';
import FileUploader from '../../components/common/FileUploader';
import { Icon } from '../../assets/icons/icons';
import meta from './meta';
const PdfMetadataEditor = () => {
  const [files, setFiles] = useState([]);
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [subject, setSubject] = useState('');
  const [keywords, setKeywords] = useState('');
  const [processing, setProcessing] = useState(false);
  const process = async () => {
    if (!files.length) return; setProcessing(true);
    try {
      const fd = new FormData(); fd.append('file', files[0]);
      fd.append('title', title); fd.append('author', author); fd.append('subject', subject); fd.append('keywords', keywords);
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/tools/pdf-metadata-editor/edit`, { method: 'POST', body: fd });
      if (!res.ok) throw new Error('Failed');
      const blob = await res.blob();
      const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'edited-metadata.pdf'; a.click();
    } catch (e) { alert(e.message); } finally { setProcessing(false); }
  };
  return (
    <ToolPageWrapper meta={meta}><FileUploader accept=".pdf" maxFiles={1} onFilesSelected={setFiles} multiple={false} label="Upload PDF" />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 16 }}>
        <div className="form-group"><label>Title</label><input type="text" value={title} onChange={e => setTitle(e.target.value)} className="calc-input" /></div>
        <div className="form-group"><label>Author</label><input type="text" value={author} onChange={e => setAuthor(e.target.value)} className="calc-input" /></div>
        <div className="form-group"><label>Subject</label><input type="text" value={subject} onChange={e => setSubject(e.target.value)} className="calc-input" /></div>
        <div className="form-group"><label>Keywords</label><input type="text" value={keywords} onChange={e => setKeywords(e.target.value)} className="calc-input" placeholder="comma, separated" /></div>
      </div>
      <button onClick={process} disabled={!files.length || processing} className="btn btn-primary" style={{ marginTop: 12 }}><Icon name="Download" size={18} />{processing ? 'Saving...' : 'Save Metadata'}</button>
    </ToolPageWrapper>
  );
};
export default PdfMetadataEditor;
