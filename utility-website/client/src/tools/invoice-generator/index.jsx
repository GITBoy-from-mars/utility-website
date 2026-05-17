import React, { useState, useRef } from 'react';
import ToolPageWrapper from '../../components/common/ToolPageWrapper';
import { Icon } from '../../assets/icons/icons';
import meta from './meta';
import './InvoiceGenerator.css';

const defaultItems = [{ desc: 'Web Development Service', qty: 1, rate: 50000 }, { desc: 'UI/UX Design', qty: 1, rate: 25000 }];

const COLORS = [
  { id:'navy', name:'Navy', primary:'#1B3A5C', table:'#1B3A5C', meta:'#EDF1F5', accent:'#1B3A5C' },
  { id:'charcoal', name:'Charcoal', primary:'#2C2C2C', table:'#2C2C2C', meta:'#F5F5F5', accent:'#2C2C2C' },
  { id:'forest', name:'Forest', primary:'#1E4D2B', table:'#1E4D2B', meta:'#EEF4F0', accent:'#1E4D2B' },
  { id:'maroon', name:'Maroon', primary:'#6B1D2A', table:'#6B1D2A', meta:'#F8F0F1', accent:'#6B1D2A' },
  { id:'steel', name:'Steel Blue', primary:'#2E5984', table:'#2E5984', meta:'#EDF3F8', accent:'#2E5984' },
  { id:'slate', name:'Slate', primary:'#3D4F5F', table:'#3D4F5F', meta:'#F0F2F4', accent:'#3D4F5F' },
];

/* ——— DESIGN LAYOUTS: each returns different print CSS ——— */
const DESIGNS = [
  { id:'classic', name:'Classic — Serif typography, traditional borders' },
  { id:'sidebar', name:'Sidebar — Left accent bar, modern layout' },
  { id:'banner', name:'Banner — Full-width colored header band' },
  { id:'split', name:'Split — Two-column header with divider' },
  { id:'minimal', name:'Minimal — Ultra-clean, no backgrounds' },
  { id:'letterhead', name:'Letterhead — Decorative top band, elegant' },
  { id:'lined', name:'Lined — Clean alternating rows, open style' },
  { id:'premium', name:'Premium — Gold accents, executive serif' },
];

