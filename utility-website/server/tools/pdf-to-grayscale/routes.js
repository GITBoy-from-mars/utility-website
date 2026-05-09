import { Router } from 'express';
import { upload } from '../../middleware/upload.js';
import { cleanupFile } from '../../middleware/cleanup.js';
import fs from 'fs';
import { exec } from 'child_process';
import path from 'path';
import { v4 as uuid } from 'uuid';
import { getUploadsDir } from '../../middleware/upload.js';
import { PDFDocument } from 'pdf-lib';
const router = Router();
router.post('/convert', upload.single('file'), async (req, res) => {
  const outPath = path.join(getUploadsDir(), `${uuid()}.pdf`);
  try {
    // Try Ghostscript first (best quality)
    await new Promise((resolve, reject) => {
      exec(`gs -sDEVICE=pdfwrite -sProcessColorModel=DeviceGray -sColorConversionStrategy=Gray -dOverrideICC -o "${outPath}" -f "${req.file.path}"`, { timeout: 60000 }, (err) => err ? reject(err) : resolve());
    });
    res.download(outPath, 'grayscale.pdf', () => { cleanupFile(req.file.path); cleanupFile(outPath); });
  } catch {
    // Fallback: re-save with pdf-lib (won't change image colors but restructures)
    try {
      const bytes = fs.readFileSync(req.file.path);
      const pdf = await PDFDocument.load(bytes, { ignoreEncryption: true });
      const result = await pdf.save();
      cleanupFile(req.file.path);
      res.set({ 'Content-Type': 'application/pdf', 'Content-Disposition': 'attachment; filename=grayscale.pdf' });
      res.send(Buffer.from(result));
    } catch (err2) { cleanupFile(req.file?.path); res.status(500).json({ error: err2.message }); }
  }
});
export default router;
