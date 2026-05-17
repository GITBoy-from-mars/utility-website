export default {
  name: 'Statistics Calculator',
  slug: 'statistics-calculator',
  description: 'Analyze data with Mean, Median, Mode & Correlation — like IBM SPSS, right in your browser. Import Excel files and get instant results.',
  icon: 'BarChart',
  category: 'calculators',
  keywords: ['statistics', 'mean', 'median', 'mode', 'correlation', 'SPSS', 'data analysis', 'excel'],
  faqs: [
    { q: 'What statistical functions are supported?', a: 'Mean, Median, Mode, and Pearson Correlation analysis on numeric data.' },
    { q: 'Can I import Excel files?', a: 'Yes, upload .xlsx/.xls files and the grid auto-expands to fit all your data.' },
    { q: 'Is my data processed on a server?', a: 'No. All calculations run 100% in your browser — your data never leaves your device.' },
  ],
  howTo: [
    { title: 'Enter or Import Data', desc: 'Type numbers into the spreadsheet grid or import an Excel file.' },
    { title: 'Select Columns', desc: 'Choose which columns to analyze from the Analysis menu.' },
    { title: 'Run Analysis', desc: 'Pick Mean, Median, Mode, or Correlation and view results instantly.' },
  ],
};
