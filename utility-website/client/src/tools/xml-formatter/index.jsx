import React, { useState } from 'react';
import ToolPageWrapper from '../../components/common/ToolPageWrapper';
import { Icon } from '../../assets/icons/icons';
import meta from './meta';
import '../base64-encoder-decoder/Base64Tool.css';
const formatXml = (xml, indent = '  ') => {
  let formatted = '', level = 0;
  xml.replace(/>\s*</g, '><').split(/(<[^>]+>)/g).filter(Boolean).forEach(node => {
    if (node.match(/^<\/\w/)) level--;
    formatted += indent.repeat(Math.max(0, level)) + node + '\n';
    if (node.match(/^<\w[^>]*[^/]>$/)) level++;
  });
  return formatted.trim();
};
const XmlFormatter = () => {
  const [input, setInput] = useState('<root><person><name>John</name><age>30</age><city>NYC</city></person><person><name>Jane</name><age>25</age></person></root>');
  const [output, setOutput] = useState('');
  return (
    <ToolPageWrapper meta={meta}>
      <div className="devtool">
        <div className="form-group"><label>XML Input</label><textarea className="devtool-textarea" rows={8} value={input} onChange={e => setInput(e.target.value)} style={{ fontFamily: 'monospace', fontSize: '0.813rem' }} /></div>
        <div className="devtool-actions">
          <button onClick={() => setOutput(formatXml(input))} className="btn btn-primary btn-sm"><Icon name="Code" size={14} />Format</button>
          <button onClick={() => setOutput(input.replace(/>\s+</g, '><').trim())} className="btn btn-secondary btn-sm">Minify</button>
          {output && <button onClick={() => navigator.clipboard.writeText(output)} className="btn btn-ghost btn-sm"><Icon name="File" size={14} />Copy</button>}
        </div>
        {output && <div className="form-group"><label>Formatted</label><textarea className="devtool-textarea devtool-output" rows={14} value={output} readOnly style={{ fontFamily: 'monospace', fontSize: '0.813rem' }} /></div>}
      </div>
    </ToolPageWrapper>
  );
};
export default XmlFormatter;
