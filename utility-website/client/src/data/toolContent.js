/* =================================================================
   Tool Content Data — FAQs and How-to steps for all tools.
   Add entries here to automatically show FAQ & How-to on tool pages.
   ================================================================= */

const toolFAQs = {
  'pdf-merger-splitter': [
    { q: 'How many PDFs can I merge at once?', a: 'You can merge up to 50 PDF files at once. Each file can be up to 50MB in size.' },
    { q: 'Will the merged PDF maintain formatting?', a: 'Yes, merging preserves all formatting, images, fonts, and bookmarks from the original PDFs.' },
    { q: 'Can I rearrange the order before merging?', a: 'Files are merged in the order you upload them. Rearrange before uploading for your desired order.' },
    { q: 'Is my data safe?', a: 'Absolutely. Files are processed on the server and automatically deleted within 10 minutes. Nothing is stored permanently.' },
  ],
  'word-to-pdf': [
    { q: 'Does the converter preserve formatting?', a: 'Yes, our converter uses LibreOffice headless mode which preserves fonts, tables, headers, footers, images, and complex layouts.' },
    { q: 'What Word formats are supported?', a: 'We support .docx (Office 2007+) and .doc (legacy) formats.' },
    { q: 'Is there a file size limit?', a: 'The maximum file size is 200MB per document.' },
    { q: 'Can I convert multiple files at once?', a: 'Currently, the tool processes one file at a time for maximum quality.' },
  ],
  'image-compressor': [
    { q: 'How much can images be compressed?', a: 'Typically 60-80% reduction in file size while maintaining visual quality, depending on the image content.' },
    { q: 'Which formats are supported?', a: 'JPG, PNG, WebP, and GIF formats are all supported for compression.' },
    { q: 'Does compression reduce image quality?', a: 'We use intelligent compression that minimizes quality loss. You can adjust the quality slider to balance size vs quality.' },
  ],
  'qr-code-generator': [
    { q: 'What data can I encode in a QR code?', a: 'URLs, text, emails, phone numbers, WiFi credentials, and more can be encoded.' },
    { q: 'Can I customize the QR code colors?', a: 'Yes, you can set custom foreground and background colors for your QR code.' },
    { q: 'What sizes are available for download?', a: 'QR codes can be downloaded at various sizes from 200x200 to 2000x2000 pixels.' },
  ],
  'invoice-generator': [
    { q: 'How many templates are available?', a: 'We offer 5 professional templates: Modern, Classic, Minimal, Corporate, and Creative.' },
    { q: 'Can I add my company logo?', a: 'Yes, you can upload your logo which will appear on the invoice header.' },
    { q: 'Is GST/Tax calculation automatic?', a: 'Yes, enter your tax rate and the tool automatically calculates tax on all line items.' },
    { q: 'Can I save invoices as PDF?', a: 'Yes, click "Download / Print PDF" to save or print a high-quality PDF.' },
    { q: 'Does it support different document types?', a: 'Yes — Invoice, Quotation, Proforma Invoice, Tax Invoice, Credit Note, and Delivery Challan.' },
  ],
  'password-generator': [
    { q: 'Are generated passwords truly random?', a: 'Yes, we use the Web Crypto API (crypto.getRandomValues) for cryptographically secure random generation.' },
    { q: 'Can I customize password requirements?', a: 'Yes, you can set length, and include/exclude uppercase, lowercase, numbers, and special characters.' },
    { q: 'Are my passwords stored anywhere?', a: 'No. Passwords are generated entirely in your browser and never sent to any server.' },
  ],
  'emi-calculator': [
    { q: 'How is EMI calculated?', a: 'EMI = [P × R × (1+R)^N] / [(1+R)^N – 1], where P = Principal, R = Monthly rate, N = Number of months.' },
    { q: 'Can I see the full amortization schedule?', a: 'Yes, the tool shows a complete month-by-month breakdown of principal and interest payments.' },
    { q: 'Does it account for different interest types?', a: 'The calculator uses the reducing balance method, which is the standard for most banks.' },
  ],
  'json-formatter': [
    { q: 'Can I minify JSON too?', a: 'Yes, you can both beautify (format) and minify JSON with one click.' },
    { q: 'Does it validate JSON?', a: 'Yes, the tool highlights syntax errors and shows their exact location.' },
    { q: 'What\'s the maximum JSON size?', a: 'The tool handles JSON files up to several megabytes efficiently in the browser.' },
  ],
  'base64-encoder-decoder': [
    { q: 'What is Base64 encoding?', a: 'Base64 converts binary data into ASCII text using 64 characters (A-Z, a-z, 0-9, +, /), making it safe for text-based transport.' },
    { q: 'Can I encode files?', a: 'This tool encodes/decodes text. For file encoding, paste the file contents as text.' },
    { q: 'Is Base64 encryption?', a: 'No, Base64 is encoding, not encryption. It\'s reversible and provides no security.' },
  ],
  'markdown-previewer': [
    { q: 'Which Markdown syntax is supported?', a: 'We support standard Markdown plus GitHub Flavored Markdown (tables, task lists, strikethrough, code blocks).' },
    { q: 'Can I export the preview?', a: 'You can copy the rendered HTML or print the preview directly.' },
  ],
  'decision-tree': [
    { q: 'How do I add new nodes?', a: 'Click any emoji button (+) on a node to add a child of that type (Question, Condition, Action, Answer, Note).' },
    { q: 'Can I rearrange nodes?', a: 'Yes, drag any node and drop it on another node to reparent it.' },
    { q: 'Can I save my tree?', a: 'Yes, click "Export" to save as JSON. You can "Import" it later to continue editing.' },
    { q: 'How complex can trees get?', a: 'There\'s no limit. You can build trees with hundreds of nodes across unlimited depth levels.' },
  ],
  'countdown-timer': [
    { q: 'Does the timer play a sound when done?', a: 'Yes, a gentle notification chime plays when the countdown reaches zero.' },
    { q: 'Can I share a countdown?', a: 'Yes, click "Copy Shareable Link" to share. Recipients see a read-only countdown they cannot edit.' },
    { q: 'Does it work across time zones?', a: 'Yes, the countdown uses your local time zone and works correctly for recipients in any time zone.' },
  ],
  'name-spinner': [
    { q: 'Is the selection truly random?', a: 'Yes, the wheel uses Math.random() for unbiased random selection.' },
    { q: 'How many names can I add?', a: 'You can add as many names as you want. The wheel adjusts segment sizes automatically.' },
  ],
  'binary-converter': [
    { q: 'What number bases are supported?', a: 'Decimal (base 10), Binary (base 2), Octal (base 8), and Hexadecimal (base 16).' },
    { q: 'Is there a size limit?', a: 'JavaScript safely handles integers up to 2^53 - 1 (9,007,199,254,740,991).' },
  ],
  'whats-my-ip': [
    { q: 'Why might my IP look different from expected?', a: 'If you\'re using a VPN, proxy, or your ISP uses CGNAT, the detected IP will be the exit point, not your local IP.' },
    { q: 'Is my IP stored?', a: 'No, the IP is fetched from external services and displayed only in your browser. Nothing is logged.' },
  ],
  'dns-lookup': [
    { q: 'What DNS record types are checked?', a: 'A, AAAA, MX, CNAME, TXT, and NS records are all queried.' },
    { q: 'Why might some records be empty?', a: 'Not all domains have every record type. For example, a domain might not have AAAA (IPv6) records.' },
  ],
  'ocr-tool': [
    { q: 'Which languages are supported?', a: 'The OCR engine supports English text recognition. Results are best with clear, high-contrast images.' },
    { q: 'Does it work with handwritten text?', a: 'OCR works best with printed text. Handwritten text recognition accuracy may vary.' },
  ],
  'pdf-watermark': [
    { q: 'Can I customize the watermark text?', a: 'Yes, you can set custom text, font size, color, opacity, and rotation angle.' },
    { q: 'Does it apply to all pages?', a: 'Yes, the watermark is applied to every page of the PDF.' },
  ],
};

