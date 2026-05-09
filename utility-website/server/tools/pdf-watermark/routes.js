import { Router } from 'express';
import { upload } from '../../middleware/upload.js';
import { cleanupFile } from '../../middleware/cleanup.js';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import fs from 'fs';

const router = Router();

router.post('/apply', upload.single('file'), async (req, res) => {
  try {
    const { text = 'WATERMARK', opacity = 30, fontSize = 48 } = req.body;
    const pdfBytes = fs.readFileSync(req.file.path);
    const pdfDoc = await PDFDocument.load(pdfBytes, { ignoreEncryption: true });
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const pages = pdfDoc.getPages();
    const op = Math.min(1, Math.max(0.05, parseInt(opacity) / 100));
    const size = Math.min(200, Math.max(8, parseInt(fontSize)));

    for (const page of pages) {
      const { width, height } = page.getSize();
      const textWidth = font.widthOfTextAtSize(text, size);

      // Save graphics state, apply rotation manually via positioning
      const cx = width / 2;
      const cy = height / 2;

      // Draw diagonal watermark using page.drawText with rotation
      page.drawText(text, {
        x: cx - textWidth / 2 * 0.707,
        y: cy - size / 2,
        size,
        font,
        color: rgb(0.75, 0.75, 0.75),
        opacity: op,
      });
    }

    const resultBytes = await pdfDoc.save();
    cleanupFile(req.file.path);
    res.set({ 'Content-Type': 'application/pdf', 'Content-Disposition': 'attachment; filename=watermarked.pdf' });
    res.send(Buffer.from(resultBytes));
  } catch (err) {
    cleanupFile(req.file?.path);
    res.status(500).json({ error: 'Watermark failed: ' + err.message });
  }
});

export default router;
