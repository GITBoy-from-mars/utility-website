import { Router } from 'express';
import { upload } from '../../middleware/upload.js';
import { cleanupFile } from '../../middleware/cleanup.js';
import { createWorker } from 'tesseract.js';

const router = Router();

router.post('/extract', upload.single('file'), async (req, res) => {
  let worker = null;
  try {
    worker = await createWorker('eng');
    const { data: { text } } = await worker.recognize(req.file.path);
    await worker.terminate();
    cleanupFile(req.file.path);
    res.json({ text: text.trim() || '(No text detected in this image)' });
  } catch (err) {
    if (worker) try { await worker.terminate(); } catch(e) {}
    cleanupFile(req.file?.path);
    res.status(500).json({ error: 'OCR processing failed: ' + err.message });
  }
});

export default router;
