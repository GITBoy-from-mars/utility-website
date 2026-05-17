export default {
  name: 'Payslip Generator',
  slug: 'payslip-generator',
  description: 'Generate professional Indian payslips with earnings, deductions, and net pay. Download as PDF instantly.',
  icon: 'FileText',
  category: 'generators',
  keywords: ['payslip', 'salary slip', 'india', 'pdf', 'earnings', 'deductions', 'HR'],
  faqs: [
    { q: 'Is this payslip format valid for Indian companies?', a: 'Yes, it follows standard Indian payslip format with PAN, UAN, PF, and Indian numbering.' },
    { q: 'Can I add a company logo?', a: 'Yes, upload a logo (PNG/JPG, up to 1MB) and it appears on the payslip header.' },
    { q: 'Is my data stored?', a: 'No, everything runs in your browser. No data is sent to any server.' },
  ],
  howTo: [
    { title: 'Enter Company Details', desc: 'Fill in company name, address, and upload logo.' },
    { title: 'Add Employee Info', desc: 'Enter employee name, ID, designation, PAN, UAN, and bank details.' },
    { title: 'Set Pay Items', desc: 'Add earnings (Basic, HRA, etc.) and deductions (Tax, PF, etc.).' },
    { title: 'Download PDF', desc: 'Preview and download a professionally formatted payslip PDF.' },
  ],
};
