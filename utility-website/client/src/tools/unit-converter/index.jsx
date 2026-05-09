import React, { useState, useMemo, useEffect } from 'react';
import ToolPageWrapper from '../../components/common/ToolPageWrapper';
import meta from './meta';
import '../emi-calculator/EmiCalculator.css';

const units = {
  length: { m: 1, km: 1000, cm: 0.01, mm: 0.001, mi: 1609.344, yd: 0.9144, ft: 0.3048, in: 0.0254 },
  weight: { kg: 1, g: 0.001, mg: 0.000001, lb: 0.453592, oz: 0.0283495, ton: 1000 },
  temperature: { special: true },
};

const tempConvert = (val, from, to) => {
  let c;
  if (from === 'C') c = val; else if (from === 'F') c = (val - 32) * 5 / 9; else c = val - 273.15;
  if (to === 'C') return c; if (to === 'F') return c * 9 / 5 + 32; return c + 273.15;
};

const UnitConverter = () => {
  const [category, setCategory] = useState('length');
  const [from, setFrom] = useState('m');
  const [to, setTo] = useState('km');
  const [value, setValue] = useState(1);
  const [currencyRates, setCurrencyRates] = useState(null);
  const [manualRate, setManualRate] = useState('');
  const [currencyFrom, setCurrencyFrom] = useState('USD');
  const [currencyTo, setCurrencyTo] = useState('INR');

  useEffect(() => {
    if (category === 'currency') {
      fetch('https://open.er-api.com/v6/latest/USD')
        .then(r => r.json()).then(d => { if (d.rates) setCurrencyRates(d.rates); })
        .catch(() => setCurrencyRates(null));
    }
  }, [category]);

  const result = useMemo(() => {
    if (category === 'temperature') return tempConvert(value, from, to);
    if (category === 'currency') {
      if (manualRate) return value * Number(manualRate);
      if (!currencyRates) return 0;
      const usdVal = value / (currencyRates[currencyFrom] || 1);
      return usdVal * (currencyRates[currencyTo] || 1);
    }
    const u = units[category];
    return (value * u[from]) / u[to];
  }, [category, from, to, value, currencyRates, currencyFrom, currencyTo, manualRate]);

  const unitKeys = category === 'temperature' ? ['C', 'F', 'K'] : category === 'currency' ? [] : Object.keys(units[category] || {});
  const currencyList = currencyRates ? Object.keys(currencyRates).sort() : ['USD', 'EUR', 'GBP', 'INR', 'JPY', 'AUD', 'CAD'];

  useEffect(() => {
    if (category === 'length') { setFrom('m'); setTo('km'); }
    else if (category === 'weight') { setFrom('kg'); setTo('lb'); }
    else if (category === 'temperature') { setFrom('C'); setTo('F'); }
    else if (category === 'currency') { setCurrencyFrom('USD'); setCurrencyTo('INR'); }
  }, [category]);

  return (
    <ToolPageWrapper meta={meta}>
      <div className="calc-tool">
        <div className="pms-mode-toggle" style={{ background: 'var(--neutral-100)', borderRadius: 'var(--radius-md)', padding: 4, display: 'flex', gap: 4, flexWrap: 'wrap' }}>
          {['length', 'weight', 'temperature', 'currency'].map(c => (
            <button key={c} className={`pms-mode-btn ${category === c ? 'active' : ''}`} onClick={() => setCategory(c)} style={{ textTransform: 'capitalize' }}>{c}</button>
          ))}
        </div>
        <div className="calc-inputs">
          <div className="form-group"><label>Value</label><input type="number" value={value} onChange={e => setValue(Number(e.target.value))} className="calc-input" /></div>
          {category !== 'currency' ? (
            <div className="calc-row">
              <div className="form-group" style={{ flex: 1 }}><label>From</label><select value={from} onChange={e => setFrom(e.target.value)} className="calc-select" style={{ width: '100%' }}>{unitKeys.map(u => <option key={u} value={u}>{u}</option>)}</select></div>
              <div className="form-group" style={{ flex: 1 }}><label>To</label><select value={to} onChange={e => setTo(e.target.value)} className="calc-select" style={{ width: '100%' }}>{unitKeys.map(u => <option key={u} value={u}>{u}</option>)}</select></div>
            </div>
          ) : (
            <>
              <div className="calc-row">
                <div className="form-group" style={{ flex: 1 }}><label>From</label><select value={currencyFrom} onChange={e => setCurrencyFrom(e.target.value)} className="calc-select" style={{ width: '100%' }}>{currencyList.map(c => <option key={c} value={c}>{c}</option>)}</select></div>
                <div className="form-group" style={{ flex: 1 }}><label>To</label><select value={currencyTo} onChange={e => setCurrencyTo(e.target.value)} className="calc-select" style={{ width: '100%' }}>{currencyList.map(c => <option key={c} value={c}>{c}</option>)}</select></div>
              </div>
              {!currencyRates && (
                <div className="form-group"><label>Manual Exchange Rate (1 {currencyFrom} = ? {currencyTo})</label><input type="number" step="0.01" value={manualRate} onChange={e => setManualRate(e.target.value)} className="calc-input" placeholder="Enter rate manually" /></div>
              )}
            </>
          )}
        </div>
        <div className="calc-results" style={{ gridTemplateColumns: '1fr' }}>
          <div className="calc-result-card calc-result-primary">
            <span className="calc-result-label">Result</span>
            <span className="calc-result-value">
              {value} {category === 'currency' ? currencyFrom : from} = {result.toLocaleString(undefined, { maximumFractionDigits: 6 })} {category === 'currency' ? currencyTo : to}
            </span>
          </div>
        </div>
        {category === 'currency' && currencyRates && <p style={{ fontSize: '0.75rem', color: 'var(--neutral-400)', textAlign: 'center' }}>Rates from open.er-api.com · Updated live</p>}
        {category === 'currency' && !currencyRates && !manualRate && <p style={{ fontSize: '0.813rem', color: 'var(--warning)', textAlign: 'center' }}>Could not fetch live rates. Please enter the exchange rate manually above.</p>}
      </div>
    </ToolPageWrapper>
  );
};
export default UnitConverter;
