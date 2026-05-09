import React, { useState, useMemo } from 'react';
import ToolPageWrapper from '../../components/common/ToolPageWrapper';
import meta from './meta';
import '../emi-calculator/EmiCalculator.css';

const AgeCalculator = () => {
  const [dob, setDob] = useState('2000-01-01');
  const [toDate, setToDate] = useState(new Date().toISOString().split('T')[0]);

  const result = useMemo(() => {
    const d1 = new Date(dob); const d2 = new Date(toDate);
    if (isNaN(d1) || isNaN(d2) || d1 > d2) return null;
    let years = d2.getFullYear() - d1.getFullYear();
    let months = d2.getMonth() - d1.getMonth();
    let days = d2.getDate() - d1.getDate();
    if (days < 0) { months--; const prev = new Date(d2.getFullYear(), d2.getMonth(), 0); days += prev.getDate(); }
    if (months < 0) { years--; months += 12; }
    const diffMs = d2 - d1;
    const totalDays = Math.floor(diffMs / 86400000);
    const totalWeeks = Math.floor(totalDays / 7);
    const totalHours = Math.floor(diffMs / 3600000);
    const totalMinutes = Math.floor(diffMs / 60000);
    const nextBday = new Date(d2.getFullYear(), d1.getMonth(), d1.getDate());
    if (nextBday <= d2) nextBday.setFullYear(nextBday.getFullYear() + 1);
    const daysUntilBday = Math.ceil((nextBday - d2) / 86400000);
    return { years, months, days, totalDays, totalWeeks, totalHours, totalMinutes, daysUntilBday };
  }, [dob, toDate]);

  return (
    <ToolPageWrapper meta={meta}>
      <div className="calc-tool">
        <div className="calc-inputs">
          <div className="calc-row">
            <div className="form-group" style={{ flex: 1 }}><label>Date of Birth</label><input type="date" value={dob} onChange={e => setDob(e.target.value)} className="calc-input" /></div>
            <div className="form-group" style={{ flex: 1 }}><label>As of Date</label><input type="date" value={toDate} onChange={e => setToDate(e.target.value)} className="calc-input" /></div>
          </div>
        </div>
        {result && (
          <>
            <div className="calc-results">
              <div className="calc-result-card calc-result-primary"><span className="calc-result-label">Age</span><span className="calc-result-value">{result.years}y {result.months}m {result.days}d</span></div>
              <div className="calc-result-card"><span className="calc-result-label">Next Birthday</span><span className="calc-result-value">{result.daysUntilBday} days</span></div>
              <div className="calc-result-card"><span className="calc-result-label">Total Days</span><span className="calc-result-value">{result.totalDays.toLocaleString()}</span></div>
            </div>
            <div className="calc-results" style={{ gridTemplateColumns: 'repeat(3,1fr)' }}>
              <div className="calc-result-card"><span className="calc-result-label">Weeks</span><span className="calc-result-value">{result.totalWeeks.toLocaleString()}</span></div>
              <div className="calc-result-card"><span className="calc-result-label">Hours</span><span className="calc-result-value">{result.totalHours.toLocaleString()}</span></div>
              <div className="calc-result-card"><span className="calc-result-label">Minutes</span><span className="calc-result-value">{result.totalMinutes.toLocaleString()}</span></div>
            </div>
          </>
        )}
      </div>
    </ToolPageWrapper>
  );
};
export default AgeCalculator;
