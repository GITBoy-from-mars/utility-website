import fs from 'fs';
import path from 'path';

export function startCleanupScheduler(uploadsDir, maxAgeMinutes = 10) {
  const intervalMs = 60 * 1000; // check every minute

  setInterval(() => {
    if (!fs.existsSync(uploadsDir)) return;
    const now = Date.now();
    const maxAge = maxAgeMinutes * 60 * 1000;

    try {
      const files = fs.readdirSync(uploadsDir);
      for (const file of files) {
        const filePath = path.join(uploadsDir, file);
        try {
          const stat = fs.statSync(filePath);
          if (now - stat.mtimeMs > maxAge) {
            fs.unlinkSync(filePath);
          }
        } catch (e) { /* ignore */ }
      }
    } catch (e) { /* ignore */ }
  }, intervalMs);

  console.log(`Cleanup scheduler active: files older than ${maxAgeMinutes}min will be deleted.`);
}

/* Helper to delete a specific file safely */
export function cleanupFile(filePath) {
  try { if (filePath && fs.existsSync(filePath)) fs.unlinkSync(filePath); } catch (e) { /* ignore */ }
}

export function cleanupFiles(filePaths) {
  (filePaths || []).forEach(cleanupFile);
}
