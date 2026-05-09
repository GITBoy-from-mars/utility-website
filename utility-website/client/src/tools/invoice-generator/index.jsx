import React, { useState, useRef } from 'react';
import ToolPageWrapper from '../../components/common/ToolPageWrapper';
import { Icon } from '../../assets/icons/icons';
import meta from './meta';
import './InvoiceGenerator.css';

const defaultItems = [{ desc: 'Web Development Service', qty: 1, rate: 50000 }, { desc: 'UI/UX Design', qty: 1, rate: 25000 }];

const templates = {
  modern: { primary: '#3B82F6', headerBg: '#3B82F6', headerText: '#fff', tableBg: '#3B82F6', metaBg: '#EFF6FF', font: "'Segoe UI', sans-serif" },
  classic: { primary: '#1a1a2e', headerBg: '#1a1a2e', headerText: '#fff', tableBg: '#1a1a2e', metaBg: '#f5f5f5', font: "'Georgia', serif" },
  minimal: { primary: '#333', headerBg: '#fff', headerText: '#333', tableBg: '#555', metaBg: '#fafafa', font: "'Helvetica Neue', sans-serif" },
  corporate: { primary: '#0D47A1', headerBg: '#0D47A1', headerText: '#fff', tableBg: '#0D47A1', metaBg: '#E3F2FD', font: "'Arial', sans-serif" },
  creative: { primary: '#7C3AED', headerBg: 'linear-gradient(135deg, #7C3AED, #EC4899)', headerText: '#fff', tableBg: '#7C3AED', metaBg: '#F5F3FF', font: "'Poppins', sans-serif" },
};

