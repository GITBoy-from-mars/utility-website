import React, { useState, useRef } from 'react';
import ToolPageWrapper from '../../components/common/ToolPageWrapper';
import meta from './meta';
import './PayslipGenerator.css';

const MONTHS=['January','February','March','April','May','June','July','August','September','October','November','December'];
const daysInMonth=(m,y)=>new Date(y,MONTHS.indexOf(m)+1,0).getDate();
const fmtINR=n=>'₹ '+Number(n||0).toLocaleString('en-IN',{minimumFractionDigits:2,maximumFractionDigits:2});

/* Indian number to words */
const numWords=(n)=>{
  if(n===0)return'Zero Rupees Only';const o=['','One','Two','Three','Four','Five','Six','Seven','Eight','Nine','Ten','Eleven','Twelve','Thirteen','Fourteen','Fifteen','Sixteen','Seventeen','Eighteen','Nineteen'];
  const t=['','','Twenty','Thirty','Forty','Fifty','Sixty','Seventy','Eighty','Ninety'];
  const c=(n)=>{if(n<20)return o[n];if(n<100)return t[Math.floor(n/10)]+(n%10?' '+o[n%10]:'');if(n<1000)return o[Math.floor(n/100)]+' Hundred'+(n%100?' and '+c(n%100):'');if(n<100000)return c(Math.floor(n/1000))+' Thousand'+(n%1000?' '+c(n%1000):'');if(n<10000000)return c(Math.floor(n/100000))+' Lakh'+(n%100000?' '+c(n%100000):'');return c(Math.floor(n/10000000))+' Crore'+(n%10000000?' '+c(n%10000000):'');};
  const rupees=Math.floor(n);const paise=Math.round((n-rupees)*100);let w=c(rupees)+' Rupees';if(paise>0)w+=' and '+c(paise)+' Paise';return w+' Only';
};

