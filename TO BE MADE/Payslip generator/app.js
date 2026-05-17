
// /* Enhanced PDF with detailed layout + footer mini-logo */
// (function(){
//   const form = document.getElementById('payslipForm');
//   const steps = Array.from(document.querySelectorAll('.step'));
//   const panels = Array.from(document.querySelectorAll('.panel'));
//   const prevBtn = document.getElementById('prevBtn');
//   const nextBtn = document.getElementById('nextBtn');
//   const generateBtn = document.getElementById('generateBtn');
//   const resetBtn = document.getElementById('resetBtn');
//   const errorsBox = document.getElementById('validationErrors');
//   let currentStep = 1;
//   let logoDataUrl = null;

//   // Elements for pay calculations
//   const payMonthEl = document.getElementById('payMonth');
//   const payYearEl = document.getElementById('payYear');
//   const totalDaysEl = document.getElementById('totalDays');
//   const lopDaysEl = document.getElementById('lopDays');
//   const paidDaysEl = document.getElementById('paidDays');
//   const grossEarningsEl = document.getElementById('grossEarnings');
//   const totalDeductionsEl = document.getElementById('totalDeductions');
//   const netPayEl = document.getElementById('netPay');
//   const amountWordsEl = document.getElementById('amountInWords');
//   const logoInput = document.getElementById('logo');
//   const logoPreview = document.getElementById('logoPreview');

//   // Items tables
//   const earningsTable = document.getElementById('earningsTable').querySelector('tbody');
//   const deductionsTable = document.getElementById('deductionsTable').querySelector('tbody');
//   document.getElementById('addEarning').addEventListener('click', () => addRow(earningsTable));
//   document.getElementById('addDeduction').addEventListener('click', () => addRow(deductionsTable));

//   // Initialize with basic rows
//   addRow(earningsTable, "Basic", "");
//   addRow(earningsTable, "House Rent Allowance", "");
//   addRow(deductionsTable, "Income Tax", "");
//   addRow(deductionsTable, "Provident Fund", "");

//   // Stepper
//   function showStep(n){
//     currentStep = n;
//     steps.forEach(s => s.classList.toggle('active', Number(s.dataset.step) === n));
//     panels.forEach(p => p.hidden = Number(p.dataset.step) !== n);
//     prevBtn.disabled = (n === 1);
//     nextBtn.textContent = (n === 4) ? 'Finish' : 'Next →';
//   }
//   showStep(1);

//   prevBtn.addEventListener('click', () => { if (currentStep > 1) showStep(currentStep - 1); });
//   nextBtn.addEventListener('click', () => {
//     if (currentStep < 4){
//       if (validateStep(currentStep)) showStep(currentStep + 1);
//     } else {
//       window.scrollTo({top: document.querySelector('.panel[data-step="4"]').offsetTop - 12, behavior:'smooth'});
//     }
//   });

//   // Logo upload
//   logoInput.addEventListener('change', async (e) => {
//     const file = e.target.files?.[0];
//     if (!file) return;
//     if (file.size > 1024*1024){
//       alert("Logo size should be less than or equal to 1MB.");
//       logoInput.value = "";
//       return;
//     }
//     const allowed = ['image/bmp','image/png','image/gif','image/jpeg','image/jpg'];
//     if (!allowed.includes(file.type)){
//       alert("Unsupported logo format. Use BMP, PNG, GIF, JPG or JPEG.");
//       logoInput.value = "";
//       return;
//     }
//     const dataUrl = await fileToDataUrl(file);
//     logoDataUrl = dataUrl;
//     logoPreview.innerHTML = `<img src="${dataUrl}" alt="Logo preview" />`;
//   });
//   function fileToDataUrl(file){
//     return new Promise((resolve, reject)=>{
//       const r = new FileReader();
//       r.onload = () => resolve(r.result);
//       r.onerror = reject;
//       r.readAsDataURL(file);
//     });
//   }

//   // Recompute totals + words
//   form.addEventListener('input', recomputeAll);
//   function recomputeAll(){
//     const month = payMonthEl.value;
//     const year = Number(payYearEl.value);
//     if (month && year){
//       totalDaysEl.value = daysInMonth(month, year);
//       if (!paidDaysEl.value){
//         const lop = Number(lopDaysEl.value||0);
//         paidDaysEl.value = Math.max(0, Number(totalDaysEl.value) - lop);
//       }
//     }
//     const gross = sumTable(earningsTable);
//     const ded = sumTable(deductionsTable);
//     grossEarningsEl.textContent = Number(gross).toFixed(2);
//     totalDeductionsEl.textContent = Number(ded).toFixed(2);
//     const net = Math.max(0, gross - ded);
//     netPayEl.textContent = "₹ " + Number(net).toFixed(2);
//     amountWordsEl.textContent = net>0 ? numberToIndianWords(net) : "Amount is less than or equal to zero.";
//   }
//   function sumTable(tbody){
//     let s = 0;
//     for (const tr of tbody.querySelectorAll('tr')){
//       const amt = parseFloat(tr.querySelector('input[type="number"]').value || "0");
//       s += isNaN(amt) ? 0 : amt;
//     }
//     return s;
//   }
//   function addRow(tbody, desc="", amount=""){
//     const tr = document.createElement('tr');
//     tr.innerHTML = `
//       <td><input placeholder="Description" value="${desc||""}" /></td>
//       <td class="amt"><input type="number" step="0.01" min="0" placeholder="0.00" value="${amount||""}"/></td>
//       <td><button type="button" class="remove" title="Remove">×</button></td>`;
//     tr.querySelector('.remove').addEventListener('click', ()=>{ tr.remove(); recomputeAll(); });
//     tr.querySelectorAll('input').forEach(inp=>inp.addEventListener('input', recomputeAll));
//     tbody.appendChild(tr);
//     recomputeAll();
//   }

//   // Validation per step
//   function validateStep(n){
//     errorsBox.hidden = true; errorsBox.innerHTML = "";
//     const errs = [];
//     if (n === 1){
//       const companyName = document.getElementById('companyName').value.trim();
//       if (!companyName) errs.push("Company Name is required.");
//     }
//     if (n === 2){
//       const employeeName = document.getElementById('employeeName').value.trim();
//       if (!employeeName) errs.push("Employee Name is required.");
//     }
//     if (n === 3){
//       const month = payMonthEl.value;
//       const year = Number(payYearEl.value);
//       const payDate = document.getElementById('payDate').value;
//       if (!month) errs.push("Select Pay Period month.");
//       if (!year) errs.push("Enter Pay Period year.");
//       if (!payDate) errs.push("Select Pay Date.");
//       const totalDays = Number(totalDaysEl.value||0);
//       const lop = Number(lopDaysEl.value||0);
//       const paid = Number(paidDaysEl.value||0);
//       if ((lop + paid) > totalDays) errs.push("Paid Days + LOP Days must be ≤ Days in Month.");
//       const sumE = sumTable(earningsTable);
//       if (sumE <= 0) errs.push("Add at least one earning > 0.");
//     }
//     if (errs.length){
//       errorsBox.hidden = false;
//       errorsBox.innerHTML = "<ul><li>" + errs.join("</li><li>") + "</li></ul>";
//       return false;
//     }
//     return true;
//   }

