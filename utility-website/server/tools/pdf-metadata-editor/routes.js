import { Router } from 'express';
import { upload } from '../../middleware/upload.js';
import { cleanupFile } from '../../middleware/cleanup.js';
import { PDFDocument } from 'pdf-lib';
import fs from 'fs';
const router = Router();
router.post('/edit', upload.single('file'), async (req, res) => {
  try {
    const { title, author, subject, keywords } = req.body;
    const bytes = fs.readFileSync(req.file.path);
    const pdf = await PDFDocument.load(bytes, { ignoreEncryption: true });
    if (title) pdf.setTitle(title);
    if (author) pdf.setAuthor(author);
    if (subject) pdf.setSubject(subject);
    if (keywords) pdf.setKeywords(keywords.split(',').map(k => k.trim()));
    pdf.setModificationDate(new Date());
    const result = await pdf.save();
    cleanupFile(req.file.path);
    res.set({ 'Content-Type': 'application/pdf', 'Content-Disposition': 'attachment; filename=edited.pdf' });
    res.send(Buffer.from(result));
  } catch (err) { cleanupFile(req.file?.path); res.status(500).json({ error: err.message }); }
});
export default router;