const PayslipGenerator = () => {
  const [step,setStep]=useState(1);
  const [logo,setLogo]=useState(null);
  const [co,setCo]=useState({name:'',addr1:'',addr2:'',city:'',state:'',pin:'',email:'',country:'India'});
  const [emp,setEmp]=useState({name:'',id:'',designation:'',pan:'',uan:'',bank:''});
  const [pay,setPay]=useState({month:'',year:new Date().getFullYear(),date:'',lop:0});
  const [earnings,setEarnings]=useState([{desc:'Basic',amt:''},{desc:'House Rent Allowance',amt:''}]);
  const [deductions,setDeductions]=useState([{desc:'Income Tax',amt:''},{desc:'Provident Fund',amt:''}]);
  const [footer,setFooter]=useState({name:'',email:'',address:''});
  const [errors,setErrors]=useState([]);
  const logoRef=useRef(null);

  const totalDays=pay.month&&pay.year?daysInMonth(pay.month,pay.year):0;
  const paidDays=Math.max(0,totalDays-Number(pay.lop||0));
  const gross=earnings.reduce((s,e)=>s+Number(e.amt||0),0);
  const ded=deductions.reduce((s,d)=>s+Number(d.amt||0),0);
  const net=Math.max(0,gross-ded);

  const handleLogo=(e)=>{const f=e.target.files?.[0];if(!f)return;if(f.size>1024*1024){alert('Logo must be under 1MB');return;}
    const r=new FileReader();r.onload=()=>setLogo(r.result);r.readAsDataURL(f);};

  const validate=(s)=>{const e=[];
    if(s===1&&!co.name.trim())e.push('Company Name required');
    if(s===2&&!emp.name.trim())e.push('Employee Name required');
    if(s===3){if(!pay.month)e.push('Select month');if(!pay.year)e.push('Enter year');if(!pay.date)e.push('Select pay date');if(gross<=0)e.push('Add at least one earning');}
    setErrors(e);return!e.length;};

  const next=()=>{if(validate(step))setStep(s=>Math.min(4,s+1));};
  const prev=()=>setStep(s=>Math.max(1,s-1));

  const addRow=(list,setList)=>setList([...list,{desc:'',amt:''}]);
  const rmRow=(list,setList,i)=>setList(list.filter((_,j)=>j!==i));
  const updRow=(list,setList,i,k,v)=>{const n=[...list];n[i]={...n[i],[k]:v};setList(n);};

  const generatePDF=async()=>{
    for(let s=1;s<=3;s++){if(!validate(s)){setStep(s);return;}}
    const pdfMake=(await import('pdfmake/build/pdfmake')).default;
    const pdfFonts=(await import('pdfmake/build/vfs_fonts')).default;
    pdfMake.vfs=pdfFonts.pdfMake?pdfFonts.pdfMake.vfs:pdfFonts;
    const addr=[co.addr1,co.addr2,[co.city,co.state,co.pin].filter(Boolean).join(', '),co.country].filter(Boolean).join('\n');
    const eRows=earnings.filter(e=>e.desc||e.amt).map(e=>[{text:e.desc||'-'},{text:fmtINR(e.amt),alignment:'right'}]);
    const dRows=deductions.filter(d=>d.desc||d.amt).map(d=>[{text:d.desc||'-'},{text:fmtINR(d.amt),alignment:'right'}]);
    if(!eRows.length)eRows.push([{text:'-'},{text:fmtINR(0),alignment:'right'}]);
    if(!dRows.length)dRows.push([{text:'-'},{text:fmtINR(0),alignment:'right'}]);
    const fName=footer.name.trim()||'UtiliTools';
    const fEmail=footer.email.trim()||'utilitools.com';
    const fAddr=footer.address.trim()||'Free Online Utility Tools Platform';
    const doc={
      pageMargins:[36,36,36,60],
      content:[
        {columns:[[{text:co.name,style:'h1'},{text:addr,style:'addr',margin:[0,2,0,0]}],logo?{image:logo,width:72,alignment:'right',fit:[72,72]}:{text:''}]},
        {text:'Payslip For the Month',style:'title',margin:[0,14,0,2],alignment:'center'},
        {text:`${pay.month} ${pay.year}`,style:'titleMonth',alignment:'center',margin:[0,0,0,10]},
        {table:{widths:['*','*'],body:[[
          {stack:[{text:'EMPLOYEE SUMMARY',style:'section'},{columns:[[{text:'Employee Name',style:'k'},{text:emp.name,style:'v'}],[{text:'Employee ID',style:'k'},{text:emp.id||'-',style:'v'}]],columnGap:10,margin:[0,4,0,0]},{columns:[[{text:'Pay Period',style:'k'},{text:`${pay.month} ${pay.year}`,style:'v'}],[{text:'Pay Date',style:'k'},{text:pay.date?new Date(pay.date).toLocaleDateString('en-GB'):'-',style:'v'}]],columnGap:10,margin:[0,4,0,0]},{columns:[[{text:'Paid Days',style:'k'},{text:String(paidDays),style:'v'}],[{text:'LOP Days',style:'k'},{text:String(pay.lop||0),style:'v'}]],columnGap:10,margin:[0,4,0,0]},emp.designation?{text:`Designation: ${emp.designation}`,style:'v',margin:[0,6,0,0]}:'',emp.pan?{text:`PAN: ${emp.pan}`,style:'v'}:'',emp.uan?{text:`UAN: ${emp.uan}`,style:'v'}:'',emp.bank?{text:`Bank A/C: ${emp.bank}`,style:'v'}:''].filter(Boolean)},
          {stack:[{text:'Total Net Pay',style:'k',alignment:'right'},{text:fmtINR(net),style:'net'}]}
        ]]},layout:{paddingLeft:()=>10,paddingRight:()=>10,paddingTop:()=>8,paddingBottom:()=>8,hLineWidth:i=>i===0||i===2?1:0,vLineWidth:i=>i===0||i===2?1:0,hLineColor:()=>'#e2e8f0',vLineColor:()=>'#e2e8f0'},margin:[0,0,0,12]},
        {columns:[{width:'*',table:{widths:['*',100],body:[[{text:'EARNINGS',style:'section',colSpan:2},{}],...eRows,[{text:'Gross Earnings',alignment:'right',bold:true},{text:fmtINR(gross),alignment:'right',bold:true}]]},layout:'lightHorizontalLines'},{width:'*',table:{widths:['*',100],body:[[{text:'DEDUCTIONS',style:'section',colSpan:2},{}],...dRows,[{text:'Total Deductions',alignment:'right',bold:true},{text:fmtINR(ded),alignment:'right',bold:true}]]},layout:'lightHorizontalLines'}],columnGap:12},
        {table:{widths:['*','auto'],body:[[{text:'TOTAL NET PAYABLE\nGross Earnings - Total Deductions',style:'section'},{text:fmtINR(net),style:'netRight'}]]},layout:{paddingLeft:()=>10,paddingRight:()=>10,paddingTop:()=>8,paddingBottom:()=>8,hLineWidth:i=>i===0||i===2?1:0,vLineWidth:i=>i===0||i===2?1:0,hLineColor:()=>'#e2e8f0',vLineColor:()=>'#e2e8f0'},margin:[0,12,0,4]},
        {text:'Amount In Words : '+numWords(net),margin:[0,4,0,10],italics:true,style:'words'},
        {text:'— This is a system-generated document. —',alignment:'center',color:'#64748b',margin:[0,2,0,0]}
      ],
      styles:{h1:{fontSize:16,bold:true},addr:{fontSize:9,color:'#475569',lineHeight:1.25},title:{fontSize:12,bold:true,color:'#0f172a'},titleMonth:{fontSize:14,bold:true},section:{fontSize:10,bold:true,color:'#0f172a'},k:{fontSize:9,color:'#475569'},v:{fontSize:10},net:{fontSize:22,bold:true,alignment:'right',margin:[0,2,0,0]},netRight:{fontSize:16,bold:true,alignment:'right'},words:{fontSize:10}},
      defaultStyle:{fontSize:10},
      footer:(pg,cnt)=>({margin:[36,8,36,12],stack:[{canvas:[{type:'line',x1:0,y1:0,x2:515,y2:0,lineWidth:1,lineColor:'#e2e8f0'}],margin:[0,0,0,6]},{columns:[{stack:[{text:fName,bold:true,fontSize:8},{text:fEmail,fontSize:7,color:'#64748b'},{text:fAddr,fontSize:7,color:'#94a3b8'}]},{text:`Page ${pg} of ${cnt}`,alignment:'right',fontSize:8,color:'#64748b'}]}]})
    };
    const fn=`${(co.name||'Company').replace(/[^A-Za-z0-9]+/g,'_')}_${(emp.name||'Employee').replace(/[^A-Za-z0-9]+/g,'_')}_Payslip_${pay.month}_${pay.year}.pdf`;
    pdfMake.createPdf(doc).download(fn);
  };

  return (
    <ToolPageWrapper meta={meta}>
      <div className="payslip-stepper">
        {['Company','Employee','Pay & Items','Preview'].map((l,i)=>(
          <div key={i} className={`payslip-step ${step===i+1?'active':step>i+1?'done':''}`} onClick={()=>step>i+1&&setStep(i+1)}>
            <span>{step>i+1?'✓':i+1}</span>{l}
          </div>
        ))}
      </div>

      {errors.length>0&&<div className="payslip-errors">{errors.map((e,i)=><div key={i}>• {e}</div>)}</div>}

      {/* Step 1: Company */}
      {step===1&&<div className="payslip-panel"><h2>Company Details</h2>
        <div className="payslip-grid two">
          <div className="payslip-field"><label>Company Name *</label><input value={co.name} onChange={e=>setCo({...co,name:e.target.value})} placeholder="e.g., Acme Pvt Ltd"/></div>
          <div className="payslip-field"><label>Country</label><input value={co.country} onChange={e=>setCo({...co,country:e.target.value})} placeholder="India"/></div>
        </div>
        <div className="payslip-grid three" style={{marginTop:12}}>
          <div className="payslip-field"><label>Address Line 1</label><input value={co.addr1} onChange={e=>setCo({...co,addr1:e.target.value})} placeholder="Street / Building"/></div>
          <div className="payslip-field"><label>Address Line 2</label><input value={co.addr2} onChange={e=>setCo({...co,addr2:e.target.value})} placeholder="Area / Landmark"/></div>
          <div className="payslip-field"><label>City</label><input value={co.city} onChange={e=>setCo({...co,city:e.target.value})}/></div>
        </div>
        <div className="payslip-grid three" style={{marginTop:12}}>
          <div className="payslip-field"><label>State</label><input value={co.state} onChange={e=>setCo({...co,state:e.target.value})}/></div>
          <div className="payslip-field"><label>PIN Code</label><input value={co.pin} onChange={e=>setCo({...co,pin:e.target.value})} placeholder="110001"/></div>
          <div className="payslip-field"><label>Company Email</label><input value={co.email} onChange={e=>setCo({...co,email:e.target.value})} placeholder="hr@company.com"/></div>
        </div>
        <div className="payslip-grid two" style={{marginTop:12}}>
          <div className="payslip-field"><label>Upload Logo</label><input ref={logoRef} type="file" accept="image/*" onChange={handleLogo}/><small>PNG/JPG, max 1MB</small></div>
          <div className="payslip-logo-preview">{logo?<img src={logo} alt="Logo"/>:'No logo'}</div>
        </div>
      </div>}

      {/* Step 2: Employee */}
      {step===2&&<div className="payslip-panel"><h2>Employee Details</h2>
        <div className="payslip-grid three">
          <div className="payslip-field"><label>Employee Name *</label><input value={emp.name} onChange={e=>setEmp({...emp,name:e.target.value})}/></div>
          <div className="payslip-field"><label>Employee ID</label><input value={emp.id} onChange={e=>setEmp({...emp,id:e.target.value})}/></div>
          <div className="payslip-field"><label>Designation</label><input value={emp.designation} onChange={e=>setEmp({...emp,designation:e.target.value})}/></div>
        </div>
        <div className="payslip-grid three" style={{marginTop:12}}>
          <div className="payslip-field"><label>PAN</label><input value={emp.pan} onChange={e=>setEmp({...emp,pan:e.target.value})} placeholder="ABCDE1234F"/></div>
          <div className="payslip-field"><label>UAN</label><input value={emp.uan} onChange={e=>setEmp({...emp,uan:e.target.value})}/></div>
          <div className="payslip-field"><label>Bank A/C No.</label><input value={emp.bank} onChange={e=>setEmp({...emp,bank:e.target.value})}/></div>
        </div>
      </div>}

      {/* Step 3: Pay */}
      {step===3&&<div className="payslip-panel"><h2>Pay Period & Income Details</h2>
        <div className="payslip-grid three">
          <div className="payslip-field"><label>Pay Month *</label><select value={pay.month} onChange={e=>setPay({...pay,month:e.target.value})}><option value="">Select Month</option>{MONTHS.map(m=><option key={m}>{m}</option>)}</select></div>
          <div className="payslip-field"><label>Pay Year *</label><input type="number" value={pay.year} onChange={e=>setPay({...pay,year:e.target.value})}/></div>
          <div className="payslip-field"><label>Pay Date *</label><input type="date" value={pay.date} onChange={e=>setPay({...pay,date:e.target.value})}/></div>
        </div>
        <div className="payslip-grid three" style={{marginTop:12}}>
          <div className="payslip-field"><label>Days in Month</label><input readOnly value={totalDays}/></div>
          <div className="payslip-field"><label>LOP Days</label><input type="number" min={0} value={pay.lop} onChange={e=>setPay({...pay,lop:e.target.value})}/></div>
          <div className="payslip-field"><label>Paid Days</label><input readOnly value={paidDays}/></div>
        </div>
        <div className="payslip-grid two" style={{marginTop:16}}>
          <div><label style={{fontWeight:600,marginBottom:8,display:'block'}}>Earnings</label>
            <table className="payslip-items"><thead><tr><th>Description</th><th style={{width:120}}>Amount (₹)</th><th style={{width:32}}></th></tr></thead>
              <tbody>{earnings.map((e,i)=><tr key={i}><td><input value={e.desc} onChange={ev=>updRow(earnings,setEarnings,i,'desc',ev.target.value)} placeholder="Description"/></td><td><input type="number" value={e.amt} onChange={ev=>updRow(earnings,setEarnings,i,'amt',ev.target.value)} placeholder="0.00"/></td><td><button className="rm" onClick={()=>rmRow(earnings,setEarnings,i)}>×</button></td></tr>)}</tbody>
              <tfoot><tr><td style={{textAlign:'right'}}>Gross Earnings</td><td>{fmtINR(gross)}</td><td></td></tr></tfoot>
            </table><button className="payslip-add" onClick={()=>addRow(earnings,setEarnings)}>+ Add Earning</button>
          </div>
          <div><label style={{fontWeight:600,marginBottom:8,display:'block'}}>Deductions</label>
            <table className="payslip-items"><thead><tr><th>Description</th><th style={{width:120}}>Amount (₹)</th><th style={{width:32}}></th></tr></thead>
              <tbody>{deductions.map((d,i)=><tr key={i}><td><input value={d.desc} onChange={ev=>updRow(deductions,setDeductions,i,'desc',ev.target.value)} placeholder="Description"/></td><td><input type="number" value={d.amt} onChange={ev=>updRow(deductions,setDeductions,i,'amt',ev.target.value)} placeholder="0.00"/></td><td><button className="rm" onClick={()=>rmRow(deductions,setDeductions,i)}>×</button></td></tr>)}</tbody>
              <tfoot><tr><td style={{textAlign:'right'}}>Total Deductions</td><td>{fmtINR(ded)}</td><td></td></tr></tfoot>
            </table><button className="payslip-add" onClick={()=>addRow(deductions,setDeductions)}>+ Add Deduction</button>
          </div>
        </div>
        <div className="payslip-total"><span>Total Net Payable (Gross − Deductions)</span><strong>{fmtINR(net)}</strong></div>
        <div style={{marginTop:4,fontSize:13,color:'#555',fontStyle:'italic'}}>{net>0?numWords(net):'—'}</div>
      </div>}

      {/* Step 4: Preview & Footer */}
      {step===4&&<div className="payslip-panel"><h2>Footer & Generate</h2>
        <p style={{fontSize:13,color:'#666',marginBottom:12}}>Customize the PDF footer. Leave blank for default UtiliTools branding.</p>
        <div className="payslip-grid three">
          <div className="payslip-field"><label>Footer Company Name</label><input value={footer.name} onChange={e=>setFooter({...footer,name:e.target.value})} placeholder="UtiliTools (default)"/></div>
          <div className="payslip-field"><label>Footer Email</label><input value={footer.email} onChange={e=>setFooter({...footer,email:e.target.value})} placeholder="utilitools.com (default)"/></div>
          <div className="payslip-field"><label>Footer Address</label><input value={footer.address} onChange={e=>setFooter({...footer,address:e.target.value})} placeholder="Free Online Tools (default)"/></div>
        </div>
        <div style={{marginTop:16,display:'flex',gap:10}}>
          <button className="btn btn-primary" onClick={generatePDF}>📄 Generate Payslip PDF</button>
          <button className="btn btn-secondary" onClick={()=>{setCo({name:'',addr1:'',addr2:'',city:'',state:'',pin:'',email:'',country:'India'});setEmp({name:'',id:'',designation:'',pan:'',uan:'',bank:''});setPay({month:'',year:new Date().getFullYear(),date:'',lop:0});setEarnings([{desc:'Basic',amt:''},{desc:'House Rent Allowance',amt:''}]);setDeductions([{desc:'Income Tax',amt:''},{desc:'Provident Fund',amt:''}]);setFooter({name:'',email:'',address:''});setLogo(null);setStep(1);}}>Reset Form</button>
        </div>
      </div>}

      <div className="payslip-nav">
        <button disabled={step===1} onClick={prev}>← Back</button>
        <button className="primary" onClick={step===4?generatePDF:next}>{step===4?'Generate PDF':'Next →'}</button>
      </div>
    </ToolPageWrapper>
  );
};
export default PayslipGenerator;
