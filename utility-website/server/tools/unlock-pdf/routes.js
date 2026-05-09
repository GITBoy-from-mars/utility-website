import { Router } from 'express';
import { upload } from '../../middleware/upload.js';
import { cleanupFile } from '../../middleware/cleanup.js';
import { PDFDocument } from 'pdf-lib';
import fs from 'fs';
const router = Router();
router.post('/unlock', upload.single('file'), async (req, res) => {
  try {
    const bytes = fs.readFileSync(req.file.path);
    const pdf = await PDFDocument.load(bytes, { ignoreEncryption: true, password: req.body.password || undefined });
    const result = await pdf.save();
    cleanupFile(req.file.path);
    res.set({ 'Content-Type': 'application/pdf', 'Content-Disposition': 'attachment; filename=unlocked.pdf' });
    res.send(Buffer.from(result));
  } catch (err) { cleanupFile(req.file?.path); res.status(500).json({ error: 'Failed to unlock: ' + err.message }); }
});
export default router;
