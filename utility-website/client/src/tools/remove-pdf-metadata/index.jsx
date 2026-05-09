import React, { useState } from 'react';
import ToolPageWrapper from '../../components/common/ToolPageWrapper';
import FileUploader from '../../components/common/FileUploader';
import { Icon } from '../../assets/icons/icons';
import meta from './meta';
const RemovePdfMetadata = () => {
  const [files, setFiles] = useState([]);
  const [processing, setProcessing] = useState(false);
  const process = async () => {
    if (!files.length) return; setProcessing(true);
    try {
      const fd = new FormData(); fd.append('file', files[0]);
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/tools/remove-pdf-metadata/clean`, { method: 'POST', body: fd });
      if (!res.ok) throw new Error('Failed');
      const blob = await res.blob();
      const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'cleaned.pdf'; a.click();
    } catch (e) { alert(e.message); } finally { setProcessing(false); }
  };
  return (
    <ToolPageWrapper meta={meta}><FileUploader accept=".pdf" onFilesSelected={setFiles} multiple={false} label="Upload PDF" />
      <button onClick={process} disabled={!files.length || processing} className="btn btn-primary" style={{ marginTop: 16 }}><Icon name="Shield" size={18} />{processing ? 'Cleaning...' : 'Remove All Metadata'}</button>
    </ToolPageWrapper>
  );
};
export default RemovePdfMetadata;
