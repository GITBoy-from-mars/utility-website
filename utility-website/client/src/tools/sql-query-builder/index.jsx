import React, { useState, useMemo } from 'react';
import ToolPageWrapper from '../../components/common/ToolPageWrapper';
import { Icon } from '../../assets/icons/icons';
import meta from './meta';
import '../base64-encoder-decoder/Base64Tool.css';

const SqlQueryBuilder = () => {
  const [queryType, setQueryType] = useState('SELECT');
  const [table, setTable] = useState('users');
  const [columns, setColumns] = useState('id, name, email');
  const [whereCol, setWhereCol] = useState('');
  const [whereOp, setWhereOp] = useState('=');
  const [whereVal, setWhereVal] = useState('');
  const [orderBy, setOrderBy] = useState('');
  const [orderDir, setOrderDir] = useState('ASC');
  const [limit, setLimit] = useState('');
  const [joinTable, setJoinTable] = useState('');
  const [joinOn, setJoinOn] = useState('');
  const [joinType, setJoinType] = useState('INNER JOIN');
  // INSERT/UPDATE fields
  const [setFields, setSetFields] = useState('name = \'John\', email = \'john@example.com\'');

  const query = useMemo(() => {
    let q = '';
    if (queryType === 'SELECT') {
      q = `SELECT ${columns || '*'}\nFROM ${table}`;
      if (joinTable && joinOn) q += `\n${joinType} ${joinTable} ON ${joinOn}`;
      if (whereCol && whereVal) q += `\nWHERE ${whereCol} ${whereOp} '${whereVal}'`;
      if (orderBy) q += `\nORDER BY ${orderBy} ${orderDir}`;
      if (limit) q += `\nLIMIT ${limit}`;
    } else if (queryType === 'INSERT') {
      const cols = setFields.split(',').map(f => f.split('=')[0].trim()).join(', ');
      const vals = setFields.split(',').map(f => f.split('=')[1]?.trim() || "''").join(', ');
      q = `INSERT INTO ${table} (${cols})\nVALUES (${vals})`;
    } else if (queryType === 'UPDATE') {
      q = `UPDATE ${table}\nSET ${setFields}`;
      if (whereCol && whereVal) q += `\nWHERE ${whereCol} ${whereOp} '${whereVal}'`;
    } else if (queryType === 'DELETE') {
      q = `DELETE FROM ${table}`;
      if (whereCol && whereVal) q += `\nWHERE ${whereCol} ${whereOp} '${whereVal}'`;
    }
    return q + ';';
  }, [queryType, table, columns, whereCol, whereOp, whereVal, orderBy, orderDir, limit, joinTable, joinOn, joinType, setFields]);

  return (
    <ToolPageWrapper meta={meta}>
      <div className="devtool">
        <div className="devtool-toggle">
          {['SELECT', 'INSERT', 'UPDATE', 'DELETE'].map(t => (
            <button key={t} className={`pms-mode-btn ${queryType === t ? 'active' : ''}`} onClick={() => setQueryType(t)}>{t}</button>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          <div className="form-group"><label>Table Name</label><input value={table} onChange={e => setTable(e.target.value)} className="calc-input" /></div>
          {queryType === 'SELECT' && <div className="form-group"><label>Columns (comma-separated)</label><input value={columns} onChange={e => setColumns(e.target.value)} className="calc-input" placeholder="* or col1, col2" /></div>}
        </div>

        {(queryType === 'INSERT' || queryType === 'UPDATE') && (
          <div className="form-group"><label>Fields (col = value, ...)</label><input value={setFields} onChange={e => setSetFields(e.target.value)} className="calc-input" placeholder="name = 'John', age = 30" /></div>
        )}

        {queryType !== 'INSERT' && (
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 2fr', gap: 8 }}>
            <div className="form-group"><label>WHERE Column</label><input value={whereCol} onChange={e => setWhereCol(e.target.value)} className="calc-input" placeholder="e.g. id" /></div>
            <div className="form-group"><label>Operator</label><select value={whereOp} onChange={e => setWhereOp(e.target.value)} className="calc-input"><option>=</option><option>!=</option><option>&gt;</option><option>&lt;</option><option>&gt;=</option><option>&lt;=</option><option>LIKE</option><option>IN</option></select></div>
            <div className="form-group"><label>Value</label><input value={whereVal} onChange={e => setWhereVal(e.target.value)} className="calc-input" placeholder="e.g. 1" /></div>
          </div>
        )}

        {queryType === 'SELECT' && (<>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 2fr', gap: 8 }}>
            <div className="form-group"><label>JOIN Type</label><select value={joinType} onChange={e => setJoinType(e.target.value)} className="calc-input"><option>INNER JOIN</option><option>LEFT JOIN</option><option>RIGHT JOIN</option><option>FULL JOIN</option></select></div>
            <div className="form-group"><label>JOIN Table</label><input value={joinTable} onChange={e => setJoinTable(e.target.value)} className="calc-input" placeholder="e.g. orders" /></div>
            <div className="form-group"><label>ON Condition</label><input value={joinOn} onChange={e => setJoinOn(e.target.value)} className="calc-input" placeholder="users.id = orders.user_id" /></div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: 8 }}>
            <div className="form-group"><label>ORDER BY</label><input value={orderBy} onChange={e => setOrderBy(e.target.value)} className="calc-input" placeholder="e.g. name" /></div>
            <div className="form-group"><label>Direction</label><select value={orderDir} onChange={e => setOrderDir(e.target.value)} className="calc-input"><option>ASC</option><option>DESC</option></select></div>
            <div className="form-group"><label>LIMIT</label><input value={limit} onChange={e => setLimit(e.target.value)} className="calc-input" type="number" placeholder="e.g. 10" /></div>
          </div>
        </>)}

        <div className="form-group">
          <label>Generated SQL Query</label>
          <div style={{ position: 'relative' }}>
            <textarea className="devtool-textarea devtool-output" rows={6} value={query} readOnly style={{ fontFamily: 'monospace', fontSize: '0.875rem' }} />
            <button onClick={() => navigator.clipboard.writeText(query)} className="btn btn-ghost btn-sm" style={{ position: 'absolute', top: 8, right: 8 }}><Icon name="File" size={14} /></button>
          </div>
        </div>
      </div>
    </ToolPageWrapper>
  );
};
export default SqlQueryBuilder;