//   // Helpers to create common chunks
//   function labeledKV(k, v){
//     return {columns: [[{text:k, style:'k'},{text:v||'-', style:'v'}],[{text:'', style:'k'}]], columnGap:10};
//   }
//   function rowsFrom(tbody){
//     const rows = [];
//     tbody.querySelectorAll('tr').forEach(tr => {
//       const desc = tr.querySelector('input[type="text"], input:not([type])')?.value || tr.querySelector('input')?.value || "";
//       const amt = parseFloat(tr.querySelector('input[type="number"]').value || "0");
//       rows.push([ {text: desc||"-"}, {text: formatINR(amt), alignment:'right'} ]);
//     });
//     if (!rows.length){
//       rows.push([{text:"-", color:'#64748b'},{text:formatINR(0), alignment:'right', color:'#64748b'}]);
//     }
//     return rows;
//   }
//   function collectAddress(){
//     const a1 = document.getElementById('addrLine1').value;
//     const a2 = document.getElementById('addrLine2').value;
//     const city = document.getElementById('city').value;
//     const st = document.getElementById('state').value;
//     const pin = document.getElementById('pincode').value;
//     const c = document.getElementById('country').value;
//     return [a1,a2,[city,st,pin].filter(Boolean).join(", "), c].filter(Boolean).join("\n");
//   }

//   // Generate PDF
//   if (generateBtn){
//     generateBtn.addEventListener('click', () => {
//       for (let s=1; s<=3; s++){
//         if (!validateStep(s)){ showStep(s); return; }
//       }
//       const doc = buildPdfDefinition();
//       pdfMake.createPdf(doc).download(buildFileName());
//     });
//   }
//   function buildFileName(){
//     const company = (document.getElementById('companyName').value || 'Company').replace(/[^A-Za-z0-9]+/g,'_');
//     const emp = (document.getElementById('employeeName').value || 'Employee').replace(/[^A-Za-z0-9]+/g,'_');
//     const month = document.getElementById('payMonth').value || 'Month';
//     const year = document.getElementById('payYear').value || 'Year';
//     return `${company}_${emp}_Payslip_${month}_${year}.pdf`;
//   }

//   function buildPdfDefinition(){
//     const companyName = document.getElementById('companyName').value;
//     const address = collectAddress();
//     const employeeName = document.getElementById('employeeName').value;
//     const employeeId = document.getElementById('employeeId').value;
//     const designation = document.getElementById('designation').value;
//     const pan = document.getElementById('pan').value;
//     const uan = document.getElementById('uan').value;
//     const bank = document.getElementById('bankAccount').value;
//     const companyEmail = document.getElementById('companyEmail').value;

//     const payMonth = document.getElementById('payMonth').value;
//     const payYear = document.getElementById('payYear').value;
//     const payDate = document.getElementById('payDate').value;
//     const lopDays = Number(document.getElementById('lopDays').value||0);
//     const paidDays = Number(document.getElementById('paidDays').value||0);

//     const gross = parseFloat(grossEarningsEl.textContent) || 0;
//     const ded = parseFloat(totalDeductionsEl.textContent) || 0;
//     const net = Math.max(0, gross - ded);
//     const amountWords = numberToIndianWords(net);

//     const earningsRows = rowsFrom(earningsTable);
//     const deductionsRows = rowsFrom(deductionsTable);

//     const pageWidth = 595.28 - 72; // A4 width minus 36px left+right margins (approx)
//     const content = [
//       {
//         columns:[
//           [
//             {text: companyName, style:'h1'},
//             {text: address, style:'addr', margin:[0,2,0,0]}
//           ],
//           (logoDataUrl ? {image: logoDataUrl, width: 72, alignment:'right', fit:[72,72]} : {text:""})
//         ]
//       },

//       // Title (two-line, centered)
//       {text: "Payslip For the Month", style:'title', margin:[0,14,0,2], alignment:'center'},
//       {text: `${payMonth} ${payYear}`, style:'titleMonth', alignment:'center', margin:[0,0,0,10]},

//       // Employee summary "card"
//       {
//         table:{
//           widths:['*','*'],
//           body:[
//             [
//               {stack:[
//                 {text:'EMPLOYEE SUMMARY', style:'section'},
//                 {columns:[
//                   [{text:'Employee Name', style:'k'},{text:employeeName, style:'v'}],
//                   [{text:'Employee ID', style:'k'},{text:(employeeId||'-'), style:'v'}]
//                 ], columnGap:10, margin:[0,4,0,0]},
//                 {columns:[
//                   [{text:'Pay Period', style:'k'},{text:`${payMonth} ${payYear}`, style:'v'}],
//                   [{text:'Pay Date', style:'k'},{text: new Date(payDate).toLocaleDateString('en-GB'), style:'v'}]
//                 ], columnGap:10, margin:[0,4,0,0]},
//                 {columns:[
//                   [{text:'Paid Days', style:'k'},{text:String(paidDays), style:'v'}],
//                   [{text:'LOP Days', style:'k'},{text:String(lopDays), style:'v'}]
//                 ], columnGap:10, margin:[0,4,0,0]},
//                 (designation ? {text:`Designation: ${designation}`, style:'v', margin:[0,6,0,0]} : ""),
//                 (pan ? {text:`PAN: ${pan}`, style:'v'} : ""),
//                 (uan ? {text:`UAN: ${uan}`, style:'v'} : ""),
//                 (bank ? {text:`Bank A/C: ${bank}`, style:'v'} : ""),
//               ].filter(Boolean)},
//               {stack:[
//                 {text:'Total Net Pay', style:'k', alignment:'right'},
//                 {text: formatINR(net), style:'net'}
//               ]}
//             ]
//           ]
//         },
//         layout:{
//           paddingLeft: function(){return 10}, paddingRight:function(){return 10},
//           paddingTop: function(){return 8}, paddingBottom:function(){return 8},
//           hLineWidth:function(i){return i===0||i===2?1:0},
//           vLineWidth:function(i){return i===0||i===2?1:0},
//           hLineColor:function(){return '#e2e8f0'}, vLineColor:function(){return '#e2e8f0'}
//         },
//         margin:[0,0,0,12],
//         background: '#ffffff'
//       },

//       // Earnings / Deductions side-by-side
//       {
//         columns:[
//           {
//             width:'*',
//             table:{
//               widths:['*',100],
//               body:[
//                 [{text:'EARNINGS', style:'section', colSpan:2}, {}],
//               ].concat(earningsRows).concat([[
//                 {text:'Gross Earnings', alignment:'right', bold:true},
//                 {text: formatINR(gross), alignment:'right', bold:true}
//               ]])
//             },
//             layout:'lightHorizontalLines'
//           },
//           {
//             width:'*',
//             table:{
//               widths:['*',100],
//               body:[
//                 [{text:'DEDUCTIONS', style:'section', colSpan:2}, {}],
//               ].concat(deductionsRows).concat([[
//                 {text:'Total Deductions', alignment:'right', bold:true},
//                 {text: formatINR(ded), alignment:'right', bold:true}
//               ]])
//             },
//             layout:'lightHorizontalLines'
//           }
//         ],
//         columnGap:12
//       },

//       // Total band
//       {
//         table:{
//           widths:['*','auto'],
//           body:[
//             [
//               {text:'TOTAL NET PAYABLE\nGross Earnings - Total Deductions', style:'section'},
//               {text: formatINR(net), style:'netRight'}
//             ]
//           ]
//         },
//         layout:{
//           paddingLeft: function(){return 10}, paddingRight:function(){return 10},
//           paddingTop: function(){return 8}, paddingBottom:function(){return 8},
//           hLineWidth:function(i){return i===0||i===2?1:0},
//           vLineWidth:function(i){return i===0||i===2?1:0},
//           hLineColor:function(){return '#e2e8f0'}, vLineColor:function(){return '#e2e8f0'}
//         },
//         margin:[0,12,0,4]
//       },

