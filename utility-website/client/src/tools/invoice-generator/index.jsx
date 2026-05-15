import React, { useState, useRef } from 'react';
import ToolPageWrapper from '../../components/common/ToolPageWrapper';
import { Icon } from '../../assets/icons/icons';
import meta from './meta';
import './InvoiceGenerator.css';

const defaultItems = [{ desc: 'Web Development Service', qty: 1, rate: 50000 }, { desc: 'UI/UX Design', qty: 1, rate: 25000 }];

/* Each template defines: colors + a unique printCSS function that returns the full stylesheet */
const TEMPLATES = [
  { id:'corporate', name:'Corporate', primary:'#1B3A5C', accent:'#E8EDF2', table:'#1B3A5C' },
  { id:'executive', name:'Executive', primary:'#2C3E50', accent:'#F8F6F0', table:'#2C3E50', gold:'#B8860B' },
  { id:'minimal', name:'Minimal', primary:'#333333', accent:'#FAFAFA', table:'#444' },
  { id:'modern', name:'Modern', primary:'#0066CC', accent:'#F0F6FF', table:'#0066CC' },
  { id:'startup', name:'Startup', primary:'#E84D1A', accent:'#FFF8F5', table:'#E84D1A' },
  { id:'legal', name:'Legal', primary:'#1A1A2E', accent:'#F5F5F5', table:'#1A1A2E' },
  { id:'consulting', name:'Consulting', primary:'#2D5F2D', accent:'#F0F7F0', table:'#2D5F2D' },
  { id:'finance', name:'Finance', primary:'#003366', accent:'#EDF2F7', table:'#003366', stripe:'#F7FAFC' },
  { id:'tech', name:'Tech', primary:'#4A148C', accent:'#F3E5F5', table:'#4A148C' },
  { id:'elegant', name:'Elegant', primary:'#1C1C1C', accent:'#FAFAF8', table:'#1C1C1C', gold:'#C5A55A' },
];

const getPrintCSS = (t, template) => {
  const isGold = t.gold;
  const borderAccent = isGold ? t.gold : t.primary;
  return `*{margin:0;padding:0;box-sizing:border-box}
body{padding:0;color:#222;font-size:12px;font-family:'Segoe UI',Arial,sans-serif}
.page{padding:40px 48px;position:relative;min-height:100vh}
.page::before{content:'';position:absolute;top:0;left:0;width:6px;height:100%;background:${t.primary}}
.page::after{content:'${template === 'legal' ? '' : ''}';position:absolute;bottom:40px;right:48px;font-size:72px;font-weight:900;color:${t.primary};opacity:0.03;text-transform:uppercase;letter-spacing:4px}
.hdr{display:flex;justify-content:space-between;align-items:flex-start;padding-bottom:24px;margin-bottom:24px;border-bottom:2px solid ${t.primary}}
.hdr-logo img{max-height:52px;margin-bottom:6px}
.hdr-co{font-size:10px;color:#555;line-height:1.8}
.hdr-co b{font-size:14px;color:#111;display:block;margin-bottom:2px;letter-spacing:0.3px}
.hdr-right{text-align:right}
.hdr-type{font-size:24px;font-weight:800;color:${t.primary};text-transform:uppercase;letter-spacing:2px}
.hdr-num{font-size:10px;color:#888;margin-top:2px;letter-spacing:0.5px}
.meta{display:flex;justify-content:space-between;padding:16px 20px;margin-bottom:24px;background:${t.accent};border-left:3px solid ${borderAccent}}
.meta-g{font-size:10px;line-height:2;color:#444}
.meta-g b{display:block;font-size:10px;color:${t.primary};text-transform:uppercase;letter-spacing:1px;margin-bottom:2px;font-weight:700}
table{width:100%;border-collapse:collapse;margin-bottom:24px}
th{background:${t.table};color:#fff;padding:9px 14px;font-size:9px;text-align:left;text-transform:uppercase;letter-spacing:1px;font-weight:600}
th:first-child{width:30px}
td{padding:9px 14px;font-size:11px;border-bottom:1px solid #E5E5E5}
tr:nth-child(even) td{background:${t.stripe || '#FAFAFA'}}
.tr{text-align:right}
.tots{display:flex;justify-content:flex-end}
.tots-t{width:260px}
.tots-r{display:flex;justify-content:space-between;padding:5px 0;font-size:11px;color:#444;border-bottom:1px solid #eee}
.tots-r.disc{color:#C41E3A}
.tots-r.total{font-size:15px;font-weight:800;border-top:2px solid ${t.primary};border-bottom:none;padding-top:10px;margin-top:4px;color:${t.primary}}
.ftr{margin-top:28px;display:grid;grid-template-columns:1fr 1fr;gap:16px}
.ftr-s{padding:12px 14px;background:${t.accent};font-size:10px;color:#555;line-height:1.7;border-left:2px solid ${borderAccent}}
.ftr-s b{display:block;margin-bottom:3px;color:#222;font-size:10px;text-transform:uppercase;letter-spacing:0.5px}
.stamp{margin-top:44px;text-align:right;padding-top:44px}
.stamp-l{border-top:1px solid #222;display:inline-block;padding-top:6px;font-size:9px;color:#555;min-width:180px;text-align:center;text-transform:uppercase;letter-spacing:1px}
@media print{.page{padding:24px 32px}.page::before{width:4px}}`;
};

