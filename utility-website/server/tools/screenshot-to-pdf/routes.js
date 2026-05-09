import { Router } from 'express';
import { upload } from '../../middleware/upload.js';
import { cleanupFiles } from '../../middleware/cleanup.js';
import { PDFDocument } from 'pdf-lib';
import sharp from 'sharp';
import fs from 'fs';

const router = Router();

router.post('/convert', upload.array('files', 50), async (req, res) => {
  const filePaths = (req.files || []).map(f => f.path);
  
  if (!filePaths.length) {
    return res.status(400).json({ error: 'No files uploaded' });
  }

  try {
    const pdfDoc = await PDFDocument.create();

    for (const fp of filePaths) {
      // Get metadata first to know dimensions
      const metadata = await sharp(fp).metadata();
      const w = metadata.width || 800;
      const h = metadata.height || 600;

      // Convert to PNG or JPG buffer for embedding
      let imgEmbed;
      const format = metadata.format;
      
      if (format === 'jpeg' || format === 'jpg') {
        const jpgBuffer = await sharp(fp).jpeg({ quality: 95 }).toBuffer();
        imgEmbed = await pdfDoc.embedJpg(jpgBuffer);
      } else {
        const pngBuffer = await sharp(fp).png().toBuffer();
        imgEmbed = await pdfDoc.embedPng(pngBuffer);
      }

      const page = pdfDoc.addPage([w, h]);
      page.drawImage(imgEmbed, { x: 0, y: 0, width: w, height: h });
    }

    const pdfBytes = await pdfDoc.save();
    cleanupFiles(filePaths);
    res.set({ 'Content-Type': 'application/pdf', 'Content-Disposition': 'attachment; filename=screenshots.pdf' });
    res.send(Buffer.from(pdfBytes));
  } catch (err) {
    cleanupFiles(filePaths);
    res.status(500).json({ error: 'Screenshot to PDF failed: ' + err.message });
  }
});

export default router;