const getDesignCSS = (design, c) => {
  const base = `*{margin:0;padding:0;box-sizing:border-box}
body{color:#222;font-size:12px}
.page{padding:44px 48px;position:relative}
.tr{text-align:right}
table{width:100%;border-collapse:collapse;margin:24px 0}
td{padding:9px 14px;font-size:11px;border-bottom:1px solid #E8E8E8}
tr:nth-child(even) td{background:#FAFAFA}
.tots{display:flex;justify-content:flex-end;margin-top:4px}
.tots-t{width:250px}
.tots-r{display:flex;justify-content:space-between;padding:5px 0;font-size:11px;border-bottom:1px solid #eee}
.tots-r.disc{color:#B91C1C}
.tots-r.total{font-size:14px;font-weight:800;border-top:2px solid ${c.primary};border-bottom:none;padding-top:10px;margin-top:4px;color:${c.primary}}
.ftr{margin-top:28px;display:grid;grid-template-columns:1fr 1fr;gap:16px}
.ftr-s{padding:12px 14px;font-size:10px;color:#555;line-height:1.7}
.ftr-s b{display:block;margin-bottom:3px;color:#222;font-size:10px;text-transform:uppercase;letter-spacing:0.5px}
.stamp{margin-top:44px;text-align:right;padding-top:44px}
.stamp-l{border-top:1px solid #222;display:inline-block;padding-top:6px;font-size:9px;color:#555;min-width:180px;text-align:center;text-transform:uppercase;letter-spacing:1px}
@media print{.page{padding:24px 32px}}`;

  switch(design) {
    case 'classic': return base + `
body{font-family:'Georgia','Times New Roman',serif}
.hdr{display:flex;justify-content:space-between;align-items:flex-start;padding-bottom:20px;margin-bottom:20px;border-bottom:1px solid #ccc}
.hdr-co{font-size:10px;color:#555;line-height:1.8}
.hdr-co b{font-size:16px;color:#111;display:block;margin-bottom:4px;font-family:'Garamond','Georgia',serif;letter-spacing:0.5px}
.hdr-type{font-size:22px;font-weight:700;color:${c.primary};text-transform:uppercase;letter-spacing:3px;font-family:'Garamond','Georgia',serif}
.hdr-num{font-size:10px;color:#888;margin-top:4px;letter-spacing:1px}
.meta{display:flex;justify-content:space-between;padding:14px 18px;margin-bottom:20px;background:${c.meta};border-top:1px solid #ddd;border-bottom:1px solid #ddd}
.meta-g{font-size:10px;line-height:2;color:#444}
.meta-g b{display:block;font-size:9px;color:${c.primary};text-transform:uppercase;letter-spacing:1.5px;margin-bottom:2px}
th{background:${c.table};color:#fff;padding:8px 14px;font-size:9px;text-transform:uppercase;letter-spacing:1px;font-weight:600}
.ftr-s{border-top:1px solid #ddd;padding-top:14px;background:transparent}`;

    case 'sidebar': return base + `
body{font-family:'Segoe UI',Arial,sans-serif}
.page{padding-left:60px}
.page::before{content:'';position:absolute;top:0;left:0;width:8px;height:100%;background:${c.primary}}
.page::after{content:'';position:absolute;top:40px;left:20px;width:24px;height:24px;border:3px solid ${c.primary};border-radius:50%}
.hdr{display:flex;justify-content:space-between;align-items:flex-start;padding-bottom:20px;margin-bottom:20px;border-bottom:2px solid ${c.primary}}
.hdr-co{font-size:10px;color:#555;line-height:1.8}
.hdr-co b{font-size:15px;color:#111;display:block;margin-bottom:2px;font-weight:800}
.hdr-type{font-size:20px;font-weight:800;color:${c.primary};text-transform:uppercase;letter-spacing:2px}
.hdr-num{font-size:10px;color:#888;margin-top:4px}
.meta{display:flex;justify-content:space-between;padding:14px 18px;margin-bottom:20px;background:${c.meta};border-left:4px solid ${c.primary}}
.meta-g{font-size:10px;line-height:2;color:#444}
.meta-g b{display:block;font-size:9px;color:${c.primary};text-transform:uppercase;letter-spacing:1px;margin-bottom:2px}
th{background:${c.table};color:#fff;padding:8px 14px;font-size:9px;text-transform:uppercase;letter-spacing:1px;font-weight:600}
.ftr-s{background:${c.meta};border-left:3px solid ${c.primary};padding-left:14px}`;

    case 'banner': return base + `
body{font-family:'Segoe UI',Arial,sans-serif}
.hdr{background:${c.primary};color:#fff;padding:28px 32px;margin:-44px -48px 24px;display:flex;justify-content:space-between;align-items:center}
.hdr-co{font-size:10px;color:rgba(255,255,255,0.75);line-height:1.8}
.hdr-co b{font-size:16px;color:#fff;display:block;margin-bottom:2px;font-weight:800;letter-spacing:0.5px}
.hdr-type{font-size:28px;font-weight:800;color:rgba(255,255,255,0.9);text-transform:uppercase;letter-spacing:4px}
.hdr-num{font-size:10px;color:rgba(255,255,255,0.5);margin-top:4px;letter-spacing:1px}
.meta{display:flex;justify-content:space-between;padding:14px 18px;margin-bottom:20px;border:1px solid #ddd}
.meta-g{font-size:10px;line-height:2;color:#444}
.meta-g b{display:block;font-size:9px;color:${c.primary};text-transform:uppercase;letter-spacing:1px;margin-bottom:2px}
th{background:${c.table};color:#fff;padding:8px 14px;font-size:9px;text-transform:uppercase;letter-spacing:1px;font-weight:600}
.ftr-s{background:${c.meta};padding:14px}`;

    case 'split': return base + `
body{font-family:'Times New Roman','Georgia',serif}
.hdr{display:grid;grid-template-columns:1fr auto 1fr;gap:24px;align-items:center;padding-bottom:24px;margin-bottom:20px}
.hdr-div{width:2px;height:60px;background:${c.primary}}
.hdr-co{font-size:10px;color:#555;line-height:1.8}
.hdr-co b{font-size:15px;color:#111;display:block;margin-bottom:4px;font-family:'Garamond','Georgia',serif}
.hdr-right{text-align:right}
.hdr-type{font-size:18px;font-weight:700;color:${c.primary};text-transform:uppercase;letter-spacing:4px;font-family:'Garamond','Georgia',serif}
.hdr-num{font-size:10px;color:#888;margin-top:4px;letter-spacing:1px}
.hdr::after{content:'';display:block;grid-column:1/-1;height:1px;background:linear-gradient(90deg,transparent,${c.primary},transparent)}
.meta{display:flex;justify-content:space-between;padding:16px 20px;margin-bottom:20px;border:1px solid ${c.primary}22;background:${c.meta}}
.meta-g{font-size:10px;line-height:2;color:#444}
.meta-g b{display:block;font-size:9px;color:${c.primary};text-transform:uppercase;letter-spacing:1.5px;margin-bottom:2px;font-family:'Garamond','Georgia',serif}
th{background:${c.table};color:#fff;padding:8px 14px;font-size:9px;text-transform:uppercase;letter-spacing:1.5px;font-weight:400;font-family:'Garamond','Georgia',serif}
.ftr-s{border-top:1px solid #ddd;padding-top:14px;background:transparent}
.tots-r.total{font-family:'Garamond','Georgia',serif}`;

    case 'minimal': return base + `
body{font-family:'Helvetica Neue','Arial',sans-serif}
.hdr{display:flex;justify-content:space-between;align-items:flex-start;padding-bottom:20px;margin-bottom:20px}
.hdr-co{font-size:10px;color:#777;line-height:1.8}
.hdr-co b{font-size:14px;color:#111;display:block;margin-bottom:4px;font-weight:600;letter-spacing:1px;text-transform:uppercase}
.hdr-type{font-size:14px;font-weight:400;color:#999;text-transform:uppercase;letter-spacing:6px}
.hdr-num{font-size:28px;font-weight:200;color:${c.primary};margin-top:2px;letter-spacing:-1px}
.meta{display:flex;justify-content:space-between;padding:0 0 16px;margin-bottom:20px;border-bottom:1px solid #eee}
.meta-g{font-size:10px;line-height:2;color:#666}
.meta-g b{display:block;font-size:8px;color:#999;text-transform:uppercase;letter-spacing:2px;margin-bottom:2px}
th{background:transparent;color:${c.primary};padding:8px 14px;font-size:8px;text-transform:uppercase;letter-spacing:2px;font-weight:600;border-bottom:2px solid ${c.primary}}
.ftr-s{background:transparent;border-top:1px solid #eee;padding-top:14px}
.tots-r{border:none}
.tots-r.total{border-top:1px solid #222}`;

    case 'letterhead': return base + `
body{font-family:'Cambria','Georgia',serif}
.page::before{content:'';position:absolute;top:0;left:0;right:0;height:6px;background:linear-gradient(90deg,${c.primary},${c.primary}88,${c.primary})}
.page::after{content:'';position:absolute;bottom:0;left:0;right:0;height:2px;background:${c.primary}44}
.hdr{display:flex;justify-content:space-between;align-items:flex-start;padding:16px 0 20px;margin-bottom:20px;border-bottom:1px solid #ddd}
.hdr-co{font-size:10px;color:#555;line-height:1.8}
.hdr-co b{font-size:16px;color:${c.primary};display:block;margin-bottom:4px;font-family:'Garamond','Georgia',serif;letter-spacing:1px}
.hdr-type{font-size:20px;font-weight:700;color:${c.primary};text-transform:uppercase;letter-spacing:3px;font-family:'Garamond','Georgia',serif}
.hdr-num{font-size:10px;color:#999;margin-top:4px;letter-spacing:1px}
.meta{display:flex;justify-content:space-between;padding:14px 18px;margin-bottom:20px;background:${c.primary}08;border:1px solid ${c.primary}15}
.meta-g{font-size:10px;line-height:2;color:#444}
.meta-g b{display:block;font-size:9px;color:${c.primary};text-transform:uppercase;letter-spacing:1.5px;margin-bottom:2px}
th{background:${c.primary}12;color:${c.primary};padding:8px 14px;font-size:9px;text-transform:uppercase;letter-spacing:1px;font-weight:700;border-bottom:2px solid ${c.primary}}
td{border-bottom:1px solid ${c.primary}15}
.ftr-s{background:${c.primary}06;padding:14px;border-left:2px solid ${c.primary}33}`;

    case 'lined': return base + `
body{font-family:'Segoe UI','Helvetica Neue',sans-serif}
.hdr{display:flex;justify-content:space-between;align-items:flex-start;padding-bottom:16px;margin-bottom:20px}
.hdr-co{font-size:10px;color:#666;line-height:1.8}
.hdr-co b{font-size:14px;color:#222;display:block;margin-bottom:4px;font-weight:700;letter-spacing:0.3px}
.hdr-type{font-size:16px;font-weight:700;color:${c.primary};text-transform:uppercase;letter-spacing:3px;border:2px solid ${c.primary};padding:6px 16px}
.hdr-num{font-size:10px;color:#999;margin-top:6px;text-align:right;letter-spacing:0.5px}
.meta{display:flex;justify-content:space-between;padding:12px 0;margin-bottom:20px;border-top:1px dotted #ccc;border-bottom:1px dotted #ccc}
.meta-g{font-size:10px;line-height:2;color:#555}
.meta-g b{display:block;font-size:9px;color:${c.primary};text-transform:uppercase;letter-spacing:1px;margin-bottom:2px}
th{background:transparent;color:#333;padding:8px 14px;font-size:8px;text-transform:uppercase;letter-spacing:1.5px;font-weight:700;border-bottom:2px solid #333;border-top:2px solid #333}
td{border-bottom:1px dotted #ddd}
tr:nth-child(even) td{background:transparent}
.ftr-s{background:transparent;border-top:1px dotted #ccc;padding-top:14px}
.tots-r{border-bottom:1px dotted #ddd}
.tots-r.total{border-top:2px solid #333;border-bottom:none}`;

    case 'premium': return base + `
body{font-family:'Garamond','Georgia','Times New Roman',serif}
.page::before{content:'';position:absolute;top:0;left:0;right:0;height:4px;background:linear-gradient(90deg,#B8860B,#DAA520,#B8860B)}
.page::after{content:'';position:absolute;top:24px;right:48px;font-size:10px;color:#B8860B;letter-spacing:3px;text-transform:uppercase;content:'PREMIUM'}
.hdr{display:flex;justify-content:space-between;align-items:flex-start;padding:16px 0 20px;margin-bottom:20px;border-bottom:1px solid #B8860B44}
.hdr-co{font-size:10px;color:#555;line-height:1.8}
.hdr-co b{font-size:17px;color:#222;display:block;margin-bottom:4px;font-family:'Garamond','Georgia',serif;letter-spacing:1px}
.hdr-type{font-size:22px;font-weight:700;color:#B8860B;text-transform:uppercase;letter-spacing:4px;font-family:'Garamond','Georgia',serif}
.hdr-num{font-size:10px;color:#B8860B88;margin-top:4px;letter-spacing:1px}
.meta{display:flex;justify-content:space-between;padding:14px 18px;margin-bottom:20px;background:#FFFBF0;border-left:3px solid #B8860B}
.meta-g{font-size:10px;line-height:2;color:#555}
.meta-g b{display:block;font-size:9px;color:#B8860B;text-transform:uppercase;letter-spacing:1.5px;margin-bottom:2px}
th{background:#2C2C2C;color:#DAA520;padding:8px 14px;font-size:9px;text-transform:uppercase;letter-spacing:1.5px;font-weight:400;font-family:'Garamond','Georgia',serif}
.ftr-s{background:#FFFBF0;border-left:2px solid #B8860B;padding:14px}
.tots-r.total{color:#B8860B;border-top:2px solid #B8860B}
.stamp-l{border-color:#B8860B}`;

    default: return base;
  }
};

