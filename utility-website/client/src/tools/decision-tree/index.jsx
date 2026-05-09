import React, { useState, useCallback, useRef, useEffect, memo } from 'react';
import ToolPageWrapper from '../../components/common/ToolPageWrapper';
import { Icon } from '../../assets/icons/icons';
import meta from './meta';
import './DecisionTree.css';

const uid = () => Math.random().toString(36).slice(2, 8);

const NODE_TYPES = {
  question: { emoji: '❓', label: 'Question', color: '#3B82F6', bg: '#EFF6FF' },
  condition: { emoji: '🔀', label: 'Condition', color: '#F59E0B', bg: '#FFFBEB' },
  action: { emoji: '⚡', label: 'Action', color: '#8B5CF6', bg: '#F5F3FF' },
  answer: { emoji: '✅', label: 'Answer', color: '#10B981', bg: '#ECFDF5' },
  note: { emoji: '📝', label: 'Note', color: '#6B7280', bg: '#F9FAFB' },
};

/* Isolated text editor — uses LOCAL state to avoid cursor-jump bug */
const NodeEditor = memo(({ initialText, onCommit, onCancel }) => {
  const [localText, setLocalText] = useState(initialText);
  const ref = useRef(null);

  useEffect(() => {
    if (ref.current) {
      ref.current.focus();
      // Place cursor at end
      const len = ref.current.value.length;
      ref.current.setSelectionRange(len, len);
    }
  }, []);

  const handleBlur = () => {
    onCommit(localText);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onCommit(localText);
    }
    if (e.key === 'Escape') {
      onCancel();
    }
  };

  return (
    <textarea
      ref={ref}
      className="dt-node-editor"
      value={localText}
      onChange={e => setLocalText(e.target.value)}
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
      rows={2}
    />
  );
});

