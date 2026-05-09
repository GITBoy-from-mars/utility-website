import { Router } from 'express';
import dns from 'dns';
const router = Router();
const resolve = (domain, type) => new Promise((res) => {
  dns.resolve(domain, type, (err, records) => res(err ? [] : records));
});
router.post('/lookup', async (req, res) => {
  try {
    const { domain } = req.body;
    if (!domain) return res.status(400).json({ error: 'Domain required' });
    const clean = domain.replace(/^https?:\/\//, '').replace(/\/.*$/, '').trim();
    const [A, AAAA, MX, CNAME, TXT, NS] = await Promise.all([
      resolve(clean, 'A'), resolve(clean, 'AAAA'), resolve(clean, 'MX'),
      resolve(clean, 'CNAME'), resolve(clean, 'TXT'), resolve(clean, 'NS'),
    ]);
    res.json({ A, AAAA, MX, CNAME, TXT: TXT.map(t => t.join('')), NS });
  } catch (err) { res.status(500).json({ error: err.message }); }
});
export default router;
