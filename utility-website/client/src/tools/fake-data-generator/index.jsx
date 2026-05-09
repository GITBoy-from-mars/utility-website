import React, { useState } from 'react';
import ToolPageWrapper from '../../components/common/ToolPageWrapper';
import { Icon } from '../../assets/icons/icons';
import meta from './meta';
import '../base64-encoder-decoder/Base64Tool.css';
import '../loan-amortization/LoanAmortization.css';
const firstNames = ['James','Mary','John','Patricia','Robert','Jennifer','Michael','Linda','David','Elizabeth','William','Susan','Richard','Sarah','Joseph','Karen','Thomas','Emma','Chris','Olivia'];
const lastNames = ['Smith','Johnson','Williams','Brown','Jones','Garcia','Miller','Davis','Rodriguez','Martinez','Anderson','Taylor','Thomas','Moore','Jackson','Martin','Lee','Perez','Wilson','Clark'];
const domains = ['gmail.com','yahoo.com','outlook.com','hotmail.com','company.co','work.org'];
const streets = ['Main St','Oak Ave','Elm Blvd','Maple Dr','Pine Rd','Cedar Ln','Park Way','Lake View'];
const cities = ['New York','Los Angeles','Chicago','Houston','Phoenix','San Francisco','Seattle','Boston','Denver','Atlanta','London','Toronto','Sydney','Mumbai','Berlin','Tokyo'];
const rand = arr => arr[Math.floor(Math.random() * arr.length)];
const randNum = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const genRow = (cols) => {
  const fn = rand(firstNames), ln = rand(lastNames);
  const map = {
    name: `${fn} ${ln}`,
    email: `${fn.toLowerCase()}.${ln.toLowerCase()}${randNum(1,99)}@${rand(domains)}`,
    phone: `+1-${randNum(200,999)}-${randNum(100,999)}-${randNum(1000,9999)}`,
    address: `${randNum(1,9999)} ${rand(streets)}, ${rand(cities)}`,
    company: `${rand(lastNames)} ${rand(['Inc','Corp','LLC','Ltd','Group','Tech'])}`,
    age: randNum(18, 75),
    dob: `${randNum(1950, 2005)}-${String(randNum(1,12)).padStart(2,'0')}-${String(randNum(1,28)).padStart(2,'0')}`,
    username: `${fn.toLowerCase()}${ln.toLowerCase().slice(0,3)}${randNum(1,999)}`,
    id: crypto.randomUUID().slice(0, 8),
  };
  const row = {};
  cols.forEach(c => { row[c] = map[c] || ''; });
  return row;
};
const allCols = ['name','email','phone','address','company','age','dob','username','id'];
const FakeDataGenerator = () => {
  const [count, setCount] = useState(10);
  const [cols, setCols] = useState(['name','email','phone','address']);
  const [data, setData] = useState([]);
  const toggle = c => setCols(cols.includes(c) ? cols.filter(x => x !== c) : [...cols, c]);
  const generate = () => setData(Array.from({ length: Math.min(count, 500) }, () => genRow(cols)));
  const toCsv = () => {
    const header = cols.join(',');
    const rows = data.map(r => cols.map(c => `"${r[c]}"`).join(','));
    return [header, ...rows].join('\n');
  };
  const download = () => {
    const blob = new Blob([toCsv()], { type: 'text/csv' });
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'fake-data.csv'; a.click();
  };
  return (
    <ToolPageWrapper meta={meta}>
      <div className="devtool">
        <div style={{ display: 'flex', gap: 12, alignItems: 'end', flexWrap: 'wrap' }}>
          <div className="form-group" style={{ minWidth: 120 }}><label>Rows</label><input type="number" min="1" max="500" value={count} onChange={e => setCount(+e.target.value)} className="calc-input" /></div>
        </div>
        <div className="form-group"><label>Columns</label><div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>{allCols.map(c => <label key={c} style={{ display: 'flex', gap: 6, alignItems: 'center', fontSize: '0.813rem', cursor: 'pointer', padding: '4px 10px', background: cols.includes(c) ? 'var(--primary-50)' : 'var(--neutral-50)', border: `1px solid ${cols.includes(c) ? 'var(--primary-300)' : 'var(--neutral-200)'}`, borderRadius: 'var(--radius-sm)' }}><input type="checkbox" checked={cols.includes(c)} onChange={() => toggle(c)} />{c}</label>)}</div></div>
        <div className="devtool-actions"><button onClick={generate} disabled={!cols.length} className="btn btn-primary"><Icon name="Zap" size={18} />Generate</button>{data.length > 0 && <button onClick={download} className="btn btn-secondary"><Icon name="Download" size={18} />Download CSV</button>}{data.length > 0 && <button onClick={() => navigator.clipboard.writeText(toCsv())} className="btn btn-ghost"><Icon name="File" size={18} />Copy</button>}</div>
        {data.length > 0 && <div className="amort-table-wrap"><table className="amort-table"><thead><tr>{cols.map(c => <th key={c} style={{ textAlign: 'left' }}>{c}</th>)}</tr></thead><tbody>{data.map((r, i) => <tr key={i}>{cols.map(c => <td key={c} style={{ textAlign: 'left' }}>{r[c]}</td>)}</tr>)}</tbody></table></div>}
      </div>
    </ToolPageWrapper>
  );
};
export default FakeDataGenerator;
