export default {
  name: 'SPSS Numeric Converter',
  slug: 'spss-numeric-converter',
  description: 'Convert text/categorical Excel data to numeric codes for SPSS analysis. Map values manually or auto-convert alphabetically.',
  icon: 'Hash',
  category: 'converters',
  keywords: ['SPSS', 'numeric converter', 'categorical', 'coding', 'survey', 'data analysis', 'excel', 'likert scale'],
  faqs: [
    { q: 'What does this tool do?', a: 'It converts text responses (e.g., Agree, Disagree) into numeric codes (1, 2, 3...) for statistical analysis in SPSS or Excel.' },
    { q: 'Can I customize the numeric mapping?', a: 'Yes! After uploading, a dashboard lets you map each unique value to any number. Or use the default alphabetical ordering.' },
    { q: 'Does it include a notation sheet?', a: 'Yes, the downloaded Excel includes a "Notation" sheet showing which text value maps to which number.' },
  ],
  howTo: [
    { title: 'Upload Excel', desc: 'Upload an .xlsx file containing text/categorical data.' },
    { title: 'Review Dashboard', desc: 'See all columns, unique values, and map them to numbers.' },
    { title: 'Convert & Download', desc: 'Click Convert to get a numeric Excel with a notation reference sheet.' },
  ],
};