const toolHowTo = {
  'pdf-merger-splitter': [
    { title: 'Upload your PDFs', description: 'Drag and drop or click to select the PDF files you want to merge or split.' },
    { title: 'Choose mode', description: 'Select "Merge" to combine PDFs or "Split" to extract specific pages.' },
    { title: 'Process & Download', description: 'Click the action button and your processed file will download automatically.' },
  ],
  'word-to-pdf': [
    { title: 'Upload Word document', description: 'Select your .docx or .doc file using the upload area.' },
    { title: 'Convert', description: 'Click "Convert to PDF" — the server uses LibreOffice for high-fidelity conversion.' },
    { title: 'Download PDF', description: 'Your converted PDF downloads automatically with all formatting preserved.' },
  ],
  'invoice-generator': [
    { title: 'Choose a template', description: 'Select from 5 professional templates: Modern, Classic, Minimal, Corporate, or Creative.' },
    { title: 'Fill in details', description: 'Enter your company info, client details, and line items. Add logo, tax rate, and bank details.' },
    { title: 'Preview live', description: 'See your invoice update in real-time in the preview panel on the right.' },
    { title: 'Download as PDF', description: 'Click "Download / Print PDF" to save a professional PDF ready to send.' },
  ],
  'qr-code-generator': [
    { title: 'Enter your data', description: 'Type or paste the URL, text, or data you want to encode.' },
    { title: 'Customize appearance', description: 'Set custom colors, size, and error correction level.' },
    { title: 'Download QR code', description: 'Click download to save your QR code as a PNG image.' },
  ],
  'decision-tree': [
    { title: 'Start with the root question', description: 'Double-click the root node to edit the starting question or decision point.' },
    { title: 'Add branches', description: 'Click the emoji buttons to add child nodes — Questions, Conditions, Actions, Answers, or Notes.' },
    { title: 'Organize your tree', description: 'Drag nodes to reparent them. Collapse branches with ▼/▶. Use zoom to navigate large trees.' },
    { title: 'Export & Share', description: 'Click Export to save as JSON. Import later to continue editing.' },
  ],
  'password-generator': [
    { title: 'Set password length', description: 'Use the slider to set your desired password length (8-128 characters).' },
    { title: 'Choose character types', description: 'Enable/disable uppercase, lowercase, numbers, and special characters.' },
    { title: 'Generate & Copy', description: 'Click Generate and then Copy to clipboard. The password never leaves your browser.' },
  ],
  'emi-calculator': [
    { title: 'Enter loan details', description: 'Input the loan amount, interest rate (annual), and loan tenure in months or years.' },
    { title: 'View EMI breakdown', description: 'See your monthly EMI, total interest, and total payment amount.' },
    { title: 'Check amortization', description: 'Scroll down to see the complete month-by-month payment schedule.' },
  ],
  'countdown-timer': [
    { title: 'Set event details', description: 'Enter the event name and target date/time.' },
    { title: 'Watch countdown', description: 'The timer counts down in real-time. A sound plays when time is up.' },
    { title: 'Share with others', description: 'Click "Copy Shareable Link" to send a read-only countdown to anyone.' },
  ],
  'image-compressor': [
    { title: 'Upload images', description: 'Drag and drop or select images (JPG, PNG, WebP, GIF).' },
    { title: 'Adjust quality', description: 'Use the quality slider to balance file size vs visual quality.' },
    { title: 'Download compressed', description: 'Click compress and download your optimized images.' },
  ],
  'name-spinner': [
    { title: 'Add participants', description: 'Enter names, one per line, in the text area.' },
    { title: 'Spin the wheel', description: 'Click "Spin the Wheel!" and watch it spin with animation.' },
    { title: 'See the winner', description: 'The winner is announced when the wheel stops. Spin again for another round!' },
  ],
};

export const getToolFAQs = (slug) => toolFAQs[slug] || [];
export const getToolHowTo = (slug) => toolHowTo[slug] || [];
