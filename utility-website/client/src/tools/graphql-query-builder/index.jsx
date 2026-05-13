import React, { useState, useMemo } from 'react';
import ToolPageWrapper from '../../components/common/ToolPageWrapper';
import { Icon } from '../../assets/icons/icons';
import meta from './meta';
import '../base64-encoder-decoder/Base64Tool.css';

const uid = () => Math.random().toString(36).slice(2, 6);

const GraphqlQueryBuilder = () => {
  const [opType, setOpType] = useState('query');
  const [opName, setOpName] = useState('GetUsers');
  const [fields, setFields] = useState([
    { id: uid(), name: 'id', children: [] },
    { id: uid(), name: 'name', children: [] },
    { id: uid(), name: 'email', children: [] },
    { id: uid(), name: 'posts', children: [
      { id: uid(), name: 'id', children: [] },
      { id: uid(), name: 'title', children: [] },
    ]},
  ]);
  const [rootField, setRootField] = useState('users');
  const [args, setArgs] = useState([{ key: 'limit', value: '10', type: 'Int' }]);

  const addField = () => setFields([...fields, { id: uid(), name: '', children: [] }]);
  const updateField = (id, name) => setFields(prev => prev.map(f => f.id === id ? { ...f, name } : f));
  const removeField = (id) => setFields(prev => prev.filter(f => f.id !== id));
  const addChildField = (parentId) => {
    setFields(prev => prev.map(f => f.id === parentId ? { ...f, children: [...f.children, { id: uid(), name: '', children: [] }] } : f));
  };
  const updateChildField = (parentId, childId, name) => {
    setFields(prev => prev.map(f => f.id === parentId ? { ...f, children: f.children.map(c => c.id === childId ? { ...c, name } : c) } : f));
  };
  const removeChildField = (parentId, childId) => {
    setFields(prev => prev.map(f => f.id === parentId ? { ...f, children: f.children.filter(c => c.id !== childId) } : f));
  };

  const addArg = () => setArgs([...args, { key: '', value: '', type: 'String' }]);
  const updateArg = (i, field, val) => { const c = [...args]; c[i] = { ...c[i], [field]: val }; setArgs(c); };
  const removeArg = (i) => setArgs(args.filter((_, idx) => idx !== i));

  const query = useMemo(() => {
    const argsStr = args.filter(a => a.key && a.value).map(a => `${a.key}: ${a.type === 'String' ? `"${a.value}"` : a.value}`).join(', ');
    const renderFields = (flds, indent = '    ') => {
      return flds.filter(f => f.name).map(f => {
        if (f.children && f.children.length > 0) {
          return `${indent}${f.name} {\n${renderFields(f.children, indent + '  ')}\n${indent}}`;
        }
        return `${indent}${f.name}`;
      }).join('\n');
    };
    const fieldStr = renderFields(fields);
    const argsPart = argsStr ? `(${argsStr})` : '';
    return `${opType} ${opName} {\n  ${rootField}${argsPart} {\n${fieldStr}\n  }\n}`;
  }, [opType, opName, rootField, fields, args]);

  return (
    <ToolPageWrapper meta={meta}>
      <div className="devtool">
        <div className="devtool-toggle">
          {['query', 'mutation', 'subscription'].map(t => (
            <button key={t} className={`pms-mode-btn ${opType === t ? 'active' : ''}`} onClick={() => setOpType(t)}>{t.charAt(0).toUpperCase() + t.slice(1)}</button>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          <div className="form-group"><label>Operation Name</label><input value={opName} onChange={e => setOpName(e.target.value)} className="calc-input" /></div>
          <div className="form-group"><label>Root Field</label><input value={rootField} onChange={e => setRootField(e.target.value)} className="calc-input" /></div>
        </div>

        <div className="form-group">
          <label>Arguments</label>
          {args.map((a, i) => (
            <div key={i} style={{ display: 'flex', gap: 6, marginBottom: 4 }}>
              <input value={a.key} onChange={e => updateArg(i, 'key', e.target.value)} placeholder="key" className="calc-input" style={{ flex: 1 }} />
              <input value={a.value} onChange={e => updateArg(i, 'value', e.target.value)} placeholder="value" className="calc-input" style={{ flex: 1 }} />
              <select value={a.type} onChange={e => updateArg(i, 'type', e.target.value)} className="calc-input" style={{ width: 80 }}><option>String</option><option>Int</option><option>Float</option><option>Boolean</option><option>ID</option></select>
              <button onClick={() => removeArg(i)} className="btn btn-ghost btn-sm" style={{ color: 'var(--error)' }}><Icon name="X" size={14} /></button>
            </div>
          ))}
          <button onClick={addArg} className="btn btn-ghost btn-sm">+ Add Argument</button>
        </div>

        <div className="form-group">
          <label>Fields</label>
          {fields.map(f => (
            <div key={f.id} style={{ marginBottom: 6 }}>
              <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                <input value={f.name} onChange={e => updateField(f.id, e.target.value)} placeholder="field name" className="calc-input" style={{ flex: 1 }} />
                <button onClick={() => addChildField(f.id)} className="btn btn-ghost btn-sm" title="Add sub-field">+ Sub</button>
                <button onClick={() => removeField(f.id)} className="btn btn-ghost btn-sm" style={{ color: 'var(--error)' }}><Icon name="X" size={14} /></button>
              </div>
              {f.children.map(c => (
                <div key={c.id} style={{ display: 'flex', gap: 6, alignItems: 'center', marginLeft: 24, marginTop: 4 }}>
                  <span style={{ color: 'var(--neutral-300)' }}>|--</span>
                  <input value={c.name} onChange={e => updateChildField(f.id, c.id, e.target.value)} placeholder="sub-field" className="calc-input" style={{ flex: 1 }} />
                  <button onClick={() => removeChildField(f.id, c.id)} className="btn btn-ghost btn-sm" style={{ color: 'var(--error)' }}><Icon name="X" size={12} /></button>
                </div>
              ))}
            </div>
          ))}
          <button onClick={addField} className="btn btn-ghost btn-sm">+ Add Field</button>
        </div>

        <div className="form-group">
          <label>Generated GraphQL Query</label>
          <div style={{ position: 'relative' }}>
            <textarea className="devtool-textarea devtool-output" rows={12} value={query} readOnly style={{ fontFamily: 'monospace', fontSize: '0.875rem' }} />
            <button onClick={() => navigator.clipboard.writeText(query)} className="btn btn-ghost btn-sm" style={{ position: 'absolute', top: 8, right: 8 }}><Icon name="File" size={14} /></button>
          </div>
        </div>
      </div>
    </ToolPageWrapper>
  );
};
export default GraphqlQueryBuilder;
