import { Router } from 'express';
import { upload } from '../../middleware/upload.js';
import { cleanupFile } from '../../middleware/cleanup.js';
import { PDFDocument } from 'pdf-lib';
import fs from 'fs';
const router = Router();
router.post('/clean', upload.single('file'), async (req, res) => {
  try {
    const bytes = fs.readFileSync(req.file.path);
    const src = await PDFDocument.load(bytes, { ignoreEncryption: true });
    const pdf = await PDFDocument.create();
    const indices = src.getPageIndices();
    const copied = await pdf.copyPages(src, indices);
    copied.forEach(p => pdf.addPage(p));
    // Metadata is NOT copied — the new doc is clean
    const result = await pdf.save();
    cleanupFile(req.file.path);
    res.set({ 'Content-Type': 'application/pdf', 'Content-Disposition': 'attachment; filename=cleaned.pdf' });
    res.send(Buffer.from(result));
  } catch (err) { cleanupFile(req.file?.path); res.status(500).json({ error: err.message }); }
});
export default router;
