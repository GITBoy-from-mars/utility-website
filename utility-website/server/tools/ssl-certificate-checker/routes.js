import { Router } from 'express';
import tls from 'tls';
const router = Router();
router.post('/check', async (req, res) => {
  try {
    const { domain } = req.body;
    if (!domain) return res.status(400).json({ error: 'Domain required' });
    const host = domain.replace(/^https?:\/\//, '').split('/')[0];
    const result = await new Promise((resolve, reject) => {
      const socket = tls.connect(443, host, { servername: host, timeout: 10000 }, () => {
        const cert = socket.getPeerCertificate();
        socket.destroy();
        if (!cert || !cert.valid_from) return resolve({ valid: false, issuer: 'Unknown' });
        const validFrom = new Date(cert.valid_from);
        const validTo = new Date(cert.valid_to);
        const now = new Date();
        const daysLeft = Math.ceil((validTo - now) / (1000 * 60 * 60 * 24));
        resolve({
          valid: now >= validFrom && now <= validTo,
          issuer: cert.issuer?.O || cert.issuer?.CN || 'Unknown',
          subject: cert.subject?.CN || host,
          validFrom: validFrom.toLocaleDateString(),
          validTo: validTo.toLocaleDateString(),
          daysLeft,
          serialNumber: cert.serialNumber,
        });
      });
      socket.on('error', err => reject(err));
      socket.setTimeout(10000, () => { socket.destroy(); reject(new Error('Timeout')); });
    });
    res.json(result);
  } catch (err) { res.status(500).json({ error: err.message }); }
});
export default router;
