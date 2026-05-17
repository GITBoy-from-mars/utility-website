import React from 'react';

const fmt = (v, d=4) => v == null ? '—' : Number(v).toFixed(d);
const sig = p => p != null && p < 0.01 ? '**' : p != null && p < 0.05 ? '*' : '';

export default function ResultsPanel({ results, onClear }) {
  if (!results.length) return (
    <div className="stats-results">
      <h3>📊 Output</h3>
      <p style={{color:'#999',fontSize:12}}>Run an analysis to see results here.</p>
    </div>
  );

  return (
    <div className="stats-results">
      <h3>📊 Output <button onClick={onClear} style={{float:'right',fontSize:10,border:'1px solid #ccc',borderRadius:3,padding:'2px 8px',background:'#fff',cursor:'pointer'}}>Clear All</button></h3>
      {results.map((r, idx) => (
        <div key={idx} className="spss-result-block">
          <div className="spss-result-title">{r.title}</div>
          {r.type === 'descriptive' && <DescriptiveTable data={r.data} />}
          {r.type === 'correlation-matrix' && <CorrMatrixTable data={r.data} />}
          {r.type === 'partial-matrix' && <PartialTable data={r.data} />}
          {r.type === 'distance' && <DistanceTable data={r.data} />}
          {r.type === 'one-sample-t' && <OneSampleTTable data={r.data} />}
          {r.type === 'independent-t' && <IndependentTTable data={r.data} />}
          {r.type === 'anova' && <AnovaTable data={r.data} />}
          {r.type === 'regression' && <RegressionTable data={r.data} />}
        </div>
      ))}
      <p style={{fontSize:10,color:'#999',marginTop:8}}>** p &lt; 0.01, * p &lt; 0.05</p>
    </div>
  );
}

