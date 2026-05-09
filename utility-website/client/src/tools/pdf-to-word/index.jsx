import React, { useState } from 'react';
import ToolPageWrapper from '../../components/common/ToolPageWrapper';
import FileUploader from '../../components/common/FileUploader';
import BatchProgress from '../../components/common/BatchProgress';
import { Icon } from '../../assets/icons/icons';
import meta from './meta';
import './PdfToWord.css';

const PdfToWord = () => {
  const [files, setFiles] = useState([]);
  const [results, setResults] = useState([]);
  const [processing, setProcessing] = useState(false);

  const handleProcess = async () => {
    if (files.length === 0) return;
    setProcessing(true);
    const newResults = [];
    for (let i = 0; i < files.length; i++) {
      newResults.push({ status: 'processing' });
      setResults([...newResults]);
      try {
        const formData = new FormData();
        formData.append('file', files[i]);
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/tools/pdf-to-word/convert`, { method: 'POST', body: formData });
        if (!res.ok) throw new Error('Conversion failed');
        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = files[i].name.replace(/\.pdf$/i, '.docx');
        a.click();
        URL.revokeObjectURL(url);
        newResults[i] = { status: 'done' };
      } catch (err) {
        newResults[i] = { status: 'error', message: err.message };
      }
      setResults([...newResults]);
    }
    setProcessing(false);
  };

  return (
    <ToolPageWrapper meta={meta}>
      <div className="converter-tool">
        <FileUploader accept=".pdf" multiple={true} maxSizeMB={50} onFilesSelected={setFiles} label="Drop PDF files here or click to browse" sublabel="Supports batch conversion · Max 50MB per file" />
        {files.length > 0 && (
          <button onClick={handleProcess} disabled={processing} className="btn btn-primary btn-lg converter-btn">
            <Icon name="ArrowsExchange" size={20} />
            {processing ? 'Converting...' : `Convert ${files.length} File${files.length > 1 ? 's' : ''} to Word`}
          </button>
        )}
        <BatchProgress files={files} results={results} processing={processing} />
      </div>
    </ToolPageWrapper>
  );
};

export default PdfToWord;