//       // Amount in words (exact phrasing)
//       {text: "Amount In Words : " + amountWords, margin:[0,4,0,10], italics:true, style:'words'},

//       // System generated note
//       {text: "— This is a system-generated document. —", alignment:'center', color:'#64748b', margin:[0,2,0,0]}
//     ];

//     const doc = {
//       pageMargins:[36,36,36,60], // extra bottom for footer
//       content,
//       styles:{
//         h1:{fontSize:16,bold:true},
//         addr:{fontSize:9,color:'#475569', lineHeight:1.25},
//         title:{fontSize:12,bold:true,color:'#0f172a', letterSpacing:0.2},
//         titleMonth:{fontSize:14,bold:true},
//         section:{fontSize:10,bold:true,color:'#0f172a'},
//         k:{fontSize:9,color:'#475569'},
//         v:{fontSize:10},
//         net:{fontSize:22,bold:true, alignment:'right', margin:[0,2,0,0]},
//         netRight:{fontSize:16,bold:true,alignment:'right'},
//         words:{fontSize:10}
//       },
//       defaultStyle:{fontSize:10},

//       // --- FOOTER with tiny logo + company details ---
//       footer: function(currentPage, pageCount){
//         // Build address block lines
//         const addrLines = address ? address.split('\n') : [];
//         const footerStack = [
//           { canvas: [ { type:'line', x1:0, y1:0, x2:515, y2:0, lineWidth:1, lineColor:'#e2e8f0' } ], margin:[0,0,0,6] },
//           {
//             columns: [
//               {
//                 columns: [
//                   (logoDataUrl ? { image: logoDataUrl, width: 20, height: 20, margin:[0,-2,6,0] } : { text:"" }),
//                   {
//                     width: 'auto',
//                     stack: [
//                       {text: companyName || '', bold:true, fontSize:8},
//                       (companyEmail ? {text: companyEmail, fontSize:7, color:'#64748b'} : {text:'', fontSize:7}),
//                       (addrLines.length ? {text: addrLines.join(', '), fontSize:7, color:'#94a3b8'} : {text:'', fontSize:7})
//                     ].filter(x => (x.text!=='' && x.text!==undefined) || x.stack)
//                   }
//                 ],
//                 columnGap: 6
//               },
//               { text: `Page ${currentPage} of ${pageCount}`, alignment:'right', fontSize:8, color:'#64748b' }
//             ]
//           }
//         ];
//         return { margin:[36,8,36,12], stack: footerStack };
//       }
//     };
//     return doc;
//   }

//   // Reset
//   if (resetBtn){
//     resetBtn.addEventListener('click', () => {
//       setTimeout(()=>{
//         logoDataUrl = null;
//         logoPreview.textContent = "No logo uploaded";
//         earningsTable.innerHTML = "";
//         deductionsTable.innerHTML = "";
//         addRow(earningsTable, "Basic", "");
//         addRow(earningsTable, "House Rent Allowance", "");
//         addRow(deductionsTable, "Income Tax", "");
//         addRow(deductionsTable, "Provident Fund", "");
//         amountWordsEl.textContent = "—";
//         grossEarningsEl.textContent = "0.00";
//         totalDeductionsEl.textContent = "0.00";
//         netPayEl.textContent = "₹ 0.00";
//         showStep(1);
//         errorsBox.hidden = true; errorsBox.innerHTML = "";
//       }, 0);
//     });
//   }

//   // Initial compute
//   recomputeAll();
// })();
















