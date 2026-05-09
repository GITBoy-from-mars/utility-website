import React, { useState } from 'react';
import ToolPageWrapper from '../../components/common/ToolPageWrapper';
import { Icon } from '../../assets/icons/icons';
import meta from './meta';
import '../base64-encoder-decoder/Base64Tool.css';
const WORDS = 'lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua enim ad minim veniam quis nostrud exercitation ullamco laboris nisi aliquip ex ea commodo consequat duis aute irure in reprehenderit voluptate velit esse cillum fugiat nulla pariatur excepteur sint occaecat cupidatat non proident sunt culpa qui officia deserunt mollit anim id est laborum'.split(' ');
const randWord = () => WORDS[Math.floor(Math.random() * WORDS.length)];
const genSentence = (minW = 8, maxW = 18) => { const n = minW + Math.floor(Math.random() * (maxW - minW)); const s = Array.from({ length: n }, randWord).join(' '); return s.charAt(0).toUpperCase() + s.slice(1) + '.'; };
const genParagraph = (s = 5) => Array.from({ length: s }, () => genSentence()).join(' ');
const LoremIpsumGenerator = () => {
  const [count, setCount] = useState(3);
  const [type, setType] = useState('paragraphs');
  const [output, setOutput] = useState('');
  const generate = () => {
    if (type === 'paragraphs') setOutput(Array.from({ length: count }, () => genParagraph()).join('\n\n'));
    else if (type === 'sentences') setOutput(Array.from({ length: count }, () => genSentence()).join(' '));
    else setOutput(Array.from({ length: count }, randWord).join(' '));
  };
  return (
    <ToolPageWrapper meta={meta}>
      <div className="devtool">
        <div style={{ display: 'flex', gap: 12, alignItems: 'end', flexWrap: 'wrap' }}>
          <div className="form-group" style={{ flex: 1 }}><label>Count</label><input type="number" min="1" max="100" value={count} onChange={e => setCount(+e.target.value)} className="calc-input" /></div>
          <div className="form-group" style={{ flex: 1 }}><label>Type</label><select value={type} onChange={e => setType(e.target.value)} className="qr-select"><option value="paragraphs">Paragraphs</option><option value="sentences">Sentences</option><option value="words">Words</option></select></div>
        </div>
        <div className="devtool-actions"><button onClick={generate} className="btn btn-primary"><Icon name="Zap" size={18} />Generate</button><button onClick={() => navigator.clipboard.writeText(output)} disabled={!output} className="btn btn-ghost"><Icon name="File" size={18} />Copy</button></div>
        {output && <textarea className="devtool-textarea devtool-output" rows={10} value={output} readOnly />}
      </div>
    </ToolPageWrapper>
  );
};
export default LoremIpsumGenerator;