const InvoiceGenerator = () => {
  const [template, setTemplate] = useState('modern');
  const [logo, setLogo] = useState(null);
  const [company, setCompany] = useState({ name: 'Your Company', address: '123 Business Ave, City, State 560001', phone: '+91 98765 43210', email: 'info@company.com', gst: '', pan: '' });
  const [client, setClient] = useState({ name: 'Client Name', address: 'Client Address, City', email: 'client@email.com', phone: '' });
  const [inv, setInv] = useState({ number: 'INV-001', date: new Date().toISOString().split('T')[0], due: '', type: 'Invoice' });
  const [items, setItems] = useState(defaultItems);
  const [taxRate, setTaxRate] = useState(18);
  const [discount, setDiscount] = useState(0);
  const [notes, setNotes] = useState('Thank you for your business!');
  const [terms, setTerms] = useState('Payment is due within 30 days of invoice date.');
  const [bankDetails, setBankDetails] = useState({ bank: '', account: '', ifsc: '' });
  const printRef = useRef(null);

  const addItem = () => setItems([...items, { desc: '', qty: 1, rate: 0 }]);
  const updateItem = (i, field, val) => { const c = [...items]; c[i] = { ...c[i], [field]: field === 'desc' ? val : +val }; setItems(c); };
  const removeItem = i => setItems(items.filter((_, idx) => idx !== i));

  const subtotal = items.reduce((s, it) => s + it.qty * it.rate, 0);
  const discountAmt = subtotal * (discount / 100);
  const taxable = subtotal - discountAmt;
  const tax = taxable * (taxRate / 100);
  const total = taxable + tax;
  const fmt = n => '₹' + n.toLocaleString('en-IN', { minimumFractionDigits: 2 });

  const t = templates[template];

  const handleLogo = e => { const f = e.target.files[0]; if (f) { const r = new FileReader(); r.onload = ev => setLogo(ev.target.result); r.readAsDataURL(f); } };

  const print = () => {
    const content = printRef.current;
    const win = window.open('', '_blank');
    win.document.write(`<html><head><title>${inv.type} ${inv.number}</title>
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap" rel="stylesheet">
    <style>
      *{margin:0;padding:0;box-sizing:border-box;font-family:${t.font}}
      body{padding:40px;color:#1a1a2e;font-size:13px}
      .inv-header{display:flex;justify-content:space-between;margin-bottom:28px;padding-bottom:20px;border-bottom:3px solid ${t.primary}}
      .inv-logo img{max-height:60px;margin-bottom:8px}
      .inv-company{font-size:11px;color:#555;line-height:1.6}
      .inv-company strong{font-size:14px;color:#222}
      .inv-title{font-size:32px;font-weight:800;color:${t.primary};text-align:right;text-transform:uppercase;letter-spacing:1px}
      .inv-title-sub{font-size:11px;color:#888;text-align:right;margin-top:4px}
      .inv-meta{display:flex;justify-content:space-between;margin-bottom:24px;padding:16px 20px;background:${t.metaBg};border-radius:8px;border-left:4px solid ${t.primary}}
      .inv-meta-group{font-size:11px;line-height:1.8;color:#444}
      .inv-meta-group strong{display:block;font-size:12px;margin-bottom:2px;color:${t.primary};text-transform:uppercase;letter-spacing:0.5px}
      table{width:100%;border-collapse:collapse;margin-bottom:24px}
      th{background:${t.tableBg};color:#fff;padding:10px 14px;font-size:11px;text-align:left;text-transform:uppercase;letter-spacing:0.5px}
      td{padding:10px 14px;border-bottom:1px solid #eee;font-size:12px}
      tr:nth-child(even) td{background:#fafafa}
      .text-right{text-align:right}
      .inv-totals{display:flex;justify-content:flex-end}
      .inv-totals-table{width:280px}
      .inv-totals-row{display:flex;justify-content:space-between;padding:6px 0;font-size:12px;border-bottom:1px solid #eee}
      .inv-totals-row.discount{color:#E11D48}
      .inv-totals-row.total{font-size:16px;font-weight:800;border-top:3px solid ${t.primary};border-bottom:none;padding-top:12px;color:${t.primary}}
      .inv-footer{margin-top:32px;display:grid;grid-template-columns:1fr 1fr;gap:20px}
      .inv-footer-section{padding:14px 16px;background:#f8f9fa;border-radius:6px;font-size:11px;color:#555;line-height:1.6}
      .inv-footer-section strong{display:block;margin-bottom:4px;color:#333;font-size:12px}
      .inv-stamp{margin-top:40px;text-align:right;padding-top:40px}
      .inv-stamp-line{border-top:1px solid #333;display:inline-block;padding-top:6px;font-size:11px;color:#555;min-width:200px;text-align:center}
      @media print{body{padding:20px}}
    </style></head><body>`);
    win.document.write(content.innerHTML);
    win.document.write('</body></html>');
    win.document.close();
    setTimeout(() => { win.print(); win.close(); }, 600);
  };

  return (
    <ToolPageWrapper meta={meta}>
      <div className="invoice-tool">
        <div className="invoice-controls">
          <h3 style={{ display: 'flex', alignItems: 'center', gap: 8 }}>⚙️ Settings</h3>
          <div className="form-group"><label>Template Style</label>
            <div className="inv-template-grid">
              {Object.keys(templates).map(k => (
                <button key={k} className={`inv-template-btn ${template === k ? 'active' : ''}`} onClick={() => setTemplate(k)} style={{ borderColor: template === k ? templates[k].primary : 'var(--neutral-200)' }}>
                  <div className="inv-template-preview" style={{ background: templates[k].primary }} />
                  <span>{k.charAt(0).toUpperCase() + k.slice(1)}</span>
                </button>
              ))}
            </div>
          </div>
          <div className="form-group"><label>Logo</label><input type="file" accept="image/*" onChange={handleLogo} style={{ fontSize: '0.813rem' }} /></div>
          <div className="form-group"><label>Document Type</label><select value={inv.type} onChange={e => setInv({ ...inv, type: e.target.value })} className="qr-select"><option>Invoice</option><option>Quotation</option><option>Proforma Invoice</option><option>Tax Invoice</option><option>Credit Note</option><option>Delivery Challan</option></select></div>
          <div style={{ display: 'flex', gap: 8 }}>
            <div className="form-group" style={{ flex: 1 }}><label>Number</label><input value={inv.number} onChange={e => setInv({ ...inv, number: e.target.value })} className="calc-input" /></div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <div className="form-group" style={{ flex: 1 }}><label>Date</label><input type="date" value={inv.date} onChange={e => setInv({ ...inv, date: e.target.value })} className="calc-input" /></div>
            <div className="form-group" style={{ flex: 1 }}><label>Due Date</label><input type="date" value={inv.due} onChange={e => setInv({ ...inv, due: e.target.value })} className="calc-input" /></div>
          </div>
          <hr />
          <h4>📤 From (Your Company)</h4>
          {Object.entries(company).map(([k, v]) => <div key={k} className="form-group"><label>{k === 'gst' ? 'GSTIN' : k === 'pan' ? 'PAN' : k.charAt(0).toUpperCase() + k.slice(1)}</label><input value={v} onChange={e => setCompany({ ...company, [k]: e.target.value })} className="calc-input" /></div>)}
          <hr />
          <h4>📥 To (Client)</h4>
          {Object.entries(client).map(([k, v]) => <div key={k} className="form-group"><label>{k.charAt(0).toUpperCase() + k.slice(1)}</label><input value={v} onChange={e => setClient({ ...client, [k]: e.target.value })} className="calc-input" /></div>)}
          <hr />
          <h4>📋 Items</h4>
          {items.map((it, i) => <div key={i} style={{ display: 'flex', gap: 6, alignItems: 'end', marginBottom: 8 }}>
            <div className="form-group" style={{ flex: 3 }}><label>{i === 0 ? 'Description' : ''}</label><input value={it.desc} onChange={e => updateItem(i, 'desc', e.target.value)} className="calc-input" /></div>
            <div className="form-group" style={{ flex: 1 }}><label>{i === 0 ? 'Qty' : ''}</label><input type="number" value={it.qty} onChange={e => updateItem(i, 'qty', e.target.value)} className="calc-input" /></div>
            <div className="form-group" style={{ flex: 1.5 }}><label>{i === 0 ? 'Rate (₹)' : ''}</label><input type="number" value={it.rate} onChange={e => updateItem(i, 'rate', e.target.value)} className="calc-input" /></div>
            <button onClick={() => removeItem(i)} className="btn btn-ghost btn-sm" style={{ color: 'var(--error)', marginBottom: 2 }}>×</button>
          </div>)}
          <button onClick={addItem} className="btn btn-ghost btn-sm">+ Add Item</button>
          <div style={{ display: 'flex', gap: 8 }}>
            <div className="form-group" style={{ flex: 1 }}><label>Tax (%)</label><input type="number" value={taxRate} onChange={e => setTaxRate(+e.target.value)} className="calc-input" /></div>
            <div className="form-group" style={{ flex: 1 }}><label>Discount (%)</label><input type="number" value={discount} onChange={e => setDiscount(+e.target.value)} className="calc-input" /></div>
          </div>
          <hr />
          <h4>🏦 Bank Details (optional)</h4>
          <div className="form-group"><label>Bank Name</label><input value={bankDetails.bank} onChange={e => setBankDetails({ ...bankDetails, bank: e.target.value })} className="calc-input" /></div>
          <div className="form-group"><label>Account Number</label><input value={bankDetails.account} onChange={e => setBankDetails({ ...bankDetails, account: e.target.value })} className="calc-input" /></div>
          <div className="form-group"><label>IFSC Code</label><input value={bankDetails.ifsc} onChange={e => setBankDetails({ ...bankDetails, ifsc: e.target.value })} className="calc-input" /></div>
          <hr />
          <div className="form-group"><label>Notes</label><textarea value={notes} onChange={e => setNotes(e.target.value)} className="devtool-textarea" rows={2} /></div>
          <div className="form-group"><label>Terms & Conditions</label><textarea value={terms} onChange={e => setTerms(e.target.value)} className="devtool-textarea" rows={2} /></div>
          <button onClick={print} className="btn btn-primary btn-lg" style={{ width: '100%', marginTop: 8 }}><Icon name="Download" size={18} />Download / Print PDF</button>
        </div>

        {/* LIVE PREVIEW */}
        <div className="invoice-preview" ref={printRef}>
          <div className="inv-header">
            <div>
              {logo && <div className="inv-logo"><img src={logo} alt="Logo" /></div>}
              <div className="inv-company">
                <strong>{company.name}</strong><br />
                {company.address}<br />
                {company.phone && <>📞 {company.phone}<br /></>}
                {company.email && <>✉ {company.email}<br /></>}
                {company.gst && <>GSTIN: {company.gst}<br /></>}
                {company.pan && <>PAN: {company.pan}</>}
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div className="inv-title">{inv.type}</div>
              <div className="inv-title-sub">#{inv.number}</div>
            </div>
          </div>

          <div className="inv-meta">
            <div className="inv-meta-group">
              <strong>Bill To</strong>
              {client.name}<br />
              {client.address}<br />
              {client.email && <>✉ {client.email}<br /></>}
              {client.phone && <>📞 {client.phone}</>}
            </div>
            <div className="inv-meta-group" style={{ textAlign: 'right' }}>
              <strong>Invoice Details</strong>
              Date: {inv.date}<br />
              {inv.due && <>Due: {inv.due}<br /></>}
              Status: <span style={{ color: '#F59E0B', fontWeight: 700 }}>Pending</span>
            </div>
          </div>

          <table>
            <thead><tr><th style={{ width: 30 }}>#</th><th>Description</th><th className="text-right">Qty</th><th className="text-right">Rate</th><th className="text-right">Amount</th></tr></thead>
            <tbody>
              {items.map((it, i) => (
                <tr key={i}>
                  <td>{i + 1}</td>
                  <td>{it.desc || '—'}</td>
                  <td className="text-right">{it.qty}</td>
                  <td className="text-right">{fmt(it.rate)}</td>
                  <td className="text-right" style={{ fontWeight: 600 }}>{fmt(it.qty * it.rate)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="inv-totals"><div className="inv-totals-table">
            <div className="inv-totals-row"><span>Subtotal</span><span>{fmt(subtotal)}</span></div>
            {discount > 0 && <div className="inv-totals-row discount"><span>Discount ({discount}%)</span><span>-{fmt(discountAmt)}</span></div>}
            <div className="inv-totals-row"><span>Tax ({taxRate}%)</span><span>{fmt(tax)}</span></div>
            <div className="inv-totals-row total"><span>Total</span><span>{fmt(total)}</span></div>
          </div></div>

          <div className="inv-footer">
            {(notes || terms) && <div className="inv-footer-section">
              {notes && <><strong>Notes</strong>{notes}<br /><br /></>}
              {terms && <><strong>Terms & Conditions</strong>{terms}</>}
            </div>}
            {bankDetails.bank && <div className="inv-footer-section">
              <strong>Bank Details</strong>
              Bank: {bankDetails.bank}<br />
              A/C: {bankDetails.account}<br />
              IFSC: {bankDetails.ifsc}
            </div>}
          </div>

          <div className="inv-stamp">
            <div className="inv-stamp-line">Authorized Signatory</div>
          </div>
        </div>
      </div>
    </ToolPageWrapper>
  );
};
export default InvoiceGenerator;
