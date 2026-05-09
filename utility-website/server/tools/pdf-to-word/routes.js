import { Router } from 'express';
import { upload } from '../../middleware/upload.js';
import { cleanupFile } from '../../middleware/cleanup.js';
import fs from 'fs';
import path from 'path';
import pdfParse from 'pdf-parse/lib/pdf-parse.js';
import { Document, Packer, Paragraph, TextRun } from 'docx';

const router = Router();

router.post('/convert', upload.single('file'), async (req, res) => {
  try {
    const pdfBuffer = fs.readFileSync(req.file.path);
    const data = await pdfParse(pdfBuffer);
    const paragraphs = data.text.split('\n').filter(l => l.trim()).map(line =>
      new Paragraph({ children: [new TextRun({ text: line, size: 24 })] })
    );
    const doc = new Document({ sections: [{ children: paragraphs }] });
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
