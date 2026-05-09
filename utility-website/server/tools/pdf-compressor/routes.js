import { Router } from 'express';
import { upload } from '../../middleware/upload.js';
import { cleanupFile } from '../../middleware/cleanup.js';
import { PDFDocument } from 'pdf-lib';
import fs from 'fs';
import sharp from 'sharp';

const router = Router();

router.post('/compress', upload.single('file'), async (req, res) => {
  try {
    const { quality = 'medium' } = req.body;
    const qualityMap = { low: 85, medium: 60, high: 30 };
    const q = qualityMap[quality] || 60;
    const pdfBytes = fs.readFileSync(req.file.path);
    const pdfDoc = await PDFDocument.load(pdfBytes);

    /* Re-save the PDF (removes unused objects, optimizes structure) */
    const savedBytes = await pdfDoc.save({
      useObjectStreams: true,
      addDefaultPage: false,
    });

    cleanupFile(req.file.path);
    res.set({ 'Content-Type': 'application/pdf', 'Content-Disposition': 'attachment; filename=compressed.pdf' });
    res.send(Buffer.from(savedBytes));
  } catch (err) {
    cleanupFile(req.file?.path);
    res.status(500).json({ error: err.message });
  }
});

export default router;
