import React, { useState } from 'react';
import ToolPageWrapper from '../../components/common/ToolPageWrapper';
import { Icon } from '../../assets/icons/icons';
import meta from './meta';
import '../base64-encoder-decoder/Base64Tool.css';
const EmailExtractor = () => {
  const [input, setInput] = useState('');
  const [emails, setEmails] = useState([]);
  const extract = () => {
    const matches = input.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g) || [];
    setEmails([...new Set(matches)]);
  };
  return (
    <ToolPageWrapper meta={meta}>
      <div className="devtool">
        <div className="form-group"><label>Paste your text content</label><textarea className="devtool-textarea" rows={8} value={input} onChange={e => setInput(e.target.value)} placeholder="Paste any text containing email addresses..." /></div>
        <div className="devtool-actions"><button onClick={extract} disabled={!input} className="btn btn-primary"><Icon name="Search" size={18} />Extract Emails</button><button onClick={() => navigator.clipboard.writeText(emails.join('\n'))} disabled={!emails.length} className="btn btn-ghost"><Icon name="File" size={18} />Copy All</button></div>
        {emails.length > 0 && (<>
          <p style={{ fontSize: '0.875rem', color: 'var(--neutral-500)' }}>{emails.length} unique email{emails.length !== 1 ? 's' : ''} found</p>
          <textarea className="devtool-textarea devtool-output" rows={Math.min(10, emails.length + 1)} value={emails.join('\n')} readOnly />
        </>)}
      </div>
    </ToolPageWrapper>
  );
};
export default EmailExtractor;
