import React, { useState } from 'react';
import ToolPageWrapper from '../../components/common/ToolPageWrapper';
import FileUploader from '../../components/common/FileUploader';
import BatchProgress from '../../components/common/BatchProgress';
import { Icon } from '../../assets/icons/icons';
import meta from './meta';
import '../pdf-to-word/PdfToWord.css';
import '../image-converter/ImageConverter.css';

const presets = [
  { label: 'Custom', w: '', h: '' },
  { label: 'Instagram Post (1080x1080)', w: 1080, h: 1080 },
  { label: 'Facebook Cover (820x312)', w: 820, h: 312 },
  { label: 'Twitter Header (1500x500)', w: 1500, h: 500 },
  { label: 'YouTube Thumbnail (1280x720)', w: 1280, h: 720 },
  { label: 'LinkedIn Banner (1584x396)', w: 1584, h: 396 },
];

const ImageResizerCropper = () => {
  const [files, setFiles] = useState([]);
  const [width, setWidth] = useState('');
  const [height, setHeight] = useState('');
  const [mode, setMode] = useState('resize');
  const [results, setResults] = useState([]);
  const [processing, setProcessing] = useState(false);

  const applyPreset = (p) => { if (p.w) { setWidth(p.w); setHeight(p.h); } };

  const handleProcess = async () => {
    if (!files.length || !width || !height) return;
    setProcessing(true);
    const nr = [];
    for (let i = 0; i < files.length; i++) {
      nr.push({ status: 'processing' }); setResults([...nr]);
      try {
        const fd = new FormData(); fd.append('file', files[i]);
        fd.append('width', width); fd.append('height', height); fd.append('mode', mode);
        const res = await fetch('/api/tools/image-resizer-cropper/process', { method: 'POST', body: fd });
        if (!res.ok) throw new Error('Failed');
        const blob = await res.blob();
        const a = document.createElement('a'); a.href = URL.createObjectURL(blob);
        a.download = `${mode}d-${files[i].name}`; a.click(); nr[i] = { status: 'done' };
      } catch (e) { nr[i] = { status: 'error', message: e.message }; }
      setResults([...nr]);
    }
    setProcessing(false);
  };

  return (
    <ToolPageWrapper meta={meta}>
      <div className="converter-tool">
        <FileUploader accept="image/*" multiple maxSizeMB={50} onFilesSelected={setFiles} label="Drop images here" />
        {files.length > 0 && (
          <>
            <div className="imgconv-options">
              <div className="form-group"><label>Preset</label><select onChange={e => applyPreset(presets[e.target.selectedIndex])} className="qr-select">{presets.map((p, i) => <option key={i}>{p.label}</option>)}</select></div>
              <div className="form-group"><label>Mode</label><select value={mode} onChange={e => setMode(e.target.value)} className="qr-select"><option value="resize">Resize</option><option value="crop">Crop (Center)</option></select></div>
              <div className="form-group"><label>Width (px)</label><input type="number" value={width} onChange={e => setWidth(e.target.value)} placeholder="e.g. 1920" className="qr-textarea" style={{ minHeight: 'auto', padding: '10px 14px' }} /></div>
              <div className="form-group"><label>Height (px)</label><input type="number" value={height} onChange={e => setHeight(e.target.value)} placeholder="e.g. 1080" className="qr-textarea" style={{ minHeight: 'auto', padding: '10px 14px' }} /></div>
            </div>
            <button onClick={handleProcess} disabled={processing || !width || !height} className="btn btn-primary btn-lg converter-btn">
              <Icon name="Crop" size={20} />{processing ? 'Processing...' : `${mode === 'resize' ? 'Resize' : 'Crop'} ${files.length} Image${files.length > 1 ? 's' : ''}`}
            </button>
          </>
        )}
        <BatchProgress files={files} results={results} processing={processing} />
      </div>
    </ToolPageWrapper>
  );
};
export default ImageResizerCropper;
