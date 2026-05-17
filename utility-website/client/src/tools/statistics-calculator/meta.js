export default {
  name: 'Statistics Calculator',
  slug: 'statistics-calculator',
  description: 'Professional SPSS-style statistics: Descriptive stats, Pearson/Spearman/Partial correlation, T-tests, ANOVA, Regression. Import Excel, analyze online.',
  icon: 'Calculator',
  category: 'calculators',
  keywords: ['statistics', 'SPSS', 'mean', 'median', 'mode', 'correlation', 'pearson', 'spearman', 'partial correlation', 't-test', 'ANOVA', 'regression', 'descriptive statistics', 'p-value', 'excel', 'data analysis'],
  faqs: [
    { q: 'What tests are available?', a: 'Descriptive Statistics, Pearson & Spearman Correlation, Partial Correlation, Distance Matrix, One-Sample T-Test, Independent Samples T-Test, One-Way ANOVA, and Linear Regression.' },
    { q: 'Can I import my Excel data?', a: 'Yes! Click "Import Excel" to load .xlsx files. Only the first sheet is imported and the grid auto-expands.' },
    { q: 'How are p-values calculated?', a: 'P-values are computed using the regularized incomplete beta function — the same mathematical method used by IBM SPSS and R.' },
    { q: 'Can I export results?', a: 'Yes! Click "Export SPSS Output" to download all results as a multi-sheet Excel file in IBM SPSS format.' },
    { q: 'Is my data private?', a: 'Absolutely. All calculations run in your browser. No data is sent to any server.' },
  ],
  howTo: [
    { title: 'Enter or Import Data', desc: 'Type data into the grid or import an Excel file. Navigate with arrow keys, Enter, and Tab.' },
    { title: 'Select Analysis', desc: 'Click the Analyze dropdown and choose a test (e.g., Descriptive, Correlation, T-Test, ANOVA, Regression).' },
    { title: 'Configure Variables', desc: 'In the dialog, select the columns to analyze. For correlations, choose Pearson/Spearman and control variables.' },
    { title: 'View & Export Results', desc: 'Results appear in SPSS-style tables. Export all results to Excel with one click.' },
  ],
};
