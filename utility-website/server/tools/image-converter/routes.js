import { Router } from 'express';
import { upload } from '../../middleware/upload.js';
import { cleanupFile } from '../../middleware/cleanup.js';
import sharp from 'sharp';

const router = Router();

router.post('/convert', upload.single('file'), async (req, res) => {
  try {
    const { format = 'png', quality = 90 } = req.body;
    const q = parseInt(quality);
    let pipeline = sharp(req.file.path);
    const opts = {};
    if (['jpg', 'jpeg'].includes(format)) { pipeline = pipeline.jpeg({ quality: q }); }
    else if (format === 'png') { pipeline = pipeline.png({ quality: q }); }
    else if (format === 'webp') { pipeline = pipeline.webp({ quality: q }); }
    else if (format === 'gif') { pipeline = pipeline.gif(); }
    else if (format === 'tiff') { pipeline = pipeline.tiff({ quality: q }); }
    else if (format === 'bmp') { pipeline = pipeline.png(); } // sharp doesn't directly support bmp output
    else { pipeline = pipeline.png(); }

    const buffer = await pipeline.toBuffer();
    cleanupFile(req.file.path);
    const mimeTypes = { png: 'image/png', jpg: 'image/jpeg', jpeg: 'image/jpeg', webp: 'image/webp', gif: 'image/gif', tiff: 'image/tiff', bmp: 'image/png' };
    res.set({ 'Content-Type': mimeTypes[format] || 'image/png', 'Content-Disposition': `attachment; filename=converted.${format}` });
    res.send(buffer);
  } catch (err) {
    cleanupFile(req.file?.path);
    res.status(500).json({ error: err.message });
  }
});

export default router;
