import React, { useState } from 'react';
import ToolPageWrapper from '../../components/common/ToolPageWrapper';
import { Icon } from '../../assets/icons/icons';
import meta from './meta';
import '../base64-encoder-decoder/Base64Tool.css';
const UrlSlugGenerator = () => {
  const [input, setInput] = useState('');
  const slug = input.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/[\s_]+/g, '-').replace(/^-+|-+$/g, '');
  return (
    <ToolPageWrapper meta={meta}>
      <div className="devtool">
        <div className="form-group"><label>Enter title or text</label><input className="devtool-textarea" style={{ minHeight: 'auto', padding: '14px 16px' }} value={input} onChange={e => setInput(e.target.value)} placeholder="My Awesome Blog Post Title" /></div>
        <div className="form-group"><label>URL Slug</label><div style={{ display: 'flex', gap: 8 }}><input className="devtool-textarea devtool-output" style={{ minHeight: 'auto', padding: '14px 16px', flex: 1 }} value={slug} readOnly /><button onClick={() => navigator.clipboard.writeText(slug)} disabled={!slug} className="btn btn-secondary"><Icon name="File" size={18} />Copy</button></div></div>
      </div>
    </ToolPageWrapper>
  );
};
export default UrlSlugGenerator;
