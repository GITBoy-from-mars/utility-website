import React, { useState } from 'react';

const colLabel = i => { let s = ''; while (i >= 0) { s = String.fromCharCode(65 + (i % 26)) + s; i = Math.floor(i / 26) - 1; } return s; };

const TESTS = {
  descriptive: { title: 'Descriptive Statistics', needsCols: true },
  'pearson-corr': { title: 'Bivariate Correlation — Pearson', needsCols: true, minCols: 2 },
  'spearman-corr': { title: 'Bivariate Correlation — Spearman', needsCols: true, minCols: 2 },
  'partial-corr': { title: 'Partial Correlation', needsCols: true, minCols: 2, needsControls: true },
  'distance-corr': { title: 'Distance Matrix (Euclidean)', needsCols: true, minCols: 1 },
  'one-sample-t': { title: 'One-Sample T-Test', needsCols: true, needsTestValue: true },
  'independent-t': { title: 'Independent Samples T-Test', needsTestVar: true, needsGroupVar: true },
  'anova': { title: 'One-Way ANOVA', needsDepVar: true, needsFactorVar: true },
  'regression': { title: 'Linear Regression', needsDepVar: true, needsIndepVars: true },
};

export default function AnalysisModal({ testType, dataCols, onRun, onClose }) {
  const cfg = TESTS[testType];
  if (!cfg) return null;

  const [selCols, setSelCols] = useState([]);
  const [controlCols, setControlCols] = useState([]);
  const [testValue, setTestValue] = useState(0);
  const [testVar, setTestVar] = useState('');
  const [groupVar, setGroupVar] = useState('');
  const [groupVal1, setGroupVal1] = useState('');
  const [groupVal2, setGroupVal2] = useState('');
  const [depVar, setDepVar] = useState('');
  const [indepVars, setIndepVars] = useState([]);
  const [factorVar, setFactorVar] = useState('');
  const [error, setError] = useState('');

  const toggleCol = (ci, list, setList) => {
    setList(prev => prev.includes(ci) ? prev.filter(x => x !== ci) : [...prev, ci]);
  };

  const handleRun = () => {
    setError('');
    if (cfg.needsCols) {
      if (selCols.length < (cfg.minCols || 1)) {
        setError(`Select at least ${cfg.minCols || 1} variable(s).`); return;
      }
      if (cfg.needsControls && controlCols.length === 0) {
        setError('Select at least one control variable.'); return;
      }
    }
    if (cfg.needsTestVar && !testVar) { setError('Select a test variable.'); return; }
    if (cfg.needsGroupVar && !groupVar) { setError('Select a grouping variable.'); return; }
    if (cfg.needsDepVar && !depVar) { setError('Select a dependent variable.'); return; }
    if (cfg.needsIndepVars && indepVars.length === 0) { setError('Select independent variable(s).'); return; }
    if (cfg.needsFactorVar && !factorVar) { setError('Select a factor variable.'); return; }

    onRun({
      type: testType, selCols, controlCols, testValue: Number(testValue),
      testVar, groupVar, groupVal1, groupVal2, depVar, indepVars, factorVar,
    });
  };

  const ColList = ({ list, setList, exclude = [] }) => (
    <div className="col-list">
      {dataCols.map(c => {
        if (exclude.includes(c.index)) return null;
        return (
          <label key={c.index}>
            <input type="checkbox" checked={list.includes(c.index)}
              onChange={() => toggleCol(c.index, list, setList)} />
            {colLabel(c.index)}: {c.header} <span style={{ color: '#999', fontSize: 10 }}>({c.count} values)</span>
          </label>
        );
      })}
    </div>
  );

  const VarSelect = ({ value, onChange, exclude = [], label }) => (
    <div className="inline-input">
      <label>{label}:</label>
      <select value={value} onChange={e => onChange(e.target.value)}>
        <option value="">— Select —</option>
        {dataCols.filter(c => !exclude.includes(c.index)).map(c => (
          <option key={c.index} value={c.index}>{colLabel(c.index)}: {c.header}</option>
        ))}
      </select>
    </div>
  );

  return (
    <div className="stats-modal-overlay" onClick={onClose}>
      <div className="stats-modal" onClick={e => e.stopPropagation()}>
        <div className="stats-modal-header">
          <h3>{cfg.title}</h3>
          <button onClick={onClose}>✕</button>
        </div>
        <div className="stats-modal-body">
          {/* Column selection tests */}
          {cfg.needsCols && (
            <div className="section">
              <div className="section-title">
                {cfg.needsControls ? 'Select Variables' : 'Select Variables (Columns)'}
              </div>
              <ColList list={selCols} setList={setSelCols} exclude={controlCols} />
            </div>
          )}

          {/* Control variables for partial */}
          {cfg.needsControls && (
            <div className="section">
              <div className="section-title">Control Variables (Covariates)</div>
              <ColList list={controlCols} setList={setControlCols} exclude={selCols} />
            </div>
          )}

          {/* Test value for one-sample t */}
          {cfg.needsTestValue && (
            <div className="section">
              <div className="inline-input">
                <label>Test Value (μ₀):</label>
                <input type="number" value={testValue} onChange={e => setTestValue(e.target.value)} step="any" />
              </div>
            </div>
          )}

          {/* Independent t-test */}
          {cfg.needsTestVar && (
            <div className="section">
              <div className="section-title">Test Variable (Numeric)</div>
              <VarSelect value={testVar} onChange={setTestVar} exclude={[Number(groupVar)]} label="Test Variable" />
            </div>
          )}
          {cfg.needsGroupVar && (
            <div className="section">
              <div className="section-title">Grouping Variable</div>
              <VarSelect value={groupVar} onChange={setGroupVar} exclude={[Number(testVar)]} label="Grouping Variable" />
              <div className="inline-input" style={{ marginTop: 6 }}>
                <label>Group 1 Value:</label>
                <input value={groupVal1} onChange={e => setGroupVal1(e.target.value)} placeholder="e.g. 1" />
                <label>Group 2 Value:</label>
                <input value={groupVal2} onChange={e => setGroupVal2(e.target.value)} placeholder="e.g. 2" />
              </div>
            </div>
          )}

          {/* ANOVA */}
          {cfg.needsDepVar && !cfg.needsIndepVars && (
            <div className="section">
              <VarSelect value={depVar} onChange={setDepVar} exclude={[Number(factorVar)]} label="Dependent Variable" />
            </div>
          )}
          {cfg.needsFactorVar && (
            <div className="section">
              <VarSelect value={factorVar} onChange={setFactorVar} exclude={[Number(depVar)]} label="Factor Variable" />
            </div>
          )}

          {/* Regression */}
          {cfg.needsDepVar && cfg.needsIndepVars && (
            <>
              <div className="section">
                <VarSelect value={depVar} onChange={setDepVar} exclude={indepVars.map(Number)} label="Dependent Variable" />
              </div>
              <div className="section">
                <div className="section-title">Independent Variables</div>
                <ColList list={indepVars} setList={setIndepVars} exclude={[Number(depVar)]} />
              </div>
            </>
          )}

          {error && <div className="error-msg">⚠ {error}</div>}
        </div>
        <div className="stats-modal-footer">
          <button onClick={onClose}>Cancel</button>
          <button className="primary" onClick={handleRun}>Run Analysis</button>
        </div>
      </div>
    </div>
  );
}

export { TESTS };
