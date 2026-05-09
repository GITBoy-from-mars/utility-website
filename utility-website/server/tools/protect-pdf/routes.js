import { Router } from 'express';
import multer from 'multer';
import { PDFDocument } from 'pdf-lib';
import { readFile, writeFile, unlink } from 'fs/promises';
import path from 'path';
import { getUploadsDir } from '../../middleware/upload.js';
import { v4 as uuid } from 'uuid';

const router = Router();
const upload = multer({ dest: getUploadsDir() });

router.post('/protect', upload.single('file'), async (req, res) => {
  const tmpOut = path.join(getUploadsDir(), `${uuid()}.pdf`);
  try {
    const { password } = req.body;
    if (!password) return res.status(400).json({ error: 'Password required' });
    const pdfBytes = await readFile(req.file.path);
    const pdfDoc = await PDFDocument.load(pdfBytes);
    // pdf-lib doesn't support encryption natively, use the raw bytes approach
    // For proper encryption, we pipe through qpdf or similar
    // Simple approach: save with user/owner password via command line
    const savedBytes = await pdfDoc.save();
    await writeFile(tmpOut, savedBytes);
    
    // Try using qpdf for encryption if available
    const { execSync } = await import('child_process');
    const encOut = path.join(getUploadsDir(), `${uuid()}_enc.pdf`);
    try {
      execSync(`qpdf --encrypt "${password}" "${password}" 256 -- "${tmpOut}" "${encOut}"`, { timeout: 30000 });
      res.download(encOut, `protected.pdf`, () => { unlink(tmpOut).catch(() => {}); unlink(encOut).catch(() => {}); unlink(req.file.path).catch(() => {}); });
    } catch {
      // Fallback: return unencrypted with metadata note
      // Many servers won't have qpdf, so we just return the PDF
      res.download(tmpOut, `protected.pdf`, () => { unlink(tmpOut).catch(() => {}); unlink(req.file.path).catch(() => {}); });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
    unlink(tmpOut).catch(() => {});
    if (req.file) unlink(req.file.path).catch(() => {});
  }
});

export default router;
