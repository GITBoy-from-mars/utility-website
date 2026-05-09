import { Router } from 'express';
import { upload } from '../../middleware/upload.js';
import { cleanupFiles, cleanupFile } from '../../middleware/cleanup.js';
import { PDFDocument } from 'pdf-lib';
import fs from 'fs';
import archiver from 'archiver';
import { v4 as uuid } from 'uuid';
import path from 'path';
import { getUploadsDir } from '../../middleware/upload.js';

const router = Router();

router.post('/process', upload.array('files', 50), async (req, res) => {
  const filePaths = (req.files || []).map(f => f.path);
  
  if (!filePaths.length) {
    return res.status(400).json({ error: 'No files uploaded' });
  }

  try {
    const { mode, pages } = req.body;

    if (mode === 'merge') {
      const merged = await PDFDocument.create();
      for (const fp of filePaths) {
        const bytes = fs.readFileSync(fp);
        const src = await PDFDocument.load(bytes, { ignoreEncryption: true });
        const indices = src.getPageIndices();
        const copied = await merged.copyPages(src, indices);
        copied.forEach(p => merged.addPage(p));
      }
      const mergedBytes = await merged.save();
      cleanupFiles(filePaths);
      res.set({
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename=merged.pdf',
      });
      return res.send(Buffer.from(mergedBytes));
    }

    // Split mode
    if (filePaths.length === 0) {
      return res.status(400).json({ error: 'No file to split' });
    }

    const bytes = fs.readFileSync(filePaths[0]);
    const src = await PDFDocument.load(bytes, { ignoreEncryption: true });
    const totalPages = src.getPageCount();

    let pageIndices = [];
    if (pages && pages.trim()) {
      pages.split(',').forEach(part => {
        const trimmed = part.trim();
        if (trimmed.includes('-')) {
          const [s, e] = trimmed.split('-').map(Number);
          for (let i = Math.max(1, s); i <= Math.min(e, totalPages); i++) {
            pageIndices.push(i - 1);
          }
        } else {
          const n = Number(trimmed);
          if (n >= 1 && n <= totalPages) pageIndices.push(n - 1);
        }
      });
    } else {
      pageIndices = Array.from({ length: totalPages }, (_, i) => i);
    }

    if (pageIndices.length === 0) {
      cleanupFiles(filePaths);
      return res.status(400).json({ error: 'No valid pages to extract' });
    }

    // If only one page, return as PDF directly
    if (pageIndices.length === 1) {
      const newDoc = await PDFDocument.create();
      const [copied] = await newDoc.copyPages(src, [pageIndices[0]]);
      newDoc.addPage(copied);
      const pageBytes = await newDoc.save();
      cleanupFiles(filePaths);
      res.set({ 'Content-Type': 'application/pdf', 'Content-Disposition': `attachment; filename=page-${pageIndices[0] + 1}.pdf` });
      return res.send(Buffer.from(pageBytes));
    }

    // Multiple pages — zip them
    const zipPath = path.join(getUploadsDir(), `${uuid()}.zip`);
    const output = fs.createWriteStream(zipPath);
    const archive = archiver('zip', { zlib: { level: 5 } });

    archive.on('error', (err) => { throw err; });
    archive.pipe(output);

    for (const idx of pageIndices) {
      const newDoc = await PDFDocument.create();
      const [copied] = await newDoc.copyPages(src, [idx]);
      newDoc.addPage(copied);
      const pageBytes = await newDoc.save();
      archive.append(Buffer.from(pageBytes), { name: `page-${idx + 1}.pdf` });
    }

    await archive.finalize();

    output.on('close', () => {
      cleanupFiles(filePaths);
      res.download(zipPath, 'split-pages.zip', () => {
        cleanupFile(zipPath);
      });
    });
  } catch (err) {
    cleanupFiles(filePaths);
    res.status(500).json({ error: 'PDF processing failed: ' + err.message });
  }
});

export default router;
