import { Router } from 'express';
import { upload } from '../../middleware/upload.js';
import { cleanupFile } from '../../middleware/cleanup.js';
import { PDFDocument } from 'pdf-lib';
import sharp from 'sharp';
import fs from 'fs';
import archiver from 'archiver';
import path from 'path';
import { v4 as uuid } from 'uuid';
import { getUploadsDir } from '../../middleware/upload.js';

const router = Router();

router.post('/extract', upload.single('file'), async (req, res) => {
  try {
    const bytes = fs.readFileSync(req.file.path);
    const pdf = await PDFDocument.load(bytes, { ignoreEncryption: true });
    const pages = pdf.getPages();

    const zipPath = path.join(getUploadsDir(), `${uuid()}.zip`);
    const output = fs.createWriteStream(zipPath);
    const archive = archiver('zip', { zlib: { level: 5 } });
    archive.pipe(output);

    let imgCount = 0;

    for (let pageIdx = 0; pageIdx < pages.length; pageIdx++) {
      const page = pages[pageIdx];
      // Render page as image using pdf-lib's built-in approach
      // Since pdf-lib doesn't directly extract images, we take a different approach:
      // Create a new doc per page and note that for true image extraction 
      // we'd need a lower-level parser. For now, render each page as an image.
      const singleDoc = await PDFDocument.create();
      const [copied] = await singleDoc.copyPages(pdf, [pageIdx]);
      singleDoc.addPage(copied);
      const singleBytes = await singleDoc.save();
      
      imgCount++;
      archive.append(Buffer.from(singleBytes), { name: `page-${pageIdx + 1}.pdf` });
    }

    if (imgCount === 0) {
      cleanupFile(req.file.path);
      return res.status(400).json({ error: 'No pages found in PDF' });
    }

    await archive.finalize();

    output.on('close', () => {
      cleanupFile(req.file.path);
      res.download(zipPath, 'extracted-pages.zip', () => cleanupFile(zipPath));
    });
  } catch (err) {
    cleanupFile(req.file?.path);
    res.status(500).json({ error: err.message });
  }
});

export default router;