function DescriptiveTable({ data }) {
  return (
    <table className="spss-result-table">
      <thead><tr><th>Variable</th><th>N</th><th>Mean</th><th>Std.Dev</th><th>Median</th><th>Min</th><th>Max</th><th>Skewness</th><th>Kurtosis</th></tr></thead>
      <tbody>
        {data.map((d, i) => (
          <tr key={i}>
            <td className="label">{d.label}</td>
            <td>{d.n}</td><td>{fmt(d.mean)}</td><td>{fmt(d.stdDev)}</td>
            <td>{fmt(d.median)}</td><td>{fmt(d.min,2)}</td><td>{fmt(d.max,2)}</td>
            <td>{fmt(d.skewness,3)}</td><td>{fmt(d.kurtosis,3)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function CorrMatrixTable({ data }) {
  const { labels, matrix } = data;
  return (
    <table className="spss-result-table">
      <thead><tr><th></th><th></th>{labels.map((l,i) => <th key={i}>{l}</th>)}</tr></thead>
      <tbody>
        {labels.map((lbl, i) => (
          <React.Fragment key={i}>
            <tr>
              <td className="label" rowSpan={3}>{lbl}</td>
              <td className="sub-label">r</td>
              {matrix[i].map((cell, j) => <td key={j}>{fmt(cell.r)}{sig(cell.p)}</td>)}
            </tr>
            <tr>
              <td className="sub-label">Sig.</td>
              {matrix[i].map((cell, j) => <td key={j}>{i===j ? '' : fmt(cell.p)}</td>)}
            </tr>
            <tr>
              <td className="sub-label">N</td>
              {matrix[i].map((cell, j) => <td key={j}>{cell.n}</td>)}
            </tr>
          </React.Fragment>
        ))}
      </tbody>
    </table>
  );
}

function PartialTable({ data }) {
  const { labels, matrix, controlLabels } = data;
  return (
    <>
      <div style={{padding:'4px 8px',fontSize:10,color:'#666',background:'#f5f5f5'}}>
        Controlling for: {controlLabels.join(', ')}
      </div>
      <table className="spss-result-table">
        <thead><tr><th></th><th></th>{labels.map((l,i) => <th key={i}>{l}</th>)}</tr></thead>
        <tbody>
          {labels.map((lbl, i) => (
            <React.Fragment key={i}>
              <tr>
                <td className="label" rowSpan={2}>{lbl}</td>
                <td className="sub-label">r</td>
                {matrix[i].map((cell, j) => <td key={j}>{i===j ? '—' : <>{fmt(cell.r)}{sig(cell.p)}</>}</td>)}
              </tr>
              <tr>
                <td className="sub-label">Sig.</td>
                {matrix[i].map((cell, j) => <td key={j}>{i===j ? '' : fmt(cell.p)}</td>)}
              </tr>
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </>
  );
}

function DistanceTable({ data }) {
  const { dist } = data;
  const n = dist.length;
  return (
    <table className="spss-result-table">
      <thead><tr><th></th>{Array(n).fill(0).map((_,i) => <th key={i}>Obs {i+1}</th>)}</tr></thead>
      <tbody>
        {dist.map((row, i) => (
          <tr key={i}><td className="label">Obs {i+1}</td>
            {row.map((v, j) => <td key={j}>{fmt(v, 2)}</td>)}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function OneSampleTTable({ data }) {
  return (
    <>
      <table className="spss-result-table">
        <thead><tr><th>Variable</th><th>N</th><th>Mean</th><th>Std.Dev</th><th>Std.Error</th></tr></thead>
        <tbody>
          {data.map((d,i) => <tr key={i}><td className="label">{d.label}</td><td>{d.n}</td><td>{fmt(d.mean)}</td><td>{fmt(d.stdDev)}</td><td>{fmt(d.se)}</td></tr>)}
        </tbody>
      </table>
      <div style={{padding:'2px 8px',fontSize:10,color:'#666',background:'#f5f5f5'}}>Test Value = {data[0]?.testValue}</div>
      <table className="spss-result-table">
        <thead><tr><th>Variable</th><th>t</th><th>df</th><th>Sig.(2-tailed)</th><th>Mean Diff</th></tr></thead>
        <tbody>
          {data.map((d,i) => <tr key={i}><td className="label">{d.label}</td><td>{fmt(d.t,3)}</td><td>{d.df}</td><td className={d.p<0.05?'spss-sig':''}>{fmt(d.p)}</td><td>{fmt(d.meanDiff)}</td></tr>)}
        </tbody>
      </table>
    </>
  );
}

function IndependentTTable({ data }) {
  const d = data;
  return (
    <>
      <table className="spss-result-table">
        <thead><tr><th>Group</th><th>N</th><th>Mean</th><th>Std.Dev</th><th>Std.Error</th></tr></thead>
        <tbody>
          <tr><td className="label">Group 1</td><td>{d.n1}</td><td>{fmt(d.mean1)}</td><td>{fmt(d.std1)}</td><td>{fmt(d.std1/Math.sqrt(d.n1))}</td></tr>
          <tr><td className="label">Group 2</td><td>{d.n2}</td><td>{fmt(d.mean2)}</td><td>{fmt(d.std2)}</td><td>{fmt(d.std2/Math.sqrt(d.n2))}</td></tr>
        </tbody>
      </table>
      <table className="spss-result-table">
        <thead><tr><th>t</th><th>df</th><th>Sig.(2-tailed)</th><th>Mean Diff</th><th>Std.Error Diff</th></tr></thead>
        <tbody>
          <tr><td>{fmt(d.t,3)}</td><td>{fmt(d.df,1)}</td><td className={d.p<0.05?'spss-sig':''}>{fmt(d.p)}</td><td>{fmt(d.meanDiff)}</td><td>{fmt(d.se)}</td></tr>
        </tbody>
      </table>
    </>
  );
}

function AnovaTable({ data }) {
  const d = data;
  return (
    <>
      <table className="spss-result-table">
        <thead><tr><th>Source</th><th>Sum of Sq.</th><th>df</th><th>Mean Sq.</th><th>F</th><th>Sig.</th></tr></thead>
        <tbody>
          <tr><td className="label">Between Groups</td><td>{fmt(d.ssB,2)}</td><td>{d.dfB}</td><td>{fmt(d.msB,2)}</td><td>{fmt(d.f,3)}</td><td className={d.p<0.05?'spss-sig':''}>{fmt(d.p)}</td></tr>
          <tr><td className="label">Within Groups</td><td>{fmt(d.ssW,2)}</td><td>{d.dfW}</td><td>{fmt(d.msW,2)}</td><td></td><td></td></tr>
          <tr><td className="label">Total</td><td>{fmt(d.ssT,2)}</td><td>{d.dfT}</td><td></td><td></td><td></td></tr>
        </tbody>
      </table>
      {d.groupMeans && (
        <table className="spss-result-table" style={{marginTop:4}}>
          <thead><tr><th>Group</th><th>N</th><th>Mean</th></tr></thead>
          <tbody>
            {d.groupMeans.map((m,i) => <tr key={i}><td className="label">{d.labels?.[i] ?? `Group ${i+1}`}</td><td>{d.groupNs[i]}</td><td>{fmt(m)}</td></tr>)}
          </tbody>
        </table>
      )}
    </>
  );
}

function RegressionTable({ data }) {
  const d = data;
  return (
    <>
      <div style={{padding:'4px 8px',fontSize:10,background:'#f5f5f5'}}>Model Summary</div>
      <table className="spss-result-table">
        <thead><tr><th>R</th><th>R²</th><th>Adj. R²</th><th>Std. Error</th></tr></thead>
        <tbody><tr><td>{fmt(d.r,3)}</td><td>{fmt(d.r2,3)}</td><td>{fmt(d.adjR2,3)}</td><td>{fmt(d.se)}</td></tr></tbody>
      </table>
      <div style={{padding:'4px 8px',fontSize:10,background:'#f5f5f5'}}>ANOVA</div>
      <table className="spss-result-table">
        <thead><tr><th>Source</th><th>Sum Sq.</th><th>df</th><th>Mean Sq.</th><th>F</th><th>Sig.</th></tr></thead>
        <tbody>
          <tr><td className="label">Regression</td><td>{fmt(d.ssR,2)}</td><td>{d.dfReg}</td><td>{fmt(d.ssR/d.dfReg,2)}</td><td>{fmt(d.fStat,3)}</td><td className={d.fP<0.05?'spss-sig':''}>{fmt(d.fP)}</td></tr>
          <tr><td className="label">Residual</td><td>{fmt(d.ssE,2)}</td><td>{d.dfRes}</td><td>{fmt(d.ssE/d.dfRes,2)}</td><td></td><td></td></tr>
          <tr><td className="label">Total</td><td>{fmt(d.ssT,2)}</td><td>{d.dfReg+d.dfRes}</td><td></td><td></td><td></td></tr>
        </tbody>
      </table>
      <div style={{padding:'4px 8px',fontSize:10,background:'#f5f5f5'}}>Coefficients</div>
      <table className="spss-result-table">
        <thead><tr><th>Variable</th><th>B</th><th>Std.Error</th><th>t</th><th>Sig.</th></tr></thead>
        <tbody>
          {d.coefficients.map((c,i) => <tr key={i}><td className="label">{c.label}</td><td>{fmt(c.b)}</td><td>{fmt(c.se)}</td><td>{fmt(c.t,3)}</td><td className={c.p<0.05?'spss-sig':''}>{fmt(c.p)}</td></tr>)}
        </tbody>
      </table>
    </>
  );
}
