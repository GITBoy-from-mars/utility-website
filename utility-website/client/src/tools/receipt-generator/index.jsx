import React, { useState, useRef } from 'react';
import ToolPageWrapper from '../../components/common/ToolPageWrapper';
import { Icon } from '../../assets/icons/icons';
import meta from './meta';

const ReceiptGenerator = () => {
  const [business, setBusiness] = useState({ name: 'Your Business', address: '123 Main St, City', phone: '+91 98765 43210' });
  const [receipt, setReceipt] = useState({ number: 'RCP-001', date: new Date().toISOString().split('T')[0], paymentMethod: 'Cash' });
  const [customer, setCustomer] = useState({ name: 'Customer Name', email: '' });
  const [items, setItems] = useState([{ desc: 'Product / Service', qty: 1, price: 500 }]);
  const [taxRate, setTaxRate] = useState(0);
  const printRef = useRef(null);

  const addItem = () => setItems([...items, { desc: '', qty: 1, price: 0 }]);
  const updateItem = (i, f, v) => { const c = [...items]; c[i] = { ...c[i], [f]: f === 'desc' ? v : +v }; setItems(c); };
  const removeItem = i => setItems(items.filter((_, idx) => idx !== i));

  const subtotal = items.reduce((s, it) => s + it.qty * it.price, 0);
  const tax = subtotal * (taxRate / 100);
  const total = subtotal + tax;
  const fmt = n => '\u20B9' + n.toLocaleString('en-IN', { minimumFractionDigits: 2 });

  const print = () => {
    const win = window.open('', '_blank');
    win.document.write(`<html><head><title>Receipt ${receipt.number}</title><style>
      *{margin:0;padding:0;box-sizing:border-box;font-family:'Segoe UI',sans-serif}
      body{padding:40px;max-width:400px;margin:0 auto;font-size:13px;color:#333}
      .header{text-align:center;border-bottom:2px dashed #ccc;padding-bottom:16px;margin-bottom:16px}
      .header h1{font-size:18px;margin-bottom:4px} .header p{font-size:11px;color:#666}
      .meta{display:flex;justify-content:space-between;font-size:11px;margin-bottom:16px;color:#555}
      table{width:100%;border-collapse:collapse;margin-bottom:12px}
      th{text-align:left;font-size:10px;text-transform:uppercase;color:#888;border-bottom:1px solid #ddd;padding:6px 4px}
      td{padding:6px 4px;font-size:12px;border-bottom:1px solid #eee}
      .text-right{text-align:right}
      .totals{border-top:2px dashed #ccc;padding-top:12px;margin-top:4px}
      .totals .row{display:flex;justify-content:space-between;font-size:12px;padding:3px 0}
      .totals .total{font-size:16px;font-weight:800;border-top:1px solid #333;padding-top:8px;margin-top:6px}
      .footer{text-align:center;margin-top:20px;font-size:10px;color:#999;border-top:2px dashed #ccc;padding-top:12px}
      @media print{body{padding:20px}}
    </style></head><body>`);
    win.document.write(printRef.current.innerHTML);
    win.document.write('</body></html>');
    win.document.close();
    setTimeout(() => { win.print(); win.close(); }, 500);
  };

  return (
    <ToolPageWrapper meta={meta}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <h3 style={{ fontSize: '0.938rem', fontWeight: 700 }}>Business Info</h3>
          {Object.entries(business).map(([k, v]) => (
            <div key={k} className="form-group"><label>{k.charAt(0).toUpperCase() + k.slice(1)}</label><input value={v} onChange={e => setBusiness({ ...business, [k]: e.target.value })} className="calc-input" /></div>
          ))}
          <hr />
          <h3 style={{ fontSize: '0.938rem', fontWeight: 700 }}>Receipt Details</h3>
          <div style={{ display: 'flex', gap: 8 }}>
            <div className="form-group" style={{ flex: 1 }}><label>Number</label><input value={receipt.number} onChange={e => setReceipt({ ...receipt, number: e.target.value })} className="calc-input" /></div>
            <div className="form-group" style={{ flex: 1 }}><label>Date</label><input type="date" value={receipt.date} onChange={e => setReceipt({ ...receipt, date: e.target.value })} className="calc-input" /></div>
          </div>
          <div className="form-group"><label>Payment Method</label><select value={receipt.paymentMethod} onChange={e => setReceipt({ ...receipt, paymentMethod: e.target.value })} className="calc-input"><option>Cash</option><option>Card</option><option>UPI</option><option>Bank Transfer</option><option>Cheque</option></select></div>
          <div className="form-group"><label>Customer Name</label><input value={customer.name} onChange={e => setCustomer({ ...customer, name: e.target.value })} className="calc-input" /></div>
          <hr />
          <h3 style={{ fontSize: '0.938rem', fontWeight: 700 }}>Items</h3>
          {items.map((it, i) => (
            <div key={i} style={{ display: 'flex', gap: 6, alignItems: 'end' }}>
              <div className="form-group" style={{ flex: 3 }}><label>{i === 0 ? 'Description' : ''}</label><input value={it.desc} onChange={e => updateItem(i, 'desc', e.target.value)} className="calc-input" /></div>
              <div className="form-group" style={{ flex: 1 }}><label>{i === 0 ? 'Qty' : ''}</label><input type="number" value={it.qty} onChange={e => updateItem(i, 'qty', e.target.value)} className="calc-input" /></div>
              <div className="form-group" style={{ flex: 1.5 }}><label>{i === 0 ? 'Price' : ''}</label><input type="number" value={it.price} onChange={e => updateItem(i, 'price', e.target.value)} className="calc-input" /></div>
              <button onClick={() => removeItem(i)} className="btn btn-ghost btn-sm" style={{ color: 'var(--error)', marginBottom: 2 }}><Icon name="X" size={14} /></button>
            </div>
          ))}
          <button onClick={addItem} className="btn btn-ghost btn-sm">+ Add Item</button>
          <div className="form-group"><label>Tax (%)</label><input type="number" value={taxRate} onChange={e => setTaxRate(+e.target.value)} className="calc-input" style={{ maxWidth: 120 }} /></div>
          <button onClick={print} className="btn btn-primary btn-lg" style={{ width: '100%' }}><Icon name="Download" size={18} />Print / Download Receipt</button>
        </div>

        {/* Preview */}
        <div ref={printRef} style={{ padding: 24, border: '1px solid var(--neutral-200)', borderRadius: 12, background: '#fff', fontSize: '0.813rem' }}>
          <div className="header" style={{ textAlign: 'center', borderBottom: '2px dashed #ccc', paddingBottom: 16, marginBottom: 16 }}>
            <h1 style={{ fontSize: '1.125rem', fontWeight: 800 }}>{business.name}</h1>
            <p style={{ fontSize: '0.688rem', color: '#666' }}>{business.address}</p>
            <p style={{ fontSize: '0.688rem', color: '#666' }}>Tel: {business.phone}</p>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.688rem', marginBottom: 16, color: '#555' }}>
            <div><strong>Receipt:</strong> {receipt.number}<br /><strong>Date:</strong> {receipt.date}</div>
            <div style={{ textAlign: 'right' }}><strong>Customer:</strong> {customer.name}<br /><strong>Payment:</strong> {receipt.paymentMethod}</div>
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: 12 }}>
            <thead><tr><th style={{ textAlign: 'left', fontSize: '0.625rem', textTransform: 'uppercase', color: '#888', borderBottom: '1px solid #ddd', padding: '6px 4px' }}>Item</th><th style={{ textAlign: 'right', fontSize: '0.625rem', textTransform: 'uppercase', color: '#888', borderBottom: '1px solid #ddd', padding: '6px 4px' }}>Qty</th><th style={{ textAlign: 'right', fontSize: '0.625rem', textTransform: 'uppercase', color: '#888', borderBottom: '1px solid #ddd', padding: '6px 4px' }}>Price</th><th style={{ textAlign: 'right', fontSize: '0.625rem', textTransform: 'uppercase', color: '#888', borderBottom: '1px solid #ddd', padding: '6px 4px' }}>Total</th></tr></thead>
            <tbody>{items.map((it, i) => <tr key={i}><td style={{ padding: '6px 4px', borderBottom: '1px solid #eee' }}>{it.desc || '-'}</td><td style={{ textAlign: 'right', padding: '6px 4px', borderBottom: '1px solid #eee' }}>{it.qty}</td><td style={{ textAlign: 'right', padding: '6px 4px', borderBottom: '1px solid #eee' }}>{fmt(it.price)}</td><td style={{ textAlign: 'right', padding: '6px 4px', borderBottom: '1px solid #eee', fontWeight: 600 }}>{fmt(it.qty * it.price)}</td></tr>)}</tbody>
          </table>
          <div style={{ borderTop: '2px dashed #ccc', paddingTop: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', padding: '3px 0' }}><span>Subtotal</span><span>{fmt(subtotal)}</span></div>
            {taxRate > 0 && <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', padding: '3px 0' }}><span>Tax ({taxRate}%)</span><span>{fmt(tax)}</span></div>}
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1rem', fontWeight: 800, borderTop: '1px solid #333', paddingTop: 8, marginTop: 6 }}><span>Total</span><span>{fmt(total)}</span></div>
          </div>
          <div style={{ textAlign: 'center', marginTop: 20, fontSize: '0.625rem', color: '#999', borderTop: '2px dashed #ccc', paddingTop: 12 }}>Thank you for your purchase!</div>
        </div>
      </div>
    </ToolPageWrapper>
  );
};
export default ReceiptGenerator;
