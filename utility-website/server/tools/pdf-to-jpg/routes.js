import { Router } from 'express';
import multer from 'multer';
import { readFile, writeFile, unlink, mkdir } from 'fs/promises';
import path from 'path';
import { getUploadsDir } from '../../middleware/upload.js';
import { v4 as uuid } from 'uuid';
import archiver from 'archiver';
import { createWriteStream } from 'fs';

const router = Router();
const upload = multer({ dest: getUploadsDir() });

router.post('/convert', upload.single('file'), async (req, res) => {
  const tmpDir = path.join(getUploadsDir(), uuid());
  try {
    const format = req.body.format || 'jpg';
    await mkdir(tmpDir, { recursive: true });
    
    // Use LibreOffice or pdftoppm if available, fallback to pdf-lib extraction
    const { execSync } = await import('child_process');
    const inputPath = req.file.path;
    
    try {
      // Try pdftoppm (poppler-utils) — best quality
      const ext = format === 'png' ? 'png' : 'jpeg';
      const prefix = path.join(tmpDir, 'page');
      execSync(`pdftoppm -${format === 'png' ? 'png' : 'jpeg'} -r 200 "${inputPath}" "${prefix}"`, { timeout: 60000 });
    } catch {
      try {
        // Fallback: use ImageMagick convert
        execSync(`magick convert -density 200 "${inputPath}" "${path.join(tmpDir, 'page-%03d.' + format)}"`, { timeout: 60000 });
      } catch {
        // Last fallback: just return the PDF
        return res.status(500).json({ error: 'PDF to image conversion requires poppler-utils or ImageMagick installed on the server.' });
      }
    }

    // Zip all images
    const zipPath = path.join(getUploadsDir(), `${uuid()}.zip`);
    const output = createWriteStream(zipPath);
    const archive = archiver('zip', { zlib: { level: 5 } });
    
    await new Promise((resolve, reject) => {
      output.on('close', resolve);
      archive.on('error', reject);
      archive.pipe(output);
      archive.directory(tmpDir, false);
      archive.finalize();
    });

    res.download(zipPath, `pages.zip`, async () => {
      unlink(zipPath).catch(() => {});
      unlink(req.file.path).catch(() => {});
      const { rmSync } = await import('fs');
      try { rmSync(tmpDir, { recursive: true }); } catch {}
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
    if (req.file) unlink(req.file.path).catch(() => {});
  }
});

export default router;