const DecisionTree = () => {
  const [nodes, setNodes] = useState([
    { id: 'root', text: 'Start: What is the problem?', type: 'question', parent: null, collapsed: false },
    { id: uid(), text: 'Is it hardware?', type: 'condition', parent: 'root', collapsed: false },
    { id: uid(), text: 'Is it software?', type: 'condition', parent: 'root', collapsed: false },
  ]);
  const [draggedId, setDraggedId] = useState(null);
  const [dragOverId, setDragOverId] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [zoomLevel, setZoomLevel] = useState(1);
  const canvasRef = useRef(null);

  const updateNode = useCallback((id, field, val) => {
    setNodes(prev => prev.map(n => n.id === id ? { ...n, [field]: val } : n));
  }, []);

  const addChild = useCallback((parentId, type = 'question') => {
    const newId = uid();
    setNodes(prev => [...prev, { id: newId, text: '', type, parent: parentId, collapsed: false }]);
    setEditingId(newId);
  }, []);

  const duplicateNode = useCallback((id) => {
    setNodes(prev => {
      const node = prev.find(n => n.id === id);
      if (!node) return prev;
      const newId = uid();
      const newNode = { ...node, id: newId, text: node.text + ' (copy)' };
      const dupes = [newNode];
      const collectChildren = (origParentId, newParentId) => {
        prev.filter(n => n.parent === origParentId).forEach(child => {
          const childNewId = uid();
          dupes.push({ ...child, id: childNewId, parent: newParentId });
          collectChildren(child.id, childNewId);
        });
      };
      collectChildren(id, newId);
      return [...prev, ...dupes];
    });
  }, []);

  const removeNode = useCallback((id) => {
    setNodes(prev => {
      const toRemove = new Set();
      const collect = (pid) => {
        prev.filter(n => n.parent === pid).forEach(n => { toRemove.add(n.id); collect(n.id); });
      };
      toRemove.add(id);
      collect(id);
      return prev.filter(n => !toRemove.has(n.id));
    });
  }, []);

  const toggleCollapse = useCallback((id) => {
    setNodes(prev => prev.map(n => n.id === id ? { ...n, collapsed: !n.collapsed } : n));
  }, []);

  const wouldCreateCycle = useCallback((nodeId, newParentId) => {
    let current = newParentId;
    const nodeMap = {};
    nodes.forEach(n => { nodeMap[n.id] = n; });
    while (current) {
      if (current === nodeId) return true;
      current = nodeMap[current]?.parent;
    }
    return false;
  }, [nodes]);

  const handleDragStart = (e, id) => {
    if (id === 'root') { e.preventDefault(); return; }
    setDraggedId(id);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', id);
  };

  const handleDragOver = (e, id) => {
    e.preventDefault();
    if (draggedId && draggedId !== id && !wouldCreateCycle(draggedId, id)) {
      setDragOverId(id);
      e.dataTransfer.dropEffect = 'move';
    }
  };

  const handleDragLeave = () => setDragOverId(null);

  const handleDrop = (e, newParentId) => {
    e.preventDefault();
    setDragOverId(null);
    if (!draggedId || draggedId === newParentId) return;
    if (wouldCreateCycle(draggedId, newParentId)) return;
    setNodes(prev => prev.map(n => n.id === draggedId ? { ...n, parent: newParentId } : n));
    setDraggedId(null);
  };

  const handleDragEnd = () => { setDraggedId(null); setDragOverId(null); };

  const countDesc = useCallback((id) => {
    const children = nodes.filter(n => n.parent === id);
    return children.reduce((sum, c) => sum + 1 + countDesc(c.id), 0);
  }, [nodes]);

  const exportTree = () => {
    const blob = new Blob([JSON.stringify(nodes, null, 2)], { type: 'application/json' });
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'decision-tree.json'; a.click();
  };

  const importTree = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try { setNodes(JSON.parse(ev.target.result)); } catch { alert('Invalid JSON'); }
    };
    reader.readAsText(file);
  };

  const matchesSearch = useCallback((id) => {
    if (!searchTerm) return true;
    const node = nodes.find(n => n.id === id);
    if (!node) return false;
    if (node.text.toLowerCase().includes(searchTerm.toLowerCase())) return true;
    return nodes.filter(n => n.parent === id).some(c => matchesSearch(c.id));
  }, [nodes, searchTerm]);

  const TreeNode = ({ nodeId, depth = 0 }) => {
    const node = nodes.find(n => n.id === nodeId);
    if (!node) return null;
    if (!matchesSearch(nodeId) && searchTerm) return null;

    const children = nodes.filter(n => n.parent === nodeId);
    const type = NODE_TYPES[node.type] || NODE_TYPES.question;
    const childCount = countDesc(nodeId);
    const isDragTarget = dragOverId === nodeId;
    const isBeingDragged = draggedId === nodeId;
    const isEditing = editingId === nodeId;

    return (
      <div className={`dt-branch ${isBeingDragged ? 'dragging' : ''}`}>
        <div
          className={`dt-node ${node.type} ${isDragTarget ? 'drag-over' : ''} ${isEditing ? 'editing' : ''}`}
          draggable={nodeId !== 'root' && !isEditing}
          onDragStart={e => handleDragStart(e, nodeId)}
          onDragOver={e => handleDragOver(e, nodeId)}
          onDragLeave={handleDragLeave}
          onDrop={e => handleDrop(e, nodeId)}
          onDragEnd={handleDragEnd}
          style={{ borderColor: type.color, background: type.bg }}
        >
          <div className="dt-node-header">
            <select
              value={node.type}
              onChange={e => updateNode(nodeId, 'type', e.target.value)}
              className="dt-type-select"
              style={{ color: type.color }}
            >
              {Object.entries(NODE_TYPES).map(([k, v]) => (
                <option key={k} value={k}>{v.emoji} {v.label}</option>
              ))}
            </select>
            {nodeId !== 'root' && <div className="dt-drag-handle" title="Drag to reparent">⠿</div>}
          </div>

          {isEditing ? (
            <NodeEditor
              initialText={node.text}
              onCommit={(text) => { updateNode(nodeId, 'text', text); setEditingId(null); }}
              onCancel={() => setEditingId(null)}
            />
          ) : (
            <div className="dt-node-text" onDoubleClick={() => setEditingId(nodeId)}>
              {node.text || <span className="dt-placeholder">Double-click to edit...</span>}
            </div>
          )}

          <div className="dt-node-actions">
            <div className="dt-add-menu">
              {Object.entries(NODE_TYPES).map(([k, v]) => (
                <button key={k} onClick={() => addChild(nodeId, k)} className="dt-add-btn" title={`Add ${v.label}`} style={{ color: v.color }}>
                  {v.emoji}
                </button>
              ))}
            </div>
            <div className="dt-node-btns">
              {children.length > 0 && (
                <button onClick={() => toggleCollapse(nodeId)} className="dt-action-btn" title={node.collapsed ? 'Expand' : 'Collapse'}>
                  {node.collapsed ? `▶ (${childCount})` : '▼'}
                </button>
              )}
              <button onClick={() => duplicateNode(nodeId)} className="dt-action-btn" title="Duplicate">📋</button>
              {nodeId !== 'root' && <button onClick={() => removeNode(nodeId)} className="dt-action-btn remove" title="Delete">🗑</button>}
            </div>
          </div>
        </div>

        {!node.collapsed && children.length > 0 && (
          <div className="dt-children">
            {children.map(c => <TreeNode key={c.id} nodeId={c.id} depth={depth + 1} />)}
          </div>
        )}
      </div>
    );
  };

  const root = nodes.find(n => !n.parent);
  const totalNodes = nodes.length;

  return (
    <ToolPageWrapper meta={meta}>
      <div className="dt-tool">
        <div className="dt-toolbar">
          <div className="dt-toolbar-left">
            <input type="text" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} placeholder="🔍 Search nodes..." className="dt-search" />
            <span className="dt-stats">{totalNodes} nodes</span>
          </div>
          <div className="dt-toolbar-right">
            <div className="dt-zoom">
              <button onClick={() => setZoomLevel(z => Math.max(0.3, z - 0.1))} className="dt-zoom-btn">−</button>
              <span className="dt-zoom-label">{Math.round(zoomLevel * 100)}%</span>
              <button onClick={() => setZoomLevel(z => Math.min(2, z + 0.1))} className="dt-zoom-btn">+</button>
            </div>
            <button onClick={exportTree} className="btn btn-ghost btn-sm"><Icon name="Download" size={14} />Export</button>
            <label className="btn btn-ghost btn-sm" style={{ cursor: 'pointer' }}><Icon name="Upload" size={14} />Import<input type="file" accept=".json" onChange={importTree} style={{ display: 'none' }} /></label>
          </div>
        </div>

        <div className="dt-canvas" ref={canvasRef}>
          <div className="dt-tree" style={{ transform: `scale(${zoomLevel})`, transformOrigin: 'top center' }}>
            {root && <TreeNode nodeId={root.id} />}
          </div>
        </div>

        <div className="dt-tip">💡 <strong>Drag nodes</strong> to reparent · <strong>Double-click</strong> to edit text · Click emoji buttons to <strong>add children</strong> · Use <strong>▼/▶</strong> to collapse branches</div>
      </div>
    </ToolPageWrapper>
  );
};
export default DecisionTree;