const InvoiceGenerator = () => {
  const [tplIdx, setTplIdx] = useState(0);
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
  const updateItem = (i, f, v) => { const c = [...items]; c[i] = { ...c[i], [f]: f === 'desc' ? v : +v }; setItems(c); };
  const removeItem = i => setItems(items.filter((_, x) => x !== i));

  const subtotal = items.reduce((s, it) => s + it.qty * it.rate, 0);
  const discountAmt = subtotal * (discount / 100);
  const taxable = subtotal - discountAmt;
  const tax = taxable * (taxRate / 100);
  const total = taxable + tax;
  const fmt = n => '\u20B9' + n.toLocaleString('en-IN', { minimumFractionDigits: 2 });

  const t = TEMPLATES[tplIdx];
  const handleLogo = e => { const f = e.target.files[0]; if (f) { const r = new FileReader(); r.onload = ev => setLogo(ev.target.result); r.readAsDataURL(f); } };

  const buildHTML = () => `<div class="page">
<div class="hdr"><div>${logo ? `<div class="hdr-logo"><img src="${logo}" alt="Logo"></div>` : ''}
<div class="hdr-co"><b>${company.name}</b>${company.address}<br>
${company.phone ? 'Tel: ' + company.phone + '<br>' : ''}${company.email ? company.email + '<br>' : ''}
${company.gst ? 'GSTIN: ' + company.gst + '<br>' : ''}${company.pan ? 'PAN: ' + company.pan : ''}</div></div>
<div class="hdr-right"><div class="hdr-type">${inv.type}</div><div class="hdr-num">#${inv.number}</div></div></div>
<div class="meta"><div class="meta-g"><b>Bill To</b>${client.name}<br>${client.address}<br>
${client.email ? client.email + '<br>' : ''}${client.phone ? 'Tel: ' + client.phone : ''}</div>
<div class="meta-g" style="text-align:right"><b>Details</b>Date: ${inv.date}<br>
${inv.due ? 'Due: ' + inv.due + '<br>' : ''}Status: <span style="color:#B8860B;font-weight:700">Pending</span></div></div>
<table><thead><tr><th>#</th><th>Description</th><th class="tr">Qty</th><th class="tr">Rate</th><th class="tr">Amount</th></tr></thead>
<tbody>${items.map((it, i) => `<tr><td>${i + 1}</td><td>${it.desc || '\u2014'}</td><td class="tr">${it.qty}</td><td class="tr">${fmt(it.rate)}</td><td class="tr" style="font-weight:600">${fmt(it.qty * it.rate)}</td></tr>`).join('')}</tbody></table>
<div class="tots"><div class="tots-t">
<div class="tots-r"><span>Subtotal</span><span>${fmt(subtotal)}</span></div>
${discount > 0 ? `<div class="tots-r disc"><span>Discount (${discount}%)</span><span>-${fmt(discountAmt)}</span></div>` : ''}
<div class="tots-r"><span>Tax (${taxRate}%)</span><span>${fmt(tax)}</span></div>
<div class="tots-r total"><span>Total</span><span>${fmt(total)}</span></div></div></div>
<div class="ftr">${notes || terms ? `<div class="ftr-s">${notes ? '<b>Notes</b>' + notes + '<br><br>' : ''}${terms ? '<b>Terms &amp; Conditions</b>' + terms : ''}</div>` : ''}
${bankDetails.bank ? `<div class="ftr-s"><b>Bank Details</b>Bank: ${bankDetails.bank}<br>A/C: ${bankDetails.account}<br>IFSC: ${bankDetails.ifsc}</div>` : ''}</div>
<div class="stamp"><div class="stamp-l">Authorized Signatory</div></div></div>`;

  const print = () => {
    const win = window.open('', '_blank');
    win.document.write(`<html><head><title>${inv.type} ${inv.number}</title><style>${getPrintCSS(t, t.id)}</style></head><body>${buildHTML()}</body></html>`);
    win.document.close();
    setTimeout(() => { win.print(); win.close(); }, 600);
  };

  return (
    <ToolPageWrapper meta={meta}>
      <div className="invoice-tool">
        <div className="invoice-controls">
          <h3 className="inv-section-title">Settings</h3>
          <div className="form-group"><label>Template</label>
            <div className="inv-template-grid">
              {TEMPLATES.map((tp, i) => (
                <button key={tp.id} className={`inv-template-btn ${tplIdx === i ? 'active' : ''}`} onClick={() => setTplIdx(i)} style={{ borderColor: tplIdx === i ? tp.primary : undefined }}>
                  <div className="inv-template-preview" style={{ background: tp.primary }} />
                  <span>{tp.name}</span>
                </button>
              ))}
            </div>
          </div>
          <div className="form-group"><label>Logo</label><input type="file" accept="image/*" onChange={handleLogo} style={{ fontSize: '0.813rem' }} /></div>
          <div className="form-group"><label>Document Type</label><select value={inv.type} onChange={e => setInv({ ...inv, type: e.target.value })} className="qr-select"><option>Invoice</option><option>Quotation</option><option>Proforma Invoice</option><option>Tax Invoice</option><option>Credit Note</option></select></div>
          <div style={{ display: 'flex', gap: 8 }}>
            <div className="form-group" style={{ flex: 1 }}><label>Number</label><input value={inv.number} onChange={e => setInv({ ...inv, number: e.target.value })} className="calc-input" /></div>
            <div className="form-group" style={{ flex: 1 }}><label>Date</label><input type="date" value={inv.date} onChange={e => setInv({ ...inv, date: e.target.value })} className="calc-input" /></div>
            <div className="form-group" style={{ flex: 1 }}><label>Due Date</label><input type="date" value={inv.due} onChange={e => setInv({ ...inv, due: e.target.value })} className="calc-input" /></div>
          </div>
          <hr />
          <h4 className="inv-section-title">From (Your Company)</h4>
          {Object.entries(company).map(([k, v]) => <div key={k} className="form-group"><label>{k === 'gst' ? 'GSTIN' : k === 'pan' ? 'PAN' : k.charAt(0).toUpperCase() + k.slice(1)}</label><input value={v} onChange={e => setCompany({ ...company, [k]: e.target.value })} className="calc-input" /></div>)}
          <hr />
          <h4 className="inv-section-title">To (Client)</h4>
          {Object.entries(client).map(([k, v]) => <div key={k} className="form-group"><label>{k.charAt(0).toUpperCase() + k.slice(1)}</label><input value={v} onChange={e => setClient({ ...client, [k]: e.target.value })} className="calc-input" /></div>)}
          <hr />
          <h4 className="inv-section-title">Items</h4>
          {items.map((it, i) => <div key={i} style={{ display: 'flex', gap: 6, alignItems: 'end', marginBottom: 8 }}>
            <div className="form-group" style={{ flex: 3 }}><label>{i === 0 ? 'Description' : ''}</label><input value={it.desc} onChange={e => updateItem(i, 'desc', e.target.value)} className="calc-input" /></div>
            <div className="form-group" style={{ flex: 1 }}><label>{i === 0 ? 'Qty' : ''}</label><input type="number" value={it.qty} onChange={e => updateItem(i, 'qty', e.target.value)} className="calc-input" /></div>
            <div className="form-group" style={{ flex: 1.5 }}><label>{i === 0 ? 'Rate' : ''}</label><input type="number" value={it.rate} onChange={e => updateItem(i, 'rate', e.target.value)} className="calc-input" /></div>
            <button onClick={() => removeItem(i)} className="btn btn-ghost btn-sm" style={{ color: 'var(--error)', marginBottom: 2 }}><Icon name="X" size={14} /></button>
          </div>)}
          <button onClick={addItem} className="btn btn-ghost btn-sm">+ Add Item</button>
          <div style={{ display: 'flex', gap: 8 }}>
            <div className="form-group" style={{ flex: 1 }}><label>Tax (%)</label><input type="number" value={taxRate} onChange={e => setTaxRate(+e.target.value)} className="calc-input" /></div>
            <div className="form-group" style={{ flex: 1 }}><label>Discount (%)</label><input type="number" value={discount} onChange={e => setDiscount(+e.target.value)} className="calc-input" /></div>
          </div>
          <hr />
          <h4 className="inv-section-title">Bank Details (optional)</h4>
          <div className="form-group"><label>Bank Name</label><input value={bankDetails.bank} onChange={e => setBankDetails({ ...bankDetails, bank: e.target.value })} className="calc-input" /></div>
          <div className="form-group"><label>Account Number</label><input value={bankDetails.account} onChange={e => setBankDetails({ ...bankDetails, account: e.target.value })} className="calc-input" /></div>
          <div className="form-group"><label>IFSC Code</label><input value={bankDetails.ifsc} onChange={e => setBankDetails({ ...bankDetails, ifsc: e.target.value })} className="calc-input" /></div>
          <hr />
          <div className="form-group"><label>Notes</label><textarea value={notes} onChange={e => setNotes(e.target.value)} className="devtool-textarea" rows={2} /></div>
          <div className="form-group"><label>Terms</label><textarea value={terms} onChange={e => setTerms(e.target.value)} className="devtool-textarea" rows={2} /></div>
          <button onClick={print} className="btn btn-primary btn-lg" style={{ width: '100%', marginTop: 8 }}><Icon name="Download" size={18} />Download / Print PDF</button>
        </div>

        {/* LIVE PREVIEW */}
        <div className="invoice-preview" ref={printRef} style={{ borderLeft: `5px solid ${t.primary}` }}>
          <div className="inv-header" style={{ borderBottom: `2px solid ${t.primary}` }}>
            <div>
              {logo && <div className="inv-logo"><img src={logo} alt="Logo" /></div>}
              <div className="inv-company"><strong>{company.name}</strong>{company.address}<br />
                {company.phone && <>Tel: {company.phone}<br /></>}
                {company.email && <>{company.email}<br /></>}
                {company.gst && <>GSTIN: {company.gst}<br /></>}
                {company.pan && <>PAN: {company.pan}</>}
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div className="inv-title" style={{ color: t.primary }}>{inv.type}</div>
              <div className="inv-title-sub">#{inv.number}</div>
            </div>
          </div>

          <div className="inv-meta" style={{ background: t.accent, borderLeft: `3px solid ${t.gold || t.primary}` }}>
            <div className="inv-meta-group"><strong style={{ color: t.primary }}>Bill To</strong>{client.name}<br />{client.address}<br />{client.email && <>{client.email}<br /></>}{client.phone && <>Tel: {client.phone}</>}</div>
            <div className="inv-meta-group" style={{ textAlign: 'right' }}><strong style={{ color: t.primary }}>Details</strong>Date: {inv.date}<br />{inv.due && <>Due: {inv.due}<br /></>}Status: <span style={{ color: '#B8860B', fontWeight: 700 }}>Pending</span></div>
          </div>

          <table>
            <thead><tr><th style={{ background: t.table, width: 30 }}>#</th><th style={{ background: t.table }}>Description</th><th className="text-right" style={{ background: t.table }}>Qty</th><th className="text-right" style={{ background: t.table }}>Rate</th><th className="text-right" style={{ background: t.table }}>Amount</th></tr></thead>
            <tbody>{items.map((it, i) => <tr key={i}><td>{i + 1}</td><td>{it.desc || '\u2014'}</td><td className="text-right">{it.qty}</td><td className="text-right">{fmt(it.rate)}</td><td className="text-right" style={{ fontWeight: 600 }}>{fmt(it.qty * it.rate)}</td></tr>)}</tbody>
          </table>

          <div className="inv-totals"><div className="inv-totals-table">
            <div className="inv-totals-row"><span>Subtotal</span><span>{fmt(subtotal)}</span></div>
            {discount > 0 && <div className="inv-totals-row discount"><span>Discount ({discount}%)</span><span>-{fmt(discountAmt)}</span></div>}
            <div className="inv-totals-row"><span>Tax ({taxRate}%)</span><span>{fmt(tax)}</span></div>
            <div className="inv-totals-row total" style={{ borderTopColor: t.primary, color: t.primary }}><span>Total</span><span>{fmt(total)}</span></div>
          </div></div>

          <div className="inv-footer">
            {(notes || terms) && <div className="inv-footer-section" style={{ background: t.accent, borderLeft: `2px solid ${t.gold || t.primary}` }}>{notes && <><strong>Notes</strong>{notes}<br /><br /></>}{terms && <><strong>Terms &amp; Conditions</strong>{terms}</>}</div>}
            {bankDetails.bank && <div className="inv-footer-section" style={{ background: t.accent, borderLeft: `2px solid ${t.gold || t.primary}` }}><strong>Bank Details</strong>Bank: {bankDetails.bank}<br />A/C: {bankDetails.account}<br />IFSC: {bankDetails.ifsc}</div>}
          </div>
          <div className="inv-stamp"><div className="inv-stamp-line">Authorized Signatory</div></div>
        </div>
      </div>
    </ToolPageWrapper>
  );
};
export default InvoiceGenerator;
