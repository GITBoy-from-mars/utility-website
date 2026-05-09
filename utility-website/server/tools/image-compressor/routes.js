import { Router } from 'express';
import { upload } from '../../middleware/upload.js';
import { cleanupFile } from '../../middleware/cleanup.js';
import sharp from 'sharp';

const router = Router();

router.post('/compress', upload.single('file'), async (req, res) => {
  try {
    const quality = parseInt(req.body.quality) || 75;
    const meta = await sharp(req.file.path).metadata();
    let pipeline = sharp(req.file.path);
    if (['jpeg', 'jpg'].includes(meta.format)) { pipeline = pipeline.jpeg({ quality, mozjpeg: true }); }
    else if (meta.format === 'png') { pipeline = pipeline.png({ quality, compressionLevel: 9 }); }
    else if (meta.format === 'webp') { pipeline = pipeline.webp({ quality }); }
    else { pipeline = pipeline.jpeg({ quality, mozjpeg: true }); }

    const buffer = await pipeline.toBuffer();
    cleanupFile(req.file.path);
    res.set({ 'Content-Type': `image/${meta.format || 'jpeg'}`, 'Content-Disposition': `attachment; filename=compressed.${meta.format || 'jpg'}` });
    res.send(buffer);
  } catch (err) {
    cleanupFile(req.file?.path);
    res.status(500).json({ error: err.message });
  }
});

export default router;
