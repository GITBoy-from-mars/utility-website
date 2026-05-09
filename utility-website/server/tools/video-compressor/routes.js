import { Router } from 'express';
import { upload } from '../../middleware/upload.js';
import { cleanupFile } from '../../middleware/cleanup.js';
import { exec } from 'child_process';
import path from 'path';
import fs from 'fs';
import { v4 as uuid } from 'uuid';
import { getUploadsDir } from '../../middleware/upload.js';

const router = Router();

router.post('/compress', upload.single('file'), async (req, res) => {
  const { quality = 'medium' } = req.body;
  const crfMap = { low: '23', medium: '28', high: '35' };
  const crf = crfMap[quality] || '28';
  const outPath = path.join(getUploadsDir(), `${uuid()}.mp4`);

  try {
    await new Promise((resolve, reject) => {
      const cmd = `ffmpeg -i "${req.file.path}" -c:v libx264 -crf ${crf} -preset fast -c:a aac -b:a 128k -movflags +faststart -y "${outPath}"`;
      exec(cmd, { timeout: 300000 }, (err, stdout, stderr) => {
        if (err) reject(new Error('FFmpeg compression failed. Make sure FFmpeg is installed.'));
        else resolve();
      });
    });
    res.download(outPath, `compressed-video.mp4`, () => { cleanupFile(req.file.path); cleanupFile(outPath); });
  } catch (err) {
    cleanupFile(req.file?.path); cleanupFile(outPath);
    res.status(500).json({ error: err.message });
  }
});

export default router;
