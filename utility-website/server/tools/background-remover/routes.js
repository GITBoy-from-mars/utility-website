import { Router } from 'express';
import { upload } from '../../middleware/upload.js';
import { cleanupFile } from '../../middleware/cleanup.js';
import sharp from 'sharp';

const router = Router();

router.post('/remove', upload.single('file'), async (req, res) => {
  try {
    const { data, info } = await sharp(req.file.path)
      .ensureAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true });

    const pixels = new Uint8Array(data);
    const threshold = 220;
    const tolerance = 15;

    // Calculate average background color from corners
    const samplePixels = [];
    const w = info.width, h = info.height;
    const cornerSize = Math.min(20, Math.floor(w / 10), Math.floor(h / 10));
    
    for (let y = 0; y < cornerSize; y++) {
      for (let x = 0; x < cornerSize; x++) {
        const idx = (y * w + x) * 4;
        samplePixels.push([pixels[idx], pixels[idx + 1], pixels[idx + 2]]);
        const idx2 = (y * w + (w - 1 - x)) * 4;
        samplePixels.push([pixels[idx2], pixels[idx2 + 1], pixels[idx2 + 2]]);
      }
    }

    const avgBg = [0, 0, 0];
    for (const p of samplePixels) { avgBg[0] += p[0]; avgBg[1] += p[1]; avgBg[2] += p[2]; }
    avgBg[0] = Math.round(avgBg[0] / samplePixels.length);
    avgBg[1] = Math.round(avgBg[1] / samplePixels.length);
    avgBg[2] = Math.round(avgBg[2] / samplePixels.length);

    // Remove pixels similar to the detected background
    const bgTolerance = 35;
    for (let i = 0; i < pixels.length; i += 4) {
      const r = pixels[i], g = pixels[i + 1], b = pixels[i + 2];
      const dr = Math.abs(r - avgBg[0]);
      const dg = Math.abs(g - avgBg[1]);
      const db = Math.abs(b - avgBg[2]);
      
      if (dr < bgTolerance && dg < bgTolerance && db < bgTolerance) {
        // Smooth transition based on distance from bg color
        const dist = Math.sqrt(dr * dr + dg * dg + db * db);
        const maxDist = Math.sqrt(3 * bgTolerance * bgTolerance);
        const alpha = Math.min(255, Math.max(0, Math.round((dist / maxDist) * 255)));
        pixels[i + 3] = alpha;
      }
    }

    const buffer = await sharp(Buffer.from(pixels), {
      raw: { width: info.width, height: info.height, channels: 4 }
    }).png().toBuffer();

    cleanupFile(req.file.path);
    res.set({ 'Content-Type': 'image/png', 'Content-Disposition': 'attachment; filename=no-bg.png' });
    res.send(buffer);
  } catch (err) {
    cleanupFile(req.file?.path);
    res.status(500).json({ error: 'Background removal failed: ' + err.message });
  }
});

export default router;
