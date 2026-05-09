import { Router } from 'express';
import { upload } from '../../middleware/upload.js';
import { cleanupFile } from '../../middleware/cleanup.js';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import fs from 'fs';
const router = Router();
router.post('/number', upload.single('file'), async (req, res) => {
  try {
    const { position = 'bottom-center' } = req.body;
    const bytes = fs.readFileSync(req.file.path);
    const pdf = await PDFDocument.load(bytes, { ignoreEncryption: true });
    const font = await pdf.embedFont(StandardFonts.Helvetica);
    const pages = pdf.getPages();
    pages.forEach((page, i) => {
      const { width, height } = page.getSize();
      const text = `${i + 1}`;
      const size = 10;
      const tw = font.widthOfTextAtSize(text, size);
      let x, y;
      if (position === 'bottom-center') { x = (width - tw) / 2; y = 20; }
      else if (position === 'bottom-right') { x = width - 40 - tw; y = 20; }
      else if (position === 'top-center') { x = (width - tw) / 2; y = height - 30; }
      else { x = width - 40 - tw; y = height - 30; }
      page.drawText(text, { x, y, size, font, color: rgb(0.4, 0.4, 0.4) });
    });
    const result = await pdf.save();
    cleanupFile(req.file.path);
    res.set({ 'Content-Type': 'application/pdf', 'Content-Disposition': 'attachment; filename=numbered.pdf' });
    res.send(Buffer.from(result));
  } catch (err) { cleanupFile(req.file?.path); res.status(500).json({ error: err.message }); }
});
export default router;
