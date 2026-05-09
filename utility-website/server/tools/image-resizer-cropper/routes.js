import { Router } from 'express';
import { upload } from '../../middleware/upload.js';
import { cleanupFile } from '../../middleware/cleanup.js';
import sharp from 'sharp';

const router = Router();

router.post('/process', upload.single('file'), async (req, res) => {
  try {
    const w = parseInt(req.body.width);
    const h = parseInt(req.body.height);
    const mode = req.body.mode || 'resize';

    if (!w || !h || w < 1 || h < 1) {
      cleanupFile(req.file.path);
      return res.status(400).json({ error: 'Invalid width or height' });
    }

    let pipeline = sharp(req.file.path);

    if (mode === 'crop') {
      pipeline = pipeline.resize(w, h, { fit: 'cover', position: 'centre' });
    } else {
      pipeline = pipeline.resize(w, h, { fit: 'fill' });
    }

    const metadata = await sharp(req.file.path).metadata();
    const format = metadata.format || 'png';

    if (format === 'jpeg' || format === 'jpg') {
      pipeline = pipeline.jpeg({ quality: 95 });
    } else if (format === 'webp') {
      pipeline = pipeline.webp({ quality: 95 });
    } else {
      pipeline = pipeline.png();
    }

    const buffer = await pipeline.toBuffer();
    cleanupFile(req.file.path);
    
    const mimeMap = { jpeg: 'image/jpeg', jpg: 'image/jpeg', png: 'image/png', webp: 'image/webp', gif: 'image/gif', tiff: 'image/tiff' };
    res.set({
      'Content-Type': mimeMap[format] || 'image/png',
      'Content-Disposition': `attachment; filename=processed.${format === 'jpeg' ? 'jpg' : format}`,
    });
    res.send(buffer);
  } catch (err) {
    cleanupFile(req.file?.path);
    res.status(500).json({ error: 'Image processing failed: ' + err.message });
  }
});

export default router;
