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
    
    const clean = domain
      .replace(/^https?:\/\//, '')
      .replace(/\/.*$/, '')
      .replace(/:\d+$/, '')
      .trim()
      .toLowerCase();
    
    if (!clean || clean.length < 3) {
      return res.status(400).json({ error: 'Invalid domain' });
    }

    const [A, AAAA, MX, CNAME, TXT, NS] = await Promise.all([
      resolve(clean, 'A'),
      resolve(clean, 'AAAA'),
      resolve(clean, 'MX'),
      resolve(clean, 'CNAME'),
      resolve(clean, 'TXT'),
      resolve(clean, 'NS'),
    ]);

    const result = {};
    if (A.length) result.A = A;
    if (AAAA.length) result.AAAA = AAAA;
    if (MX.length) result.MX = MX.map(m => typeof m === 'object' ? `${m.priority} ${m.exchange}` : m);
    if (CNAME.length) result.CNAME = CNAME;
    if (TXT.length) result.TXT = TXT.map(t => Array.isArray(t) ? t.join('') : t);
    if (NS.length) result.NS = NS;

    if (Object.keys(result).length === 0) {
      return res.status(404).json({ error: `No DNS records found for ${clean}` });
    }

    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
