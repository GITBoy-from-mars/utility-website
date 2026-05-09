import React, { useState } from 'react';
import ToolPageWrapper from '../../components/common/ToolPageWrapper';
import { Icon } from '../../assets/icons/icons';
import meta from './meta';
import './Checklist.css';
const ChecklistGenerator = () => {
  const [title, setTitle] = useState('My Checklist');
  const [items, setItems] = useState([{ text: 'Item 1', done: false }, { text: 'Item 2', done: false }]);
  const [newItem, setNewItem] = useState('');
  const add = () => { if (newItem.trim()) { setItems([...items, { text: newItem.trim(), done: false }]); setNewItem(''); } };
  const toggle = i => { const c = [...items]; c[i] = { ...c[i], done: !c[i].done }; setItems(c); };
  const remove = i => setItems(items.filter((_, idx) => idx !== i));
  const download = () => {
    const md = `# ${title}\n\n${items.map(it => `- [${it.done ? 'x' : ' '}] ${it.text}`).join('\n')}`;
    const b = new Blob([md], { type: 'text/markdown' }); const a = document.createElement('a'); a.href = URL.createObjectURL(b); a.download = `${title.replace(/\s+/g, '-').toLowerCase()}.md`; a.click();
  };
  const done = items.filter(i => i.done).length;
  return (
    <ToolPageWrapper meta={meta}>
      <div className="checklist-tool">
        <div className="form-group"><label>Checklist Title</label><input type="text" value={title} onChange={e => setTitle(e.target.value)} className="calc-input" /></div>
        {items.length > 0 && <div className="checklist-progress"><div className="checklist-progress-bar" style={{ width: `${(done / items.length) * 100}%` }} /><span>{done}/{items.length} completed</span></div>}
        <div className="checklist-items">{items.map((it, i) => (
          <div key={i} className={`checklist-item ${it.done ? 'done' : ''}`}>
            <label className="checklist-check"><input type="checkbox" checked={it.done} onChange={() => toggle(i)} /><span className="checklist-text">{it.text}</span></label>
            <button onClick={() => remove(i)} className="checklist-remove">×</button>
          </div>
        ))}</div>
        <div style={{ display: 'flex', gap: 8 }}><input className="calc-input" value={newItem} onChange={e => setNewItem(e.target.value)} onKeyDown={e => e.key === 'Enter' && add()} placeholder="Add item..." style={{ flex: 1 }} /><button onClick={add} className="btn btn-primary">Add</button></div>
        <button onClick={download} className="btn btn-secondary"><Icon name="Download" size={18} />Download as Markdown</button>
      </div>
    </ToolPageWrapper>
  );
};
export default ChecklistGenerator;
