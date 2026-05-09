import { Router } from 'express';
import { upload } from '../../middleware/upload.js';
import { cleanupFile } from '../../middleware/cleanup.js';
import { PDFDocument } from 'pdf-lib';
import fs from 'fs';

const router = Router();

router.post('/sign', upload.single('file'), async (req, res) => {
  try {
    const { signature, page = 1, posX = 50, posY = 80 } = req.body;
    const pdfBytes = fs.readFileSync(req.file.path);
    const pdfDoc = await PDFDocument.load(pdfBytes);
    const pages = pdfDoc.getPages();
    const pageIdx = Math.min(parseInt(page) - 1, pages.length - 1);
    const targetPage = pages[Math.max(0, pageIdx)];
    const { width, height } = targetPage.getSize();

    // Decode base64 signature PNG
    const sigData = signature.replace(/^data:image\/png;base64,/, '');
    const sigBytes = Buffer.from(sigData, 'base64');
    const sigImage = await pdfDoc.embedPng(sigBytes);
    const sigDims = sigImage.scale(0.4);

    const x = (parseInt(posX) / 100) * width - sigDims.width / 2;
    const y = height - (parseInt(posY) / 100) * height - sigDims.height / 2;

    targetPage.drawImage(sigImage, { x: Math.max(0, x), y: Math.max(0, y), width: sigDims.width, height: sigDims.height });

    const resultBytes = await pdfDoc.save();
    cleanupFile(req.file.path);
    res.set({ 'Content-Type': 'application/pdf', 'Content-Disposition': 'attachment; filename=signed.pdf' });
    res.send(Buffer.from(resultBytes));
  } catch (err) {
    cleanupFile(req.file?.path);
    res.status(500).json({ error: err.message });
  }
});

export default router;
