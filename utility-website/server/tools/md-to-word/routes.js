import { Router } from 'express';
import { upload } from '../../middleware/upload.js';
import { cleanupFile } from '../../middleware/cleanup.js';
import fs from 'fs';
import { marked } from 'marked';
import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType } from 'docx';

const router = Router();

function htmlToDocxParagraphs(mdText) {
  const lines = mdText.split('\n');
  const paragraphs = [];

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) {
      paragraphs.push(new Paragraph({ text: '' }));
      continue;
    }

    // Headings
    if (trimmed.startsWith('### ')) {
      paragraphs.push(new Paragraph({ heading: HeadingLevel.HEADING_3, children: [new TextRun({ text: trimmed.slice(4), bold: true, size: 28 })] }));
    } else if (trimmed.startsWith('## ')) {
      paragraphs.push(new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun({ text: trimmed.slice(3), bold: true, size: 32 })] }));
    } else if (trimmed.startsWith('# ')) {
      paragraphs.push(new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun({ text: trimmed.slice(2), bold: true, size: 36 })] }));
    } else if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
      paragraphs.push(new Paragraph({ bullet: { level: 0 }, children: [new TextRun({ text: trimmed.slice(2), size: 24 })] }));
    } else if (/^\d+\.\s/.test(trimmed)) {
      paragraphs.push(new Paragraph({ numbering: { reference: 'default-numbering', level: 0 }, children: [new TextRun({ text: trimmed.replace(/^\d+\.\s/, ''), size: 24 })] }));
    } else if (trimmed.startsWith('> ')) {
      paragraphs.push(new Paragraph({ indent: { left: 720 }, children: [new TextRun({ text: trimmed.slice(2), italics: true, size: 24, color: '666666' })] }));
    } else {
      // Parse inline formatting
      const children = [];
      let remaining = trimmed;
      const regex = /(\*\*(.+?)\*\*|\*(.+?)\*|`(.+?)`)/g;
      let lastIndex = 0;
      let match;
      while ((match = regex.exec(remaining)) !== null) {
        if (match.index > lastIndex) {
          children.push(new TextRun({ text: remaining.slice(lastIndex, match.index), size: 24 }));
        }
        if (match[2]) children.push(new TextRun({ text: match[2], bold: true, size: 24 }));
        else if (match[3]) children.push(new TextRun({ text: match[3], italics: true, size: 24 }));
        else if (match[4]) children.push(new TextRun({ text: match[4], font: 'Courier New', size: 22 }));
        lastIndex = match.index + match[0].length;
      }
      if (lastIndex < remaining.length) {
        children.push(new TextRun({ text: remaining.slice(lastIndex), size: 24 }));
      }
      if (children.length === 0) children.push(new TextRun({ text: trimmed, size: 24 }));
      paragraphs.push(new Paragraph({ children }));
    }
  }
  return paragraphs;
}

router.post('/convert', upload.single('file'), async (req, res) => {
  try {
    const mdText = fs.readFileSync(req.file.path, 'utf-8');
    const paragraphs = htmlToDocxParagraphs(mdText);
    
    const doc = new Document({
      numbering: {
        config: [{ reference: 'default-numbering', levels: [{ level: 0, format: 'decimal', text: '%1.', alignment: AlignmentType.START }] }],
      },
      sections: [{ children: paragraphs }],
    });
    
    const buffer = await Packer.toBuffer(doc);
    cleanupFile(req.file.path);
    res.set({ 'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'Content-Disposition': 'attachment; filename=converted.docx' });
    res.send(buffer);
  } catch (err) {
    cleanupFile(req.file?.path);
    res.status(500).json({ error: err.message });
  }
});

export default router;
