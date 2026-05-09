import { Router } from 'express';
import { upload } from '../../middleware/upload.js';
import { cleanupFile } from '../../middleware/cleanup.js';
import { PDFDocument } from 'pdf-lib';
import fs from 'fs';
const router = Router();
function parsePages(str, total) {
  if (!str || !str.trim()) return Array.from({ length: total }, (_, i) => i);
  const indices = [];
  str.split(',').forEach(p => {
    const t = p.trim();
    if (t.includes('-')) { const [s, e] = t.split('-').map(Number); for (let i = Math.max(1, s); i <= Math.min(e, total); i++) indices.push(i - 1); }
    else { const n = Number(t); if (n >= 1 && n <= total) indices.push(n - 1); }
  });
  return indices;
}
router.post('/rotate', upload.single('file'), async (req, res) => {
  try {
    const { angle = '90', pages = '' } = req.body;
    const degrees = parseInt(angle);
    const bytes = fs.readFileSync(req.file.path);
    const pdf = await PDFDocument.load(bytes, { ignoreEncryption: true });
    const allPages = pdf.getPages();
    const indices = parsePages(pages, allPages.length);
    indices.forEach(i => { if (allPages[i]) allPages[i].setRotation({ type: 'degrees', angle: (allPages[i].getRotation().angle + degrees) % 360 }); });
    const result = await pdf.save();
    cleanupFile(req.file.path);
    res.set({ 'Content-Type': 'application/pdf', 'Content-Disposition': 'attachment; filename=rotated.pdf' });
    res.send(Buffer.from(result));
  } catch (err) { cleanupFile(req.file?.path); res.status(500).json({ error: err.message }); }
});
export default router;
