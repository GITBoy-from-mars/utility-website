import React, { useState, useMemo } from 'react';
import ToolPageWrapper from '../../components/common/ToolPageWrapper';
import meta from './meta';
import '../emi-calculator/EmiCalculator.css';
const PasswordStrengthChecker = () => {
  const [pw, setPw] = useState('');
  const analysis = useMemo(() => {
    if (!pw) return null;
    const checks = [
      { label: 'At least 8 characters', pass: pw.length >= 8 },
      { label: 'Uppercase letter', pass: /[A-Z]/.test(pw) },
      { label: 'Lowercase letter', pass: /[a-z]/.test(pw) },
      { label: 'Number', pass: /\d/.test(pw) },
      { label: 'Special character', pass: /[^A-Za-z0-9]/.test(pw) },
      { label: '12+ characters', pass: pw.length >= 12 },
      { label: 'No common patterns', pass: !/^(password|123456|qwerty|abc123)/i.test(pw) },
    ];
    const score = checks.filter(c => c.pass).length;
    let strength = 'Very Weak', color = '#EF4444';
    if (score >= 6) { strength = 'Very Strong'; color = '#10B981'; }
    else if (score >= 5) { strength = 'Strong'; color = '#3B82F6'; }
    else if (score >= 4) { strength = 'Medium'; color = '#F59E0B'; }
    else if (score >= 2) { strength = 'Weak'; color = '#F97316'; }
    let charPool = 0;
    if (/[a-z]/.test(pw)) charPool += 26;
    if (/[A-Z]/.test(pw)) charPool += 26;
    if (/\d/.test(pw)) charPool += 10;
    if (/[^A-Za-z0-9]/.test(pw)) charPool += 32;
    const entropy = (pw.length * Math.log2(charPool || 1)).toFixed(1);
    const combos = Math.pow(charPool || 1, pw.length);
    const crackTime = combos / 1e10; // 10 billion guesses/sec
    let timeStr = crackTime < 1 ? 'Instantly' : crackTime < 60 ? `${Math.round(crackTime)}s` : crackTime < 3600 ? `${Math.round(crackTime / 60)}m` : crackTime < 86400 ? `${Math.round(crackTime / 3600)}h` : crackTime < 31536000 ? `${Math.round(crackTime / 86400)}d` : `${(crackTime / 31536000).toExponential(1)} years`;
    return { checks, score, strength, color, entropy, timeStr };
  }, [pw]);
  return (
    <ToolPageWrapper meta={meta}>
      <div className="calc-tool">
        <div className="calc-inputs"><div className="form-group"><label>Enter Password</label><input type="text" value={pw} onChange={e => setPw(e.target.value)} className="calc-input" placeholder="Type a password..." style={{ fontFamily: 'monospace' }} /></div></div>
        {analysis && (<>
          <div className="calc-results" style={{ gridTemplateColumns: 'repeat(3,1fr)' }}>
            <div className="calc-result-card" style={{ borderColor: analysis.color }}><span className="calc-result-label">Strength</span><span className="calc-result-value" style={{ color: analysis.color }}>{analysis.strength}</span></div>
            <div className="calc-result-card"><span className="calc-result-label">Entropy</span><span className="calc-result-value">{analysis.entropy} bits</span></div>
            <div className="calc-result-card"><span className="calc-result-label">Crack Time</span><span className="calc-result-value">{analysis.timeStr}</span></div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>{analysis.checks.map((c, i) => <div key={i} style={{ display: 'flex', gap: 8, fontSize: '0.875rem', color: c.pass ? '#10B981' : 'var(--neutral-400)' }}><span>{c.pass ? '✓' : '✗'}</span>{c.label}</div>)}</div>
        </>)}
      </div>
    </ToolPageWrapper>
  );
};
export default PasswordStrengthChecker;