const InvoiceGenerator = () => {
  const [colorIdx, setColorIdx] = useState(0);
  const [designId, setDesignId] = useState('classic');
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

  const addItem = () => setItems([...items, { desc: '', qty: 1, rate: 0 }]);
  const updateItem = (i, f, v) => { const c2 = [...items]; c2[i] = { ...c2[i], [f]: f === 'desc' ? v : +v }; setItems(c2); };
  const removeItem = i => setItems(items.filter((_, x) => x !== i));

  const subtotal = items.reduce((s, it) => s + it.qty * it.rate, 0);
  const discountAmt = subtotal * (discount / 100);
  const taxable = subtotal - discountAmt;
  const tax = taxable * (taxRate / 100);
  const total = taxable + tax;
  const fmt = n => '\u20B9' + n.toLocaleString('en-IN', { minimumFractionDigits: 2 });

  const c = COLORS[colorIdx];
  const handleLogo = e => { const f = e.target.files[0]; if (f) { const r = new FileReader(); r.onload = ev => setLogo(ev.target.result); r.readAsDataURL(f); } };

  const headerHTML = () => {
    const logoHtml = logo ? `<div style="margin-bottom:6px"><img src="${logo}" style="max-height:48px" alt="Logo"></div>` : '';
    const coHtml = `${logoHtml}<div class="hdr-co"><b>${company.name}</b>${company.address}<br>${company.phone ? 'Tel: ' + company.phone + '<br>' : ''}${company.email || ''}${company.gst ? '<br>GSTIN: ' + company.gst : ''}${company.pan ? '<br>PAN: ' + company.pan : ''}</div>`;
    const typeHtml = `<div class="hdr-type">${inv.type}</div><div class="hdr-num">#${inv.number}</div>`;
    if (designId === 'split') return `<div class="hdr"><div>${coHtml}</div><div class="hdr-div"></div><div class="hdr-right">${typeHtml}</div></div>`;
    if (designId === 'minimal') return `<div class="hdr"><div>${coHtml}</div><div style="text-align:right">${typeHtml}</div></div>`;
    return `<div class="hdr"><div>${coHtml}</div><div style="text-align:right">${typeHtml}</div></div>`;
  };

  const buildHTML = () => `<div class="page">${headerHTML()}
<div class="meta"><div class="meta-g"><b>Bill To</b>${client.name}<br>${client.address}${client.email ? '<br>' + client.email : ''}${client.phone ? '<br>Tel: ' + client.phone : ''}</div>
<div class="meta-g" style="text-align:right"><b>Details</b>Date: ${inv.date}${inv.due ? '<br>Due: ' + inv.due : ''}<br>Status: <span style="color:#B8860B;font-weight:700">Pending</span></div></div>
<table><thead><tr><th>#</th><th>Description</th><th class="tr">Qty</th><th class="tr">Rate</th><th class="tr">Amount</th></tr></thead>
<tbody>${items.map((it, i) => `<tr><td>${i + 1}</td><td>${it.desc || '\u2014'}</td><td class="tr">${it.qty}</td><td class="tr">${fmt(it.rate)}</td><td class="tr" style="font-weight:600">${fmt(it.qty * it.rate)}</td></tr>`).join('')}</tbody></table>
<div class="tots"><div class="tots-t">
<div class="tots-r"><span>Subtotal</span><span>${fmt(subtotal)}</span></div>
${discount > 0 ? `<div class="tots-r disc"><span>Discount (${discount}%)</span><span>-${fmt(discountAmt)}</span></div>` : ''}
<div class="tots-r"><span>Tax (${taxRate}%)</span><span>${fmt(tax)}</span></div>
<div class="tots-r total"><span>Total</span><span>${fmt(total)}</span></div></div></div>
<div class="ftr">${notes || terms ? `<div class="ftr-s">${notes ? '<b>Notes</b>' + notes + '<br><br>' : ''}${terms ? '<b>Terms</b>' + terms : ''}</div>` : ''}
${bankDetails.bank ? `<div class="ftr-s"><b>Bank Details</b>Bank: ${bankDetails.bank}<br>A/C: ${bankDetails.account}<br>IFSC: ${bankDetails.ifsc}</div>` : ''}</div>
<div class="stamp"><div class="stamp-l">Authorized Signatory</div></div></div>`;

  const print = () => {
    const win = window.open('', '_blank');
    win.document.write(`<html><head><title>${inv.type} ${inv.number}</title><style>${getDesignCSS(designId, c)}</style></head><body>${buildHTML()}</body></html>`);
    win.document.close();
    setTimeout(() => { win.print(); win.close(); }, 600);
  };

  return (
    <ToolPageWrapper meta={meta}>
      <div className="invoice-tool">
        <div className="invoice-controls">
          <h3 className="inv-section-title">Design &amp; Style</h3>
          <div className="form-group"><label>Design Layout</label>
            <select value={designId} onChange={e => setDesignId(e.target.value)} className="qr-select">
              {DESIGNS.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
            </select>
          </div>
          <div className="form-group"><label>Color Scheme</label>
            <div className="inv-template-grid">
              {COLORS.map((cl, i) => (
                <button key={cl.id} className={`inv-template-btn ${colorIdx === i ? 'active' : ''}`} onClick={() => setColorIdx(i)} style={{ borderColor: colorIdx === i ? cl.primary : undefined }}>
                  <div className="inv-template-preview" style={{ background: cl.primary }} />
                  <span>{cl.name}</span>
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
          <div className="form-group"><label>Account No</label><input value={bankDetails.account} onChange={e => setBankDetails({ ...bankDetails, account: e.target.value })} className="calc-input" /></div>
          <div className="form-group"><label>IFSC</label><input value={bankDetails.ifsc} onChange={e => setBankDetails({ ...bankDetails, ifsc: e.target.value })} className="calc-input" /></div>
          <hr />
          <div className="form-group"><label>Notes</label><textarea value={notes} onChange={e => setNotes(e.target.value)} className="devtool-textarea" rows={2} /></div>
          <div className="form-group"><label>Terms</label><textarea value={terms} onChange={e => setTerms(e.target.value)} className="devtool-textarea" rows={2} /></div>
          <button onClick={print} className="btn btn-primary btn-lg" style={{ width: '100%', marginTop: 8 }}><Icon name="Download" size={18} />Download / Print PDF</button>
        </div>

        {/* LIVE PREVIEW via iframe */}
        <div className="invoice-preview-wrap">
          <iframe srcDoc={`<html><head><style>${getDesignCSS(designId, c)}</style></head><body>${buildHTML()}</body></html>`}
            style={{ width: '100%', minHeight: 700, border: 'none' }} title="Invoice Preview" />
        </div>
      </div>
    </ToolPageWrapper>
  );
};
export default InvoiceGenerator;
