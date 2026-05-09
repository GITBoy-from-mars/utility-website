import React, { useState } from 'react';
import ToolPageWrapper from '../../components/common/ToolPageWrapper';
import { Icon } from '../../assets/icons/icons';
import meta from './meta';
import '../base64-encoder-decoder/Base64Tool.css';
const KEYWORDS = ['SELECT','FROM','WHERE','AND','OR','INSERT','INTO','VALUES','UPDATE','SET','DELETE','CREATE','TABLE','ALTER','DROP','JOIN','INNER','LEFT','RIGHT','OUTER','ON','ORDER','BY','GROUP','HAVING','LIMIT','OFFSET','UNION','AS','IN','NOT','NULL','IS','BETWEEN','LIKE','EXISTS','CASE','WHEN','THEN','ELSE','END','DISTINCT','COUNT','SUM','AVG','MAX','MIN'];
const formatSQL = (sql) => {
  let result = sql.trim();
  KEYWORDS.forEach(k => { result = result.replace(new RegExp(`\\b${k}\\b`, 'gi'), `\n${k}`); });
  result = result.replace(/,\s*/g, ',\n  ');
  result = result.replace(/^\n/, '');
  return result.split('\n').map(l => l.trimEnd()).join('\n');
};
const SqlFormatter = () => {
  const [input, setInput] = useState('SELECT users.name, users.email, orders.total FROM users INNER JOIN orders ON users.id = orders.user_id WHERE orders.total > 100 AND users.active = 1 ORDER BY orders.total DESC LIMIT 10');
  const [output, setOutput] = useState('');
  return (
    <ToolPageWrapper meta={meta}>
      <div className="devtool">
        <div className="form-group"><label>SQL Query</label><textarea className="devtool-textarea" rows={6} value={input} onChange={e => setInput(e.target.value)} style={{ fontFamily: 'monospace', fontSize: '0.813rem' }} /></div>
        <div className="devtool-actions">
          <button onClick={() => setOutput(formatSQL(input))} className="btn btn-primary btn-sm"><Icon name="Code" size={14} />Format</button>
          <button onClick={() => setOutput(input.replace(/\s+/g, ' ').trim())} className="btn btn-secondary btn-sm">Minify</button>
          {output && <button onClick={() => navigator.clipboard.writeText(output)} className="btn btn-ghost btn-sm"><Icon name="File" size={14} />Copy</button>}
        </div>
        {output && <div className="form-group"><label>Formatted</label><textarea className="devtool-textarea devtool-output" rows={12} value={output} readOnly style={{ fontFamily: 'monospace', fontSize: '0.813rem' }} /></div>}
      </div>
    </ToolPageWrapper>
  );
};
export default SqlFormatter;