/* Enhanced PDF with detailed layout + footer mini-logo (footer-only fix)
   NOTE: Only the footer is changed. Everything else stays the same.
   Edit the constants under "FOOTER CONFIG" to set your fixed footer details.
*/
(function(){
  const form = document.getElementById('payslipForm');
  const steps = Array.from(document.querySelectorAll('.step'));
  const panels = Array.from(document.querySelectorAll('.panel'));
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  const generateBtn = document.getElementById('generateBtn');
  const resetBtn = document.getElementById('resetBtn');
  const errorsBox = document.getElementById('validationErrors');
  let currentStep = 1;
  let logoDataUrl = null;

  /* ================= FOOTER CONFIG =================
     Put your fixed footer details here. These values will be used in the PDF footer
     (they do NOT come from the form). If you don't want a logo, leave FOOTER_LOGO_DATA_URL as null.
  =================================================== */
  const FOOTER_LOGO_DATA_URL = null; // e.g. 'data:image/png;base64,AAAA...'
  // const FOOTER_LOGO_URL      = ""; // e.g., "https://yourcdn.com/footer-logo.png"
  const FOOTER_COMPANY_NAME  = 'Simbi Labs India';
  const FOOTER_EMAIL         = 'grow@simbi.in';
  const FOOTER_ADDRESS       = 'Salcon Rasvilas, Select City Walk, Saket, New Delhi, Delhi, 110017, India';
  const FOOTER_ENABLED       = true; // set to false to hide footer entirely
  const FOOTER_LOGO_FIT      = [20,20]; // mini logo size (keeps aspect ratio)

  // Elements for pay calculations
  const payMonthEl = document.getElementById('payMonth');
  const payYearEl = document.getElementById('payYear');
  const totalDaysEl = document.getElementById('totalDays');
  const lopDaysEl = document.getElementById('lopDays');
  const paidDaysEl = document.getElementById('paidDays');
  const grossEarningsEl = document.getElementById('grossEarnings');
  const totalDeductionsEl = document.getElementById('totalDeductions');
  const netPayEl = document.getElementById('netPay');
  const amountWordsEl = document.getElementById('amountInWords');
  const logoInput = document.getElementById('logo');
  const logoPreview = document.getElementById('logoPreview');

  // Items tables
  const earningsTable = document.getElementById('earningsTable').querySelector('tbody');
  const deductionsTable = document.getElementById('deductionsTable').querySelector('tbody');
  document.getElementById('addEarning').addEventListener('click', () => addRow(earningsTable));
  document.getElementById('addDeduction').addEventListener('click', () => addRow(deductionsTable));

  // Initialize with basic rows
  addRow(earningsTable, "Basic", "");
  addRow(earningsTable, "House Rent Allowance", "");
  addRow(deductionsTable, "Income Tax", "");
  addRow(deductionsTable, "Provident Fund", "");

  // Stepper
  function showStep(n){
    currentStep = n;
    steps.forEach(s => s.classList.toggle('active', Number(s.dataset.step) === n));
    panels.forEach(p => p.hidden = Number(p.dataset.step) !== n);
    prevBtn.disabled = (n === 1);
    nextBtn.textContent = (n === 4) ? 'Finish' : 'Next →';
  }
  showStep(1);

  prevBtn.addEventListener('click', () => { if (currentStep > 1) showStep(currentStep - 1); });
  nextBtn.addEventListener('click', () => {
    if (currentStep < 4){
      if (validateStep(currentStep)) showStep(currentStep + 1);
    } else {
      window.scrollTo({top: document.querySelector('.panel[data-step="4"]').offsetTop - 12, behavior:'smooth'});
    }
  });

  // Logo upload
  logoInput.addEventListener('change', async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 1024*1024){
      alert("Logo size should be less than or equal to 1MB.");
      logoInput.value = "";
      return;
    }
    const allowed = ['image/bmp','image/png','image/gif','image/jpeg','image/jpg'];
    if (!allowed.includes(file.type)){
      alert("Unsupported logo format. Use BMP, PNG, GIF, JPG or JPEG.");
      logoInput.value = "";
      return;
    }
    const dataUrl = await fileToDataUrl(file);
    logoDataUrl = dataUrl;
    logoPreview.innerHTML = `<img src="${dataUrl}" alt="Logo preview" />`;
  });
  function fileToDataUrl(file){
    return new Promise((resolve, reject)=>{
      const r = new FileReader();
      r.onload = () => resolve(r.result);
      r.onerror = reject;
      r.readAsDataURL(file);
    });
  }

  // Recompute totals + words
  form.addEventListener('input', recomputeAll);
  function recomputeAll(){
    const month = payMonthEl.value;
    const year = Number(payYearEl.value);
    if (month && year){
      totalDaysEl.value = daysInMonth(month, year);
      if (!paidDaysEl.value){
        const lop = Number(lopDaysEl.value||0);
        paidDaysEl.value = Math.max(0, Number(totalDaysEl.value) - lop);
      }
    }
    const gross = sumTable(earningsTable);
    const ded = sumTable(deductionsTable);
    grossEarningsEl.textContent = Number(gross).toFixed(2);
    totalDeductionsEl.textContent = Number(ded).toFixed(2);
    const net = Math.max(0, gross - ded);
    netPayEl.textContent = "₹ " + Number(net).toFixed(2);
    amountWordsEl.textContent = net>0 ? numberToIndianWords(net) : "Amount is less than or equal to zero.";
  }
  function sumTable(tbody){
    let s = 0;
    for (const tr of tbody.querySelectorAll('tr')){
      const amt = parseFloat(tr.querySelector('input[type="number"]').value || "0");
      s += isNaN(amt) ? 0 : amt;
    }
    return s;
  }
  function addRow(tbody, desc="", amount=""){
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td><input placeholder="Description" value="${desc||""}" /></td>
      <td class="amt"><input type="number" step="0.01" min="0" placeholder="0.00" value="${amount||""}"/></td>
      <td><button type="button" class="remove" title="Remove">×</button></td>`;
    tr.querySelector('.remove').addEventListener('click', ()=>{ tr.remove(); recomputeAll(); });
    tr.querySelectorAll('input').forEach(inp=>inp.addEventListener('input', recomputeAll));
    tbody.appendChild(tr);
    recomputeAll();
  }

  // Validation per step
  function validateStep(n){
    errorsBox.hidden = true; errorsBox.innerHTML = "";
    const errs = [];
    if (n === 1){
      const companyName = document.getElementById('companyName').value.trim();
      if (!companyName) errs.push("Company Name is required.");
    }
    if (n === 2){
      const employeeName = document.getElementById('employeeName').value.trim();
      if (!employeeName) errs.push("Employee Name is required.");
    }
    if (n === 3){
      const month = payMonthEl.value;
      const year = Number(payYearEl.value);
      const payDate = document.getElementById('payDate').value;
      if (!month) errs.push("Select Pay Period month.");
      if (!year) errs.push("Enter Pay Period year.");
      if (!payDate) errs.push("Select Pay Date.");
      const totalDays = Number(totalDaysEl.value||0);
      const lop = Number(lopDaysEl.value||0);
      const paid = Number(paidDaysEl.value||0);
      if ((lop + paid) > totalDays) errs.push("Paid Days + LOP Days must be ≤ Days in Month.");
      const sumE = sumTable(earningsTable);
      if (sumE <= 0) errs.push("Add at least one earning > 0.");
    }
    if (errs.length){
      errorsBox.hidden = false;
      errorsBox.innerHTML = "<ul><li>" + errs.join("</li><li>") + "</li></ul>";
      return false;
    }
    return true;
  }

  // Helpers to create common chunks
  function labeledKV(k, v){
    return {columns: [[{text:k, style:'k'},{text:v||'-', style:'v'}],[{text:'', style:'k'}]], columnGap:10};
  }
  function rowsFrom(tbody){
    const rows = [];
    tbody.querySelectorAll('tr').forEach(tr => {
      const desc = tr.querySelector('input[type="text"], input:not([type])')?.value || tr.querySelector('input')?.value || "";
      const amt = parseFloat(tr.querySelector('input[type="number"]').value || "0");
      rows.push([ {text: desc||"-"}, {text: formatINR(amt), alignment:'right'} ]);
    });
    if (!rows.length){
      rows.push([{text:"-", color:'#64748b'},{text:formatINR(0), alignment:'right', color:'#64748b'}]);
    }
    return rows;
  }
  function collectAddress(){
    const a1 = document.getElementById('addrLine1').value;
    const a2 = document.getElementById('addrLine2').value;
    const city = document.getElementById('city').value;
    const st = document.getElementById('state').value;
    const pin = document.getElementById('pincode').value;
    const c = document.getElementById('country').value;
    return [a1,a2,[city,st,pin].filter(Boolean).join(", "), c].filter(Boolean).join("\n");
  }

  // Generate PDF
  if (generateBtn){
    generateBtn.addEventListener('click', () => {
      for (let s=1; s<=3; s++){
        if (!validateStep(s)){ showStep(s); return; }
      }
      const doc = buildPdfDefinition();
      pdfMake.createPdf(doc).download(buildFileName());
    });
  }
  function buildFileName(){
    const company = (document.getElementById('companyName').value || 'Company').replace(/[^A-Za-z0-9]+/g,'_');
    const emp = (document.getElementById('employeeName').value || 'Employee').replace(/[^A-Za-z0-9]+/g,'_');
    const month = document.getElementById('payMonth').value || 'Month';
    const year = document.getElementById('payYear').value || 'Year';
    return `${company}_${emp}_Payslip_${month}_${year}.pdf`;
  }

  function buildPdfDefinition(){
    const companyName = document.getElementById('companyName').value;
    const address = collectAddress();
    const employeeName = document.getElementById('employeeName').value;
    const employeeId = document.getElementById('employeeId').value;
    const designation = document.getElementById('designation').value;
    const pan = document.getElementById('pan').value;
    const uan = document.getElementById('uan').value;
    const bank = document.getElementById('bankAccount').value;
    const companyEmail = document.getElementById('companyEmail').value;

    const payMonth = document.getElementById('payMonth').value;
    const payYear = document.getElementById('payYear').value;
    const payDate = document.getElementById('payDate').value;
    const lopDays = Number(document.getElementById('lopDays').value||0);
    const paidDays = Number(document.getElementById('paidDays').value||0);

    const gross = parseFloat(grossEarningsEl.textContent) || 0;
    const ded = parseFloat(totalDeductionsEl.textContent) || 0;
    const net = Math.max(0, gross - ded);
    const amountWords = numberToIndianWords(net);

    const earningsRows = rowsFrom(earningsTable);
    const deductionsRows = rowsFrom(deductionsTable);

    const pageWidth = 595.28 - 72; // A4 width minus 36px left+right margins (approx)
    const content = [
      {
        columns:[
          [
            {text: companyName, style:'h1'},
            {text: address, style:'addr', margin:[0,2,0,0]}
          ],
          (logoDataUrl ? {image: logoDataUrl, width: 72, alignment:'right', fit:[72,72]} : {text:""})
        ]
      },

      // Title (two-line, centered)
      {text: "Payslip For the Month", style:'title', margin:[0,14,0,2], alignment:'center'},
      {text: `${payMonth} ${payYear}`, style:'titleMonth', alignment:'center', margin:[0,0,0,10]},

      // Employee summary "card"
      {
        table:{
          widths:['*','*'],
          body:[
            [
              {stack:[
                {text:'EMPLOYEE SUMMARY', style:'section'},
                {columns:[
                  [{text:'Employee Name', style:'k'},{text:employeeName, style:'v'}],
                  [{text:'Employee ID', style:'k'},{text:(employeeId||'-'), style:'v'}]
                ], columnGap:10, margin:[0,4,0,0]},
                {columns:[
                  [{text:'Pay Period', style:'k'},{text:`${payMonth} ${payYear}`, style:'v'}],
                  [{text:'Pay Date', style:'k'},{text: new Date(payDate).toLocaleDateString('en-GB'), style:'v'}]
                ], columnGap:10, margin:[0,4,0,0]},
                {columns:[
                  [{text:'Paid Days', style:'k'},{text:String(paidDays), style:'v'}],
                  [{text:'LOP Days', style:'k'},{text:String(lopDays), style:'v'}]
                ], columnGap:10, margin:[0,4,0,0]},
                (designation ? {text:`Designation: ${designation}`, style:'v', margin:[0,6,0,0]} : ""),
                (pan ? {text:`PAN: ${pan}`, style:'v'} : ""),
                (uan ? {text:`UAN: ${uan}`, style:'v'} : ""),
                (bank ? {text:`Bank A/C: ${bank}`, style:'v'} : ""),
              ].filter(Boolean)},
              {stack:[
                {text:'Total Net Pay', style:'k', alignment:'right'},
                {text: formatINR(net), style:'net'}
              ]}
            ]
          ]
        },
        layout:{
          paddingLeft: function(){return 10}, paddingRight:function(){return 10},
          paddingTop: function(){return 8}, paddingBottom:function(){return 8},
          hLineWidth:function(i){return i===0||i===2?1:0},
          vLineWidth:function(i){return i===0||i===2?1:0},
          hLineColor:function(){return '#e2e8f0'}, vLineColor:function(){return '#e2e8f0'}
        },
        margin:[0,0,0,12],
        background: '#ffffff'
      },

      // Earnings / Deductions side-by-side
      {
        columns:[
          {
            width:'*',
            table:{
              widths:['*',100],
              body:[
                [{text:'EARNINGS', style:'section', colSpan:2}, {}],
              ].concat(earningsRows).concat([[
                {text:'Gross Earnings', alignment:'right', bold:true},
                {text: formatINR(gross), alignment:'right', bold:true}
              ]])
            },
            layout:'lightHorizontalLines'
          },
          {
            width:'*',
            table:{
              widths:['*',100],
              body:[
                [{text:'DEDUCTIONS', style:'section', colSpan:2}, {}],
              ].concat(deductionsRows).concat([[
                {text:'Total Deductions', alignment:'right', bold:true},
                {text: formatINR(ded), alignment:'right', bold:true}
              ]])
            },
            layout:'lightHorizontalLines'
          }
        ],
        columnGap:12
      },

      // Total band
      {
        table:{
          widths:['*','auto'],
          body:[
            [
              {text:'TOTAL NET PAYABLE\nGross Earnings - Total Deductions', style:'section'},
              {text: formatINR(net), style:'netRight'}
            ]
          ]
        },
        layout:{
          paddingLeft: function(){return 10}, paddingRight:function(){return 10},
          paddingTop: function(){return 8}, paddingBottom:function(){return 8},
          hLineWidth:function(i){return i===0||i===2?1:0},
          vLineWidth:function(i){return i===0||i===2?1:0},
          hLineColor:function(){return '#e2e8f0'}, vLineColor:function(){return '#e2e8f0'}
        },
        margin:[0,12,0,4]
      },

      // Amount in words (exact phrasing)
      {text: "Amount In Words : " + amountWords, margin:[0,4,0,10], italics:true, style:'words'},

      // System generated note
      {text: "— This is a system-generated document. —", alignment:'center', color:'#64748b', margin:[0,2,0,0]}
    ];

    const doc = {
      pageMargins:[36,36,36,60], // extra bottom for footer
      content,
      styles:{
        h1:{fontSize:16,bold:true},
        addr:{fontSize:9,color:'#475569', lineHeight:1.25},
        title:{fontSize:12,bold:true,color:'#0f172a', letterSpacing:0.2},
        titleMonth:{fontSize:14,bold:true},
        section:{fontSize:10,bold:true,color:'#0f172a'},
        k:{fontSize:9,color:'#475569'},
        v:{fontSize:10},
        net:{fontSize:22,bold:true, alignment:'right', margin:[0,2,0,0]},
        netRight:{fontSize:16,bold:true,alignment:'right'},
        words:{fontSize:10}
      },
      defaultStyle:{fontSize:10},

      // --- FIXED FOOTER (uses config constants above) ---
      footer: function(currentPage, pageCount){
        if (!FOOTER_ENABLED) return {};
        const addrLines = FOOTER_ADDRESS ? FOOTER_ADDRESS.split('\n') : [];
        return {
          margin:[36,8,36,12],
          stack: [
            { canvas: [ { type:'line', x1:0, y1:0, x2:pageWidth, y2:0, lineWidth:0.7, lineColor:'#e2e8f0' } ], margin:[0,0,0,6] },
            {
              columns: [
                {
                  columns: [
                    (FOOTER_LOGO_DATA_URL ? { image: FOOTER_LOGO_DATA_URL, fit: FOOTER_LOGO_FIT, margin:[0,-2,6,0] } : { text:"", width:0 }),
                    {
                      width: 'auto',
                      stack: [
                        {text: FOOTER_COMPANY_NAME || '', bold:true, fontSize:8},
                        (FOOTER_EMAIL ? {text: FOOTER_EMAIL, fontSize:7, color:'#64748b'} : {text:'', fontSize:7}),
                        (addrLines.length ? {text: addrLines.join(', '), fontSize:7, color:'#94a3b8'} : {text:'', fontSize:7})
                      ]
                    }
                  ],
                  columnGap: 6,
                  width:'*'
                },
                { text: `Page ${currentPage} of ${pageCount}`, alignment:'right', fontSize:8, color:'#64748b', width:'auto' }
              ]
            }
          ]
        };
      }
    };
    return doc;
  }

  // Reset
  if (resetBtn){
    resetBtn.addEventListener('click', () => {
      setTimeout(()=>{
        logoDataUrl = null;
        logoPreview.textContent = "No logo uploaded";
        earningsTable.innerHTML = "";
        deductionsTable.innerHTML = "";
        addRow(earningsTable, "Basic", "");
        addRow(earningsTable, "House Rent Allowance", "");
        addRow(deductionsTable, "Income Tax", "");
        addRow(deductionsTable, "Provident Fund", "");
        amountWordsEl.textContent = "—";
        grossEarningsEl.textContent = "0.00";
        totalDeductionsEl.textContent = "0.00";
        netPayEl.textContent = "₹ 0.00";
        showStep(1);
        errorsBox.hidden = true; errorsBox.innerHTML = "";
      }, 0);
    });
  }

  // Initial compute
  recomputeAll();
})();





































// /* Payslip Generator — PDF polish v4
//  * What’s fixed vs your screenshot:
//  * 1) Header logo keeps aspect ratio via fit[] (no stretch/stack). Size tuned (fit:[26,26]).
//  * 2) Employee Summary spacing increased (larger column gaps + line height + margins between blocks).
//  * 3) Earnings/Deductions cards: inner table never touches rounded border. Uses dynamic safe height + inner separators only.
//  * 4) Fixed footer like your sample: hairline, left = logo + company + email + address; right = Page X of Y.
//  *    You can supply either a Data URL or an image URL for the footer logo. URL will be converted to a dataURL at runtime.
//  */
// (function(){
//   const form = document.getElementById('payslipForm');
//   const steps = Array.from(document.querySelectorAll('.step'));
//   const panels = Array.from(document.querySelectorAll('.panel'));
//   const prevBtn = document.getElementById('prevBtn');
//   const nextBtn = document.getElementById('nextBtn');
//   const generateBtn = document.getElementById('generateBtn');
//   const resetBtn = document.getElementById('resetBtn');
//   const errorsBox = document.getElementById('validationErrors');
//   let currentStep = 1;
//   let headerLogoDataUrl = null; // uploaded logo for header

//   // ===== Footer config (edit these defaults for your company) =====
//   // Option A (recommended): paste a Data URL here ('data:image/png;base64,...')
//   const FOOTER_LOGO_DATA_URL = null;
//   // Option B: or give an image URL; we will convert it to dataURL at runtime (needs CORS-enabled hosting)
//   const FOOTER_LOGO_URL      = ""; // e.g., "https://yourcdn.com/footer-logo.png"
//   const FOOTER_COMPANY_NAME  = "Simbi Labs India";
//   const FOOTER_EMAIL         = "grow@simbi.in";
//   const FOOTER_ADDRESS       = "Salcon Rasvilas, Select City Walk, Saket, New Delhi, Delhi, 110017, India";
//   const FOOTER_ENABLED       = true;
//   let computedFooterLogoDataUrl = null; // set at generate time

//   // Elements for pay calculations
//   const payMonthEl = document.getElementById('payMonth');
//   const payYearEl = document.getElementById('payYear');
//   const totalDaysEl = document.getElementById('totalDays');
//   const lopDaysEl = document.getElementById('lopDays');
//   const paidDaysEl = document.getElementById('paidDays');
//   const grossEarningsEl = document.getElementById('grossEarnings');
//   const totalDeductionsEl = document.getElementById('totalDeductions');
//   const netPayEl = document.getElementById('netPay');
//   const amountWordsEl = document.getElementById('amountInWords');
//   const logoInput = document.getElementById('logo');
//   const logoPreview = document.getElementById('logoPreview');

//   // Items tables
//   const earningsTable = document.getElementById('earningsTable').querySelector('tbody');
//   const deductionsTable = document.getElementById('deductionsTable').querySelector('tbody');
//   document.getElementById('addEarning').addEventListener('click', () => addRow(earningsTable));
//   document.getElementById('addDeduction').addEventListener('click', () => addRow(deductionsTable));

//   // Initialize with basic rows
//   addRow(earningsTable, "Basic", "");
//   addRow(earningsTable, "House Rent Allowance", "");
//   addRow(deductionsTable, "Income Tax", "");
//   addRow(deductionsTable, "Provident Fund", "");

//   // Stepper
//   function showStep(n){
//     currentStep = n;
//     steps.forEach(s => s.classList.toggle('active', Number(s.dataset.step) === n));
//     panels.forEach(p => p.hidden = Number(p.dataset.step) !== n);
//     prevBtn.disabled = (n === 1);
//     nextBtn.textContent = (n === 4) ? 'Finish' : 'Next →';
//   }
//   showStep(1);

//   prevBtn.addEventListener('click', () => { if (currentStep > 1) showStep(currentStep - 1); });
//   nextBtn.addEventListener('click', () => {
//     if (currentStep < 4){ if (validateStep(currentStep)) showStep(currentStep + 1); }
//     else { window.scrollTo({top: document.querySelector('.panel[data-step="4"]').offsetTop - 12, behavior:'smooth'}); }
//   });

//   // Logo upload (keeps aspect ratio via fit[] only)
//   logoInput.addEventListener('change', async (e) => {
//     const file = e.target.files?.[0];
//     if (!file) return;
//     if (file.size > 1024*1024){ alert("Logo size should be ≤ 1MB."); logoInput.value = ""; return; }
//     const allowed = ['image/bmp','image/png','image/gif','image/jpeg','image/jpg'];
//     if (!allowed.includes(file.type)){ alert("Unsupported logo format. Use BMP, PNG, GIF, JPG or JPEG."); logoInput.value = ""; return; }
//     const dataUrl = await fileToDataUrl(file);
//     headerLogoDataUrl = dataUrl;
//     logoPreview.innerHTML = `<img src="${dataUrl}" alt="Logo preview" />`;
//   });
//   function fileToDataUrl(file){
//     return new Promise((resolve, reject)=>{ const r = new FileReader(); r.onload = () => resolve(r.result); r.onerror = reject; r.readAsDataURL(file); });
//   }
//   async function urlToDataUrl(url){
//     try{ const res = await fetch(url, {mode:'cors'}); const blob = await res.blob(); return await new Promise((resolve)=>{ const fr=new FileReader(); fr.onload=()=>resolve(fr.result); fr.readAsDataURL(blob); }); }
//     catch(e){ console.warn('Footer logo URL failed (CORS?)', e); return null; }
//   }

//   // Recompute totals and words on input
//   form.addEventListener('input', recomputeAll);
//   function recomputeAll(){
//     const month = payMonthEl.value; const year = Number(payYearEl.value);
//     if (month && year){ totalDaysEl.value = daysInMonth(month, year); if (!paidDaysEl.value){ const lop = Number(lopDaysEl.value||0); paidDaysEl.value = Math.max(0, Number(totalDaysEl.value) - lop); } }
//     const gross = sumTable(earningsTable); const ded = sumTable(deductionsTable);
//     grossEarningsEl.textContent = Number(gross).toFixed(2); totalDeductionsEl.textContent = Number(ded).toFixed(2);
//     const net = Math.max(0, gross - ded); netPayEl.textContent = "₹ " + Number(net).toFixed(2);
//     amountWordsEl.textContent = net>0 ? numberToIndianWords(net) : "Amount is less than or equal to zero.";
//   }
//   function sumTable(tbody){ let s = 0; for (const tr of tbody.querySelectorAll('tr')){ const amt = parseFloat(tr.querySelector('input[type="number"]').value || "0"); s += isNaN(amt) ? 0 : amt; } return s; }
//   function addRow(tbody, desc="", amount=""){ const tr = document.createElement('tr'); tr.innerHTML = `
//       <td><input placeholder="Description" value="${desc||""}" /></td>
//       <td class="amt"><input type="number" step="0.01" min="0" placeholder="0.00" value="${amount||""}"/></td>
//       <td><button type="button" class="remove" title="Remove">×</button></td>`; tr.querySelector('.remove').addEventListener('click', ()=>{ tr.remove(); recomputeAll(); }); tr.querySelectorAll('input').forEach(inp=>inp.addEventListener('input', recomputeAll)); tbody.appendChild(tr); recomputeAll(); }

//   // Validation per step
//   function validateStep(n){
//     errorsBox.hidden = true; errorsBox.innerHTML = ""; const errs = [];
//     if (n === 1){ const companyName = document.getElementById('companyName').value.trim(); if (!companyName) errs.push("Company Name is required."); }
//     if (n === 2){ const employeeName = document.getElementById('employeeName').value.trim(); if (!employeeName) errs.push("Employee Name is required."); }
//     if (n === 3){ const month = payMonthEl.value; const year = Number(payYearEl.value); const payDate = document.getElementById('payDate').value; if (!month) errs.push("Select Pay Period month."); if (!year) errs.push("Enter Pay Period year."); if (!payDate) errs.push("Select Pay Date."); const totalDays = Number(totalDaysEl.value||0); const lop = Number(lopDaysEl.value||0); const paid = Number(paidDaysEl.value||0); if ((lop + paid) > totalDays) errs.push("Paid Days + LOP Days must be ≤ Days in Month."); const sumE = sumTable(earningsTable); if (sumE <= 0) errs.push("Add at least one earning > 0."); }
//     if (errs.length){ errorsBox.hidden = false; errorsBox.innerHTML = "<ul><li>" + errs.join("</li><li>") + "</li></ul>"; return false; } return true;
//   }

//   // ---------- PDF STYLES / HELPERS ----------
//   const C = { ink:'#0f172a', muted:'#475569', line:'#d1d5db', cardLine:'#e2e8f0', shadow:'#000000', green:'#22c55e', greenBg:'#ecfdf5', greenBorder:'#bbf7d0', chipBg:'#e8f5e9' };
//   const PAGE_W = 523; // A4 inner width with 36pt margins
//   const LOGO_FIT = [26, 26]; // header logo max box (keeps aspect ratio)

//   // Rounded card using inline SVG (true border radius) + very light shadow
//   function roundedCard({ w, h, r=10, fill='#ffffff', stroke=C.cardLine, shadow=true, content=[] }){
//     const svg = `\n      <svg width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg">\n        ${shadow ? `<rect x=\"2\" y=\"3\" width=\"${w}\" height=\"${h}\" rx=\"${r}\" ry=\"${r}\" fill=\"#000\" fill-opacity=\"0.07\"/>` : ''}\n        <rect x=\"0\" y=\"0\" width=\"${w}\" height=\"${h}\" rx=\"${r}\" ry=\"${r}\" fill=\"${fill}\" stroke=\"${stroke}\" stroke-width=\"1\"/>\n      </svg>`;
//     return { stack: [ { svg }, { stack: content, relativePosition: { x: 12, y: -(h - 12) } } ], margin: [0, 4, 0, 8] };
//   }
//   function dividerLine(){ return { canvas:[{type:'line', x1:0, y1:0, x2:PAGE_W, y2:0, lineColor:C.line, lineWidth:0.7}], margin:[0,10,0,10] }; }

//   function buildFileName(){
//     const company = (document.getElementById('companyName').value || 'Company').replace(/[^A-Za-z0-9]+/g,'_');
//     const emp = (document.getElementById('employeeName').value || 'Employee').replace(/[^A-Za-z0-9]+/g,'_');
//     const month = document.getElementById('payMonth').value || 'Month';
//     const year = document.getElementById('payYear').value || 'Year';
//     return `${company}_${emp}_Payslip_${month}_${year}.pdf`;
//   }
//   function collectAddress(){
//     const a1 = document.getElementById('addrLine1').value;
//     const a2 = document.getElementById('addrLine2').value;
//     const city = document.getElementById('city').value;
//     const st = document.getElementById('state').value;
//     const pin = document.getElementById('pincode').value;
//     const c = document.getElementById('country').value;
//     return [a1,a2,[city,st,pin].filter(Boolean).join(', '), c].filter(Boolean).join('\n');
//   }
//   function tableRowsFrom(tbody){
//     const rows = []; tbody.querySelectorAll('tr').forEach(tr => {
//       const desc = tr.querySelector('input[type="text"], input:not([type])')?.value || tr.querySelector('input')?.value || "";
//       const amt = parseFloat(tr.querySelector('input[type="number"]').value || "0");
//       rows.push([ {text: desc||"-"}, {text: formatINR(amt), alignment:'right'} ]);
//     }); if (rows.length === 0){ rows.push([{text:"-", color:'#64748b'},{text:formatINR(0), alignment:'right', color:'#64748b'}]); } return rows;
//   }

//   // Footer builder (uses computedFooterLogoDataUrl)
//   function buildFooter(currentPage, pageCount){
//     if (!FOOTER_ENABLED) return {};
//     const leftStack = {
//       columns:[
//         (computedFooterLogoDataUrl ? { image: computedFooterLogoDataUrl, fit:[22,22], margin:[0,0,6,0] } : { width:0, text:'' }),
//         [ {text: FOOTER_COMPANY_NAME, bold:true, color:C.ink, fontSize:9},
//           (FOOTER_EMAIL ? {text: FOOTER_EMAIL, color:'#2563eb', fontSize:8, margin:[0,1,0,0]} : {text:'', margin:[0,0,0,0]}),
//           (FOOTER_ADDRESS ? {text: FOOTER_ADDRESS, color:C.muted, fontSize:8} : {text:''}) ]
//       ],
//       columnGap: 6, width:'*'
//     };
//     const right = { text: `Page ${currentPage} of ${pageCount}`, alignment:'right', color:C.muted, fontSize:8, width:'auto' };
//     return {
//       margin:[36,0,36,16],
//       stack:[
//         { canvas:[{type:'line', x1:0, y1:0, x2:PAGE_W, y2:0, lineColor:C.line, lineWidth:0.7}] },
//         { columns:[ leftStack, right ], columnGap: 8, margin:[0,6,0,0] }
//       ]
//     };
//   }

//   // ---------- BUILD PDF ----------
//   function buildPdfDefinition(){
//     const companyName = document.getElementById('companyName').value;
//     const address = collectAddress();
//     const addressOneLine = (address || '').replace(/\n/g, ', ');
//     const employeeName = document.getElementById('employeeName').value;
//     const employeeId = document.getElementById('employeeId').value;
//     const designation = document.getElementById('designation').value;
//     const pan = document.getElementById('pan').value;
//     const uan = document.getElementById('uan').value;
//     const bank = document.getElementById('bankAccount').value;

//     const payMonth = document.getElementById('payMonth').value;
//     const payYear = document.getElementById('payYear').value;
//     const payDate = document.getElementById('payDate').value;
//     const lopDays = Number(document.getElementById('lopDays').value||0);
//     const paidDays = Number(document.getElementById('paidDays').value||0);

//     const gross = parseFloat(grossEarningsEl.textContent) || 0;
//     const ded = parseFloat(totalDeductionsEl.textContent) || 0;
//     const net = Math.max(0, gross - ded);
//     const amountWords = numberToIndianWords(net);

//     const earningsRows = tableRowsFrom(earningsTable);
//     const deductionsRows = tableRowsFrom(deductionsTable);

//     // ===== Header — logo (kept small, same scale), company + address, month on the right =====
//     const headerBlock = [
//       { columns:[
//           { columns:[ (headerLogoDataUrl ? {image: headerLogoDataUrl, fit: LOGO_FIT, margin:[0,0,8,0]} : {width:0, text:''}), [ {text: companyName, style:'h1'}, {text: addressOneLine, style:'addr', margin:[0,2,0,0]} ] ], columnGap: 10, width:'*' },
//           { stack:[ {text:'Payslip For the Month', style:'mutedRight'}, {text:`${payMonth} ${payYear}`, style:'monthBold'} ], width:'auto', alignment:'right' }
//         ], columnGap: 12 },
//       dividerLine()
//     ];

//     // ===== Employee Summary (roomier) =====
//     const summaryLeft = { stack:[
//       {text:'EMPLOYEE SUMMARY', style:'section'},
//       { columns:[ [{text:'Employee Name', style:'k'},{text:employeeName, style:'v'}], [{text:'Employee ID', style:'k'},{text:(employeeId||'-'), style:'v'}] ], columnGap:34, margin:[0,6,0,0] },
//       { columns:[ [{text:'Pay Period', style:'k'},{text:`${payMonth} ${payYear}`, style:'v'}], [{text:'Pay Date', style:'k'},{text: new Date(payDate).toLocaleDateString('en-GB'), style:'v'}] ], columnGap:34, margin:[0,6,0,0] },
//       (designation ? {text:`Designation: ${designation}`, style:'v', margin:[0,10,0,0]} : ''),
//       (pan ? {text:`PAN: ${pan}`, style:'v', margin:[0,2,0,0]} : ''),
//       (uan ? {text:`UAN: ${uan}`, style:'v', margin:[0,2,0,0]} : ''),
//       (bank ? {text:`Bank A/C: ${bank}`, style:'v', margin:[0,2,0,0]} : '')
//     ].filter(Boolean) };

//     // ===== Net Pay card (right) =====
//     const netCard = roundedCard({ w: 260, h: 120, r: 10, fill: C.greenBg, stroke: C.greenBorder, shadow: true,
//       content: [ { text: formatINR(net), style: 'netBig' }, { text: 'Total Net Pay', style: 'mutedLeft', margin:[0,2,0,6]}, { canvas: [{type:'line', x1:0, y1:0, x2:236, y2:0, lineWidth:1, lineColor:C.line}] , margin:[0,2,0,6]}, { columns:[ [{text:'Paid Days', style:'k'},{text:String(paidDays), style:'v'}], [{text:'LOP Days', style:'k'},{text:String(lopDays), style:'v'}] ], columnGap:20 } ]
//     });

//     // ===== Earnings/Deductions Cards (non-overlapping, like your 2nd image) =====
//     function cardTable(titleLeft, titleRight, rows, totalLabel, totalValue){
//       const ROW_H = 22;    // estimated per row height
//       const safePad = 70;  // header + spacing + total band space
//       const h = Math.max(120, safePad + (rows.length * ROW_H));
//       return roundedCard({ w: 250, h, r: 12, fill:'#ffffff', stroke:C.cardLine, shadow:true, content:[
//         { columns:[ {text:titleLeft, style:'section'}, {text:titleRight, style:'k', alignment:'right'} ] },
//         { canvas:[{type:'line', x1:0, y1:0, x2:226, y2:0, lineColor:C.line, lineWidth:0.7, dash:{length:2, space:2}}], margin:[0,4,0,6] },
//         { table:{ widths:['*', 100], body: rows.concat([[{text: totalLabel, alignment:'right', bold:true},{text: formatINR(totalValue), alignment:'right', bold:true}]]) },
//           layout:{
//             hLineColor: ()=> C.line,
//             vLineColor: ()=> 'transparent',
//             hLineWidth: (i,node)=> (i===0 || i===node.table.body.length) ? 0 : 0.8, // no outer border
//             vLineWidth: ()=> 0,
//             paddingLeft: ()=> 6, paddingRight: ()=> 6, paddingTop: ()=> 6, paddingBottom: ()=> 6
//           }
//         }
//       ]});
//     }

//     const earningsTableBox   = cardTable('EARNINGS','AMOUNT', earningsRows, 'Gross Earnings', gross);
//     const deductionsTableBox = cardTable('DEDUCTIONS','AMOUNT', deductionsRows, 'Total Deductions', ded);

//     // ===== Total band =====
//     const totalChipSvg = `<svg width="130" height="28" xmlns="http://www.w3.org/2000/svg"><rect x="0" y="0" width="120" height="28" rx="6" ry="6" fill="${C.chipBg}" stroke="${C.greenBorder}" stroke-width="1"/></svg>`;
//     const totalBand = roundedCard({ w: PAGE_W, h: 52, r: 8, fill:'#ffffff', stroke:C.cardLine, shadow:false, content: [ { columns:[ {text:'TOTAL NET PAYABLE\nGross Earnings - Total Deductions', style:'section'}, { stack:[ {svg: totalChipSvg}, {text: formatINR(net), alignment:'center', margin:[0,-22,0,0], bold:true} ], width:130, alignment:'right' } ], columnGap: 12 } ] });

//     const doc = {
//       pageMargins:[36,36,36,40],
//       footer: (currentPage, pageCount) => buildFooter(currentPage, pageCount),
//       content:[
//         ...headerBlock,
//         { columns:[ summaryLeft, netCard ], columnGap: 14 },
//         { columns:[earningsTableBox, deductionsTableBox], columnGap: 14, margin:[0,2,0,0] },
//         totalBand,
//         {text: "Amount In Words " + amountWords, margin:[0,6,0,12], italics:true, color:C.muted},
//         {text: "— This is a system-generated document. —", alignment:'center', color:'#64748b'}
//       ],
//       styles:{
//         h1:{fontSize:16,bold:true,color:C.ink},
//         addr:{fontSize:9,color:C.muted},
//         payMonth:{fontSize:12,bold:true, alignment:'right', color:C.ink},
//         mutedRight:{fontSize:9,color:C.muted, alignment:'right'},
//         monthBold:{fontSize:13,bold:true,alignment:'right',color:C.ink},
//         section:{fontSize:10,bold:true,color:C.ink},
//         k:{fontSize:9,color:C.muted},
//         v:{fontSize:10,color:C.ink,lineHeight:1.35},
//         netBig:{fontSize:20,bold:true, alignment:'left', color:C.ink},
//         mutedLeft:{fontSize:9, color:C.muted, alignment:'left'}
//       },
//       defaultStyle:{fontSize:10, color:C.ink}
//     };

//     return doc;
//   }

//   // Generate PDF (async to allow footer logo URL conversion)
//   if (generateBtn){
//     generateBtn.addEventListener('click', async () => {
//       for (let s=1; s<=3; s++){ if (!validateStep(s)){ showStep(s); return; } }
//       computedFooterLogoDataUrl = FOOTER_LOGO_DATA_URL || (FOOTER_LOGO_URL ? await urlToDataUrl(FOOTER_LOGO_URL) : null);
//       const doc = buildPdfDefinition();
//       pdfMake.createPdf(doc).download(buildFileName());
//     });
//   }

//   // Reset
//   if (resetBtn){
//     resetBtn.addEventListener('click', () => {
//       setTimeout(()=>{
//         headerLogoDataUrl = null;
//         logoPreview.textContent = "No logo uploaded";
//         earningsTable.innerHTML = "";
//         deductionsTable.innerHTML = "";
//         addRow(earningsTable, "Basic", "");
//         addRow(earningsTable, "House Rent Allowance", "");
//         addRow(deductionsTable, "Income Tax", "");
//         addRow(deductionsTable, "Provident Fund", "");
//         amountWordsEl.textContent = "—";
//         grossEarningsEl.textContent = "0.00";
//         totalDeductionsEl.textContent = "0.00";
//         netPayEl.textContent = "₹ 0.00";
//         showStep(1);
//         errorsBox.hidden = true; errorsBox.innerHTML = "";
//       }, 0);
//     });
//   }

//   // Initial compute
//   recomputeAll();
// })();
