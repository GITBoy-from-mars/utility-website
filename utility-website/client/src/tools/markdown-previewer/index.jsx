import React, { useState, useMemo } from 'react';
import { marked } from 'marked';
import ToolPageWrapper from '../../components/common/ToolPageWrapper';
import meta from './meta';
import './MarkdownPreviewer.css';

const defaultMd = `# Hello World\n\nThis is a **Markdown** previewer. Try editing this text!\n\n## Features\n- Live preview\n- GitHub Flavored Markdown\n- Code highlighting\n\n\`\`\`javascript\nconst greeting = "Hello!";\nconsole.log(greeting);\n\`\`\`\n\n> Blockquotes work too!\n\n| Column 1 | Column 2 |\n|----------|----------|\n| Cell 1   | Cell 2   |\n`;

const MarkdownPreviewer = () => {
  const [md, setMd] = useState(defaultMd);
  const html = useMemo(() => marked.parse(md, { breaks: true, gfm: true }), [md]);

  const download = () => {
    const blob = new Blob([md], { type: 'text/markdown' });
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob);
    a.download = 'document.md'; a.click();
  };

  return (
    <ToolPageWrapper meta={meta}>
      <div className="md-tool">
        <div className="md-toolbar">
          <span className="md-toolbar-label">Editor</span>
          <button onClick={download} className="btn btn-ghost btn-sm">Download .md</button>
        </div>
        <div className="md-panels">
          <textarea className="md-editor" value={md} onChange={e => setMd(e.target.value)} spellCheck="false" />
          <div className="md-preview" dangerouslySetInnerHTML={{ __html: html }} />
        </div>
      </div>
    </ToolPageWrapper>
  );
};
export default MarkdownPreviewer;
