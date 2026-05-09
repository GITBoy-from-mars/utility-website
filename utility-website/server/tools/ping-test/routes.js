import { Router } from 'express';
import dns from 'dns';
const router = Router();
router.post('/ping', async (req, res) => {
  const { host } = req.body;
  if (!host) return res.status(400).json({ error: 'Host required' });
  const clean = host.replace(/^https?:\/\//, '').replace(/\/.*$/, '').trim();
  const start = Date.now();
  try {
    await new Promise((resolve, reject) => {
      dns.lookup(clean, (err, address) => {
        if (err) reject(err); else resolve(address);
      });
    });
    const time = Date.now() - start;
    res.json({ host: clean, status: 'ok', time });
  } catch (err) {
    res.json({ host: clean, status: 'error', time: null, message: err.message });
  }
});
export default router;
